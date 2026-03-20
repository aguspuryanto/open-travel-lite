import { useAppContext } from '../../context/AppContext';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function Blog() {
  const { articles } = useAppContext();

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Blog & Artikel</h1>
          <p className="mt-4 text-xl text-gray-500">Temukan tips perjalanan, cerita menarik, dan berita terbaru dari kami.</p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Belum ada artikel yang dipublikasikan saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <article key={article.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{format(new Date(article.date), 'dd MMM yyyy', { locale: id })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>Admin</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 line-clamp-3 mb-6 flex-grow">
                    {article.content}
                  </p>
                  
                  <button className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors mt-auto">
                    Baca Selengkapnya <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
