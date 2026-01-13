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
 * Email validation result interface
 */
export interface EmailValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Validate email format (client-side, deterministic)
 * This is a proper email validation that:
 * - Accepts standard formats like name@company.com, name.surname@company.co.uk
 * - Rejects missing @, missing domain, whitespace-only inputs
 * - Does NOT require network calls
 * - Is deterministic and fast
 */
export const validateEmailFormat = (email: string): EmailValidationResult => {
  // Trim whitespace
  const trimmed = email.trim();
  
  // Check for empty or whitespace-only input
  if (!trimmed) {
    return { isValid: false, error: null }; // Empty is not an error, just not valid
  }
  
  // Check for whitespace in the email (not allowed)
  if (/\s/.test(trimmed)) {
    return { isValid: false, error: 'Email address cannot contain spaces' };
  }
  
  // Check for @ symbol
  if (!trimmed.includes('@')) {
    return { isValid: false, error: 'Please include an "@" in the email address' };
  }
  
  // Split by @ and validate parts
  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Email address should contain only one "@" symbol' };
  }
  
  const [localPart, domain] = parts;
  
  // Check local part (before @)
  if (!localPart || localPart.length === 0) {
    return { isValid: false, error: 'Please enter text before the "@" symbol' };
  }
  
  // Check domain (after @)
  if (!domain || domain.length === 0) {
    return { isValid: false, error: 'Please enter a domain after the "@" symbol' };
  }
  
  // Check domain has at least one dot and valid TLD
  if (!domain.includes('.')) {
    return { isValid: false, error: 'Please enter a complete domain (e.g., company.com)' };
  }
  
  // Check domain doesn't start or end with dot
  if (domain.startsWith('.') || domain.endsWith('.')) {
    return { isValid: false, error: 'Domain cannot start or end with a dot' };
  }
  
  // Check for consecutive dots in domain
  if (domain.includes('..')) {
    return { isValid: false, error: 'Domain cannot contain consecutive dots' };
  }
  
  // Final regex check for overall format validity
  // This regex accepts standard email formats
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Check if an email is a free/personal email provider
 * This is informational only - we don't block free providers
 */
export const isFreeEmailProvider = (email: string): boolean => {
  const freeProviders = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com',
    'aol.com', 'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com',
    'yandex.com', 'gmx.com', 'inbox.com'
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  return freeProviders.includes(domain);
};

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

  // Calculate average monthly income based on the observed date range.
  // This avoids severe underestimation when we have >2 months of SMS data.
  const timestamps = transactions
    .map(t => (t.date instanceof Date ? t.date.getTime() : new Date(t.date as any).getTime()))
    .filter((ts) => Number.isFinite(ts));

  const minTs = timestamps.length ? Math.min(...timestamps) : Date.now();
  const maxTs = timestamps.length ? Math.max(...timestamps) : Date.now();
  const days = Math.max(1, Math.ceil((maxTs - minTs) / (1000 * 60 * 60 * 24)));
  const monthsObserved = Math.max(1, Math.ceil(days / 30));
  const averageMonthlyIncome = monthsObserved > 0 ? totalCredits / monthsObserved : totalCredits;
  
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
 * Nigerian Fintech Standard (based on Carbon, FairMoney, PalmCredit):
 * - Base safe repayment = 15% of monthly income
 * - With verification bonuses: up to 22% of monthly income
 * - Example: ₦300,000 income = ₦45,000-66,000 safe repayment
 * 
 * This is more generous than banks (typically 30-40% debt-to-income)
 * because fintech serves underbanked populations with different needs.
 */
export const calculateSafeAmount = (
  monthlyIncome: number,
  smsAnalysis?: SMSAnalysisResult,
  isIdentityVerified: boolean = false,
  isEmploymentVerified: boolean = false,
  monthlyExpenses?: number
): { safeAmount: number; maxAmount: number; breakdown: { income: number; expenses: number; disposable: number; ratio: number } } => {
  // Use SMS analysis if available, otherwise use stated income
  const verifiedIncome = smsAnalysis?.averageMonthlyIncome || monthlyIncome;
  
  // Take the more conservative of the two (unless stated is much higher and verified is low)
  const baseIncome = Math.min(monthlyIncome, Math.max(verifiedIncome, monthlyIncome * 0.8));
  
  // Base ratio: 15% (Nigerian fintech standard for underbanked)
  let repaymentRatio = 0.15;
  
  // Verification bonuses (up to +7%)
  if (isIdentityVerified) repaymentRatio += 0.02; // +2% for NIN verified
  if (isEmploymentVerified) repaymentRatio += 0.03; // +3% for employment verified
  
  // Income consistency bonus from SMS (up to +2%)
  const consistency = smsAnalysis?.incomeConsistency ?? 0;
  if (consistency >= 0.9) {
    repaymentRatio += 0.02; // Very consistent (regular salary)
  } else if (consistency >= 0.7) {
    repaymentRatio += 0.01; // Moderately consistent
  }
  
  // Multiple income streams bonus (+1%)
  if (smsAnalysis && smsAnalysis.detectedSources.length >= 2) {
    repaymentRatio += 0.01;
  }
  
  // Cap at 22% (reasonable maximum)
  repaymentRatio = Math.min(repaymentRatio, 0.22);
  
  // Estimate or use provided expenses
  // Nigerian urban standard: 55-65% of income on necessities
  const estimatedExpenses = monthlyExpenses || (baseIncome * 0.60);
  const disposableIncome = baseIncome - estimatedExpenses;
  
  // Calculate safe monthly repayment
  const safeAmount = Math.floor(baseIncome * repaymentRatio);
  
  // Max amount is the higher of: ratio-based OR 50% of disposable income
  const maxFromDisposable = Math.floor(disposableIncome * 0.5);
  const maxAmount = Math.max(safeAmount, Math.min(maxFromDisposable, baseIncome * 0.25));
  
  return {
    safeAmount: Math.max(0, safeAmount),
    maxAmount: Math.max(0, maxAmount),
    breakdown: {
      income: baseIncome,
      expenses: estimatedExpenses,
      disposable: disposableIncome,
      ratio: repaymentRatio,
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
      description: 'Identity verification completed',
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
  smsAnalysis?: SMSAnalysisResult,
  monthlyExpenses?: number
): FinancialProfile => {
  const { safeAmount, maxAmount, breakdown } = calculateSafeAmount(
    monthlyIncome, 
    smsAnalysis,
    isIdentityVerified,
    isEmploymentVerified,
    monthlyExpenses
  );
  const creditScore = calculateCreditScore(isIdentityVerified, isEmploymentVerified, smsAnalysis, monthlyIncome);
  const badges = generateBadges(isIdentityVerified, isEmploymentVerified, employmentType, smsAnalysis);
  
  return {
    totalIncome: breakdown.income,
    estimatedExpenses: breakdown.expenses,
    disposableIncome: breakdown.disposable,
    safeMonthlyRepayment: safeAmount,
    maxMonthlyRepayment: maxAmount,
    repaymentRatio: breakdown.ratio,
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
