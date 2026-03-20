import { useAppContext } from '../../context/AppContext';
import { Users, Settings, Fuel, Calendar } from 'lucide-react';

export default function Fleet() {
  const { vehicles } = useAppContext();

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Armada Kami</h1>
          <p className="mt-4 text-xl text-gray-500">Pilih kendaraan yang paling sesuai dengan kebutuhan perjalanan Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map(vehicle => (
            <div key={vehicle.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-56">
                <img 
                  src={vehicle.images[0]} 
                  alt={vehicle.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm
                    ${vehicle.status === 'Available' ? 'bg-green-500 text-white' : 
                      vehicle.status === 'Rented' ? 'bg-yellow-500 text-white' : 
                      'bg-red-500 text-white'}`}>
                    {vehicle.status === 'Available' ? 'Tersedia' : vehicle.status === 'Rented' ? 'Disewa' : 'Maintenance'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{vehicle.name}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={18} className="text-indigo-500" />
                    <span className="text-sm">{vehicle.capacity} Kursi</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Settings size={18} className="text-indigo-500" />
                    <span className="text-sm">{vehicle.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Fuel size={18} className="text-indigo-500" />
                    <span className="text-sm">{vehicle.fuel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={18} className="text-indigo-500" />
                    <span className="text-sm">Tahun {vehicle.year}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Fasilitas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.facilities.length > 0 ? vehicle.facilities.map((facility, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-md">
                        {facility}
                      </span>
                    )) : (
                      <span className="text-sm text-gray-500">Standar</span>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-500 italic">{vehicle.terms}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
