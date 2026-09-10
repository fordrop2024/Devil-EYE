/**
 * THE DEVIL'S EYE - Content Planner
 * Kanban Production Pipeline & Cinema Release Calendar.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Film, 
  ChevronRight,
  Tv,
  Kanban
} from 'lucide-react';
import { playHudClick, playHudSuccess } from '../services/soundFx';

export const ContentPlanner: React.FC = () => {
  const { addToast } = useApp();

  const [columns, setColumns] = useState([
    {
      id: 'backlog',
      title: 'Idea Backlog',
      items: [
        { title: 'Interstellar (2014)', type: 'Movie Explainer', date: 'Oct 12' },
        { title: 'Severance Season 2', type: 'Web Series Arc', date: 'Oct 19' },
      ],
    },
    {
      id: 'scan',
      title: 'Neural Ingestion',
      items: [
        { title: 'Blade Runner 2049', type: 'Movie Explainer', date: 'Oct 04' },
      ],
    },
    {
      id: 'scripting',
      title: 'Script & Voice',
      items: [
        { title: 'Shutter Island Twist', type: 'Movie Explainer', date: 'Oct 01' },
      ],
    },
    {
      id: 'editing',
      title: 'Active Editing',
      items: [
        { title: 'Inception (2010)', type: 'Master 4K UHD', date: 'Sep 28' },
      ],
    },
    {
      id: 'ready',
      title: 'Ready for YouTube',
      items: [
        { title: 'The Prestige (2006)', type: 'Full Package', date: 'Sep 25' },
      ],
    },
  ]);

  const addNewCard = () => {
    playHudClick();
    addToast('New Idea Added', 'Added "Oppenheimer" to Idea Backlog', 'info');
    setColumns(prev => {
      const copy = [...prev];
      copy[0].items.push({ title: 'Oppenheimer (2023)', type: 'Movie Explainer', date: 'Nov 02' });
      return copy;
    });
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-y-auto bg-[#02050f] text-slate-100 p-4 space-y-4 select-none bg-hud-grid">
      {/* Header */}
      <div className="hud-panel p-4 rounded-lg border border-cyan-500/30 flex items-center justify-between hud-corners">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-cyan-950/80 border border-cyan-400/50">
            <Calendar className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-cyan-100">CINEMA CONTENT PLANNER</h1>
            <p className="text-xs font-mono text-cyan-400/70">
              KANBAN PIPELINE FROM SCRIPT TO 4K YOUTUBE RELEASE
            </p>
          </div>
        </div>

        <button
          onClick={addNewCard}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-tech font-bold text-xs px-3.5 py-1.5 rounded border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.4)] flex items-center space-x-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ADD CINEMA TITLE</span>
        </button>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-start">
        {columns.map((col) => (
          <div
            key={col.id}
            className="hud-panel rounded-lg p-3 border border-cyan-500/25 hud-corners flex flex-col space-y-2.5 min-h-[450px]"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <span className="text-xs font-tech font-bold uppercase text-cyan-300">
                {col.title}
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/30">
                {col.items.length}
              </span>
            </div>

            <div className="space-y-2 flex-1">
              {col.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-[#050b18] border border-cyan-500/20 hover:border-cyan-400/60 transition-colors space-y-1 cursor-pointer"
                  onClick={() => {
                    playHudClick();
                    addToast('Project Selected', `Loaded ${item.title} context`, 'info');
                  }}
                >
                  <div className="text-xs font-tech font-bold text-slate-100">{item.title}</div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="text-cyan-400/80">{item.type}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
