"use client";
import { useState } from "react";
import { AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";

export function ConfirmActionModal({ action, onConfirm, onCancel, isLoading = false }) {
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);

  if (!action) return null;

  const handleConfirm = async () => {
    await onConfirm({ action, reason });
    setDone(true);
    setTimeout(() => { onCancel(); setDone(false); }, 1500);
  };

  const DANGER_ACTIONS = new Set([
    "Isolate Host","Disable User","Delete Email","Kill Process",
    "Quarantine File","Block Merchant","Lock Customer","Freeze Wallet",
    "Pause Orders","Disable API Key","Revoke Session","Block IP",
    "Block Domain"
  ]);

  const isDanger = DANGER_ACTIONS.has(action?.label);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}>
      <div className="bg-[#0f1117] border border-[#1e2235] rounded-2xl p-6 w-full max-w-md shadow-2xl">
        {done ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            <p className="text-white font-semibold">Action Executed</p>
            <p className="text-gray-500 text-sm text-center">Logged to audit trail</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start gap-3 mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDanger ? "bg-red-500/20 border border-red-500/30" : "bg-amber-500/20 border border-amber-500/30"}`}>
                <AlertTriangle className={`w-5 h-5 ${isDanger ? "text-red-400" : "text-amber-400"}`} />
              </div>
              <div>
                <h3 className="text-white font-bold text-base">Confirm: {action.label}</h3>
                <p className="text-gray-500 text-sm mt-0.5">{action.description || "This action will be logged to the audit trail."}</p>
              </div>
            </div>

            {/* Target info */}
            {action.target && (
              <div className="bg-[#1a1d2e] rounded-lg px-4 py-3 mb-4 border border-[#252840]">
                <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">Target</div>
                <div className="font-mono text-sm text-white">{action.target}</div>
              </div>
            )}

            {/* Danger warning */}
            {isDanger && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4 text-xs text-red-400">
                ⚠️ This is a high-impact action. It cannot be undone automatically.
              </div>
            )}

            {/* Reason field */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-widest">
                Reason / Justification {isDanger && <span className="text-red-400">*</span>}
              </label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Describe the reason for this action..."
                rows={3}
                className="w-full bg-[#0b0d14] border border-[#1e2235] rounded-lg px-3 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 resize-none transition-colors"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading || (isDanger && !reason.trim())}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDanger
                    ? "bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30"
                    : "bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30"
                }`}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Confirm & Execute
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
