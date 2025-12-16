import { AlertTriangle } from 'lucide-react';

interface TabSwitchBlockerProps {
  isVisible: boolean;
  onReturn: () => void;
}

export default function TabSwitchBlocker({ isVisible, onReturn }: TabSwitchBlockerProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-red-600 z-[100] flex items-center justify-center animate-pulse">
      <div className="text-center max-w-lg p-8">
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <AlertTriangle className="w-16 h-16 text-white" />
        </div>
        
        <h1 className="text-5xl font-bold text-white mb-4">
          PERINGATAN!
        </h1>
        
        <p className="text-2xl text-white mb-6 font-semibold">
          Kamu tidak boleh berpindah tab atau window!
        </p>
        
        <p className="text-xl text-white/90 mb-8">
          Kembali ke halaman quiz untuk melanjutkan
        </p>

        <button
          onClick={onReturn}
          className="px-8 py-4 bg-white text-red-600 font-bold text-xl rounded-lg hover:bg-red-50 transition-colors shadow-2xl"
        >
          Kembali ke Quiz
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.95;
          }
        }
      `}</style>
    </div>
  );
}
