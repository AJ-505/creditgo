# CreditGo 🇳🇬

**Bridging Nigeria's Credit Information & Behaviour Gap**

CreditGo is the "Intelligence Layer" for African credit. We are not a lender — we are a marketplace that connects invisible but capable borrowers to productive asset financing.

## 🎯 The Problem

In Nigeria, millions of mid-level professionals earn well (₦300k–₦1.5M/month), work hard, and contribute to the economy. Yet, they live one emergency away from financial crisis. They don't lack income; they lack access.

- **The Information Gap**: Most Nigerians don't know where to find financing for specific needs
- **The History Gap**: Financially active people have no formal credit record
- **The Behaviour Gap**: Borrowers default without guidance and support

## 💡 The Solution

CreditGo solves the information gap for users and the default risk for lenders through our **3-Step Engine**:

1. **Credit Capacity Assessment** - Discover your "Safe Amount" based on real income
2. **Need-Specific Discovery** - Connect to 20+ financing options for productive assets
3. **Behavioural Support** - SMS monitoring and repayment nudges

## 📱 Features (MVP)

### User App

- ✅ Identity Verification (NIN + Selfie)
- ✅ Employment Verification (Corporate Email / Freelance Profile)
- ✅ "Safe Amount" Algorithm
- ✅ Asset Marketplace (Devices, Solar, Rent, Education, Health, Business)
- ✅ Credit Score Dashboard
- ✅ One-click Applications

### Coming Soon

- 🔜 SMS Transaction Analysis
- 🔜 Save-to-Repay Wallet
- 🔜 Repayment Reminders
- 🔜 B2B Lender Dashboard

## 🛠 Tech Stack

- **Framework**: React Native + Expo SDK 54
- **Styling**: NativeWind (TailwindCSS for RN)
- **Navigation**: Expo Router v6
- **State Management**: Zustand with AsyncStorage persistence
- **Language**: TypeScript
- **Icons**: Lucide React Native

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Expo Go app on your phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Installation

```bash
# Clone the repository
git clone https://github.com/prosperisadev/creditgo.git
cd creditgo

# Install dependencies
pnpm install

# Start the development server
pnpm start
```

### Running on Device

1. Install the **Expo Go** app from your app store
2. Start the dev server with `pnpm start`
3. Scan the QR code with:
   - **Android**: Expo Go app
   - **iOS**: Camera app

### Running on Simulator/Emulator

```bash
# iOS (requires macOS + Xcode)
pnpm ios

# Android (requires Android Studio + Emulator)
pnpm android
```

## 📁 Project Structure

```
creditgo/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Main tab navigation
│   ├── onboarding/        # Onboarding flow
│   ├── asset/             # Asset detail pages
│   └── _layout.tsx        # Root layout
├── src/
│   ├── components/        # Reusable UI components
│   ├── constants/         # App constants & data
│   ├── hooks/             # Custom React hooks
│   ├── store/             # Zustand state management
│   ├── types/             # TypeScript definitions
│   └── utils/             # Utility functions
├── assets/                # Images and static files
└── app.json              # Expo configuration
```

## 🧮 The "Safe Amount" Algorithm

```typescript
// Core algorithm for calculating safe repayment limit
const calculateSafeAmount = (monthlyIncome: number) => {
  const estimatedExpenses = monthlyIncome * 0.5; // 50% expenses
  const disposableIncome = monthlyIncome - estimatedExpenses;
  const safetyBuffer = disposableIncome * 0.3; // 30% buffer
  return disposableIncome - safetyBuffer; // Safe Amount
};

// Example: ₦300,000 income → ₦105,000 safe monthly repayment
```

## 🤝 Partners

We connect users to trusted Nigerian fintech partners:

| Category  | Partners                               |
| --------- | -------------------------------------- |
| Devices   | Easybuy, CDcare, Keza Africa           |
| Solar     | M-KOPA, Sun King, Arnergy, Auxano      |
| Rent      | Spleet Africa, Ule Homes, Sofri Sofri  |
| Education | NELFUND, Edubanc, Edupoint             |
| Health    | MyItura                                |
| Business  | Sycamore, Carbon, Lendha, Salad Africa |

## 🧪 Demo Mode

The app includes a **Demo Mode** that simulates SMS transaction analysis. Toggle it on during onboarding to see the full experience without granting actual SMS permissions.

## 📄 License

This project is built for the [Hackathon Name] hackathon.

## 👥 Team

- **Product Lead**: Akeem Jr Odebiyi

---

<p align="center">
  <strong>Built with ❤️ for Nigeria's Missing Middle</strong>
</p>
