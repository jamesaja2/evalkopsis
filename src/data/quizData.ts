import { QuizQuestion, ImageChallenge } from '../types';

// Pertanyaan Captcha baru untuk semua tim
const captchaQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Siapa nama anak bu Siska?',
    type: 'text',
    answer: ['angel'],
    hints: [
      'Inisial A',
      'Namanya 5 Huruf',
      'Namanya sama seperti OSIS INTI dan KOPSIS'
    ],
  },
  {
    id: 'q2',
    question: 'Nama besar Valentine 3 tahun lalu?',
    type: 'text',
    answer: ['eternity'],
    hints: [
      'Waktu yang tak terbatas atau keadaan yang abadi, tanpa awal dan akhir'
    ],
  },
  {
    id: 'q3',
    question: 'Siapa Kadep 2 tahun lalu?',
    type: 'text',
    answer: ['mecas'],
    hints: [
      'TIDAK ADA HINT -1 MENIT'
    ],
  },
  {
    id: 'q4',
    question: 'Apa jabatan yang dimiliki Warren tahun lalu?',
    type: 'text',
    answer: ['bendahara'],
    hints: [
      'TIDAK ADA HINT -1 MENIT'
    ],
  },
  {
    id: 'q5',
    question: 'Harga bolpoin Kokoro di Kopsis?',
    type: 'text',
    answer: ['8 ribu', '8ribu', '8000', '8'],
    hints: [
      'TIDAK ADA HINT -1 MENIT'
    ],
  },
  {
    id: 'q6',
    question: 'Apa nama proker yang baru dibuat tahun lalu bersamaan dengan Valentine?',
    type: 'text',
    answer: ['board games', 'boardgames'],
    hints: [
      'UNO'
    ],
  },
  {
    id: 'q7',
    question: 'Siapa pemeran utama di video promosi organisasi Kopsis tahun ini?',
    type: 'text',
    answer: ['marc'],
    hints: [
      'Timothy Ronald → Model'
    ],
  },
];

export const quizData: Record<string, QuizQuestion[]> = {
  A: captchaQuestions,
  B: captchaQuestions,
  C: captchaQuestions,
  D: captchaQuestions,
};

export const imageChallenges: Record<string, ImageChallenge> = {
  A: {
    id: 'img-a',
    imageUrl: 'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=600',
    prompt: 'Pilih SEMUA orang yang memakai kacamata',
    areas: [
      { id: 'p1', x: 50, y: 60, width: 120, height: 180 },
      { id: 'p2', x: 200, y: 70, width: 110, height: 170 },
      { id: 'p3', x: 340, y: 65, width: 115, height: 175 },
    ],
    correctAreas: ['p1', 'p3'],
  },
  B: {
    id: 'img-b',
    imageUrl: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
    prompt: 'Pilih orang yang memegang laptop',
    areas: [
      { id: 'p1', x: 80, y: 100, width: 140, height: 200 },
      { id: 'p2', x: 280, y: 90, width: 130, height: 210 },
    ],
    correctAreas: ['p1'],
  },
  C: {
    id: 'img-c',
    imageUrl: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=600',
    prompt: 'Pilih SEMUA orang yang tersenyum',
    areas: [
      { id: 'p1', x: 60, y: 80, width: 100, height: 160 },
      { id: 'p2', x: 190, y: 75, width: 110, height: 165 },
      { id: 'p3', x: 330, y: 85, width: 105, height: 155 },
      { id: 'p4', x: 460, y: 90, width: 100, height: 150 },
    ],
    correctAreas: ['p1', 'p2', 'p4'],
  },
  D: {
    id: 'img-d',
    imageUrl: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600',
    prompt: 'Pilih orang yang memakai topi',
    areas: [
      { id: 'p1', x: 100, y: 70, width: 130, height: 190 },
      { id: 'p2', x: 270, y: 80, width: 125, height: 185 },
      { id: 'p3', x: 430, y: 75, width: 120, height: 195 },
    ],
    correctAreas: ['p2'],
  },
};
