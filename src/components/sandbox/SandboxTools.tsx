// src/components/sandbox/SandboxTools.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Renders ONLY when IS_SANDBOX=true.  Import and drop anywhere.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { FlaskConical, Copy, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import {
  IS_SANDBOX,
  SANDBOX_BANKS,
  SUCCESS_BANKS,
  SANDBOX_UPI,
  RESULT_COLORS,
  type SandboxBank,
} from '../../config/sandbox';

// =============================================================================
// SANDBOX BANNER — thin top bar
// =============================================================================
export const SandboxBanner: React.FC = () => {
  if (!IS_SANDBOX) return null;
  return (
    <div className="w-full bg-amber-400 text-amber-900 text-center text-xs font-semibold py-1.5 px-4 flex items-center justify-center gap-2">
      <FlaskConical className="w-3.5 h-3.5" />
      SANDBOX MODE — Cashfree test environment active. No real money is transferred.
    </div>
  );
};

// =============================================================================
// COPY BUTTON
// =============================================================================
const CopyBtn: React.FC<{ value: string }> = ({ value }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      title="Copy"
      className="ml-1 text-gray-400 hover:text-gray-700 transition-colors"
    >
      {copied
        ? <CheckCircle className="w-3.5 h-3.5 text-green-500" />
        : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
};

// =============================================================================
// SANDBOX BANK PICKER — compact table with one-click copy + auto-fill
// =============================================================================
interface SandboxBankPickerProps {
  /** Called when user clicks "Use" on a bank row */
  onSelect?: (bank: SandboxBank) => void;
  /** Only show success banks (for add-bank form) */
  successOnly?: boolean;
}

export const SandboxBankPicker: React.FC<SandboxBankPickerProps> = ({
  onSelect,
  successOnly = false,
}) => {
  if (!IS_SANDBOX) return null;

  const [open, setOpen] = useState(false);
  const banks = successOnly ? SUCCESS_BANKS : SANDBOX_BANKS;

  return (
    <div className="rounded-xl border-2 border-amber-300 bg-amber-50 overflow-hidden mb-4">
      {/* Header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
      >
        <span className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4" />
          Sandbox — Official Cashfree Test Banks
        </span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {open && (
        <div className="overflow-x-auto border-t border-amber-200">
          <table className="w-full text-xs">
            <thead className="bg-amber-100 text-amber-700">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Bank</th>
                <th className="px-3 py-2 text-left font-semibold">Account No.</th>
                <th className="px-3 py-2 text-left font-semibold">IFSC</th>
                <th className="px-3 py-2 text-left font-semibold">Expected Result</th>
                {onSelect && <th className="px-3 py-2" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {banks.map((b, i) => {
                const color = RESULT_COLORS[b.result];
                return (
                  <tr key={i} className="hover:bg-amber-50 transition-colors">
                    <td className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap">{b.bank}</td>
                    <td className="px-3 py-2 font-mono text-gray-600 whitespace-nowrap">
                      {b.account}
                      <CopyBtn value={b.account} />
                    </td>
                    <td className="px-3 py-2 font-mono text-gray-600 whitespace-nowrap">
                      {b.ifsc}
                      <CopyBtn value={b.ifsc} />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color.bg} ${color.text}`}>
                        {color.label}
                      </span>
                      <span className="text-gray-400 ml-1">{b.note !== b.result ? b.note : ''}</span>
                    </td>
                    {onSelect && (
                      <td className="px-3 py-2">
                        <button
                          onClick={() => onSelect(b)}
                          className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-amber-900 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Use
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* UPI test numbers */}
          <div className="px-4 py-3 border-t border-amber-200 bg-amber-50">
            <p className="text-xs font-semibold text-amber-700 mb-2">Test UPI VPAs:</p>
            <div className="flex flex-wrap gap-3">
              {SANDBOX_UPI.map((u, i) => (
                <span key={i} className="flex items-center gap-1 font-mono text-xs text-gray-600">
                  <span className={`px-1.5 py-0.5 rounded ${RESULT_COLORS[u.result].bg} ${RESULT_COLORS[u.result].text} font-medium`}>
                    {u.result}
                  </span>
                  {u.vpa}
                  <CopyBtn value={u.vpa} />
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// SANDBOX PAYOUT NOTE — shown in WithdrawalForm
// =============================================================================
export const SandboxPayoutNote: React.FC = () => {
  if (!IS_SANDBOX) return null;
  return (
    <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 mb-4">
      <FlaskConical className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
      <div>
        <span className="font-semibold">Sandbox mode</span> — The withdrawal will be processed
        against Cashfree's test environment. Use the official test bank accounts above.
        No real money is moved. Transfer results (success / pending / failure) follow the
        expected column in the test bank table.
      </div>
    </div>
  );
};

// =============================================================================
// SANDBOX VERIFY NOTE — shown on bank account verify button
// =============================================================================
export const SandboxVerifyNote: React.FC = () => {
  if (!IS_SANDBOX) return null;
  return (
    <div className="flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 mt-2">
      <FlaskConical className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-600" />
      <span>
        <strong>Sandbox:</strong> Verification uses the local test table — no real API call.
        Only official Cashfree test account numbers will pass.
      </span>
    </div>
  );
};