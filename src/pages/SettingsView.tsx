/**
 * THE DEVIL'S EYE - Settings & AI Architecture Configuration
 * Model selection (Gemini 2.5 Pro Multimodal), Render resolution, Audio sample rate & HUD SFX.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, 
  Cpu, 
  Sliders, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles,
  Check
} from 'lucide-react';
import { playHudClick, playHudScan, playHudSuccess, toggleSoundFx, isSoundFxEnabled } from '../services/soundFx';

export const SettingsView: React.FC = () => {
  const { addToast } = useApp();

  const [aiModel, setAiModel] = useState('Gemini 2.5 Pro (Multimodal Video Engine)');
  const [resolution, setResolution] = useState('4K UHD (3840x2160)');
  const [fps, setFps] = useState('24.00 fps (Cinema)');
  const [sampleRate, setSampleRate] = useState('48 kHz Cinema Master');
  const [sfxEnabled, setSfxEnabled] = useState(isSoundFxEnabled());

  const handleToggleSfx = () => {
    const newState = toggleSoundFx();
    setSfxEnabled(newState);
    if (newState) playHudSuccess();
    addToast('Audio Preference', `Holographic HUD sound effects ${newState ? 'enabled' : 'disabled'}`, 'info');
  };

  const handleSave = () => {
    playHudSuccess();
    addToast('Settings Saved', 'Hardware & AI pipeline configurations committed', 'success');
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-y-auto bg-[#02050f] text-slate-100 p-4 space-y-4 select-none bg-hud-grid max-w-4xl mx-auto">
      {/* Header */}
      <div className="hud-panel p-4 rounded-lg border border-cyan-500/30 flex items-center justify-between hud-corners">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-cyan-950/80 border border-cyan-400/50">
            <Settings className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-cyan-100">PLATFORM SETTINGS & HARDWARE ENGINE</h1>
            <p className="text-xs font-mono text-cyan-400/70">
              MULTIMODAL NEURAL BACKEND, RENDERING BITRATE & HUD AUDIO
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-tech font-bold text-xs px-4 py-2 rounded border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.4)] flex items-center space-x-1.5 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>SAVE PREFERENCES</span>
        </button>
      </div>

      {/* AI Intelligence Architecture */}
      <div className="hud-panel rounded-lg p-4 border border-cyan-500/30 hud-corners space-y-3">
        <div className="flex items-center space-x-2 text-xs font-tech font-bold uppercase text-cyan-300 border-b border-cyan-500/20 pb-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Multimodal AI Vision & Story Generation Engine</span>
        </div>

        <div className="space-y-2 text-xs">
          {[
            { name: 'Gemini 2.5 Pro (Multimodal Video Engine)', desc: '1M+ token context window. Best for analyzing full 2-hour movies in a single pass with micro-scene recognition.' },
            { name: 'Gemini 2.5 Flash Cinema Engine', desc: 'Ultra-low latency for instant script drafting, subtitle timecode syncing, and real-time prompt feedback.' },
            { name: 'Local Neural Fallback (WebAssembly)', desc: 'Processes audio waveforms and facial detection in client memory without external network calls.' },
          ].map((m) => (
            <label
              key={m.name}
              className={`p-3 rounded border block cursor-pointer transition-colors ${
                aiModel === m.name
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-100 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                  : 'bg-[#050b18] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-2 font-tech font-bold">
                <input
                  type="radio"
                  name="aimodel"
                  checked={aiModel === m.name}
                  onChange={() => {
                    playHudClick();
                    setAiModel(m.name);
                  }}
                  className="accent-cyan-400"
                />
                <span>{m.name}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 ml-5 font-sans">{m.desc}</p>
            </label>
          ))}
        </div>
      </div>

      {/* Video & Audio Rendering Settings */}
      <div className="hud-panel rounded-lg p-4 border border-cyan-500/30 hud-corners space-y-3">
        <div className="flex items-center space-x-2 text-xs font-tech font-bold uppercase text-cyan-300 border-b border-cyan-500/20 pb-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Video Rendering & Sound Engineering Specs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-tech">Render Resolution</label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full bg-[#050b18] border border-cyan-500/30 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            >
              <option>4K UHD (3840x2160)</option>
              <option>1080p Full HD (1920x1080)</option>
              <option>1440p QHD (2560x1440)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-tech">Cinema Frame Rate</label>
            <select
              value={fps}
              onChange={(e) => setFps(e.target.value)}
              className="w-full bg-[#050b18] border border-cyan-500/30 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            >
              <option>24.00 fps (Cinema Standard)</option>
              <option>23.976 fps (Film Pulldown)</option>
              <option>60.00 fps (High Motion)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-tech">Audio Sample Rate</label>
            <select
              value={sampleRate}
              onChange={(e) => setSampleRate(e.target.value)}
              className="w-full bg-[#050b18] border border-cyan-500/30 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            >
              <option>48 kHz Cinema Master</option>
              <option>96 kHz Hi-Res Studio</option>
              <option>44.1 kHz Standard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Holographic HUD UI Preferences */}
      <div className="hud-panel rounded-lg p-4 border border-cyan-500/30 hud-corners space-y-3">
        <div className="flex items-center space-x-2 text-xs font-tech font-bold uppercase text-cyan-300 border-b border-cyan-500/20 pb-2">
          <Volume2 className="w-4 h-4 text-cyan-400" />
          <span>Holographic Interface & Audio Feedback</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded bg-[#050b18] border border-cyan-500/20 text-xs">
          <div>
            <div className="text-slate-200 font-tech font-bold">JARVIS / Iron-Man Audio Sound Effects</div>
            <div className="text-[11px] text-slate-400">Web Audio API futuristic blips, scanning beeps, and tactical clicks</div>
          </div>
          <button
            onClick={handleToggleSfx}
            className={`px-3 py-1.5 rounded text-xs font-tech font-bold cursor-pointer transition-colors ${
              sfxEnabled
                ? 'bg-cyan-950 border border-cyan-400 text-cyan-200'
                : 'bg-slate-900 border border-slate-700 text-slate-400'
            }`}
          >
            {sfxEnabled ? 'ENABLED' : 'MUTED'}
          </button>
        </div>
      </div>
    </div>
  );
};
