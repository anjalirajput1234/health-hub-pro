import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "wouter";
import {
  Send, Bot, User, Activity, Loader2, Sparkles, Building2,
  Star, Mic, MicOff, Volume2, VolumeX, RotateCcw
} from "lucide-react";
import { useChatbotSuggest } from "@/lib/api-client";
import type { Doctor } from "@/lib/api-client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
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

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content: "Hi! I'm your DoctorKhoj AI Assistant. Tell me what symptoms you are experiencing, and I'll recommend the right specialist for you. You can type or speak using the mic button!",
    },
  ]);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [micError, setMicError] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const chatbotSuggest = useChatbotSuggest();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const stopCurrentAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = "";
      currentAudioRef.current = null;
    }
    setSpeakingMsgId(null);
    if (voiceState === "speaking") setVoiceState("idle");
  }, [voiceState]);

  const speakMessage = useCallback(async (msg: Message) => {
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

    if (!audioBase64) {
      setVoiceState("idle");
      return;
    }

    setVoiceState("speaking");
    setSpeakingMsgId(msg.id);
    const audio = playBase64Audio(audioBase64, () => {
      setVoiceState("idle");
      setSpeakingMsgId(null);
    });
    currentAudioRef.current = audio;
  }, [voiceEnabled, stopCurrentAudio]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || chatbotSuggest.isPending) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text.trim(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      chatbotSuggest.mutate(
        { data: { symptoms: userMessage.content } },
        {
          onSuccess: async (response) => {
            const botMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: "bot",
              content: response.message,
              suggestedSpecialization: response.suggestedSpecialization,
              doctors: response.doctors,
            };
            setMessages((prev) => [...prev, botMessage]);

            if (voiceEnabled) {
              const audioBase64 = await fetchTTS(response.message);
              if (audioBase64) {
                const msgWithAudio = { ...botMessage, audioBase64 };
                setMessages((prev) =>
                  prev.map((m) => (m.id === botMessage.id ? msgWithAudio : m))
                );
                setVoiceState("speaking");
                setSpeakingMsgId(botMessage.id);
                const audio = playBase64Audio(audioBase64, () => {
                  setVoiceState("idle");
                  setSpeakingMsgId(null);
                });
                currentAudioRef.current = audio;
              }
            }
          },
          onError: () => {
            const errMsg: Message = {
              id: (Date.now() + 1).toString(),
              role: "bot",
              content:
                "I'm sorry, I'm having trouble connecting right now. Please try searching directly from the homepage.",
            };
            setMessages((prev) => [...prev, errMsg]);
          },
        }
      );
    },
    [chatbotSuggest, voiceEnabled]
  );

  const startListening = useCallback(() => {
    if (voiceState !== "idle") return;
    setMicError(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicError("Speech recognition is not supported in your browser. Please use Chrome.");
      return;
    }

    const recognition: SpeechRecognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setVoiceState("listening");

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setInput(transcript);
    };

    recognition.onend = () => {
      setVoiceState("idle");
      recognitionRef.current = null;
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed") {
        setMicError("Microphone permission denied. Please allow mic access and try again.");
      } else if (event.error === "no-speech") {
        setMicError("No speech detected. Please try again.");
      } else {
        setMicError("Could not understand. Please try again.");
      }
      setVoiceState("idle");
      recognitionRef.current = null;
    };

    recognition.start();
  }, [voiceState]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setVoiceState("idle");
  }, []);

  const handleMicClick = () => {
    if (voiceState === "listening") {
      stopListening();
    } else if (voiceState === "speaking") {
      stopCurrentAudio();
    } else {
      startListening();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const micButtonProps = () => {
    if (voiceState === "listening")
      return { label: "Stop Listening", icon: MicOff, className: "text-red-500 border-red-400 bg-red-50 hover:bg-red-100 animate-pulse" };
    if (voiceState === "speaking")
      return { label: "Stop Speaking", icon: VolumeX, className: "text-blue-500 border-blue-400 bg-blue-50 hover:bg-blue-100" };
    if (voiceState === "processing")
      return { label: "Processing...", icon: Loader2, className: "text-slate-400 border-slate-300 bg-slate-50 cursor-not-allowed" };
    return { label: "Start Speaking", icon: Mic, className: "text-slate-600 border-slate-300 hover:border-primary hover:text-primary hover:bg-primary/5" };
  };

  const { label, icon: MicIcon, className: micClass } = micButtonProps();

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 relative max-w-4xl mx-auto border-x border-slate-200 shadow-sm">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6" />
            {voiceState === "speaking" && (
              <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-60" />
            )}
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-tight">AI Symptom Checker</h1>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              {voiceState === "listening" && (
                <span className="flex items-center gap-1 text-red-500 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
                  Listening...
                </span>
              )}
              {voiceState === "speaking" && (
                <span className="flex items-center gap-1 text-primary font-semibold">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
                  Speaking...
                </span>
              )}
              {voiceState === "processing" && (
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Generating voice...
                </span>
              )}
              {voiceState === "idle" && "Powered by DoctorKhoj"}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setVoiceEnabled((v) => !v);
            if (voiceState === "speaking") stopCurrentAudio();
          }}
          className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
            voiceEnabled
              ? "text-primary border-primary/30 bg-primary/5 hover:bg-primary/10"
              : "text-slate-400 border-slate-200 bg-slate-50 hover:bg-slate-100"
          }`}
          title={voiceEnabled ? "Disable voice responses" : "Enable voice responses"}
        >
          {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          {voiceEnabled ? "Voice On" : "Voice Off"}
        </button>
      </div>

      {/* Voice waveform bar */}
      {voiceState === "listening" && (
        <div className="bg-red-50 border-b border-red-100 px-4 py-2 flex items-center gap-3 shrink-0">
          <div className="flex items-end gap-0.5 h-6">
            {[3, 5, 8, 5, 10, 6, 4, 9, 5, 3, 7, 5].map((h, i) => (
              <div
                key={i}
                className="w-1 bg-red-400 rounded-full"
                style={{
                  height: `${h * 2}px`,
                  animation: `pulse ${0.5 + i * 0.07}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>
          <span className="text-sm text-red-600 font-medium">Listening — speak your symptoms clearly</span>
        </div>
      )}

      {/* Mic error */}
      {micError && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between shrink-0">
          <span className="text-sm text-amber-700">{micError}</span>
          <button onClick={() => setMicError(null)} className="text-amber-500 hover:text-amber-700 text-xs font-medium">
            Dismiss
          </button>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                msg.role === "user" ? "bg-slate-200 text-slate-600" : "bg-primary text-white shadow-md"
              }`}
            >
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[85%] md:max-w-[75%] flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`p-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-tr-sm shadow-sm"
                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>

              {/* Replay voice button for bot messages */}
              {msg.role === "bot" && voiceEnabled && (
                <button
                  onClick={() => {
                    if (speakingMsgId === msg.id) {
                      stopCurrentAudio();
                    } else {
                      speakMessage(msg);
                    }
                  }}
                  className={`mt-1.5 flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full transition-colors ${
                    speakingMsgId === msg.id
                      ? "text-primary bg-primary/10 animate-pulse"
                      : "text-slate-400 hover:text-primary hover:bg-primary/5"
                  }`}
                  title={speakingMsgId === msg.id ? "Stop" : "Play voice"}
                >
                  {speakingMsgId === msg.id ? (
                    <><VolumeX className="w-3.5 h-3.5" /> Stop</>
                  ) : (
                    <><Volume2 className="w-3.5 h-3.5" /> Play voice</>
                  )}
                </button>
              )}

              {/* Suggestions */}
              {msg.role === "bot" && msg.suggestedSpecialization && (
                <div className="mt-4 w-full">
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-bold text-slate-700">
                      Suggested Specialty:{" "}
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none ml-1">
                        {msg.suggestedSpecialization}
                      </Badge>
                    </span>
                  </div>

                  {msg.doctors && msg.doctors.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-3 mt-2 pl-2">
                      {msg.doctors.map((doc) => (
                        <Card key={doc.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0 overflow-hidden">
                                {doc.imageUrl ? (
                                  <img src={doc.imageUrl} alt={doc.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-slate-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{doc.name}</h4>
                                <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  {doc.rating.toFixed(1)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                              <Building2 className="w-3 h-3" />
                              <span className="truncate">{doc.hospitalName || "Independent Clinic"}</span>
                            </div>
                            <Button size="sm" className="w-full h-8 text-xs" asChild>
                              <Link href={`/book/${doc.id}`}>Book Appt</Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="pl-2 mt-2">
                      <p className="text-sm text-slate-500 italic bg-white p-3 rounded-lg border border-dashed">
                        No doctors found for this specialty currently.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {chatbotSuggest.isPending && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 mt-1 shadow-md">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-slate-500 text-sm font-medium">Analyzing symptoms...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              voiceState === "listening"
                ? "Listening... speak now"
                : "E.g., I have been having a severe headache and fever..."
            }
            className="min-h-[52px] max-h-[120px] resize-none border-slate-300 focus-visible:ring-primary rounded-xl text-base py-3"
            disabled={chatbotSuggest.isPending || voiceState === "listening"}
          />

          {/* Mic Button */}
          <button
            type="button"
            onClick={handleMicClick}
            disabled={voiceState === "processing" || chatbotSuggest.isPending}
            title={label}
            className={`w-12 h-12 rounded-full shrink-0 self-end border-2 flex items-center justify-center transition-all duration-200 ${micClass}`}
          >
            <MicIcon className={`w-5 h-5 ${voiceState === "processing" ? "animate-spin" : ""}`} />
            <span className="sr-only">{label}</span>
          </button>

          {/* Send Button */}
          <Button
            type="submit"
            size="icon"
            className="w-12 h-12 rounded-full shrink-0 self-end shadow-md"
            disabled={!input.trim() || chatbotSuggest.isPending || voiceState === "listening"}
          >
            <Send className="w-5 h-5 ml-0.5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>

        <div className="flex items-center justify-between max-w-3xl mx-auto mt-2">
          <p className="text-xs text-slate-400 font-medium">
            Disclaimer: This AI is for guidance only and does not replace professional medical advice.
          </p>
          {messages.length > 2 && (
            <button
              onClick={() => {
                stopCurrentAudio();
                setMessages([{
                  id: "welcome",
                  role: "bot",
                  content: "Hi! I'm your DoctorKhoj AI Assistant. Tell me what symptoms you are experiencing, and I'll recommend the right specialist for you. You can type or speak using the mic button!",
                }]);
                setInput("");
              }}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-primary transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Clear chat
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
