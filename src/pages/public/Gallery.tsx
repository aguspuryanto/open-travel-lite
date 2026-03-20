import { useAppContext } from '../../context/AppContext';

export default function Gallery() {
  const { gallery } = useAppContext();

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Galeri Perjalanan</h1>
          <p className="mt-4 text-xl text-gray-500">Momen-momen indah bersama pelanggan setia kami.</p>
        </div>

        {gallery.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Belum ada foto galeri yang ditambahkan.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {gallery.map(image => (
              <div key={image.id} className="break-inside-avoid rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative">
                <img 
                  src={image.url} 
                  alt={image.title} 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 w-full">
                    <p className="text-white font-medium truncate">{image.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
