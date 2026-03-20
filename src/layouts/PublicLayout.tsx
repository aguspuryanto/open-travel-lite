import { Outlet, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Phone, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function PublicLayout() {
  const { settings } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-indigo-600">{settings.siteName}</span>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8 items-center">
              <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Beranda</Link>
              <Link to="/armada" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Armada</Link>
              <Link to="/destinasi" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Destinasi</Link>
              <Link to="/blog" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Blog</Link>
              <Link to="/galeri" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Galeri</Link>
              <a 
                href={`https://wa.me/${settings.whatsappNumbers[0]?.replace('+', '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Phone size={16} /> Hubungi Kami
              </a>
            </nav>
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Beranda</Link>
              <Link to="/armada" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Armada</Link>
              <Link to="/destinasi" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Destinasi</Link>
              <Link to="/blog" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Blog</Link>
              <Link to="/galeri" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Galeri</Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-indigo-400 mb-4">{settings.siteName}</h3>
              <p className="text-gray-400">{settings.description}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Tautan Cepat</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/armada" className="hover:text-white transition-colors">Armada Kami</Link></li>
                <li><Link to="/destinasi" className="hover:text-white transition-colors">Paket Wisata</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Artikel & Tips</Link></li>
                <li><Link to="/admin" className="hover:text-white transition-colors">Admin Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Hubungi Kami</h4>
              <ul className="space-y-2 text-gray-400">
                {settings.whatsappNumbers.map((num, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Phone size={16} /> {num}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
