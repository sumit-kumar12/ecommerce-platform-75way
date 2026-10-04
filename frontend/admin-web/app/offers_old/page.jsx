"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/api";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { GlassPanel } from "../../components/ui/GlassPanel";
import { ButtonPrimary } from "../../components/ui/ButtonPrimary";
import styles from "./page.module.css";

const toDateTimeLocalValue = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const fromDateTimeLocalValue = (value) => {
  if (!value) return new Date().toISOString();
  return new Date(value).toISOString();
};

const getDaysLeft = (value) => {
  const diff = new Date(value).getTime() - Date.now();
  if (!Number.isFinite(diff) || diff <= 0) return 0;
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
};

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOffer, setNewOffer] = useState({
    title: "",
    description: "",
    code: "",
    discountPercent: 18,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    categoryId: "",
    usageLimit: "",
    perCustomerLimit: "",
  });

  const [activeTab, setActiveTab] = useState("LIVE MATRIX");
  const [searchQuery, setSearchQuery] = useState("");
  const tabs = ["LIVE MATRIX", "DRAFT SCHEMES", "HISTORICAL AUDIT"];
  const forecastData = [12, 18, 15, 22, 30, 25, 45, 38, 30, 24, 28, 35, 40, 48, 55, 50, 62, 58, 45, 40, 42, 50, 55, 60];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [offerRes, catRes] = await Promise.all([
        apiRequest("/admin/offers"),
        apiRequest("/admin/categories")
      ]);
      setOffers(offerRes.offers || []);
      setCategories(catRes.categories || []);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const payload = {
        ...newOffer,
        categoryId: newOffer.categoryId || null,
        usageLimit: newOffer.usageLimit ? Number(newOffer.usageLimit) : null,
        perCustomerLimit: newOffer.perCustomerLimit ? Number(newOffer.perCustomerLimit) : null,
      };
      await apiRequest("/admin/offers", {
        method: "POST",
        body: payload
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const selectedCategory = categories.find((category) => category.id === newOffer.categoryId) || null;

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to decommission this offer?")) return;
    await apiRequest(`/admin/offers/${id}`, { method: "DELETE" });
    loadData();
  };

  return (
    <div className={styles.container}>
      <header className={styles.topHeader}>
        <div className={styles.headerTitle}>
          <SectionHeader 
            eyebrow="CATEGORY MATRIX CONTROL" 
            title="Integrated Merchant Hub" 
            description="High-density oversight for global commerce nodes."
            icon="hub"
          />
        </div>
        <div className={styles.headerActions}>
          <nav className={styles.tabNav}>
            {tabs.map(tab => (
              <button 
                key={tab} 
                className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
          <div className={styles.searchBar}>
            <span className="material-symbols-outlined">search</span>
            <input 
              type="text" 
              placeholder="QUERY SYSTEM..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className={styles.quickIcons}>
            <span className="material-symbols-outlined">notifications</span>
            <span className="material-symbols-outlined">settings</span>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.builderSection}>
          <GlassPanel className={styles.builderPanel} elevated>
            <div className={styles.builderContent}>
              <div className={styles.builderHeader}>
                <div className={styles.builderTitle}>
                  <p className={styles.smallEyebrow}>OFFER CONFIGURATION</p>
                  <h2>Integrated Offer Builder v4.2</h2>
                </div>
                <ButtonPrimary onClick={handleCreate} className={styles.pushBtn} icon="sensors">
                  PUSH-TO-LIVE
                </ButtonPrimary>
              </div>

              <div className={styles.configGrid}>
                <div className={styles.configColumn}>
                  <div className={styles.inputGroup}>
                    <label>CAMPAIGN IDENTIFIER</label>
                    <input 
                      className={styles.obsidianInput}
                      value={newOffer.title} 
                      placeholder="e.g. CYBER_MONDAY_2024_CORE"
                      onChange={e => setNewOffer({...newOffer, title: e.target.value})} 
                    />
                  </div>

                  <div className={styles.dualInputGrid}>
                    <div className={styles.inputGroup}>
                      <label>CLAIM CODE</label>
                      <input
                        className={styles.obsidianInput}
                        value={newOffer.code}
                        placeholder="e.g. VAULT20"
                        onChange={e => setNewOffer({...newOffer, code: e.target.value.toUpperCase()})}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>ATTACH CATEGORY</label>
                      <select
                        className={styles.obsidianInput}
                        value={newOffer.categoryId}
                        onChange={e => setNewOffer({...newOffer, categoryId: e.target.value})}
                      >
                        <option value="">Global storefront</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>CUSTOMER-FACING COPY</label>
                    <textarea
                      className={styles.obsidianTextarea}
                      value={newOffer.description}
                      placeholder="Describe why the offer matters to the buyer."
                      onChange={e => setNewOffer({...newOffer, description: e.target.value})}
                    />
                  </div>

                  <div className={styles.sliderGroup}>
                    <div className={styles.sliderHeader}>
                      <label>MARGIN SAFEGUARD (%)</label>
                      <span className={styles.sliderValue}>{newOffer.discountPercent}.0%</span>
                    </div>
                    <div className={styles.sliderTrack}>
                      <input 
                        type="range" 
                        min="1" 
                        max="90" 
                        value={newOffer.discountPercent} 
                        onChange={e => setNewOffer({...newOffer, discountPercent: parseInt(e.target.value)})} 
                      />
                      <div className={styles.sliderProgress} style={{width: `${newOffer.discountPercent}%`}}></div>
                    </div>
                  </div>

                  <div className={styles.dualInputGrid}>
                    <div className={styles.inputGroup}>
                      <label>START WINDOW</label>
                      <input
                        type="datetime-local"
                        className={styles.obsidianInput}
                        value={toDateTimeLocalValue(newOffer.startDate)}
                        onChange={e => setNewOffer({...newOffer, startDate: fromDateTimeLocalValue(e.target.value)})}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>END WINDOW</label>
                      <input
                        type="datetime-local"
                        className={styles.obsidianInput}
                        value={toDateTimeLocalValue(newOffer.endDate)}
                        onChange={e => setNewOffer({...newOffer, endDate: fromDateTimeLocalValue(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className={styles.limitGrid}>
                    <div className={styles.inputGroup}>
                      <label>TOTAL CLAIM LIMIT</label>
                      <input
                        type="number"
                        min="1"
                        className={styles.obsidianInput}
                        value={newOffer.usageLimit}
                        placeholder="Unlimited"
                        onChange={e => setNewOffer({...newOffer, usageLimit: e.target.value})}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>PER-CUSTOMER LIMIT</label>
                      <input
                        type="number"
                        min="1"
                        className={styles.obsidianInput}
                        value={newOffer.perCustomerLimit}
                        placeholder="Unlimited"
                        onChange={e => setNewOffer({...newOffer, perCustomerLimit: e.target.value})}
                      />
                    </div>
                    <p className={styles.limitNote}>
                      Limits are enforced during backend order creation, not only in the UI preview.
                    </p>
                  </div>
                </div>

                <div className={styles.nodeColumn}>
                  <label>NODE ATTACHMENT</label>
                  <div className={styles.tagCloud}>
                    {categories.slice(0, 3).map(c => (
                      <span key={c.id} className={styles.nodeTag}>{c.name.toUpperCase()}</span>
                    ))}
                    <button 
                      type="button" 
                      className={styles.addTagBtn}
                      onClick={() => alert(`Node Attachment Protocol:\n\nTo attach additional category tags, select from the 'ATTACH CATEGORY' dropdown in the configuration builder.`)}
                    >
                      + ATTACH
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.forecastEngine}>
                <div className={styles.forecastHeader}>
                  <p>24-MONTH FORECAST ENGINE</p>
                  <span className={styles.projectedLift}>+12.4% PROJECTED LIFT</span>
                </div>
                <div className={styles.chartArea}>
                  {forecastData.map((val, i) => (
                    <div 
                      key={i} 
                      className={`${styles.chartBar} ${i === 16 ? styles.chartBarHighlight : ""}`} 
                      style={{height: `${val}%`}}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </GlassPanel>

          <aside className={styles.sidebarStats}>
             <GlassPanel className={styles.statCard}>
                <div className={styles.statLine}>
                   <p>NETWORK LIQUIDITY</p>
                   <span className="material-symbols-outlined">trending_up</span>
                </div>
                <h3>$14.2M</h3>
                <div className={styles.statProgress}>
                   <div className={styles.progressBar} style={{width: '65%'}}></div>
                </div>
                <span className={styles.statMeta}>+4.2%</span>
             </GlassPanel>

             <GlassPanel className={styles.nodeListCard}>
                <p className={styles.smallEyebrow}>ACTIVE SYSTEM NODES</p>
                <div className={styles.nodeItem}>
                   <span>Matrix Core Alpha</span>
                   <div className={styles.statusDotActive}></div>
                </div>
                <div className={styles.nodeItem}>
                   <span>Merchant Sync Hub</span>
                   <div className={styles.statusDotActive}></div>
                </div>
                <div className={styles.nodeItem}>
                   <span>Inventory Forensic</span>
                   <div className={styles.statusDotWarning}></div>
                </div>
             </GlassPanel>

             <div className={`${styles.previewCard} bg-gradient-to-br from-indigo-900 to-slate-900 overflow-hidden relative shadow-2xl`}>
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-600/30 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-600/30 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300 bg-cyan-900/40 px-2 py-1 rounded-full border border-cyan-500/30">
                      {selectedCategory?.name || "Global Offer"}
                    </span>
                    <strong className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                      {newOffer.discountPercent}% OFF
                    </strong>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                    {newOffer.title || "Premium Promotional Campaign"}
                  </h3>
                  
                  <p className="text-sm text-slate-300 mb-6 flex-grow">
                    {newOffer.description || "Compelling customer-safe offer copy appears here to drive conversion."}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto bg-black/40 p-3 rounded-xl border border-white/5 backdrop-blur-md">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Use Code at Checkout</span>
                      <em className="text-sm font-mono font-bold text-fuchsia-300 uppercase tracking-widest">
                        {newOffer.code || "NO-CODE-NEEDED"}
                      </em>
                    </div>
                    <button 
                      type="button"
                      className="bg-white text-black px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                      onClick={() => alert(`Preview Route:\n\nThis button simulates routing to /products?categorySlug=... on the storefront.`)}
                    >
                      Shop Deal
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 text-[10px] text-slate-400 font-medium">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">schedule</span>
                      <span>{getDaysLeft(newOffer.endDate) <= 0 ? "Ends today" : `${getDaysLeft(newOffer.endDate)} days left`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Total: {newOffer.usageLimit || "∞"}</span>
                      <span>Per user: {newOffer.perCustomerLimit || "∞"}</span>
                    </div>
                  </div>
                </div>
             </div>
          </aside>
        </section>

        <section className={styles.matrixRoot}>
          <div className={styles.sectionHeader}>
             <p className={styles.smallEyebrow}>CATEGORY MATRIX TREE STRUCTURE</p>
          </div>
          <div className={styles.offerGrid}>
            {loading ? (
              <p>Scanning promotion nodes...</p>
            ) : offers.filter(offer => 
                offer.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                (offer.code && offer.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (offer.category?.name && offer.category.name.toLowerCase().includes(searchQuery.toLowerCase()))
              ).map(offer => (
              <GlassPanel key={offer.id} className={styles.offerCard}>
                <div className={styles.cardGlow} style={{'--glow-color': offer.isActive ? 'var(--neon-cyan)' : 'var(--text-dim)'}}></div>
                <div className={styles.cardHeader}>
                  <span className={styles.categoryBadge}>{offer.category?.name || "GLOBAL"}</span>
                  <span className={styles.discountBadge}>{offer.discountPercent}% OFF</span>
                </div>
                <h4>{offer.title}</h4>
                <div className={styles.cardStats}>
                  <div className={styles.stat}>
                    <span className="material-symbols-outlined">timer</span>
                    <span>Ends: {new Date(offer.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.redemptionMeter}>
                    <div className={styles.redemptionHeader}>
                      <span>Redemptions</span>
                      <strong>{offer.redeemedCount || 0}{offer.usageLimit ? ` / ${offer.usageLimit}` : " / Unlimited"}</strong>
                    </div>
                    <div className={styles.redemptionTrack}>
                      <div
                        className={styles.redemptionFill}
                        style={{
                          width: offer.usageLimit
                            ? `${Math.min(100, Math.round(((offer.redeemedCount || 0) / offer.usageLimit) * 100))}%`
                            : "12%"
                        }}
                      ></div>
                    </div>
                    <span className={styles.perCustomerText}>
                      Per customer: {offer.perCustomerLimit || "Unlimited"}
                    </span>
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <div className={`${styles.statusPill} ${offer.isActive ? styles.statusActive : ""}`}>
                    {offer.isActive ? "ACTIVE" : "INACTIVE"}
                  </div>
                  <button onClick={() => handleDelete(offer.id)} className={styles.deleteBtn}>
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </GlassPanel>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
