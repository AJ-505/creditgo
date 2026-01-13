declare module "react-native-get-sms-android" {
  interface SmsFilter {
    box?: "inbox" | "sent" | "draft" | "outbox" | "failed" | "queued" | "";
    minDate?: number;
    maxDate?: number;
    bodyRegex?: string;
    indexFrom?: number;
    maxCount?: number;
    address?: string;
    read?: 0 | 1;
    _id?: number;
    thread_id?: number;
  }

  interface SmsMessage {
    _id: number;
    thread_id: number;
    address: string;
    person: number | null;
    date: number;
    date_sent: number;
    protocol: number;
    read: number;
    status: number;
    type: number;
    body: string;
    service_center: string | null;
  }

  interface SmsAndroidStatic {
    list(
      filter: string,
      fail: (error: string) => void,
      success: (count: number, smsList: string) => void,
    ): void;
  }

  const SmsAndroid: SmsAndroidStatic;
  export default SmsAndroid;
}
