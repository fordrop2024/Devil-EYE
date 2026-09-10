/**
 * THE DEVIL'S EYE - Source Range Control
 * Precision Cinema Range Selector & Excluded Zone Manager.
 * Modes: AI AUTO, AI + USER RANGE, MANUAL, LOCK RANGE, EXCLUDE RANGE.
 */

import React, { useState } from 'react';
import { SourceRangeConfig, ExcludedRange } from '../../types';
import { 
  Sliders, 
  Lock, 
  Unlock, 
  Clock, 
  Ban, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Sparkles,
  Scissors
} from 'lucide-react';
import { playHudClick, playHudScan, playHudSuccess } from '../../services/soundFx';

interface SourceRangeControlProps {
  config: SourceRangeConfig;
  totalDurationSec: number;
  totalDurationFormatted: string;
  onChange: (newConfig: SourceRangeConfig) => void;
}

export const SourceRangeControl: React.FC<SourceRangeControlProps> = ({
  config,
  totalDurationSec,
  totalDurationFormatted,
  onChange,
}) => {
  const [newExcludeLabel, setNewExcludeLabel] = useState('');
  const [newExcludeStart, setNewExcludeStart] = useState('00:00:00');
  const [newExcludeEnd, setNewExcludeEnd] = useState('00:02:00');
  const [isAddingExclude, setIsAddingExclude] = useState(false);

  const parseTimestampToSec = (ts: string): number => {
    const parts = ts.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return 0;
  };

  const formatSecToTimestamp = (sec: number): string => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleModeChange = (mode: SourceRangeConfig['mode']) => {
    playHudClick();
    onChange({
      ...config,
      mode,
    });
  };

  const handleToggleLock = () => {
    playHudClick();
    onChange({
      ...config,
      isLocked: !config.isLocked,
    });
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const sec = parseTimestampToSec(val);
    onChange({
      ...config,
      startTime: val,
      startSec: sec,
    });
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const sec = parseTimestampToSec(val);
    onChange({
      ...config,
      endTime: val,
      endSec: sec,
    });
  };

  const handleAddExcludedRange = () => {
    if (!newExcludeLabel.trim()) return;
    playHudClick();

    const startSec = parseTimestampToSec(newExcludeStart);
    const endSec = parseTimestampToSec(newExcludeEnd);

    const newEx: ExcludedRange = {
      id: `ex-${Date.now()}`,
      label: newExcludeLabel.trim(),
      start: newExcludeStart,
      end: newExcludeEnd,
      startSec,
      endSec,
    };

    onChange({
      ...config,
      excludedRanges: [...config.excludedRanges, newEx],
    });

    setNewExcludeLabel('');
    setIsAddingExclude(false);
    playHudSuccess();
  };

  const handleRemoveExcludedRange = (id: string) => {
    playHudClick();
    onChange({
      ...config,
      excludedRanges: config.excludedRanges.filter(ex => ex.id !== id),
    });
  };

  const handleQuickPreset = (preset: 'exclude-bumpers' | 'exclude-credits' | 'full-movie') => {
    playHudClick();
    if (preset === 'full-movie') {
      onChange({
        ...config,
        startTime: '00:00:00',
        startSec: 0,
        endTime: totalDurationFormatted,
        endSec: totalDurationSec,
        excludedRanges: [],
      });
    } else if (preset === 'exclude-bumpers') {
      const bumperEx: ExcludedRange = {
        id: `ex-bumper-${Date.now()}`,
        label: 'Studio Logos & Intro Slates',
        start: '00:00:00',
        end: '00:01:45',
        startSec: 0,
        endSec: 105,
      };
      onChange({
        ...config,
        excludedRanges: [...config.excludedRanges.filter(e => !e.label.includes('Studio')), bumperEx],
      });
    } else if (preset === 'exclude-credits') {
      const creditsStartSec = Math.max(0, totalDurationSec - 360);
      const creditsEx: ExcludedRange = {
        id: `ex-credits-${Date.now()}`,
        label: 'Credits Roll & Post-Credits Bumper',
        start: formatSecToTimestamp(creditsStartSec),
        end: totalDurationFormatted,
        startSec: creditsStartSec,
        endSec: totalDurationSec,
      };
      onChange({
        ...config,
        excludedRanges: [...config.excludedRanges.filter(e => !e.label.includes('Credits')), creditsEx],
      });
    }
  };

  // Visual percentages for the timeline bar
  const startPercent = totalDurationSec > 0 ? (config.startSec / totalDurationSec) * 100 : 0;
  const endPercent = totalDurationSec > 0 ? (config.endSec / totalDurationSec) * 100 : 100;
  const activeWidth = Math.max(1, endPercent - startPercent);

  return (
    <div className="hud-panel p-4 rounded-lg border border-cyan-500/30 hud-corners space-y-4 bg-[#030816]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded bg-cyan-950/80 border border-cyan-400 text-cyan-300">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-display font-bold text-slate-100 uppercase tracking-wider">
                SOURCE RANGE CONTROL
              </h3>
              {config.isLocked && (
                <span className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/60 text-amber-300 text-[10px] font-mono flex items-center space-x-1">
                  <Lock className="w-2.5 h-2.5" />
                  <span>RANGE LOCKED</span>
                </span>
              )}
            </div>
            <p className="text-[11px] font-mono text-cyan-400/70">
              FRAME-ACCURATE BOUNDARIES & EXCLUSION ZONES FOR SCENE EXTRACTION
            </p>
          </div>
        </div>

        {/* Lock button */}
        <button
          onClick={handleToggleLock}
          className={`px-2.5 py-1 rounded text-xs font-tech flex items-center space-x-1.5 border transition-colors cursor-pointer ${
            config.isLocked 
              ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]' 
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-400'
          }`}
        >
          {config.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          <span>{config.isLocked ? 'LOCKED' : 'LOCK BOUNDS'}</span>
        </button>
      </div>

      {/* Mode Selector Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs font-tech">
        {(['AI AUTO', 'AI + USER RANGE', 'MANUAL', 'LOCK RANGE', 'EXCLUDE RANGE'] as const).map((m) => {
          const isActive = config.mode === m;
          return (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              disabled={config.isLocked && m !== 'LOCK RANGE'}
              className={`px-3 py-1.5 rounded border transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              } disabled:opacity-50`}
            >
              {m}
            </button>
          );
        })}
      </div>

      {/* Visual Scrub Timeline Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>00:00:00 [START]</span>
          <span className="text-cyan-300 font-bold">
            ACTIVE WINDOW: {config.startTime} ──&gt; {config.endTime} ({formatSecToTimestamp(Math.max(0, config.endSec - config.startSec))})
          </span>
          <span>{totalDurationFormatted} [END]</span>
        </div>

        <div className="relative w-full h-7 bg-[#020612] border border-cyan-500/30 rounded overflow-hidden">
          {/* Base inactive gray track */}
          <div className="absolute inset-0 bg-slate-950/80" />

          {/* Active Range Highlight */}
          <div
            className="absolute top-0 bottom-0 bg-gradient-to-r from-cyan-600/40 via-blue-500/50 to-cyan-500/40 border-l-2 border-r-2 border-cyan-400"
            style={{ left: `${startPercent}%`, width: `${activeWidth}%` }}
          />

          {/* Excluded Ranges (Striped Amber/Red) */}
          {config.excludedRanges.map((ex) => {
            const exStartPercent = totalDurationSec > 0 ? (ex.startSec / totalDurationSec) * 100 : 0;
            const exWidth = totalDurationSec > 0 ? ((ex.endSec - ex.startSec) / totalDurationSec) * 100 : 0;
            return (
              <div
                key={ex.id}
                title={`Excluded: ${ex.label} (${ex.start} - ${ex.end})`}
                className="absolute top-0 bottom-0 bg-rose-900/60 border-l border-r border-rose-500/80 bg-[repeating-linear-gradient(45deg,rgba(244,63,94,0.3),rgba(244,63,94,0.3)_6px,rgba(0,0,0,0.5)_6px,rgba(0,0,0,0.5)_12px)]"
                style={{ left: `${exStartPercent}%`, width: `${Math.max(1, exWidth)}%` }}
              />
            );
          })}
        </div>
      </div>

      {/* Inputs: Start and End Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-cyan-300 flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>START TIMECODE</span>
          </label>
          <input
            type="text"
            value={config.startTime}
            disabled={config.isLocked}
            onChange={handleStartTimeChange}
            className="w-full px-2.5 py-1.5 bg-[#02050f] border border-cyan-500/30 rounded font-mono text-slate-100 focus:outline-none focus:border-cyan-400 text-xs"
            placeholder="00:00:00"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono text-cyan-300 flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>END TIMECODE</span>
          </label>
          <input
            type="text"
            value={config.endTime}
            disabled={config.isLocked}
            onChange={handleEndTimeChange}
            className="w-full px-2.5 py-1.5 bg-[#02050f] border border-cyan-500/30 rounded font-mono text-slate-100 focus:outline-none focus:border-cyan-400 text-xs"
            placeholder="02:28:00"
          />
        </div>

        {/* Quick Presets */}
        <div className="sm:col-span-2 flex items-end space-x-2">
          <button
            onClick={() => handleQuickPreset('exclude-bumpers')}
            disabled={config.isLocked}
            className="px-2.5 py-1.5 rounded bg-slate-900 border border-cyan-500/20 hover:border-cyan-400 text-cyan-300 font-tech text-[11px] transition-colors cursor-pointer disabled:opacity-50"
          >
            + Exclude Intro Logos
          </button>
          <button
            onClick={() => handleQuickPreset('exclude-credits')}
            disabled={config.isLocked}
            className="px-2.5 py-1.5 rounded bg-slate-900 border border-cyan-500/20 hover:border-cyan-400 text-cyan-300 font-tech text-[11px] transition-colors cursor-pointer disabled:opacity-50"
          >
            + Exclude End Credits
          </button>
          <button
            onClick={() => handleQuickPreset('full-movie')}
            disabled={config.isLocked}
            className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-400 font-tech text-[11px] transition-colors cursor-pointer disabled:opacity-50"
          >
            Reset Range
          </button>
        </div>
      </div>

      {/* Excluded Ranges Sub-Panel */}
      <div className="space-y-2 border-t border-cyan-500/20 pt-3">
        <div className="flex items-center justify-between text-xs font-tech text-rose-300">
          <div className="flex items-center space-x-1.5">
            <Ban className="w-3.5 h-3.5 text-rose-400" />
            <span>EXCLUDED REGIONS ({config.excludedRanges.length})</span>
          </div>

          <button
            onClick={() => setIsAddingExclude(!isAddingExclude)}
            disabled={config.isLocked}
            className="text-[11px] text-cyan-300 hover:text-cyan-100 flex items-center space-x-1 cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-3 h-3" />
            <span>{isAddingExclude ? 'Close Exclude Form' : 'Add Exclusion Zone'}</span>
          </button>
        </div>

        {/* Add exclusion form */}
        {isAddingExclude && (
          <div className="p-2.5 rounded bg-rose-950/30 border border-rose-500/30 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <input
              type="text"
              placeholder="Zone label (e.g. Opening Logos)"
              value={newExcludeLabel}
              onChange={(e) => setNewExcludeLabel(e.target.value)}
              className="sm:col-span-2 px-2 py-1 bg-slate-950 border border-rose-500/40 rounded font-tech text-slate-100"
            />
            <input
              type="text"
              placeholder="Start 00:00:00"
              value={newExcludeStart}
              onChange={(e) => setNewExcludeStart(e.target.value)}
              className="px-2 py-1 bg-slate-950 border border-rose-500/40 rounded font-mono text-slate-100"
            />
            <div className="flex space-x-1">
              <input
                type="text"
                placeholder="End 00:02:00"
                value={newExcludeEnd}
                onChange={(e) => setNewExcludeEnd(e.target.value)}
                className="w-full px-2 py-1 bg-slate-950 border border-rose-500/40 rounded font-mono text-slate-100"
              />
              <button
                onClick={handleAddExcludedRange}
                className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-tech font-bold text-xs cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Excluded list pills */}
        <div className="flex flex-wrap gap-2">
          {config.excludedRanges.map((ex) => (
            <div
              key={ex.id}
              className="px-2.5 py-1 rounded bg-rose-950/40 border border-rose-500/40 flex items-center space-x-2 text-[11px] font-mono text-rose-200"
            >
              <span>{ex.label}:</span>
              <span className="text-rose-400 font-bold">{ex.start} - {ex.end}</span>
              {!config.isLocked && (
                <button
                  onClick={() => handleRemoveExcludedRange(ex.id)}
                  className="text-slate-400 hover:text-rose-300 ml-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
