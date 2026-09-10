/**
 * THE DEVIL'S EYE - Script Studio
 * Dual-Column Explainer Editor with Two-Way Script-to-Scene Mapping,
 * AI Story Director Command Suite, Multi-Language System (Hindi, Hinglish, English),
 * Pronunciation Helper, and Script Versioning.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScriptSegment, ExplainerLanguage, ScriptVersion, VoiceLabSettings } from '../types';
import { 
  FileText, 
  Sparkles, 
  Clock, 
  Volume2, 
  Edit3, 
  CheckCircle2, 
  Eye, 
  RefreshCw, 
  Wand2, 
  Copy, 
  Check, 
  Film, 
  Languages, 
  Sliders, 
  History, 
  Bookmark, 
  Mic2, 
  Play, 
  Pause, 
  Send, 
  Code,
  ArrowRight,
  HelpCircle,
  VolumeX,
  ExternalLink
} from 'lucide-react';
import { 
  generateExplainerScript, 
  executeDirectorCommand, 
  GENRE_STRATEGIES 
} from '../services/storyEngineService';
import { synthesizeVoiceSpeech } from '../services/ttsService';
import { playHudClick, playHudScan, playHudSuccess } from '../services/soundFx';

export const ScriptStudio: React.FC = () => {
  const { 
    currentProject, 
    updateCurrentProject, 
    executeAiCommand, 
    isAiThinking, 
    addToast,
    selectedSegmentId,
    setSelectedSegmentId,
    selectedSceneId,
    setSelectedSceneId,
    saveScriptVersion,
    restoreScriptVersion,
    runStoryDirectorCommand,
    navigateTo
  } = useApp();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'director' | 'versions' | 'pronunciation'>('editor');
  const [directorPrompt, setDirectorPrompt] = useState<string>('');
  const [newVersionName, setNewVersionName] = useState<string>('');
  const [isAudioPreviewPlaying, setIsAudioPreviewPlaying] = useState<boolean>(false);
  const [showSsml, setShowSsml] = useState<boolean>(false);
  const [newPronTerm, setNewPronTerm] = useState<string>('');
  const [newPronIpa, setNewPronIpa] = useState<string>('');

  const script = currentProject.script;
  const segments: ScriptSegment[] = script?.segments || [];
  
  const activeSegment = segments.find(s => s.id === selectedSegmentId) || segments[0];

  // Connected Scene
  const connectedScene = currentProject.scenes?.find(
    sc => activeSegment?.sourceSceneIds?.includes(sc.id) || sc.id === selectedSceneId
  ) || currentProject.scenes?.[0];

  // Handle narration text edit
  const handleUpdateNarration = (text: string) => {
    if (!activeSegment) return;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const estimatedSeconds = Math.max(2, Math.round((words / 150) * 60));

    const updatedSegments = segments.map(seg => {
      if (seg.id === activeSegment.id) {
        return {
          ...seg,
          wordsTarget: words,
          narration: [{ ...seg.narration[0], text }],
          audioTiming: seg.audioTiming ? {
            ...seg.audioTiming,
            durationSec: estimatedSeconds
          } : undefined
        };
      }
      return seg;
    });

    const totalWords = updatedSegments.reduce((acc, s) => acc + (s.narration[0]?.text.split(/\s+/).filter(Boolean).length || 0), 0);

    updateCurrentProject({
      script: {
        ...script,
        wordsCount: totalWords,
        segments: updatedSegments
      }
    });
  };

  // Handle Delivery Style change
  const handleDeliveryStyleChange = (style: 'whisper' | 'urgent' | 'calm' | 'dramatic_pause' | 'analytical') => {
    if (!activeSegment) return;
    playHudClick();
    const updatedSegments = segments.map(seg => {
      if (seg.id === activeSegment.id) {
        return {
          ...seg,
          deliveryStyle: style
        };
      }
      return seg;
    });

    updateCurrentProject({
      script: {
        ...script,
        segments: updatedSegments
      }
    });
    addToast('Delivery Style Updated', `Set delivery cadence to "${style.replace('_', ' ')}".`, 'info');
  };

  // Handle Language switch & regeneration
  const handleLanguageChange = (newLang: ExplainerLanguage) => {
    playHudScan();
    const beats = currentProject.storyBeats && currentProject.storyBeats.length >= 13 
      ? currentProject.storyBeats 
      : [];
    
    const regeneratedScript = generateExplainerScript(
      currentProject, 
      beats, 
      newLang, 
      currentProject.storyConfig?.targetDuration || '20 min'
    );

    updateCurrentProject({
      script: regeneratedScript
    });

    addToast('Language Engine Switched', `Explainer script re-generated in ${newLang}.`, 'success');
  };

  // Handle Regenerate single segment with tone
  const handleRegenerateSegment = async (tone: string) => {
    if (!activeSegment) return;
    playHudScan();
    const cmd = `Rewrite segment "${activeSegment.title}" with a ${tone} cinema tone for ${script.language} language`;
    await executeAiCommand(cmd);
    addToast('Segment Refined', `Applied ${tone} tone to ${activeSegment.title}`, 'success');
  };

  // Handle Director command execution
  const handleRunDirectorCmd = async (commandText: string) => {
    playHudScan();
    await runStoryDirectorCommand(commandText);
  };

  // Play spoken preview of the narration line
  const handlePreviewSpeech = async () => {
    if (!activeSegment?.narration[0]?.text) return;
    setIsAudioPreviewPlaying(true);
    playHudScan();

    const defaultVoice: VoiceLabSettings = {
      gcpConfigured: false,
      selectedLanguage: script.language === 'Hindi' ? 'hi-IN' : script.language === 'Hinglish' ? 'en-IN' : 'en-US',
      selectedVoiceId: script.language === 'Hindi' ? 'hi-IN-Neural2-B' : 'en-US-Journey-D',
      gender: 'male',
      speakingRate: 1.05,
      pitch: 0,
      volumeGainDb: 1.0,
      deliveryPreset: 'Noir Analytical',
      ssmlMode: false,
      ssmlText: '',
      pauseMs: 400,
      customPronunciations: []
    };

    const voiceSettings: VoiceLabSettings = currentProject.voiceSettings || defaultVoice;

    const res = await synthesizeVoiceSpeech(activeSegment.narration[0].text, voiceSettings);
    setIsAudioPreviewPlaying(false);
    if (res.status === 'configured_success') {
      addToast('Google Cloud TTS Active', res.message, 'success');
    } else {
      addToast('Live Speech Preview', res.message, 'info');
    }
  };

  // Pronunciation Dictionary additions
  const handleAddPronunciation = () => {
    if (!newPronTerm.trim() || !newPronIpa.trim()) return;
    playHudClick();
    const currentList = currentProject.voiceSettings?.customPronunciations || [];
    const updated = [...currentList, { term: newPronTerm.trim(), ipa: newPronIpa.trim() }];
    const fallbackSettings: VoiceLabSettings = {
      gcpConfigured: false,
      selectedLanguage: 'en-US',
      selectedVoiceId: 'en-US-Journey-D',
      gender: 'male',
      speakingRate: 1.0,
      pitch: 0,
      volumeGainDb: 0,
      deliveryPreset: 'Noir Analytical',
      ssmlMode: false,
      ssmlText: '',
      pauseMs: 400,
      customPronunciations: updated
    };
    updateCurrentProject({
      voiceSettings: {
        ...(currentProject.voiceSettings || fallbackSettings),
        customPronunciations: updated
      }
    });
    setNewPronTerm('');
    setNewPronIpa('');
    addToast('Pronunciation Added', `Rule added for "${newPronTerm}".`, 'success');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    playHudSuccess();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const directorQuickCommands = [
    'Make opening stronger',
    'Increase suspense',
    'Reduce exposition',
    'Delay the reveal',
    'Make this more emotional',
    'Shorten by 20 seconds',
    'Make this 20 minutes',
    'Use stronger scenes',
    'Improve pacing'
  ];

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-y-auto bg-[#02050f] text-slate-100 p-4 space-y-4 select-none bg-hud-grid">
      {/* Header Panel */}
      <div className="hud-panel p-4 rounded-lg border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hud-corners">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded bg-cyan-950/80 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <FileText className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-display font-bold text-cyan-100 tracking-wider">
                SCRIPT STUDIO // DUAL-COLUMN EXPLAINER WORKSTATION
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400/40 text-cyan-300">
                13 STAGES
              </span>
            </div>
            <p className="text-xs font-mono text-cyan-400/70">
              TARGET DURATION: {script?.targetDuration || '20 min'} • {script?.wordsCount || 0} TOTAL WORDS • 150 WPM
            </p>
          </div>
        </div>

        {/* Language Switcher Bar */}
        <div className="flex items-center space-x-2 bg-[#040916] border border-cyan-500/30 rounded-lg p-1.5">
          <div className="flex items-center space-x-1 text-xs font-tech text-cyan-300 px-2">
            <Languages className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">EXPLAINER LANGUAGE:</span>
          </div>

          {(['Hindi', 'Hinglish', 'English'] as ExplainerLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`px-3 py-1 rounded text-xs font-tech border transition-all cursor-pointer ${
                script?.language === lang
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'Hindi' ? 'हिंदी' : lang}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Sub-Tabs: Editor | AI Story Director | Versions | Pronunciation */}
      <div className="flex items-center space-x-2 border-b border-cyan-500/20 pb-1">
        <button
          onClick={() => setActiveTab('editor')}
          className={`px-3 py-1.5 rounded text-xs font-tech transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'editor'
              ? 'bg-cyan-950 border border-cyan-400 text-cyan-200 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>DUAL-COLUMN LIVE EDITOR</span>
        </button>

        <button
          onClick={() => setActiveTab('director')}
          className={`px-3 py-1.5 rounded text-xs font-tech transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'director'
              ? 'bg-cyan-950 border border-cyan-400 text-cyan-200 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI STORY DIRECTOR ({directorQuickCommands.length} DIRECTIVES)</span>
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
          <span>SCRIPT REVISIONS ({currentProject.scriptVersions?.length || 1})</span>
        </button>

        <button
          onClick={() => setActiveTab('pronunciation')}
          className={`px-3 py-1.5 rounded text-xs font-tech transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'pronunciation'
              ? 'bg-cyan-950 border border-cyan-400 text-cyan-200 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>PRONUNCIATION HELPER</span>
        </button>
      </div>

      {/* TAB 1: DUAL-COLUMN LIVE EDITOR */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Segment Selector (Col 3) */}
          <div className="lg:col-span-3 hud-panel rounded-lg p-3 border border-cyan-500/30 hud-corners space-y-2">
            <div className="text-xs font-tech uppercase text-cyan-300 pb-2 border-b border-cyan-500/20 flex items-center justify-between">
              <span>Script Stages ({segments.length})</span>
              <span className="font-mono text-[10px] text-slate-400">{script?.language}</span>
            </div>

            <div className="space-y-1.5 max-h-[calc(100vh-21rem)] overflow-y-auto pr-1">
              {segments.map((seg, idx) => {
                const isSelected = activeSegment?.id === seg.id;
                return (
                  <div
                    key={seg.id}
                    onClick={() => {
                      playHudClick();
                      setSelectedSegmentId(seg.id);
                    }}
                    className={`p-2.5 rounded border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.2)] text-cyan-100'
                        : 'bg-[#050b18] border-slate-800 hover:border-cyan-500/40 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-cyan-400 font-bold">{idx + 1}.</span>
                        <span className="text-slate-300 font-tech font-bold uppercase">{seg.stage}</span>
                      </div>
                      <span className="text-slate-400 text-[10px]">{seg.timestampTarget}</span>
                    </div>

                    <div className="text-xs font-tech font-bold truncate text-slate-100">
                      {seg.title}
                    </div>

                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-1 font-sans">
                      {seg.narration[0]?.text || ''}
                    </div>

                    <div className="flex items-center justify-between text-[9px] font-mono text-cyan-400/80 pt-1.5 mt-1 border-t border-cyan-500/10">
                      <span>{seg.wordsTarget || 200} words</span>
                      <span className="uppercase">{seg.deliveryStyle || 'calm'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DUAL COLUMNS: Narrator Voiceover (Left, Col 5) & Connected Source Scene (Right, Col 4) */}
          <div className="lg:col-span-9 space-y-4">
            {activeSegment ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* LEFT COLUMN: NARRATOR VOICEOVER (Col 7) */}
                <div className="lg:col-span-7 hud-panel rounded-lg p-4 border border-cyan-500/30 hud-corners space-y-3">
                  {/* Segment Title & Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400/40 text-cyan-300 uppercase">
                          {activeSegment.stage}
                        </span>
                        <h2 className="text-base font-tech font-bold text-cyan-200">
                          {activeSegment.title}
                        </h2>
                      </div>
                      <div className="text-xs font-mono text-slate-400 mt-0.5">
                        Target Timecode: <strong className="text-cyan-400">{activeSegment.timestampTarget}</strong> ({activeSegment.targetDurationSec}s)
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={handlePreviewSpeech}
                        disabled={isAudioPreviewPlaying}
                        className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-xs font-tech text-cyan-200 flex items-center space-x-1.5 cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                      >
                        {isAudioPreviewPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        <span>{isAudioPreviewPlaying ? 'SPEAKING...' : 'PREVIEW VOICE'}</span>
                      </button>

                      <button
                        onClick={() => copyToClipboard(activeSegment.narration[0]?.text || '', activeSegment.id)}
                        className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === activeSegment.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Delivery Style Selector Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-[#030713] p-2 rounded border border-cyan-500/20">
                    <div className="flex items-center space-x-1 text-xs font-tech text-cyan-300">
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>DELIVERY STYLE:</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      {(['whisper', 'urgent', 'calm', 'dramatic_pause', 'analytical'] as const).map((style) => (
                        <button
                          key={style}
                          onClick={() => handleDeliveryStyleChange(style)}
                          className={`px-2 py-0.5 rounded text-[10px] font-tech uppercase border transition-all cursor-pointer ${
                            activeSegment.deliveryStyle === style
                              ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold'
                              : 'bg-transparent border-slate-800 text-slate-400 hover:border-cyan-500/30'
                          }`}
                        >
                          {style.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Editable Narration Textarea */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-tech text-cyan-300">
                      <span className="flex items-center space-x-1">
                        <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>NARRATOR VOICEOVER SCRIPT</span>
                      </span>
                      <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400">
                        <span>WORDS: <strong className="text-cyan-300">{activeSegment.narration[0]?.text.split(/\s+/).filter(Boolean).length || 0}</strong> / {activeSegment.wordsTarget}</span>
                        <span>EST. TIME: <strong className="text-cyan-300">{Math.round(((activeSegment.narration[0]?.text.split(/\s+/).filter(Boolean).length || 0) / 150) * 60)}s</strong></span>
                      </div>
                    </div>

                    <textarea
                      rows={8}
                      value={activeSegment.narration[0]?.text || ''}
                      onChange={(e) => handleUpdateNarration(e.target.value)}
                      className="w-full bg-[#02050f] border border-cyan-500/30 rounded p-3 text-xs text-slate-100 font-sans leading-relaxed focus:outline-none focus:border-cyan-400"
                      placeholder="Write or edit narration voiceover here..."
                    />
                  </div>

                  {/* Quick AI Segment Tone Rewriting */}
                  <div className="flex items-center justify-between bg-[#040916] p-2 rounded border border-cyan-500/20 text-xs">
                    <div className="flex items-center space-x-1 text-slate-400 font-mono text-[10px]">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>QUICK REWRITE:</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      {['Suspenseful', 'Conversational', 'High energy', 'Dramatic', 'Analytical'].map((t) => (
                        <button
                          key={t}
                          onClick={() => handleRegenerateSegment(t)}
                          disabled={isAiThinking}
                          className="px-2 py-0.5 rounded bg-slate-900 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-[10px] font-tech text-cyan-300 cursor-pointer"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hook Line Box */}
                  <div className="bg-cyan-950/30 border border-cyan-500/20 rounded p-2.5">
                    <div className="text-[10px] font-tech uppercase text-cyan-400 mb-0.5">
                      Key Hook / Retention Trigger
                    </div>
                    <div className="text-xs font-serif italic text-cyan-200">
                      "{activeSegment.hookLine}"
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: CONNECTED SOURCE SCENE & VISUAL DIRECTION (Col 5) */}
                <div className="lg:col-span-5 hud-panel rounded-lg p-4 border border-cyan-500/30 hud-corners space-y-3">
                  <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                    <div className="flex items-center space-x-1.5 text-xs font-tech text-cyan-300 font-bold uppercase">
                      <Film className="w-4 h-4 text-cyan-400" />
                      <span>CONNECTED SOURCE SCENE</span>
                    </div>
                    <span className="font-mono text-[10px] text-cyan-400">
                      TWO-WAY LINK ACTIVE
                    </span>
                  </div>

                  {connectedScene ? (
                    <div className="space-y-3">
                      {/* Scene Image Frame */}
                      <div className="relative rounded overflow-hidden border border-cyan-500/30 group">
                        <img 
                          src={connectedScene.thumbnailUrl} 
                          alt={connectedScene.title}
                          className="w-full h-36 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                          <div className="text-xs font-tech font-bold text-white">
                            {connectedScene.title}
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-cyan-300 border border-cyan-500/40">
                          {connectedScene.timeRange}
                        </div>
                      </div>

                      {/* Scene Dialogue Snippets */}
                      <div className="bg-[#030713] p-2.5 rounded border border-cyan-500/20 space-y-1">
                        <div className="text-[10px] font-tech uppercase text-cyan-400">
                          Key Cinema Dialogue
                        </div>
                        <p className="text-xs text-slate-300 italic font-serif">
                          "{connectedScene.keyDialogue || 'Establishing dream layers and subconscious projections.'}"
                        </p>
                      </div>

                      {/* Visual Action & Film Cuts Notes */}
                      <div className="bg-[#040916] p-2.5 rounded border border-cyan-500/20 space-y-1">
                        <div className="flex items-center space-x-1 text-[10px] font-tech uppercase text-cyan-400 font-bold">
                          <Eye className="w-3.5 h-3.5" />
                          <span>VISUAL CUE & DIRECTOR INSTRUCTION</span>
                        </div>
                        <p className="text-xs text-slate-200 font-sans leading-relaxed">
                          {activeSegment.visualNotes}
                        </p>
                      </div>

                      {/* Emotional Tone and Timeline Jump */}
                      <div className="flex items-center justify-between text-xs font-mono pt-1">
                        <span className="text-slate-400">
                          Mood: <strong className="text-cyan-300">{connectedScene.emotionalTone}</strong>
                        </span>
                        <button
                          onClick={() => navigateTo('ai-first-cut')}
                          className="text-xs font-tech text-cyan-300 hover:text-cyan-100 flex items-center space-x-1 cursor-pointer"
                        >
                          <span>VIEW IN TIMELINE</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 italic p-4 text-center">
                      No connected scene found. Select a script segment with linked scenes.
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* TAB 2: AI STORY DIRECTOR COMMAND SUITE */}
      {activeTab === 'director' && (
        <div className="hud-panel p-4 rounded-lg border border-cyan-500/30 hud-corners space-y-4">
          <div className="flex items-center space-x-2 border-b border-cyan-500/20 pb-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-tech font-bold text-cyan-200 uppercase">
              AI STORY DIRECTOR COMMAND CONSOLE (MUTATES ACTUAL PROJECT DATA)
            </h2>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Click any direct command below or enter a custom directive. The Cinema AI Director will recalculate narrative beats, rewrite segments, re-allocate duration, and modify the underlying project state.
          </p>

          {/* Quick Directives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {directorQuickCommands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => handleRunDirectorCmd(cmd)}
                disabled={isAiThinking}
                className="p-3 rounded-lg bg-[#040916] hover:bg-cyan-950/80 border border-cyan-500/30 hover:border-cyan-400 text-left transition-all cursor-pointer group shadow-[0_0_10px_rgba(0,240,255,0.05)]"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">DIRECTIVE 0{idx + 1}</span>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-xs font-tech font-bold text-slate-100 group-hover:text-cyan-200">
                  {cmd}
                </div>
              </button>
            ))}
          </div>

          {/* Custom Director Directive Input */}
          <div className="bg-[#030713] p-3 rounded-lg border border-cyan-500/30 flex items-center space-x-2">
            <input
              type="text"
              value={directorPrompt}
              onChange={(e) => setDirectorPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && directorPrompt.trim()) {
                  handleRunDirectorCmd(directorPrompt);
                  setDirectorPrompt('');
                }
              }}
              placeholder="Give a custom director instruction (e.g. 'Emphasize the spinning totem and question whether Cobb ever woke up')..."
              className="flex-1 bg-transparent border-none text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
            />
            <button
              onClick={() => {
                if (directorPrompt.trim()) {
                  handleRunDirectorCmd(directorPrompt);
                  setDirectorPrompt('');
                }
              }}
              disabled={isAiThinking || !directorPrompt.trim()}
              className="px-4 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-xs font-tech text-cyan-200 flex items-center space-x-1.5 cursor-pointer disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>EXECUTE DIRECTIVE</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: SCRIPT REVISIONS & VERSION CONTROL */}
      {activeTab === 'versions' && (
        <div className="hud-panel p-4 rounded-lg border border-cyan-500/30 hud-corners space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-tech font-bold text-cyan-200 uppercase">
                SCRIPT SNAPSHOTS & VERSION CONTROL
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newVersionName}
                onChange={(e) => setNewVersionName(e.target.value)}
                placeholder="Snapshot Name (e.g. Script V2 - High Mystery)"
                className="bg-[#040816] border border-cyan-500/30 rounded px-2.5 py-1 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={() => {
                  saveScriptVersion(newVersionName.trim() || undefined);
                  setNewVersionName('');
                }}
                className="px-3 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-xs font-tech text-cyan-200 cursor-pointer"
              >
                SAVE SNAPSHOT
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(currentProject.scriptVersions || []).map((ver) => (
              <div
                key={ver.id}
                className="bg-[#040916] border border-cyan-500/20 hover:border-cyan-400/50 rounded-lg p-3 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-300 font-bold">{ver.versionName}</span>
                  <span className="text-slate-400 text-[10px]">{ver.timestamp}</span>
                </div>

                <div className="text-xs text-slate-300 font-sans">
                  Language: <strong>{ver.language}</strong> • {ver.wordsCount} words • {ver.segments.length} segments
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-cyan-500/10">
                  <span>Duration: {ver.targetDuration}</span>
                  <button
                    onClick={() => restoreScriptVersion(ver.id)}
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

      {/* TAB 4: PRONUNCIATION HELPER */}
      {activeTab === 'pronunciation' && (
        <div className="hud-panel p-4 rounded-lg border border-cyan-500/30 hud-corners space-y-4">
          <div className="flex items-center space-x-2 border-b border-cyan-500/20 pb-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-tech font-bold text-cyan-200 uppercase">
              CINEMA PRONUNCIATION HELPER & PHONETIC DICTIONARY
            </h2>
          </div>

          <p className="text-xs text-slate-300 font-sans">
            Ensure character names, sci-fi concepts, and foreign terms are pronounced accurately by synthetic voice actors across Hindi, Hinglish, and English models.
          </p>

          {/* Add New Pronunciation Rule */}
          <div className="bg-[#030713] p-3 rounded-lg border border-cyan-500/30 flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={newPronTerm}
              onChange={(e) => setNewPronTerm(e.target.value)}
              placeholder="Term (e.g. Ariadne)"
              className="flex-1 bg-[#040816] border border-cyan-500/30 rounded px-2.5 py-1 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <input
              type="text"
              value={newPronIpa}
              onChange={(e) => setNewPronIpa(e.target.value)}
              placeholder="Phonetic / IPA (e.g. ah-ree-ahd-nee)"
              className="flex-1 bg-[#040816] border border-cyan-500/30 rounded px-2.5 py-1 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleAddPronunciation}
              className="px-4 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-xs font-tech text-cyan-200 cursor-pointer"
            >
              ADD RULE
            </button>
          </div>

          {/* Pronunciation Rules List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(currentProject.voiceSettings?.customPronunciations || [
              { term: 'PASIV', ipa: 'p-ah-s-i-v' },
              { term: 'Ariadne', ipa: 'ah-ree-ahd-nee' },
              { term: 'Limbo', ipa: 'l-ih-m-b-oh' },
              { term: 'Saito', ipa: 's-eye-t-oh' },
              { term: 'Fischer', ipa: 'f-ih-sh-er' }
            ]).map((rule, idx) => (
              <div
                key={idx}
                className="bg-[#040916] border border-cyan-500/20 rounded p-3 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-tech font-bold text-cyan-300">{rule.term}</div>
                  <div className="text-[11px] font-mono text-slate-400">{rule.ipa}</div>
                </div>
                <button
                  onClick={() => {
                    const fallbackVoice: VoiceLabSettings = {
                      gcpConfigured: false,
                      selectedLanguage: 'en-US',
                      selectedVoiceId: 'en-US-Journey-D',
                      gender: 'male',
                      speakingRate: 1.0,
                      pitch: 0,
                      volumeGainDb: 0,
                      deliveryPreset: 'Noir Analytical',
                      ssmlMode: false,
                      ssmlText: '',
                      pauseMs: 400,
                      customPronunciations: []
                    };
                    const voiceSettings: VoiceLabSettings = currentProject.voiceSettings || fallbackVoice;
                    synthesizeVoiceSpeech(rule.term, voiceSettings);
                  }}
                  className="p-1.5 rounded bg-cyan-950 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
