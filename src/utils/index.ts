import { 
  VERIFIED_CORPORATE_DOMAINS, 
  VERIFIED_FREELANCE_PLATFORMS,
  SMS_CREDIT_KEYWORDS,
  SMS_DEBIT_KEYWORDS,
  DEMO_SMS_DATA,
  formatNaira,
} from '../constants';
import { SMSTransaction, SMSAnalysisResult, FinancialProfile, CreditBadge } from '../types';

/**
 * Validate Nigerian National Identification Number (NIN)
 * NIN is exactly 11 digits
 */
export const validateNIN = (nin: string): boolean => {
  const cleaned = nin.replace(/\D/g, '');
  return cleaned.length === 11;
};

/**
 * Format NIN for display (XXX-XXXX-XXXX)
 */
export const formatNIN = (nin: string): string => {
  const cleaned = nin.replace(/\D/g, '');
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
};

/**
 * Validate work email against verified corporate domains
 */
export const validateCorporateEmail = (email: string): { isValid: boolean; company: string | null } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, company: null };
  }
  
  const domain = email.split('@')[1].toLowerCase();
  const isVerified = VERIFIED_CORPORATE_DOMAINS.some(
    (d) => domain === d || domain.endsWith(`.${d}`)
  );
  
  if (isVerified) {
    // Extract company name from domain
    const company = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
    return { isValid: true, company };
  }
  
  return { isValid: false, company: null };
};

/**
 * Validate freelance profile link
 */
export const validateFreelanceLink = (url: string): { isValid: boolean; platform: string | null } => {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const hostname = urlObj.hostname.toLowerCase().replace('www.', '');
    
    const matchedPlatform = VERIFIED_FREELANCE_PLATFORMS.find(
      (p) => hostname === p || hostname.endsWith(`.${p}`)
    );
    
    if (matchedPlatform) {
      const platform = matchedPlatform.split('.')[0].charAt(0).toUpperCase() + 
                       matchedPlatform.split('.')[0].slice(1);
      return { isValid: true, platform };
    }
    
    return { isValid: false, platform: null };
  } catch {
    return { isValid: false, platform: null };
  }
};

/**
 * Parse SMS messages to extract transactions
 */
