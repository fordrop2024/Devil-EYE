/**
 * THE DEVIL'S EYE - AI First Cut
 * Multi-Track Automated Cinema Assembly, 11-Stage Build Pipeline & 10-Factor Scoring Matrix.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCw, 
  Layers, 
  Scissors, 
  Eye, 
  DownloadCloud, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  Film, 
  ArrowRight, 
  BarChart3, 
  Volume2, 
  Clock, 
  Check, 
  Cpu, 
  X,
  Flame,
  ChevronRight
} from 'lucide-react';
import { playHudClick, playHudScan, playHudSuccess } from '../services/soundFx';
import { FIRST_CUT_STAGES } from '../services/aiFirstCutService';

export const AiFirstCut: React.FC = () => {
  const { 
    currentProject, 
    runAiFirstCut, 
    isFirstCutRunning, 
    firstCutStage, 
    firstCutProgress,
    navigateTo, 
    setIsExportModalOpen 
  } = useApp();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playheadSec, setPlayheadSec] = useState<number>(140);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);
  const [selectedReviewClipId, setSelectedReviewClipId] = useState<string | null>(null);

  const totalDuration = currentProject.timeline.totalDuration || 1472;

  const formatSecs = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const v1Clips = currentProject.timeline.tracks.find(t => t.id === 'track-v1')?.clips || [];

  // Active clip at playhead
  const currentClip = v1Clips.find(c => playheadSec >= c.startTime && playheadSec < c.startTime + c.duration) || v1Clips[0];

  // Active subtitle
  const activeSub = (currentProject.subtitles || []).find(
    s => playheadSec >= s.startSec && playheadSec <= s.endSec
  );

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-y-auto bg-[#02050f] text-slate-100 p-4 space-y-4 select-none bg-hud-grid">
      {/* 1. BUILD SYSTEM RUNNING OVERLAY */}
      {isFirstCutRunning ? (
        <div className="hud-panel p-8 rounded-lg border border-cyan-500/50 bg-[#030818]/95 shadow-[0_0_50px_rgba(0,240,255,0.2)] hud-corners flex flex-col items-center justify-center space-y-6 min-h-[500px]">
          <div className="flex items-center space-x-3 text-cyan-300">
            <Cpu className="w-8 h-8 text-cyan-400 animate-spin" />
            <div>
              <h2 className="text-xl font-display font-bold tracking-wider text-cyan-100">
                AI FIRST CUT BUILD SYSTEM ENGAGED
              </h2>
              <p className="text-xs font-mono text-cyan-400/80">
                MULTIMODAL 11-STAGE CINEMA COMPILATION PIPELINE
              </p>
            </div>
          </div>

          {/* Master Progress Bar */}
          <div className="w-full max-w-xl space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-cyan-300 font-bold uppercase">STAGE: {firstCutStage}</span>
              <span className="text-cyan-400 font-bold">{firstCutProgress}%</span>
            </div>
            <div className="w-full h-3 bg-[#02050f] border border-cyan-500/40 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_15px_#00f0ff]"
                style={{ width: `${firstCutProgress}%` }}
              />
            </div>
          </div>

          {/* 11-Stage Pipeline Node Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 w-full max-w-4xl pt-4">
            {FIRST_CUT_STAGES.map((st, idx) => {
              const isCurrent = firstCutStage === st.id;
              const isDone = firstCutProgress > ((idx + 1) / FIRST_CUT_STAGES.length) * 100 || (firstCutProgress === 100);
              return (
                <div
                  key={st.id}
                  className={`p-2 rounded border text-center font-mono text-[10px] transition-all ${
                    isCurrent
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.4)] scale-105'
                      : isDone
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-[#050b18] border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="font-tech font-bold text-xs truncate">{st.name}</div>
                  <div className="text-[9px] text-slate-400 truncate mt-0.5">
                    {isDone ? 'COMPLETE' : isCurrent ? 'PROCESSING' : 'PENDING'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          {/* 2. FIRST CUT READY HERO BANNER */}
          <div className="hud-panel p-5 rounded-lg border border-cyan-500/40 bg-gradient-to-r from-[#03091e] to-[#040e2c] flex flex-col lg:flex-row items-center justify-between gap-4 hud-corners shadow-[0_0_30px_rgba(0,240,255,0.15)]">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-cyan-950/90 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-display font-bold text-cyan-100">
                    FIRST CUT READY
                  </h1>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold">
                    V1 — AI FIRST CUT
                  </span>
                </div>
                <p className="text-xs font-mono text-cyan-400/80 mt-0.5">
                  AUTOMATED MULTIMODAL CINEMA REEL SYNCHRONIZED ACROSS 4 VIDEO TRACKS & 5 AUDIO STEMS
                </p>
              </div>
            </div>

            {/* Core Action Buttons: OPEN IN EDITOR, REGENERATE, REVIEW, EXPORT */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  playHudClick();
                  setIsReviewOpen(true);
                }}
                className="px-3.5 py-2 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/50 text-xs font-tech font-bold text-cyan-200 flex items-center space-x-1.5 cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.15)]"
              >
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>REVIEW SELECTION MATRIX</span>
              </button>

              <button
                onClick={() => {
                  playHudScan();
                  runAiFirstCut();
                }}
                className="px-3.5 py-2 rounded bg-[#071328] hover:bg-[#0c1f40] border border-cyan-500/30 text-xs font-tech text-cyan-300 flex items-center space-x-1.5 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>REGENERATE</span>
              </button>

              <button
                onClick={() => {
                  playHudClick();
                  setIsExportModalOpen(true);
                }}
                className="px-3.5 py-2 rounded bg-[#071328] hover:bg-[#0c1f40] border border-cyan-500/30 text-xs font-tech text-slate-300 flex items-center space-x-1.5 cursor-pointer"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                <span>EXPORT</span>
              </button>

              <button
                onClick={() => {
                  playHudSuccess();
                  navigateTo('pro-editor');
                }}
                className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-tech font-bold text-xs px-5 py-2 rounded border border-cyan-400/60 shadow-[0_0_18px_rgba(6,182,212,0.6)] flex items-center space-x-2 cursor-pointer"
              >
                <span>OPEN IN PRO EDITOR</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3. RUNTIME STATS COMPARISON CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Original Movie', value: '02:28:00', desc: '8,880 sec raw source', color: 'text-slate-300' },
              { label: 'Explainer Runtime', value: formatSecs(totalDuration), desc: 'Tightened story cut', color: 'text-cyan-300' },
              { label: 'Compression Ratio', value: '6:1', desc: 'Zero fluff or filler', color: 'text-emerald-400' },
              { label: 'Multi-Track Stems', value: '9 Tracks', desc: 'V1-V4 + A1-A5', color: 'text-amber-300' },
              { label: 'Pacing Continuity', value: '98.2%', desc: 'Micro-pause trimmed', color: 'text-cyan-300' },
              { label: 'Multimodal Score', value: '96.4', desc: '10-factor weighted', color: 'text-purple-300' }
            ].map((stat, i) => (
              <div key={i} className="hud-panel p-3 rounded-lg border border-cyan-500/20 bg-[#050c1e] hud-corners space-y-1">
                <div className="text-[10px] font-tech text-slate-400 uppercase tracking-wider">{stat.label}</div>
                <div className={`text-lg font-display font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-[10px] font-mono text-slate-500">{stat.desc}</div>
              </div>
            ))}
          </div>

          {/* 4. MAIN WORKSTATION: Cinema Monitor Preview + Audio Stems Mixer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Cinema Video Preview Stage (Col 8) */}
            <div className="lg:col-span-8 hud-panel rounded-lg p-3 border border-cyan-500/30 hud-corners space-y-2">
              <div className="relative aspect-video rounded overflow-hidden border border-cyan-500/40 bg-black shadow-[0_0_20px_rgba(0,240,255,0.1)] flex items-center justify-center">
                <img
                  src={currentClip?.thumbnail || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80'}
                  alt="Live Canvas"
                  className="w-full h-full object-cover"
                />

                {/* Subtitle Rendering Overlay */}
                {activeSub && (
                  <div className="absolute bottom-4 inset-x-4 text-center z-20">
                    <span className="inline-block bg-black/85 backdrop-blur-sm border border-cyan-400/40 text-amber-200 text-xs md:text-sm font-serif px-3 py-1 rounded shadow-xl leading-relaxed">
                      "{activeSub.text}"
                    </span>
                  </div>
                )}

                {/* Timecode Badge */}
                <div className="absolute top-3 left-3 bg-black/80 border border-cyan-400/60 rounded px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                  TIMECODE: {formatSecs(playheadSec)}:18
                </div>

                <div className="absolute top-3 right-3 bg-black/80 border border-cyan-400/60 rounded px-2 py-0.5 text-[10px] font-mono text-amber-300">
                  {currentClip?.title || 'Sequence Clip'}
                </div>
              </div>

              {/* Transport Controls */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPlayheadSec(Math.max(0, playheadSec - 15))}
                    className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 cursor-pointer"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      playHudClick();
                      setIsPlaying(!isPlaying);
                    }}
                    className="p-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_12px_#00f0ff] cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>
                  <button
                    onClick={() => setPlayheadSec(Math.min(totalDuration, playheadSec + 15))}
                    className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 cursor-pointer"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-cyan-400 font-bold ml-2">
                    {formatSecs(playheadSec)} / {formatSecs(totalDuration)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    playHudSuccess();
                    navigateTo('pro-editor');
                  }}
                  className="px-3 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-300 text-xs font-tech font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <span>FINE-TUNE IN PRO EDITOR</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Audio Stems Telemetry Meters (Col 4) */}
            <div className="lg:col-span-4 hud-panel rounded-lg p-3.5 border border-cyan-500/30 hud-corners space-y-3">
              <div className="text-xs font-tech font-bold uppercase text-cyan-300 border-b border-cyan-500/20 pb-2 flex items-center justify-between">
                <span>5.1 AUDIO DUCKING & MIX</span>
                <span className="text-[10px] font-mono text-emerald-400">NORMALIZED</span>
              </div>

              {[
                { name: 'A1: Narration (Ares)', vol: 92, desc: 'High priority voice stem', color: 'from-emerald-500 to-cyan-500' },
                { name: 'A2: Movie Dialogue', vol: 78, desc: 'Ducked during voice', color: 'from-blue-500 to-indigo-500' },
                { name: 'A3: SFX & Risers', vol: 85, desc: 'Braams & kinetic cuts', color: 'from-amber-500 to-orange-500' },
                { name: 'A4: Hans Zimmer Bed', vol: 68, desc: 'Ducked under dialogue', color: 'from-pink-500 to-rose-500' },
                { name: 'A5: Ambient Drone', vol: 60, desc: 'Sub-bass limbo drone', color: 'from-cyan-500 to-teal-500' }
              ].map((stem, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-tech text-slate-300">
                    <span>{stem.name}</span>
                    <span className="font-mono text-cyan-300">{stem.vol}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full border border-cyan-500/20 overflow-hidden flex">
                    <div
                      className={`h-full bg-gradient-to-r ${stem.color} rounded-full`}
                      style={{ width: `${stem.vol}%` }}
                    />
                  </div>
                  <div className="text-[9px] font-mono text-slate-500">{stem.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. MULTI-TRACK TIMELINE VISUALIZER */}
          <div className="hud-panel rounded-lg p-4 border border-cyan-500/30 hud-corners space-y-2">
            <div className="flex items-center justify-between text-xs font-tech text-slate-400 pb-1 border-b border-cyan-500/20">
              <span>MULTI-TRACK TIMELINE // 4 VIDEO • 5 AUDIO • 1 SUBTITLE</span>
              <span className="font-mono text-cyan-400 text-[11px]">CLICK ANYWHERE TO SCRUB</span>
            </div>

            <div className="space-y-2 pt-1 font-mono text-[10px]">
              {currentProject.timeline.tracks.map((track) => (
                <div key={track.id} className="flex items-center space-x-2">
                  <div className="w-32 shrink-0 flex items-center justify-between pr-2 text-slate-300 font-tech text-xs">
                    <span className="truncate">{track.name}</span>
                    <Eye className="w-3 h-3 text-cyan-400/70" />
                  </div>

                  {/* Clip Track Lane */}
                  <div
                    className="flex-1 h-9 bg-[#040a16] border border-cyan-500/20 rounded relative flex items-center overflow-hidden cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const pct = (e.clientX - rect.left) / rect.width;
                      setPlayheadSec(Math.round(pct * totalDuration));
                    }}
                  >
                    {track.clips.map((clip) => {
                      const widthPct = Math.max(6, (clip.duration / totalDuration) * 100);
                      return (
                        <div
                          key={clip.id}
                          className="h-full rounded-sm flex items-center px-2 mr-1 border border-black/40 text-white font-tech font-bold text-xs truncate cursor-pointer hover:brightness-125"
                          style={{
                            width: `${widthPct}%`,
                            backgroundColor: clip.color,
                            opacity: 0.88,
                          }}
                          title={`${clip.title} (${clip.duration}s)`}
                        >
                          <span className="truncate">{clip.title}</span>
                        </div>
                      );
                    })}

                    {/* Scrubber Playhead Line */}
                    <div
                      className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-10 shadow-[0_0_8px_#ef4444]"
                      style={{ left: `${(playheadSec / totalDuration) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 6. CLIP SELECTION 10-FACTOR SCORING MATRIX REVIEW DRAWER */}
      {isReviewOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-[#050b18] border-l border-cyan-500/40 w-full max-w-xl h-full p-5 flex flex-col space-y-4 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between border-b border-cyan-500/25 pb-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-tech font-bold text-cyan-200">
                    CLIP SELECTION SCORING MATRIX
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">
                    10-FACTOR MULTIMODAL WEIGHTED AUDIT PER NARRATION SEGMENT
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsReviewOpen(false)}
                className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {v1Clips.map((clip, i) => {
                const b = clip.scoringBreakdown || {
                  semanticRelevance: 95,
                  characterMatch: 90,
                  sceneImportance: 92,
                  visualQuality: 88,
                  storyContinuity: 94,
                  emotion: 89,
                  suspense: 91,
                  dialogueRelevance: 85,
                  durationFit: 96,
                  duplicatePenalty: 0,
                  totalScore: 92
                };

                return (
                  <div
                    key={clip.id}
                    className="p-3 rounded bg-[#081224] border border-cyan-500/20 space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-cyan-200 text-xs">{clip.title}</div>
                        <div className="text-[10px] text-slate-400">
                          Timeline: {formatSecs(clip.startTime)} - {formatSecs(clip.startTime + clip.duration)} ({clip.duration}s)
                        </div>
                      </div>
                      <div className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 font-bold text-xs">
                        SCORE: {b.totalScore}
                      </div>
                    </div>

                    {clip.selectionReason && (
                      <p className="text-[11px] text-slate-300 font-sans italic bg-[#02050f] p-2 rounded border border-cyan-500/10">
                        "{clip.selectionReason}"
                      </p>
                    )}

                    {/* 10 Factors Score Breakdown */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] pt-1">
                      <div className="flex justify-between text-slate-400">
                        <span>1. Semantic Relevance:</span>
                        <span className="text-cyan-300 font-bold">{b.semanticRelevance}%</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>2. Character Match:</span>
                        <span className="text-cyan-300 font-bold">{b.characterMatch}%</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>3. Scene Importance:</span>
                        <span className="text-cyan-300 font-bold">{b.sceneImportance}%</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>4. Visual Quality:</span>
                        <span className="text-cyan-300 font-bold">{b.visualQuality}%</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>5. Story Continuity:</span>
                        <span className="text-cyan-300 font-bold">{b.storyContinuity}%</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>6. Emotional Tone:</span>
                        <span className="text-cyan-300 font-bold">{b.emotion}%</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>7. Suspense Index:</span>
                        <span className="text-cyan-300 font-bold">{b.suspense}%</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>8. Dialogue Relevance:</span>
                        <span className="text-cyan-300 font-bold">{b.dialogueRelevance}%</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>9. Duration Fit:</span>
                        <span className="text-cyan-300 font-bold">{b.durationFit}%</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>10. Duplicate Penalty:</span>
                        <span className="text-emerald-400 font-bold">-{b.duplicatePenalty}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
