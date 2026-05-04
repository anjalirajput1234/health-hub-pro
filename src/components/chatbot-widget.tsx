import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "wouter";
import {
  Bot, User, Send, X, Mic, MicOff, Volume2, VolumeX,
  Activity, Sparkles, Building2, Star, Loader2, Maximize2, RotateCcw
} from "lucide-react";
import { useChatbotSuggest } from "@/lib/api-client";
import type { Doctor } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BASE = import.meta.env.BASE_URL;

type VoiceState = "idle" | "listening" | "processing" | "speaking";
type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  suggestedSpecialization?: string;
  doctors?: Doctor[];
  audioBase64?: string;
};

async function fetchTTS(text: string): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}api/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice: "nova" }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.audio ?? null;
  } catch {
    return null;
  }
}

function playBase64Audio(base64: string, onEnd?: () => void): HTMLAudioElement {
  const audio = new Audio(`data:audio/mp3;base64,${base64}`);
  if (onEnd) audio.onended = onEnd;
  audio.play().catch(() => {});
  return audio;
}

const WELCOME: Message = {
  id: "welcome",
  role: "bot",
  content: "Hi! Tell me your symptoms and I'll suggest the right doctor for you. You can type or speak!",
};

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [micError, setMicError] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [unread, setUnread] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const chatbotSuggest = useChatbotSuggest();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const stopCurrentAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = "";
      currentAudioRef.current = null;
    }
    setSpeakingMsgId(null);
    setVoiceState((s) => (s === "speaking" ? "idle" : s));
  }, []);

  const speakText = useCallback(async (msg: Message) => {
    if (!voiceEnabled) return;
    stopCurrentAudio();

    let audioBase64 = msg.audioBase64;
    if (!audioBase64) {
      setVoiceState("processing");
      audioBase64 = (await fetchTTS(msg.content)) ?? undefined;
      if (audioBase64) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, audioBase64 } : m))
        );
      }
    }

    if (!audioBase64) { setVoiceState("idle"); return; }

    setVoiceState("speaking");
    setSpeakingMsgId(msg.id);
    const audio = playBase64Audio(audioBase64, () => {
      setVoiceState("idle");
      setSpeakingMsgId(null);
    });
    currentAudioRef.current = audio;
  }, [voiceEnabled, stopCurrentAudio]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || chatbotSuggest.isPending) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    chatbotSuggest.mutate(
      { data: { symptoms: userMsg.content } },
      {
        onSuccess: async (response) => {
          const botMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: "bot",
            content: response.message,
            suggestedSpecialization: response.suggestedSpecialization,
            doctors: response.doctors,
          };
          setMessages((prev) => [...prev, botMsg]);
          if (!open) setUnread((n) => n + 1);

          if (voiceEnabled) {
            const audio64 = await fetchTTS(response.message);
            if (audio64) {
              const withAudio = { ...botMsg, audioBase64: audio64 };
              setMessages((prev) =>
                prev.map((m) => (m.id === botMsg.id ? withAudio : m))
              );
              setVoiceState("speaking");
              setSpeakingMsgId(botMsg.id);
              const audio = playBase64Audio(audio64, () => {
                setVoiceState("idle");
                setSpeakingMsgId(null);
              });
              currentAudioRef.current = audio;
            }
          }
        },
        onError: () => {
          setMessages((prev) => [...prev, {
            id: (Date.now() + 1).toString(),
            role: "bot",
            content: "Sorry, I'm having trouble right now. Please try again or visit the full AI Symptom Checker.",
          }]);
        },
      }
    );
  }, [chatbotSuggest, voiceEnabled, open]);

  const startListening = useCallback(() => {
    if (voiceState !== "idle") return;
    setMicError(null);

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setMicError("Speech recognition not supported. Use Chrome."); return; }

    const rec: SpeechRecognition = new SR();
    rec.lang = "en-IN";
    rec.interimResults = true;
    recognitionRef.current = rec;

    rec.onstart = () => setVoiceState("listening");
    rec.onresult = (e) => {
      const t = Array.from(e.results).map((r) => r[0].transcript).join("");
      setInput(t);
    };
    rec.onend = () => { setVoiceState("idle"); recognitionRef.current = null; };
    rec.onerror = (e) => {
      setMicError(
        e.error === "not-allowed"
          ? "Mic permission denied. Please allow microphone access."
          : "Could not understand. Please try again."
      );
      setVoiceState("idle");
      recognitionRef.current = null;
    };
    rec.start();
  }, [voiceState]);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label="Open AI Symptom Checker"
      >
        {open ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
            {unread}
          </span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          style={{ height: "520px" }}>
          {/* Header */}
          <div className="bg-primary text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5" />
                {voiceState === "speaking" && (
                  <span className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-70" />
                )}
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">AI Symptom Checker</p>
                <p className="text-xs text-white/75">
                  {voiceState === "listening" && "Listening..."}
                  {voiceState === "speaking" && "Speaking..."}
                  {voiceState === "processing" && "Generating voice..."}
                  {voiceState === "idle" && "Ask me about your symptoms"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setVoiceEnabled((v) => !v); if (voiceState === "speaking") stopCurrentAudio(); }}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                title={voiceEnabled ? "Mute voice" : "Unmute voice"}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <Link href="/chatbot">
                <button className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors" title="Open full view">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Voice bar */}
          {voiceState === "listening" && (
            <div className="bg-red-50 border-b border-red-100 px-3 py-1.5 flex items-center gap-2 shrink-0">
              <div className="flex items-end gap-0.5 h-4">
                {[3, 5, 8, 5, 9, 6, 4, 8].map((h, i) => (
                  <div key={i} className="w-0.5 bg-red-400 rounded-full"
                    style={{ height: `${h * 1.5}px`, animation: `pulse ${0.5 + i * 0.08}s ease-in-out infinite alternate` }}
                  />
                ))}
              </div>
              <span className="text-xs text-red-600 font-medium">Listening — speak clearly</span>
            </div>
          )}

          {micError && (
            <div className="bg-amber-50 border-b border-amber-100 px-3 py-1.5 flex items-center justify-between shrink-0">
              <span className="text-xs text-amber-700">{micError}</span>
              <button onClick={() => setMicError(null)} className="text-amber-500 text-xs">✕</button>
            </div>
          )}

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  msg.role === "user" ? "bg-slate-200 text-slate-600" : "bg-primary text-white"
                }`}>
                  {msg.role === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                </div>
                <div className={`max-w-[80%] flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-tr-sm"
                      : "bg-slate-100 text-slate-800 rounded-tl-sm"
                  }`}>
                    {msg.content}
                  </div>

                  {msg.role === "bot" && voiceEnabled && (
                    <button
                      onClick={() => speakingMsgId === msg.id ? stopCurrentAudio() : speakText(msg)}
                      className={`mt-1 flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full transition-colors ${
                        speakingMsgId === msg.id
                          ? "text-primary animate-pulse"
                          : "text-slate-400 hover:text-primary"
                      }`}
                    >
                      {speakingMsgId === msg.id
                        ? <><VolumeX className="w-3 h-3" /> Stop</>
                        : <><Volume2 className="w-3 h-3" /> Play</>
                      }
                    </button>
                  )}

                  {msg.role === "bot" && msg.suggestedSpecialization && (
                    <div className="mt-2 w-full">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <Badge className="bg-primary/10 text-primary border-none text-xs">
                          {msg.suggestedSpecialization}
                        </Badge>
                      </div>
                      {msg.doctors && msg.doctors.length > 0 && (
                        <div className="space-y-2">
                          {msg.doctors.slice(0, 2).map((doc) => (
                            <div key={doc.id} className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm">
                              <div className="flex items-center gap-2 mb-1.5">
                                <div className="w-7 h-7 rounded-full bg-slate-100 shrink-0 flex items-center justify-center">
                                  {doc.imageUrl
                                    ? <img src={doc.imageUrl} alt={doc.name} className="w-full h-full object-cover rounded-full" />
                                    : <User className="w-3.5 h-3.5 text-slate-400" />
                                  }
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-xs text-slate-900 truncate">{doc.name}</p>
                                  <div className="flex items-center gap-1 text-xs text-slate-500">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    {doc.rating.toFixed(1)}
                                    <span className="mx-0.5">·</span>
                                    <Building2 className="w-3 h-3" />
                                    <span className="truncate max-w-[80px]">{doc.hospitalName || "Clinic"}</span>
                                  </div>
                                </div>
                              </div>
                              <Link href={`/book/${doc.id}`} onClick={() => setOpen(false)}>
                                <button className="w-full text-xs bg-primary text-white py-1 rounded-lg hover:bg-primary/90 transition-colors">
                                  Book Appointment
                                </button>
                              </Link>
                            </div>
                          ))}
                          {msg.doctors.length > 2 && (
                            <Link href="/doctors" onClick={() => setOpen(false)}>
                              <button className="w-full text-xs text-primary hover:underline py-1">
                                View all {msg.doctors.length} doctors →
                              </button>
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {chatbotSuggest.isPending && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                  <Bot className="w-3 h-3" />
                </div>
                <div className="bg-slate-100 px-3 py-2 rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-xs text-slate-500">Analyzing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t px-3 py-2.5 shrink-0 bg-white">
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder={voiceState === "listening" ? "Listening..." : "Type symptoms or use mic..."}
                disabled={chatbotSuggest.isPending || voiceState === "listening"}
                className="flex-1 text-sm border border-slate-300 rounded-xl px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:bg-slate-50"
              />

              <button
                type="button"
                onClick={() => {
                  if (voiceState === "listening") { recognitionRef.current?.stop(); setVoiceState("idle"); }
                  else if (voiceState === "speaking") stopCurrentAudio();
                  else startListening();
                }}
                disabled={voiceState === "processing" || chatbotSuggest.isPending}
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  voiceState === "listening"
                    ? "border-red-400 text-red-500 bg-red-50 animate-pulse"
                    : voiceState === "speaking"
                    ? "border-primary text-primary bg-primary/10"
                    : "border-slate-300 text-slate-500 hover:border-primary hover:text-primary hover:bg-primary/5"
                }`}
              >
                {voiceState === "listening" ? <MicOff className="w-4 h-4" />
                  : voiceState === "speaking" ? <VolumeX className="w-4 h-4" />
                  : voiceState === "processing" ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || chatbotSuggest.isPending || voiceState === "listening"}
                className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shrink-0 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>

            <div className="flex items-center justify-between mt-1.5">
              <p className="text-xs text-slate-400">AI guidance only — not medical advice</p>
              {messages.length > 1 && (
                <button
                  onClick={() => { stopCurrentAudio(); setMessages([WELCOME]); setInput(""); }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-primary transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
