/**
 * THE DEVIL'S EYE - Web Series Multi-Episode Workstation
 * 
 * Supports:
 * - Season management (Season 1, 2, 3...)
 * - Episode breakdowns & episode timeline
 * - Character development tracking across episodes
 * - Character relationship matrix & shifting loyalties
 * - Key events timeline with cross-episode causality
 * - Unresolved mysteries & clue tracking
 * - Previous reveals log with shock ratings
 * - Reusable "Series Memory" lore database across all episodes
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Tv, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Film,
  Play,
  Users,
  GitBranch,
  HelpCircle,
  Eye,
  Database,
  Calendar,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Brain,
  Sliders
} from 'lucide-react';
import { playHudClick, playHudScan, playHudSuccess } from '../services/soundFx';

interface WebSeriesEpisode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  runtime: string;
  runtimeSec: number;
  status: 'Analyzed' | 'In Script' | 'Cutting' | 'Ready' | 'Queued';
  twist: string;
  synopsis: string;
  timelineBeats: Array<{ time: string; event: string; type: 'hook' | 'clue' | 'twist' | 'cliffhanger' }>;
}

interface WebCharacterArc {
  characterName: string;
  actor: string;
  role: string;
  arcStatus: string;
  moralShift: string;
  development: string;
  episodesPresent: number[];
  relationships: Array<{ target: string; dynamic: string; tension: number }>;
}

interface UnresolvedMystery {
  id: string;
  mystery: string;
  introducedIn: string;
  clues: string[];
  status: 'OPEN' | 'PARTIALLY REVEALED' | 'SOLVED';
  urgencyScore: number; // 0 - 100
}

interface PreviousReveal {
  id: string;
  episode: string;
  reveal: string;
  shockValue: number;
  plotImpact: string;
}

export const WebSeriesManager: React.FC = () => {
  const { currentProject, addToast, executeAiCommand, isAiThinking, navigateTo } = useApp();
  
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string>('ep-1');
  const [activeTab, setActiveTab] = useState<'episodes' | 'characters' | 'mysteries' | 'series-memory'>('episodes');

  // Multi-Episode Database
  const [episodes, setEpisodes] = useState<WebSeriesEpisode[]>([
    {
      id: 'ep-1',
      seasonNumber: 1,
      episodeNumber: 1,
      title: 'Ep 1: The First Inception',
      runtime: '54m',
      runtimeSec: 3240,
      status: 'Analyzed',
      twist: 'Cobb meets Mal\'s projection in dream level 1; Saito reveals the true test.',
      synopsis: 'Dom Cobb and Arthur attempt a corporate extraction inside Saito\'s mind, only to discover their client is testing them for an impossible mission.',
      timelineBeats: [
        { time: '04:12', event: 'Extraction breach in Kyoto palace', type: 'hook' },
        { time: '22:40', event: 'Mal disrupts the carpet texture clue', type: 'clue' },
        { time: '41:15', event: 'Saito offers clean slate US re-entry', type: 'twist' },
        { time: '52:00', event: 'Totem spins in hotel room cut', type: 'cliffhanger' },
      ]
    },
    {
      id: 'ep-2',
      seasonNumber: 1,
      episodeNumber: 2,
      title: 'Ep 2: The Paris Architect',
      runtime: '48m',
      runtimeSec: 2880,
      status: 'Analyzed',
      twist: 'Ariadne folds the city grid and discovers Cobb\'s subconscious elevator memory cage.',
      synopsis: 'Cobb recruits Ariadne at the Paris university. She discovers Cobb is harboring dangerous projections of his deceased wife Mal.',
      timelineBeats: [
        { time: '02:30', event: 'Meeting Professor Miles in lecture hall', type: 'hook' },
        { time: '18:50', event: 'Bending Paris street grid 90 degrees', type: 'clue' },
        { time: '34:10', event: 'Subconscious elevator basement discovery', type: 'twist' },
        { time: '46:20', event: 'Ariadne wakes after Mal stabbing projection', type: 'cliffhanger' },
      ]
    },
    {
      id: 'ep-3',
      seasonNumber: 1,
      episodeNumber: 3,
      title: 'Ep 3: Yusuf\'s Compound',
      runtime: '52m',
      runtimeSec: 3120,
      status: 'Analyzed',
      twist: 'Sedative causes real death in dream to plunge victims into Limbo abyss.',
      synopsis: 'The team assembles in Mombasa. Yusuf reveals the hyper-potent sedative required to breach 3 dream tiers, introducing unannounced fatal stakes.',
      timelineBeats: [
        { time: '06:00', event: 'Eames forgery demonstration in gambling den', type: 'hook' },
        { time: '21:30', event: 'Cobweb alley chase in Mombasa', type: 'clue' },
        { time: '38:12', event: 'Yusuf\'s basement dreamers testing sleep', type: 'clue' },
        { time: '50:40', event: 'Sedative Limbo rule revealed to team', type: 'cliffhanger' },
      ]
    },
    {
      id: 'ep-4',
      seasonNumber: 1,
      episodeNumber: 4,
      title: 'Ep 4: Zero Gravity Corridor',
      runtime: '61m',
      runtimeSec: 3660,
      status: 'In Script',
      twist: 'The van plunges from the bridge early; Arthur must orchestrate zero-g kick alone.',
      synopsis: 'Level 1 rain heist suffers sub-machine gun ambush by Fischer\'s militarized subconscious. Arthur battles security guards in a rotating hotel corridor.',
      timelineBeats: [
        { time: '08:15', event: 'Rain ambush by militarized subconscious', type: 'hook' },
        { time: '28:00', event: 'Hotel room 528 weightlessness initiation', type: 'twist' },
        { time: '48:30', event: 'Arthur rigs elevator explosive cables', type: 'clue' },
        { time: '59:15', event: 'Van breaches bridge guard rail', type: 'cliffhanger' },
      ]
    },
    {
      id: 'ep-5',
      seasonNumber: 1,
      episodeNumber: 5,
      title: 'Ep 5: The Mountain Fortress',
      runtime: '50m',
      runtimeSec: 3000,
      status: 'Queued',
      twist: 'Fischer enters his father\'s safe; Mal snipes Fischer before the idea implants.',
      synopsis: 'Eames leads the ski assault on the mountain medical fortress. Mal emerges and executes Fischer, forcing Cobb and Ariadne to plunge into Limbo.',
      timelineBeats: [
        { time: '05:40', event: 'Blizzard infiltration at Level 3', type: 'hook' },
        { time: '24:10', event: 'Defibrillator kick countdown in hotel', type: 'clue' },
        { time: '42:50', event: 'Mal shoots Fischer on balcony', type: 'twist' },
        { time: '49:20', event: 'Cobb and Ariadne connect PASIV to Limbo', type: 'cliffhanger' },
      ]
    },
    {
      id: 'ep-6',
      seasonNumber: 1,
      episodeNumber: 6,
      title: 'Ep 6: The Limbo Abyss',
      runtime: '64m',
      runtimeSec: 3840,
      status: 'Queued',
      twist: 'The truth of Mal\'s suicide: Cobb planted the idea that caused her death.',
      synopsis: 'In crumbling subconscious ruins, Cobb confesses to Ariadne that he performed the first inception on Mal, planting the idea that her world wasn\'t real.',
      timelineBeats: [
        { time: '10:15', event: 'Arrival at decaying coastal skyline', type: 'hook' },
        { time: '35:20', event: 'Confronting Mal in dollhouse kitchen', type: 'clue' },
        { time: '51:40', event: 'Confession of Mal\'s safe inception', type: 'twist' },
        { time: '62:10', event: 'Old Saito hands Cobb his gun in dining room', type: 'cliffhanger' },
      ]
    },
  ]);

  // Character Development Arcs Across Web Series
  const characterArcs: WebCharacterArc[] = [
    {
      characterName: 'Dom Cobb',
      actor: 'Leonardo DiCaprio',
      role: 'Lead Extractor & Haunted Architect',
      arcStatus: 'Grief-Driven Paranoia → Self-Forgiveness',
      moralShift: 'Begins hiding lethal secrets from his team; ends with complete emotional catharsis.',
      development: 'Trapped by the memory of Mal\'s suicide. In Season 1, his inability to control his subconscious threatens the entire inception team until he confronts his guilt.',
      episodesPresent: [1, 2, 3, 4, 5, 6],
      relationships: [
        { target: 'Mal Cobb', dynamic: 'Tragic Love & Toxic Guilt Projection', tension: 98 },
        { target: 'Ariadne', dynamic: 'Mentor & Subconscious Confidante', tension: 65 },
        { target: 'Arthur', dynamic: 'Trusted Tactical Partner', tension: 35 },
      ]
    },
    {
      characterName: 'Ariadne',
      actor: 'Elliot Page',
      role: 'Architect & Moral Anchor',
      arcStatus: 'Innocent Student → Subconscious Guardian',
      moralShift: 'From academic curiosity to willingly plunging into Limbo to save Cobb from his own delusions.',
      development: 'The only person aware of Cobb\'s psychological fracture. Evolves from puzzle designer into the team\'s emotional conscience.',
      episodesPresent: [2, 3, 4, 5, 6],
      relationships: [
        { target: 'Dom Cobb', dynamic: 'Protector & Mirror of Truth', tension: 72 },
        { target: 'Arthur', dynamic: 'Rival Strategist & Colleague', tension: 40 },
      ]
    },
    {
      characterName: 'Robert Fischer',
      actor: 'Cillian Murphy',
      role: 'Target & Emotional Crucible',
      arcStatus: 'Bitter Heir → Reconciled Son',
      moralShift: 'Manipulated by inception into believing his father wanted him to forge his own path.',
      development: 'The emotional target whose unresolved father wounds become the playground for the team\'s multi-tier inception.',
      episodesPresent: [3, 4, 5, 6],
      relationships: [
        { target: 'Maurice Fischer', dynamic: 'Fatherhood Disappointment & Longing', tension: 94 },
        { target: 'Peter Browning', dynamic: 'Trusted Godfather & Hidden Betrayal', tension: 88 },
      ]
    }
  ];

  // Unresolved Mysteries & Clue Tracking
  const [mysteries, setMysteries] = useState<UnresolvedMystery[]>([
    {
      id: 'myst-1',
      mystery: 'Does the silver totem truly belong to Cobb or Mal?',
      introducedIn: 'Episode 1 (00:52)',
      clues: [
        'Arthur states in Ep 2: "Never let anyone touch your totem, only you can know its balance."',
        'Cobb confesses in Ep 6: "It was her totem. She would spin it to check reality."',
        'Cobb is not wearing his wedding ring when he visits his children in the final scene.'
      ],
      status: 'PARTIALLY REVEALED',
      urgencyScore: 98
    },
    {
      id: 'myst-2',
      mystery: 'Who built the snow mountain fortress in Level 3?',
      introducedIn: 'Episode 5 (05:40)',
      clues: [
        'Eames claimed it was designed from Fischer\'s childhood memories.',
        'Ariadne warns that Fischer\'s militarized subconscious trained in security extraction.'
      ],
      status: 'SOLVED',
      urgencyScore: 82
    },
    {
      id: 'myst-3',
      mystery: 'Did Saito survive Limbo without severe psychological brain damage?',
      introducedIn: 'Episode 6 (62:10)',
      clues: [
        'Saito spent decades in Limbo as an elderly man before Cobb found him.',
        'The phone call at LAX customs went through immediately without complications.'
      ],
      status: 'OPEN',
      urgencyScore: 91
    }
  ]);

  // Previous Reveals Log
  const previousReveals: PreviousReveal[] = [
    {
      id: 'rev-1',
      episode: 'Ep 1: The First Inception',
      reveal: 'Saito was consciously testing Cobb and Arthur during their botched extraction attempt.',
      shockValue: 88,
      plotImpact: 'Transforms Cobb from predator to desperate contractor.'
    },
    {
      id: 'rev-2',
      episode: 'Ep 3: Yusuf\'s Compound',
      reveal: 'Yusuf\'s sedative prevents waking up from fatal wounds; death leads to Limbo.',
      shockValue: 95,
      plotImpact: 'Raises the stakes to irreversible mortality.'
    },
    {
      id: 'rev-3',
      episode: 'Ep 6: The Limbo Abyss',
      reveal: 'Cobb committed the first inception on Mal by spinning her totem in the dollhouse safe.',
      shockValue: 99,
      plotImpact: 'Reveals Cobb as the direct creator of Mal\'s suicidal obsession.'
    }
  ];

  const selectedEpisode = episodes.find(e => e.id === selectedEpisodeId) || episodes[0];

  const handleGenerateSeasonRecap = async () => {
    playHudScan();
    await executeAiCommand(`Generate full Season ${selectedSeason} cross-episode mystery recap video (45 minutes)`);
    addToast('Recap Synthesized', `Season ${selectedSeason} multi-episode recap ready in Script Studio`, 'success');
  };

  const handleOpenEpisodeScript = (epNumber: number) => {
    playHudClick();
    addToast('Opening Episode', `Loaded Episode ${epNumber} in Script Studio`, 'info');
    navigateTo('script-studio');
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-y-auto bg-[#02050f] text-slate-100 p-4 space-y-4 select-none bg-hud-grid">
      
      {/* Header */}
      <div className="hud-panel p-4 rounded-lg border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hud-corners">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded bg-cyan-950/80 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
            <Tv className="w-5 h-5 text-cyan-300 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-cyan-100 flex items-center gap-2">
              WEB SERIES MULTI-EPISODE WORKSTATION
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400/50 text-cyan-300">
                SEASON 0{selectedSeason}
              </span>
            </h1>
            <p className="text-xs font-mono text-cyan-400/70">
              CROSS-EPISODE NARRATIVE ARCS, CHARACTER LOYALTIES & SERIES MEMORY ENGINE
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Season Selector */}
          <div className="flex items-center space-x-1 bg-slate-900 border border-cyan-500/30 p-1 rounded">
            {[1, 2, 3].map(s => (
              <button
                key={s}
                onClick={() => { playHudClick(); setSelectedSeason(s); }}
                className={`px-2.5 py-1 rounded text-xs font-mono cursor-pointer ${
                  selectedSeason === s
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                S0{s}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerateSeasonRecap}
            disabled={isAiThinking}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-tech font-bold text-xs px-4 py-2 rounded border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.4)] flex items-center space-x-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>GENERATE SEASON RECAP (45 MIN)</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-cyan-500/20 pb-2 text-xs font-tech">
        <button
          onClick={() => { playHudClick(); setActiveTab('episodes'); }}
          className={`px-3 py-1.5 rounded flex items-center space-x-1.5 cursor-pointer transition-all ${
            activeTab === 'episodes'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-400/60 shadow-[0_0_8px_rgba(0,240,255,0.2)] font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>EPISODES & TIMELINE</span>
        </button>

        <button
          onClick={() => { playHudClick(); setActiveTab('characters'); }}
          className={`px-3 py-1.5 rounded flex items-center space-x-1.5 cursor-pointer transition-all ${
            activeTab === 'characters'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-400/60 shadow-[0_0_8px_rgba(0,240,255,0.2)] font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>CHARACTER ARCS & RELATIONSHIPS</span>
        </button>

        <button
          onClick={() => { playHudClick(); setActiveTab('mysteries'); }}
          className={`px-3 py-1.5 rounded flex items-center space-x-1.5 cursor-pointer transition-all ${
            activeTab === 'mysteries'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-400/60 shadow-[0_0_8px_rgba(0,240,255,0.2)] font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>UNRESOLVED MYSTERIES & REVEALS</span>
        </button>

        <button
          onClick={() => { playHudClick(); setActiveTab('series-memory'); }}
          className={`px-3 py-1.5 rounded flex items-center space-x-1.5 cursor-pointer transition-all ${
            activeTab === 'series-memory'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-400/60 shadow-[0_0_8px_rgba(0,240,255,0.2)] font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>SERIES MEMORY (REUSABLE LORE)</span>
        </button>
      </div>

      {/* TAB 1: EPISODES & TIMELINE */}
      {activeTab === 'episodes' && (
        <div className="space-y-4">
          
          {/* Episode Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {episodes.map((ep) => {
              const isSelected = ep.id === selectedEpisodeId;
              return (
                <div
                  key={ep.id}
                  onClick={() => { playHudClick(); setSelectedEpisodeId(ep.id); }}
                  className={`hud-panel rounded-lg p-3.5 border cursor-pointer hud-corners space-y-2.5 transition-all ${
                    isSelected
                      ? 'bg-[#061224] border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'border-cyan-500/25 hover:border-cyan-400/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 font-bold">EPISODE 0{ep.episodeNumber}</span>
                    <span className="text-slate-400">{ep.runtime}</span>
                  </div>

                  <h3 className="font-tech font-bold text-sm text-slate-100">{ep.title}</h3>

                  <p className="text-xs text-slate-300 line-clamp-2">{ep.synopsis}</p>

                  <div className="bg-[#050b18] border border-cyan-500/20 rounded p-2 text-xs space-y-1">
                    <div className="text-[10px] font-tech text-cyan-400 uppercase">Key Cliffhanger / Twist</div>
                    <div className="text-slate-300 text-[11px] line-clamp-2">{ep.twist}</div>
                  </div>

                  <div className="pt-2 border-t border-cyan-500/15 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
                      {ep.status}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenEpisodeScript(ep.episodeNumber); }}
                      className="text-[10px] font-tech text-cyan-400 hover:text-cyan-200 cursor-pointer flex items-center gap-1"
                    >
                      <span>SCRIPT WORKSPACE</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Episode Interactive Timeline Strip */}
          <div className="hud-panel p-4 rounded-lg border border-cyan-500/30 hud-corners space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <span className="text-xs font-tech font-bold uppercase text-cyan-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>EPISODE TIMELINE: {selectedEpisode.title} ({selectedEpisode.runtime})</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                4 CRITICAL NARRATIVE BEATS
              </span>
            </div>

            {/* Timeline track visualizer */}
            <div className="relative py-4">
              <div className="h-2 bg-slate-900 rounded-full border border-cyan-500/30 relative overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 w-full opacity-70" />
              </div>

              {/* Anchors on timeline */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {selectedEpisode.timelineBeats.map((beat, idx) => {
                  const typeColors = {
                    hook: 'text-cyan-300 border-cyan-500/40 bg-cyan-950',
                    clue: 'text-purple-300 border-purple-500/40 bg-purple-950',
                    twist: 'text-amber-300 border-amber-500/40 bg-amber-950',
                    cliffhanger: 'text-red-300 border-red-500/40 bg-red-950 animate-pulse'
                  };

                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded bg-[#040a18] border border-cyan-500/20 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="text-slate-300 font-bold">{beat.time}</span>
                        <span className={`px-1.5 py-0.2 rounded uppercase border ${typeColors[beat.type]}`}>
                          {beat.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-200">{beat.event}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: CHARACTER ARCS & RELATIONSHIPS */}
      {activeTab === 'characters' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {characterArcs.map((char) => (
              <div
                key={char.characterName}
                className="hud-panel p-4 rounded-lg border border-cyan-500/30 hud-corners space-y-3"
              >
                <div className="border-b border-cyan-500/20 pb-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-tech font-bold text-cyan-200">{char.characterName}</h3>
                    <span className="text-[10px] font-mono text-slate-400">{char.actor}</span>
                  </div>
                  <div className="text-[11px] text-purple-300 font-mono">{char.role}</div>
                </div>

                <div className="bg-[#030916] p-2.5 rounded border border-cyan-500/20 space-y-1">
                  <div className="text-[10px] font-tech text-cyan-400 uppercase">Season Arc Progression</div>
                  <p className="text-xs text-slate-300">{char.arcStatus}</p>
                </div>

                <div className="bg-[#030916] p-2.5 rounded border border-cyan-500/20 space-y-1">
                  <div className="text-[10px] font-tech text-amber-400 uppercase">Moral Shift Across Episodes</div>
                  <p className="text-xs text-slate-300">{char.moralShift}</p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-tech text-cyan-400 uppercase">Relationship Tension Matrix</div>
                  {char.relationships.map((rel, idx) => (
                    <div key={idx} className="text-[11px] bg-[#020610] p-2 rounded border border-slate-800 space-y-0.5">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-200 font-bold">{rel.target}</span>
                        <span className="text-red-400">{rel.tension}% Tension</span>
                      </div>
                      <p className="text-[10px] text-slate-400">{rel.dynamic}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: UNRESOLVED MYSTERIES & REVEALS */}
      {activeTab === 'mysteries' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Unresolved Mysteries */}
          <div className="hud-panel p-4 rounded-lg border border-cyan-500/30 hud-corners space-y-3">
            <div className="text-xs font-tech font-bold uppercase text-cyan-300 flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>UNRESOLVED MYSTERIES & CLUE TRACKER</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {mysteries.length} ACTIVE MYSTERIES
              </span>
            </div>

            <div className="space-y-3">
              {mysteries.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-lg bg-[#030916] border border-cyan-500/25 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-tech font-bold text-slate-100">{m.mystery}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                      m.status === 'SOLVED'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                        : m.status === 'PARTIALLY REVEALED'
                        ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                        : 'bg-red-950 text-red-300 border-red-500/40'
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-cyan-400/80">Introduced: {m.introducedIn}</div>

                  <div className="space-y-1 bg-[#02050f] p-2 rounded border border-slate-800">
                    <div className="text-[9.5px] font-mono text-slate-400 uppercase">Clues Identified:</div>
                    {m.clues.map((clue, idx) => (
                      <div key={idx} className="text-[10.5px] text-slate-300 flex items-start gap-1">
                        <span className="text-cyan-400">&bull;</span>
                        <span>{clue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Previous Reveals Log */}
          <div className="hud-panel p-4 rounded-lg border border-cyan-500/30 hud-corners space-y-3">
            <div className="text-xs font-tech font-bold uppercase text-purple-300 flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-purple-400" />
                <span>PREVIOUS REVEALS & SHOCK VALUES</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                LORE REVELATIONS
              </span>
            </div>

            <div className="space-y-3">
              {previousReveals.map((r) => (
                <div
                  key={r.id}
                  className="p-3 rounded-lg bg-[#030916] border border-purple-500/25 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-purple-300 font-bold">{r.episode}</span>
                    <span className="text-amber-400 font-bold">{r.shockValue}% Shock Rating</span>
                  </div>

                  <p className="font-tech font-bold text-slate-200 text-xs">{r.reveal}</p>

                  <div className="p-2 rounded bg-[#02050f] border border-slate-800 text-[11px] text-slate-400">
                    <strong className="text-slate-300">Plot Impact:</strong> {r.plotImpact}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: SERIES MEMORY (REUSABLE LORE DATABASE) */}
      {activeTab === 'series-memory' && (
        <div className="hud-panel p-4 rounded-lg border border-cyan-500/30 hud-corners space-y-4">
          <div className="border-b border-cyan-500/20 pb-2 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-tech font-bold uppercase text-cyan-300 flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>SERIES MEMORY ENGINE & PERSISTENT KNOWLEDGE GRAPH</span>
              </h2>
              <p className="text-xs font-mono text-slate-400">
                LORE, RECURRING MOTIFS & AXIOMATIC RULES SHARED ACROSS ALL EPISODES
              </p>
            </div>

            <button
              onClick={() => { playHudSuccess(); addToast('Series Memory Synced', 'Global lore database persisted for Season 1 & 2', 'success'); }}
              className="px-3 py-1.5 rounded bg-cyan-950 border border-cyan-400/50 text-cyan-300 text-xs font-mono cursor-pointer"
            >
              SYNC SERIES LORE
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#030916] p-3.5 rounded border border-cyan-500/20 space-y-2">
              <div className="font-tech font-bold text-cyan-300 text-sm">RECURRING MOTIFS</div>
              <ul className="space-y-1.5 text-slate-300">
                <li>&bull; <strong className="text-slate-100">Edith Piaf Song:</strong> "Non, je ne regrette rien" signals the synchronized kick countdown.</li>
                <li>&bull; <strong className="text-slate-100">Water Submersion:</strong> Falling off the bridge into river represents boundary crossing.</li>
                <li>&bull; <strong className="text-slate-100">Spinning Totem:</strong> Reality check device that never stops in Limbo.</li>
              </ul>
            </div>

            <div className="bg-[#030916] p-3.5 rounded border border-cyan-500/20 space-y-2">
              <div className="font-tech font-bold text-cyan-300 text-sm">ESTABLISHED RULES OF REALITY</div>
              <ul className="space-y-1.5 text-slate-300">
                <li>&bull; <strong className="text-slate-100">Time Dilation Ratio:</strong> 1:20 scale per dream tier (5 mins awake = 100 mins in Level 1 = 33 hours in Level 2).</li>
                <li>&bull; <strong className="text-slate-100">The Kick Mechanism:</strong> Inner-ear balance sensation (free-fall) required to snap dreamer back up.</li>
                <li>&bull; <strong className="text-slate-100">Inception Vulnerability:</strong> The recipient must believe the planted idea was self-originated.</li>
              </ul>
            </div>

            <div className="bg-[#030916] p-3.5 rounded border border-cyan-500/20 space-y-2">
              <div className="font-tech font-bold text-cyan-300 text-sm">CROSS-EPISODE CONTINUITY AUDIT</div>
              <ul className="space-y-1.5 text-slate-300">
                <li>&bull; <strong className="text-slate-100">Cobb\'s Wedding Ring:</strong> Worn in dream states (Ep 1, 2, 4, 6), missing in real world.</li>
                <li>&bull; <strong className="text-slate-100">Children\'s Ages:</strong> Philippa and James never age across memories until final scene.</li>
                <li>&bull; <strong className="text-slate-100">Miles\' Lecture:</strong> Explains architectural geometry in Ep 2 that Ariadne employs in Ep 4.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
