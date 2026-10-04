"use client";

import React, { useState } from 'react';

export default function TokensThemePage() {
  const [activeTab, setActiveTab] = useState('Design Tokens');
  
  const tabs = [
    'Design Tokens',
    'Theme',
    'Dark Mode',
    'Brand Themes',
    'CSS Variables',
    'Usage'
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-8 font-sans text-gray-900">
      {/* Header & Tabs */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">DS1 - Tokens & Theme</h1>
          <p className="text-gray-500 text-sm">
            The foundational design tokens and variables that power the Katabazaar Design System.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export Tokens
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8 overflow-x-auto">
        <div className="flex gap-8 whitespace-nowrap">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* 1. COLOR TOKENS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 xl:col-span-2">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10"></path>
                <path d="M12 2c2.76 0 5 4.48 5 10s-2.24 10-5 10-5-4.48-5-10 2.24-10 5-10"></path>
              </svg>
            </div>
            Color Tokens
          </h2>
          <div className="space-y-6">
            <ColorSwatchRow title="Primary (Indigo)" colorBase="indigo" hexValues={['#EEF2FF', '#E0E7FF', '#C7D2FE', '#A5B4FC', '#818CF8', '#6366F1', '#4F46E5', '#4338CA', '#3730A3', '#312E81']} />
            <ColorSwatchRow title="Success (Emerald)" colorBase="emerald" hexValues={['#ECFDF5', '#D1FAE5', '#A7F3D0', '#6EE7B7', '#34D399', '#10B981', '#059669', '#047857', '#065F46', '#064E3B']} />
            <ColorSwatchRow title="Warning (Amber)" colorBase="amber" hexValues={['#FFFBEB', '#FEF3C7', '#FDE68A', '#FCD34D', '#FBBF24', '#F59E0B', '#D97706', '#B45309', '#92400E', '#78350F']} />
            <ColorSwatchRow title="Error (Rose)" colorBase="rose" hexValues={['#FFF1F2', '#FFE4E6', '#FECDD3', '#FDA4AF', '#FB7185', '#F43F5E', '#E11D48', '#BE123C', '#9F1239', '#881337']} />
            <ColorSwatchRow title="Neutral (Gray)" colorBase="gray" hexValues={['#F9FAFB', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#374151', '#1F2937', '#111827']} />
          </div>
        </div>

        {/* 2. TYPOGRAPHY TOKENS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 pb-4">Typography Tokens</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 border-b border-gray-100">
                  <th className="font-medium py-2">Token</th>
                  <th className="font-medium py-2">Value</th>
                  <th className="font-medium py-2">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                <tr>
                  <td className="py-3 font-mono text-xs">font.family.sans</td>
                  <td className="py-3 text-gray-500">Inter, system-ui</td>
                  <td className="py-3 font-sans">The quick brown fox</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-xs">font.size.xs</td>
                  <td className="py-3 text-gray-500">0.75rem / 12px</td>
                  <td className="py-3 text-xs">The quick brown fox</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-xs">font.size.sm</td>
                  <td className="py-3 text-gray-500">0.875rem / 14px</td>
                  <td className="py-3 text-sm">The quick brown fox</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-xs">font.size.base</td>
                  <td className="py-3 text-gray-500">1rem / 16px</td>
                  <td className="py-3 text-base">The quick brown fox</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-xs">font.size.lg</td>
                  <td className="py-3 text-gray-500">1.125rem / 18px</td>
                  <td className="py-3 text-lg">The quick brown fox</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-xs">font.size.xl</td>
                  <td className="py-3 text-gray-500">1.25rem / 20px</td>
                  <td className="py-3 text-xl">The quick brown fox</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-xs">font.size.2xl</td>
                  <td className="py-3 text-gray-500">1.5rem / 24px</td>
                  <td className="py-3 text-2xl font-bold">The quick brown fox</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-xs">font.size.3xl</td>
                  <td className="py-3 text-gray-500">1.875rem / 30px</td>
                  <td className="py-3 text-3xl font-bold">The quick brown fox</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-xs">font.weight.regular</td>
                  <td className="py-3 text-gray-500">400</td>
                  <td className="py-3 font-normal">The quick brown fox</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-xs">font.weight.medium</td>
                  <td className="py-3 text-gray-500">500</td>
                  <td className="py-3 font-medium">The quick brown fox</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-xs">font.weight.bold</td>
                  <td className="py-3 text-gray-500">700</td>
                  <td className="py-3 font-bold">The quick brown fox</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. SPACING TOKENS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 pb-4">Spacing Tokens</h2>
          <div className="overflow-x-auto max-h-[500px] pr-2">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 border-b border-gray-100">
                  <th className="font-medium py-2">Token</th>
                  <th className="font-medium py-2">Value</th>
                  <th className="font-medium py-2">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {[
                  { t: '0', v: '0px' },
                  { t: '1', v: '4px' },
                  { t: '2', v: '8px' },
                  { t: '3', v: '12px' },
                  { t: '4', v: '16px' },
                  { t: '5', v: '20px' },
                  { t: '6', v: '24px' },
                  { t: '8', v: '32px' },
                  { t: '10', v: '40px' },
                  { t: '12', v: '48px' },
                  { t: '16', v: '64px' },
                  { t: '20', v: '80px' },
                  { t: '24', v: '96px' },
                ].map(item => (
                  <tr key={item.t}>
                    <td className="py-3 font-mono text-xs">space.{item.t}</td>
                    <td className="py-3 text-gray-500">{item.v}</td>
                    <td className="py-3">
                      <div className="bg-purple-500 h-4 rounded-sm" style={{ width: item.v }}></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. RADIUS TOKENS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 pb-4">Radius Tokens</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 border-b border-gray-100">
                  <th className="font-medium py-2">Token</th>
                  <th className="font-medium py-2">Value</th>
                  <th className="font-medium py-2">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {[
                  { t: 'none', v: '0px', c: 'rounded-none' },
                  { t: 'sm', v: '2px', c: 'rounded-sm' },
                  { t: 'DEFAULT', v: '4px', c: 'rounded' },
                  { t: 'md', v: '6px', c: 'rounded-md' },
                  { t: 'lg', v: '8px', c: 'rounded-lg' },
                  { t: 'xl', v: '12px', c: 'rounded-xl' },
                  { t: '2xl', v: '16px', c: 'rounded-2xl' },
                  { t: 'full', v: '9999px', c: 'rounded-full' },
                ].map(item => (
                  <tr key={item.t}>
                    <td className="py-3 font-mono text-xs">radius.{item.t}</td>
                    <td className="py-3 text-gray-500">{item.v}</td>
                    <td className="py-3">
                      <div className={`bg-indigo-100 border border-indigo-200 w-12 h-12 ${item.c}`}></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. SHADOW TOKENS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 pb-4">Shadow Tokens</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 border-b border-gray-100">
                  <th className="font-medium py-2">Token</th>
                  <th className="font-medium py-2">Value</th>
                  <th className="font-medium py-2">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {[
                  { t: 'sm', v: '0 1px 2px 0 rgb(0 0 0 / 0.05)', c: 'shadow-sm' },
                  { t: 'DEFAULT', v: '0 1px 3px 0 rgb(0 0 0 / 0.1), ...', c: 'shadow' },
                  { t: 'md', v: '0 4px 6px -1px rgb(0 0 0 / 0.1), ...', c: 'shadow-md' },
                  { t: 'lg', v: '0 10px 15px -3px rgb(0 0 0 / 0.1), ...', c: 'shadow-lg' },
                  { t: 'inner', v: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)', c: 'shadow-inner' },
                ].map(item => (
                  <tr key={item.t}>
                    <td className="py-3 font-mono text-xs">shadow.{item.t}</td>
                    <td className="py-3 text-gray-500 text-xs">{item.v}</td>
                    <td className="py-3">
                      <div className={`bg-white border border-gray-50 w-12 h-12 rounded-lg ${item.c}`}></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. Z-INDEX TOKENS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 pb-4">Z-Index Tokens</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 border-b border-gray-100">
                  <th className="font-medium py-2">Token</th>
                  <th className="font-medium py-2">Value</th>
                  <th className="font-medium py-2">Usage Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {[
                  { t: 'base', v: '0', u: 'Default layer for content' },
                  { t: 'dropdown', v: '10', u: 'Dropdown menus, popovers' },
                  { t: 'sticky', v: '20', u: 'Sticky headers, sidebars' },
                  { t: 'overlay', v: '30', u: 'Modal backdrops' },
                  { t: 'modal', v: '40', u: 'Modals, dialogs' },
                  { t: 'tooltip', v: '50', u: 'Tooltips, toast notifications' },
                ].map(item => (
                  <tr key={item.t}>
                    <td className="py-3 font-mono text-xs">z.{item.t}</td>
                    <td className="py-3 text-gray-500 font-mono">{item.v}</td>
                    <td className="py-3 text-gray-500">{item.u}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 7. BREAKPOINT TOKENS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 pb-4">Breakpoint Tokens</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 border-b border-gray-100">
                  <th className="font-medium py-2">Token</th>
                  <th className="font-medium py-2">Value</th>
                  <th className="font-medium py-2">Device Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {[
                  { t: 'sm', v: '640px', u: 'Mobile landscapes & tablets' },
                  { t: 'md', v: '768px', u: 'Tablets (portrait)' },
                  { t: 'lg', v: '1024px', u: 'Laptops & small desktops' },
                  { t: 'xl', v: '1280px', u: 'Desktops' },
                  { t: '2xl', v: '1536px', u: 'Large displays' },
                ].map(item => (
                  <tr key={item.t}>
                    <td className="py-3 font-mono text-xs">breakpoint.{item.t}</td>
                    <td className="py-3 text-gray-500 font-mono">{item.v}</td>
                    <td className="py-3 text-gray-500">{item.u}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 8. DURATION & EASING TOKENS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 pb-4">Duration & Easing Tokens</h2>
          <div className="overflow-x-auto mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Duration</h3>
            <table className="w-full text-sm text-left">
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {[
                  { t: 'fast', v: '150ms' },
                  { t: 'normal', v: '300ms' },
                  { t: 'slow', v: '500ms' },
                ].map(item => (
                  <tr key={item.t}>
                    <td className="py-2 font-mono text-xs w-1/2">duration.{item.t}</td>
                    <td className="py-2 text-gray-500 font-mono">{item.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Easing</h3>
            <table className="w-full text-sm text-left">
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {[
                  { t: 'linear', v: 'linear' },
                  { t: 'in', v: 'cubic-bezier(0.4, 0, 1, 1)' },
                  { t: 'out', v: 'cubic-bezier(0, 0, 0.2, 1)' },
                  { t: 'inout', v: 'cubic-bezier(0.4, 0, 0.2, 1)' },
                ].map(item => (
                  <tr key={item.t}>
                    <td className="py-2 font-mono text-xs w-1/3">ease.{item.t}</td>
                    <td className="py-2 text-gray-500 font-mono text-xs">{item.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 9. CSS VARIABLES PREVIEW */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
            <h2 className="text-lg font-semibold">CSS Variables Preview</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Theme: Light</option>
                  <option>Theme: Dark</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
              <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 bg-white px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy CSS
              </button>
            </div>
          </div>
          <div className="bg-[#1E1E1E] text-gray-300 rounded-lg p-6 font-mono text-sm overflow-x-auto shadow-inner border border-[#333]">
            <pre>
              <code>
<span className="text-gray-500">/* Theme: Light */</span>
<br/>
<span className="text-[#569CD6]">:root</span> {'{'}
<br/>
{'  '}<span className="text-gray-500">/* Color Primitives */</span>
<br/>
{'  '}<span className="text-[#9CDCFE]">--color-primary-50</span>: <span className="text-[#CE9178]">#EEF2FF</span>;
<br/>
{'  '}<span className="text-[#9CDCFE]">--color-primary-500</span>: <span className="text-[#CE9178]">#6366F1</span>;
<br/>
{'  '}<span className="text-[#9CDCFE]">--color-primary-900</span>: <span className="text-[#CE9178]">#312E81</span>;
<br/>
<br/>
{'  '}<span className="text-gray-500">/* Semantic Colors */</span>
<br/>
{'  '}<span className="text-[#9CDCFE]">--color-bg-default</span>: <span className="text-[#CE9178]">#FFFFFF</span>;
<br/>
{'  '}<span className="text-[#9CDCFE]">--color-bg-subtle</span>: <span className="text-[#CE9178]">#F9FAFB</span>;
<br/>
{'  '}<span className="text-[#9CDCFE]">--color-text-default</span>: <span className="text-[#CE9178]">#111827</span>;
<br/>
{'  '}<span className="text-[#9CDCFE]">--color-text-muted</span>: <span className="text-[#CE9178]">#6B7280</span>;
<br/>
{'  '}<span className="text-[#9CDCFE]">--color-border-default</span>: <span className="text-[#CE9178]">#E5E7EB</span>;
<br/>
<br/>
{'  '}<span className="text-gray-500">/* Typography */</span>
<br/>
{'  '}<span className="text-[#9CDCFE]">--font-sans</span>: <span className="text-[#CE9178]">'Inter', system-ui, sans-serif</span>;
<br/>
{'  '}<span className="text-[#9CDCFE]">--font-mono</span>: <span className="text-[#CE9178]">'JetBrains Mono', monospace</span>;
<br/>
<br/>
{'  '}<span className="text-gray-500">/* Spacing & Layout */</span>
<br/>
{'  '}<span className="text-[#9CDCFE]">--space-4</span>: <span className="text-[#CE9178]">1rem</span>;
<br/>
{'  '}<span className="text-[#9CDCFE]">--radius-md</span>: <span className="text-[#CE9178]">0.375rem</span>;
<br/>
{'}'}
              </code>
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
}

function ColorSwatchRow({ title, colorBase, hexValues }) {
  const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <span className="text-xs text-gray-500 font-mono">color.{colorBase}</span>
      </div>
      <div className="grid grid-cols-10 gap-2">
        {steps.map((step, idx) => (
          <div key={step} className="flex flex-col gap-1">
            <div 
              className="h-10 w-full rounded shadow-inner border border-black/5" 
              style={{ backgroundColor: hexValues[idx] }}
            ></div>
            <span className="text-[10px] text-gray-500 font-mono text-center">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
