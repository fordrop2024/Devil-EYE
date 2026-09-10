/**
 * THE DEVIL'S EYE - Story Engine
 * 11-Genre Aware Story Engine, 13-Stage YouTube Explainer Arc,
 * Interactive Dynamic Tension Curve, Information Delay Strategy, and Versioning.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GitFork, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  History, 
  BookOpen, 
  ShieldAlert, 
  Sliders, 
  ArrowRight,
  Eye,
  Volume2,
  Check,
  RotateCcw,
  Film
} from 'lucide-react';
import { 
  ExplainerGenre, 
  NarrativeStage, 
  NARRATIVE_STAGES_SEQUENCE, 
  StoryBeat,
  StoryVersion 
} from '../types';
import { generateStoryBeats, GENRE_STRATEGIES, DURATION_TARGETS } from '../services/storyEngineService';
import { playHudClick, playHudScan, playHudSuccess } from '../services/soundFx';

export const StoryEngine: React.FC = () => {
  const { 
    currentProject, 
    updateCurrentProject, 
    executeAiCommand, 
    isAiThinking, 
    addToast,
    navigateTo,
    setSelectedSegmentId,
    saveStoryVersion,
    restoreStoryVersion,
    runStoryDirectorCommand
  } = useApp();

  const [selectedBeatIndex, setSelectedBeatIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'beats' | 'tension' | 'versions' | 'strategy'>('beats');
  const [newVersionName, setNewVersionName] = useState<string>('');

  const currentGenre = (currentProject.storyConfig?.selectedGenre || 'Psychological') as ExplainerGenre;
  const currentDuration = currentProject.storyConfig?.targetDuration || '20 min';
  const delayInfoActive = currentProject.storyConfig?.delayInformationStrategy ?? true;

  // Use project story beats or generate if empty
  const storyBeats: StoryBeat[] = currentProject.storyBeats && currentProject.storyBeats.length >= 13 
    ? currentProject.storyBeats 
    : generateStoryBeats(currentProject, currentGenre, currentDuration);

  const selectedBeat = storyBeats[selectedBeatIndex] || storyBeats[0];

  const handleGenreChange = (genre: ExplainerGenre) => {
    playHudClick();
    const newBeats = generateStoryBeats(currentProject, genre, currentDuration);
    updateCurrentProject({
      storyBeats: newBeats,
      storyConfig: {
        ...(currentProject.storyConfig || {
          targetDuration: currentDuration,
          targetDurationSec: 1200,
          targetWords: 3000,
          estimatedNarrationDuration: '20:00',
          estimatedNarrationSec: 1200,
          language: 'English',
          delayInformationStrategy: true
        }),
        selectedGenre: genre,
        storytellingStrategy: GENRE_STRATEGIES[genre]
      }
    });
    addToast('Genre Architecture Updated', `Calibrated 13-stage arc for ${genre} storytelling.`, 'info');
  };

  const handleDurationChange = (dur: '8 min' | '12 min' | '15 min' | '20 min' | '30 min') => {
    playHudClick();
    const config = DURATION_TARGETS[dur];
    const newBeats = generateStoryBeats(currentProject, currentGenre, dur);
    updateCurrentProject({
      storyBeats: newBeats,
      storyConfig: {
        ...(currentProject.storyConfig || {
          selectedGenre: currentGenre,
          language: 'English',
          delayInformationStrategy: true,
          storytellingStrategy: GENRE_STRATEGIES[currentGenre]
        }),
        targetDuration: dur,
        targetDurationSec: config.seconds,
        targetWords: config.words,
        estimatedNarrationDuration: config.narrationEst,
        estimatedNarrationSec: config.seconds
      }
    });
    addToast('Target Duration Scaled', `Re-timed 13 beats to ${dur} (${config.words} target words).`, 'info');
  };

  const handleToggleDelayInfo = () => {
    playHudClick();
    const nextVal = !delayInfoActive;
    updateCurrentProject({
      storyConfig: {
        ...(currentProject.storyConfig || {
          selectedGenre: currentGenre,
          targetDuration: currentDuration,
          targetDurationSec: 1200,
          targetWords: 3000,
          estimatedNarrationDuration: '20:00',
          estimatedNarrationSec: 1200,
          language: 'English',
          storytellingStrategy: GENRE_STRATEGIES[currentGenre]
        }),
        delayInformationStrategy: nextVal
      }
    });
    addToast(
      nextVal ? 'Information Delay Enabled' : 'Linear Revelation Mode',
      nextVal ? 'Clues and secrets will be withheld to maximize viewer retention.' : 'Information presented chronologically.',
      'info'
    );
  };

  const handleGenerateFreshArc = () => {
    playHudScan();
    const freshBeats = generateStoryBeats(currentProject, currentGenre, currentDuration);
    updateCurrentProject({ storyBeats: freshBeats });
    addToast('Story Arc Regenerated', `Constructed fresh 13-stage ${currentGenre} narrative spine.`, 'success');
  };

  const handleSaveVersion = () => {
    saveStoryVersion(newVersionName.trim() || undefined);
    setNewVersionName('');
  };

  const handleJumpToScript = (beat: StoryBeat) => {
    playHudClick();
    if (beat.scriptSegmentId) {
      setSelectedSegmentId(beat.scriptSegmentId);
    }
    navigateTo('script-studio');
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-y-auto bg-[#02050f] text-slate-100 p-4 space-y-4 select-none bg-hud-grid">
      {/* Header HUD Panel */}
      <div className="hud-panel p-4 rounded-lg border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hud-corners">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded bg-cyan-950/80 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <GitFork className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-display font-bold text-cyan-100 tracking-wider">
                STORY ENGINE // 13-STAGE NARRATIVE ARCHITECTURE
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400/40 text-cyan-300">
                AI CINEMA BRAIN
              </span>
            </div>
            <p className="text-xs font-mono text-cyan-400/70">
              YOUTUBE EXPLAINER STORYTELLING • NON-CHRONOLOGICAL HOOKS • TENSION CURVES
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleGenerateFreshArc}
            disabled={isAiThinking}
            className="bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/60 rounded px-3 py-1.5 text-xs font-tech text-cyan-200 flex items-center space-x-1.5 cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>RE-GENERATE 13-STAGE ARC</span>
          </button>

          <button
            onClick={() => navigateTo('script-studio')}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-tech font-bold text-xs px-3.5 py-1.5 rounded border border-cyan-400/60 flex items-center space-x-1.5 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.4)]"
          >
            <span>OPEN SCRIPT STUDIO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Controls Bar: Genre Selector + Target Duration + Information Delay Strategy */}
      <div className="hud-panel p-4 rounded-lg border border-cyan-500/30 hud-corners space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Genre Selection (Col 6) */}
          <div className="lg:col-span-6 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-tech uppercase text-cyan-300">
              <span className="flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>GENRE STRATEGY ({Object.keys(GENRE_STRATEGIES).length} ARCHETYPES)</span>
              </span>
              <span className="font-mono text-[10px] text-slate-400">SELECT TO RE-CALIBRATE</span>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(GENRE_STRATEGIES) as ExplainerGenre[]).map((genre) => {
                const isSelected = currentGenre === genre;
                return (
                  <button
                    key={genre}
                    onClick={() => handleGenreChange(genre)}
                    className={`px-2.5 py-1 rounded text-xs font-tech border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(0,240,255,0.3)] font-bold'
                        : 'bg-[#050b18] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-cyan-500/40'
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Duration Selector (Col 3) */}
          <div className="lg:col-span-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-tech uppercase text-cyan-300">
              <span className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>TARGET DURATION</span>
              </span>
              <span className="font-mono text-[10px] text-cyan-400">
                {currentProject.storyConfig?.targetWords || 3000} WORDS
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {(['8 min', '12 min', '15 min', '20 min', '30 min'] as const).map((dur) => (
                <button
                  key={dur}
                  onClick={() => handleDurationChange(dur)}
                  className={`py-1 text-center rounded text-[11px] font-mono border transition-all cursor-pointer ${
                    currentDuration === dur
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold'
                      : 'bg-[#050b18] border-slate-800 text-slate-400 hover:border-cyan-500/40'
                  }`}
                >
                  {dur}
                </button>
              ))}
            </div>
          </div>

          {/* Delay Information Strategy (Col 3) */}
          <div className="lg:col-span-3 bg-[#040a1a] border border-cyan-500/30 rounded-lg p-2.5 flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <div className="text-xs font-tech font-bold text-cyan-200 flex items-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>DELAY INFORMATION</span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans leading-tight">
                Holdback key secrets & twist to hook audience curiosity
              </p>
            </div>
            <button
              onClick={handleToggleDelayInfo}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer border ${
                delayInfoActive ? 'bg-cyan-600 border-cyan-300' : 'bg-slate-800 border-slate-700'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                  delayInfoActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Storytelling Strategy Display Banner */}
        <div className="bg-[#030713] border border-cyan-500/20 rounded p-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-tech text-cyan-400 font-bold uppercase">Active Story Spine:</span>
            <span className="text-slate-300 font-sans italic">{GENRE_STRATEGIES[currentGenre]}</span>
          </div>
          <span className="font-mono text-[10px] text-cyan-400">
            13 STAGES • EST. NARRATION: {currentProject.storyConfig?.estimatedNarrationDuration || '20:00'}
          </span>
        </div>
      </div>

      {/* Main Studio View: Tabs */}
      <div className="flex items-center space-x-2 border-b border-cyan-500/20 pb-1">
        <button
          onClick={() => setActiveTab('beats')}
          className={`px-3 py-1.5 rounded text-xs font-tech transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'beats'
              ? 'bg-cyan-950 border border-cyan-400 text-cyan-200 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>13-STAGE NARRATIVE GRID</span>
        </button>

        <button
          onClick={() => setActiveTab('tension')}
          className={`px-3 py-1.5 rounded text-xs font-tech transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'tension'
              ? 'bg-cyan-950 border border-cyan-400 text-cyan-200 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>TENSION CURVE DYNAMICS</span>
        </button>

        <button
          onClick={() => setActiveTab('versions')}
          className={`px-3 py-1.5 rounded text-xs font-tech transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'versions'
              ? 'bg-cyan-950 border border-cyan-400 text-cyan-200 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>STORY VERSIONS ({currentProject.storyVersions?.length || 1})</span>
        </button>
      </div>

      {/* TAB 1: 13-STAGE NARRATIVE GRID */}
      {activeTab === 'beats' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Stage Cards Horizontal/Grid List (Col 7) */}
          <div className="lg:col-span-7 space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto pr-1">
            {storyBeats.map((beat, idx) => {
              const isSelected = selectedBeatIndex === idx;
              return (
                <div
                  key={beat.id}
                  onClick={() => {
                    playHudClick();
                    setSelectedBeatIndex(idx);
                  }}
                  className={`hud-panel rounded-lg p-3 border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/70 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'border-cyan-500/20 hover:border-cyan-500/50 bg-[#040816]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        STAGE {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </span>
                      <span className="text-[10px] font-tech uppercase px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                        {beat.stage}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] font-mono">
                      <span className="text-slate-400">{beat.timestampTarget}</span>
                      <span className={`font-bold ${beat.tensionScore >= 85 ? 'text-rose-400' : beat.tensionScore >= 70 ? 'text-amber-400' : 'text-cyan-400'}`}>
                        {beat.tensionScore}% TENSION
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-tech font-bold text-slate-100 mb-1">
                    {beat.headline}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 font-sans mb-2">
                    {beat.explainerNarrationGoal}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1.5 border-t border-cyan-500/10">
                    <div className="flex items-center space-x-1 text-cyan-400">
                      <Film className="w-3 h-3" />
                      <span>Scene: {beat.sourceSceneTitle}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Target: {beat.targetWords} words ({beat.targetDurationSec}s)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Beat Inspector & Deep Linking (Col 5) */}
          <div className="lg:col-span-5 hud-panel rounded-lg p-4 border border-cyan-500/30 hud-corners space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase">
                  Stage {selectedBeatIndex + 1} of 13
                </span>
                <h2 className="text-base font-tech font-bold text-cyan-200">
                  {selectedBeat.stage}: {selectedBeat.headline}
                </h2>
              </div>

              <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-cyan-950 border border-cyan-400/40 text-cyan-300">
                {selectedBeat.timestampTarget}
              </span>
            </div>

            {/* Tension gauge */}
            <div className="bg-[#030713] rounded p-3 border border-cyan-500/20 space-y-1.5">
              <div className="flex justify-between text-xs font-tech">
                <span className="text-slate-300">Dramatic Tension Index</span>
                <span className="font-mono text-cyan-300 font-bold">{selectedBeat.tensionScore}/100</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    selectedBeat.tensionScore >= 85 ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  style={{ width: `${selectedBeat.tensionScore}%` }}
                />
              </div>
            </div>

            {/* Explainer Narration Objective */}
            <div className="space-y-1">
              <div className="text-xs font-tech uppercase text-cyan-300 font-bold">
                Explainer Narration Objective
              </div>
              <p className="text-xs text-slate-200 font-sans leading-relaxed bg-[#030713] p-2.5 rounded border border-cyan-500/20">
                {selectedBeat.explainerNarrationGoal}
              </p>
            </div>

            {/* Information Delay & Mystery Strategy */}
            <div className="space-y-1">
              <div className="text-xs font-tech uppercase text-amber-300 font-bold flex items-center space-x-1">
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                <span>Information Withheld / Mystery Hook</span>
              </div>
              <p className="text-xs text-slate-300 font-sans italic bg-[#030713] p-2.5 rounded border border-amber-500/20">
                "{selectedBeat.informationWithheld}"
              </p>
            </div>

            {/* Connected Source Scene Card */}
            <div className="bg-[#050b18] border border-cyan-500/30 rounded p-3 space-y-2">
              <div className="flex items-center justify-between text-xs font-tech text-cyan-300">
                <span className="flex items-center space-x-1.5">
                  <Film className="w-3.5 h-3.5 text-cyan-400" />
                  <span>CONNECTED CINEMA SCENE</span>
                </span>
                <span className="font-mono text-[10px] text-slate-400">ID: {selectedBeat.sourceSceneId}</span>
              </div>

              <div className="text-xs text-slate-200 font-sans">
                <strong>{selectedBeat.sourceSceneTitle}</strong>
              </div>

              <p className="text-[11px] text-slate-400 font-sans">
                Visual Action: {selectedBeat.visualCues}
              </p>

              <button
                onClick={() => handleJumpToScript(selectedBeat)}
                className="w-full mt-2 py-1.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/60 text-xs font-tech text-cyan-200 flex items-center justify-center space-x-1.5 cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.2)]"
              >
                <span>EDIT NARRATION IN SCRIPT STUDIO</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TENSION CURVE DYNAMICS */}
      {activeTab === 'tension' && (
        <div className="hud-panel p-4 rounded-lg border border-cyan-500/30 hud-corners space-y-4">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
            <div className="flex items-center space-x-2 text-xs font-tech font-bold text-cyan-300">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>13-STAGE SUSPENSE & RETENTION CURVE (TARGET: {currentDuration})</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">
              PEAK: {Math.max(...storyBeats.map(b => b.tensionScore))}% AT CLIMAX
            </span>
          </div>

          {/* SVG 13-Point Tension Graph */}
          <div className="relative h-64 bg-[#030713] rounded border border-cyan-500/30 p-3 flex flex-col justify-between">
            <svg className="w-full h-full" viewBox="0 0 1300 220" preserveAspectRatio="none">
              <defs>
                <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[40, 90, 140, 190].map((y, i) => (
                <line key={i} x1="0" y1={y} x2="1300" y2={y} stroke="#00f0ff" strokeOpacity="0.1" strokeDasharray="4 4" />
              ))}

              {/* Polylines based on 13 beats */}
              {(() => {
                const points = storyBeats.map((b, i) => {
                  const x = (i / (storyBeats.length - 1)) * 1260 + 20;
                  const y = 200 - (b.tensionScore / 100) * 170;
                  return { x, y, beat: b };
                });

                const pathData = points.reduce((acc, p, i) => {
                  return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
                }, '');

                const fillData = `${pathData} L ${points[points.length - 1].x} 220 L ${points[0].x} 220 Z`;

                return (
                  <>
                    <path d={fillData} fill="url(#curveFill)" />
                    <path d={pathData} fill="none" stroke="#00f0ff" strokeWidth="3" />

                    {points.map((p, idx) => (
                      <g 
                        key={idx} 
                        className="cursor-pointer"
                        onClick={() => {
                          playHudClick();
                          setSelectedBeatIndex(idx);
                        }}
                      >
                        <circle 
                          cx={p.x} 
                          cy={p.y} 
                          r={selectedBeatIndex === idx ? 8 : 5} 
                          fill={p.beat.tensionScore >= 85 ? '#ef4444' : p.beat.tensionScore >= 70 ? '#f59e0b' : '#00f0ff'} 
                          stroke="#ffffff"
                          strokeWidth={selectedBeatIndex === idx ? 2 : 1}
                        />
                        <text 
                          x={p.x} 
                          y={p.y - 12} 
                          fill="#a5f3fc" 
                          fontSize="11" 
                          textAnchor="middle" 
                          fontFamily="monospace"
                        >
                          {p.beat.tensionScore}%
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>

            {/* X-Axis 13 Stage Markers */}
            <div className="grid grid-cols-13 gap-0.5 text-center pt-2 border-t border-cyan-500/20">
              {storyBeats.map((b, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedBeatIndex(idx)}
                  className={`cursor-pointer transition-colors ${selectedBeatIndex === idx ? 'text-cyan-300 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <div className="text-[9px] font-mono">{idx + 1}</div>
                  <div className="text-[8px] font-tech uppercase truncate">{b.stage}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STORY VERSIONS */}
      {activeTab === 'versions' && (
        <div className="hud-panel p-4 rounded-lg border border-cyan-500/30 hud-corners space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-tech font-bold text-cyan-200 uppercase">
                STORY SNAPSHOTS & VERSION CONTROL
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newVersionName}
                onChange={(e) => setNewVersionName(e.target.value)}
                placeholder="Snapshot Name (e.g. V2 - High Suspense Hook)"
                className="bg-[#040816] border border-cyan-500/30 rounded px-2.5 py-1 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleSaveVersion}
                className="px-3 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-xs font-tech text-cyan-200 cursor-pointer"
              >
                SAVE SNAPSHOT
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(currentProject.storyVersions || []).map((ver) => (
              <div
                key={ver.id}
                className="bg-[#040916] border border-cyan-500/20 hover:border-cyan-400/50 rounded-lg p-3 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-300 font-bold">{ver.versionName}</span>
                  <span className="text-slate-400 text-[10px]">{ver.timestamp}</span>
                </div>

                <div className="text-xs text-slate-300 font-sans">
                  {ver.summary}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-cyan-500/10">
                  <span>{ver.genre} • {ver.durationLabel}</span>
                  <button
                    onClick={() => restoreStoryVersion(ver.id)}
                    className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-900 cursor-pointer"
                  >
                    RESTORE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
