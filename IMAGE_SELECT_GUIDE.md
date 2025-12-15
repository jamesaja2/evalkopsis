# Dokumentasi Implementasi Pertanyaan Image-Select

## Konsep
Untuk pertanyaan yang menampilkan gambar dan meminta user memilih orang dari beberapa opsi, gunakan tipe `image-select`.

## Struktur Data

Tambahkan ke `quizData` dengan format berikut:

```typescript
{
  id: 'q-unique-id',
  question: 'Siapa pemeran utama di video promosi organisasi Kopsis tahun ini?',
  type: 'image-select',
  people: [
    {
      id: 'person1',
      name: 'Marc',
      image: 'https://link-ke-foto-marc.jpg',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
    {
      id: 'person2',
      name: 'Nama Orang 2',
      image: 'https://link-ke-foto.jpg',
      x: 100,
      y: 0,
      width: 100,
      height: 100,
    },
    // ... orang lainnya
  ],
  correctPersonId: 'person1', // ID orang yang benar
  answer: 'marc', // Untuk validasi fallback
}
```

## Atribut Penjelasan

| Atribut | Tipe | Penjelasan |
|---------|------|-----------|
| `id` | string | Identifier unik untuk pertanyaan |
| `question` | string | Pertanyaan yang akan ditampilkan |
| `type` | 'image-select' | Tipe pertanyaan |
| `people` | array | Array berisi data orang-orang pilihan |
| `people[].id` | string | Identifier unik untuk orang |
| `people[].name` | string | Nama orang yang ditampilkan |
| `people[].image` | string | URL gambar orang |
| `people[].x` | number | Posisi X (tidak digunakan untuk image-select, bisa 0) |
| `people[].y` | number | Posisi Y (tidak digunakan untuk image-select, bisa 0) |
| `people[].width` | number | Lebar area (tidak digunakan untuk image-select, bisa 100) |
| `people[].height` | number | Tinggi area (tidak digunakan untuk image-select, bisa 100) |
| `correctPersonId` | string | ID orang yang merupakan jawaban benar |
| `answer` | string | Jawaban teks (untuk validasi tambahan) |

## Contoh Implementasi Lengkap

Tambahkan ke file `src/data/quizData.ts`:

```typescript
// Di dalam captchaQuestions array atau langsung di quizData
{
  id: 'q-video-promo',
  question: 'Siapa pemeran utama di video promosi organisasi Kopsis tahun ini?',
  type: 'image-select',
  people: [
    {
      id: 'person-marc',
      name: 'Marc',
      image: 'https://images.pexels.com/photos/...',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
    {
      id: 'person-valentine',
      name: 'Valentine',
      image: 'https://images.pexels.com/photos/...',
      x: 100,
      y: 0,
      width: 100,
      height: 100,
    },
    {
      id: 'person-lainnya',
      name: 'Orang Lain',
      image: 'https://images.pexels.com/photos/...',
      x: 200,
      y: 0,
      width: 100,
      height: 100,
    },
  ],
  correctPersonId: 'person-marc',
  answer: 'marc',
}
```

## Tips

1. **URL Gambar**: Gunakan URL gambar yang dapat diakses publik
2. **Nama Orang**: Pastikan nama sesuai dengan identitas real
3. **correctPersonId**: Harus match dengan salah satu `people[].id`
4. **Responsive**: Komponen sudah responsive dengan grid 2 kolom di mobile dan 3 kolom di desktop
5. **Case-insensitive**: Validasi jawaban tidak case-sensitive

## Testing Lokal

Untuk menguji di lokal sebelum production:
1. Pastikan URL gambar dapat diakses
2. Buka browser dan navigasi ke aplikasi
3. Verifikasi reCaptcha screen
4. Pilih tim
5. Jawab pertanyaan image-select dengan memilih orang yang benar

## Cara Menambah ke Semua Tim

Karena `captchaQuestions` digunakan untuk semua tim (A, B, C, D), pertanyaan image-select akan otomatis tersedia untuk semua tim.

Jika ingin pertanyaan berbeda per tim, ubah struktur `quizData`:

```typescript
export const quizData: Record<string, QuizQuestion[]> = {
  A: [...captchaQuestions, ...pertanyaanTambahan],
  B: [pertanyaanYangBerbeda],
  // dst
};
```
