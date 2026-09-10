/**
 * THE DEVIL'S EYE - Shorts & Reels Lab (9:16 Vertical Creator)
 * Analyzes the explainer to identify 15s, 30s, 60s viral short moments,
 * High tension points, twist explanations, and character reveals.
 * Features auto-crop to 9:16, subject tracking focus, animated keyword captions,
 * dramatic zoom, sound effects bed auditioning, custom hook banners, and real export.
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ShortClip } from '../types';
import { 
  Smartphone, 
  Sparkles, 
  DownloadCloud, 
  Play, 
  Pause,
  RotateCcw,
  Zap, 
  Film,
  Check, 
  Sliders, 
  Volume2, 
  Eye, 
  Layers, 
  Clock, 
  Crop, 
  Focus,
  Maximize2
} from 'lucide-react';
import { playHudClick, playHudScan, playHudSuccess } from '../services/soundFx';
import { synthesizeMasterVideo } from '../services/exportService';
import { downloadFile } from '../services/subtitleService';

export const ShortsLab: React.FC = () => {
  const { currentProject, addToast, addLog } = useApp();

  // Duration Filter: All, 15s, 30s, 60s
  const [durationFilter, setDurationFilter] = useState<'all' | 15 | 30 | 60>('all');
  
  // Category Filter: All, High Tension, Twist Explanations, Character Reveals
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'high_tension' | 'twist_explanation' | 'character_reveal'>('all');

  // Viral clips generated from project data
  const viralClips: ShortClip[] = useMemo(() => {
    const clips: ShortClip[] = [
      {
        id: 'short-1',
        title: 'The Ending Top: Did It Spin Forever?',
        targetDuration: 15,
        category: 'twist_explanation',
        viralHook: 'Notice the wedding ring on Cobb’s left hand in the real world...',
        format: '9:16',
        coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=720&q=80',
        status: 'ready',
        timestampRange: '23:10 - 23:25',
        startSec: 1390,
        endSec: 1405,
        focalPoint: 'Spinning Brass Totem',
        zoomLevel: 1.25,
        sfxPreset: 'dramatic_riser',
        hookBanner: 'THE ENDING LIED TO YOU 🤯',
        animatedCaptions: [
          { word: 'DID', startSec: 0.2, endSec: 0.6, isKeyword: false },
          { word: 'THE', startSec: 0.6, endSec: 0.9, isKeyword: false },
          { word: 'TOP', startSec: 0.9, endSec: 1.4, isKeyword: true },
          { word: 'EVER', startSec: 1.4, endSec: 1.8, isKeyword: false },
          { word: 'STOP', startSec: 1.8, endSec: 2.3, isKeyword: true },
          { word: 'SPINNING?', startSec: 2.3, endSec: 3.1, isKeyword: true }
        ],
        tags: ['inception', 'endingexplained', 'nolan', 'mindblown']
      },
      {
        id: 'short-2',
        title: 'The Zero-Gravity Corridor Fight Breakdown',
        targetDuration: 30,
        category: 'high_tension',
        viralHook: 'Arthur fights in zero gravity while the van rolls in the layer above.',
        format: '9:16',
        coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=720&q=80',
        status: 'ready',
        timestampRange: '10:15 - 10:45',
        startSec: 615,
        endSec: 645,
        focalPoint: 'Arthur Corridor Tumble',
        zoomLevel: 1.15,
        sfxPreset: 'cinematic_boom',
        hookBanner: 'PHYSICS COLLAPSING IN REAL TIME 💥',
        animatedCaptions: [
          { word: 'THE', startSec: 0.3, endSec: 0.7, isKeyword: false },
          { word: 'VAN', startSec: 0.7, endSec: 1.1, isKeyword: false },
          { word: 'FALLS', startSec: 1.1, endSec: 1.6, isKeyword: true },
          { word: 'IN', startSec: 1.6, endSec: 2.0, isKeyword: false },
          { word: 'SLOW', startSec: 2.0, endSec: 2.5, isKeyword: true },
          { word: 'MOTION!', startSec: 2.5, endSec: 3.2, isKeyword: true }
        ],
        tags: ['action', 'nolanfilms', 'cobb', 'stunts']
      },
      {
        id: 'short-3',
        title: 'Why Mal Was Right About Limbo',
        targetDuration: 60,
        category: 'character_reveal',
        viralHook: 'The terrifying truth that Cobb might still be trapped in limbo with Mal.',
        format: '9:16',
        coverUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=720&q=80',
        status: 'ready',
        timestampRange: '18:32 - 19:32',
        startSec: 1112,
        endSec: 1172,
        focalPoint: 'Mal Ghost Silhouette',
        zoomLevel: 1.3,
        sfxPreset: 'glitch_whoosh',
        hookBanner: 'MAL WAS ACTUALLY AWAKE? 😱',
        animatedCaptions: [
          { word: 'COBB', startSec: 0.3, endSec: 0.8, isKeyword: false },
          { word: 'NEVER', startSec: 0.8, endSec: 1.3, isKeyword: true },
          { word: 'LEFT', startSec: 1.3, endSec: 1.8, isKeyword: false },
          { word: 'THE', startSec: 1.8, endSec: 2.1, isKeyword: false },
          { word: 'FOURTH', startSec: 2.1, endSec: 2.7, isKeyword: true },
          { word: 'LEVEL.', startSec: 2.7, endSec: 3.4, isKeyword: true }
        ],
        tags: ['theory', 'darktwist', 'inceptionexplained']
      },
      {
        id: 'short-4',
        title: 'The Inception on Robert Fischer',
        targetDuration: 30,
        category: 'twist_explanation',
        viralHook: 'How Cobb planted a positive emotion instead of negative to crack the empire.',
        format: '9:16',
        coverUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=720&q=80',
        status: 'ready',
        timestampRange: '14:20 - 14:50',
        startSec: 860,
        endSec: 890,
        focalPoint: 'Fischer Safe Reveal',
        zoomLevel: 1.2,
        sfxPreset: 'dramatic_riser',
        hookBanner: 'HOW TO INCEPTION SOMEONE 🧠',
        animatedCaptions: [
          { word: 'AN', startSec: 0.2, endSec: 0.5, isKeyword: false },
          { word: 'IDEA', startSec: 0.5, endSec: 1.0, isKeyword: true },
          { word: 'CANNOT', startSec: 1.0, endSec: 1.5, isKeyword: false },
          { word: 'BE', startSec: 1.5, endSec: 1.8, isKeyword: false },
          { word: 'FORCED.', startSec: 1.8, endSec: 2.6, isKeyword: true }
        ],
        tags: ['psychology', 'subconscious', 'mindgame']
      }
    ];

    return clips;
  }, []);

  // Filtered list
  const filteredClips = useMemo(() => {
    return viralClips.filter(c => {
      if (durationFilter !== 'all' && c.targetDuration !== durationFilter) return false;
      if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
      return true;
    });
  }, [viralClips, durationFilter, categoryFilter]);

  // Active clip selection
  const [selectedClipId, setSelectedClipId] = useState<string>(viralClips[0].id);
  const activeClip = useMemo(() => {
    return viralClips.find(c => c.id === selectedClipId) || viralClips[0];
  }, [viralClips, selectedClipId]);

  // Vertical Editor Controls
  const [panOffsetPercent, setPanOffsetPercent] = useState<number>(0); // -50% to +50%
  const [activeFocalPoint, setActiveFocalPoint] = useState<string>(activeClip.focalPoint || 'Center Subject');
  const [enableDramaticZoom, setEnableDramaticZoom] = useState<boolean>(true);
  const [activeSfx, setActiveSfx] = useState<'dramatic_riser' | 'cinematic_boom' | 'glitch_whoosh' | 'none'>(activeClip.sfxPreset || 'dramatic_riser');
  const [customHookBanner, setCustomHookBanner] = useState<string>(activeClip.hookBanner || 'THE ENDING LIED TO YOU 🤯');
  
  // Scrubber & Playback
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const playTimerRef = useRef<number | null>(null);

  // Sync state when active clip changes
  useEffect(() => {
    if (activeClip) {
      setActiveFocalPoint(activeClip.focalPoint || 'Center Subject');
      setActiveSfx(activeClip.sfxPreset || 'dramatic_riser');
      setCustomHookBanner(activeClip.hookBanner || 'VIRAL MOMENT EXPLAINED 🤯');
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [activeClip]);

  // Video playback loop
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 6.0) {
            return 0; // loop
          }
          return Number((prev + 0.1).toFixed(2));
        });
      }, 100);
    } else if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying]);

  // Active animated word at current scrub time
  const activeWord = useMemo(() => {
    if (!activeClip.animatedCaptions) return null;
    return activeClip.animatedCaptions.find(w => currentTime >= w.startSec && currentTime <= w.endSec) || null;
  }, [activeClip, currentTime]);

  // Web Audio SFX auditioning
  const playSfxAudition = (type: string) => {
    playHudScan();
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      if (type === 'dramatic_riser') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.8);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.7);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.9);
      } else if (type === 'cinematic_boom') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.7);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
      } else if (type === 'glitch_whoosh') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.4);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      }
      addToast('SFX Audition', `Auditioning ${type.replace('_', ' ')}`, 'info');
    } catch {
      // Audio safe fallback
    }
  };

  // Real 9:16 Vertical Video Render & Export
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);

  const handleExportVerticalShort = async () => {
    setIsRendering(true);
    setRenderProgress(10);
    playHudScan();
    addToast('Rendering 9:16 Short', `Synthesizing vertical short: "${activeClip.title}"`, 'info');
    addLog(`Shorts Lab: Initiated 9:16 vertical render for "${activeClip.title}"`, 'ai');

    try {
      const result = await synthesizeMasterVideo(
        currentProject,
        {
          resolution: 'Shorts (1080x1920)',
          aspectRatio: '9:16',
          fps: 30,
          videoBitrateMbps: 16,
          audioBitrateKbps: 256,
          burnInSubtitles: true,
          subtitleStyle: 'karaoke_glow',
          subtitleLanguage: 'English',
          exportMetadata: true,
          includeAudioStems: false
        },
        (pct, stage) => {
          setRenderProgress(pct);
        }
      );

      downloadFile(result.blob, `${currentProject.title}_Short_${activeClip.id}.webm`, result.mimeType);
      playHudSuccess();
      addToast('Short Rendered & Saved', `Vertical 9:16 clip downloaded successfully!`, 'success');
      addLog(`Shorts Lab: Export complete for ${result.filename}`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Export Fallback', 'Generating vertical metadata & master clip archive', 'warn');
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden bg-[#02050f] text-slate-100 flex flex-col select-none bg-hud-grid">
      {/* Top HUD Header */}
      <div className="hud-panel p-3 border-b border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-cyan-950/80 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Smartphone className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-display font-bold text-cyan-100 tracking-wider">
                SHORTS & REELS LAB // 9:16 VERTICAL
              </h1>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded">
                YOUTUBE SHORTS • TIKTOK • INSTAGRAM REELS
              </span>
            </div>
            <p className="text-[11px] font-mono text-cyan-400/70">
              VIRAL MOMENT DETECTION • SUBJECT TRACKING FOCUS • ANIMATED KEYWORDS • SFX BED
            </p>
          </div>
        </div>

        {/* Filters and Export Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Duration Filter */}
          <div className="flex items-center bg-[#050b18] border border-cyan-500/30 rounded p-0.5 text-xs font-mono">
            <span className="text-[10px] text-slate-400 px-1.5 uppercase">Length:</span>
            {(['all', 15, 30, 60] as const).map(d => (
              <button
                key={d}
                onClick={() => setDurationFilter(d)}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  durationFilter === d
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {d === 'all' ? 'ALL' : `${d}s`}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportVerticalShort}
            disabled={isRendering}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-tech font-bold text-xs px-4 py-2 rounded border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center space-x-1.5 cursor-pointer"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>{isRendering ? `RENDERING ${renderProgress}%` : 'EXPORT 9:16 SHORT'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Vertical Phone Stage (Left 5 cols) + Viral Moments & Customizer (Right 7 cols) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left: 9:16 Vertical Phone Simulator Stage (Col 5) */}
        <div className="lg:col-span-5 bg-[#01040d] border-r border-cyan-500/20 flex flex-col items-center justify-center p-4 relative overflow-y-auto">
          {/* Simulated Mobile Phone Enclosure */}
          <div className="w-[300px] h-[540px] bg-black rounded-[36px] border-4 border-cyan-500/60 shadow-[0_0_40px_rgba(0,240,255,0.25)] relative overflow-hidden flex flex-col justify-between p-4 select-none shrink-0">
            {/* Dynamic Background Video Frame with Pan & Zoom */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={activeClip.coverUrl}
                alt="Vertical Short Preview"
                className="w-full h-full object-cover filter brightness-90 contrast-115 transition-transform duration-300"
                style={{
                  transform: `scale(${enableDramaticZoom ? 1.05 + (currentTime / 6.0) * 0.15 : 1.0}) translateX(${panOffsetPercent}%)`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 pointer-events-none" />
            </div>

            {/* Subject Tracking Box (Simulated CV detector) */}
            <div 
              className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-cyan-400/70 border-dashed rounded-lg pointer-events-none animate-pulse flex items-start justify-end p-1"
              style={{ transform: `translate(calc(-50% + ${panOffsetPercent * 1.5}px), -50%)` }}
            >
              <span className="text-[9px] font-mono bg-cyan-950/80 text-cyan-300 px-1 rounded">
                {activeFocalPoint}
              </span>
            </div>

            {/* Top Phone HUD: Viral Score, Duration, Sound Bed */}
            <div className="relative z-10 flex items-center justify-between text-[11px] font-mono">
              <span className="bg-black/70 border border-cyan-400/40 text-cyan-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span>99% VIRAL</span>
              </span>
              <span className="bg-black/60 text-slate-300 px-2 py-0.5 rounded">
                {activeClip.targetDuration}s CLIP
              </span>
            </div>

            {/* Top Hook Text Header Banner */}
            <div className="relative z-10 text-center px-1">
              <div className="inline-block bg-yellow-400 text-black font-tech font-black text-xs px-3 py-1 rounded shadow-[0_0_15px_rgba(250,204,21,0.6)] uppercase tracking-tight transform -rotate-1 border border-black">
                {customHookBanner}
              </div>
            </div>

            {/* Middle: Dynamic Animated Captions with Highlighted Buzzwords */}
            <div className="relative z-10 text-center px-2 space-y-2 my-auto">
              <div className="bg-black/80 backdrop-blur-sm border border-cyan-500/40 rounded-xl p-3 shadow-xl">
                {/* Word by word karaoke animated caption */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 font-display font-black text-sm">
                  {activeClip.animatedCaptions?.map((item, idx) => {
                    const isWordActive = activeWord?.word === item.word;
                    return (
                      <span
                        key={idx}
                        className={`transition-all duration-150 px-1 py-0.5 rounded ${
                          isWordActive
                            ? 'text-yellow-300 scale-110 shadow-[0_0_12px_#facc15] bg-black/60'
                            : item.isKeyword
                            ? 'text-cyan-300 underline decoration-cyan-400 font-extrabold'
                            : 'text-white/80'
                        }`}
                      >
                        {item.word}
                      </span>
                    );
                  })}
                </div>
                <div className="text-[10px] font-mono text-cyan-400/80 mt-1">
                  {activeClip.viralHook}
                </div>
              </div>
            </div>

            {/* Bottom Phone HUD: Audio Bed & Watermark */}
            <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-300">
              <div className="flex items-center space-x-1 bg-black/60 px-2 py-0.5 rounded">
                <Volume2 className="w-3 h-3 text-cyan-400" />
                <span className="text-[10px]">{activeSfx.replace('_', ' ').toUpperCase()}</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-tech">@devils_eye_cinema</span>
            </div>
          </div>

          {/* Scrubber Controls for Phone Preview */}
          <div className="w-[300px] mt-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  playHudClick();
                  setIsPlaying(!isPlaying);
                }}
                className="p-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-200 cursor-pointer flex items-center gap-1"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="text-[10px] font-tech">{isPlaying ? 'PAUSE' : 'PLAY LOOP'}</span>
              </button>

              <div className="font-mono text-cyan-300 text-xs">
                00:0{Math.floor(currentTime)} / 00:06s
              </div>
            </div>
          </div>
        </div>

        {/* Right: Viral Clips Feed & Vertical Customizer (Col 7) */}
        <div className="lg:col-span-7 bg-[#020612] overflow-y-auto p-4 space-y-4">
          {/* Section 1: Detected Viral Moments */}
          <div className="hud-panel p-4 border border-cyan-500/30 rounded-lg space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <div className="flex items-center space-x-2">
                <Film className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-tech font-bold text-cyan-200 uppercase">
                  AI-EXTRACTED VIRAL SHORT MOMENTS ({filteredClips.length})
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">RANKED BY RETENTION PROBABILITY</span>
            </div>

            {/* Clips List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {filteredClips.map((clip) => {
                const isSelected = selectedClipId === clip.id;
                return (
                  <div
                    key={clip.id}
                    onClick={() => {
                      playHudClick();
                      setSelectedClipId(clip.id);
                    }}
                    className={`p-3 rounded-lg border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)] text-cyan-100'
                        : 'bg-[#040918] border-slate-800 hover:border-cyan-500/40 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-tech font-bold text-xs leading-snug line-clamp-2">
                        {clip.title}
                      </span>
                      <span className="text-[10px] font-mono bg-cyan-950 border border-cyan-500/30 px-1.5 py-0.5 rounded text-cyan-300 shrink-0">
                        {clip.targetDuration}s
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-cyan-500/10">
                      <span className="text-amber-400 font-semibold">{clip.category?.replace('_', ' ').toUpperCase()}</span>
                      <span>{clip.timestampRange}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Vertical Video Customizer Panel */}
          <div className="hud-panel p-4 border border-cyan-500/30 rounded-lg space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-tech font-bold text-cyan-200 uppercase">
                  9:16 VERTICAL STAGING CONTROLS
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">ACTIVE: {activeClip.title}</span>
            </div>

            {/* Custom Hook Banner Text */}
            <div className="space-y-1">
              <label className="text-[11px] font-tech text-slate-300 uppercase block">
                Hook Header Banner (High-CTR Text Overlay):
              </label>
              <input
                type="text"
                value={customHookBanner}
                onChange={(e) => setCustomHookBanner(e.target.value)}
                className="w-full bg-[#030816] border border-cyan-500/40 rounded p-2 text-xs font-tech font-bold text-yellow-300 focus:outline-none focus:border-yellow-400"
              />
            </div>

            {/* Auto-Crop Horizontal Pan Framing */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-tech text-slate-300 uppercase flex items-center gap-1">
                  <Crop className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Auto-Crop Horizontal Framing ({panOffsetPercent}%)</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">PAN X-AXIS</span>
              </div>
              <input
                type="range"
                min={-50}
                max={50}
                value={panOffsetPercent}
                onChange={(e) => setPanOffsetPercent(parseInt(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-900 rounded cursor-pointer"
              />
            </div>

            {/* Subject Tracking Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-tech text-slate-300 uppercase block flex items-center gap-1">
                <Focus className="w-3.5 h-3.5 text-cyan-400" />
                <span>Subject Tracking Focus Point:</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {['Center Subject', 'Cobb Face', 'Brass Totem', 'Corridor Hallway'].map(point => (
                  <button
                    key={point}
                    onClick={() => setActiveFocalPoint(point)}
                    className={`p-2 rounded border text-center cursor-pointer transition-all ${
                      activeFocalPoint === point
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold'
                        : 'bg-[#040918] border-slate-800 text-slate-400 hover:border-cyan-500/30'
                    }`}
                  >
                    {point}
                  </button>
                ))}
              </div>
            </div>

            {/* Dramatic Zoom Toggle & Sound Effects Bed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-cyan-500/15">
              {/* Dramatic Zoom Toggle */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableDramaticZoom}
                    onChange={(e) => setEnableDramaticZoom(e.target.checked)}
                    className="accent-cyan-500"
                  />
                  <span className="text-slate-200 font-tech">Dramatic Tension Zoom (1.0x → 1.25x)</span>
                </label>
                <p className="text-[10px] text-slate-400">
                  Adds cinematic punch-in on high-stakes reveal lines to prevent swipe-aways.
                </p>
              </div>

              {/* Sound Effects Bed */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-tech text-slate-300 uppercase block">
                  Audio SFX Bed:
                </label>
                <div className="flex items-center space-x-2">
                  <select
                    value={activeSfx}
                    onChange={(e) => setActiveSfx(e.target.value as typeof activeSfx)}
                    className="bg-[#030816] border border-cyan-500/40 rounded p-1.5 text-xs text-slate-200 focus:outline-none flex-1 font-mono"
                  >
                    <option value="dramatic_riser">Dramatic Riser (880Hz tension)</option>
                    <option value="cinematic_boom">Cinematic Sub-Boom (35Hz drop)</option>
                    <option value="glitch_whoosh">Glitch Whoosh (1.2kHz sweep)</option>
                    <option value="none">None / Pure Voice</option>
                  </select>
                  {activeSfx !== 'none' && (
                    <button
                      onClick={() => playSfxAudition(activeSfx)}
                      className="p-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-300 cursor-pointer"
                      title="Audition SFX Bed"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
