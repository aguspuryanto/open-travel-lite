import { useAppContext } from '../../context/AppContext';
import { MapPin } from 'lucide-react';

export default function Destinations() {
  const { destinations } = useAppContext();

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Destinasi & Paket Wisata</h1>
          <p className="mt-4 text-xl text-gray-500">Jelajahi keindahan alam dan budaya bersama layanan travel kami.</p>
        </div>

        {destinations.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Belum ada paket wisata yang tersedia saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map(dest => (
              <div key={dest.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={dest.image} 
                    alt={dest.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {dest.price && dest.price > 0 && (
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                      <span className="text-sm text-gray-500 block">Mulai dari</span>
                      <span className="text-lg font-bold text-indigo-600">Rp {dest.price.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <MapPin className="text-indigo-500" size={20} /> {dest.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3">{dest.description}</p>
                  <button className="mt-6 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold py-2 px-4 rounded-lg transition-colors">
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
