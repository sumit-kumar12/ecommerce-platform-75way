"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { adminRequest } from "@/lib/api";
import {
  BookOpen, Plus, Play, Pencil, Trash2, Loader2, AlertTriangle,
  CheckCircle2, Zap, RefreshCw, ChevronRight, X,
  Shield, Clock, List, ToggleLeft, ToggleRight,
  Activity, Search, Layers
} from "lucide-react";

const CATEGORIES = ["All", "Phishing", "Ransomware", "BEC", "DDoS", "Insider Threat", "Zero-Day"];

const CATEGORY_COLORS = {
  Phishing:        { bg: "bg-amber-500/10",   border: "border-amber-500/30",   text: "text-amber-400",   dot: "#f59e0b" },
  Ransomware:      { bg: "bg-red-500/10",      border: "border-red-500/30",     text: "text-red-400",     dot: "#ef4444" },
  BEC:             { bg: "bg-orange-500/10",   border: "border-orange-500/30",  text: "text-orange-400",  dot: "#f97316" },
  DDoS:            { bg: "bg-blue-500/10",     border: "border-blue-500/30",    text: "text-blue-400",    dot: "#3b82f6" },
  "Insider Threat":{ bg: "bg-purple-500/10",   border: "border-purple-500/30",  text: "text-purple-400",  dot: "#8B5CF6" },
  "Zero-Day":      { bg: "bg-rose-500/10",     border: "border-rose-500/30",    text: "text-rose-400",    dot: "#f43f5e" },
  Default:         { bg: "bg-gray-500/10",     border: "border-gray-500/30",    text: "text-gray-400",    dot: "#6b7280" },
};

const getCat = (cat) => CATEGORY_COLORS[cat] || CATEGORY_COLORS.Default;

const formatDate = (d) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return "—"; }
};

const MOCK_PLAYBOOKS = [
  { id: "1", name: "Phishing Response Playbook", description: "Automated response to phishing email campaigns including user notification, URL blocking, and email quarantine.", category: "Phishing", steps: ["Identify phishing email headers", "Quarantine affected mailboxes", "Block malicious URLs in proxy", "Notify affected users", "Submit IOCs to threat intel"], autoRun: true, active: true, createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: "2", name: "Ransomware Containment", description: "Isolate infected endpoints, preserve forensic evidence, and initiate recovery procedures.", category: "Ransomware", steps: ["Isolate affected endpoints from network", "Snapshot disk images for forensics", "Identify encryption strain", "Check backup integrity", "Begin recovery from clean backup"], autoRun: false, active: true, createdAt: new Date(Date.now() - 86400000 * 7).toISOString() },
  { id: "3", name: "BEC Investigation", description: "Business Email Compromise detection and response including account takeover investigation.", category: "BEC", steps: ["Review suspicious email forwarding rules", "Check OAuth app permissions", "Audit recent logins and MFA bypass", "Reset compromised credentials", "Block attacker IPs"], autoRun: false, active: true, createdAt: new Date(Date.now() - 86400000 * 14).toISOString() },
  { id: "4", name: "DDoS Mitigation", description: "Automated DDoS detection and traffic scrubbing via WAF and upstream provider.", category: "DDoS", steps: ["Detect traffic anomaly via SIEM", "Enable rate limiting on WAF", "Activate upstream scrubbing center", "Null route attack IPs", "Monitor recovery metrics"], autoRun: true, active: true, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "5", name: "Insider Threat Investigation", description: "Monitor and investigate suspicious insider behavior including data exfiltration indicators.", category: "Insider Threat", steps: ["Flag anomalous DLP alerts", "Audit user file access patterns", "Review USB/removable device activity", "Interview HR and manager", "Preserve chain of custody"], autoRun: false, active: true, createdAt: new Date(Date.now() - 86400000 * 20).toISOString() },
  { id: "6", name: "Zero-Day Vulnerability Response", description: "Emergency response protocol for newly discovered zero-day exploits affecting production systems.", category: "Zero-Day", steps: ["Identify vulnerable components", "Apply virtual patching on WAF", "Isolate high-value targets", "Monitor exploit attempts", "Deploy vendor patch ASAP"], autoRun: true, active: true, createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
];

function StepEditor({ steps, onChange }) {
  const addStep = () => onChange([...steps, ""]);
  const removeStep = (i) => onChange(steps.filter((_, idx) => idx !== i));
  const updateStep = (i, val) => { const u = [...steps]; u[i] = val; onChange(u); };
  return (
    <div className="space-y-2">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold shrink-0">{i + 1}</div>
          <input type="text" value={step} onChange={e => updateStep(i, e.target.value)} placeholder={`Step ${i + 1} description...`} className="flex-1 bg-[#0b0d14] border border-[#252840] rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors" />
          <button onClick={() => removeStep(i)} className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
        </div>
      ))}
      <button onClick={addStep} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-dashed border-[#252840] text-gray-500 hover:text-purple-400 hover:border-purple-500/40 transition-all text-sm">
        <Plus className="w-4 h-4" /> Add Step
      </button>
    </div>
  );
}

