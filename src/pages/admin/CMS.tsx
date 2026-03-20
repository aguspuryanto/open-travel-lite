import React, { useState } from 'react';
import { useAppContext, Destination, Article, GalleryImage } from '../../context/AppContext';
import { Plus, Edit, Trash2, X, Image as ImageIcon, FileText, Camera, Sparkles } from 'lucide-react';
import { generateArticleContent, generateDestinationDescription } from '../../services/geminiService';
import ConfirmModal from '../../components/ConfirmModal';

export default function CMS() {
  const { 
    destinations, addDestination, updateDestination, deleteDestination, 
    articles, addArticle, updateArticle, deleteArticle,
    gallery, addGalleryImage, updateGalleryImage, deleteGalleryImage
  } = useAppContext();
  const [activeTab, setActiveTab] = useState<'destinations' | 'articles' | 'gallery'>('destinations');
  
  // Modal states
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingGalleryImage, setEditingGalleryImage] = useState<GalleryImage | null>(null);

  const [destFormData, setDestFormData] = useState<Partial<Destination>>({
    title: '', description: '', image: '', price: 0
  });
  
  const [articleFormData, setArticleFormData] = useState<Partial<Article>>({
    title: '', content: '', image: '', date: new Date().toISOString().split('T')[0]
  });

  const [galleryFormData, setGalleryFormData] = useState<Partial<GalleryImage>>({
    title: '', url: '', category: 'exterior', caption: ''
  });

  const [isGeneratingDestDesc, setIsGeneratingDestDesc] = useState(false);
  const [isGeneratingArticleContent, setIsGeneratingArticleContent] = useState(false);

  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'destination' | 'article' | 'gallery' } | null>(null);

  // Destination Handlers
  const handleGenerateDestDesc = async () => {
    if (!destFormData.title) {
      alert('Masukkan nama destinasi terlebih dahulu.');
      return;
    }
    setIsGeneratingDestDesc(true);
    try {
      const desc = await generateDestinationDescription(destFormData.title);
      setDestFormData(prev => ({ ...prev, description: desc }));
    } catch (error) {
      alert('Gagal menghasilkan deskripsi.');
    } finally {
      setIsGeneratingDestDesc(false);
    }
  };

  const handleOpenDestModal = (dest?: Destination) => {
    if (dest) {
      setEditingDest(dest);
      setDestFormData(dest);
    } else {
      setEditingDest(null);
      setDestFormData({ title: '', description: '', image: '', price: 0 });
    }
    setIsDestModalOpen(true);
  };

  const handleSaveDest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDest) {
      await updateDestination(editingDest.id, destFormData);
    } else {
      await addDestination(destFormData as Omit<Destination, 'id'>);
    }
    setIsDestModalOpen(false);
  };

  const handleDeleteDest = (id: string) => {
    setItemToDelete({ id, type: 'destination' });
  };

  // Article Handlers
  const handleGenerateArticleContent = async () => {
    if (!articleFormData.title) {
      alert('Masukkan judul artikel terlebih dahulu.');
      return;
    }
    setIsGeneratingArticleContent(true);
    try {
      const content = await generateArticleContent(articleFormData.title);
      setArticleFormData(prev => ({ ...prev, content: content }));
    } catch (error) {
      alert('Gagal menghasilkan konten artikel.');
    } finally {
      setIsGeneratingArticleContent(false);
    }
  };

  const handleOpenArticleModal = (article?: Article) => {
    if (article) {
      setEditingArticle(article);
      setArticleFormData(article);
    } else {
      setEditingArticle(null);
      setArticleFormData({ title: '', content: '', image: '', date: new Date().toISOString().split('T')[0] });
    }
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingArticle) {
      await updateArticle(editingArticle.id, articleFormData);
    } else {
      await addArticle(articleFormData as Omit<Article, 'id'>);
    }
    setIsArticleModalOpen(false);
  };

  const handleDeleteArticle = (id: string) => {
    setItemToDelete({ id, type: 'article' });
  };

  // Gallery Handlers
  const handleOpenGalleryModal = (image?: GalleryImage) => {
    if (image) {
      setEditingGalleryImage(image);
      setGalleryFormData(image);
    } else {
      setEditingGalleryImage(null);
      setGalleryFormData({ title: '', url: '', category: 'exterior', caption: '' });
    }
    setIsGalleryModalOpen(true);
  };

  const handleSaveGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGalleryImage) {
      await updateGalleryImage(editingGalleryImage.id, galleryFormData);
    } else {
      await addGalleryImage(galleryFormData as Omit<GalleryImage, 'id'>);
    }
    setIsGalleryModalOpen(false);
  };

  const handleDeleteGalleryImage = (id: string) => {
    setItemToDelete({ id, type: 'gallery' });
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'destination') {
        await deleteDestination(itemToDelete.id);
      } else if (itemToDelete.type === 'article') {
        await deleteArticle(itemToDelete.id);
      } else if (itemToDelete.type === 'gallery') {
        await deleteGalleryImage(itemToDelete.id);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Gagal menghapus item.");
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">CMS Konten</h1>
        <button 
          onClick={() => {
            if (activeTab === 'destinations') handleOpenDestModal();
            else if (activeTab === 'articles') handleOpenArticleModal();
            else handleOpenGalleryModal();
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={20} /> Tambah {
            activeTab === 'destinations' ? 'Destinasi' : 
            activeTab === 'articles' ? 'Artikel' : 'Gambar'
          }
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('destinations')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
              ${activeTab === 'destinations' 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <ImageIcon size={18} /> Destinasi & Wisata
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
              ${activeTab === 'articles' 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <FileText size={18} /> Blog & Artikel
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
              ${activeTab === 'gallery' 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <Camera size={18} /> Galeri
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {activeTab === 'destinations' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destinasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga Paket</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {destinations.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">Belum ada data destinasi.</td></tr>
                )}
                {destinations.map((dest) => (
                  <tr key={dest.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-md object-cover" src={dest.image} alt="" referrerPolicy="no-referrer" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{dest.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">{dest.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dest.price ? `Rp ${dest.price.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleOpenDestModal(dest)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteDest(dest.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artikel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.length === 0 && (
                  <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">Belum ada data artikel.</td></tr>
                )}
                {articles.map((article) => (
                  <tr key={article.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-md object-cover" src={article.image} alt="" referrerPolicy="no-referrer" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{article.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleOpenArticleModal(article)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteArticle(article.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="p-6">
            {gallery.length === 0 ? (
              <div className="text-center text-gray-500 py-8">Belum ada gambar di galeri.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {gallery.map((image) => (
                  <div key={image.id} className="group relative rounded-lg overflow-hidden shadow-sm border border-gray-200">
                    <div className="aspect-w-4 aspect-h-3">
                      <img 
                        src={image.url} 
                        alt={image.title} 
                        className="w-full h-48 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleOpenGalleryModal(image)}
                          className="p-2 bg-white rounded-full text-indigo-600 hover:bg-indigo-50"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteGalleryImage(image.id)}
                          className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="p-3 bg-white">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{image.title}</h3>
                      <p className="text-xs text-gray-500 capitalize">{image.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Destination Modal */}
      {isDestModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true"><div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsDestModalOpen(false)}></div></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{editingDest ? 'Edit Destinasi' : 'Tambah Destinasi'}</h3>
                  <button onClick={() => setIsDestModalOpen(false)} className="text-gray-400 hover:text-gray-500"><X size={24} /></button>
                </div>
                <form onSubmit={handleSaveDest}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nama Destinasi</label>
                      <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={destFormData.title} onChange={e => setDestFormData({...destFormData, title: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">URL Gambar</label>
                      <input type="url" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={destFormData.image} onChange={e => setDestFormData({...destFormData, image: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Harga Paket (Opsional)</label>
                      <input type="number" min="0" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={destFormData.price} onChange={e => setDestFormData({...destFormData, price: parseInt(e.target.value) || 0})} />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                        <button 
                          type="button" 
                          onClick={handleGenerateDestDesc}
                          disabled={isGeneratingDestDesc || !destFormData.title}
                          className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 disabled:opacity-50"
                        >
                          <Sparkles size={14} />
                          {isGeneratingDestDesc ? 'Menghasilkan...' : 'Generate AI'}
                        </button>
                      </div>
                      <textarea required rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={destFormData.description} onChange={e => setDestFormData({...destFormData, description: e.target.value})} />
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">Simpan</button>
                    <button type="button" onClick={() => setIsDestModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Batal</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Modal */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true"><div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsArticleModalOpen(false)}></div></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{editingArticle ? 'Edit Artikel' : 'Tambah Artikel'}</h3>
                  <button onClick={() => setIsArticleModalOpen(false)} className="text-gray-400 hover:text-gray-500"><X size={24} /></button>
                </div>
                <form onSubmit={handleSaveArticle}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Judul Artikel</label>
                      <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={articleFormData.title} onChange={e => setArticleFormData({...articleFormData, title: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">URL Gambar</label>
                      <input type="url" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={articleFormData.image} onChange={e => setArticleFormData({...articleFormData, image: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                      <input type="date" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={articleFormData.date} onChange={e => setArticleFormData({...articleFormData, date: e.target.value})} />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Konten</label>
                        <button 
                          type="button" 
                          onClick={handleGenerateArticleContent}
                          disabled={isGeneratingArticleContent || !articleFormData.title}
                          className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 disabled:opacity-50"
                        >
                          <Sparkles size={14} />
                          {isGeneratingArticleContent ? 'Menghasilkan...' : 'Generate AI'}
                        </button>
                      </div>
                      <textarea required rows={6} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={articleFormData.content} onChange={e => setArticleFormData({...articleFormData, content: e.target.value})} />
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">Simpan</button>
                    <button type="button" onClick={() => setIsArticleModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Batal</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true"><div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsGalleryModalOpen(false)}></div></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{editingGalleryImage ? 'Edit Gambar' : 'Tambah Gambar'}</h3>
                  <button onClick={() => setIsGalleryModalOpen(false)} className="text-gray-400 hover:text-gray-500"><X size={24} /></button>
                </div>
                <form onSubmit={handleSaveGalleryImage}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Judul Gambar</label>
                      <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={galleryFormData.title} onChange={e => setGalleryFormData({...galleryFormData, title: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">URL Gambar</label>
                      <input type="url" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={galleryFormData.url} onChange={e => setGalleryFormData({...galleryFormData, url: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Kategori</label>
                      <select required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={galleryFormData.category} onChange={e => setGalleryFormData({...galleryFormData, category: e.target.value as any})}>
                        <option value="exterior">Eksterior</option>
                        <option value="interior">Interior</option>
                        <option value="facility">Fasilitas</option>
                        <option value="activity">Aktivitas</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Caption</label>
                      <textarea required rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={galleryFormData.caption} onChange={e => setGalleryFormData({...galleryFormData, caption: e.target.value})} />
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">Simpan</button>
                    <button type="button" onClick={() => setIsGalleryModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Batal</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!itemToDelete}
        title={
          itemToDelete?.type === 'destination' ? 'Hapus Destinasi' :
          itemToDelete?.type === 'article' ? 'Hapus Artikel' :
          'Hapus Gambar'
        }
        message={
          itemToDelete?.type === 'destination' ? 'Apakah Anda yakin ingin menghapus destinasi ini? Tindakan ini tidak dapat dibatalkan.' :
          itemToDelete?.type === 'article' ? 'Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.' :
          'Apakah Anda yakin ingin menghapus gambar ini? Tindakan ini tidak dapat dibatalkan.'
        }
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
