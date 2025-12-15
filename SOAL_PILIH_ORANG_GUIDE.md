# GUIDE: Soal Pilih Orang dari Gambar Besar

Untuk soal seperti "Klik orang yang memakai kacamata di foto ini", ada 2 pendekatan:

## Pendekatan 1: Menggunakan komponen ImageSelection yang sudah ada

Komponen `ImageSelection` di `src/components/ImageSelection.tsx` sudah dirancang untuk ini. Gunakan ini jika ingin soal pilih area pada gambar besar.

**File**: `src/data/quizData.ts`

```typescript
export const imageChallenges: Record<string, ImageChallenge> = {
  A: {
    id: 'img-a',
    imageUrl: 'https://gambar-kopsis-dengan-banyak-orang.jpg',
    prompt: 'Klik SEMUA orang yang memakai kacamata',
    areas: [
      { id: 'p1', x: 100, y: 150, width: 80, height: 120 },
      { id: 'p2', x: 250, y: 140, width: 85, height: 125 },
      { id: 'p3', x: 400, y: 160, width: 75, height: 115 },
    ],
    correctAreas: ['p1', 'p3'], // Orang 1 dan 3 yang pakai kacamata
  },
  // ...
};
```

**Kelebihan**:
- Sudah terintegrasi di flow (setelah quiz)
- User click pada area gambar
- Support multiple selection

**Kekurangan**:
- Perlu coordinate calibration
- Tidak ideal jika orang terpisah jelas

---

## Pendekatan 2: Soal individual dengan card orang

Gunakan `type: 'image-select'` di Quiz untuk menampilkan orang-orang sebagai card terpisah.

**Cocok untuk**:
- "Siapa pemeran utama di video promosi?"
- "Siapa yang menjadi MC acara tahun lalu?"
- Soal yang jawabannya 1 orang saja

**Contoh**:

```typescript
{
  id: 'q-mc-acara',
  question: 'Siapa yang menjadi MC acara Kopsis tahun lalu?',
  type: 'image-select',
  people: [
    {
      id: 'person-valentine',
      name: 'Valentine',
      image: 'https://...',
      x: 0, y: 0, width: 100, height: 100,
    },
    {
      id: 'person-marc',
      name: 'Marc',
      image: 'https://...',
      x: 100, y: 0, width: 100, height: 100,
    },
    {
      id: 'person-mecas',
      name: 'Mecas',
      image: 'https://...',
      x: 200, y: 0, width: 100, height: 100,
    },
  ],
  correctPersonId: 'person-valentine',
  answer: 'valentine',
}
```

---

## Pendekatan 3: Custom Image-Click Question (Advanced)

Jika Anda ingin "Klik orang yang memakai kacamata" tapi dengan gambar tunggal dan multiple clickable areas yang berbeda, buat komponen custom:

**File baru**: `src/components/ImageSelectFromPicture.tsx`

```typescript
import { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface ImageSelectFromPictureProps {
  question: string;
  imageUrl: string;
  areas: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  correctAreaIds: string[];
  onConfirm: (selectedIds: string[]) => void;
  onFeedback?: (feedback: 'correct' | 'incorrect') => void;
}

export default function ImageSelectFromPicture({
  question,
  imageUrl,
  areas,
  correctAreaIds,
  onConfirm,
  onFeedback,
}: ImageSelectFromPictureProps) {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const handleAreaClick = (areaId: string) => {
    setSelectedAreas(prev =>
      prev.includes(areaId)
        ? prev.filter(id => id !== areaId)
        : [...prev, areaId]
    );
  };

  const handleSubmit = () => {
    const isCorrect =
      selectedAreas.sort().join(',') === correctAreaIds.sort().join(',');

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    onFeedback?.(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setTimeout(() => onConfirm(selectedAreas), 1500);
    } else {
      setTimeout(() => {
        setFeedback(null);
        setSelectedAreas([]);
      }, 1500);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white">{question}</h3>

      {/* Image Container dengan click areas */}
      <div className="relative w-full bg-slate-700 rounded-lg overflow-hidden">
        <img src={imageUrl} alt="Question" className="w-full" />

        {/* Overlay areas */}
        <svg className="absolute inset-0 w-full h-full cursor-pointer">
          {areas.map(area => (
            <rect
              key={area.id}
              x={area.x}
              y={area.y}
              width={area.width}
              height={area.height}
              fill={selectedAreas.includes(area.id) ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0)'}
              stroke={selectedAreas.includes(area.id) ? '#3B82F6' : 'transparent'}
              strokeWidth="2"
              rx="8"
              onClick={() => handleAreaClick(area.id)}
              className="hover:fill-blue-500/20 hover:stroke-blue-500 transition-all"
              style={{ cursor: 'pointer' }}
            />
          ))}
        </svg>
      </div>

      {/* Info text */}
      <p className="text-slate-300 text-sm">
        Kamu memilih {selectedAreas.length} area
        {correctAreaIds.length > 1 && ` (diperlukan ${correctAreaIds.length})`}
      </p>

      {/* Feedback */}
      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg ${
            feedback === 'correct'
              ? 'bg-green-500/20 text-green-200 border border-green-500'
              : 'bg-red-500/20 text-red-200 border border-red-500'
          }`}
        >
          {feedback === 'correct' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span>
            {feedback === 'correct'
              ? 'Benar! Kamu memilih orang yang tepat.'
              : 'Salah. Coba lihat lagi dengan cermat.'}
          </span>
        </div>
      )}

      {/* Button */}
      <button
        onClick={handleSubmit}
        disabled={selectedAreas.length === 0 || feedback === 'correct'}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
      >
        Konfirmasi
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
```

Kemudian di `quizData.ts`:

```typescript
{
  id: 'q-kacamata',
  question: 'Klik SEMUA orang yang memakai kacamata',
  type: 'image-picture-select', // Custom type
  imageUrl: 'https://gambar-kopsis.jpg',
  areas: [
    { id: 'p1', x: 50, y: 100, width: 100, height: 150 },
    { id: 'p2', x: 200, y: 80, width: 100, height: 150 },
    { id: 'p3', x: 350, y: 110, width: 100, height: 150 },
  ],
  correctPersonId: 'p1,p3', // atau array ['p1', 'p3']
  answer: 'p1,p3',
}
```

---

## Rekomendasi

- **Untuk soal "Siapa pemeran utama"**: Gunakan Pendekatan 2 (image-select dengan cards)
- **Untuk soal "Klik orang dengan kacamata"**: Gunakan Pendekatan 1 (ImageSelection yang ada) atau 3 (custom)
- **Untuk multiple selection**: Gunakan ImageSelection atau custom

---

## Cara Mendapat Coordinate untuk Areas

Jika menggunakan Pendekatan 1 atau 3, Anda perlu mendapat coordinate area orang:

1. Buka gambar di browser
2. Gunakan browser DevTools (F12)
3. Inspect element gambar
4. Lihat ukuran gambar
5. Dengan manual atau tools, dapatkan:
   - `x`: posisi horizontal dari kiri (pixel)
   - `y`: posisi vertical dari atas (pixel)
   - `width`: lebar area orang
   - `height`: tinggi area orang

**Tool online** yang bisa membantu:
- ImageMapResizer
- atau manual dengan photoshop/figma

---

Pilih pendekatan yang paling sesuai dengan jenis soal Anda! 🎯
