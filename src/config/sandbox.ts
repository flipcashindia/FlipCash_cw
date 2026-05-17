// src/config/sandbox.ts
// ─────────────────────────────────────────────────────────────────────────────
// Cashfree Sandbox test data — mirrors backend sandbox_config.py
// Only active when VITE_CASHFREE_SANDBOX=true (set in .env.local)
// ─────────────────────────────────────────────────────────────────────────────

export const IS_SANDBOX = import.meta.env.VITE_CASHFREE_SANDBOX === 'true';

// =============================================================================
// TEST BANK ACCOUNTS
// =============================================================================
export interface SandboxBank {
  account:  string;
  ifsc:     string;
  bank:     string;
  result:   'success' | 'failure' | 'pending' | 'reversed' | 'timeout';
  note:     string;
}

export const SANDBOX_BANKS: SandboxBank[] = [
  // ── SUCCESS ──────────────────────────────────────────────────────────────
  { account: '026291800001191', ifsc: 'YESB0000262', bank: 'YES Bank',         result: 'success',  note: 'Success' },
  { account: '00011020001772',  ifsc: 'HDFC0000001', bank: 'HDFC Bank',        result: 'success',  note: 'Success' },
  { account: '1233943142',      ifsc: 'ICIC0000009', bank: 'ICICI Bank',       result: 'success',  note: 'Success' },
  { account: '000890289871772', ifsc: 'SCBL0036078', bank: 'Standard Chartered',result: 'success', note: 'Success' },
  { account: '000100289877623', ifsc: 'SBIN0008752', bank: 'SBI',              result: 'success',  note: 'Success' },
  // ── FAILURE ──────────────────────────────────────────────────────────────
  { account: '026291800001190', ifsc: 'YESB0000262', bank: 'YES Bank',         result: 'failure',  note: 'Failure – Invalid Account' },
  { account: '234005000876',    ifsc: 'ICIC0000007', bank: 'ICICI Bank',       result: 'failure',  note: 'Failure – Invalid Account' },
  { account: '1234567890',      ifsc: 'ICIC0000001', bank: 'ICICI Bank',       result: 'failure',  note: 'Failure – Invalid IFSC' },
  // ── PENDING ──────────────────────────────────────────────────────────────
  { account: '007711000031',    ifsc: 'HDFC0000077', bank: 'HDFC Bank',        result: 'pending',  note: 'Pending' },
  { account: '00224412311300',  ifsc: 'YESB0000001', bank: 'YES Bank',         result: 'pending',  note: 'Pending → Success' },
  // ── REVERSED ─────────────────────────────────────────────────────────────
  { account: '7766671735000',   ifsc: 'SBIN0000004', bank: 'SBI',              result: 'reversed', note: 'Success → Reversed' },
];

export const SUCCESS_BANKS = SANDBOX_BANKS.filter(b => b.result === 'success');
export const DEFAULT_BANK  = SANDBOX_BANKS[0];  // YES Bank success

// =============================================================================
// TEST UPI
// =============================================================================
export interface SandboxUPI {
  vpa:    string;
  result: 'success' | 'failure';
  note:   string;
}
export const SANDBOX_UPI: SandboxUPI[] = [
  { vpa: 'success@upi', result: 'success', note: 'Successful UPI transfer' },
  { vpa: 'failure@upi', result: 'failure', note: 'Failed UPI transfer' },
];

// =============================================================================
// RESULT BADGE CONFIG
// =============================================================================
export const RESULT_COLORS: Record<SandboxBank['result'], { bg: string; text: string; label: string }> = {
  success:  { bg: 'bg-green-100',  text: 'text-green-700',  label: '✅ Success'  },
  failure:  { bg: 'bg-red-100',    text: 'text-red-700',    label: '❌ Failure'  },
  pending:  { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '⏳ Pending'  },
  reversed: { bg: 'bg-orange-100', text: 'text-orange-700', label: '↩️ Reversed' },
  timeout:  { bg: 'bg-gray-100',   text: 'text-gray-700',   label: '⏱️ Timeout'  },
};