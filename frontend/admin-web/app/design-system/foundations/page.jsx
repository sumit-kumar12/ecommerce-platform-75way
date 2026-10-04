import React from 'react';
import { Search, Heart, Star, Check, AlertTriangle, Info, Bell, Settings } from 'lucide-react';

export default function FoundationsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-12 pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">DS1 - FOUNDATIONS</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search documentation... Cmd K" 
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-72"
          />
        </div>
      </header>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        
        {/* 1. COLORS */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4 border-b border-slate-100 pb-2">COLORS</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">Primary (Blue)</h3>
              <div className="flex gap-2">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(weight => (
                  <div key={`blue-${weight}`} className="flex-1 flex flex-col items-center">
                    <div className={`w-full h-10 rounded bg-blue-${weight}`} title={`blue-${weight}`}></div>
                    <span className="text-[10px] mt-1 text-slate-500">{weight}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">Semantic (Green, Yellow, Red)</h3>
              <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                  <div className="h-8 bg-green-500 rounded"></div>
                  <div className="text-xs text-center text-slate-600">Success</div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="h-8 bg-yellow-500 rounded"></div>
                  <div className="text-xs text-center text-slate-600">Warning</div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="h-8 bg-red-500 rounded"></div>
                  <div className="text-xs text-center text-slate-600">Danger</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">Neutral (Slate)</h3>
              <div className="flex gap-2">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(weight => (
                  <div key={`slate-${weight}`} className="flex-1 flex flex-col items-center">
                    <div className={`w-full h-8 rounded bg-slate-${weight}`} title={`slate-${weight}`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. TYPOGRAPHY */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4 border-b border-slate-100 pb-2">TYPOGRAPHY</h2>
          <div className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-slate-50 pb-2">
              <span className="text-4xl font-bold">Display</span>
              <span className="text-xs text-slate-400">4xl / 36px / Bold</span>
            </div>
            <div className="flex items-baseline justify-between border-b border-slate-50 pb-2">
              <span className="text-3xl font-semibold">Heading 1</span>
              <span className="text-xs text-slate-400">3xl / 30px / Semibold</span>
            </div>
            <div className="flex items-baseline justify-between border-b border-slate-50 pb-2">
              <span className="text-2xl font-semibold">Heading 2</span>
              <span className="text-xs text-slate-400">2xl / 24px / Semibold</span>
            </div>
            <div className="flex items-baseline justify-between border-b border-slate-50 pb-2">
              <span className="text-xl font-medium">Heading 3</span>
              <span className="text-xs text-slate-400">xl / 20px / Medium</span>
            </div>
            <div className="flex items-baseline justify-between border-b border-slate-50 pb-2">
              <span className="text-base font-normal">Body Large</span>
              <span className="text-xs text-slate-400">base / 16px / Regular</span>
            </div>
            <div className="flex items-baseline justify-between border-b border-slate-50 pb-2">
              <span className="text-sm font-normal text-slate-600">Body Small</span>
              <span className="text-xs text-slate-400">sm / 14px / Regular</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Caption / Overline</span>
              <span className="text-xs text-slate-400">xs / 12px / Medium</span>
            </div>
          </div>
        </section>

        {/* 3. SPACING SYSTEM */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4 border-b border-slate-100 pb-2">SPACING SYSTEM (4px Baseline)</h2>
          <div className="space-y-3">
            {[
              { size: '1', px: '4px', w: 'w-1' },
              { size: '2', px: '8px', w: 'w-2' },
              { size: '4', px: '16px', w: 'w-4' },
              { size: '6', px: '24px', w: 'w-6' },
              { size: '8', px: '32px', w: 'w-8' },
              { size: '12', px: '48px', w: 'w-12' },
              { size: '16', px: '64px', w: 'w-16' },
              { size: '24', px: '96px', w: 'w-24' },
            ].map(space => (
              <div key={space.size} className="flex items-center gap-4">
                <div className="w-16 text-xs text-slate-500 text-right">{space.size} ({space.px})</div>
                <div className={`h-4 bg-blue-100 border border-blue-300 ${space.w}`}></div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. GRID SYSTEM */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4 border-b border-slate-100 pb-2">GRID SYSTEM</h2>
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Breakpoints</h3>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 bg-slate-100 rounded">sm: 640px</span>
              <span className="px-2 py-1 bg-slate-100 rounded">md: 768px</span>
              <span className="px-2 py-1 bg-slate-100 rounded">lg: 1024px</span>
              <span className="px-2 py-1 bg-slate-100 rounded">xl: 1280px</span>
              <span className="px-2 py-1 bg-slate-100 rounded">2xl: 1536px</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-2">12-Column Layout</h3>
            <div className="grid grid-cols-12 gap-2">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-16 bg-indigo-50 border border-indigo-200 rounded flex items-center justify-center text-xs text-indigo-400">
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[...Array(4)].map((_, i) => (
                <div key={`span-3-${i}`} className="h-8 bg-indigo-100 border border-indigo-300 rounded flex items-center justify-center text-xs text-indigo-500">
                  span-3
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[...Array(2)].map((_, i) => (
                <div key={`span-6-${i}`} className="h-8 bg-indigo-200 border border-indigo-400 rounded flex items-center justify-center text-xs text-indigo-600">
                  span-6
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. ELEVATION */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4 border-b border-slate-100 pb-2">ELEVATION (Shadows)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 pb-4 px-4">
            <div className="h-24 bg-white border border-slate-200 flex flex-col items-center justify-center rounded-lg shadow-sm">
              <span className="text-sm font-medium">Level 1</span>
              <span className="text-xs text-slate-400">shadow-sm</span>
            </div>
            <div className="h-24 bg-white border border-slate-200 flex flex-col items-center justify-center rounded-lg shadow">
              <span className="text-sm font-medium">Level 2</span>
              <span className="text-xs text-slate-400">shadow</span>
            </div>
            <div className="h-24 bg-white border border-slate-200 flex flex-col items-center justify-center rounded-lg shadow-md">
              <span className="text-sm font-medium">Level 3</span>
              <span className="text-xs text-slate-400">shadow-md</span>
            </div>
            <div className="h-24 bg-white border border-slate-200 flex flex-col items-center justify-center rounded-lg shadow-lg">
              <span className="text-sm font-medium">Level 4</span>
              <span className="text-xs text-slate-400">shadow-lg</span>
            </div>
            <div className="h-24 bg-white border border-slate-200 flex flex-col items-center justify-center rounded-lg shadow-xl z-10">
              <span className="text-sm font-medium">Level 5</span>
              <span className="text-xs text-slate-400">shadow-xl</span>
            </div>
            <div className="h-24 bg-white border border-slate-200 flex flex-col items-center justify-center rounded-lg shadow-2xl z-20">
              <span className="text-sm font-medium">Level 6</span>
              <span className="text-xs text-slate-400">shadow-2xl</span>
            </div>
          </div>
        </section>

        {/* 6. BORDERS & RADIUS */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4 border-b border-slate-100 pb-2">BORDERS & RADIUS</h2>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-500 mb-3">Border Widths</h3>
            <div className="space-y-4">
              <div>
                <div className="border-t border-slate-800 w-full mb-1"></div>
                <span className="text-xs text-slate-500">border (1px)</span>
              </div>
              <div>
                <div className="border-t-2 border-slate-800 w-full mb-1"></div>
                <span className="text-xs text-slate-500">border-2 (2px)</span>
              </div>
              <div>
                <div className="border-t-4 border-slate-800 w-full mb-1"></div>
                <span className="text-xs text-slate-500">border-4 (4px)</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-3">Border Radius</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-slate-200 rounded-sm"></div>
                <span className="text-xs text-slate-500">sm</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-slate-200 rounded"></div>
                <span className="text-xs text-slate-500">md</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                <span className="text-xs text-slate-500">lg</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                <span className="text-xs text-slate-500">xl</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                <span className="text-xs text-slate-500">full</span>
              </div>
            </div>
          </div>
        </section>

        {/* 7. ICONOGRAPHY */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4 border-b border-slate-100 pb-2">ICONOGRAPHY</h2>
          <div className="grid grid-cols-4 gap-6 justify-items-center py-4">
            <div className="flex flex-col items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
              <Heart className="w-6 h-6" />
              <span className="text-xs">Heart</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
              <Star className="w-6 h-6" />
              <span className="text-xs">Star</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
              <Check className="w-6 h-6" />
              <span className="text-xs">Check</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
              <AlertTriangle className="w-6 h-6" />
              <span className="text-xs">Alert</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
              <Info className="w-6 h-6" />
              <span className="text-xs">Info</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="text-xs">Bell</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
              <Settings className="w-6 h-6" />
              <span className="text-xs">Settings</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
              <Search className="w-6 h-6" />
              <span className="text-xs">Search</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-slate-50 rounded border border-slate-100 text-sm text-slate-600">
            <strong>Standard:</strong> Lucide React icons. Default size 24px (w-6 h-6), stroke width 2px.
          </div>
        </section>

        {/* 8. BRAND ELEMENTS */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4 border-b border-slate-100 pb-2">BRAND ELEMENTS</h2>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-500 mb-3">Logo Concept</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                K
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">KataBazaar</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-3">Brand Gradients</h3>
            <div className="space-y-3">
              <div className="h-12 w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center px-4">
                <span className="text-white text-xs font-medium">Primary Gradient (Blue to Indigo)</span>
              </div>
              <div className="h-12 w-full rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center px-4">
                <span className="text-white text-xs font-medium">Accent Gradient (Indigo to Pink)</span>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Footer / Guidelines */}
      <footer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-slate-200">
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">USAGE GUIDELINES</h3>
          <p className="text-sm text-slate-600">
            These foundations serve as the baseline for all KataBazaar UI components. Ensure consistency by strictly adhering to these tokens rather than using custom values.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
            <Check className="w-4 h-4" /> DO
          </h3>
          <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
            <li>Use semantic color names for states.</li>
            <li>Stick to the 4px grid for margins/padding.</li>
            <li>Use predefined typography scales.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> DON'T
          </h3>
          <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
            <li>Introduce new hex colors in styles.</li>
            <li>Use arbitrary spacing values.</li>
            <li>Mix font weights unnecessarily.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">ACCESSIBILITY</h3>
          <p className="text-sm text-slate-600">
            All text and background color combinations must pass WCAG 2.1 AA contrast ratio (4.5:1 for normal text, 3.0:1 for large text).
          </p>
        </div>
      </footer>
    </div>
  );
}
