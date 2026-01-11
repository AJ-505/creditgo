// Re-export from partners file
export { 
  formatNaira,
  COLORS,
  ASSET_CATEGORIES,
  PARTNERS,
  PAYSTACK_CONFIG,
  VERIFIED_CORPORATE_DOMAINS,
  VERIFIED_FREELANCE_PLATFORMS,
  SMS_CREDIT_KEYWORDS,
  SMS_DEBIT_KEYWORDS,
  DEMO_SMS_DATA
} from './partners';

// Legacy exports for backward compatibility
import { PARTNERS } from './partners';
import { FinancingOption } from '../types';

// Map partners to financing options for components that still use them
export const FINANCING_OPTIONS: FinancingOption[] = PARTNERS.map(partner => ({
  id: partner.id,
  name: partner.name,
  description: partner.description,
  category: partner.category[0],
  provider: partner.name,
  totalPrice: (partner.maxPayment || 100000) * 6,
  monthlyPayment: partner.minPayment || 10000,
  duration: 6,
  interestRate: 0,
  imageUrl: partner.logo,
  isAffordable: true,
  features: ['Flexible payments', `From ₦${(partner.minPayment || 0).toLocaleString('en-NG')}/mo`],
}));
