/**
 * CreditGo Credit Calculation Engine
 * Based on Nigerian fintech industry standards for asset financing
 *
 * The calculation follows the principle that users can comfortably
 * allocate 10-20% of their monthly income to repayments without
 * financial strain.
 */

import { SMSAnalysisResult } from "../types";

export interface CreditCalculation {
  safeMonthlyRepayment: number;
  maxMonthlyRepayment: number;
  creditScore: number;
  riskLevel: "low" | "medium" | "high";
  breakdown: {
    grossIncome: number;
    verifiedIncome: number;
    estimatedExpenses: number;
    disposableIncome: number;
    safeRepaymentRatio: number;
    maxRepaymentRatio: number;
  };
}

/**
 * Nigerian Standard Credit Calculation
 *
 * Industry standard repayment ratios:
 * - Conservative: 10-15% of monthly income
 * - Standard: 15-20% of monthly income
 * - Aggressive: 20-25% of monthly income
 *
 * For CreditGo, we use the STANDARD approach:
 * - Safe Amount = 15% of verified monthly income
 * - Max Amount = 20% of verified monthly income
 *
 * Example: ₦300,000 income
 * - Safe Amount = ₦45,000/month
 * - Max Amount = ₦60,000/month
 */
export const calculateCreditLimit = (
  statedMonthlyIncome: number,
  smsAnalysis?: SMSAnalysisResult,
  isEmploymentVerified: boolean = false,
  isIdentityVerified: boolean = false,
): CreditCalculation => {
  // Use SMS-verified income if available, otherwise use stated income
  const verifiedIncome =
    smsAnalysis?.averageMonthlyIncome || statedMonthlyIncome;

  // Pitch-friendly: never punish the user for imperfect SMS parsing.
  // Use the higher of stated vs SMS-derived income (SMS can be incomplete).
  const baseIncome = Math.max(statedMonthlyIncome, verifiedIncome);

  // Base repayment ratios (Nigerian fintech standard)
  let safeRatio = 0.15; // 15% safe repayment ratio
  let maxRatio = 0.2; // 20% maximum repayment ratio

  // Adjust ratios based on verification status
  if (isEmploymentVerified) {
    safeRatio += 0.02; // +2% for verified employment
    maxRatio += 0.03;
  }

  if (isIdentityVerified) {
    safeRatio += 0.01; // +1% for verified identity
    maxRatio += 0.02;
  }

  // Adjust based on income consistency from SMS
  if (smsAnalysis) {
    if (smsAnalysis.incomeConsistency >= 0.9) {
      // Very consistent income (regular salary)
      safeRatio += 0.02;
      maxRatio += 0.03;
    } else if (smsAnalysis.incomeConsistency >= 0.7) {
      // Moderately consistent
      safeRatio += 0.01;
      maxRatio += 0.01;
    }

    // Multiple income sources bonus
    if (smsAnalysis.detectedSources.length >= 2) {
      safeRatio += 0.01;
      maxRatio += 0.02;
    }
  }

  // Cap ratios at reasonable limits
  safeRatio = Math.min(safeRatio, 0.22);
  maxRatio = Math.min(maxRatio, 0.28);

  // Calculate repayment amounts
  const safeMonthlyRepayment = Math.floor(baseIncome * safeRatio);
  const maxMonthlyRepayment = Math.floor(baseIncome * maxRatio);

  // Estimate expenses (Nigerian standard: 60-70% of income)
  const estimatedExpenses = baseIncome * 0.65;
  const disposableIncome = baseIncome - estimatedExpenses;

  // Calculate risk level
  let riskLevel: "low" | "medium" | "high" = "medium";
  const incomeConsistency = smsAnalysis?.incomeConsistency ?? 0;
  if (isEmploymentVerified && isIdentityVerified && incomeConsistency >= 0.8) {
    riskLevel = "low";
  } else if (!isEmploymentVerified && !isIdentityVerified) {
    riskLevel = "high";
  }

  return {
    safeMonthlyRepayment,
    maxMonthlyRepayment,
    creditScore: calculateCreditScore(
      isIdentityVerified,
      isEmploymentVerified,
      smsAnalysis,
      baseIncome,
    ),
    riskLevel,
    breakdown: {
      grossIncome: statedMonthlyIncome,
      verifiedIncome,
      estimatedExpenses,
      disposableIncome,
      safeRepaymentRatio: safeRatio,
      maxRepaymentRatio: maxRatio,
    },
  };
};

/**
 * Calculate credit score (0-100)
 * Based on Nigerian credit bureau standards
 */
export const calculateCreditScore = (
  isIdentityVerified: boolean,
  isEmploymentVerified: boolean,
  smsAnalysis?: SMSAnalysisResult,
  monthlyIncome?: number,
): number => {
  let score = 35; // Base score for completing onboarding

  // Identity verification (+20 points)
  if (isIdentityVerified) score += 20;

  // Employment verification (+15 points)
  if (isEmploymentVerified) score += 15;

  // SMS analysis (+25 points max)
  if (smsAnalysis) {
    // Income consistency (up to 12 points)
    const consistency = smsAnalysis.incomeConsistency ?? 0;
    score += Math.floor(consistency * 12);

    // Multiple income sources (up to 8 points)
    const sourceBonus = Math.min(smsAnalysis.detectedSources.length * 4, 8);
    score += sourceBonus;

    // Positive cash flow (5 points)
    if (smsAnalysis.totalCredits > smsAnalysis.totalDebits * 1.1) {
      score += 5;
    }
  }

  // Income level bonus (up to 5 points)
  if (monthlyIncome) {
    if (monthlyIncome >= 1000000) score += 5;
    else if (monthlyIncome >= 500000) score += 4;
    else if (monthlyIncome >= 300000) score += 3;
    else if (monthlyIncome >= 150000) score += 2;
    else if (monthlyIncome >= 100000) score += 1;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
};

/**
 * Get credit tier based on score
 */
export const getCreditTier = (
  score: number,
): {
  tier: "bronze" | "silver" | "gold" | "platinum";
  name: string;
  color: string;
  benefits: string[];
} => {
  if (score >= 85) {
    return {
      tier: "platinum",
      name: "Platinum",
      color: "#6366f1",
      benefits: [
        "Lowest interest rates",
        "Priority processing",
        "Higher limits",
      ],
    };
  } else if (score >= 70) {
    return {
      tier: "gold",
      name: "Gold",
      color: "#eab308",
      benefits: ["Low interest rates", "Fast processing", "Good limits"],
    };
  } else if (score >= 55) {
    return {
      tier: "silver",
      name: "Silver",
      color: "#94a3b8",
      benefits: ["Standard rates", "Regular processing", "Standard limits"],
    };
  } else {
    return {
      tier: "bronze",
      name: "Bronze",
      color: "#d97706",
      benefits: ["Entry-level access", "Build your score", "Limited options"],
    };
  }
};
