import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { ImageChallenge } from '../types';
import { validateImageSelection } from '../utils/validation';

interface ImageSelectionProps {
  challenge: ImageChallenge;
  groupId: string;
  onComplete: () => void;
}

export default function ImageSelection({
  challenge,
  groupId,
  onComplete,
}: ImageSelectionProps) {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  const toggleArea = (areaId: string) => {
    if (feedback === 'correct') return;

    setSelectedAreas((prev) =>
      prev.includes(areaId)
        ? prev.filter((id) => id !== areaId)
        : [...prev, areaId]
    );
    setFeedback(null);
  };

  const handleSubmit = () => {
    if (selectedAreas.length === 0) return;

    const isCorrect = validateImageSelection(selectedAreas, challenge.correctAreas);

    if (isCorrect) {
      setFeedback('correct');
      setTimeout(() => {
        onComplete();
      }, 1500);
    } else {
      setFeedback('incorrect');
      setTimeout(() => {
        setFeedback(null);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Tim {groupId}</span>
            <span className="text-sm font-medium text-slate-600">Step 2 / 2</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full w-full" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Tantangan Visual
          </h2>
          <p className="text-lg text-slate-600 mb-6">{challenge.prompt}</p>

          <div className="relative inline-block max-w-full">
            <img
              src={challenge.imageUrl}
              alt="Challenge"
              className="w-full h-auto rounded-lg"
              draggable={false}
            />

            {challenge.areas.map((area) => {
              const isSelected = selectedAreas.includes(area.id);
              const isHovered = hoveredArea === area.id;

              return (
                <button
                  key={area.id}
                  onClick={() => toggleArea(area.id)}
                  onMouseEnter={() => setHoveredArea(area.id)}
                  onMouseLeave={() => setHoveredArea(null)}
                  className="absolute cursor-pointer transition-all"
                  style={{
                    left: `${(area.x / 600) * 100}%`,
                    top: `${(area.y / 400) * 100}%`,
                    width: `${(area.width / 600) * 100}%`,
                    height: `${(area.height / 400) * 100}%`,
                    backgroundColor: isSelected
                      ? 'rgba(59, 130, 246, 0.3)'
                      : isHovered
                      ? 'rgba(59, 130, 246, 0.15)'
                      : 'transparent',
                    border: isSelected
                      ? '3px solid rgb(59, 130, 246)'
                      : isHovered
                      ? '2px solid rgb(59, 130, 246)'
                      : '2px solid transparent',
                    borderRadius: '8px',
                  }}
                  aria-label={`Area ${area.id}`}
                />
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              {selectedAreas.length > 0 ? (
                <span>
                  {selectedAreas.length} area terpilih
                </span>
              ) : (
                <span>Klik area di gambar untuk memilih</span>
              )}
            </div>
          </div>

          {feedback && (
            <div
              className={`mt-4 flex items-center gap-3 p-4 rounded-lg ${
                feedback === 'correct'
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {feedback === 'correct' ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Sempurna! Pilihan yang tepat.</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">
                    Belum tepat. Coba perhatikan lagi.
                  </span>
                </>
              )}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={selectedAreas.length === 0 || feedback === 'correct'}
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            Verifikasi Pilihan
          </button>
        </div>
      </div>
    </div>
  );
}
