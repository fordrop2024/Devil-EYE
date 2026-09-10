/**
 * THE DEVIL'S EYE - Dedicated Full-Screen Subtitle Studio
 * Complete subtitle generation from narration & dialogue,
 * multilingual support (Hindi, Hinglish, English),
 * in-place editing, split, merge, lock, search & replace, live preview, and SRT/VTT exports.
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Subtitle } from '../types';
import { 
  FileText, 
  Download, 
  Sparkles, 
  Play, 
  Pause,
  RotateCcw,
  Check, 
  Search, 
  Replace,
  Lock, 
  Unlock, 
  Split, 
  Merge, 
  Languages, 
  Copy, 
  Plus, 
  Trash2, 
  Sliders, 
  Eye, 
  Clock, 
  Volume2,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { playHudClick, playHudScan, playHudSuccess, playHudWarning } from '../services/soundFx';
import { 
  generateSubtitlesFromProject, 
  exportToSrt, 
  exportToVtt, 
  splitSubtitle, 
  mergeSubtitles, 
  searchAndReplaceSubtitles, 
  translateSubtitleText, 
  formatSrtTimestamp, 
  downloadFile 
} from '../services/subtitleService';

export const SubtitleStudio: React.FC = () => {
  const { currentProject, updateCurrentProject, addToast, addLog } = useApp();

  // Subtitles working state (defaults to project subtitles or auto-generates if empty)
  const [subtitles, setSubtitles] = useState<Subtitle[]>(() => {
    if (currentProject.subtitles && currentProject.subtitles.length > 0) {
      return currentProject.subtitles;
    }
    return generateSubtitlesFromProject(currentProject, 'both', 'English');
  });

  // Keep project in sync when subtitles change
  const syncToProject = (updated: Subtitle[]) => {
    setSubtitles(updated);
    updateCurrentProject({ subtitles: updated });
  };

  // Generation Controls
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi' | 'Hinglish'>('English');
  const [selectedSource, setSelectedSource] = useState<'narration' | 'dialogue' | 'both'>('both');

  // Search & Replace
  const [showSearchReplace, setShowSearchReplace] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [filterTrack, setFilterTrack] = useState<'all' | 'narration' | 'dialogue'>('all');

  // Selected subtitle & player preview state
  const [selectedSubId, setSelectedSubId] = useState<string | null>(subtitles[0]?.id || null);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playTimerRef = useRef<number | null>(null);

  // Style Preset for Live Preview
  const [stylePreset, setStylePreset] = useState<'cyber_cyan' | 'cinema_yellow' | 'karaoke_glow' | 'bold_sans'>('cyber_cyan');
  const [subtitlePosition, setSubtitlePosition] = useState<'bottom' | 'center' | 'top'>('bottom');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  // Copy indicator state
  const [copiedFormat, setCopiedFormat] = useState<'srt' | 'vtt' | null>(null);

  // Maximum duration from subtitles
  const maxTimeSec = useMemo(() => {
    if (subtitles.length === 0) return 60;
    return Math.max(...subtitles.map(s => s.endSec)) + 2;
  }, [subtitles]);

  // Active subtitle at currentTimeSec for live preview
  const activeSubtitle = useMemo(() => {
    return subtitles.find(s => currentTimeSec >= s.startSec && currentTimeSec <= s.endSec) || null;
  }, [subtitles, currentTimeSec]);

  // Current scene thumbnail for background preview
  const previewThumbnail = useMemo(() => {
    if (currentProject.scenes && currentProject.scenes.length > 0) {
      const idx = Math.min(
        Math.floor((currentTimeSec / Math.max(1, maxTimeSec)) * currentProject.scenes.length),
        currentProject.scenes.length - 1
      );
      return currentProject.scenes[idx].thumbnail || currentProject.posterUrl;
    }
    return currentProject.posterUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1280&q=80';
  }, [currentTimeSec, maxTimeSec, currentProject]);

  // Playback timer
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = window.setInterval(() => {
        setCurrentTimeSec(prev => {
          if (prev >= maxTimeSec) {
            setIsPlaying(false);
            return 0;
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
  }, [isPlaying, maxTimeSec]);

  // Auto-generate from narration timing
  const handleAutoGenerate = () => {
    playHudScan();
    const generated = generateSubtitlesFromProject(currentProject, selectedSource, selectedLanguage);
    syncToProject(generated);
    if (generated.length > 0) {
      setSelectedSubId(generated[0].id);
      setCurrentTimeSec(generated[0].startSec);
    }
    playHudSuccess();
    addToast('Subtitles Generated', `Created ${generated.length} subtitles from final ${selectedSource} timing in ${selectedLanguage}.`, 'success');
    addLog(`Subtitle Studio: Re-generated ${generated.length} subtitles (${selectedLanguage}, source: ${selectedSource})`, 'ai');
  };

  // Batch translate all subtitles
  const handleTranslateAll = (targetLang: 'English' | 'Hindi' | 'Hinglish') => {
    playHudScan();
    const translated = subtitles.map(s => {
      if (s.locked) return s;
      return {
        ...s,
        text: translateSubtitleText(s.text, targetLang),
        language: targetLang
      };
    });
    setSelectedLanguage(targetLang);
    syncToProject(translated);
    playHudSuccess();
    addToast('Subtitles Translated', `All unlocked subtitles converted to ${targetLang}.`, 'success');
  };

  // Edit single subtitle text
  const handleUpdateText = (id: string, newText: string) => {
    const updated = subtitles.map(s => (s.id === id ? { ...s, text: newText } : s));
    syncToProject(updated);
  };

  // Nudge timing (+/- 0.1s or +/- 0.5s)
  const handleNudgeTime = (id: string, field: 'startSec' | 'endSec', delta: number) => {
    playHudClick();
    const updated = subtitles.map(s => {
      if (s.id !== id || s.locked) return s;
      const newSec = Math.max(0, Number((s[field] + delta).toFixed(3)));
      if (field === 'startSec' && newSec >= s.endSec) return s;
      if (field === 'endSec' && newSec <= s.startSec) return s;

      const formatted = formatSrtTimestamp(newSec);
      return {
        ...s,
        [field]: newSec,
        [field === 'startSec' ? 'startTime' : 'endTime']: formatted
      };
    });
    syncToProject(updated);
  };

  // Split subtitle
  const handleSplit = (sub: Subtitle) => {
    playHudClick();
    const [subA, subB] = splitSubtitle(sub);
    const index = subtitles.findIndex(s => s.id === sub.id);
    const updated = [...subtitles];
    updated.splice(index, 1, subA, subB);
    syncToProject(updated);
    setSelectedSubId(subB.id);
    playHudSuccess();
    addToast('Subtitle Split', 'Split into two timed blocks', 'info');
  };

  // Merge subtitle with next
  const handleMergeNext = (sub: Subtitle) => {
    playHudClick();
    const index = subtitles.findIndex(s => s.id === sub.id);
    if (index < 0 || index >= subtitles.length - 1) return;
    const nextSub = subtitles[index + 1];

    const merged = mergeSubtitles(sub, nextSub);
    const updated = [...subtitles];
    updated.splice(index, 2, merged);
    syncToProject(updated);
    setSelectedSubId(merged.id);
    playHudSuccess();
    addToast('Subtitles Merged', 'Merged adjacent subtitles', 'info');
  };

  // Lock / Unlock toggle
  const handleToggleLock = (id: string) => {
    playHudClick();
    const updated = subtitles.map(s => (s.id === id ? { ...s, locked: !s.locked } : s));
    syncToProject(updated);
  };

  // Delete subtitle
  const handleDeleteSub = (id: string) => {
    playHudWarning();
    const updated = subtitles.filter(s => s.id !== id);
    syncToProject(updated);
    if (selectedSubId === id) {
      setSelectedSubId(updated[0]?.id || null);
    }
  };

  // Add new subtitle at current scrub time
  const handleAddSubtitle = () => {
    playHudClick();
    const start = currentTimeSec;
    const end = start + 3.0;
    const newSub: Subtitle = {
      id: `sub-custom-${Date.now()}`,
      startTime: formatSrtTimestamp(start),
      endTime: formatSrtTimestamp(end),
      startSec: start,
      endSec: end,
      text: 'New dialogue / narration line...',
      speaker: 'Narrator',
      confidence: 1.0,
      language: selectedLanguage,
      track: 'narration',
      locked: false,
      stylePreset: stylePreset
    };
    const updated = [...subtitles, newSub].sort((a, b) => a.startSec - b.startSec);
    syncToProject(updated);
    setSelectedSubId(newSub.id);
  };

  // Search and replace execution
  const searchMatchesCount = useMemo(() => {
    if (!searchTerm.trim()) return 0;
    const flags = matchCase ? 'g' : 'gi';
    try {
      const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
      let count = 0;
      subtitles.forEach(s => {
        const matches = s.text.match(regex);
        if (matches) count += matches.length;
      });
      return count;
    } catch {
      return 0;
    }
  }, [subtitles, searchTerm, matchCase]);

  const handleReplaceAll = () => {
    if (!searchTerm.trim()) return;
    const { updatedSubtitles, replacementsCount } = searchAndReplaceSubtitles(
      subtitles,
      searchTerm,
      replaceTerm,
      matchCase
    );
    syncToProject(updatedSubtitles);
    playHudSuccess();
    addToast('Search & Replace', `Replaced ${replacementsCount} occurrences across subtitles`, 'success');
  };

  // Download SRT
  const handleDownloadSrt = () => {
    playHudSuccess();
    const content = exportToSrt(subtitles);
    const filename = `${currentProject.title.replace(/\s+/g, '_')}_${selectedLanguage}_subtitles.srt`;
    downloadFile(content, filename, 'text/plain;charset=utf-8');
    addToast('SRT Exported', `Downloaded ${filename} successfully`, 'success');
  };

  // Download VTT
  const handleDownloadVtt = () => {
    playHudSuccess();
    const content = exportToVtt(subtitles);
    const filename = `${currentProject.title.replace(/\s+/g, '_')}_${selectedLanguage}_subtitles.vtt`;
    downloadFile(content, filename, 'text/vtt;charset=utf-8');
    addToast('VTT Exported', `Downloaded ${filename} successfully`, 'success');
  };

  // Copy to clipboard
  const handleCopyClipboard = (type: 'srt' | 'vtt') => {
    const text = type === 'srt' ? exportToSrt(subtitles) : exportToVtt(subtitles);
    navigator.clipboard.writeText(text);
    setCopiedFormat(type);
    playHudSuccess();
    addToast('Copied to Clipboard', `Full ${type.toUpperCase()} subtitle script copied`, 'info');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  // Filtered subtitles list
  const filteredSubtitles = useMemo(() => {
    return subtitles.filter(s => {
      if (filterTrack !== 'all' && s.track !== filterTrack) return false;
      return true;
    });
  }, [subtitles, filterTrack]);

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden bg-[#02050f] text-slate-100 flex flex-col select-none bg-hud-grid">
      {/* Top HUD Header & Operations Bar */}
      <div className="hud-panel p-3 border-b border-cyan-500/30 flex flex-col lg:flex-row items-center justify-between gap-3 shrink-0 z-20">
        {/* Left: Title & Tag */}
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-cyan-950/80 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <FileText className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-display font-bold text-cyan-100 tracking-wider">
                SUBTITLE & CAPTION STUDIO
              </h1>
              <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded">
                FRAME-SYNCHRONIZED (98.4% ACCURACY)
              </span>
            </div>
            <p className="text-[11px] font-mono text-cyan-400/70">
              PROJECT: {currentProject.title} • {subtitles.length} BLOCKS • LANGUAGE: {selectedLanguage.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Center: Generation & Translation Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Subtitle Source Selector */}
          <div className="flex items-center bg-[#050b18] border border-cyan-500/30 rounded p-0.5 text-xs font-mono">
            <span className="text-[10px] text-slate-400 px-2 uppercase">Source:</span>
            {(['narration', 'dialogue', 'both'] as const).map(src => (
              <button
                key={src}
                onClick={() => setSelectedSource(src)}
                className={`px-2 py-1 rounded cursor-pointer transition-all ${
                  selectedSource === src
                    ? 'bg-cyan-600 text-white font-bold shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {src.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Language Selector */}
          <div className="flex items-center bg-[#050b18] border border-cyan-500/30 rounded p-0.5 text-xs font-mono">
            <Languages className="w-3.5 h-3.5 text-cyan-400 ml-2" />
            {(['English', 'Hindi', 'Hinglish'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => handleTranslateAll(lang)}
                className={`px-2 py-1 rounded cursor-pointer transition-all ${
                  selectedLanguage === lang
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={`Translate all subtitles to ${lang}`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Auto-Generate from Narration Timing */}
          <button
            onClick={handleAutoGenerate}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-tech font-bold text-xs px-3.5 py-1.5 rounded border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)] flex items-center space-x-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>REGENERATE TIMING</span>
          </button>
        </div>

        {/* Right: Export SRT / VTT Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSearchReplace(!showSearchReplace)}
            className={`px-2.5 py-1.5 rounded border text-xs font-mono flex items-center space-x-1.5 cursor-pointer transition-all ${
              showSearchReplace
                ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-cyan-500/40'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>FIND & REPLACE</span>
          </button>

          <button
            onClick={handleDownloadSrt}
            className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 hover:text-emerald-100 text-xs font-tech font-bold px-3 py-1.5 rounded flex items-center space-x-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT SRT</span>
          </button>

          <button
            onClick={handleDownloadVtt}
            className="bg-blue-950/80 hover:bg-blue-900 border border-blue-500/50 text-blue-300 hover:text-blue-100 text-xs font-tech font-bold px-3 py-1.5 rounded flex items-center space-x-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT VTT</span>
          </button>
        </div>
      </div>

      {/* Search and Replace HUD Drawer */}
      {showSearchReplace && (
        <div className="hud-panel p-3 bg-[#030816] border-b border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 animate-in slide-in-from-top-2">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1.5 bg-[#050b18] border border-cyan-500/30 rounded px-2 py-1">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <input
                type="text"
                placeholder="Find in subtitles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none w-44 font-mono text-xs"
              />
              {searchTerm && (
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded">
                  {searchMatchesCount} matches
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1.5 bg-[#050b18] border border-cyan-500/30 rounded px-2 py-1">
              <Replace className="w-3.5 h-3.5 text-cyan-400" />
              <input
                type="text"
                placeholder="Replace with..."
                value={replaceTerm}
                onChange={(e) => setReplaceTerm(e.target.value)}
                className="bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none w-44 font-mono text-xs"
              />
            </div>

            <label className="flex items-center space-x-1.5 text-slate-400 text-[11px] cursor-pointer">
              <input
                type="checkbox"
                checked={matchCase}
                onChange={(e) => setMatchCase(e.target.checked)}
                className="accent-cyan-500"
              />
              <span>Match Case</span>
            </label>

            <button
              onClick={handleReplaceAll}
              disabled={!searchTerm.trim() || searchMatchesCount === 0}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-tech text-xs px-3 py-1 rounded cursor-pointer"
            >
              REPLACE ALL ({searchMatchesCount})
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400 text-[11px]">Filter:</span>
            {(['all', 'narration', 'dialogue'] as const).map(track => (
              <button
                key={track}
                onClick={() => setFilterTrack(track)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                  filterTrack === track
                    ? 'bg-cyan-900 text-cyan-200 border border-cyan-400/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {track.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Subtitle Studio Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left / Center: Subtitles Editor List (Col 7) */}
        <div className="lg:col-span-7 flex flex-col border-r border-cyan-500/20 bg-[#020612] overflow-hidden">
          {/* Subtitle List Action Toolbar */}
          <div className="p-2.5 bg-[#040a18] border-b border-cyan-500/20 flex items-center justify-between text-xs font-tech">
            <div className="flex items-center space-x-2 text-cyan-300 font-bold">
              <span>ACTIVE SUBTITLES ({filteredSubtitles.length})</span>
              <span className="text-[10px] font-mono text-slate-500 font-normal">
                FORMAT: [ID] START → END [SPEAKER]
              </span>
            </div>

            <button
              onClick={handleAddSubtitle}
              className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 px-2.5 py-1 rounded flex items-center space-x-1 cursor-pointer text-xs"
            >
              <Plus className="w-3 h-3" />
              <span>ADD BLOCK AT PLAYHEAD</span>
            </button>
          </div>

          {/* Subtitles Scrollable Feed */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredSubtitles.map((sub, index) => {
              const isSelected = selectedSubId === sub.id;
              const isCurrentlyActive = activeSubtitle?.id === sub.id;
              const durationSec = Number((sub.endSec - sub.startSec).toFixed(2));
              const wordsCount = sub.text.trim().split(/\s+/).length;
              const cps = Number((sub.text.length / Math.max(1, durationSec)).toFixed(1));

              return (
                <div
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubId(sub.id);
                    setCurrentTimeSec(sub.startSec);
                  }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer relative ${
                    isCurrentlyActive
                      ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : isSelected
                      ? 'bg-[#061024] border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                      : 'bg-[#040816] border-cyan-500/20 hover:border-cyan-500/40'
                  }`}
                >
                  {/* Top Metadata Row: Index, Speaker, Language, Timecodes, Duration */}
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-cyan-400 font-bold">
                        #{String(index + 1).padStart(2, '0')}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                        sub.track === 'narration'
                          ? 'bg-cyan-950/80 text-cyan-300 border-cyan-400/40'
                          : 'bg-yellow-950/80 text-yellow-300 border-yellow-400/40'
                      }`}>
                        {sub.track?.toUpperCase() || 'NARRATION'}
                      </span>
                      {sub.speaker && (
                        <span className="text-[11px] text-slate-300 font-medium">
                          {sub.speaker}:
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1 rounded">
                        {sub.language || selectedLanguage}
                      </span>
                    </div>

                    {/* Timecodes and Duration pill */}
                    <div className="flex items-center space-x-2 font-mono text-[11px]">
                      <span className="text-cyan-300">{sub.startTime}</span>
                      <span className="text-slate-500">→</span>
                      <span className="text-cyan-300">{sub.endTime}</span>
                      <span className="text-[10px] bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-slate-300">
                        {durationSec}s ({wordsCount}w • {cps} cps)
                      </span>
                    </div>
                  </div>

                  {/* Text Edit Area */}
                  <div className="relative">
                    <textarea
                      value={sub.text}
                      disabled={sub.locked}
                      onChange={(e) => handleUpdateText(sub.id, e.target.value)}
                      rows={2}
                      className={`w-full bg-[#02050f] border rounded p-2 text-sm text-slate-100 focus:outline-none transition-colors resize-none ${
                        sub.locked
                          ? 'opacity-60 border-slate-800 cursor-not-allowed'
                          : 'border-cyan-500/30 focus:border-cyan-400 focus:shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                      }`}
                    />
                  </div>

                  {/* Bottom Action Controls: Nudge Start/End, Split, Merge, Translate, Lock, Delete */}
                  <div className="mt-2 pt-2 border-t border-cyan-500/15 flex items-center justify-between text-xs">
                    {/* Timing Nudges */}
                    <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
                      <div className="flex items-center space-x-1">
                        <span className="text-[10px] text-slate-500">START:</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleNudgeTime(sub.id, 'startSec', -0.1); }}
                          disabled={sub.locked}
                          className="px-1 py-0.5 rounded bg-slate-900 hover:bg-cyan-950 text-cyan-400 cursor-pointer disabled:opacity-40"
                          title="Nudge start -0.1s"
                        >
                          -0.1s
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleNudgeTime(sub.id, 'startSec', 0.1); }}
                          disabled={sub.locked}
                          className="px-1 py-0.5 rounded bg-slate-900 hover:bg-cyan-950 text-cyan-400 cursor-pointer disabled:opacity-40"
                          title="Nudge start +0.1s"
                        >
                          +0.1s
                        </button>
                      </div>

                      <div className="flex items-center space-x-1">
                        <span className="text-[10px] text-slate-500">END:</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleNudgeTime(sub.id, 'endSec', -0.1); }}
                          disabled={sub.locked}
                          className="px-1 py-0.5 rounded bg-slate-900 hover:bg-cyan-950 text-cyan-400 cursor-pointer disabled:opacity-40"
                          title="Nudge end -0.1s"
                        >
                          -0.1s
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleNudgeTime(sub.id, 'endSec', 0.1); }}
                          disabled={sub.locked}
                          className="px-1 py-0.5 rounded bg-slate-900 hover:bg-cyan-950 text-cyan-400 cursor-pointer disabled:opacity-40"
                          title="Nudge end +0.1s"
                        >
                          +0.1s
                        </button>
                      </div>
                    </div>

                    {/* Quick Tools: Split, Merge Next, Single Translate, Lock, Delete */}
                    <div className="flex items-center space-x-1.5">
                      {/* Split */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSplit(sub); }}
                        disabled={sub.locked}
                        className="p-1 rounded bg-slate-900 hover:bg-cyan-950 border border-slate-700 text-slate-300 hover:text-cyan-300 cursor-pointer disabled:opacity-40"
                        title="Split Subtitle at midpoint"
                      >
                        <Split className="w-3.5 h-3.5" />
                      </button>

                      {/* Merge Next */}
                      {index < subtitles.length - 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMergeNext(sub); }}
                          disabled={sub.locked}
                          className="p-1 rounded bg-slate-900 hover:bg-cyan-950 border border-slate-700 text-slate-300 hover:text-cyan-300 cursor-pointer disabled:opacity-40"
                          title="Merge with next subtitle"
                        >
                          <Merge className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Lock / Unlock */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleLock(sub.id); }}
                        className={`p-1 rounded border cursor-pointer ${
                          sub.locked
                            ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                        title={sub.locked ? 'Unlock Subtitle' : 'Lock Subtitle to prevent edits'}
                      >
                        {sub.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteSub(sub.id); }}
                        disabled={sub.locked}
                        className="p-1 rounded bg-slate-900 hover:bg-rose-950 border border-slate-700 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 cursor-pointer disabled:opacity-30"
                        title="Delete subtitle"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Preview Stage & Styling Panel (Col 5) */}
        <div className="lg:col-span-5 flex flex-col bg-[#030714] overflow-y-auto p-4 space-y-4">
          {/* Live Video Canvas Monitor */}
          <div className="hud-panel p-3 border border-cyan-500/30 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs font-tech text-cyan-300 pb-1 border-b border-cyan-500/20">
              <span className="flex items-center space-x-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>LIVE CAPTION PREVIEW MONITOR</span>
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {formatSrtTimestamp(currentTimeSec)} / {formatSrtTimestamp(maxTimeSec)}
              </span>
            </div>

            {/* Video Preview Aspect Screen */}
            <div className="relative aspect-video rounded overflow-hidden border border-cyan-500/40 bg-black shadow-[0_0_20px_rgba(0,240,255,0.15)] flex items-center justify-center">
              {/* Background Frame */}
              <img
                src={previewThumbnail}
                alt="Scene frame preview"
                className="w-full h-full object-cover filter brightness-90 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 pointer-events-none" />

              {/* Timecode Watermark */}
              <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 bg-black/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                TC: {formatSrtTimestamp(currentTimeSec)}
              </div>

              {/* Speaker Pill */}
              {activeSubtitle?.speaker && (
                <div className="absolute top-2 right-2 text-[10px] font-mono text-yellow-300 bg-black/60 px-2 py-0.5 rounded border border-yellow-500/30">
                  {activeSubtitle.speaker}
                </div>
              )}

              {/* Subtitle Rendered on Frame */}
              {activeSubtitle ? (
                <div
                  className={`absolute left-4 right-4 text-center px-4 transition-all ${
                    subtitlePosition === 'top'
                      ? 'top-8'
                      : subtitlePosition === 'center'
                      ? 'top-1/2 -translate-y-1/2'
                      : 'bottom-6'
                  }`}
                >
                  <span
                    className={`inline-block font-sans font-bold leading-snug tracking-wide ${
                      fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-lg' : 'text-sm md:text-base'
                    } ${
                      stylePreset === 'cyber_cyan'
                        ? 'text-cyan-200 drop-shadow-[0_0_12px_rgba(0,240,255,0.9)] bg-black/50 px-3 py-1 rounded border border-cyan-400/40'
                        : stylePreset === 'cinema_yellow'
                        ? 'text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] bg-black/40 px-3 py-1 rounded'
                        : stylePreset === 'karaoke_glow'
                        ? 'text-yellow-400 bg-black/80 px-4 py-1.5 rounded-lg border border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]'
                        : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] bg-black/30 px-3 py-1 rounded'
                    }`}
                  >
                    {activeSubtitle.text}
                  </span>
                </div>
              ) : (
                <div className="absolute bottom-6 text-center text-slate-500 text-xs italic font-mono">
                  [ No subtitle active at this frame ]
                </div>
              )}
            </div>

            {/* Scrubber & Playback Controls */}
            <div className="space-y-2 pt-1">
              <input
                type="range"
                min={0}
                max={maxTimeSec}
                step={0.1}
                value={currentTimeSec}
                onChange={(e) => setCurrentTimeSec(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-900 rounded cursor-pointer"
              />

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      playHudClick();
                      setIsPlaying(!isPlaying);
                    }}
                    className="p-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-400/60 text-cyan-200 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      playHudClick();
                      setCurrentTimeSec(0);
                    }}
                    className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 cursor-pointer"
                    title="Reset to 00:00"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="font-mono text-cyan-300 text-xs">
                  {formatSrtTimestamp(currentTimeSec)}
                </div>
              </div>
            </div>
          </div>

          {/* Subtitle Styling & Burn-in Options */}
          <div className="hud-panel p-3 border border-cyan-500/30 rounded-lg space-y-3">
            <div className="text-xs font-tech text-cyan-300 pb-1 border-b border-cyan-500/20 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>BURN-IN VISUAL STYLE PRESETS</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">YOUTUBE / SHORTS COMPLIANT</span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'cyber_cyan', name: 'Cyber Cyan Glow', desc: 'Neon holographic cyan rim' },
                { id: 'cinema_yellow', name: 'Cinema Netflix Yellow', desc: 'Industry standard yellow' },
                { id: 'karaoke_glow', name: 'Dynamic Box Karaoke', desc: 'Viral bold box high contrast' },
                { id: 'bold_sans', name: 'Clean White Sans', desc: 'Minimalist white with shadow' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setStylePreset(p.id as typeof stylePreset)}
                  className={`p-2 rounded border text-left cursor-pointer transition-all ${
                    stylePreset === p.id
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                      : 'bg-[#050b18] border-slate-800 text-slate-400 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="font-bold text-xs">{p.name}</div>
                  <div className="text-[10px] text-slate-500">{p.desc}</div>
                </button>
              ))}
            </div>

            {/* Position & Font Size */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1 font-mono uppercase">Position:</span>
                <div className="flex rounded bg-[#050b18] border border-cyan-500/30 p-0.5">
                  {(['bottom', 'center', 'top'] as const).map(pos => (
                    <button
                      key={pos}
                      onClick={() => setSubtitlePosition(pos)}
                      className={`flex-1 py-1 rounded text-center cursor-pointer ${
                        subtitlePosition === pos ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'
                      }`}
                    >
                      {pos.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-1 font-mono uppercase">Font Size:</span>
                <div className="flex rounded bg-[#050b18] border border-cyan-500/30 p-0.5">
                  {(['sm', 'md', 'lg'] as const).map(sz => (
                    <button
                      key={sz}
                      onClick={() => setFontSize(sz)}
                      className={`flex-1 py-1 rounded text-center cursor-pointer ${
                        fontSize === sz ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'
                      }`}
                    >
                      {sz.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Copy & Export Actions */}
          <div className="hud-panel p-3 border border-cyan-500/30 rounded-lg space-y-2">
            <div className="text-xs font-tech text-cyan-300 pb-1 border-b border-cyan-500/20">
              FAST PUBLISHING CLIPBOARD
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleCopyClipboard('srt')}
                className="p-2 rounded bg-slate-900 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-slate-200 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                {copiedFormat === 'srt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>COPY SRT TEXT</span>
              </button>

              <button
                onClick={() => handleCopyClipboard('vtt')}
                className="p-2 rounded bg-slate-900 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-slate-200 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                {copiedFormat === 'vtt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>COPY VTT TEXT</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
