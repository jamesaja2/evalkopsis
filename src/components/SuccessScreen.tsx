import { useEffect, useState } from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';

interface SuccessScreenProps {
  groupId: string;
  redirectUrl: string;
}

export default function SuccessScreen({
  groupId,
  redirectUrl,
}: SuccessScreenProps) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = redirectUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [redirectUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 border border-slate-100">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Luar Biasa!
          </h1>

          <p className="text-lg text-slate-600 mb-2">
            Tim {groupId} berhasil menyelesaikan semua tantangan
          </p>

          <p className="text-sm text-slate-500 mb-8">
            Kamu cukup human untuk melanjutkan
          </p>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {countdown}
            </div>
            <div className="text-sm text-slate-600 flex items-center justify-center gap-2">
              <span>Redirecting you because you passed</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Human Enough™ Mini Quiz Challenge
          </div>
        </div>
      </div>
    </div>
  );
}
