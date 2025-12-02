import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Volume2, Wand2, X, Check, ThumbsUp, ArrowRight, MessageCircle, RefreshCw, Sparkles, Award } from 'lucide-react';
import { upgradeSentence } from '../services/geminiService';
import { SPEAKING_QUESTIONS } from '../constants';
import { playSound } from '../services/audioService';

interface Feedback {
  original: string;
  correction: string;
  explanation: string;
  type: string;
}

interface SpeakingCornerProps {
    addXp: (amount: number) => void;
}

export const SpeakingCorner: React.FC<SpeakingCornerProps> = ({ addXp }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [isSpinning, setIsSpinning] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const chunksRef = useRef<Blob[]>([]);
  const visualizerInterval = useRef<number | null>(null);
  const [visualizerHeight, setVisualizerHeight] = useState<number[]>(new Array(12).fill(10));

  useEffect(() => {
    spinQuestion();
    return () => {
        if (visualizerInterval.current) {
            window.clearInterval(visualizerInterval.current);
        }
        cleanupMedia();
    }
  }, []);

  const cleanupMedia = () => {
      if (mediaRecorderRef.current) {
          if (mediaRecorderRef.current.state === 'recording') {
              mediaRecorderRef.current.stop();
          }
          if (mediaRecorderRef.current.stream) {
              mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
          }
      }
      if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (e) {
            // Ignore
          }
      }
  };

  useEffect(() => {
    if (isRecording) {
        visualizerInterval.current = window.setInterval(() => {
            setVisualizerHeight(prev => prev.map(() => Math.random() * 80 + 20));
        }, 100);
    } else {
        if (visualizerInterval.current) {
            window.clearInterval(visualizerInterval.current);
        }
        setVisualizerHeight(new Array(12).fill(10));
    }
    return () => {
        if (visualizerInterval.current) window.clearInterval(visualizerInterval.current);
    }
  }, [isRecording]);

  const spinQuestion = () => {
    setIsSpinning(true);
    playSound('click');
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * SPEAKING_QUESTIONS.length);
        setCurrentQuestion(SPEAKING_QUESTIONS[randomIndex]);
        setIsSpinning(false);
        setFeedback(null);
        setAudioURL(null);
        setTranscript('');
        playSound('pop');
    }, 300);
  };

  const startRecording = async () => {
    try {
      playSound('click');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        chunksRef.current = [];
        playSound('success');
      };

      mediaRecorderRef.current.start();

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onresult = (event: any) => {
              let currentTranscript = '';
              for (let i = 0; i < event.results.length; ++i) {
                  currentTranscript += event.results[i][0].transcript;
              }
              setTranscript(currentTranscript);
          };

          recognition.onerror = (event: any) => {
              if (event.error === 'not-allowed') {
                  setIsRecording(false);
                  playSound('error');
                  alert("Speech recognition access denied.");
              }
          };
          
          recognitionRef.current = recognition;
          recognition.start();
      }

      setIsRecording(true);
      setFeedback(null);
      setTranscript("");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      playSound('error');
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    cleanupMedia();
    setIsRecording(false);
    addXp(15); // XP for attempting recording
  };

  const handleUpgrade = async () => {
    if (!transcript) return;
    setLoading(true);
    playSound('click');
    try {
        const result = await upgradeSentence(transcript);
        const json = JSON.parse(result);
        setFeedback(json);
        
        // Gamification Rewards
        playSound('levelUp');
        addXp(50);
        (window as any).confetti({
            particleCount: 150,
            spread: 60,
            colors: ['#0ea5e9', '#10b981', '#fbbf24']
        });

    } catch (e) {
        console.error("Failed to parse analysis result", e);
        playSound('error');
        setFeedback({
            original: transcript,
            correction: "Error parsing response.",
            explanation: "The AI response was invalid. Please try again.",
            type: "ERROR"
        });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
        
      {/* 1. The Stage / Topic Card */}
      <div className="relative group perspective-1000 cursor-pointer" onClick={spinQuestion}>
        <div className={`
            relative overflow-hidden rounded-3xl p-8 md:p-10 shadow-2xl transition-all duration-500 transform
            bg-gradient-to-br from-indigo-600 via-purple-600 to-brand-600
            text-white border-4 border-white/20 dark:border-slate-700
            hover:shadow-brand-500/50 hover:scale-[1.01]
            ${isSpinning ? 'rotate-x-90 opacity-50 scale-95' : 'rotate-x-0 opacity-100 scale-100'}
        `}>
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none animate-pulse-fast"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center gap-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-widest backdrop-blur-sm border border-white/10">
                    <MessageCircle className="w-3 h-3" /> Topic Generator
                </span>
                
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold leading-tight drop-shadow-sm min-h-[5rem] flex items-center justify-center">
                    "{currentQuestion}"
                </h3>

                <button 
                    className="mt-2 group/btn flex items-center gap-2 bg-white text-brand-600 px-6 py-2 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                    <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : 'group-hover/btn:rotate-180 transition-transform duration-500'}`} />
                    Spin Topic
                </button>
            </div>
        </div>
      </div>

      {/* 2. Action Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Recorder Panel */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-hidden min-h-[250px]">
             
             <div className="absolute top-4 right-4 text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
                <Award className="w-3 h-3" /> +15 XP
             </div>

             <h4 className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Recording Studio</h4>

             <div className="relative z-10">
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`
                        w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 relative
                        ${isRecording 
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 scale-110 shadow-red-500/20' 
                            : 'bg-gradient-to-tr from-rose-500 to-red-600 text-white hover:scale-110 hover:shadow-red-500/40 active:scale-95'}
                    `}
                >
                    {isRecording && (
                         <span className="absolute inset-0 rounded-full border-4 border-slate-900/30 dark:border-white/30 animate-ping"></span>
                    )}
                    {isRecording ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-8 h-8" />}
                </button>
             </div>

             <div className="mt-6 h-8 flex items-end gap-1 justify-center">
                 {isRecording ? (
                    visualizerHeight.slice(0, 8).map((h, i) => (
                        <div key={i} className="w-1.5 bg-rose-500 rounded-full transition-all duration-75" style={{ height: `${h/2}px` }}></div>
                    ))
                 ) : (
                    <span className="text-slate-400 text-sm font-medium animate-pulse">Tap microphone to start</span>
                 )}
             </div>
          </div>

          {/* Transcript / Output Panel */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col relative overflow-hidden">
             
             <div className="flex justify-between items-center mb-4">
                 <h4 className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">Transcript</h4>
                 {audioURL && (
                     <button 
                        onClick={() => { const audio = new Audio(audioURL); audio.play(); playSound('hover'); }}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-brand-500" 
                        title="Play Recording"
                     >
                         <Volume2 className="w-4 h-4" />
                     </button>
                 )}
             </div>

             <div className="flex-grow relative bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-700 mb-4 group focus-within:ring-2 ring-brand-500/20 transition-all min-h-[120px]">
                {!transcript && !isRecording && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-slate-600 text-sm italic pointer-events-none">
                        Waiting for speech...
                    </div>
                )}
                <textarea 
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    disabled={isRecording} 
                    className="w-full h-full bg-transparent resize-none outline-none text-slate-700 dark:text-slate-200 font-medium placeholder:text-slate-300 disabled:opacity-70"
                    placeholder="Your speech will appear here..."
                />
             </div>

             <button 
                onClick={handleUpgrade}
                disabled={!transcript || loading || isRecording}
                className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-500/20"
             >
                {loading ? (
                    <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing...
                    </>
                ) : (
                    <>
                        <Wand2 className="w-4 h-4" /> Upgrade (+50 XP)
                    </>
                )}
             </button>
          </div>
      </div>

      {/* 3. Feedback "Magic Mirror" */}
      {feedback && (
          <div className="animate-in slide-in-from-bottom-6 duration-500 fade-in">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl border-2 border-emerald-100 dark:border-emerald-800/50 p-6 md:p-8 relative overflow-hidden shadow-2xl">
                  
                  {/* Badge */}
                  <div className="absolute top-0 left-0 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-br-2xl shadow-sm uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Feedback
                  </div>

                  <div className="flex flex-col md:flex-row gap-8 items-start relative z-10 mt-4">
                      {/* Before */}
                      <div className="flex-1 w-full">
                          <h5 className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">
                              <X className="w-4 h-4 text-red-400" /> You Said
                          </h5>
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-red-100 dark:border-red-900/30 text-slate-600 dark:text-slate-400 line-through decoration-red-400 decoration-2 font-medium">
                              "{feedback.original}"
                          </div>
                      </div>

                      {/* Arrow */}
                      <div className="hidden md:flex items-center justify-center pt-8 text-emerald-400">
                          <ArrowRight className="w-6 h-6 animate-pulse" />
                      </div>

                      {/* After */}
                      <div className="flex-1 w-full">
                          <h5 className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">
                              <Check className="w-4 h-4" /> Better Version
                          </h5>
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border-2 border-emerald-400/30 shadow-lg shadow-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold text-lg flex flex-col gap-2 transform transition-all hover:scale-[1.02]">
                              <span>"{feedback.correction}"</span>
                          </div>
                      </div>
                  </div>
                  
                  {/* Teacher Note */}
                  <div className="mt-6 flex gap-3 items-start bg-emerald-100/50 dark:bg-emerald-900/30 p-4 rounded-xl">
                      <div className="p-2 bg-emerald-200 dark:bg-emerald-800 rounded-full flex-shrink-0 text-emerald-800 dark:text-emerald-100">
                          <ThumbsUp className="w-4 h-4" />
                      </div>
                      <div>
                          <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200 mb-1">Teacher's Note</p>
                          <p className="text-emerald-700 dark:text-emerald-300 text-sm leading-relaxed">
                              {feedback.explanation}
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};