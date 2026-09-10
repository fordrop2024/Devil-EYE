/**
 * THE DEVIL'S EYE - Thumbnail Lab
 * Generates 4 distinct thumbnail archetypes: Dark Mystery, Character Emotion,
 * Cinematic Wide, High Contrast Shock.
 * Evaluates focal point, text placement, color contrast, mobile readability,
 * and curiosity gap score. Supports side-by-side comparison, winning variant selection,
 * and high-resolution PNG rendering and download.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ThumbnailVariant } from '../types';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Download, 
  TrendingUp, 
  Check, 
  Eye, 
  Sliders, 
  Smartphone, 
  Target, 
  HelpCircle, 
  Layers, 
  Trophy,
  Columns
} from 'lucide-react';
import { playHudClick, playHudScan, playHudSuccess } from '../services/soundFx';
import { renderThumbnailToBlob } from '../services/exportService';
import { downloadFile } from '../services/subtitleService';

export const ThumbnailLab: React.FC = () => {
  const { currentProject, updateCurrentProject, addToast, addLog } = useApp();

  // Initial 4 Thumbnail Concepts based on the required archetypes
  const [variants, setVariants] = useState<ThumbnailVariant[]>([
    {
      id: 'A',
      variant: 'A',
      style: 'dark_mystery',
      title: 'Dark Mystery: The Limbo Architecture',
      overlayText: 'THE 4TH DREAM LEVEL',
      badgeText: 'DARK MYSTERY ARCHETYPE',
      imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1280&q=80',
      predictedCtr: 16.8,
      focalPoint: 'Limbo Skyline & Mal Silhouette',
      textPlacement: 'Bottom Left - 15° Angle',
      colorContrast: '9.4:1 (AAA High Contrast)',
      mobileReadabilityScore: 94,
      curiosityGapScore: 98,
      active: false
    },
    {
      id: 'B',
      variant: 'B',
      style: 'character_emotion',
      title: 'Character Emotion: Cobb\'s Agony',
      overlayText: 'HE NEVER WOKE UP',
      badgeText: 'EMOTION & GRIEF CLUE',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1280&q=80',
      predictedCtr: 17.5,
      focalPoint: 'Cobb Intense Gaze + Left Hand Ring',
      textPlacement: 'Bottom Center Shock Banner',
      colorContrast: '8.9:1 (AAA Certified)',
      mobileReadabilityScore: 96,
      curiosityGapScore: 95,
      active: false
    },
    {
      id: 'C',
      variant: 'C',
      style: 'cinematic_wide',
      title: 'Cinematic Wide: Paris Folding In Half',
      overlayText: 'THE ARCHITECTURE OF DREAMS',
      badgeText: 'CINEMATIC SCALE 2.39:1',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1280&q=80',
      predictedCtr: 15.2,
      focalPoint: 'Ariadne Folding Skyline + Van Drop',
      textPlacement: 'Lower Third Cinema Bar',
      colorContrast: '8.5:1 (AAA Contrast)',
      mobileReadabilityScore: 91,
      curiosityGapScore: 92,
      active: false
    },
    {
      id: 'D',
      variant: 'D',
      style: 'high_contrast_shock',
      title: 'High Contrast Shock: The Spinning Top Clue',
      overlayText: 'THE ENDING LIED TO YOU',
      badgeText: 'PREDICTED WINNER: 18.4% CTR',
      imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1280&q=80',
      predictedCtr: 18.4,
      focalPoint: 'Spinning Brass Totem + Red Clue Indicator',
      textPlacement: 'Offset High Contrast Banner',
      colorContrast: '11.2:1 (Extreme Contrast)',
      mobileReadabilityScore: 99,
      curiosityGapScore: 99,
      active: true // Selected winner by default
    }
  ]);

  // Selected for preview and editing
  const [selectedIdx, setSelectedIdx] = useState<number>(3); // Concept D by default
  const activeThumb = variants[selectedIdx];

  // View Mode: 'studio' (focused editor) or 'comparison' (side-by-side grid)
  const [viewMode, setViewMode] = useState<'studio' | 'comparison'>('studio');

  // Customizer state
  const [customText, setCustomText] = useState<string>(activeThumb.overlayText);
  const [bannerColor, setBannerColor] = useState<string>('#ffd700'); // Yellow default

  // Update text in active variant
  const handleUpdateText = (val: string) => {
    setCustomText(val);
    const updated = variants.map((v, i) => (i === selectedIdx ? { ...v, overlayText: val } : v));
    setVariants(updated);
  };

  // Set winning thumbnail
  const handleSelectWinner = (idx: number) => {
    playHudSuccess();
    const updated = variants.map((v, i) => ({ ...v, active: i === idx }));
    setVariants(updated);
    setSelectedIdx(idx);
    updateCurrentProject({ thumbnails: updated });
    addToast('Winning Thumbnail Selected', `Selected Variant ${variants[idx].id} as the active master thumbnail for YouTube.`, 'success');
    addLog(`Thumbnail Lab: Chosen master winning thumbnail Variant ${variants[idx].id} (${variants[idx].style})`, 'ai');
  };

  // Render & Download real 1280x720 PNG
  const [isDownloading, setIsDownloading] = useState(false);
  const handleDownloadThumbnail = async () => {
    setIsDownloading(true);
    playHudScan();
    addToast('Rendering Thumbnail PNG', `Synthesizing 1280x720 master PNG for Variant ${activeThumb.id}...`, 'info');

    try {
      const blob = await renderThumbnailToBlob(activeThumb, currentProject.title, bannerColor);
      downloadFile(blob, `${currentProject.title.replace(/\s+/g, '_')}_Thumbnail_Variant_${activeThumb.id}.png`, 'image/png');
      playHudSuccess();
      addToast('Thumbnail Saved', `Variant ${activeThumb.id} PNG downloaded successfully!`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Download Failed', 'Could not render thumbnail canvas', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-y-auto bg-[#02050f] text-slate-100 p-4 space-y-4 select-none bg-hud-grid">
      {/* Top Header */}
      <div className="hud-panel p-3.5 border-b border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-cyan-950/80 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <ImageIcon className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-display font-bold text-cyan-100 tracking-wider">
                HIGH-CTR THUMBNAIL LAB
              </h1>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded">
                4 ARCHETYPES EVALUATED
              </span>
            </div>
            <p className="text-[11px] font-mono text-cyan-400/70">
              DARK MYSTERY • CHARACTER EMOTION • CINEMATIC WIDE • HIGH CONTRAST SHOCK
            </p>
          </div>
        </div>

        {/* View mode toggle & download button */}
        <div className="flex items-center space-x-2">
          {/* Studio vs Side-by-Side Comparison Toggle */}
          <div className="flex bg-[#050b18] border border-cyan-500/30 rounded p-0.5 text-xs font-mono">
            <button
              onClick={() => setViewMode('studio')}
              className={`px-3 py-1 rounded flex items-center space-x-1 cursor-pointer transition-all ${
                viewMode === 'studio' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>STUDIO</span>
            </button>
            <button
              onClick={() => setViewMode('comparison')}
              className={`px-3 py-1 rounded flex items-center space-x-1 cursor-pointer transition-all ${
                viewMode === 'comparison' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>SIDE-BY-SIDE</span>
            </button>
          </div>

          <button
            onClick={handleDownloadThumbnail}
            disabled={isDownloading}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-tech font-bold text-xs px-4 py-2 rounded border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'RENDERING PNG...' : `EXPORT VARIANT ${activeThumb.id} (1280x720)`}</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: STUDIO VIEW (Detailed Stage + Customizer + Metrics) */}
      {viewMode === 'studio' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Stage (Col 7) */}
          <div className="lg:col-span-7 hud-panel p-4 border border-cyan-500/30 rounded-lg space-y-3">
            {/* Live 16:9 Canvas Screen */}
            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-cyan-500/50 bg-black shadow-[0_0_30px_rgba(0,240,255,0.2)] flex items-center justify-center">
              <img
                src={activeThumb.imageUrl}
                alt="Active Thumbnail"
                className="w-full h-full object-cover filter contrast-125 saturate-110 brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Dynamic Neon Border */}
              <div 
                className="absolute inset-0 border-[6px] pointer-events-none transition-colors"
                style={{ borderColor: bannerColor }}
              />

              {/* Archetype & CTR Badge */}
              <div className="absolute top-4 left-4 bg-black/80 border border-cyan-400 text-cyan-300 font-tech font-bold text-xs px-2.5 py-1 rounded shadow-lg">
                {activeThumb.badgeText}
              </div>

              <div className="absolute top-4 right-4 bg-black/90 border border-emerald-400 text-emerald-300 font-mono text-xs px-2.5 py-1 rounded shadow-lg flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>PREDICTED CTR: {activeThumb.predictedCtr}%</span>
              </div>

              {/* Main Shock Overlay Banner */}
              <div className="absolute bottom-6 left-6 right-6">
                <span
                  className="inline-block font-display font-black text-xl sm:text-2xl md:text-3xl px-3.5 py-1.5 uppercase tracking-tight shadow-2xl transform -rotate-1 border-2 border-black"
                  style={{
                    backgroundColor: bannerColor,
                    color: bannerColor === '#00f0ff' ? '#000000' : bannerColor === '#ff2a5f' ? '#ffffff' : '#000000'
                  }}
                >
                  {customText}
                </span>
              </div>

              {/* Winner Stamp if active */}
              {activeThumb.active && (
                <div className="absolute bottom-4 right-4 bg-emerald-950/90 border border-emerald-400 text-emerald-200 font-tech font-bold text-xs px-2 py-0.5 rounded flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-emerald-400" />
                  <span>WINNING MASTER</span>
                </div>
              )}
            </div>

            {/* Quick Banner Color & Text Customizer */}
            <div className="p-3 bg-[#040816] rounded border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Edit Overlay Text:
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => handleUpdateText(e.target.value)}
                  className="w-full bg-[#02050f] border border-cyan-500/30 rounded p-1.5 text-xs font-bold text-yellow-300 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Banner Color Theme:
                </label>
                <div className="flex space-x-1.5">
                  {[
                    { color: '#ffd700', label: 'Yellow' },
                    { color: '#00f0ff', label: 'Cyan' },
                    { color: '#ff2a5f', label: 'Red' }
                  ].map(c => (
                    <button
                      key={c.color}
                      onClick={() => setBannerColor(c.color)}
                      className={`w-6 h-6 rounded border cursor-pointer ${
                        bannerColor === c.color ? 'border-white scale-110 shadow-md' : 'border-transparent opacity-70'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSelectWinner(selectedIdx)}
                className={`px-3 py-1.5 rounded font-tech font-bold text-xs flex items-center space-x-1 cursor-pointer transition-all ${
                  activeThumb.active
                    ? 'bg-emerald-950 border border-emerald-400 text-emerald-300'
                    : 'bg-cyan-900 hover:bg-cyan-800 border border-cyan-400/50 text-cyan-100'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{activeThumb.active ? 'WINNER ACTIVE' : 'SET AS WINNING THUMBNAIL'}</span>
              </button>
            </div>
          </div>

          {/* Metrics & Variants Selection (Col 5) */}
          <div className="lg:col-span-5 space-y-3">
            {/* Scientific YouTube Metrics Card for active variant */}
            <div className="hud-panel p-3.5 border border-cyan-500/30 rounded-lg space-y-2.5 text-xs font-mono">
              <div className="font-tech font-bold text-cyan-300 uppercase pb-1 border-b border-cyan-500/20 flex items-center justify-between">
                <span>SCIENTIFIC METRICS (VARIANT {activeThumb.id})</span>
                <span className="text-emerald-400 font-bold">{activeThumb.predictedCtr}% CTR</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-[#040918] rounded border border-cyan-500/20">
                  <span className="text-slate-500 block text-[10px] flex items-center gap-1">
                    <Target className="w-3 h-3 text-cyan-400" /> FOCAL POINT
                  </span>
                  <span className="text-cyan-200 font-medium">{activeThumb.focalPoint}</span>
                </div>

                <div className="p-2 bg-[#040918] rounded border border-cyan-500/20">
                  <span className="text-slate-500 block text-[10px] flex items-center gap-1">
                    <Layers className="w-3 h-3 text-cyan-400" /> TEXT PLACEMENT
                  </span>
                  <span className="text-cyan-200 font-medium">{activeThumb.textPlacement}</span>
                </div>

                <div className="p-2 bg-[#040918] rounded border border-cyan-500/20">
                  <span className="text-slate-500 block text-[10px] flex items-center gap-1">
                    <Eye className="w-3 h-3 text-cyan-400" /> COLOR CONTRAST
                  </span>
                  <span className="text-emerald-300 font-medium">{activeThumb.colorContrast}</span>
                </div>

                <div className="p-2 bg-[#040918] rounded border border-cyan-500/20">
                  <span className="text-slate-500 block text-[10px] flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-cyan-400" /> MOBILE READABILITY
                  </span>
                  <span className="text-cyan-300 font-bold">{activeThumb.mobileReadabilityScore}/100</span>
                </div>
              </div>

              {/* Curiosity Gap Progress Bar */}
              <div className="pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-yellow-400" /> CURIOSITY GAP SCORE
                  </span>
                  <span className="text-yellow-400 font-bold">{activeThumb.curiosityGapScore}/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-amber-400"
                    style={{ width: `${activeThumb.curiosityGapScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Archetype Thumbnails Switcher List */}
            <div className="space-y-2">
              {variants.map((v, i) => {
                const isSelected = selectedIdx === i;
                return (
                  <div
                    key={v.id}
                    onClick={() => {
                      playHudClick();
                      setSelectedIdx(i);
                      setCustomText(v.overlayText);
                    }}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center space-x-3 ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 text-cyan-100 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                        : 'bg-[#040816] border-slate-800 hover:border-cyan-500/30 text-slate-300'
                    }`}
                  >
                    <div className="w-20 aspect-video rounded overflow-hidden relative shrink-0 border border-cyan-500/30">
                      <img src={v.imageUrl} alt={v.title} className="w-full h-full object-cover" />
                      {v.active && (
                        <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-tech font-bold truncate">{v.title}</span>
                        <span className="text-xs font-mono text-emerald-400 font-bold">{v.predictedCtr}%</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 truncate">
                        "{v.overlayText}" • {v.style?.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* VIEW 2: SIDE-BY-SIDE COMPARISON MATRIX */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {variants.map((v, i) => (
            <div
              key={v.id}
              onClick={() => {
                setSelectedIdx(i);
                setCustomText(v.overlayText);
              }}
              className={`hud-panel p-3 border rounded-lg space-y-3 cursor-pointer transition-all ${
                selectedIdx === i
                  ? 'border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                  : 'border-cyan-500/20 hover:border-cyan-500/50'
              }`}
            >
              {/* Aspect-video Preview */}
              <div className="relative aspect-video rounded overflow-hidden border border-cyan-500/40 bg-black">
                <img src={v.imageUrl} alt={v.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Text banner */}
                <div className="absolute bottom-2 left-2 right-2">
                  <span className="inline-block bg-yellow-400 text-black font-display font-black text-xs px-2 py-0.5 uppercase tracking-tight">
                    {v.overlayText}
                  </span>
                </div>

                <div className="absolute top-2 right-2 bg-black/80 border border-emerald-400 text-emerald-300 font-mono text-[10px] px-1.5 py-0.5 rounded">
                  {v.predictedCtr}% CTR
                </div>
              </div>

              {/* Title & Style Tag */}
              <div>
                <div className="text-xs font-tech font-bold text-slate-100">{v.title}</div>
                <div className="text-[10px] font-mono text-cyan-400">{v.style?.replace('_', ' ').toUpperCase()}</div>
              </div>

              {/* Comparative Metrics Table */}
              <div className="space-y-1 text-[10px] font-mono pt-1 border-t border-cyan-500/10">
                <div className="flex justify-between text-slate-400">
                  <span>Mobile Readability:</span>
                  <span className="text-cyan-300 font-bold">{v.mobileReadabilityScore}/100</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Curiosity Gap:</span>
                  <span className="text-yellow-400 font-bold">{v.curiosityGapScore}/100</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Contrast Ratio:</span>
                  <span className="text-emerald-300">{v.colorContrast?.split(' ')[0]}</span>
                </div>
              </div>

              {/* Select as Winner Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectWinner(i);
                }}
                className={`w-full py-1.5 rounded font-tech font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer transition-all ${
                  v.active
                    ? 'bg-emerald-950 border border-emerald-400 text-emerald-300'
                    : 'bg-slate-900 hover:bg-cyan-950 border border-slate-700 text-slate-200'
                }`}
              >
                <Check className="w-3 h-3" />
                <span>{v.active ? 'ACTIVE WINNER' : 'SELECT AS WINNER'}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
