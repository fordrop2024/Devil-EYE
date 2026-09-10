/**
 * THE DEVIL'S EYE - ProEditor
 * Dedicated Full-Screen Professional NLE Video Editor inspired by Adobe Premiere Pro.
 * TOP: Project/Timecode/Undo/Redo/Autosave/Export
 * LEFT: Media Browser, FX, Transitions, Audio Bank, Text, Captions
 * CENTER: Large Program Monitor with Real-time Subtitle Compositing
 * SECONDARY: Source Monitor for Raw Footage In/Out Auditions
 * BOTTOM: Professional Multi-Track Timeline (V1-V4, A1-A5, SUB)
 * RIGHT: Inspector/Properties, Audio Mixer & AI Director Assistant
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EditorTopBar } from '../components/editor/EditorTopBar';
import { LeftMediaPanel } from '../components/editor/LeftMediaPanel';
import { ProgramMonitor } from '../components/editor/ProgramMonitor';
import { SourceMonitor } from '../components/editor/SourceMonitor';
import { TimelineTrackView } from '../components/editor/TimelineTrackView';
import { RightInspectorPanel } from '../components/editor/RightInspectorPanel';
import { Clip, Scene, Subtitle, TimelineTrack } from '../types';

export const ProEditor: React.FC = () => {
  const { 
    currentProject, 
    recordTimelineAction, 
    undoTimeline, 
    redoTimeline,
    addToast 
  } = useApp();

  // Playhead & Playback State
  const [playheadSec, setPlayheadSec] = useState<number>(240); // Default 4 minutes in
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);

  // Selected Elements
  const [selectedClipId, setSelectedClipId] = useState<string | null>('v1-clip-1');
  const [selectedSourceScene, setSelectedSourceScene] = useState<Scene | null>(
    currentProject.scenes?.[0] || null
  );
  const [isSourceMonitorOpen, setIsSourceMonitorOpen] = useState<boolean>(true);

  const totalDuration = currentProject.timeline.totalDuration || 1472;
  const tracks = currentProject.timeline.tracks || [];

  // Currently selected clip object
  const selectedClip = useMemo<Clip | null>(() => {
    if (!selectedClipId) return null;
    for (const track of tracks) {
      const match = track.clips.find(c => c.id === selectedClipId);
      if (match) return match;
    }
    return null;
  }, [tracks, selectedClipId]);

  // Active Video Clips at playhead position (ordered by track priority V4 -> V1)
  const activeVideoClips = useMemo<Clip[]>(() => {
    const active: Clip[] = [];
    const videoTracks = tracks
      .filter(t => t.type === 'video' && t.visible !== false)
      .sort((a, b) => b.name.localeCompare(a.name));

    for (const track of videoTracks) {
      const match = track.clips.find(
        c => playheadSec >= c.startTime && playheadSec < c.startTime + c.duration
      );
      if (match) active.push(match);
    }
    return active;
  }, [tracks, playheadSec]);

  // Active Subtitle at playhead position
  const activeSubtitle = useMemo<Subtitle | null>(() => {
    const subs = currentProject.subtitles || [];
    return subs.find(s => playheadSec >= s.startSec && playheadSec <= s.endSec) || null;
  }, [currentProject.subtitles, playheadSec]);

  // Playback loop (24fps ticker)
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const deltaSec = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        setPlayheadSec(prev => {
          const next = prev + deltaSec;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return next;
        });
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, totalDuration]);

  // Keyboard Shortcuts (Standard NLE bindings)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing in inputs/textareas
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(p => !p);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setPlayheadSec(p => Math.max(0, Number((p - 1/24).toFixed(3))));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setPlayheadSec(p => Math.min(totalDuration, Number((p + 1/24).toFixed(3))));
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        setPlayheadSec(p => Math.max(0, p - 5));
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setPlayheadSec(p => Math.min(totalDuration, p + 5));
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redoTimeline();
        } else {
          undoTimeline();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redoTimeline();
      } else if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.metaKey) {
        setSnapEnabled(s => !s);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalDuration, undoTimeline, redoTimeline]);

  // Insert clip onto a specific track
  const handleAddClipToTrack = useCallback((clipData: Partial<Clip>, targetTrackId: string) => {
    const newClip: Clip = {
      id: `clip-custom-${Date.now().toString(36)}`,
      trackId: targetTrackId,
      title: clipData.title || 'Untitled Clip',
      startTime: playheadSec,
      duration: clipData.duration || 10,
      sourceStart: clipData.sourceStart || 0,
      sourceEnd: clipData.sourceEnd || 10,
      mediaType: clipData.mediaType || 'video',
      color: clipData.color || '#0284c7',
      thumbnail: clipData.thumbnail,
      sourceSceneId: clipData.sourceSceneId,
      ...clipData
    };

    const updatedTracks = tracks.map(t => {
      if (t.id === targetTrackId) {
        return {
          ...t,
          clips: [...t.clips, newClip].sort((a, b) => a.startTime - b.startTime)
        };
      }
      return t;
    });

    recordTimelineAction(`Add Clip to ${targetTrackId}`, {
      ...currentProject.timeline,
      tracks: updatedTracks
    });
    setSelectedClipId(newClip.id);
  }, [playheadSec, tracks, currentProject.timeline, recordTimelineAction]);

  // Update selected clip properties in state
  const handleUpdateClip = useCallback((updatedClip: Clip) => {
    const updatedTracks = tracks.map(t => {
      if (t.id === updatedClip.trackId) {
        return {
          ...t,
          clips: t.clips.map(c => c.id === updatedClip.id ? updatedClip : c)
        };
      }
      return t;
    });

    recordTimelineAction(`Modify ${updatedClip.title}`, {
      ...currentProject.timeline,
      tracks: updatedTracks
    });
  }, [tracks, currentProject.timeline, recordTimelineAction]);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-[#02050f] text-slate-100 overflow-hidden select-none">
      {/* 1. TOP BAR: Project, Playback, Undo/Redo, Autosave, Versioning, Export */}
      <EditorTopBar
        playheadSec={playheadSec}
        totalDuration={totalDuration}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        snapEnabled={snapEnabled}
        setSnapEnabled={setSnapEnabled}
      />

      {/* 2. MIDDLE VIEWPORT AREA: Left Panel + Center Monitors + Right Inspector */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left: Media Browser, FX, Audio Bank, Titles, Captions */}
        <LeftMediaPanel
          onSelectSourceScene={(scene) => {
            setSelectedSourceScene(scene);
            setIsSourceMonitorOpen(true);
          }}
          onAddClipToTrack={handleAddClipToTrack}
          selectedSceneId={selectedSourceScene?.id || null}
        />

        {/* Center: Dual Monitors (Source Monitor on top/toggle + Large Program Monitor) */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Secondary: Source Monitor */}
          {isSourceMonitorOpen && (
            <SourceMonitor
              scene={selectedSourceScene}
              onClose={() => setIsSourceMonitorOpen(false)}
              onInsertClip={handleAddClipToTrack}
            />
          )}

          {/* Primary: Large Program Monitor */}
          <ProgramMonitor
            playheadSec={playheadSec}
            totalDuration={totalDuration}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(p => !p)}
            onSeek={(s) => setPlayheadSec(s)}
            activeVideoClips={activeVideoClips}
            activeSubtitle={activeSubtitle}
          />
        </div>

        {/* Right: Inspector, Properties, Audio Mixer & AI Director Assistant */}
        <RightInspectorPanel
          selectedClip={selectedClip}
          onUpdateClip={handleUpdateClip}
        />
      </div>

      {/* 3. BOTTOM: Professional Multi-Track Timeline (V1-V4, A1-A5, SUB) */}
      <TimelineTrackView
        playheadSec={playheadSec}
        onSeek={(s) => setPlayheadSec(s)}
        selectedClipId={selectedClipId}
        onSelectClip={(clip) => setSelectedClipId(clip ? clip.id : null)}
        zoomLevel={zoomLevel}
        snapEnabled={snapEnabled}
      />
    </div>
  );
};
