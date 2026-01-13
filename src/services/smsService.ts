import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { SMSTransaction } from '../types';
import { SMS_CREDIT_KEYWORDS, SMS_DEBIT_KEYWORDS } from '../constants';

// Type for the SMS reading library
interface SmsMessage {
  _id: string;
  body: string;
  date: string;
  address: string;
  type: string;
}

interface SmsFilter {
  box: 'inbox' | 'sent' | 'draft';
  maxCount?: number;
  indexFrom?: number;
}

// Dynamically import the SMS library (only works on Android with dev build)
let SmsAndroid: {
  list: (
    filter: string,
    fail: (error: string) => void,
    success: (count: number, smsList: string) => void
  ) => void;
} | null = null;

// Try to import the SMS library - will fail gracefully in Expo Go
const loadSmsLibrary = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    console.log('SMS reading only available on Android');
    return false;
  }

  try {
    // Dynamic import to avoid crashes in Expo Go
    const module = await import('react-native-get-sms-android');
    SmsAndroid = module.default;
    return true;
  } catch (error) {
    console.log('SMS library not available (running in Expo Go?):', error);
    return false;
  }
};

/**
 * Request SMS permission on Android
 */
export const requestSmsPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return false;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      {
        title: 'SMS Permission Required',
        message:
          'CreditGo needs access to your SMS to analyze your bank transaction alerts and calculate your credit capacity. We ONLY read bank alerts - never personal messages.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'Allow',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('SMS permission error:', err);
    return false;
  }
};

/**
 * Check if SMS permission is granted
 */
export const hasSmsPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return false;
  }

  try {
    const result = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_SMS
    );
    return result;
  } catch (err) {
    console.warn('SMS permission check error:', err);
    return false;
  }
};

/**
 * Read SMS messages from the device
 */
export const readSmsMessages = async (
  maxCount: number = 100
): Promise<SmsMessage[]> => {
  // First, try to load the SMS library
  const libraryLoaded = await loadSmsLibrary();
  
  if (!libraryLoaded || !SmsAndroid) {
    console.log('SMS library not available');
    return [];
  }

  // Check permission
  const hasPermission = await hasSmsPermission();
  if (!hasPermission) {
    const granted = await requestSmsPermission();
    if (!granted) {
      Alert.alert(
        'Permission Denied',
        'Cannot read SMS without permission. Please enable SMS permission in settings.'
      );
      return [];
    }
  }

  return new Promise((resolve) => {
    const filter: SmsFilter = {
      box: 'inbox',
      maxCount: maxCount,
    };

    if (!SmsAndroid) {
      console.log('SmsAndroid is not loaded');
      resolve([]);
      return;
    }

    SmsAndroid.list(
      JSON.stringify(filter),
      (fail: string) => {
        console.log('Failed to read SMS:', fail);
        resolve([]);
      },
      (_count: number, smsList: string) => {
        try {
          const messages: SmsMessage[] = JSON.parse(smsList);
          resolve(messages);
        } catch (error) {
          console.log('Failed to parse SMS list:', error);
          resolve([]);
        }
      }
    );
  });
};

/**
 * Filter SMS to only bank transaction alerts
 */
export const filterBankAlerts = (messages: SmsMessage[]): SmsMessage[] => {
  const bankKeywords = [
    'credit',
    'debit',
    'credited',
    'debited',
    'transfer',
    'payment',
    'ngn',
    'balance',
    'alert',
    'transaction',
    'withdrawal',
    'deposit',
  ];

  // Common Nigerian bank sender IDs (real-world patterns vary widely)
  const bankSenders = [
    // Traditional banks
    'gtbank', 'gtb', 'gtbalert', 'gtworld',
    'zenith', 'zenithbank', 'zenithalert',
    'access', 'accessbank', 'accessalert',
    'firstbank', 'firstbankng', 'firstbankalert', 'first',
    'uba', 'ubabank',
    'sterling', 'sterlingbank',
    'fcmb',
    'fidelity', 'fidelitysms',
    'union', 'unionbank',
    'wema', 'wemabank',
    'polaris', 'polarisbank',
    'stanbic', 'stanbicibtc',
    'ecobank',
    'keystone', 'keystonebank',
    'heritage', 'heritagebank',
    'jaiz', 'jaizbank',
    'providus', 'providusbank',
    'suntrust', 'suntrustbank',
    'titan', 'titantrust',

    // Popular fintech / MMOs
    'opay', 'opayng',
    'palmpay',
    'moniepoint',
    'kuda',
    'carbon',
    'fairmoney',
  ];

  return messages.filter((sms) => {
    const body = sms.body.toLowerCase();
    const sender = sms.address.toLowerCase();

    // Check if sender looks like a bank (sender ID or contains 'bank')
    const isFromBank = bankSenders.some((bank) => sender.includes(bank)) || sender.includes('bank');

    // Check if message contains banking keywords
    const hasBankContent = bankKeywords.some((kw) => body.includes(kw));

    // Check if message contains an amount pattern
    const hasAmount = /ngn|₦|\bnaira\b|\bamt\b|\bamount\b|\d{1,3}(,\d{3})*(\.\d{2})?/i.test(body);

    return (isFromBank || hasBankContent) && hasAmount;
  });
};

