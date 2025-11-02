// Paystack bank codes for mobile money providers in Ghana
export const MOBILE_MONEY_CODES: Record<string, string> = {
  MOMO: "MTN", // MTN Mobile Money
  AIRTELTIGO: "ATL", // AirtelTigo Money
  TELECEL: "VOD", // Telecel Cash (formerly Vodafone Cash)
};

export interface ResolveAccountResponse {
  status: boolean;
  message: string;
  data: {
    account_number: string;
    account_name: string;
    bank_id: number;
  };
}

export async function verifyMobileMoneyAccount(
  accountNumber: string,
  provider: string
): Promise<{ success: boolean; accountName?: string; error?: string }> {
  const bankCode = MOBILE_MONEY_CODES[provider];

  if (!bankCode) {
    return {
      success: false,
      error: "Invalid mobile money provider",
    };
  }

  try {
    const response = await fetch(
      "https://api.paystack.co/bank/resolve?" +
        new URLSearchParams({
          account_number: accountNumber,
          bank_code: bankCode,
        }),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result: ResolveAccountResponse = await response.json();

    if (result.status && result.data) {
      return {
        success: true,
        accountName: result.data.account_name,
      };
    } else {
      return {
        success: false,
        error: result.message || "Unable to verify mobile money account number",
      };
    }
  } catch (error: any) {
    console.error("Paystack verification error:", error);
    return {
      success: false,
      error: error.message || "Failed to verify mobile money account",
    };
  }
}
