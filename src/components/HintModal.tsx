import { AlertCircle, Clock, X, Lightbulb, Lock } from 'lucide-react';
import { useState } from 'react';

interface HintModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  hints: string[];
  purchasedCount: number;
}

export default function HintModal({ isOpen, onConfirm, onCancel, hints, purchasedCount }: HintModalProps) {
  const [confirmingPurchase, setConfirmingPurchase] = useState(false);

  if (!isOpen) return null;

  const hasMoreHints = purchasedCount < hints.length;
  const nextHintIndex = purchasedCount;
  const purchasedHints = hints.slice(0, purchasedCount);

  const handleBuyHint = () => {
    setConfirmingPurchase(true);
  };

  const handleConfirmPurchase = () => {
    setConfirmingPurchase(false);
    onConfirm();
  };

  const handleCancel = () => {
    setConfirmingPurchase(false);
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-700 animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Hint</h3>
          </div>
          <button
            onClick={handleCancel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Purchased Hints */}
          {purchasedHints.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-400 font-semibold">Hint yang sudah dibeli:</p>
              {purchasedHints.map((hint, index) => (
                <div key={index} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-yellow-400">{index + 1}</span>
                    </div>
                    <p className="text-white text-sm leading-relaxed">{hint}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Buy Next Hint */}
          {confirmingPurchase ? (
            <>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-red-400" />
                  <span className="font-semibold text-red-400">Peringatan!</span>
                </div>
                <p className="text-slate-300 text-sm">
                  Membeli hint akan mengurangi waktu kamu sebesar <span className="font-bold text-red-400">1 menit</span>.
                </p>
              </div>

              <p className="text-slate-400 text-sm text-center">
                Apakah kamu yakin ingin membeli hint berikutnya?
              </p>
            </>
          ) : hasMoreHints ? (
            <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-white font-semibold text-sm">Hint selanjutnya tersedia</p>
                  <p className="text-slate-400 text-xs">Hint {nextHintIndex + 1} dari {hints.length}</p>
                </div>
              </div>
              <button
                onClick={handleBuyHint}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold rounded-lg transition-colors text-sm"
              >
                Beli (-1 menit)
              </button>
            </div>
          ) : (
            <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 text-center">
              <p className="text-slate-400 text-sm">Semua hint sudah dibeli</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-slate-700">
          {confirmingPurchase ? (
            <>
              <button
                onClick={() => setConfirmingPurchase(false)}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold rounded-lg transition-colors shadow-lg shadow-yellow-500/30"
              >
                Ya, Beli Hint
              </button>
            </>
          ) : (
            <button
              onClick={handleCancel}
              className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
            >
              Tutup
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
