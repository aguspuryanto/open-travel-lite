import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateArticleContent = async (title: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tuliskan artikel blog yang menarik dan informatif untuk website travel dan rental mobil dengan judul: "${title}". Artikel harus ditulis dalam bahasa Indonesia, terdiri dari 3-4 paragraf, dan memiliki tone yang profesional namun ramah.`,
    });
    return response.text || '';
  } catch (error) {
    console.error('Error generating article content:', error);
    throw new Error('Gagal menghasilkan konten artikel dengan AI.');
  }
};

export const generateDestinationDescription = async (name: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Buatkan deskripsi singkat dan menarik untuk destinasi wisata "${name}" di Indonesia. Deskripsi ini akan digunakan di website travel. Tulis dalam bahasa Indonesia, sekitar 2-3 kalimat yang menggugah minat wisatawan.`,
    });
    return response.text || '';
  } catch (error) {
    console.error('Error generating destination description:', error);
    throw new Error('Gagal menghasilkan deskripsi destinasi dengan AI.');
  }
};

export const generateVehicleTerms = async (vehicleName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Buatkan daftar syarat dan ketentuan sewa untuk kendaraan "${vehicleName}". Berikan 3-5 poin singkat dan jelas dalam bahasa Indonesia, seperti batas waktu sewa, denda keterlambatan, dan kebijakan bahan bakar.`,
    });
    return response.text || '';
  } catch (error) {
    console.error('Error generating vehicle terms:', error);
    throw new Error('Gagal menghasilkan syarat & ketentuan kendaraan dengan AI.');
  }
};

export const generateSEOKeywords = async (siteName: string, description: string): Promise<string> => {
  try {
    const prompt = `Buatkan daftar 10-15 SEO keywords yang relevan untuk website travel dan rental mobil berikut:
    Nama Website: ${siteName}
    Deskripsi: ${description}
    
    Kembalikan hanya daftar keywords yang dipisahkan dengan koma, tanpa penomoran atau teks tambahan lainnya. Contoh: rental mobil, travel jakarta bandung, sewa hiace murah`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || '';
  } catch (error) {
    console.error('Error generating SEO keywords:', error);
    throw new Error('Gagal menghasilkan keywords SEO dengan AI.');
  }
};
