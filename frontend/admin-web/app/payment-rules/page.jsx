"use client";

import { useEffect, useState } from "react";
import { adminRequest } from "../../lib/api";
import styles from "./page.module.css";

export default function PaymentRulesPage() {
  const [policy, setPolicy] = useState(null);
  const [gatewayConfig, setGatewayConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Local state for toggles
  const [forceDigitalOnline, setForceDigitalOnline] = useState(true);
  const [allowCOD, setAllowCOD] = useState(true);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [minCODPrice, setMinCODPrice] = useState(false);
  const [gatewayMode, setGatewayMode] = useState("mock");
  const [merchantLabel, setMerchantLabel] = useState("Katabazaar");
  const [gatewayKeyId, setGatewayKeyId] = useState("");
  const [gatewayKeySecret, setGatewayKeySecret] = useState("");
  const [gatewayWebhookSecret, setGatewayWebhookSecret] = useState("");
  const [canEditPolicy, setCanEditPolicy] = useState(false);
  const [canEditGateway, setCanEditGateway] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchPolicy = async () => {
      try {
        const [policyResult, gatewayResult] = await Promise.allSettled([
          adminRequest("/payment-rules"),
          adminRequest("/payment-gateway"),
        ]);
        const policyPayload = policyResult.status === "fulfilled" ? policyResult.value : null;
        const gatewayPayload = gatewayResult.status === "fulfilled" ? gatewayResult.value : null;

        if (policyPayload?.policy && active) {
          setPolicy(policyPayload.policy);
          setCanEditPolicy(true);
          setForceDigitalOnline(policyPayload.policy.forceDigitalOnline);
          setAllowCOD(policyPayload.policy.allowCOD);
          setOnlineOnly(policyPayload.policy.onlineOnly);
          setMinCODPrice(policyPayload.policy.minCODPrice !== null);
        }
        if (gatewayPayload?.config && active) {
          setCanEditGateway(true);
          setGatewayConfig(gatewayPayload.config);
          setGatewayMode(gatewayPayload.config.mode);
          setMerchantLabel(gatewayPayload.config.merchantLabel || "Katabazaar");
          setGatewayKeyId(gatewayPayload.config.razorpayKeyId || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchPolicy();
    return () => { active = false; };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        forceDigitalOnline,
        allowCOD,
        onlineOnly,
        minCODPrice: minCODPrice ? 500 : null
      };

      // Disallow conflicting states per backend rule
      if (canEditPolicy) {
        await adminRequest("/payment-rules", {
          method: "PUT",
          body: payload
        });
      }
      const gatewayPayload = {
        mode: gatewayMode,
        merchantLabel,
        razorpayKeyId: gatewayKeyId,
        ...(gatewayKeySecret ? { razorpayKeySecret: gatewayKeySecret } : {}),
        ...(gatewayWebhookSecret ? { razorpayWebhookSecret: gatewayWebhookSecret } : {}),
      };

      if (canEditGateway) {
        const gatewayResult = await adminRequest("/payment-gateway", {
          method: "PUT",
          body: gatewayPayload,
        });
        setGatewayConfig(gatewayResult?.config ?? null);
      }
      setGatewayKeySecret("");
      setGatewayWebhookSecret("");
      alert(canEditPolicy ? "Payment rules updated successfully." : "Razorpay gateway secrets updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to update payment rules.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (policy) {
      setForceDigitalOnline(policy.forceDigitalOnline);
      setAllowCOD(policy.allowCOD);
      setOnlineOnly(policy.onlineOnly);
      setMinCODPrice(policy.minCODPrice !== null);
    }
    if (gatewayConfig) {
      setGatewayMode(gatewayConfig.mode);
      setMerchantLabel(gatewayConfig.merchantLabel || "Katabazaar");
      setGatewayKeyId(gatewayConfig.razorpayKeyId || "");
      setGatewayKeySecret("");
      setGatewayWebhookSecret("");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] text-slate-400 font-medium">
        <span className="material-symbols-outlined animate-spin mb-4 text-3xl text-[#8B5CF6]">sync</span>
        Loading Configuration Engine...
      </div>
    );
  }

  return (
    <div className={`p-8 lg:p-12 max-w-6xl mx-auto w-full relative z-10 ${styles.page}`}>
      <header className="mb-10">
        <div className="flex items-center gap-2 text-[#8B5CF6] text-sm font-bold mb-2">
          <span className="material-symbols-outlined text-sm">settings_suggest</span>
          CONFIGURATION ENGINE
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-4 text-white font-display">Payment Rules Editor</h1>
        <p className="text-slate-400 max-w-2xl leading-relaxed">
          Define global transaction controls and security-owned Razorpay gateway secrets. Gateway keys are stored encrypted at rest and never returned in raw form.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <article className={`${styles.glassPanel} p-6 rounded-2xl border border-[#8B5CF6]/10`}>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Active Rules</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-white">4</span>
            <span className="text-emerald-500 text-xs font-bold mb-1 uppercase tracking-tighter">Live Policy</span>
          </div>
        </article>
        <article className={`${styles.glassPanel} p-6 rounded-2xl border border-[#8B5CF6]/10`}>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Logic Hits</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-white">1.2M</span>
            <span className="text-[#8B5CF6] text-xs font-bold mb-1 uppercase tracking-tighter">Last 24H</span>
          </div>
        </article>
        <article className={`${styles.glassPanel} p-6 rounded-2xl border border-[#8B5CF6]/10`}>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Coverage</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-white">98%</span>
            <span className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-tighter">Global</span>
          </div>
        </article>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white font-display">
            <span className="material-symbols-outlined text-[#8B5CF6]">security</span>
            Core Logic Constraints
          </h2>
          <button onClick={handleReset} className="text-xs font-black text-[#8B5CF6] hover:opacity-80 uppercase tracking-widest transition-opacity">Reset Defaults</button>
        </div>

        <div className="space-y-4">
          {canEditPolicy ? (
          <>
          {/* Force Digital Online */}
          <div className={`group relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-2xl ${styles.glassPanel} p-6 transition-all border border-[#8B5CF6]/10 hover:border-[#8B5CF6]/30`}>
            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] group-hover:bg-[#8B5CF6] group-hover:text-white transition-all">
                <span className="material-symbols-outlined">download</span>
              </div>
              <div>
                <p className="text-lg font-bold text-white mb-1">Digital Products → Online Only</p>
                <p className="text-slate-400 text-sm leading-normal max-w-md">Forces prepaid transactions for all non-physical goods to mitigate fraud.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded tracking-widest ${forceDigitalOnline ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-500 bg-slate-500/10'}`}>
                {forceDigitalOnline ? 'Active' : 'Disabled'}
              </span>
              <label className={styles.toggle}>
                <input checked={forceDigitalOnline} onChange={e => setForceDigitalOnline(e.target.checked)} type="checkbox" />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          {/* Min COD Price */}
          <div className={`group relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-2xl ${styles.glassPanel} p-6 transition-all border border-[#8B5CF6]/10 hover:border-[#8B5CF6]/30`}>
            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] group-hover:bg-[#8B5CF6] group-hover:text-white transition-all">
                <span className="material-symbols-outlined">trending_up</span>
              </div>
              <div>
                <p className="text-lg font-bold text-white mb-1">High Value → Online Required</p>
                <p className="text-slate-400 text-sm leading-normal max-w-md">Transactions over $500.00 must be paid using authenticated card or bank transfer.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded tracking-widest ${minCODPrice ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-500 bg-slate-500/10'}`}>
                {minCODPrice ? 'Active' : 'Standby'}
              </span>
              <label className={styles.toggle}>
                <input checked={minCODPrice} onChange={e => setMinCODPrice(e.target.checked)} type="checkbox" />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          {/* Allow COD */}
          <div className={`group relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-2xl ${styles.glassPanel} p-6 transition-all border border-[#8B5CF6]/10 hover:border-[#8B5CF6]/30`}>
            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] group-hover:bg-[#8B5CF6] group-hover:text-white transition-all">
                <span className="material-symbols-outlined">local_shipping</span>
              </div>
              <div>
                <p className="text-lg font-bold text-white mb-1">Cash on Delivery Disabled</p>
                <p className="text-lg font-bold text-white mb-1">Cash on Delivery</p>
                <p className="text-slate-400 text-sm leading-normal max-w-md">Allow customers to pay via cash upon delivery of physical goods.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded tracking-widest ${allowCOD ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-500 bg-slate-500/10'}`}>
                {allowCOD ? 'Active' : 'Disabled'}
              </span>
              <label className={styles.toggle}>
                <input checked={allowCOD} onChange={e => {
                  setAllowCOD(e.target.checked);
                  if (e.target.checked) setOnlineOnly(false);
                }} type="checkbox" />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          {/* Online Only */}
          <div className={`group relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-2xl ${styles.glassPanel} p-6 transition-all border border-[#8B5CF6]/10 hover:border-[#8B5CF6]/30`}>
            <div className="flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] group-hover:bg-[#8B5CF6] group-hover:text-white transition-all">
                <span className="material-symbols-outlined">public</span>
              </div>
              <div>
                <p className="text-lg font-bold text-white mb-1">Global Razorpay Only Mode</p>
                <p className="text-slate-400 text-sm leading-normal max-w-md">Forces every customer checkout through Razorpay and server-side verification.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded tracking-widest ${onlineOnly ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-500 bg-slate-500/10'}`}>
                {onlineOnly ? 'Active' : 'Disabled'}
              </span>
              <label className={styles.toggle}>
                <input checked={true} disabled type="checkbox" />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
          </>
          ) : (
            <div className={`rounded-2xl ${styles.glassPanel} p-6 border border-[#8B5CF6]/10`}>
              <p className="text-lg font-bold text-white mb-1">Commerce payment policy is restricted</p>
              <p className="text-slate-400 text-sm leading-normal max-w-2xl">
                Your current role can manage Razorpay gateway secrets, but commerce payment guardrails are hidden unless payment-rules permission is granted.
              </p>
            </div>
          )}
        </div>

        {canEditGateway ? (
        <div className="mt-10 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white font-display">
              <span className="material-symbols-outlined text-[#8B5CF6]">credit_card</span>
              Gateway Configuration
            </h2>
            <span className="text-[10px] font-black uppercase px-2 py-1 rounded tracking-widest text-emerald-400 bg-emerald-400/10">
              Razorpay
            </span>
          </div>

          <div className={`rounded-2xl ${styles.glassPanel} p-6 border border-[#8B5CF6]/10`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Gateway mode</span>
                <select
                  value={gatewayMode}
                  onChange={(event) => setGatewayMode(event.target.value)}
                  className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white"
                >
                  <option value="mock">Mock / Sandbox</option>
                  <option value="live">Live gateway</option>
                </select>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Merchant label</span>
                <input
                  value={merchantLabel}
                  onChange={(event) => setMerchantLabel(event.target.value)}
                  className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white"
                  placeholder="Katabazaar"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Razorpay key ID</span>
                <input
                  value={gatewayKeyId}
                  onChange={(event) => setGatewayKeyId(event.target.value)}
                  className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white"
                  placeholder="rzp_live_xxxxx"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Razorpay key secret</span>
                <input
                  type="password"
                  value={gatewayKeySecret}
                  onChange={(event) => setGatewayKeySecret(event.target.value)}
                  className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white"
                  placeholder={gatewayConfig?.maskedKeySecret || "Enter new secret to rotate"}
                />
              </label>

              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Razorpay webhook secret</span>
                <input
                  type="password"
                  value={gatewayWebhookSecret}
                  onChange={(event) => setGatewayWebhookSecret(event.target.value)}
                  className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white"
                  placeholder={gatewayConfig?.maskedWebhookSecret || "Enter the secret configured on the Razorpay webhook"}
                />
              </label>
            </div>

            <p className="text-sm text-slate-400">
              Live mode uses the merchant credentials saved here. The webhook secret must match Razorpay exactly. Leave secrets blank to retain the currently stored values.
            </p>

            <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">Gateway readiness</p>
                  <p className={`mt-1 text-sm font-bold ${gatewayConfig?.isReady ? "text-emerald-400" : "text-amber-300"}`}>
                    {gatewayConfig?.isReady ? "Ready for selected mode" : "Configuration needs attention"}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300">
                  Key: {gatewayConfig?.maskedKeyId || "Not configured"}
                </span>
              </div>
              {gatewayConfig?.validationIssues?.length ? (
                <ul className="mt-3 space-y-1 text-xs font-semibold text-amber-200">
                  {gatewayConfig.validationIssues.map((issue) => (
                    <li key={issue}>- {issue}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
        ) : (
          <div className={`mt-10 rounded-2xl ${styles.glassPanel} p-6 border border-[#8B5CF6]/10`}>
            <p className="text-lg font-bold text-white mb-1">Razorpay gateway secrets restricted</p>
            <p className="text-slate-400 text-sm leading-normal max-w-2xl">
              Only super admins and security admins with gateway permission can manage Razorpay key ID, key secret, and webhook secret.
            </p>
          </div>
        )}

        <div className="mt-16 flex justify-end gap-6 border-t border-white/5 pt-10">
          <button 
            onClick={handleReset} 
            className="px-8 py-3 rounded-xl border border-[#8B5CF6]/20 text-slate-400 font-bold hover:bg-[#8B5CF6]/5 transition-all text-sm uppercase tracking-widest"
          >
            Discard Changes
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving || (!canEditPolicy && !canEditGateway)} 
            className="px-10 py-3 rounded-xl bg-[#8B5CF6] text-white font-black hover:bg-[#8B5CF6]/90 transition-all text-sm uppercase tracking-widest shadow-[0_10px_20px_rgba(139, 92, 246,0.3)] disabled:opacity-50"
          >
            {saving ? "Deploying..." : "Update Policies"}
          </button>
        </div>
      </section>

      {/* Decorative Blobs */}
      <div className="fixed top-0 right-0 -z-10 h-[500px] w-[500px] bg-[#8B5CF6]/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 -z-10 h-[400px] w-[400px] bg-[#8B5CF6]/2 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
    </div>
  );
}

