/**
 * THE DEVIL'S EYE - Movie Library Page
 * Media Ingestion, Project Management, and Multi-episode Web Series Archival.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Project, ProjectType } from '../types';
import { 
  Film, 
  Upload, 
  Plus, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Search, 
  Filter, 
  Sparkles, 
  FileText, 
  Music, 
  Tv, 
  ChevronRight,
  Trash2,
  HardDrive,
  BrainCircuit,
  Sliders,
  AlertTriangle
} from 'lucide-react';
import { playHudClick, playHudScan, playHudSuccess } from '../services/soundFx';
import { MovieIngestionCenter } from '../components/ingestion/MovieIngestionCenter';

export const MovieLibrary: React.FC = () => {
  const { projects, currentProject, setCurrentProjectId, createProject, navigateTo, addToast } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'web_series'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isIngestCenterOpen, setIsIngestCenterOpen] = useState(false);
  
  // New project modal form
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ProjectType>('movie');
  const [newDirector, setNewDirector] = useState('');
  const [newDuration, setNewDuration] = useState('02:15:00');
  const [newGenre, setNewGenre] = useState('Sci-Fi, Thriller');
  const [newSynopsis, setNewSynopsis] = useState('');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.director.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || p.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createProject({
      title: newTitle,
      type: newType,
      director: newDirector || 'Cinema Director',
      duration: newDuration,
      genre: newGenre.split(',').map(g => g.trim()),
      synopsis: newSynopsis || 'Imported cinema source awaiting full multimodal neural breakdown.',
      posterUrl: newType === 'movie'
        ? 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewSynopsis('');
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-y-auto bg-[#02050f] text-slate-100 p-4 space-y-4 select-none bg-hud-grid">
      {/* Top Header & Ingestion Toolbar */}
      <div className="hud-panel p-4 rounded-lg border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-4 hud-corners bg-[#030816]">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded bg-cyan-950/80 border border-cyan-400/50">
              <Film className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-cyan-100">CINEMA SOURCE LIBRARY</h1>
              <p className="text-xs font-mono text-cyan-400/70">
                PROJECT INGESTION & MULTIMODAL MEDIA ARCHIVE
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Main Ingestion Center Trigger */}
          <button
            onClick={() => {
              playHudScan();
              setIsIngestCenterOpen(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded text-xs font-tech font-bold border border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>LAUNCH MOVIE INGESTION CENTER</span>
          </button>

          {/* New Project Primary CTA */}
          <button
            onClick={() => {
              playHudClick();
              setIsCreateModalOpen(true);
            }}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-200 font-tech text-xs px-3 py-2 rounded flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>NEW ARCHIVE</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#040a16] border border-cyan-500/20 rounded-lg text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cinema sources, directors, genres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#02050f] border border-cyan-500/30 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-tech text-xs"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Filter:</span>
          {(['all', 'movie', 'web_series'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                playHudClick();
                setFilterType(t);
              }}
              className={`px-2.5 py-1 rounded text-xs font-tech uppercase transition-colors cursor-pointer ${
                filterType === t
                  ? 'bg-cyan-950 border border-cyan-400 text-cyan-200 font-bold'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t === 'web_series' ? 'Web Series' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Cinema Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((p) => {
          const isSelected = p.id === currentProject.id;
          const isAnalyzed = p.analysisStatus === 'ANALYSIS COMPLETE' || (p.characters && p.characters.length > 0);

          return (
            <div
              key={p.id}
              className={`group rounded-lg border transition-all duration-200 overflow-hidden flex flex-col justify-between bg-[#040816] ${
                isSelected
                  ? 'border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                  : 'border-cyan-500/20 hover:border-cyan-500/60 hover:shadow-[0_0_15px_rgba(0,240,255,0.1)]'
              }`}
            >
              {/* Poster Header */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={p.posterUrl}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040816] via-transparent to-transparent" />

                {/* Badges on Poster */}
                <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/80 border border-cyan-500/40 text-cyan-300 uppercase">
                    {p.type.replace('_', ' ')}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/80 border border-slate-700 text-slate-300">
                    {p.resolution}
                  </span>
                </div>

                <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1 font-mono text-[11px] text-cyan-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{p.duration}</span>
                  </div>

                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                      isAnalyzed
                        ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                        : 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                    }`}
                  >
                    {isAnalyzed ? 'AI ANALYSIS COMPLETE' : 'NOT ANALYZED'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-tech font-bold text-base text-slate-100 line-clamp-1">
                    {p.title}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    Dir. {p.director} ({p.year})
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 font-sans">
                    {p.synopsis}
                  </p>
                </div>

                {/* Metrics pill */}
                <div className="grid grid-cols-3 gap-1 py-1.5 border-y border-cyan-500/15 text-center text-[10px] font-mono text-slate-300">
                  <div>Potential: <strong className="text-cyan-300">{p.storyPotentialScore || 94}%</strong></div>
                  <div>Scenes: <strong className="text-cyan-300">{p.scenes?.length || 0}</strong></div>
                  <div>FPS: <strong className="text-cyan-300">{p.fps}</strong></div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono text-slate-500">
                    Edited {p.lastEdited}
                  </span>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => {
                        playHudClick();
                        setCurrentProjectId(p.id);
                        navigateTo('movie-intelligence');
                      }}
                      className="px-2.5 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400 text-cyan-200 rounded text-xs font-tech flex items-center space-x-1 cursor-pointer"
                      title="Open Cinema AI Brain"
                    >
                      <BrainCircuit className="w-3.5 h-3.5 text-cyan-300" />
                      <span>AI BRAIN</span>
                    </button>

                    <button
                      onClick={() => {
                        playHudClick();
                        setCurrentProjectId(p.id);
                        navigateTo('command-center');
                      }}
                      className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded text-xs font-tech font-bold border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)] flex items-center space-x-1 cursor-pointer"
                    >
                      <span>LOAD CORE</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* NEW PROJECT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="hud-panel max-w-lg w-full rounded-xl border border-cyan-500/40 p-6 relative shadow-[0_0_50px_rgba(0,240,255,0.15)] hud-corners-all bg-[#030816]">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4">
              <div className="flex items-center space-x-2 text-sm font-display font-bold text-cyan-200">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>INITIALIZE CINEMA PROJECT</span>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-100 text-xs font-mono cursor-pointer"
              >
                [ESC]
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-tech uppercase mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oppenheimer: The Destroyer of Worlds"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#050b18] border border-cyan-500/30 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-400 font-tech"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-tech uppercase mb-1">Format Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ProjectType)}
                    className="w-full bg-[#050b18] border border-cyan-500/30 rounded p-2 text-slate-100 font-tech"
                  >
                    <option value="movie">Full Feature Movie</option>
                    <option value="web_series">Web Series (Episodic)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-tech uppercase mb-1">Director</label>
                  <input
                    type="text"
                    placeholder="Christopher Nolan"
                    value={newDirector}
                    onChange={(e) => setNewDirector(e.target.value)}
                    className="w-full bg-[#050b18] border border-cyan-500/30 rounded p-2 text-slate-100 font-tech"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-tech uppercase mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="02:15:00"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full bg-[#050b18] border border-cyan-500/30 rounded p-2 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-tech uppercase mb-1">Genre</label>
                  <input
                    type="text"
                    placeholder="Sci-Fi, Thriller"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    className="w-full bg-[#050b18] border border-cyan-500/30 rounded p-2 text-slate-100 font-tech"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-tech uppercase mb-1">Synopsis / Premise</label>
                <textarea
                  rows={3}
                  placeholder="Cinema narrative synopsis and thematic core..."
                  value={newSynopsis}
                  onChange={(e) => setNewSynopsis(e.target.value)}
                  className="w-full bg-[#050b18] border border-cyan-500/30 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-1.5 rounded text-slate-400 hover:text-slate-200 border border-slate-700 cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-tech font-bold border border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)] cursor-pointer"
                >
                  INITIALIZE ARCHIVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full-Screen Movie Ingestion Center Modal */}
      <MovieIngestionCenter
        isOpen={isIngestCenterOpen}
        onClose={() => setIsIngestCenterOpen(false)}
        onProceedToIntelligence={() => {
          setIsIngestCenterOpen(false);
          navigateTo('movie-intelligence');
        }}
      />
    </div>
  );
};
