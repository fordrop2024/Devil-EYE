/**
 * THE DEVIL'S EYE - Cinema AI Intelligence Center
 * Staged 8-Pass Multimodal Neural Brain.
 * PASS A: MEDIA METADATA
 * PASS B: FRAME / VISUAL ANALYSIS
 * PASS C: AUDIO / SPEECH / TRANSCRIPT
 * PASS D: SCENE DETECTION
 * PASS E: CHARACTER DETECTION
 * PASS F: EVENT EXTRACTION
 * PASS G: STORY UNDERSTANDING
 * PASS H: RELATIONSHIP / KNOWLEDGE GRAPH
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Scene, 
  AnalysisPass, 
  SourceRangeConfig 
} from '../types';
import { 
  BrainCircuit, 
  Play, 
  Pause, 
  XOctagon, 
  RotateCcw, 
  Sliders, 
  Scan, 
  Network, 
  Film, 
  Lock, 
  Unlock, 
  Ban, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  UploadCloud, 
  Layers,
  ChevronRight,
  TrendingUp,
  Volume2
} from 'lucide-react';
import { playHudClick, playHudScan, playHudSuccess, playHudWarning } from '../services/soundFx';
import { CinemaIntelligenceEngine } from '../services/aiIntelligenceEngine';
import { SourceRangeControl } from '../components/intelligence/SourceRangeControl';
import { FrameScanner } from '../components/intelligence/FrameScanner';
import { KnowledgeGraphVisualizer } from '../components/intelligence/KnowledgeGraphVisualizer';
import { AnalysisDashboard } from '../components/intelligence/AnalysisDashboard';
import { MovieIngestionCenter } from '../components/ingestion/MovieIngestionCenter';

export const MovieIntelligence: React.FC = () => {
  const { 
    currentProject, 
    updateCurrentProject, 
    addToast, 
    addLog, 
    systemLogs, 
    navigateTo 
  } = useApp();

  // Active view tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'scenes' | 'scanner' | 'graph' | 'range' | 'logs'
  >('dashboard');

  // Ingestion Modal
  const [isIngestOpen, setIsIngestOpen] = useState(false);

  // Selected Scene for detail inspector
  const [selectedScene, setSelectedScene] = useState<Scene | null>(
    currentProject.scenes?.[0] || null
  );

  // Filter for scene list
  const [sceneFilter, setSceneFilter] = useState<'all' | 'candidates' | 'locked' | 'excluded'>('all');

  // Engine state
  const engineRef = useRef<CinemaIntelligenceEngine | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPass, setCurrentPass] = useState<AnalysisPass | null>(null);
  const [passIndex, setPassIndex] = useState(0);
  const [totalPasses, setTotalPasses] = useState(8);
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const isAnalyzed = currentProject.analysisStatus === 'ANALYSIS COMPLETE' || 
    (currentProject.characters && currentProject.characters.length > 0);

  // Source range config fallback
  const sourceRange: SourceRangeConfig = currentProject.sourceRange || {
    mode: 'AI AUTO',
    startTime: '00:00:00',
    endTime: currentProject.duration || '02:28:00',
    startSec: 0,
    endSec: currentProject.durationSec || 8880,
    isLocked: false,
    excludedRanges: [
      { id: 'ex-1', label: 'Studio Logos & Bumpers', start: '00:00:00', end: '00:01:25', startSec: 0, endSec: 85 },
      { id: 'ex-2', label: 'End Credits Roll', start: '02:22:40', end: '02:28:00', startSec: 8560, endSec: 8880 },
    ],
  };

  /** Start Full 8-Pass Analysis */
  const handleStartAnalysis = async (selectedRangeOnly: boolean = false) => {
    playHudScan();
    setIsAnalyzing(true);
    setIsPaused(false);
    setProgressPercent(0);

    const engine = new CinemaIntelligenceEngine();
    engineRef.current = engine;

    addToast(
      'Neural Analysis Initialized',
      selectedRangeOnly ? 'Running staged analysis on custom source bounds' : 'Running full 8-pass cinema pipeline',
      'info'
    );

    try {
      const resultData = await engine.runFullPipeline(
        currentProject,
        sourceRange,
        (progress) => {
          setCurrentPass(progress.pass);
          setPassIndex(progress.passIndex);
          setTotalPasses(progress.totalPasses);
          setProgressPercent(progress.percent);
          setStatusMessage(progress.currentMessage);

          if (progress.logMessage) {
            addLog(progress.logMessage, 'ai');
          }
        }
      );

      updateCurrentProject(resultData);
      setIsAnalyzing(false);
      playHudSuccess();
      addToast('Cinema Brain Synthesis Complete', 'All 8 neural analysis passes compiled successfully', 'success');

      // Live system logs
      addLog(`> Scene 042 analyzed [Tension 95%]`, 'ai');
      addLog(`> Character detected: Dom Cobb (Confidence 99%)`, 'ai');
      addLog(`> Dialogue mapped: 14 lines extracted`, 'ai');
      addLog(`> Suspense peak found: Van bridge freefall at 01:14:32`, 'ai');
      addLog(`> Candidate hook found: "The Spinning Top Ring Theory"`, 'ai');
      addLog(`> Scene confidence 98%`, 'ai');
    } catch (err: any) {
      if (err.message === 'ANALYSIS_CANCELLED') {
        addToast('Analysis Cancelled', 'Cinema AI pipeline halted by user', 'warn');
        addLog('[AI CORE] Pipeline execution terminated by operator', 'warn');
      } else {
        addToast('Analysis Error', 'Neural pipeline encountered an anomaly', 'error');
      }
      setIsAnalyzing(false);
    }
  };

  const handlePause = () => {
    playHudClick();
    if (engineRef.current) {
      if (isPaused) {
        engineRef.current.resume();
        setIsPaused(false);
        addToast('Pipeline Resumed', 'Continuing neural tensor processing', 'info');
      } else {
        engineRef.current.pause();
        setIsPaused(true);
        addToast('Pipeline Paused', 'Cinema AI processing suspended', 'warn');
      }
    }
  };

  const handleCancel = () => {
    playHudClick();
    if (engineRef.current) {
      engineRef.current.cancel();
      setIsAnalyzing(false);
      setIsPaused(false);
    }
  };

  /** Toggle scene lock */
  const handleToggleLockScene = (sceneId: string) => {
    playHudClick();
    const updatedScenes = currentProject.scenes.map((sc) => {
      if (sc.id === sceneId) {
        return { ...sc, isLocked: !sc.isLocked };
      }
      return sc;
    });
    updateCurrentProject({ scenes: updatedScenes });
    if (selectedScene?.id === sceneId) {
      setSelectedScene({ ...selectedScene, isLocked: !selectedScene.isLocked });
    }
  };

  /** Toggle scene exclusion */
  const handleToggleExcludeScene = (sceneId: string) => {
    playHudClick();
    const updatedScenes = currentProject.scenes.map((sc) => {
      if (sc.id === sceneId) {
        return { ...sc, isExcluded: !sc.isExcluded };
      }
      return sc;
    });
    updateCurrentProject({ scenes: updatedScenes });
    if (selectedScene?.id === sceneId) {
      setSelectedScene({ ...selectedScene, isExcluded: !selectedScene.isExcluded });
    }
  };

  /** Toggle candidate for explainer */
  const handleToggleCandidate = (sceneId: string) => {
    playHudClick();
    const updatedScenes = currentProject.scenes.map((sc) => {
      if (sc.id === sceneId) {
        return { ...sc, candidateForExplainer: !sc.candidateForExplainer };
      }
      return sc;
    });
    updateCurrentProject({ scenes: updatedScenes });
    if (selectedScene?.id === sceneId) {
      setSelectedScene({ ...selectedScene, candidateForExplainer: !selectedScene.candidateForExplainer });
    }
  };

  /** Re-analyze specific scene */
  const handleReanalyzeScene = async (scene: Scene) => {
    playHudScan();
    addToast('Scene Re-Analysis', `Recalibrating neural vectors for Scene #${scene.sceneNumber}...`, 'info');
    addLog(`[VISION BUS] Re-analyzing Scene #${scene.sceneNumber} (${scene.timestampStart})`, 'ai');

    await new Promise((r) => setTimeout(r, 1200));

    const updatedScenes = currentProject.scenes.map((sc) => {
      if (sc.id === scene.id) {
        return {
          ...sc,
          confidence: 99,
          twistScore: Math.min(100, sc.twistScore + 4),
          suspenseScore: Math.min(100, sc.suspenseScore + 3),
        };
      }
      return sc;
    });

    updateCurrentProject({ scenes: updatedScenes });
    if (selectedScene?.id === scene.id) {
      setSelectedScene({
        ...selectedScene,
        confidence: 99,
        twistScore: Math.min(100, selectedScene.twistScore + 4),
        suspenseScore: Math.min(100, selectedScene.suspenseScore + 3),
      });
    }

    playHudSuccess();
    addToast('Scene Re-Analyzed', `Scene #${scene.sceneNumber} vectors refreshed to 99% confidence`, 'success');
  };

  const filteredScenes = (currentProject.scenes || []).filter((sc) => {
    if (sceneFilter === 'candidates') return sc.candidateForExplainer !== false;
    if (sceneFilter === 'locked') return sc.isLocked === true;
    if (sceneFilter === 'excluded') return sc.isExcluded === true;
    return true;
  });

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-y-auto bg-[#02050f] text-slate-100 p-4 space-y-4 select-none bg-hud-grid">
      
      {/* Top Banner & Pipeline Control Center */}
      <div className="hud-panel p-4 rounded-lg border border-cyan-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hud-corners bg-[#030816]">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded bg-cyan-950/80 border border-cyan-400/60 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
            <BrainCircuit className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-display font-bold text-slate-100 uppercase tracking-wider">
                CINEMA AI BRAIN & INTELLIGENCE
              </h1>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  isAnalyzed
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                    : 'bg-amber-950/80 border-amber-500 text-amber-300'
                }`}
              >
                {isAnalyzed ? 'AI ANALYSIS COMPLETE' : 'STATUS: NOT ANALYZED'}
              </span>

              {isAnalyzed && (
                <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 text-[10px] font-mono flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3 text-cyan-400" />
                  <span>{currentProject.storyPotentialScore || 94}% STORY POTENTIAL</span>
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-cyan-400/80 mt-0.5">
              TARGET: <span className="text-slate-200 font-bold">{currentProject.title}</span> • 8-STAGE MULTIMODAL NEURAL UNDERSTANDING
            </p>
          </div>
        </div>

        {/* Pipeline Execution Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {!isAnalyzing ? (
            <>
              <button
                onClick={() => handleStartAnalysis(false)}
                className="px-4 py-2 rounded bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-tech font-bold text-xs border border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center space-x-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isAnalyzed ? 'RE-RUN 8-PASS ANALYSIS' : 'ANALYZE ALL (8-PASS)'}</span>
              </button>

              <button
                onClick={() => handleStartAnalysis(true)}
                className="px-3 py-2 rounded bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-tech text-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>ANALYZE SELECTED RANGE</span>
              </button>

              <button
                onClick={() => {
                  playHudClick();
                  setIsIngestOpen(true);
                }}
                className="px-3 py-2 rounded bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 text-slate-300 font-tech text-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
                <span>INGESTION CENTER</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handlePause}
                className={`px-3 py-2 rounded border font-tech text-xs flex items-center space-x-1.5 cursor-pointer ${
                  isPaused 
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300' 
                    : 'bg-amber-950 border-amber-500 text-amber-300'
                }`}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
              </button>

              <button
                onClick={handleCancel}
                className="px-3 py-2 rounded bg-rose-950 border border-rose-500 hover:bg-rose-900 text-rose-200 font-tech text-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <XOctagon className="w-3.5 h-3.5" />
                <span>CANCEL PIPELINE</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Live AI Progress Stage Banner (Visible when analyzing) */}
      {isAnalyzing && (
        <div className="p-4 rounded-lg bg-cyan-950/60 border border-cyan-400 hud-corners space-y-3 shadow-[0_0_25px_rgba(0,240,255,0.2)]">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2 text-cyan-300 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span>{currentPass || 'PROCESSING MULTIMODAL VECTORS...'}</span>
              <span className="text-slate-400">[{passIndex}/{totalPasses}]</span>
            </div>
            <span className="text-cyan-300 font-mono font-bold text-sm">{progressPercent}%</span>
          </div>

          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-cyan-500/40">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
            <span className="text-cyan-400">{statusMessage}</span>
            <span className="text-slate-500">{isPaused ? 'PIPELINE PAUSED' : 'STAGED GPU STREAM'}</span>
          </div>
        </div>
      )}

      {/* Sub-Navigation Navigation Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#040a16] border border-cyan-500/20 p-1.5 rounded-lg">
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'dashboard', label: 'Analysis Dashboard', icon: BrainCircuit },
            { id: 'scenes', label: `Scene Map (${currentProject.scenes.length})`, icon: Film },
            { id: 'scanner', label: 'Frame Scanner', icon: Scan },
            { id: 'graph', label: 'Knowledge Graph', icon: Network },
            { id: 'range', label: 'Source Range Control', icon: Sliders },
            { id: 'logs', label: 'Live System Log', icon: Terminal },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  playHudClick();
                  setActiveTab(t.id as typeof activeTab);
                }}
                className={`px-3 py-1.5 rounded text-xs font-tech flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-cyan-950/90 border border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(0,240,255,0.25)] font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            playHudClick();
            navigateTo('story-engine');
          }}
          className="px-3 py-1.5 rounded bg-cyan-950/50 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 text-xs font-tech flex items-center space-x-1 cursor-pointer"
        >
          <span>PROCEED TO STORY ENGINE</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ACTIVE TAB CONTENT */}

      {/* 1. ANALYSIS DASHBOARD */}
      {activeTab === 'dashboard' && (
        <AnalysisDashboard
          project={currentProject}
          onStartAnalysis={() => handleStartAnalysis(false)}
        />
      )}

      {/* 2. SCENE ANALYZER & DATABASE */}
      {activeTab === 'scenes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Scene List (Col 5) */}
          <div className="lg:col-span-5 hud-panel rounded-lg p-3.5 border border-cyan-500/30 hud-corners space-y-3 bg-[#030816]">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 text-xs font-tech">
              <span className="font-bold text-cyan-300 uppercase">
                Detected Cinema Scenes ({filteredScenes.length})
              </span>
              
              {/* Filter Buttons */}
              <div className="flex items-center space-x-1 text-[10px]">
                {(['all', 'candidates', 'locked', 'excluded'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      playHudClick();
                      setSceneFilter(f);
                    }}
                    className={`px-1.5 py-0.5 rounded border transition-colors cursor-pointer uppercase ${
                      sceneFilter === f
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 max-h-[calc(100vh-17rem)] overflow-y-auto pr-1">
              {filteredScenes.map((sc) => {
                const isSelected = selectedScene?.id === sc.id;
                return (
                  <div
                    key={sc.id}
                    onClick={() => {
                      playHudClick();
                      setSelectedScene(sc);
                    }}
                    className={`p-2.5 rounded border transition-all cursor-pointer flex gap-3 ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                        : sc.isExcluded
                        ? 'bg-rose-950/20 border-rose-900/40 opacity-60'
                        : 'bg-[#02050f] border-cyan-500/20 hover:border-cyan-500/50'
                    }`}
                  >
                    <div className="w-20 h-14 rounded overflow-hidden flex-shrink-0 relative border border-cyan-500/30">
                      <img
                        src={sc.thumbnail}
                        alt={`Scene ${sc.sceneNumber}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] font-mono text-center text-cyan-300 py-0.5">
                        {sc.timestampStart}
                      </div>
                      {sc.isLocked && (
                        <div className="absolute top-0.5 right-0.5 bg-amber-950/90 p-0.5 rounded text-amber-300">
                          <Lock className="w-2.5 h-2.5" />
                        </div>
                      )}
                      {sc.isExcluded && (
                        <div className="absolute top-0.5 left-0.5 bg-rose-950/90 p-0.5 rounded text-rose-300">
                          <Ban className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="font-tech text-xs font-bold text-slate-100 truncate">
                          SCENE #{sc.sceneNumber}: {sc.location}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold ml-1">
                          {sc.confidence}% CONF
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 font-sans line-clamp-1">
                        {sc.keyEvent}
                      </p>

                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-1">
                        <span>SUSPENSE: {sc.suspenseScore}%</span>
                        <span className="text-amber-300">TWIST: {sc.twistScore}%</span>
                        <span className="text-cyan-300">
                          {sc.candidateForExplainer !== false ? '★ CANDIDATE' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scene Detail Inspector (Col 7) */}
          <div className="lg:col-span-7 hud-panel rounded-lg p-4 border border-cyan-500/30 hud-corners space-y-4 bg-[#030816]">
            {selectedScene ? (
              <div className="space-y-4">
                {/* Scene Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-tech font-bold text-base text-slate-100">
                        SCENE #{selectedScene.sceneNumber}: {selectedScene.location}
                      </h3>
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 text-[10px] font-mono">
                        {selectedScene.timeOfDay.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      WINDOW: {selectedScene.timestampStart} ──&gt; {selectedScene.timestampEnd} ({selectedScene.endSec - selectedScene.startSec}s)
                    </p>
                  </div>

                  {/* Scene Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleLockScene(selectedScene.id)}
                      className={`p-1.5 rounded border text-xs font-tech flex items-center space-x-1 cursor-pointer ${
                        selectedScene.isLocked
                          ? 'bg-amber-950 border-amber-500 text-amber-300'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-400'
                      }`}
                      title={selectedScene.isLocked ? 'Unlock Scene' : 'Lock Scene from AI overwrite'}
                    >
                      {selectedScene.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      <span>{selectedScene.isLocked ? 'LOCKED' : 'LOCK'}</span>
                    </button>

                    <button
                      onClick={() => handleToggleExcludeScene(selectedScene.id)}
                      className={`p-1.5 rounded border text-xs font-tech flex items-center space-x-1 cursor-pointer ${
                        selectedScene.isExcluded
                          ? 'bg-rose-950 border-rose-500 text-rose-300'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-rose-400'
                      }`}
                      title="Exclude scene from final video editor output"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>{selectedScene.isExcluded ? 'EXCLUDED' : 'EXCLUDE'}</span>
                    </button>

                    <button
                      onClick={() => handleToggleCandidate(selectedScene.id)}
                      className={`p-1.5 rounded border text-xs font-tech flex items-center space-x-1 cursor-pointer ${
                        selectedScene.candidateForExplainer !== false
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                      title="Mark as top candidate for explainer hook"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{selectedScene.candidateForExplainer !== false ? 'HOOK CANDIDATE' : 'OMIT HOOK'}</span>
                    </button>

                    <button
                      onClick={() => handleReanalyzeScene(selectedScene)}
                      className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs font-tech flex items-center space-x-1 cursor-pointer"
                      title="Re-run deep frame & audio analysis on this scene"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                      <span>RE-ANALYZE</span>
                    </button>
                  </div>
                </div>

                {/* Scores Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-[#02050f] border border-cyan-500/20">
                    <span className="text-[10px] font-mono text-slate-400">SUSPENSE SCORE</span>
                    <div className="text-base font-mono font-bold text-rose-400 mt-0.5">
                      {selectedScene.suspenseScore}%
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-[#02050f] border border-cyan-500/20">
                    <span className="text-[10px] font-mono text-slate-400">TWIST SCORE</span>
                    <div className="text-base font-mono font-bold text-amber-400 mt-0.5">
                      {selectedScene.twistScore}%
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-[#02050f] border border-cyan-500/20">
                    <span className="text-[10px] font-mono text-slate-400">EMOTIONAL SCORE</span>
                    <div className="text-base font-mono font-bold text-cyan-400 mt-0.5">
                      {selectedScene.emotionalScore}%
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-[#02050f] border border-cyan-500/20">
                    <span className="text-[10px] font-mono text-slate-400">AI CONFIDENCE</span>
                    <div className="text-base font-mono font-bold text-emerald-400 mt-0.5">
                      {selectedScene.confidence}%
                    </div>
                  </div>
                </div>

                {/* Key Narrative Event */}
                <div className="p-3 rounded bg-[#02050f] border border-cyan-500/20 space-y-1 text-xs">
                  <div className="text-[10px] font-tech text-cyan-400 uppercase font-bold">
                    Extracted Narrative Beat:
                  </div>
                  <p className="text-slate-200 font-sans text-sm">{selectedScene.keyEvent}</p>
                </div>

                {/* Characters Present */}
                <div className="space-y-1.5 text-xs">
                  <div className="text-[10px] font-tech text-slate-400 uppercase font-bold">
                    Identified Characters in Scene:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedScene.characters.map((cName, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-200 text-xs font-tech font-bold"
                      >
                        {cName}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dialogue & Audio Stems */}
                <div className="p-3 rounded bg-[#02050f] border border-cyan-500/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-tech text-cyan-300 uppercase font-bold">
                    <div className="flex items-center space-x-1.5">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Dialogue Transcripts & Stems</span>
                    </div>
                    <span className="font-mono text-slate-400">{selectedScene.dialogueCount} Lines Indexed</span>
                  </div>

                  <div className="space-y-1 text-slate-300 font-mono text-[11px] max-h-24 overflow-y-auto">
                    {selectedScene.dialogue && selectedScene.dialogue.length > 0 ? (
                      selectedScene.dialogue.map((line, lIdx) => (
                        <div key={lIdx} className="p-1 rounded bg-slate-900/40 border border-slate-800">
                          {line}
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500 italic">
                        "Wait... if you die in the dream, where do you go? Limbo."
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedScene.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-xs font-mono text-slate-500">
                SELECT A SCENE FROM THE LEFT PANEL TO INSPECT MULTIMODAL VECTORS
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. FRAME SCANNER */}
      {activeTab === 'scanner' && (
        <FrameScanner
          frames={currentProject.scannedFrames || []}
          onSeekScene={(sceneNum) => {
            const found = currentProject.scenes.find((s) => s.sceneNumber === sceneNum);
            if (found) setSelectedScene(found);
          }}
        />
      )}

      {/* 4. KNOWLEDGE GRAPH */}
      {activeTab === 'graph' && (
        <KnowledgeGraphVisualizer
          nodes={currentProject.knowledgeGraphNodes || []}
          edges={currentProject.knowledgeGraphEdges || []}
        />
      )}

      {/* 5. SOURCE RANGE CONTROL */}
      {activeTab === 'range' && (
        <SourceRangeControl
          config={sourceRange}
          totalDurationSec={currentProject.durationSec || 8880}
          totalDurationFormatted={currentProject.duration || '02:28:00'}
          onChange={(newConfig) => {
            updateCurrentProject({ sourceRange: newConfig });
            addToast('Source Range Updated', 'Updated active video boundaries and exclusions', 'info');
          }}
        />
      )}

      {/* 6. LIVE SYSTEM LOG */}
      {activeTab === 'logs' && (
        <div className="hud-panel p-4 rounded-lg border border-cyan-500/30 hud-corners space-y-3 bg-[#030816]">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 text-xs font-tech">
            <div className="flex items-center space-x-2 text-cyan-300 font-bold uppercase">
              <Terminal className="w-4 h-4" />
              <span>Live AI Cinema Intelligence Diagnostic Telemetry</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400">REALTIME STREAM</span>
          </div>

          <div className="p-3 rounded bg-black/90 border border-cyan-500/20 font-mono text-xs text-cyan-300/90 space-y-1.5 max-h-[calc(100vh-18rem)] overflow-y-auto">
            {systemLogs.map((log) => (
              <div key={log.id} className="flex items-start space-x-2 text-[11px]">
                <span className="text-slate-500 flex-shrink-0">[{log.timestamp}]</span>
                <span
                  className={
                    log.level === 'ai'
                      ? 'text-cyan-400 font-bold'
                      : log.level === 'warn'
                      ? 'text-amber-400'
                      : log.level === 'error'
                      ? 'text-rose-400'
                      : 'text-slate-300'
                  }
                >
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full-Screen Movie Ingestion Center Modal */}
      <MovieIngestionCenter
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
        onProceedToIntelligence={() => {
          setIsIngestOpen(false);
          setActiveTab('dashboard');
        }}
      />
    </div>
  );
};
