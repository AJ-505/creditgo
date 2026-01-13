import { AssetCategoryInfo, Partner } from '../types';

// Nigerian Naira formatting
export const formatNaira = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// App Colors - Modern palette inspired by fintech apps
export const COLORS = {
  // Primary - Lime green (like the reference images)
  primary: '#c8ff00',
  primaryDark: '#a3d900',
  primaryLight: '#e5ff80',
  
  // Secondary - Dark navy
  secondary: '#1a1a2e',
  secondaryLight: '#2d2d44',
  
  // Accent - Blue/Purple gradient style
  accent: '#6366f1',
  accentLight: '#818cf8',
  
  // Neutrals
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#0f172a',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  
  // Status
  error: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
};

// Asset Categories - Compact data
export const ASSET_CATEGORIES: AssetCategoryInfo[] = [
  {
    id: 'devices',
    name: 'Devices',
    icon: 'laptop',
    description: 'Phones, laptops & gadgets',
    color: '#3b82f6',
  },
  {
    id: 'solar',
    name: 'Solar',
    icon: 'sun',
    description: 'Power solutions',
    color: '#f59e0b',
  },
  {
    id: 'rent',
    name: 'Rent',
    icon: 'home',
    description: 'Housing finance',
    color: '#8b5cf6',
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'graduation-cap',
    description: 'Tuition & courses',
    color: '#06b6d4',
  },
  {
    id: 'health',
    name: 'Health',
    icon: 'heart-pulse',
    description: 'Medical expenses',
    color: '#ec4899',
  },
  {
    id: 'business',
    name: 'Business',
    icon: 'briefcase',
    description: 'Working capital',
    color: '#10b981',
  },
];

