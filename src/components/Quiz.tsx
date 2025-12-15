import { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Lock } from 'lucide-react';
import { QuizQuestion } from '../types';
import { validateAnswer } from '../utils/validation';

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

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header dengan progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-blue-400">
                Verifikasi Kopsis
              </span>
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
          <h2 className="text-3xl font-bold text-white mb-8 leading-snug">
            {currentQuestion.question}
          </h2>

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
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