/**
 * Parse bank SMS messages into transactions
 */
export const parseBankSmsToTransactions = (
  messages: SmsMessage[]
): SMSTransaction[] => {
  const transactions: SMSTransaction[] = [];

  for (const sms of messages) {
    const body = sms.body.toLowerCase();

    // Determine transaction type
    const isCredit = SMS_CREDIT_KEYWORDS.some((kw) => body.includes(kw));
    const isDebit = SMS_DEBIT_KEYWORDS.some((kw) => body.includes(kw));

    if (!isCredit && !isDebit) continue;

    // Extract amount
    const amountPatterns = [
      /NGN\s?([\d,]+\.?\d*)/i,
      /₦\s?([\d,]+\.?\d*)/i,
      /N\s?([\d,]+\.?\d*)/i,
      /([\d,]+\.?\d*)\s?naira/i,
      /amount[:\s]+([\d,]+\.?\d*)/i,
      /sum of[:\s]+([\d,]+\.?\d*)/i,
    ];

    let amount = 0;
    for (const pattern of amountPatterns) {
      const match = sms.body.match(pattern);
      if (match) {
        amount = parseFloat(match[1].replace(/,/g, ''));
        break;
      }
    }

    if (amount <= 0) continue;

    // Extract description/reference
    let description = 'Transaction';
    const refPatterns = [
      /ref[:\s]+([^\n.]+)/i,
      /reference[:\s]+([^\n.]+)/i,
      /desc[:\s]+([^\n.]+)/i,
      /from[:\s]+([^\n.]+)/i,
      /to[:\s]+([^\n.]+)/i,
    ];

    for (const pattern of refPatterns) {
      const match = sms.body.match(pattern);
      if (match) {
        description = match[1].trim().substring(0, 50);
        break;
      }
    }

    // Detect source
    let source: string | undefined;
    const sourceKeywords: Record<string, string> = {
      salary: 'Salary',
      fiverr: 'Fiverr',
      upwork: 'Upwork',
      paystack: 'Paystack',
      flutterwave: 'Flutterwave',
      paypal: 'PayPal',
      pos: 'POS',
      atm: 'ATM',
      transfer: 'Transfer',
    };

    for (const [keyword, sourceName] of Object.entries(sourceKeywords)) {
      if (body.includes(keyword)) {
        source = sourceName;
        break;
      }
    }

    transactions.push({
      id: `sms_${sms._id}_${Date.now()}`,
      type: isCredit ? 'credit' : 'debit',
      amount,
      description,
      date: new Date(parseInt(sms.date)),
      source,
    });
  }

  // Sort by date (newest first)
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

/**
 * Main function to read and analyze SMS transactions
 * This is the function to call from the app
 */
export const analyzeRealSms = async (): Promise<{
  success: boolean;
  transactions: SMSTransaction[];
  error?: string;
}> => {
  try {
    // Read SMS messages
    const allMessages = await readSmsMessages(200);

    if (allMessages.length === 0) {
      return {
        success: false,
        transactions: [],
        error:
          'Could not read SMS. Make sure you are using a development build (not Expo Go) and have granted SMS permission.',
      };
    }

    // Filter to bank alerts only
    const bankAlerts = filterBankAlerts(allMessages);
    console.log(`Found ${bankAlerts.length} bank alerts out of ${allMessages.length} messages`);

    // Parse to transactions
    const transactions = parseBankSmsToTransactions(bankAlerts);
    console.log(`Parsed ${transactions.length} transactions`);

    return {
      success: true,
      transactions,
    };
  } catch (error) {
    console.error('SMS analysis error:', error);
    return {
      success: false,
      transactions: [],
      error: error instanceof Error ? error.message : 'Unknown error reading SMS',
    };
  }
};

/**
 * Check if real SMS reading is available
 * (Only true in development builds, not Expo Go)
 */
export const isSmsReadingAvailable = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return false;
  }
  return await loadSmsLibrary();
};