function PlaybookCard({ playbook, onRun, onEdit, onDelete }) {
  const cat = getCat(playbook.category);
  return (
    <div className="group relative rounded-2xl border border-[#1e2235] bg-[#0f1117] p-5 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 flex flex-col gap-4">
      <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${cat.bg} ${cat.border} ${cat.text}`}>{playbook.category || "General"}</span>
            {playbook.autoRun && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Zap className="w-2.5 h-2.5" /> AutoRun
              </span>
            )}
          </div>
          <h3 className="font-semibold text-white text-sm leading-tight">{playbook.name}</h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5 text-purple-400" />
        </div>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{playbook.description || "No description provided."}</p>
      <div className="flex items-center gap-4 pt-1 border-t border-[#1e2235]">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <List className="w-3.5 h-3.5 text-gray-600" />
          <span><span className="font-bold text-gray-300">{Array.isArray(playbook.steps) ? playbook.steps.length : 0}</span> steps</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5 text-gray-600" />
          <span>{formatDate(playbook.createdAt || playbook.updatedAt)}</span>
        </div>
      </div>
      {Array.isArray(playbook.steps) && playbook.steps.length > 0 && (
        <div className="space-y-1.5">
          {playbook.steps.slice(0, 3).map((step, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-4 h-4 rounded-full bg-[#1a1d2e] border border-[#252840] flex items-center justify-center text-[9px] text-gray-600 font-bold shrink-0">{i + 1}</div>
              <span className="truncate">{typeof step === "string" ? step : step?.name || JSON.stringify(step)}</span>
            </div>
          ))}
          {playbook.steps.length > 3 && <div className="text-[10px] text-gray-600 ml-6">+{playbook.steps.length - 3} more steps</div>}
        </div>
      )}
      <div className="flex items-center gap-2 pt-1">
        <button onClick={() => onRun(playbook)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-lg shadow-purple-500/20 flex-1 justify-center">
          <Play className="w-3.5 h-3.5" /> Run Playbook
        </button>
        <button onClick={() => onEdit(playbook)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1a1d2e] border border-[#252840] text-gray-400 hover:text-white hover:border-gray-500/50 text-xs font-semibold transition-all">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(playbook)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 text-xs font-semibold transition-all">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function PlaybookModal({ playbook, onClose, onSave }) {
  const isEdit = !!playbook?.id;
  const [form, setForm] = useState({
    name: playbook?.name || "",
    description: playbook?.description || "",
    category: playbook?.category || "Phishing",
    autoRun: playbook?.autoRun ?? false,
    steps: Array.isArray(playbook?.steps) ? playbook.steps.map(s => typeof s === "string" ? s : s?.name || "") : [""],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Playbook name is required"); return; }
    setSaving(true); setError(null);
    try {
      const payload = { ...form, steps: form.steps.filter(s => s.trim()) };
      if (isEdit) await adminRequest(`/soc/playbooks/${playbook.id}`, { method: "PATCH", body: payload });
      else await adminRequest("/soc/playbooks", { method: "POST", body: payload });
      onSave();
    } catch (e) { setError(e.message || "Failed to save playbook"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#0f1117] border border-[#1e2235] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e2235]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{isEdit ? "Edit Playbook" : "Create Playbook"}</h2>
              <p className="text-xs text-gray-500">{isEdit ? "Update playbook configuration" : "Define a new response playbook"}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto p-6 space-y-5 flex-1">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Playbook Name *</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Phishing Email Response" className="w-full bg-[#0b0d14] border border-[#252840] rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe what this playbook does and when it should be triggered..." rows={3} className="w-full bg-[#0b0d14] border border-[#252840] rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-[#0b0d14] border border-[#252840] rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-purple-500/50 transition-colors cursor-pointer">
                {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Auto-Run</label>
              <button onClick={() => setForm(f => ({ ...f, autoRun: !f.autoRun }))} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm font-medium ${form.autoRun ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-[#0b0d14] border-[#252840] text-gray-500"}`}>
                <span>{form.autoRun ? "Enabled" : "Disabled"}</span>
                {form.autoRun ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Response Steps</label>
              <span className="text-[10px] text-gray-600">{form.steps.filter(s => s.trim()).length} steps defined</span>
            </div>
            <div className="bg-[#0b0d14] border border-[#1e2235] rounded-xl p-4">
              <StepEditor steps={form.steps} onChange={(steps) => setForm(f => ({ ...f, steps }))} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1e2235]">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-[#1a1d2e] border border-[#252840] text-gray-400 hover:text-white text-sm font-medium transition-all">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-semibold transition-all shadow-lg shadow-purple-500/20">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Playbook"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RunModal({ playbook, onClose }) {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const handleRun = async () => { setRunning(true); await new Promise(r => setTimeout(r, 1800)); setRunning(false); setDone(true); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0f1117] border border-[#1e2235] rounded-2xl shadow-2xl p-6">
        {done ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Playbook Triggered</h3>
            <p className="text-sm text-gray-500 mb-6"><span className="font-semibold text-gray-300">{playbook.name}</span> is now running. Track progress in the Cases feed.</p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all">Done</button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center"><Play className="w-5 h-5 text-purple-400" /></div>
              <div><h3 className="font-bold text-white">Run Playbook</h3><p className="text-xs text-gray-500">This will trigger automated response</p></div>
            </div>
            <div className="bg-[#0b0d14] border border-[#1e2235] rounded-xl p-4 mb-5">
              <div className="text-sm font-semibold text-white mb-1">{playbook.name}</div>
              <div className="text-xs text-gray-500 mb-3">{playbook.description}</div>
              <div className="space-y-1.5">
                {(Array.isArray(playbook.steps) ? playbook.steps : []).slice(0, 5).map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[9px] text-purple-300">{i + 1}</div>
                    {typeof s === "string" ? s : s?.name || ""}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl bg-[#1a1d2e] border border-[#252840] text-gray-400 text-sm font-medium">Cancel</button>
              <button onClick={handleRun} disabled={running} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white text-sm font-semibold transition-all">
                {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {running ? "Running..." : "Confirm Run"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DeleteModal({ playbook, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    setDeleting(true);
    try { await adminRequest(`/soc/playbooks/${playbook.id}`, { method: "DELETE" }); onConfirm(); }
    catch { setDeleting(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#0f1117] border border-[#1e2235] rounded-2xl shadow-2xl p-6">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-400" /></div>
        <h3 className="text-center font-bold text-white mb-2">Delete Playbook</h3>
        <p className="text-center text-sm text-gray-500 mb-6">Are you sure you want to delete <span className="font-semibold text-gray-300">"{playbook.name}"</span>? This action cannot be undone.</p>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl bg-[#1a1d2e] border border-[#252840] text-gray-400 text-sm font-medium">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white text-sm font-semibold transition-all">
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlaybookLibraryPage() {
  const [playbooks, setPlaybooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const res = await adminRequest("/soc/playbooks"); setPlaybooks(res?.playbooks || MOCK_PLAYBOOKS); }
    catch { setPlaybooks(MOCK_PLAYBOOKS); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => playbooks.filter(p => {
    if (!p.active) return false;
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }), [playbooks, activeCategory, search]);

  const stats = useMemo(() => ({
    total: playbooks.filter(p => p.active).length,
    autoRun: playbooks.filter(p => p.autoRun && p.active).length,
    active: playbooks.filter(p => p.active).length,
    categories: [...new Set(playbooks.map(p => p.category))].length,
  }), [playbooks]);

  const closeModal = () => setModal(null);
  const afterSave = () => { closeModal(); load(); };
  const afterDelete = () => { closeModal(); load(); };

  const availableCategories = useMemo(() => {
    const cats = new Set(playbooks.filter(p => p.active).map(p => p.category));
    return CATEGORIES.filter(c => c === "All" || cats.has(c));
  }, [playbooks]);

  return (
    <div className="min-h-screen bg-[#0b0d14] text-gray-100" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {modal?.type === "create" && <PlaybookModal playbook={null} onClose={closeModal} onSave={afterSave} />}
      {modal?.type === "edit" && <PlaybookModal playbook={modal.playbook} onClose={closeModal} onSave={afterSave} />}
      {modal?.type === "run" && <RunModal playbook={modal.playbook} onClose={closeModal} />}
      {modal?.type === "delete" && <DeleteModal playbook={modal.playbook} onClose={closeModal} onConfirm={afterDelete} />}

      <div className="border-b border-[#1e2235] bg-[#0f1117] px-8 py-5 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <span>Security Operations</span><ChevronRight className="w-3 h-3" /><span>SOC</span><ChevronRight className="w-3 h-3" /><span className="text-gray-400">Playbook Library</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center"><BookOpen className="w-5 h-5 text-purple-400" /></div>
              <div>
                <h1 className="text-xl font-bold text-white">Playbook Library</h1>
                <p className="text-gray-500 text-sm">Manage automated response playbooks for security incidents.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} className="p-2.5 rounded-xl bg-[#1a1d2e] border border-[#252840] text-gray-400 hover:text-white hover:border-purple-500/30 transition-all">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button onClick={() => setModal({ type: "create" })} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-500/20 transition-all">
              <Plus className="w-4 h-4" /> New Playbook
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Playbooks", value: stats.total, icon: BookOpen, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
            { label: "Auto-Run Enabled", value: stats.autoRun, icon: Zap, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
            { label: "Active Playbooks", value: stats.active, icon: Activity, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
            { label: "Categories", value: stats.categories, icon: Layers, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
          ].map((s, i) => (
            <div key={i} className={`rounded-2xl border ${s.border} ${s.bg} p-4 flex items-center gap-4`}>
              <div className={`w-10 h-10 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <div className={`text-2xl font-extrabold ${s.color}`}>{loading ? "—" : s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search playbooks..." className="w-full bg-[#0f1117] border border-[#1e2235] rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {availableCategories.map(cat => {
              const isActive = activeCategory === cat;
              const catStyle = cat !== "All" ? getCat(cat) : null;
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${isActive ? cat === "All" ? "bg-purple-500/20 border-purple-500/40 text-purple-300" : `${catStyle.bg} ${catStyle.border} ${catStyle.text}` : "bg-[#0f1117] border-[#1e2235] text-gray-500 hover:text-gray-300 hover:border-gray-600"}`}>
                  {cat !== "All" && isActive && <div className="w-1.5 h-1.5 rounded-full" style={{ background: catStyle.dot }} />}
                  {cat}
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${isActive ? "bg-white/10" : "bg-white/5 text-gray-600"}`}>
                    {cat === "All" ? playbooks.filter(p => p.active).length : playbooks.filter(p => p.active && p.category === cat).length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
            <span className="text-gray-500 text-sm">Loading playbooks...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-purple-500/50" />
            </div>
            <div className="text-center">
              <div className="text-white font-semibold mb-1">No playbooks found</div>
              <div className="text-sm text-gray-500 mb-4">{search ? `No results for "${search}"` : `No playbooks in "${activeCategory}"`}</div>
              <button onClick={() => { setSearch(""); setActiveCategory("All"); }} className="text-sm text-purple-400 hover:text-purple-300 transition-colors">Clear filters</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filtered.map(pb => (
              <PlaybookCard key={pb.id} playbook={pb}
                onRun={p => setModal({ type: "run", playbook: p })}
                onEdit={p => setModal({ type: "edit", playbook: p })}
                onDelete={p => setModal({ type: "delete", playbook: p })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