// Potential partners/providers.
// Note: Terms, eligibility, and pricing vary by provider and can change.
export const PARTNERS: Partner[] = [
  // Devices & Tools
  {
    id: 'easybuy',
    name: 'Easybuy',
    logo: 'https://logo.clearbit.com/easybuy.com.ng',
    category: ['devices'],
    description: 'Get smartphones, laptops, and electronics on flexible payment plans. Pay in installments over 3-12 months.',
    website: 'https://easybuy.com.ng',
    rating: 4.5,
    minPayment: 15000,
    maxPayment: 200000,
  },
  {
    id: 'cdcare',
    name: 'CDcare',
    logo: 'https://logo.clearbit.com/cdcare.ng',
    category: ['devices'],
    description: 'Nigeria\'s leading device financing platform. Buy now, pay later for gadgets and appliances.',
    website: 'https://cdcare.ng',
    rating: 4.3,
    minPayment: 20000,
    maxPayment: 150000,
  },
  {
    id: 'keza',
    name: 'Keza Africa',
    logo: 'https://logo.clearbit.com/keza.africa',
    category: ['devices'],
    description: 'Finance phones and laptops with flexible repayment. Zero interest on select items.',
    website: 'https://keza.africa',
    rating: 4.4,
    minPayment: 10000,
    maxPayment: 100000,
  },
  {
    id: 'mkopa',
    name: 'M-KOPA',
    logo: 'https://logo.clearbit.com/m-kopa.com',
    category: ['solar', 'devices'],
    description: 'Pay-as-you-go financing for solar systems and smartphones. Africa\'s largest connected asset platform.',
    website: 'https://m-kopa.com',
    rating: 4.6,
    minPayment: 5000,
    maxPayment: 80000,
  },
  {
    id: 'credpal',
    name: 'CredPal',
    logo: 'https://logo.clearbit.com/credpal.com',
    category: ['devices'],
    description: 'Buy now, pay later across partner merchants. Flexible installment payments (subject to approval).',
    website: 'https://credpal.com',
    rating: 4.3,
    minPayment: 10000,
    maxPayment: 250000,
  },
  {
    id: 'payqart',
    name: 'PayQart',
    logo: 'https://logo.clearbit.com/payqart.com',
    category: ['devices'],
    description: 'Installment payments for gadgets and essentials through partner merchants (subject to eligibility).',
    website: 'https://payqart.com',
    rating: 4.1,
    minPayment: 8000,
    maxPayment: 200000,
  },
  // Solar & Power
  {
    id: 'sunking',
    name: 'Sun King',
    logo: 'https://logo.clearbit.com/sunking.com',
    category: ['solar'],
    description: 'Solar home systems with affordable payment plans. Light up your home with pay-as-you-go solar.',
    website: 'https://sunking.com',
    rating: 4.5,
    minPayment: 3000,
    maxPayment: 50000,
  },
  {
    id: 'lumos',
    name: 'Lumos',
    logo: 'https://logo.clearbit.com/lumos.com.ng',
    category: ['solar'],
    description: 'Solar home systems with pay-as-you-go style repayment (availability varies by location).',
    website: 'https://lumos.com.ng',
    rating: 4.2,
    minPayment: 5000,
    maxPayment: 120000,
  },
  {
    id: 'arnergy',
    name: 'Arnergy',
    logo: 'https://logo.clearbit.com/arnergy.com',
    category: ['solar'],
    description: 'Premium solar solutions for homes and businesses. Reliable power with smart financing.',
    website: 'https://arnergy.com',
    rating: 4.7,
    minPayment: 30000,
    maxPayment: 300000,
  },
  {
    id: 'auxano',
    name: 'Auxano Solar',
    logo: 'https://logo.clearbit.com/auxanosolar.com',
    category: ['solar'],
    description: 'Affordable solar power for Nigerian homes. Spread your payment over 12-24 months.',
    website: 'https://auxanosolar.com',
    rating: 4.2,
    minPayment: 15000,
    maxPayment: 150000,
  },
  {
    id: 'rubitec',
    name: 'Rubitec Solar',
    logo: 'https://logo.clearbit.com/rubitecsolar.com',
    category: ['solar'],
    description: 'Solar and inverter solutions for homes and small businesses. Financing may be available via partner plans.',
    website: 'https://rubitecsolar.com',
    rating: 4.1,
    minPayment: 20000,
    maxPayment: 250000,
  },
  // Rent & Housing
  {
    id: 'spleet',
    name: 'Spleet',
    logo: 'https://logo.clearbit.com/spleet.africa',
    category: ['rent'],
    description: 'Pay rent monthly instead of yearly. Find verified properties and flexible housing.',
    website: 'https://spleet.africa',
    rating: 4.4,
    minPayment: 50000,
    maxPayment: 500000,
  },
  {
    id: 'ule',
    name: 'Ule',
    logo: 'https://logo.clearbit.com/ule.ng',
    category: ['rent'],
    description: 'Rent now, pay later. Spread your rent payment over 12 months with low interest.',
    website: 'https://ule.ng',
    rating: 4.1,
    minPayment: 40000,
    maxPayment: 400000,
  },
  {
    id: 'muster',
    name: 'Muster',
    logo: 'https://logo.clearbit.com/muster.com.ng',
    category: ['rent'],
    description: 'Rent financing for Nigerian professionals. Get into your dream apartment today.',
    website: 'https://muster.com.ng',
    rating: 4.3,
    minPayment: 60000,
    maxPayment: 600000,
  },
  // Education
  {
    id: 'nelfund',
    name: 'NELFUND',
    logo: 'https://nelfund.gov.ng/assets/img/logo.png',
    category: ['education'],
    description: 'Nigerian Education Loan Fund. Government-backed student loans with low interest.',
    website: 'https://nelfund.gov.ng',
    rating: 4.0,
    minPayment: 0,
    maxPayment: 100000,
  },
  {
    id: 'edubanc',
    name: 'Edubanc',
    logo: 'https://logo.clearbit.com/edubanc.ng',
    category: ['education'],
    description: 'School fees financing for students and parents. Pay in installments.',
    website: 'https://edubanc.ng',
    rating: 4.2,
    minPayment: 25000,
    maxPayment: 200000,
  },
  {
    id: 'schoolable',
    name: 'Schoolable',
    logo: 'https://logo.clearbit.com/schoolable.co',
    category: ['education'],
    description: 'Education financing made simple. Pay school fees in monthly installments.',
    website: 'https://schoolable.co',
    rating: 4.3,
    minPayment: 20000,
    maxPayment: 250000,
  },
  {
    id: 'altschool',
    name: 'AltSchool Africa',
    logo: 'https://logo.clearbit.com/altschoolafrica.com',
    category: ['education'],
    description: 'Affordable digital skills programs. Flexible learning paths for software, product, and data.',
    website: 'https://altschoolafrica.com',
    rating: 4.5,
    minPayment: 15000,
    maxPayment: 150000,
  },
  {
    id: 'ulesson',
    name: 'uLesson',
    logo: 'https://logo.clearbit.com/ulesson.com',
    category: ['education'],
    description: 'Learning platform for students with low-cost subscription options for exam prep and core subjects.',
    website: 'https://ulesson.com',
    rating: 4.4,
    minPayment: 2000,
    maxPayment: 30000,
  },
  // Health
  {
    id: 'reliance-hmo',
    name: 'Reliance HMO',
    logo: 'https://logo.clearbit.com/reliancehmo.com',
    category: ['health'],
    description: 'Affordable health insurance with flexible payment plans. Quality healthcare for all.',
    website: 'https://reliancehmo.com',
    rating: 4.4,
    minPayment: 5000,
    maxPayment: 50000,
  },
  {
    id: 'hygeia',
    name: 'Hygeia HMO',
    logo: 'https://logo.clearbit.com/hygeiahmo.com',
    category: ['health'],
    description: 'Comprehensive health coverage with monthly payment options.',
    website: 'https://hygeiahmo.com',
    rating: 4.3,
    minPayment: 8000,
    maxPayment: 80000,
  },
  // Business
  {
    id: 'carbon',
    name: 'Carbon',
    logo: 'https://logo.clearbit.com/getcarbon.co',
    category: ['business'],
    description: 'Quick business and personal loans in minutes. No collateral required.',
    website: 'https://getcarbon.co',
    rating: 4.1,
    minPayment: 10000,
    maxPayment: 500000,
  },
  {
    id: 'fairmoney',
    name: 'FairMoney',
    logo: 'https://logo.clearbit.com/fairmoney.io',
    category: ['business'],
    description: 'Instant loans for entrepreneurs. Get funds in 5 minutes.',
    website: 'https://fairmoney.io',
    rating: 4.0,
    minPayment: 5000,
    maxPayment: 300000,
  },
  {
    id: 'lendha',
    name: 'Lendha',
    logo: 'https://logo.clearbit.com/lendha.com',
    category: ['business'],
    description: 'Working capital and asset financing for SMEs. Grow your business today.',
    website: 'https://lendha.com',
    rating: 4.2,
    minPayment: 50000,
    maxPayment: 1000000,
  },
];

