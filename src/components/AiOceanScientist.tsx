import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  BookOpen, 
  ShieldCheck, 
  Info,
  Layers,
  MessageSquare
} from 'lucide-react';
import { oceanApi } from '../services/oceanApi';

interface AiOceanScientistProps {
  selectedRegion: string;
  selectedDepth: number;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: string[];
  timestamp: string;
}

export const AiOceanScientist: React.FC<AiOceanScientistProps> = ({
  selectedRegion,
  selectedDepth
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Greetings. I am the Neeraksh Analyst, an AI oceanographic assistant strictly grounded in currently active satellite observations, reconstructed 3D temperature grids, and ARGO float validation records. Ask any question regarding thermocline positioning, model attribution, or in-situ validation.",
      citations: [
        "Copernicus Marine Environment Monitoring Service (CMEMS)",
        "NASA PO.DAAC Satellite Constellation",
        "ARGO Global Data Assembly Centre (GDAC)"
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const presetQueries = [
    "Why is the thermocline deeper in this region?",
    "How does autonomous ARGO validate this reconstruction?",
    "Explain the subsurface temperature anomaly detected",
    "What is the role of Sea Surface Salinity in the embedding?"
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const res = await oceanApi.askOceanAnalyst(textToSend, selectedRegion, selectedDepth);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: res.analyst_response,
        citations: res.grounding_sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      // Fallback
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="rounded-2xl glass-panel p-6 border border-cyan-500/25 bg-[#060e20]/90 shadow-2xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Bot className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
              Neeraksh Analyst (Grounded AI Ocean Scientist)
            </h2>
            <span className="text-xs font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded">
              STRICT DATA GROUNDING (NO HALLUCINATION)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Answers questions based ONLY on the currently loaded region, model attributions, and ARGO telemetry
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/40">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ZERO-HALLUCINATION PROTOCOL ACTIVE</span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {presetQueries.map(q => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-[#071328] hover:bg-[#0c1e3d] hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition text-left cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="mt-4 p-4 rounded-xl bg-[#030713] border border-slate-800 max-h-[420px] min-h-[320px] overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center shrink-0 border border-emerald-400/40 text-white shadow">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
              m.sender === 'user'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-tr-none'
                : 'bg-[#071328] text-slate-200 border border-slate-800 rounded-tl-none'
            }`}>
              <p>{m.text}</p>

              {m.citations && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                  <span className="font-bold text-emerald-400 block mb-1">EVIDENCE CITATIONS:</span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {m.citations.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={`text-[9px] mt-2 font-mono ${m.sender === 'user' ? 'text-slate-800' : 'text-slate-500'}`}>
                {m.timestamp}
              </div>
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 text-emerald-400">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 items-center text-xs font-mono text-emerald-400">
            <Bot className="w-4 h-4 animate-spin" />
            <span>Neeraksh Analyst is synthesizing multi-sensor evidence...</span>
          </div>
        )}
      </div>

      {/* Input query field */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a scientific question regarding the subsurface profile or model attributions..."
          className="flex-1 bg-[#040916] border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || isTyping}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span className="text-xs">Inquire</span>
        </button>
      </div>
    </div>
  );
};
