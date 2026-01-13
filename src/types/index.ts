// User Types
export interface ExpenseBreakdown {
  rent: number;
  utilities: number;
  internet: number;
  transport: number;
  food: number;
  other: number;
}

export interface User {
  id: string;
  nin?: string;
  phoneNumber?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  employmentType: 'salaried' | 'freelancer' | 'business' | null;
  workEmail?: string;
  businessName?: string;
  professionalProfileLink?: string;
  monthlyIncome: number;
  monthlyExpenses?: number;
  expenseBreakdown?: ExpenseBreakdown;
  payDate?: number;
  isIdentityVerified: boolean;
  isEmploymentVerified: boolean;
  selfieUri?: string;
  createdAt: Date;
}

export interface VerificationStatus {
  identity: boolean;
  employment: boolean;
  income: boolean;
  smsPermission: boolean;
}

// Financial Types
export interface FinancialProfile {
  totalIncome: number;
  estimatedExpenses: number;
  disposableIncome: number;
  safeMonthlyRepayment: number;
  maxMonthlyRepayment: number;
  repaymentRatio: number;
  creditScore: number;
  badges: CreditBadge[];
}

export interface CreditBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

// Marketplace Types
export interface FinancingOption {
  id: string;
  name: string;
  description: string;
  category: AssetCategory;
  provider: string;
  providerLogo?: string;
  totalPrice: number;
  monthlyPayment: number;
  duration: number; // months
  interestRate: number;
  imageUrl?: string;
  isAffordable: boolean;
  features: string[];
}

export type AssetCategory = 
  | 'devices'
  | 'solar'
  | 'rent'
  | 'education'
  | 'health'
  | 'business';

export interface AssetCategoryInfo {
  id: AssetCategory;
  name: string;
  icon: string;
  description: string;
  color: string;
}

// SMS Analysis Types
export interface SMSTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: Date;
  source?: string;
  category?: string;
}

export interface SMSAnalysisResult {
  totalCredits: number;
  totalDebits: number;
  averageMonthlyIncome: number;
  incomeConsistency: number;
  detectedSources: string[];
  transactions: SMSTransaction[];
}

// Application Types
export interface LoanApplication {
  id: string;
  userId: string;
  assetId: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  appliedAt: Date;
  creditScore: number;
  safeAmount: number;
}

// Savings Types
export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  partnerId?: string;
  assetId?: string;
  createdAt: Date;
}

export interface SavingsTransaction {
  id: string;
  goalId: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  reference: string;
  status: 'pending' | 'successful' | 'failed';
  createdAt: Date;
}

// Onboarding Types
export type OnboardingStep = 
  | 'welcome'
  | 'privacy'
  | 'nin_input'
  | 'selfie'
  | 'employment_type'
  | 'employment_verify'
  | 'income_input'
  | 'sms_permission'
  | 'complete';

// Partner/Lender Types
export interface Partner {
  id: string;
  name: string;
  logo: string;
  category: AssetCategory[];
  description: string;
  website: string;
  rating?: number;
  minPayment?: number;
  maxPayment?: number;
}

// Lead Types (For B2B Dashboard)
export interface Lead {
  id: string;
  userName: string;
  assetRequested: string;
  creditScore: number;
  safeAmount: number;
  status: 'verified' | 'pending' | 'rejected';
  verifications: {
    identity: boolean;
    employment: boolean;
    cashFlow: boolean;
  };
  appliedAt: Date;
}