// Paystack configuration
export const PAYSTACK_CONFIG = {
  // Demo public key - replace with real key in production
  publicKey: 'pk_test_xxxxxxxxxxxxxxxxxxxxx',
  currency: 'NGN',
  channels: ['card', 'bank', 'ussd', 'bank_transfer'],
};

// Verified Corporate Domains (Sample)
export const VERIFIED_CORPORATE_DOMAINS = [
  'mtn.ng', 'mtn.com', 'dangote.com', 'gtbank.com', 'gtco.com',
  'accessbankplc.com', 'zenithbank.com', 'firstbanknigeria.com',
  'ubagroup.com', 'sterlingbank.com', 'flutterwave.com', 'paystack.com',
  'interswitch.com', 'andela.com', 'microsoft.com', 'google.com',
  'amazon.com', 'meta.com', 'kpmg.com', 'pwc.com', 'ey.com',
  'deloitte.com', 'shell.com', 'totalenergies.com', 'chevron.com',
];

// Verified Freelance Platforms
export const VERIFIED_FREELANCE_PLATFORMS = [
  'linkedin.com', 'upwork.com', 'fiverr.com', 'toptal.com',
  'freelancer.com', 'guru.com', 'behance.net', 'dribbble.com',
  'github.com', 'medium.com',
];

// SMS Keywords for Income Detection
export const SMS_CREDIT_KEYWORDS = [
  'credit', 'credited', 'received', 'deposit',
  'payment received', 'salary', 'transfer from', 'inflow',
];

export const SMS_DEBIT_KEYWORDS = [
  'debit', 'debited', 'withdrawal', 'transfer to',
  'payment', 'purchase', 'pos', 'atm',
];

// Demo SMS Data - More comprehensive for better demo
export const DEMO_SMS_DATA = [
  // Current month - January 2026
  {
    body: 'Credit Alert! Your GTBank account 0123XXXXXX has been credited with NGN300,000.00. Ref: SALARY/JAN/2026. Balance: NGN485,000.00',
    date: new Date('2026-01-05T09:30:00'),
    address: 'GTBank',
  },
  {
    body: 'Debit Alert: NGN45,000.00 was debited from your account for RENT SAVINGS. Ref: AUTO-SAVE. Balance: NGN440,000.00',
    date: new Date('2026-01-06T10:00:00'),
    address: 'GTBank',
  },
  {
    body: 'Credit: Your Kuda account has been credited with NGN75,000.00 from UPWORK INC. Balance: NGN120,000.00',
    date: new Date('2026-01-08T14:22:00'),
    address: 'Kuda',
  },
  {
    body: 'You received NGN25,000.00 from FIVERR PAYMENT. Your new balance is NGN145,000.00',
    date: new Date('2026-01-09T11:45:00'),
    address: 'OPay',
  },
  {
    body: 'Debit: NGN15,000.00 POS purchase at SHOPRITE IKEJA. Balance: NGN425,000.00',
    date: new Date('2026-01-10T16:30:00'),
    address: 'GTBank',
  },
  // Previous month - December 2025
  {
    body: 'Credit Alert! Your account has been credited with NGN300,000.00. Ref: SALARY/DEC/2025. Balance: NGN520,000.00',
    date: new Date('2025-12-05T09:15:00'),
    address: 'GTBank',
  },
  {
    body: 'Credit: NGN50,000.00 from UPWORK FREELANCE PAYMENT. Balance: NGN180,000.00',
    date: new Date('2025-12-12T15:00:00'),
    address: 'Kuda',
  },
  {
    body: 'Debit: NGN80,000.00 transferred to RENT ACCOUNT. Balance: NGN440,000.00',
    date: new Date('2025-12-15T08:00:00'),
    address: 'GTBank',
  },
  {
    body: 'Credit: NGN35,000.00 from FIVERR. Balance: NGN115,000.00',
    date: new Date('2025-12-20T12:30:00'),
    address: 'OPay',
  },
  // November 2025
  {
    body: 'Credit Alert! NGN300,000.00 credited. Ref: SALARY/NOV/2025. Balance: NGN450,000.00',
    date: new Date('2025-11-05T09:00:00'),
    address: 'GTBank',
  },
  {
    body: 'Credit: NGN60,000.00 from UPWORK. Balance: NGN200,000.00',
    date: new Date('2025-11-15T14:00:00'),
    address: 'Kuda',
  },
];
