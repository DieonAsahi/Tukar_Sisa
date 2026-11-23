import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Periksa apakah Supabase dikonfigurasi dengan URL & Key asli (bukan placeholder)
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

/**
 * Konversi Data URL (Base64) hasil olah Canvas menjadi Blob
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const binaryStr = atob(parts[1]);
  const len = binaryStr.length;
  const u8arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    u8arr[i] = binaryStr.charCodeAt(i);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Unggah gambar (Blob atau Data URL) ke Supabase Storage bucket 'waste-images'
 * @param fileOrDataUrl Blob atau Base64 data URL gambar yang sudah dibersihkan EXIF di Canvas
 * @param path Lokasi penyimpanan, misal: 'listings/<userId>/<filename>.jpg' atau 'reports/<userId>/<filename>.jpg'
 */
export async function uploadImageToWasteStorage(
  fileOrDataUrl: Blob | string,
  path: string
): Promise<{ url: string | null; error: Error | null }> {
  if (!supabase) {
    return { url: null, error: new Error('Supabase client belum dikonfigurasi.') };
  }
  try {
    const blob = typeof fileOrDataUrl === 'string'
      ? (fileOrDataUrl.startsWith('data:') ? dataUrlToBlob(fileOrDataUrl) : null)
      : fileOrDataUrl;

    if (!blob) {
      // Jika string sudah merupakan URL publik
      if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('http')) {
        return { url: fileOrDataUrl, error: null };
      }
      return { url: null, error: new Error('Format gambar tidak valid.') };
    }

    const { data, error } = await supabase.storage.from('waste-images').upload(path, blob, {
      contentType: blob.type || 'image/jpeg',
      upsert: true
    });
    if (error) {
      return { url: null, error: new Error(error.message) };
    }
    const { data: publicUrlData } = supabase.storage.from('waste-images').getPublicUrl(path);
    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err };
  }
}