export const parseSMSTransactions = (messages: Array<{ body: string; date: Date }>): SMSTransaction[] => {
  const transactions: SMSTransaction[] = [];
  
  for (const msg of messages) {
    const body = msg.body.toLowerCase();
    
    // Check if it's a credit
    const isCredit = SMS_CREDIT_KEYWORDS.some(kw => body.includes(kw));
    const isDebit = SMS_DEBIT_KEYWORDS.some(kw => body.includes(kw));
    
    if (!isCredit && !isDebit) continue;
    
    // Extract amount using regex
    const amountMatch = msg.body.match(/NGN\s?([\d,]+\.?\d*)|N\s?([\d,]+\.?\d*)|([\d,]+\.?\d*)\s?naira/i);
    if (!amountMatch) continue;
    
    const amountStr = (amountMatch[1] || amountMatch[2] || amountMatch[3]).replace(/,/g, '');
    const amount = parseFloat(amountStr);
    
    if (isNaN(amount) || amount <= 0) continue;
    
    // Try to extract description
    let description = 'Transaction';
    const refMatch = msg.body.match(/Ref:\s*([^.]+)/i);
    if (refMatch) {
      description = refMatch[1].trim();
    }
    
    // Detect source
    let source: string | undefined;
    if (body.includes('salary')) source = 'Salary';
    else if (body.includes('fiverr')) source = 'Fiverr';
    else if (body.includes('upwork')) source = 'Upwork';
    else if (body.includes('paystack')) source = 'Paystack';
    else if (body.includes('pos')) source = 'POS';
    else if (body.includes('atm')) source = 'ATM';
    
    transactions.push({
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: isCredit ? 'credit' : 'debit',
      amount,
      description,
      date: msg.date,
      source,
    });
  }
  
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

/**
 * Analyze SMS transactions to get financial summary
 */
export const analyzeSMSTransactions = (transactions: SMSTransaction[]): SMSAnalysisResult => {
  const credits = transactions.filter(t => t.type === 'credit');
  const debits = transactions.filter(t => t.type === 'debit');
  
  const totalCredits = credits.reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = debits.reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate average monthly income (assuming 2 months of data in demo)
  const averageMonthlyIncome = totalCredits / 2;
  
  // Check income consistency (regular salary = high consistency)
  const salaryCredits = credits.filter(t => t.source === 'Salary');
  const incomeConsistency = salaryCredits.length >= 2 ? 0.9 : 0.6;
  
  // Detect sources
  const detectedSources = [...new Set(credits.map(t => t.source).filter(Boolean) as string[])];
  
  return {
    totalCredits,
    totalDebits,
    averageMonthlyIncome,
    incomeConsistency,
    detectedSources,
    transactions,
  };
};

/**
 * Calculate the "Safe Amount" - the maximum monthly repayment a user can afford
 * This is the core algorithm of CreditGo
 * 
 * Nigerian Fintech Standard:
 * - Safe repayment = 15-20% of monthly income
 * - Example: ₦300,000 income = ₦45,000-60,000 safe repayment
 */
export const calculateSafeAmount = (
  monthlyIncome: number,
  smsAnalysis?: SMSAnalysisResult
): { safeAmount: number; breakdown: { income: number; expenses: number; buffer: number } } => {
  // Use SMS analysis if available, otherwise use stated income
  const verifiedIncome = smsAnalysis?.averageMonthlyIncome || monthlyIncome;
  
  // Take the more conservative of the two
  const baseIncome = Math.min(monthlyIncome, verifiedIncome);
  
  // Nigerian standard: Safe repayment is 15-18% of income
  // This matches how platforms like Carbon, FairMoney, and PalmCredit operate
  let repaymentRatio = 0.15; // Base 15%
  
  // Boost ratio if income is consistent (from SMS)
  const consistency = smsAnalysis?.incomeConsistency ?? 0;
  if (consistency >= 0.8) {
    repaymentRatio = 0.18; // 18% for consistent income
  }
  
  // Calculate safe monthly repayment
  const safeAmount = Math.floor(baseIncome * repaymentRatio);
  
  // Estimate expenses at 65% of income (Nigerian urban standard)
  const estimatedExpenses = baseIncome * 0.65;
  
  return {
    safeAmount: Math.max(0, safeAmount),
    breakdown: {
      income: baseIncome,
      expenses: estimatedExpenses,
      buffer: baseIncome * (1 - repaymentRatio - 0.65),
    },
  };
};

/**
 * Calculate credit score (0-100)
 * Higher is better
 */
export const calculateCreditScore = (
  isIdentityVerified: boolean,
  isEmploymentVerified: boolean,
  smsAnalysis?: SMSAnalysisResult,
  monthlyIncome?: number
): number => {
  let score = 30; // Base score
  
  // Identity verification (+20)
  if (isIdentityVerified) score += 20;
  
  // Employment verification (+15)
  if (isEmploymentVerified) score += 15;
  
  // SMS analysis (+35 max)
  if (smsAnalysis) {
    // Income consistency
    score += Math.floor(smsAnalysis.incomeConsistency * 20);
    
    // Multiple income sources
    if (smsAnalysis.detectedSources.length > 1) score += 10;
    
    // Positive cash flow
    if (smsAnalysis.totalCredits > smsAnalysis.totalDebits) score += 5;
  }
  
  // Income level bonus (up to 10 points)
  if (monthlyIncome) {
    if (monthlyIncome >= 1000000) score += 10;
    else if (monthlyIncome >= 500000) score += 7;
    else if (monthlyIncome >= 300000) score += 5;
    else if (monthlyIncome >= 150000) score += 3;
  }
  
  return Math.min(100, Math.max(0, score));
};

/**
 * Generate credit badges based on user profile
 */
export const generateBadges = (
  isIdentityVerified: boolean,
  isEmploymentVerified: boolean,
  employmentType: string | null,
  smsAnalysis?: SMSAnalysisResult
): CreditBadge[] => {
  const badges: CreditBadge[] = [];
  const now = new Date();
  
  if (isIdentityVerified) {
    badges.push({
      id: 'identity_verified',
      name: 'Identity Verified',
      description: 'NIN verified with biometric match',
      icon: 'shield-check',
      earnedAt: now,
    });
  }
  
  if (isEmploymentVerified) {
    if (employmentType === 'salaried') {
      badges.push({
        id: 'employed',
        name: 'Employed Professional',
        description: 'Verified corporate email',
        icon: 'building',
        earnedAt: now,
      });
    } else if (employmentType === 'freelancer') {
      badges.push({
        id: 'freelancer',
        name: 'Freelancer Verified',
        description: 'Professional profile confirmed',
        icon: 'user-check',
        earnedAt: now,
      });
    }
  }
  
  if (smsAnalysis) {
    if (smsAnalysis.incomeConsistency >= 0.8) {
      badges.push({
        id: 'consistent_income',
        name: 'Consistent Income',
        description: 'Regular income pattern detected',
        icon: 'trending-up',
        earnedAt: now,
      });
    }
    
    if (smsAnalysis.totalCredits > smsAnalysis.totalDebits) {
      badges.push({
        id: 'positive_cashflow',
        name: 'Cash Flow Positive',
        description: 'Healthy financial balance',
        icon: 'wallet',
        earnedAt: now,
      });
    }
    
    if (smsAnalysis.detectedSources.length > 1) {
      badges.push({
        id: 'multiple_income',
        name: 'Multiple Income Streams',
        description: 'Diversified income sources',
        icon: 'coins',
        earnedAt: now,
      });
    }
  }
  
  return badges;
};

/**
 * Build complete financial profile
 */
export const buildFinancialProfile = (
  monthlyIncome: number,
  isIdentityVerified: boolean,
  isEmploymentVerified: boolean,
  employmentType: string | null,
  smsAnalysis?: SMSAnalysisResult
): FinancialProfile => {
  const { safeAmount, breakdown } = calculateSafeAmount(monthlyIncome, smsAnalysis);
  const creditScore = calculateCreditScore(isIdentityVerified, isEmploymentVerified, smsAnalysis, monthlyIncome);
  const badges = generateBadges(isIdentityVerified, isEmploymentVerified, employmentType, smsAnalysis);
  
  return {
    totalIncome: breakdown.income,
    estimatedExpenses: breakdown.expenses,
    disposableIncome: breakdown.income - breakdown.expenses,
    safeMonthlyRepayment: safeAmount,
    creditScore,
    badges,
  };
};

/**
 * Get demo SMS data for hackathon demonstration
 */
export const getDemoSMSData = () => {
  return DEMO_SMS_DATA;
};

/**
 * Simulate biometric verification delay
 */
export const simulateBiometricVerification = (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2000);
  });
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export { formatNaira };
