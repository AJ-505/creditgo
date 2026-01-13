import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useShallow } from "zustand/shallow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  User,
  FinancialProfile,
  OnboardingStep,
  VerificationStatus,
  LoanApplication,
  SMSTransaction,
  SavingsTransaction,
} from "../types";

// Savings state interface
interface SavingsState {
  balance: number;
  transactions: SavingsTransaction[];
  monthlyGoal: number;
}

interface AppState {
  // User State
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;

  // Onboarding State
  onboardingStep: OnboardingStep;
  setOnboardingStep: (step: OnboardingStep) => void;
  isOnboardingComplete: boolean;
  completeOnboarding: () => void;

  // Verification State
  verificationStatus: VerificationStatus;
  updateVerificationStatus: (updates: Partial<VerificationStatus>) => void;

  // Financial State
  financialProfile: FinancialProfile | null;
  setFinancialProfile: (profile: FinancialProfile | null) => void;

  // SMS/Transaction Data
  transactions: SMSTransaction[];
  setTransactions: (transactions: SMSTransaction[]) => void;

  // Applications
  applications: LoanApplication[];
  addApplication: (application: LoanApplication) => void;

  // Savings State (persisted)
  savings: SavingsState;
  addSavingsDeposit: (amount: number, reference: string) => void;
  setSavingsGoal: (monthlyGoal: number) => void;

  // Reset
  resetState: () => void;
}

const initialUser: User = {
  id: "",
  employmentType: null,
  monthlyIncome: 0,
  isIdentityVerified: false,
  isEmploymentVerified: false,
  createdAt: new Date(),
};

const initialVerificationStatus: VerificationStatus = {
  identity: false,
  employment: false,
  income: false,
  smsPermission: false,
};

const initialSavings: SavingsState = {
  balance: 0,
  transactions: [],
  monthlyGoal: 0,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, ...updates }
            : { ...initialUser, ...updates },
        })),

      // Onboarding
      onboardingStep: "welcome",
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      isOnboardingComplete: false,
      completeOnboarding: () =>
        set({ isOnboardingComplete: true, onboardingStep: "complete" }),

      // Verification
      verificationStatus: initialVerificationStatus,
      updateVerificationStatus: (updates) =>
        set((state) => ({
          verificationStatus: { ...state.verificationStatus, ...updates },
        })),

      // Financial
      financialProfile: null,
      setFinancialProfile: (profile) => set({ financialProfile: profile }),

      // Transactions
      transactions: [],
      setTransactions: (transactions) => set({ transactions }),

      // Applications
      applications: [],
      addApplication: (application) =>
        set((state) => ({
          applications: [...state.applications, application],
        })),

      // Savings (persisted)
      savings: initialSavings,
      addSavingsDeposit: (amount: number, reference: string) =>
        set((state) => {
          const newTransaction: SavingsTransaction = {
            id: `sav_${Date.now()}`,
            goalId: "default",
            amount,
            type: "deposit",
            reference,
            status: "successful",
            createdAt: new Date(),
          };
          return {
            savings: {
              ...state.savings,
              balance: state.savings.balance + amount,
              transactions: [newTransaction, ...state.savings.transactions],
            },
          };
        }),
      setSavingsGoal: (monthlyGoal: number) =>
        set((state) => ({
          savings: { ...state.savings, monthlyGoal },
        })),

      // Reset
      resetState: () =>
        set({
          user: null,
          onboardingStep: "welcome",
          isOnboardingComplete: false,
          verificationStatus: initialVerificationStatus,
          financialProfile: null,
          transactions: [],
          applications: [],
          savings: initialSavings,
        }),
    }),
    {
      name: "creditgo-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isOnboardingComplete: state.isOnboardingComplete,
        verificationStatus: state.verificationStatus,
        financialProfile: state.financialProfile,
        applications: state.applications,
        savings: state.savings,
      }),
    },
  ),
);

// Selector hooks for better performance
export const useUser = () => useAppStore((state) => state.user);
export const useOnboarding = () =>
  useAppStore(
    useShallow((state) => ({
      step: state.onboardingStep,
      setStep: state.setOnboardingStep,
      isComplete: state.isOnboardingComplete,
      complete: state.completeOnboarding,
    })),
  );
export const useFinancialProfile = () =>
  useAppStore((state) => state.financialProfile);
export const useVerificationStatus = () =>
  useAppStore((state) => state.verificationStatus);
export const useSavings = () =>
  useAppStore(
    useShallow((state) => ({
      balance: state.savings.balance,
      transactions: state.savings.transactions,
      monthlyGoal: state.savings.monthlyGoal,
      addDeposit: state.addSavingsDeposit,
      setGoal: state.setSavingsGoal,
    })),
  );
