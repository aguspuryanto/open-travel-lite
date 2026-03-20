import React, { useState, useEffect } from 'react';
import { useAppContext, Settings as SettingsType } from '../../context/AppContext';
import { Save, Sparkles } from 'lucide-react';
import { generateSEOKeywords } from '../../services/geminiService';

export default function Settings() {
  const { settings, updateSettings } = useAppContext();
  const [formData, setFormData] = useState<SettingsType>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleGenerateSEO = async () => {
    if (!formData.siteName || !formData.description) {
      alert('Masukkan Nama Website dan Deskripsi Singkat terlebih dahulu.');
      return;
    }
    setIsGeneratingSEO(true);
    try {
      const keywords = await generateSEOKeywords(formData.siteName, formData.description);
      setFormData(prev => ({ ...prev, seoKeywords: keywords }));
    } catch (error) {
      alert('Gagal menghasilkan keywords SEO.');
    } finally {
      setIsGeneratingSEO(false);
    }
  };

  const handleWhatsappChange = (index: number, value: string) => {
    const newNumbers = [...formData.whatsappNumbers];
    newNumbers[index] = value;
    setFormData({ ...formData, whatsappNumbers: newNumbers });
  };

  const addWhatsappNumber = () => {
    setFormData({ ...formData, whatsappNumbers: [...formData.whatsappNumbers, ''] });
  };

  const removeWhatsappNumber = (index: number) => {
    const newNumbers = formData.whatsappNumbers.filter((_, i) => i !== index);
    setFormData({ ...formData, whatsappNumbers: newNumbers });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Website</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSave} className="p-6 space-y-6">
          
          {/* General Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Umum</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Website</label>
                <input 
                  type="text" 
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.siteName}
                  onChange={e => setFormData({...formData, siteName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tagline (Hero Section)</label>
                <input 
                  type="text" 
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.tagline}
                  onChange={e => setFormData({...formData, tagline: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Deskripsi Singkat</label>
                <textarea 
                  required
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Contact Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Kontak & Lokasi</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor WhatsApp CS</label>
                {formData.whatsappNumbers.map((num, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      placeholder="+6281234567890"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={num}
                      onChange={e => handleWhatsappChange(idx, e.target.value)}
                    />
                    {formData.whatsappNumbers.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeWhatsappNumber(idx)}
                        className="bg-red-100 text-red-600 px-3 py-2 rounded-md hover:bg-red-200"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={addWhatsappNumber}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  + Tambah Nomor WhatsApp
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Google Maps Iframe</label>
                <textarea 
                  rows={4}
                  placeholder='<iframe src="..."></iframe>'
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono text-xs"
                  value={formData.googleMapsIframe}
                  onChange={e => setFormData({...formData, googleMapsIframe: e.target.value})}
                />
                <p className="mt-1 text-xs text-gray-500">Paste kode embed iframe dari Google Maps.</p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* SEO Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO (Search Engine Optimization)</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Keywords (Pisahkan dengan koma)</label>
                  <button 
                    type="button" 
                    onClick={handleGenerateSEO}
                    disabled={isGeneratingSEO || !formData.siteName || !formData.description}
                    className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 disabled:opacity-50"
                  >
                    <Sparkles size={14} />
                    {isGeneratingSEO ? 'Menghasilkan...' : 'Generate AI'}
                  </button>
                </div>
                <input 
                  type="text" 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.seoKeywords}
                  onChange={e => setFormData({...formData, seoKeywords: e.target.value})}
                  placeholder="rental mobil, travel jakarta bandung, sewa hiace"
                />
              </div>
            </div>
          </div>

          <div className="pt-5 flex items-center justify-end gap-4">
            {isSaved && <span className="text-green-600 text-sm font-medium">Pengaturan berhasil disimpan!</span>}
            <button
              type="submit"
              className="inline-flex justify-center items-center gap-2 rounded-md border border-transparent shadow-sm px-6 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              <Save size={18} /> Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
