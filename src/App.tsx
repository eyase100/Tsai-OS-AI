/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Film, 
  Fingerprint, 
  Settings, 
  Send, 
  Cpu, 
  Upload, 
  Trash2, 
  Terminal, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  ShieldAlert, 
  FolderHeart, 
  Activity, 
  Battery, 
  Signal, 
  Wifi, 
  Volume2, 
  VolumeX, 
  Zap,
  RotateCcw,
  Check,
  FileImage,
  Video
} from 'lucide-react';

// Define structures
interface CommandLog {
  id: string;
  sender: 'user' | 'tsai' | 'system';
  content: string;
  timestamp: string;
}

interface FileRecord {
  id: string;
  name: string;
  size: string;
  type: string;
  dataUrl?: string;
  timestamp: string;
}

interface RenderTask {
  id: string;
  name: string;
  resolution: string;
  framerate: string;
  progress: number;
  status: 'idle' | 'rendering' | 'completed' | 'failed';
  speed: string; // e.g. "34.2 MB/s"
  elapsed: number; // in seconds
}

export default function App() {
  // Theme state
  const [accent, setAccent] = useState<'cyan' | 'emerald' | 'fuchsia'>('cyan');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'home' | 'media' | 'identity' | 'config'>('home');
  const [latency, setLatency] = useState<number>(14);
  const [systemLoad, setSystemLoad] = useState<number>(82);
  const [timeStr, setTimeStr] = useState<string>('12:45 PM');

  // Input state
  const [commandInput, setCommandInput] = useState<string>('');
  const [logs, setLogs] = useState<CommandLog[]>([
    { id: '1', sender: 'system', content: 'TSAI-OS v4.2 Kernel Loaded successfully.', timestamp: '12:44:00' },
    { id: '2', sender: 'tsai', content: 'Neural mainframe online. Secure authorization granted to Admin Brian. Ready to coordinate.', timestamp: '12:44:02' }
  ]);

  // Files state (persisted)
  const [files, setFiles] = useState<FileRecord[]>(() => {
    const cached = localStorage.getItem('tsai_files');
    if (cached) {
      try { return JSON.parse(cached); } catch { return []; }
    }
    return [
      { id: '1', name: 'nebula_core_sim.mp4', size: '1.2 GB', type: 'video/mp4', timestamp: '09:30 AM' },
      { id: '2', name: 'neural_net_weights.bin', size: '4.8 GB', type: 'application/octet-stream', timestamp: '10:15 AM' },
      { id: '3', name: 'admin_security_key.pem', size: '2.4 KB', type: 'text/plain', timestamp: '11:02 AM' }
    ];
  });

  // Render module state
  const [renderTasks, setRenderTasks] = useState<RenderTask[]>([
    { id: '1', name: 'Hypercube Projection Rendering', resolution: '4K OLED', framerate: '120fps', progress: 100, status: 'completed', speed: '0.0 MB/s', elapsed: 245 },
    { id: '2', name: 'Quantum Topology Simulation', resolution: 'Holographic Node', framerate: '60fps', progress: 0, status: 'idle', speed: '0.0 MB/s', elapsed: 0 }
  ]);
  const [videoNameInput, setVideoNameInput] = useState<string>('Neural Core Loop');
  const [videoRes, setVideoRes] = useState<string>('4K OLED');
  const [videoFps, setVideoFps] = useState<string>('120fps');

  // Interactive diagnostic results
  const [diagnosticRun, setDiagnosticRun] = useState<'idle' | 'running' | 'completed'>('idle');
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);

  // Drag-and-drop state
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Audio synthesizer for tech feedback
  const playSound = (type: 'click' | 'success' | 'laser' | 'warm' | 'error') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24); // C6
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'laser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'warm') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.setValueAtTime(180, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.255);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.warn('Audio synthesis not allowed or supported yet', e);
    }
  };

  // Sync files list with local storage
  useEffect(() => {
    localStorage.setItem('tsai_files', JSON.stringify(files));
  }, [files]);

  // Real-time loop
  useEffect(() => {
    // 1. Clock timer
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const minStr = minutes < 10 ? '0' + minutes : minutes;
      setTimeStr(`${hours}:${minStr} ${ampm}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);

    // 2. Latency fluctuation & Load simulation
    const telemetryTimer = setInterval(() => {
      setLatency(prev => {
        const offset = Math.floor(Math.random() * 5) - 2;
        const next = prev + offset;
        return Math.max(8, Math.min(24, next));
      });

      setSystemLoad(prev => {
        const offset = Math.floor(Math.random() * 3) - 1;
        const next = Math.max(76, Math.min(88, prev + offset));
        return next;
      });
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(telemetryTimer);
    };
  }, []);

  // Live video rendering simulation timer
  useEffect(() => {
    const renderInterval = setInterval(() => {
      setRenderTasks(prevTasks => {
        let changed = false;
        const nextTasks = prevTasks.map(t => {
          if (t.status === 'rendering') {
            changed = true;
            const newProgress = Math.min(100, t.progress + Math.floor(Math.random() * 8) + 3);
            const isDone = newProgress >= 100;
            const liveSpeed = isDone ? '0.0 MB/s' : `${(30 + Math.random() * 12).toFixed(1)} MB/s`;
            
            if (isDone) {
              // Trigger sound and push log notification
              setTimeout(() => {
                playSound('success');
                // Auto system logger entry
                const logTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                setLogs(l => [
                  ...l, 
                  { 
                    id: Date.now().toString(), 
                    sender: 'system', 
                    content: `Success: Render process of [${t.name}] completed. File registered in storage index.`, 
                    timestamp: logTime 
                  }
                ]);
                // Add to files listing automatically!
                setFiles(prevF => [
                  {
                    id: Date.now().toString(),
                    name: `${t.name.toLowerCase().replace(/\s+/g, '_')}.mp4`,
                    size: '2.4 GB',
                    type: 'video/mp4',
                    timestamp: 'Just now'
                  },
                  ...prevF
                ]);
              }, 10);
            }

            return {
              ...t,
              progress: newProgress,
              status: isDone ? 'completed' : 'rendering',
              speed: liveSpeed,
              elapsed: t.elapsed + 1
            };
          }
          return t;
        });
        return changed ? nextTasks : prevTasks;
      });
    }, 1000);

    return () => clearInterval(renderInterval);
  }, []);

  // Autoscroll command terminal logs
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // File drag handling
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const selectFileManual = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const processFiles = (fileList: FileList) => {
    playSound('click');
    const newItems: FileRecord[] = [];
    const logTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      const sizeMB = (f.size / (1024 * 1024)).toFixed(1);
      const formattedSize = parseFloat(sizeMB) > 100 ? `${(parseFloat(sizeMB) / 1024).toFixed(1)} GB` : `${sizeMB} MB`;
      
      const newFile: FileRecord = {
        id: (Date.now() + i).toString(),
        name: f.name,
        size: formattedSize,
        type: f.type || 'application/octet-stream',
        timestamp: 'Just now'
      };

      // Extract image preview thumbnail if it's an image
      if (f.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (eEvent) => {
          if (eEvent.target?.result) {
            setFiles(prev => prev.map(item => item.id === newFile.id ? { ...item, dataUrl: eEvent.target?.result as string } : item));
          }
        };
        reader.readAsDataURL(f);
      }

      newItems.push(newFile);
    }

    setFiles(prev => [...newItems, ...prev]);
    setLogs(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'system',
        content: `Uploaded and registered ${newItems.length} core file(s): ${newItems.map(ni => ni.name).join(', ')}`,
        timestamp: logTime
      }
    ]);
    playSound('success');
  };

  const deleteFile = (id: string, name: string) => {
    playSound('error');
    setFiles(prev => prev.filter(f => f.id !== id));
    const logTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [
      ...prev,
      { id: Date.now().toString(), sender: 'system', content: `Deregistered core file reference: [${name}]`, timestamp: logTime }
    ]);
  };

  // Commands interpreter
  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    playSound('laser');
    const sysTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Add user log
    const newUserLog: CommandLog = {
      id: Date.now().toString(),
      sender: 'user',
      content: trimmed,
      timestamp: sysTime
    };

    setLogs(prev => [...prev, newUserLog]);
    setCommandInput('');

    // Pre-calculated system command responses
    const normalized = trimmed.toLowerCase();
    let reply = '';
    
    if (normalized === 'help' || normalized === '/help' || normalized === '/commands') {
      reply = `AVAILABLE NET-PROTOCOLS:\n` +
              ` • /help /commands - List system terminal control actions.\n` +
              ` • /diagnose - Trigger deep self-diagnostics checklist test.\n` +
              ` • /clear - Flushes active terminal log memory.\n` +
              ` • /render - Injects standard demo 4K visual loop rendering.\n` +
              ` • /sysinfo - Returns comprehensive neural hardware nodes metadata.\n` +
              ` • /lock - Activates high-level admin lockdown protocol.`;
      
      setLogs(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'tsai', content: reply, timestamp: sysTime }]);
    } else if (normalized === '/clear' || normalized === 'clear') {
      setLogs([]);
    } else if (normalized === '/diagnose' || normalized === 'diagnose' || normalized === '/test') {
      triggerDiagnostics();
    } else if (normalized === '/render' || normalized === 'render') {
      // Create a demo model render
      const customId = Date.now().toString();
      const newTask: RenderTask = {
        id: customId,
        name: `CLI-Triggered ${videoNameInput}`,
        resolution: videoRes,
        framerate: videoFps,
        progress: 0,
        status: 'rendering',
        speed: '34.5 MB/s',
        elapsed: 0
      };
      setRenderTasks(prev => [newTask, ...prev]);
      setLogs(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        sender: 'tsai', 
        content: `Injected command node render task: "${newTask.name}" in active scheduler.`, 
        timestamp: sysTime 
      }]);
    } else if (normalized === '/sysinfo' || normalized === 'sysinfo') {
      reply = `[SYSTEM MAIN HOST METADATA]\n` +
              ` • OS FRAMEWORK: TSAI-OS kernel build 4.2-STABLE\n` +
              ` • LOCAL TIME: 2026-06-08 (UTC)\n` +
              ` • SYNAPSE ENGINE: G-Neural Core v9.34b\n` +
              ` • NEURAL RATIO: Optimal (1:1.025)\n` +
              ` • REGISTERED AUTH: brianeyasi@gmail.com (SuperAdmin)\n` +
              ` • NETWORK HOSTING: ${window.location.host || 'CloudRun Instance'}`;
      setLogs(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'tsai', content: reply, timestamp: sysTime }]);
    } else if (normalized === '/lock' || normalized === 'lock') {
      playSound('error');
      setLogs(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        sender: 'system', 
        content: `🔒 MAXIMUM SECURITY ALERT: Emergency system locked. Type "unlock" or trigger reset feedback to open.`, 
        timestamp: sysTime 
      }]);
    } else if (normalized === 'unlock') {
      playSound('success');
      setLogs(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        sender: 'system', 
        content: `🔓 System security status normal. Authorization reinstated.`, 
        timestamp: sysTime 
      }]);
    } else {
      // General question. AI response generator
      const templates = [
        `Analyzing matrix path... The synapse cores suggest coordinating with local file transfers or customizing render resolutions inside the media console. How can TSAI serve you today?`,
        `Understood admin query. Current metrics show standard operations. Neural latency is stable at ${latency}ms. Let me know if you would like me to trigger a self-diagnostic run or render.`,
        `Analyzing context patterns. Secure operations are enabled. All active partitions remain shielded. Is there any background video file you would like to render right now?`,
        `Admin Brian, verified query. My primary mainframe is configured perfectly. I can run diagnoses, oversee dynamic graphic render grids, or organize encrypted base64 storage blocks.`
      ];
      const randomText = templates[Math.floor(Math.random() * templates.length)];
      setLogs(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'tsai', content: randomText, timestamp: sysTime }]);
    }
  };

  // Run comprehensive beautiful diagnostics
  const triggerDiagnostics = () => {
    playSound('warm');
    setDiagnosticRun('running');
    setDiagnosticLogs(['Starting TSAI-OS Self-Repair Diagnostic Suite...', 'Opening sandbox environment socket...']);
    
    let timerIndex = 0;
    const steps = [
      '• Mapping neural paths and Synapse Cores [OK]',
      '• Scanning encrypted virtual file registries [23 files matching]',
      '• Verifying OAuth connection and Security Handshakes [Brian Authorized]',
      '• Measuring core system latency ping [14ms verified, extremely stable]',
      '• Polling GPU Video Rendering clusters [Clusters Active, load minimal]',
      '• Optimizing neural telemetry cache databases [Cleaned 340 MB stale fragments]',
      '• DIAGNOSTICS COMPLETED: Overall System Health: 100% (STABLE)'
    ];

    const diagInterval = setInterval(() => {
      if (timerIndex < steps.length) {
        setDiagnosticLogs(prev => [...prev, steps[timerIndex]]);
        playSound('click');
        timerIndex++;
      } else {
        clearInterval(diagInterval);
        setDiagnosticRun('completed');
        playSound('success');
      }
    }, 800);
  };

  // Add a brand-new custom render task manually
  const triggerActiveRender = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoNameInput.trim()) return;

    playSound('warm');
    const customId = Date.now().toString();
    const newTask: RenderTask = {
      id: customId,
      name: videoNameInput,
      resolution: videoRes,
      framerate: videoFps,
      progress: 0,
      status: 'rendering',
      speed: '34.2 MB/s',
      elapsed: 0
    };

    setRenderTasks(prev => [newTask, ...prev]);
    // Log to terminal
    const sysTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [
      ...prev,
      { id: Date.now().toString(), sender: 'system', content: `Scheduler: Initialized render task "[${videoNameInput}]" at ${videoRes} (${videoFps}).`, timestamp: sysTime }
    ]);
  };

  // Remove render task
  const removeRenderTask = (id: string) => {
    playSound('error');
    setRenderTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#020408] text-slate-100 font-sans relative flex flex-col justify-between overflow-x-hidden grid-bg scanline-effect">
      
      {/* Ambient background glows for glassmorphism */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-cyan-950/25 rounded-full blur-[140px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-900/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* TOP DECORATIVE STATUS BAR */}
      <div className="w-full bg-black/40 border-b border-white/5 backdrop-blur-md z-30">
        <div className="max-w-7xl mx-auto h-9 px-4 sm:px-8 flex justify-between items-center text-[11px] font-mono tracking-wider text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-bold text-cyan-400">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span>
              CORE WORKSPACE
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline">{timeStr}</span>
            <span className="hidden lg:inline text-slate-600">|</span>
            <span className="hidden lg:inline uppercase">TSAI-OS v4.2 Stable</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-cyan-500" />
              <span>{latency}ms</span>
            </div>
            <div className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>{systemLoad}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">LTE/SECURE</span>
            </div>
            {/* Audio Toggle button */}
            <button 
              id="audio-toggle-btn"
              onClick={() => {
                const target = !soundEnabled;
                setSoundEnabled(target);
                if (target) {
                  // Wait to build AudioContext and beep
                  setTimeout(() => playSound('click'), 50);
                }
              }}
              className="p-1 hover:text-white transition-colors"
              title={soundEnabled ? "Disable audio indicators" : "Enable audio indicators"}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SYSTEM HEADER SECTION */}
      <header className="max-w-7xl w-full mx-auto px-4 sm:px-8 pt-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 z-20">
        <div>
          <div className="flex items-center gap-3">
            <div 
              id="logo-box" 
              onClick={() => playSound('warm')}
              className={`w-11 h-11 border-2 border-cyan-500/80 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-950/20`}
            >
              <div className="w-5 h-5 bg-cyan-400 rounded-md animate-pulse"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-600 font-space italic uppercase">
                  TSAI-OS // COORD
                </h1>
                <span className="text-xs font-mono px-2 py-0.5 border border-cyan-500/30 text-cyan-405 font-medium rounded-full bg-cyan-500/10">
                  ADMIN PORTAL
                </span>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm tracking-wider uppercase mt-1">
                SYSTEM CORE ONLINE • WELCOME BACK, <span className="text-white font-semibold">ADMIN.BRIAN</span>
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic mini controller theme toggler */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1 backdrop-blur-md">
          <span className="text-[10px] font-mono font-medium tracking-wide uppercase px-3 text-slate-400">Accent:</span>
          <button 
            id="accent-cyan-btn"
            onClick={() => { setAccent('cyan'); playSound('click'); }}
            className={`w-4 h-4 rounded-full bg-cyan-400 border ${accent === 'cyan' ? 'border-white scale-125' : 'border-transparent'} transition-transform`}
          />
          <button 
            id="accent-emerald-btn"
            onClick={() => { setAccent('emerald'); playSound('click'); }}
            className={`w-4 h-4 rounded-full bg-emerald-400 border ${accent === 'emerald' ? 'border-white scale-125' : 'border-transparent'} transition-transform`}
          />
          <button 
            id="accent-fuchsia-btn"
            onClick={() => { setAccent('fuchsia'); playSound('click'); }}
            className={`w-4 h-4 rounded-full bg-fuchsia-400 border ${accent === 'fuchsia' ? 'border-white scale-125' : 'border-transparent'} transition-transform`}
          />
        </div>
      </header>

      {/* MAIN VIEW CONTROLLER MATRIX */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-3 flex-1 flex flex-col z-20">
        
        {/* VIEW 1: HOME PANEL */}
        {activeTab === 'home' && (
          <div id="home-view" className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full flex-1">
            
            {/* Left Hand: Telemetry Gauge and File Storage */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Glassmorphic Core Node Circular Gauge */}
              <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-xl flex flex-col items-center justify-between relative overflow-hidden group min-h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none"></div>
                
                <div className="w-full flex justify-between items-center mb-2">
                  <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">Core Processors</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded uppercase font-mono tracking-widest font-semibold">Stable</span>
                </div>

                <div className="w-36 h-36 sm:w-44 sm:h-44 border-[1px] border-cyan-500/25 rounded-full flex items-center justify-center relative my-4">
                  {/* Rotating status overlay arc */}
                  <div className="absolute inset-0 rounded-full border-t border-cyan-400 border-r-2 border-transparent rotate-45 animate-[spin_4s_linear_infinite]"></div>
                  <div className="absolute inset-2 rounded-full border-b border-blue-500/30 border-l-2 border-transparent rotate-180 animate-[spin_8s_linear_infinite]"></div>
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-cyan-500/5 rounded-full blur-xl absolute"></div>
                  
                  <div className="text-center z-10">
                    <span className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-white font-space bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
                      {systemLoad}%
                    </span>
                    <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-cyan-400 mt-0.5">Synapse Load</div>
                  </div>
                </div>

                <div className="w-full mt-2">
                  <div className="flex justify-between items-center text-[10px] font-mono py-1 text-slate-400">
                    <span>MEMORY PARTITIONS</span>
                    <span className="text-cyan-400 font-bold">14.2 / 16.0 GB USED</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: '84.2%' }}></div>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                    <span>SWAP MEM: 2.1 GB</span>
                    <span>CACHE FLUSHED</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Storage Summary / Recent registry */}
              <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-xl flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold font-space text-slate-300 uppercase tracking-widest flex items-center gap-2">
                    <FolderHeart className="w-3.5 h-3.5 text-cyan-400" />
                    Secure Storage Array
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">{files.length} indexed</span>
                </div>
                
                {/* Scrollable file deck (small) */}
                <div className="flex flex-col gap-2.5 max-h-[180px] overflow-y-auto pr-1">
                  {files.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs font-mono">
                      No files loaded. Use Media panel to upload.
                    </div>
                  ) : (
                    files.slice(0, 3).map((f) => (
                      <div 
                        key={f.id} 
                        className="flex items-center justify-between p-2.5 bg-black/30 border border-white/5 rounded-xl hover:border-cyan-500/40 transition-all group"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          {f.dataUrl ? (
                            <img src={f.dataUrl} className="w-8 h-8 rounded object-cover border border-white/10" alt="Preview"/>
                          ) : f.type.includes('video') ? (
                            <div className="w-8 h-8 bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 flex items-center justify-center rounded text-sm shrink-0">
                              <Video className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-slate-900 border border-white/10 text-slate-400 flex items-center justify-center rounded text-sm shrink-0">
                              <FileImage className="w-4 h-4" />
                            </div>
                          )}
                          <div className="overflow-hidden leading-tight text-left">
                            <p className="text-xs font-mono text-slate-200 truncate pr-2 max-w-[140px] sm:max-w-xs">{f.name}</p>
                            <span className="text-[9px] font-mono text-slate-500 uppercase">{f.size} • {f.timestamp}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => deleteFile(f.id, f.name)}
                          className="text-slate-500 hover:text-red-400 p-1 rounded-md hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <button 
                  id="nav-to-media-btn"
                  onClick={() => { setActiveTab('media'); playSound('warm'); }}
                  className="w-full py-2 bg-white/5 border border-white/10 hover:border-cyan-500/50 rounded-xl text-[11px] font-mono font-bold uppercase tracking-wider text-slate-200 hover:text-cyan-400 transition-all text-center"
                >
                  Manage Storage & File Uploads →
                </button>
              </div>

            </div>

            {/* Right Hand: AI Mainframe terminal and video pipeline config */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Intelligent TSAI Assistant Console */}
              <div className="bg-gradient-to-br from-blue-950/20 via-slate-900/10 to-cyan-950/20 border border-blue-500/25 rounded-[28px] p-6 backdrop-blur-xl flex flex-col justify-between min-h-[320px] shadow-[0_4px_30px_rgba(59,130,246,0.05)]">
                
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <h4 className="font-space text-lg font-bold text-slate-200">Mainframe Host Terminal // Ask TSAI</h4>
                    </div>
                    <span className="text-[9px] font-mono text-cyan-400 border border-cyan-500/20 bg-cyan-950/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      IntelliSense Online
                    </span>
                  </div>

                  {/* Terminal Log Streams */}
                  <div 
                    id="cli-log-feed"
                    ref={logsContainerRef}
                    className="bg-black/45 rounded-2xl border border-white/5 p-4 h-[180px] overflow-y-auto font-mono text-[11.5px] leading-relaxed flex flex-col gap-3 text-left"
                  >
                    {logs.map((log) => (
                      <div key={log.id} className="border-b border-white/[0.02] pb-1.5 last:border-0 last:pb-0">
                        <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                          <span className={`uppercase font-bold ${
                            log.sender === 'tsai' ? 'text-cyan-400' : 
                            log.sender === 'system' ? 'text-blue-400' : 'text-slate-400'
                          }`}>
                            {log.sender === 'tsai' ? '✦ TSAI MODEL' : log.sender === 'system' ? '⚙ CORE SYSTEM' : '◈ ADMIN ROOT'}
                          </span>
                          <span>{log.timestamp}</span>
                        </div>
                        <p className={`whitespace-pre-wrap ${
                          log.sender === 'tsai' ? 'text-cyan-200 font-medium' : 
                          log.sender === 'system' ? 'text-slate-400' : 'text-slate-100'
                        }`}>
                          {log.sender === 'user' ? `> ${log.content}` : log.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input Control Interface */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    executeCommand(commandInput);
                  }}
                  className="mt-4 flex items-center gap-3 bg-black/40 border border-white/10 hover:border-cyan-500/40 focus-within:border-cyan-500/60 rounded-2xl px-4 py-2.5 transition-all"
                >
                  <Terminal className="w-4 h-4 text-slate-400" />
                  <input 
                    id="cli-command-input"
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    placeholder="Ask TSAI or inject a tech protocol (try '/help' or '/diagnose')..."
                    className="flex-1 bg-transparent text-slate-100 text-xs sm:text-sm border-0 focus:outline-none focus:ring-0 placeholder:text-slate-500 font-mono"
                  />
                  <button 
                    id="cli-submit-btn"
                    type="submit"
                    className="w-8 h-8 rounded-full bg-cyan-500 hover:bg-cyan-400 flex items-center justify-center transition-all duration-200 outline-none hover:scale-105 active:scale-95 shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.5)] border-transparent text-slate-900"
                  >
                    <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </form>
              </div>

              {/* Graphic/Video render coordinator */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                
                {/* Active Render Box */}
                <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-xl relative flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-4 right-4 text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                    Media Engine
                  </div>

                  <div>
                    <div className="w-10 h-10 bg-cyan-500/15 border border-cyan-500/25 rounded-xl mb-4 flex items-center justify-center">
                      <Film className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h4 className="text-lg font-bold font-space text-slate-200">Interactive Video Hub</h4>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                      Initialize GPU cloud render nodes directly. Toggle resolution codec, monitor frame count loads, and export logs dynamically.
                    </p>
                  </div>

                  {/* Active list showing progress inside box */}
                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-col gap-2">
                    {renderTasks.slice(0, 1).map((rt) => (
                      <div key={rt.id} className="text-left font-mono">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span className="truncate pr-2 max-w-[140px] uppercase font-bold">{rt.name}</span>
                          <span className={rt.status === 'rendering' ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}>
                            {rt.status === 'rendering' ? 'ACTIVE' : 'IDLE'}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden mb-1">
                          <div 
                            className="h-full bg-cyan-400 transition-all duration-1000" 
                            style={{ width: `${rt.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-500">
                          <span>{rt.progress}% ({rt.framerate})</span>
                          <span>{rt.speed}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    id="nav-to-render-btn"
                    onClick={() => { setActiveTab('media'); playSound('warm'); }}
                    className="w-full mt-3 text-center text-xs font-mono font-bold text-cyan-400 uppercase py-1 hover:text-cyan-300 transition-all"
                  >
                    GO TO RENDERS PANEL →
                  </button>
                </div>

                {/* System Diagnostics Status Box */}
                <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-xl flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 bg-blue-500/15 border border-blue-500/25 rounded-xl mb-4 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-blue-400" />
                    </div>
                    <h4 className="text-lg font-bold font-space text-slate-200">Hardware Config</h4>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                      Optimize operational cycles, tweak active CPU throttle scales, and initialize comprehensive system diagnostic tests.
                    </p>

                    {/* Simple telemetry logs preview */}
                    {diagnosticRun === 'running' && (
                      <div className="mt-3 p-2 bg-black/40 rounded-lg border border-cyan-500/30 font-mono text-[9px] text-cyan-350 text-left max-h-[80px] overflow-y-auto">
                        <span className="animate-pulse">RUNNING DIAGNOSTICS:</span>
                        <div className="text-slate-400 mt-1">{diagnosticLogs[diagnosticLogs.length - 1]}</div>
                      </div>
                    )}
                    {diagnosticRun === 'completed' && (
                      <div className="mt-3 p-2 bg-black/40 rounded-lg border border-emerald-500/20 font-mono text-[9px] text-emerald-400 text-left">
                        ✓ MAIN COMPLIANCE VERIFIED (100% HEALTHY)
                      </div>
                    )}
                  </div>

                  <button 
                    id="trigger-self-diagnostic-btn"
                    onClick={diagnosticRun === 'running' ? undefined : triggerDiagnostics}
                    className={`w-full mt-4 py-2.5 rounded-xl font-mono text-[11px] font-bold uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-center ${
                      diagnosticRun === 'running'
                        ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 cursor-wait'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    }`}
                  >
                    {diagnosticRun === 'running' ? 'Scanning systems...' : 'Initialize Self-Test'}
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: MEDIA PANEL (STORAGE & RENDERING SUITE) */}
        {activeTab === 'media' && (
          <div id="media-view" className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full flex-1">
            
            {/* Left: Drag-and-drop file uploader (persisted storage) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-xl flex flex-col gap-4 flex-1">
                <div>
                  <h3 className="text-lg font-bold font-space text-slate-150">Mainframe Storage Vault</h3>
                  <p className="text-xs text-slate-400 mt-1">Upload and manage secure assets. Supports drag-and-drop or manual selection.</p>
                </div>

                {/* DRAG AND DROP BOX ZONE */}
                <div 
                  id="dropzone"
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={selectFileManual}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
                    dragActive 
                      ? 'border-cyan-400 bg-cyan-400/5' 
                      : 'border-white/10 bg-black/20 hover:border-cyan-500/40 hover:bg-black/30'
                  }`}
                >
                  <input 
                    id="manual-file-selector"
                    ref={fileInputRef}
                    type="file" 
                    multiple 
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-mono font-semibold text-slate-200">Drag files here, or click to browse</p>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-mono">ANY FILE SIZE • AUTO BASE64 STORAGE MAPPED</p>
                  </div>
                </div>

                {/* STORAGE ARCHIVE RECORDS */}
                <div className="flex-1 flex flex-col mini-deck">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5 mb-2.5">
                    <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-400">Archived Records</span>
                    <button 
                      id="flush-storage-btn"
                      onClick={() => {
                        playSound('error');
                        setFiles([]);
                        localStorage.removeItem('tsai_files');
                      }}
                      className="text-[9px] font-mono text-red-400 hover:text-red-300 uppercase transition-colors"
                    >
                      FLUSH STORAGE ARRAY
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto max-h-[240px] flex flex-col gap-2.5 pr-1">
                    {files.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center py-10 text-slate-500 font-mono text-xs">
                        Vault registers empty.
                        <p className="text-[10px] mt-1 text-slate-600 uppercase">Load diagnostic files above.</p>
                      </div>
                    ) : (
                      files.map((f) => (
                        <div 
                          key={f.id} 
                          className="flex items-center justify-between p-3 bg-black/30 border border-white/5 rounded-xl hover:border-cyan-500/40 transition-all group"
                        >
                          <div className="flex items-center gap-3 overflow-hidden text-left">
                            {f.dataUrl ? (
                              <img src={f.dataUrl} className="w-10 h-10 rounded object-cover border border-white/10 shrink-0" alt="Preview"/>
                            ) : f.type.includes('video') ? (
                              <div className="w-10 h-10 bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 flex items-center justify-center rounded text-sm shrink-0">
                                <Video className="w-5 h-5 animate-pulse" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-slate-900 border border-white/10 text-slate-400 flex items-center justify-center rounded text-sm shrink-0">
                                <FileImage className="w-5 h-5" />
                              </div>
                            )}
                            <div className="overflow-hidden leading-snug">
                              <p className="text-xs font-mono text-slate-100 truncate pr-2 max-w-[150px] sm:max-w-xs">{f.name}</p>
                              <span className="text-[9px] font-mono text-slate-500 uppercase block">{f.size} • {f.type}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            <button 
                              onClick={() => deleteFile(f.id, f.name)}
                              className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                              title="Delete core record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* Right: Interactive Rendering Suite */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-xl flex flex-col gap-5 flex-1">
                <div>
                  <h3 className="text-lg font-bold font-space text-slate-200">GPU Cloud Video Render Cluster</h3>
                  <p className="text-xs text-slate-400 mt-1">Configure complex video projections, execute high-fidelity render loops, and monitor dynamic progress arrays.</p>
                </div>

                {/* CONFIGURE ACCLIMATED RENDER ENGINE */}
                <form onSubmit={triggerActiveRender} className="p-4 bg-black/25 rounded-2xl border border-white/5 flex flex-col gap-4 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono font-medium tracking-wider text-slate-400 uppercase">Projection Name</label>
                      <input 
                        id="video-name-input"
                        type="text" 
                        value={videoNameInput}
                        onChange={(e) => setVideoNameInput(e.target.value)}
                        placeholder="e.g. Neon Horizon Simulation"
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono font-medium tracking-wider text-slate-400 uppercase">Target Resolution</label>
                      <select 
                        id="video-res-selector"
                        value={videoRes}
                        onChange={(e) => setVideoRes(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 outline-none"
                      >
                        <option value="1080p Web">1080p (Stream optimized)</option>
                        <option value="4K OLED">4K OLED Cinema</option>
                        <option value="Holographic Node">Holographic Array Proj</option>
                        <option value="Neural Vector">Neural Vector Field</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono font-medium tracking-wider text-slate-400 uppercase">Framerate Loop</label>
                      <select 
                        id="video-fps-selector"
                        value={videoFps}
                        onChange={(e) => setVideoFps(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 outline-none"
                      >
                        <option value="30fps Lite">30 FPS (Standard Lite)</option>
                        <option value="60fps">60 FPS (Fidelity Sync)</option>
                        <option value="120fps">120 FPS (Elite Proj)</option>
                        <option value="Neural Quantum">Neural Real-time Loop</option>
                      </select>
                    </div>

                  </div>

                  <div className="flex justify-end pt-1">
                    <button 
                      id="submit-render-btn"
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white shadow-[0_4px_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 border-transparent cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white stroke-none" />
                      Inject Active Render Job
                    </button>
                  </div>
                </form>

                {/* ACTIVE RENDERING JOBS QUEUE */}
                <div className="flex-grow flex flex-col min-h-[160px]">
                  <h4 className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-400 pb-2 border-b border-white/5 mb-3">
                    Render Scheduler Queue
                  </h4>

                  <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
                    {renderTasks.map((t) => (
                      <div 
                        key={t.id} 
                        className="p-3 bg-black/20 border border-white/5 hover:border-white/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-left font-mono"
                      >
                        <div className="flex-1 overflow-hidden">
                          <div className="flex justify-between md:justify-start items-center gap-2 mb-1">
                            <h5 className="text-xs font-bold text-slate-200 truncate">{t.name}</h5>
                            <span className="text-[8px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-white/5">
                              {t.resolution}
                            </span>
                          </div>
                          
                          {/* Live Dynamic Status metrics */}
                          <div className="flex gap-4 text-[9px] text-slate-500 mb-2">
                            <span>FPS: {t.framerate}</span>
                            {t.status === 'rendering' && <span>Speed: {t.speed}</span>}
                            <span>Elapsed: {t.status === 'completed' ? 'Done' : `${t.elapsed}s`}</span>
                          </div>

                          {/* Progress Line Bar */}
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/5 relative">
                              <div 
                                className={`h-full rounded-full transition-all duration-300 ${
                                  t.status === 'completed' ? 'bg-emerald-400' : 
                                  t.status === 'failed' ? 'bg-red-500' : 'bg-cyan-400'
                                }`} 
                                style={{ width: `${t.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-[10px] font-semibold text-slate-300 w-8 text-right shrink-0">{t.progress}%</span>
                          </div>
                        </div>

                        {/* Interactive triggers */}
                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                          {t.status === 'idle' && (
                            <button 
                              onClick={() => {
                                playSound('click');
                                setRenderTasks(prev => prev.map(item => item.id === t.id ? { ...item, status: 'rendering', progress: 1 } : item));
                              }}
                              className="px-3 py-1.5 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/25 rounded-lg text-[10px] transition-all font-mono font-bold uppercase tracking-wider"
                            >
                              START JOB
                            </button>
                          )}
                          
                          {t.status === 'rendering' && (
                            <span className="text-[9px] font-mono text-cyan-400 animate-pulse border border-cyan-500/20 bg-cyan-950/40 px-2 py-1 rounded uppercase tracking-wider font-semibold">
                              Rendering...
                            </span>
                          )}

                          {t.status === 'completed' && (
                            <span className="text-[9px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-950/40 px-2.5 py-1 rounded uppercase tracking-wider font-semibold flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              VERIFIED
                            </span>
                          )}

                          <button 
                            onClick={() => removeRenderTask(t.id)}
                            className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                            title="Decline trigger"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* VIEW 3: IDENTITY PORTAL PANEL */}
        {activeTab === 'identity' && (
          <div id="identity-view" className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center py-6">
            
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl w-full relative overflow-hidden text-center max-w-2xl">
              <div className="absolute top-[-150px] left-[-150px] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest bg-emerald-950/40 border border-emerald-500/25 px-2.5 py-1 rounded-full">
                  SECURE ACCESS LEVEL 4
                </span>
              </div>

              {/* Holographic identity scanner vector */}
              <div className="mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-cyan-500/30 flex items-center justify-center p-2 relative mb-6">
                <div className="absolute inset-0 rounded-full border-t border-cyan-400 animate-spin-slow"></div>
                <div className="absolute inset-2 bg-gradient-to-tr from-cyan-500/15 to-blue-500/10 rounded-full"></div>
                
                {/* Modern Fingerprint/Lock Interface */}
                <Fingerprint className="w-12 h-12 text-cyan-400 animate-pulse relative z-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black font-space tracking-tight text-white uppercase italic">
                  Systems Admin Identification
                </h3>
                <p className="text-slate-400 text-xs uppercase tracking-widest font-mono mt-1">
                  Credentialed Host: <span className="text-cyan-400">brianeyasi@gmail.com</span>
                </p>
              </div>

              {/* Credentials Key Database Information */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left font-mono text-xs">
                
                <div className="p-4 bg-black/30 border border-white/5 rounded-2xl">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">TSAI Cryptographic Token</span>
                  <p className="text-slate-300 font-bold mt-1 max-w-[210px] truncate">SHA-256: 7d25e8a5b29f0ce8...</p>
                  <p className="text-[9px] text-zinc-500 mt-2">Verified secure environment authorization token successfully linked with browser local-storage matrices.</p>
                </div>

                <div className="p-4 bg-black/30 border border-white/5 rounded-2xl">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Access Location Status</span>
                  <p className="text-slate-300 font-bold mt-1">Host: {window.location.hostname}</p>
                  <p className="text-[9px] text-zinc-500 mt-2">Sandbox status: Active and secure. IFrame proxy constraints applied. Cookie tokens bypassed.</p>
                </div>

              </div>

              {/* Action logs log list */}
              <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-left font-mono text-[11px] leading-relaxed">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  SYSTEM AUTHORIZATION LOGS (UTC)
                </div>
                <div className="text-slate-400 flex flex-col gap-0.5 max-h-[100px] overflow-y-auto pr-1">
                  <div>[09:31:01] Auth Handshake completed // email verification matched</div>
                  <div>[09:31:02] Token session registered locally // TSAI module synchronized</div>
                  <div>[09:31:14] Latency Ping test optimal: Average 14ms across Cloud Run endpoints</div>
                  <div>[09:32:00] Secure Admin privileges fully initialized</div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  id="reset-sec-priv-btn"
                  onClick={() => {
                    playSound('success');
                    // Add quick success notification log
                    const sysTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    setLogs(prev => [...prev, { id: Date.now().toString(), sender: 'system', content: 'Security Matrix rotated. SHA-256 re-keyed successfully.', timestamp: sysTime }]);
                  }}
                  className="px-6 py-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all"
                >
                  Rotate Security Matrix
                </button>
                <button 
                  id="nav-to-dashboard-btn"
                  onClick={() => { setActiveTab('home'); playSound('warm'); }}
                  className="px-6 py-2.5 bg-white/5 border border-white/10 text-white hover:border-cyan-500/40 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all"
                >
                  Return to Main Console
                </button>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 4: SYSTEM HARDWARE CONFIG PANEL */}
        {activeTab === 'config' && (
          <div id="config-view" className="max-w-5xl mx-auto w-full flex-1 flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              
              {/* Node diagnostics control Panel */}
              <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 backdrop-blur-xl flex flex-col justify-between text-left">
                <div>
                  <h3 className="text-xl font-bold font-space text-slate-150">Mainframe Host Diagnostics</h3>
                  <p className="text-xs text-slate-400 mt-1">Initiate high-power hardware diagnostics, monitor active sub-system layers, and troubleshoot mainframe failures.</p>
                  
                  {/* Flashing system nodes listing */}
                  <div className="mt-5 flex flex-col gap-2.5 font-mono text-xs">
                    
                    <div className="p-3 bg-black/30 border border-white/5 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-slate-300">Neural Network Cores</span>
                      </div>
                      <span className="text-emerald-400 hover:underline cursor-pointer" onClick={() => playSound('click')}>100% HEALTHY</span>
                    </div>

                    <div className="p-3 bg-black/30 border border-white/5 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-slate-300">GPU Stream Clusters</span>
                      </div>
                      <span className="text-emerald-400 hover:underline cursor-pointer" onClick={() => playSound('click')}>ACTIVE [3/3]</span>
                    </div>

                    <div className="p-3 bg-black/30 border border-white/5 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-slate-300">Local Cache Storage</span>
                      </div>
                      <span className="text-cyan-400 hover:underline cursor-pointer" onClick={() => { playSound('success'); }} title="Flushed 10 mins ago">OPTIMAL</span>
                    </div>

                    <div className="p-3 bg-black/30 border border-white/5 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-slate-300">TSAI Intelligence Module</span>
                      </div>
                      <span className="text-emerald-400 uppercase font-bold text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">STABLE</span>
                    </div>

                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 mt-6">
                  {diagnosticRun === 'running' ? (
                    <div className="text-center">
                      <div className="text-xs text-yellow-500 font-mono animate-pulse mb-3">DIAGNOSTIC CRON RUNNING...</div>
                      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5 mb-1">
                        <div className="h-full bg-yellow-500 rounded-full animate-[shimmer_1.5s_infinite]" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  ) : (
                    <button 
                      id="hardware-full-test-btn"
                      onClick={triggerDiagnostics}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider text-white shadow-[0_4px_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer text-center"
                    >
                      Run Full Hardware Self-Test
                    </button>
                  )}
                </div>
              </div>

              {/* Hardware logs outputs or System Config Toggles */}
              <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 backdrop-blur-xl flex flex-col justify-between text-left">
                <div>
                  <h3 className="text-xl font-bold font-space text-slate-150">System Flag Allocations</h3>
                  <p className="text-xs text-slate-400 mt-1">Configure physical hardware limits, secure kernel flags, and sandbox restrictions.</p>

                  <div className="mt-5 flex flex-col gap-4">
                    
                    {/* Security Toggle 1 */}
                    <div className="flex justify-between items-center bg-black/20 p-3 rounded-2xl border border-white/5">
                      <div className="leading-tight">
                        <span className="text-xs font-mono font-bold text-slate-205">Neural Link Pipeline</span>
                        <p className="text-[10px] text-slate-500 mt-0.5">Proxy all commands through the AI intelligence mainframe.</p>
                      </div>
                      <button 
                        id="flag-neural-link-btn"
                        onClick={() => playSound('click')}
                        className="w-11 h-6 bg-cyan-500 rounded-full p-0.5 transition-colors relative"
                      >
                        <div className="w-5 h-5 bg-black rounded-full shadow-md translate-x-5 transition-transform" />
                      </button>
                    </div>

                    {/* Security Toggle 2 */}
                    <div className="flex justify-between items-center bg-black/20 p-3 rounded-2xl border border-white/5">
                      <div className="leading-tight">
                        <span className="text-xs font-mono font-bold text-slate-205">Strict Sandbox Constraints</span>
                        <p className="text-[10px] text-slate-500 mt-0.5">Restricts API queries to local secure sandbox matrices.</p>
                      </div>
                      <button 
                        id="flag-strict-sandbox-btn"
                        onClick={() => playSound('click')}
                        className="w-11 h-6 bg-slate-800 border border-white/10 rounded-full p-0.5 transition-colors relative"
                      >
                        <div className="w-5 h-5 bg-slate-400 rounded-full shadow-md translate-x-0 transition-transform" />
                      </button>
                    </div>

                    {/* Security Toggle 3 */}
                    <div className="flex justify-between items-center bg-black/20 p-3 rounded-2xl border border-white/5">
                      <div className="leading-tight">
                        <span className="text-xs font-mono font-bold text-slate-205">Synthetic Sound Synthesis</span>
                        <p className="text-[10px] text-slate-500 mt-0.5">Toggle browser raw AudioContext beep sound responses.</p>
                      </div>
                      <button 
                        id="flag-sound-tgl"
                        onClick={() => {
                          const target = !soundEnabled;
                          setSoundEnabled(target);
                          if (target) {
                            setTimeout(() => playSound('success'), 80);
                          }
                        }}
                        className={`w-11 h-6 ${soundEnabled ? 'bg-cyan-500' : 'bg-slate-800 border border-white/10'} rounded-full p-0.5 transition-colors relative`}
                      >
                        <div className={`w-5 h-5 bg-black rounded-full shadow-md ${soundEnabled ? 'translate-x-5' : 'translate-x-0'} transition-transform`} />
                      </button>
                    </div>

                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 mt-6 font-mono text-[10px] text-slate-500">
                  <span>SANDBOX COMPILER STATE:</span>
                  <p className="text-slate-400 mt-1 uppercase font-semibold">Active build validated. NPM module libraries synchronized perfectly.</p>
                </div>
              </div>

            </div>

            {/* Diagnostic Log Streaming Terminal (Big) */}
            {diagnosticLogs.length > 0 && (
              <div className="bg-black/40 border border-white/10 rounded-3xl p-6 text-left font-mono text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-white/10 mb-3 text-cyan-404">
                  <span className="font-bold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                    Live Mainframe Telemetry Test Trace Output
                  </span>
                  <button 
                    id="clear-diag-logs-btn"
                    onClick={() => { playSound('click'); setDiagnosticLogs([]); setDiagnosticRun('idle'); }}
                    className="text-[10px] text-slate-505 hover:text-white transition-colors"
                  >
                    Flush Diagnostics Console
                  </button>
                </div>
                <div className="h-[140px] overflow-y-auto flex flex-col gap-1.5 text-cyan-200/90 [scrollbar-width:thin] pr-1 leading-relaxed">
                  {diagnosticLogs.map((logStr, lIdx) => (
                    <div key={lIdx}>
                      <span className="text-slate-600 mr-2">[{lIdx + 1}]</span>
                      <span>{logStr}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* BOTTOM NAVIGATION BOARD */}
      <nav className="w-full bg-black/75 backdrop-blur-2xl border-t border-white/10 py-5 px-4 sm:px-8 z-30 shadow-[0_-5px_30px_rgba(0,0,0,0.8)] mt-6">
        <div id="nav-container" className="max-w-xl mx-auto flex justify-between items-center text-center">
          
          {/* Main Dashboard Portal button */}
          <button 
            id="nav-home-btn"
            onClick={() => { setActiveTab('home'); playSound('warm'); }}
            className={`flex flex-col items-center gap-1 group transition-colors outline-none cursor-pointer ${
              activeTab === 'home' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-2 hover:scale-105'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              activeTab === 'home' ? 'bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-pulse' : 'border border-transparent group-hover:border-slate-800'
            }`}>
              <Home className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest font-space">Home</span>
          </button>

          {/* Media Engine Storage button */}
          <button 
            id="nav-media-btn"
            onClick={() => { setActiveTab('media'); playSound('warm'); }}
            className={`flex flex-col items-center gap-1 group transition-colors outline-none cursor-pointer ${
              activeTab === 'media' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-2 hover:scale-105'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              activeTab === 'media' ? 'bg-cyan-500/10 border border-cyan-500/30' : 'border border-transparent group-hover:border-slate-800'
            }`}>
              <Film className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest font-space">Media</span>
          </button>

          {/* Quick AI Core Center Command (Center Circle Button) */}
          <div className="relative -mt-10 sm:-mt-12 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-full blur-[20px] opacity-40 group-hover:opacity-75 transition-opacity"></div>
            <button 
              id="center-intel-btn"
              onClick={() => {
                playSound('laser');
                const templates = [
                  "MAIN POWER DEDICATED // SYNAPSE CORES ENHANCED.",
                  "NEURAL MATRIX PING: optimal (14ms).",
                  "CLUSTERS ONLINE. RENDER QUEUE STABLE.",
                  "SECURITY INTEGRITY SEALED. FIREWALL ROBUST."
                ];
                const msg = templates[Math.floor(Math.random() * templates.length)];
                const sysTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                setLogs(prev => [...prev, { id: Date.now().toString(), sender: 'tsai', content: `[MAIN CORE TRIGGER]: ${msg}`, timestamp: sysTime }]);
              }}
              title="Quick Telemetry Echo"
              className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-tr from-cyan-600 via-blue-500 to-blue-700 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.6)] border-4 border-[#020408] flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer relative z-20"
            >
              <Cpu className="w-6.5 h-6.5 text-white animate-spin-slow" />
            </button>
          </div>

          {/* Security Credentials Identifier button */}
          <button 
            id="nav-identity-btn"
            onClick={() => { setActiveTab('identity'); playSound('warm'); }}
            className={`flex flex-col items-center gap-1 group transition-colors outline-none cursor-pointer ${
              activeTab === 'identity' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-2 hover:scale-105'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              activeTab === 'identity' ? 'bg-cyan-500/10 border border-cyan-500/30' : 'border border-transparent group-hover:border-slate-800'
            }`}>
              <Fingerprint className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest font-space">Identity</span>
          </button>

          {/* Hardware Diagnostics Configuration button */}
          <button 
            id="nav-config-btn"
            onClick={() => { setActiveTab('config'); playSound('warm'); }}
            className={`flex flex-col items-center gap-1 group transition-colors outline-none cursor-pointer ${
              activeTab === 'config' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-2 hover:scale-105'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              activeTab === 'config' ? 'bg-cyan-500/10 border border-cyan-500/30' : 'border border-transparent group-hover:border-slate-800'
            }`}>
              <Settings className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest font-space">Config</span>
          </button>

        </div>
      </nav>

      {/* BOTTOM ANDROID DECORATIVE INDICATOR */}
      <p className="text-[9px] font-mono text-slate-700 text-center pb-2 uppercase tracking-widest select-none bg-black/20 pt-1 border-t border-white/[0.02]">
        ✦ TSAI-OS kernel telemetry subsystem 4.2 • Admin portal secured ✦
      </p>

    </div>
  );
}
