import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Lock, Clock, Lightbulb, AlertTriangle, RotateCcw } from 'lucide-react';
import { QuizQuestion } from '../types';
import { validateAnswer } from '../utils/validation';
import HintModal from './HintModal';
import TabSwitchBlocker from './TabSwitchBlocker';
import { getAttempts, incrementAttempts } from '../utils/storage';

interface QuizProps {
  questions: QuizQuestion[];
  groupId: string;
  onComplete: () => void;
}

export default function Quiz({ questions, groupId, onComplete }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [shake, setShake] = useState(false);
  
  // Timer states
  const [timeRemaining, setTimeRemaining] = useState(360); // 6 minutes = 360 seconds
  const [isTimeUp, setIsTimeUp] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Hint states - track purchased hints per question
  const [showHintModal, setShowHintModal] = useState(false);
  const [purchasedHints, setPurchasedHints] = useState<Record<string, number>>({});
  
  // Tab visibility blocker
  const [showTabBlocker, setShowTabBlocker] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  
  // Attempts tracking
  const [attempts, setAttempts] = useState(() => getAttempts(groupId));
  const [showMaxAttemptsModal, setShowMaxAttemptsModal] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  // Enter fullscreen on mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.log('Fullscreen request failed:', err);
      }
    };
    
    enterFullscreen();

    // Cleanup on unmount
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  // Check max attempts on mount
  useEffect(() => {
    if (attempts >= 3) {
      setShowMaxAttemptsModal(true);
    }
  }, [attempts]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining <= 0) {
      setIsTimeUp(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeRemaining]);

  // Detect tab change - show full screen blocker
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => prev + 1);
        setShowTabBlocker(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleHintRequest = () => {
    if (currentQuestion.hints && currentQuestion.hints.length > 0) {
      setShowHintModal(true);
    }
  };

  const handleHintConfirm = () => {
    // Purchase next hint for current question
    const currentPurchased = purchasedHints[currentQuestion.id] || 0;
    setPurchasedHints(prev => ({
      ...prev,
      [currentQuestion.id]: currentPurchased + 1
    }));
    // Reduce time by 60 seconds (1 minute)
    setTimeRemaining(prev => Math.max(0, prev - 60));
  };

  const handleHintCancel = () => {
    setShowHintModal(false);
  };

  const handleReturnToQuiz = () => {
    setShowTabBlocker(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isTimeUp) return;

    let isCorrect = false;
    
    if (currentQuestion.type === 'image-select') {
      if (!selectedPerson) return;
      isCorrect = selectedPerson === currentQuestion.correctPersonId;
    } else {
      if (!answer.trim()) return;
      isCorrect = validateAnswer(currentQuestion, answer);
    }

    if (isCorrect) {
      setFeedback('correct');
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setAnswer('');
          setSelectedPerson(null);
          setFeedback(null);
        } else {
          // Stop timer on completion
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          onComplete();
        }
      }, 1500);
    } else {
      setFeedback('incorrect');
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setFeedback(null);
      }, 1500);
    }
  };

  const handleRestartQuiz = () => {
    const newAttempts = incrementAttempts(groupId);
    setAttempts(newAttempts);
    
    if (newAttempts >= 3) {
      setShowMaxAttemptsModal(true);
      return;
    }
    
    // Reset quiz state
    setCurrentIndex(0);
    setAnswer('');
    setSelectedPerson(null);
    setFeedback(null);
    setShake(false);
    setTimeRemaining(360);
    setIsTimeUp(false);
    setPurchasedHints({});
    setTabSwitchCount(0);
    setShowTabBlocker(false);
  };

  // Max attempts modal
  if (showMaxAttemptsModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Batas Percobaan Tercapai</h2>
          <p className="text-slate-300 mb-4">
            Tim <span className="font-bold text-blue-400">{groupId}</span> sudah mencoba sebanyak <span className="font-bold">3 kali</span>.
          </p>
          <p className="text-slate-400 text-sm">
            Hubungi panitia untuk mendapatkan akses kembali.
          </p>
        </div>
      </div>
    );
  }

  // Time up screen
  if (isTimeUp) {
    const canRetry = attempts < 3;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Waktu Habis!</h2>
          <p className="text-slate-300 mb-4">
            Maaf, waktu kamu sudah habis. Kamu hanya berhasil menyelesaikan {currentIndex} dari {questions.length} pertanyaan.
          </p>
          <p className="text-slate-400 text-sm mb-8">
            Percobaan: <span className="font-bold text-yellow-400">{attempts} / 3</span>
          </p>
          {canRetry && (
            <button
              onClick={handleRestartQuiz}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 mx-auto shadow-lg shadow-blue-500/30"
            >
              <RotateCcw className="w-5 h-5" />
              Coba Lagi
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentPurchasedCount = purchasedHints[currentQuestion.id] || 0;
  const hasHints = currentQuestion.hints && currentQuestion.hints.length > 0;
  const hasAvailableHints = hasHints && currentPurchasedCount < currentQuestion.hints.length;
  const hasPurchasedHints = currentPurchasedCount > 0;

  return (
    <>
      <TabSwitchBlocker
        isVisible={showTabBlocker}
        onReturn={handleReturnToQuiz}
      />

      <HintModal
        isOpen={showHintModal}
        onConfirm={handleHintConfirm}
        onCancel={handleHintCancel}
        hints={currentQuestion.hints || []}
        purchasedCount={currentPurchasedCount}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Header dengan Timer dan progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-semibold text-blue-400">
                  Verifikasi Kopsis
                </span>
              </div>
              
              {/* Timer */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-lg ${
                timeRemaining <= 60 
                  ? 'bg-red-500/20 text-red-400 animate-pulse' 
                  : timeRemaining <= 180
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-blue-500/20 text-blue-400'
              }`}>
                <Clock className="w-5 h-5" />
                {formatTime(timeRemaining)}
              </div>

              <span className="text-sm font-medium text-slate-300">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-500 shadow-lg shadow-blue-500/30"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-700">
            <div className="flex items-start justify-between mb-8">
              <h2 className="text-3xl font-bold text-white leading-snug flex-1">
                {currentQuestion.question}
              </h2>
              
              {/* Hint Button */}
              {hasHints && (
                <button
                  onClick={handleHintRequest}
                  className={`ml-4 flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    hasPurchasedHints && !hasAvailableHints
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : hasPurchasedHints
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30'
                      : 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30'
                  }`}
                  title={
                    hasPurchasedHints && !hasAvailableHints
                      ? 'Lihat hint yang sudah dibeli'
                      : hasPurchasedHints
                      ? `${currentPurchasedCount} hint dibeli - Klik untuk lihat/beli lagi`
                      : 'Beli hint (-1 menit per hint)'
                  }
                >
                  <Lightbulb className="w-5 h-5" />
                  {hasPurchasedHints 
                    ? `Hint (${currentPurchasedCount}/${currentQuestion.hints.length})`
                    : 'Hint'
                  }
                </button>
              )}
            </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentQuestion.type === 'text' ? (
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Ketik jawaban kamu di sini..."
                className={`w-full px-5 py-4 bg-slate-700 border-2 rounded-lg focus:outline-none transition-all text-white placeholder-slate-400 ${
                  shake 
                    ? 'animate-shake border-red-500' 
                    : 'border-slate-600 focus:border-blue-500'
                }`}
                disabled={feedback === 'correct'}
                autoFocus
              />
            ) : currentQuestion.type === 'choice' ? (
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      answer === option
                        ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20'
                        : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                    } ${shake && answer === option ? 'animate-shake border-red-500' : ''}`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={answer === option}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="w-5 h-5 text-blue-500"
                      disabled={feedback === 'correct'}
                    />
                    <span className="ml-3 text-slate-100 font-medium">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            ) : currentQuestion.type === 'image-select' ? (
              <div className="space-y-4">
                <p className="text-slate-300 text-sm mb-4">
                  Pilih orang dari daftar di bawah:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {currentQuestion.people?.map((person) => (
                    <button
                      key={person.id}
                      type="button"
                      onClick={() => setSelectedPerson(person.id)}
                      className={`relative group overflow-hidden rounded-lg transition-all border-2 ${
                        selectedPerson === person.id
                          ? 'border-blue-500 shadow-lg shadow-blue-500/30'
                          : 'border-slate-600 hover:border-slate-500'
                      } ${shake && selectedPerson === person.id ? 'animate-shake border-red-500' : ''}`}
                    >
                      <img
                        src={person.image}
                        alt={person.name}
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                        <p className="text-white font-semibold text-sm">
                          {person.name}
                        </p>
                      </div>
                      {selectedPerson === person.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {feedback && (
              <div
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  feedback === 'correct'
                    ? 'bg-green-500/20 border-green-500 text-green-200'
                    : 'bg-red-500/20 border-red-500 text-red-200'
                }`}
              >
                {feedback === 'correct' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">Nice! Kamu benar.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">
                      Kayaknya kamu kepikiran yang lain.
                    </span>
                  </>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={
                (currentQuestion.type === 'text' && !answer.trim()) ||
                (currentQuestion.type === 'choice' && !answer.trim()) ||
                (currentQuestion.type === 'image-select' && !selectedPerson) ||
                feedback === 'correct'
              }
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:shadow-none"
            >
              {currentIndex < questions.length - 1 ? 'Lanjut' : 'Selesai'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Bottom info */}
        <div className="text-center mt-6">
          <p className="text-slate-400 text-xs">
            🔒 Sistem keamanan Kopsis
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
      </div>
    </>
  );
}
