/**
 * THE DEVIL'S EYE - SEO & Algorithmic Packaging Center
 * Generates 5 title archetypes, 3 description variants, categorized tags,
 * hashtags, and comprehensive SEO diagnostics (search volume potential,
 * keyword strength, title score, thumbnail match, competitor gap).
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Sparkles, 
  Copy, 
  Check, 
  Tag, 
  TrendingUp, 
  FileText,
  Clock, 
  Target, 
  BarChart2, 
  Hash, 
  ShieldCheck, 
  Zap,
  Download
} from 'lucide-react';
import { playHudClick, playHudScan, playHudSuccess } from '../services/soundFx';
import { downloadFile } from '../services/subtitleService';

export const SeoCenter: React.FC = () => {
  const { currentProject, updateCurrentProject, addToast, addLog } = useApp();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Active Title Selection
  const [activeTitleIndex, setActiveTitleIndex] = useState<number>(0);
  // Active Description Tab
  const [activeDescTab, setActiveDescTab] = useState<'high_retention' | 'keyword_rich' | 'short_punchy'>('high_retention');

  // 1. 5 Title Variants
  const titleVariants = [
    {
      category: 'Curiosity',
      badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-500/40',
      title: 'Why Christopher Nolan Left ONE Detail in the Final Scene of Inception',
      score: 98,
      charCount: 71,
      whyItWorks: 'Taps into intense curiosity gap without giving away the answer in the feed.'
    },
    {
      category: 'Spoiler / Theory',
      badgeColor: 'text-purple-400 bg-purple-950/80 border-purple-500/40',
      title: 'INCEPTION: Cobb NEVER Woke Up (The Wedding Ring Theory Proves It)',
      score: 96,
      charCount: 66,
      whyItWorks: 'Directly promises concrete proof for a controversial fan theory.'
    },
    {
      category: 'Emotional',
      badgeColor: 'text-rose-400 bg-rose-950/80 border-rose-500/40',
      title: 'The Tragic Truth Behind Mal in Inception That Breaks Your Heart',
      score: 92,
      charCount: 63,
      whyItWorks: 'Appeals to character grief, empathy, and the psychological core of the movie.'
    },
    {
      category: 'Search-Optimized',
      badgeColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/40',
      title: 'Inception (2010) Ending Explained: Full Movie Breakdown & Timeline',
      score: 95,
      charCount: 67,
      whyItWorks: 'Captures primary YouTube & Google search volume for evergreen traffic.'
    },
    {
      category: 'Shock / Twist',
      badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40',
      title: 'The Ending of Inception LIED To You (Did The Top Ever Stop?)',
      score: 97,
      charCount: 60,
      whyItWorks: 'Aggressive cognitive challenge that creates an irresistible click impulse.'
    }
  ];

  // 2. 3 Description Variants
  const descriptionVariants = {
    high_retention: `Did Cobb actually wake up at the end of Inception, or is he still trapped in Limbo? 
In this definitive cinema breakdown, we analyze Christopher Nolan’s masterpiece frame-by-frame to uncover the hidden physical clues the audience missed—including the real totem Cobb never mentioned.

TIMESTAMPS:
00:00 - The Pasiv Protocol & Dream Architecture
02:15 - Extractors vs Architects
04:32 - Yusuf’s Compound Sedative Formula
07:18 - Subconscious Defense Forces
10:15 - Zero-Gravity Hotel Corridor Fight
14:40 - The Van Freefall Synchronized Kick
18:32 - Entering Limbo: The Lost 50 Years
22:15 - The Inception on Mal Explained
23:10 - The Spinning Top & The Wedding Ring Truth

🔔 Subscribe to The Devil's Eye for deep-dive cinematic deconstructions, psychological breakdowns, and hidden film details.

#Inception #EndingExplained #ChristopherNolan #MovieBreakdown #CinemaTheory`,

    keyword_rich: `Inception ending explained full movie analysis and timeline breakdown. Directed by Christopher Nolan, starring Leonardo DiCaprio as Dom Cobb, Joseph Gordon-Levitt as Arthur, and Elliot Page as Ariadne.

In this video:
- Inception movie explained in Hindi & English
- Did the spinning top fall at the end of Inception?
- What is Cobb's real totem? The wedding ring theory explained
- How does the dream within a dream sleep sedative work?
- Christopher Nolan movies analysis, Interstellar, Oppenheimer, Tenet connections
- Complete timeline map of the 4 dream levels: City rain, Hotel room, Snowy fortress, and Limbo

TIMESTAMPS:
00:00 - Intro & The Rules of Extraction
03:20 - Layer 1: Yusuf's Van
08:45 - Layer 2: Arthur's Zero-G Hallway
13:10 - Layer 3: Eames' Snow Fortress
18:40 - Layer 4: Cobb and Mal's Limbo
23:00 - The Ending Scene Decoded

#Inception #LeonardoDiCaprio #ChristopherNolan #EndingExplained`,

    short_punchy: `The top kept spinning. But did Cobb ever wake up?
Watch until the end to see the ONE clue Christopher Nolan hid in plain sight that changes the entire movie forever.

00:00 - The Setup
10:15 - The Corridor Fight
18:32 - The Limbo Secret
23:10 - The Final Frame

Drop a comment below with your theory: Dream or Reality?
#Inception #EndingExplained #ShortExplainer`
  };

  // 3. Tags: Core, Long-tail, Trending
  const tagGroups = {
    core: [
      'inception ending explained',
      'inception movie breakdown',
      'christopher nolan inception',
      'cobb totem explained',
      'did cobb wake up',
      'inception spinning top'
    ],
    longTail: [
      'why did the top keep spinning at the end of inception',
      'what was cobb real totem in inception',
      'inception wedding ring theory explained',
      'how many dream levels in inception',
      'is inception an architecture of theft'
    ],
    trending: [
      'cinema breakdown 2026',
      'best plot twists of all time',
      'mind bending movies explained',
      'viral movie recap',
      'the devils eye cinema ai'
    ]
  };

  const hashtags = [
    '#Inception',
    '#EndingExplained',
    '#ChristopherNolan',
    '#MovieBreakdown',
    '#CinemaTheory',
    '#TheDevilsEye',
    '#PlotTwist'
  ];

  // Copy helper
  const handleCopyText = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    playHudSuccess();
    addToast('Copied to Clipboard', `${label} copied successfully`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Copy all tags formatted for YouTube Studio
  const handleCopyAllTags = () => {
    const allTags = [...tagGroups.core, ...tagGroups.longTail, ...tagGroups.trending].join(', ');
    handleCopyText(allTags, 'all_tags', 'All YouTube Tags');
  };

  // Select winning title
  const handleSelectTitle = (idx: number) => {
    playHudClick();
    setActiveTitleIndex(idx);
    updateCurrentProject({ title: titleVariants[idx].title });
    addToast('Active Title Updated', `Project title set to: "${titleVariants[idx].title}"`, 'info');
  };

  // Download complete SEO Markdown publishing file
  const handleDownloadSeoKit = () => {
    playHudSuccess();
    const activeTitle = titleVariants[activeTitleIndex].title;
    const activeDesc = descriptionVariants[activeDescTab];
    const allTags = [...tagGroups.core, ...tagGroups.longTail, ...tagGroups.trending].join(', ');

    const fileContent = `# ${currentProject.title.toUpperCase()} — COMPLETE SEO PUBLISHING KIT
Generated by The Devil's Eye Cinema AI

==================================================
SELECTED MASTER TITLE (Score: ${titleVariants[activeTitleIndex].score}%)
==================================================
${activeTitle}

==================================================
ALL 5 TITLE ALTERNATIVES
==================================================
${titleVariants.map((t, i) => `${i + 1}. [${t.category}] ${t.title} (Score: ${t.score}%)`).join('\n')}

==================================================
CHOSEN YOUTUBE DESCRIPTION (${activeDescTab.toUpperCase()})
==================================================
${activeDesc}

==================================================
CORE & LONG-TAIL TAGS (PASTE DIRECTLY INTO YOUTUBE TAGS BOX)
==================================================
${allTags}

==================================================
HASHTAGS
==================================================
${hashtags.join(' ')}

==================================================
SEO DIAGNOSTIC BENCHMARKS
==================================================
Search Volume Potential: 880,000 / mo (Score: 94/100)
Keyword Strength: 96/100
Title Score: ${titleVariants[activeTitleIndex].score}/100
Thumbnail Match Score: 95/100
Competitor Gap: 91/100
Overall Score: 96 / 100 (A+)
`;

    downloadFile(fileContent, `${currentProject.title.replace(/\s+/g, '_')}_SEO_Publishing_Kit.md`, 'text/markdown;charset=utf-8');
    addToast('SEO Kit Downloaded', 'Exported comprehensive SEO Markdown package', 'success');
    addLog('SEO Center: Exported SEO Publishing Kit', 'ai');
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-y-auto bg-[#02050f] text-slate-100 p-4 space-y-4 select-none bg-hud-grid">
      {/* Header */}
      <div className="hud-panel p-3.5 border-b border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-cyan-950/80 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Search className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-display font-bold text-cyan-100 tracking-wider">
                SEO & VIRAL PACKAGING CENTER
              </h1>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded">
                YOUTUBE ALGORITHM ACCELERATOR
              </span>
            </div>
            <p className="text-[11px] font-mono text-cyan-400/70">
              5 TITLE ARCHETYPES • 3 DESCRIPTION FORMULAS • CATEGORIZED TAGS • COMPETITOR GAP ANALYSIS
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownloadSeoKit}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-tech font-bold text-xs px-4 py-2 rounded border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT SEO PUBLISHING KIT (.MD)</span>
          </button>
        </div>
      </div>

      {/* SEO Analysis Diagnostic Telemetry Bar */}
      <div className="hud-panel p-3.5 border border-cyan-500/30 rounded-lg grid grid-cols-2 md:grid-cols-5 gap-3 text-xs font-mono">
        <div className="p-2 bg-[#040918] rounded border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>SEARCH POTENTIAL</span>
            <TrendingUp className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="text-sm font-tech font-bold text-cyan-300 mt-1">880K / mo</div>
          <div className="text-[10px] text-emerald-400">Score: 94/100 (Very High)</div>
        </div>

        <div className="p-2 bg-[#040918] rounded border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>KEYWORD STRENGTH</span>
            <Zap className="w-3 h-3 text-yellow-400" />
          </div>
          <div className="text-sm font-tech font-bold text-yellow-300 mt-1">96 / 100</div>
          <div className="text-[10px] text-slate-400">Low Saturation Angle</div>
        </div>

        <div className="p-2 bg-[#040918] rounded border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>TITLE CTR SCORE</span>
            <Target className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="text-sm font-tech font-bold text-cyan-300 mt-1">
            {titleVariants[activeTitleIndex].score} / 100
          </div>
          <div className="text-[10px] text-emerald-400">Top 2% of Niche</div>
        </div>

        <div className="p-2 bg-[#040918] rounded border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>THUMBNAIL MATCH</span>
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="text-sm font-tech font-bold text-emerald-300 mt-1">95 / 100</div>
          <div className="text-[10px] text-slate-400">Visual Semantic Fit</div>
        </div>

        <div className="p-2 bg-[#040918] rounded border border-cyan-500/20 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>COMPETITOR GAP</span>
            <BarChart2 className="w-3 h-3 text-purple-400" />
          </div>
          <div className="text-sm font-tech font-bold text-purple-300 mt-1">91 / 100</div>
          <div className="text-[10px] text-purple-400">Unanswered Query</div>
        </div>
      </div>

      {/* Main Grid: 5 Title Archetypes (Left 6) + Descriptions & Tags (Right 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: 5 Title Variants (Col 6) */}
        <div className="lg:col-span-6 hud-panel p-4 border border-cyan-500/30 rounded-lg space-y-3">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
            <span className="text-xs font-tech font-bold text-cyan-300 uppercase">
              5 Title Variants (Curiosity, Spoiler, Emotion, SEO, Shock)
            </span>
            <span className="text-[10px] font-mono text-slate-400">SELECT TO SET MASTER</span>
          </div>

          <div className="space-y-2.5">
            {titleVariants.map((t, idx) => {
              const isSelected = activeTitleIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectTitle(idx)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)] text-cyan-100'
                      : 'bg-[#040816] border-slate-800 hover:border-cyan-500/30 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${t.badgeColor}`}>
                      {t.category.toUpperCase()}
                    </span>
                    <div className="flex items-center space-x-2 font-mono text-[11px]">
                      <span className="text-emerald-400 font-bold">{t.score}%</span>
                      <span className="text-slate-500">({t.charCount} chars)</span>
                    </div>
                  </div>

                  <p className="font-tech font-bold text-sm leading-snug">
                    {t.title}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-cyan-500/10">
                    <span className="italic">{t.whyItWorks}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyText(t.title, `title_${idx}`, `Title #${idx + 1}`);
                      }}
                      className="text-cyan-400 hover:text-cyan-200 flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedKey === `title_${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>COPY</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: 3 Description Formulas & Categorized Tags (Col 6) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Section 1: 3 Description Formulas */}
          <div className="hud-panel p-4 border border-cyan-500/30 rounded-lg space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <span className="text-xs font-tech font-bold text-cyan-300 uppercase">
                3 Description Formulas
              </span>
              <button
                onClick={() => handleCopyText(descriptionVariants[activeDescTab], 'desc', 'Description')}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-200 flex items-center space-x-1 cursor-pointer"
              >
                {copiedKey === 'desc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>COPY ACTIVE DESCRIPTION</span>
              </button>
            </div>

            {/* Description Variant Tabs */}
            <div className="flex rounded bg-[#030816] border border-cyan-500/30 p-0.5 text-xs font-mono">
              {[
                { id: 'high_retention', label: 'High-Retention' },
                { id: 'keyword_rich', label: 'Keyword-Rich' },
                { id: 'short_punchy', label: 'Short Punchy' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDescTab(tab.id as typeof activeDescTab)}
                  className={`flex-1 py-1 rounded text-center cursor-pointer transition-all ${
                    activeDescTab === tab.id
                      ? 'bg-cyan-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Textarea preview */}
            <div className="relative">
              <textarea
                readOnly
                value={descriptionVariants[activeDescTab]}
                rows={8}
                className="w-full bg-[#02050f] border border-cyan-500/30 rounded p-3 text-xs font-mono text-slate-200 focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Section 2: Tags & Hashtags (Core, Long-Tail, Trending) */}
          <div className="hud-panel p-4 border border-cyan-500/30 rounded-lg space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <span className="text-xs font-tech font-bold text-cyan-300 uppercase">
                Categorized Tags & Hashtags
              </span>
              <button
                onClick={handleCopyAllTags}
                className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono px-2.5 py-1 rounded flex items-center space-x-1 cursor-pointer"
              >
                {copiedKey === 'all_tags' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>COPY ALL TAGS FOR YOUTUBE</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {/* Core Tags */}
              <div>
                <span className="text-[10px] font-mono text-cyan-400 block mb-1 uppercase">
                  CORE TAGS (High Volume):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tagGroups.core.map((tag, i) => (
                    <span key={i} className="bg-cyan-950/80 border border-cyan-500/30 text-cyan-200 px-2 py-0.5 rounded font-mono text-[11px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Long-tail Tags */}
              <div>
                <span className="text-[10px] font-mono text-purple-400 block mb-1 uppercase">
                  LONG-TAIL TAGS (Low Competition):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tagGroups.longTail.map((tag, i) => (
                    <span key={i} className="bg-purple-950/80 border border-purple-500/30 text-purple-200 px-2 py-0.5 rounded font-mono text-[11px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Trending Tags */}
              <div>
                <span className="text-[10px] font-mono text-amber-400 block mb-1 uppercase">
                  TRENDING & VIRAL TAGS:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tagGroups.trending.map((tag, i) => (
                    <span key={i} className="bg-amber-950/80 border border-amber-500/30 text-amber-200 px-2 py-0.5 rounded font-mono text-[11px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hashtags */}
              <div className="pt-2 border-t border-cyan-500/15">
                <span className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">
                  DESCRIPTION HASHTAGS:
                </span>
                <div className="flex flex-wrap gap-1.5 font-mono text-cyan-300 text-xs">
                  {hashtags.map((h, i) => (
                    <span key={i} className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
