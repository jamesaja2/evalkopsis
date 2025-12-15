import { useState } from 'react';
import { CheckCircle2, Lock, RotateCw } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

interface ReCaptchaScreenProps {
  onVerify: () => void;
}

export default function ReCaptchaScreen({ onVerify }: ReCaptchaScreenProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = () => {
    setIsVerifying(true);
    
    // Simulasi proses verifikasi
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      
      // Setelah verified, lanjut ke step berikutnya
      setTimeout(() => {
        onVerify();
      }, 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header dengan logo dan text */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-6 h-6" />
              <span className="font-semibold text-sm">reCAPTCHA</span>
            </div>
            <p className="text-xs opacity-90">Keamanan Organisasi Kopsis</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Verifikasi Dirimu Dulu
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Sebelum mengikuti challenge, kami perlu memastikan kamu benar-benar bagian dari Kopsis. Jawab beberapa pertanyaan tentang organisasi kita.
              </p>
            </div>

            {/* Verification Box */}
            <div className={`border-2 border-slate-300 rounded-lg p-6 mb-6 transition-all duration-500 ${
              isVerified 
                ? 'bg-green-50 border-green-400' 
                : 'bg-slate-50 hover:border-blue-400'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isVerified 
                    ? 'bg-green-500' 
                    : isVerifying
                    ? 'bg-blue-500 animate-pulse'
                    : 'bg-slate-300'
                }`}>
                  {isVerified ? (
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  ) : isVerifying ? (
                    <RotateCw className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {isVerified ? 'Verifikasi Berhasil!' : isVerifying ? 'Memverifikasi...' : 'Klik untuk Memulai'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {isVerified 
                      ? 'Kamu teridentifikasi sebagai anggota Kopsis'
                      : isVerifying
                      ? 'Memproses jawaban kamu...'
                      : 'Selesaikan challenge untuk lanjut'}
                  </p>
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={handleVerify}
              disabled={isVerified}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                isVerified
                  ? 'bg-green-500 text-white cursor-default'
                  : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/30'
              }`}
            >
              {isVerified ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Tersertifikasi
                </>
              ) : (
                <>
                  Mulai Verifikasi
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Security Text */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-500 text-center leading-relaxed">
                🔒 Sistem keamanan Kopsis. Data kamu aman dan tidak akan dibagikan.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <div className="text-center mt-6">
          <p className="text-slate-400 text-xs">
            Sistem verifikasi Organisasi Kopsis
          </p>
        </div>
      </div>
    </div>
  );
}
