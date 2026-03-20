import { useAppContext } from '../../context/AppContext';
import { useState, useMemo } from 'react';
import { Search, MapPin, Calendar, Car } from 'lucide-react';

export default function Home() {
  const { settings, vehicles, routePrices, destinations } = useAppContext();
  
  // Price Check State
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [duration, setDuration] = useState(1);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const origins = useMemo(() => Array.from(new Set(routePrices.map(r => r.origin))), [routePrices]);
  const dests = useMemo(() => Array.from(new Set(routePrices.map(r => r.destination))), [routePrices]);

  const handleCheckPrice = () => {
    const route = routePrices.find(r => 
      r.vehicleId === selectedVehicle && 
      r.origin === selectedOrigin && 
      r.destination === selectedDestination
    );
    if (route) {
      setEstimatedPrice(route.price * duration);
    } else {
      setEstimatedPrice(-1); // Not found
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900 h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1920"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
            {settings.tagline}
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
            {settings.description}
          </p>
        </div>
      </div>

      {/* Check Harga Otomatis Widget */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Search className="text-indigo-600" /> Cek Harga Sewa Instan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Armada</label>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                >
                  <option value="">Pilih Armada</option>
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asal</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedOrigin}
                  onChange={(e) => setSelectedOrigin(e.target.value)}
                >
                  <option value="">Pilih Asal</option>
                  {origins.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tujuan</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                >
                  <option value="">Pilih Tujuan</option>
                  {dests.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (Hari)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="number" 
                  min="1"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <button 
              onClick={handleCheckPrice}
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-md transition-colors"
            >
              Hitung Estimasi
            </button>
            {estimatedPrice !== null && (
              <div className="text-right">
                <span className="text-sm text-gray-500 block">Estimasi Total:</span>
                {estimatedPrice === -1 ? (
                  <span className="text-xl font-bold text-red-600">Rute tidak tersedia</span>
                ) : (
                  <span className="text-3xl font-bold text-indigo-600">
                    Rp {estimatedPrice.toLocaleString('id-ID')}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Fleet */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Armada Pilihan Kami</h2>
            <p className="mt-4 text-xl text-gray-500">Kenyamanan dan keamanan perjalanan Anda adalah prioritas kami.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.slice(0, 3).map(vehicle => (
              <div key={vehicle.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <img src={vehicle.images[0]} alt={vehicle.name} className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{vehicle.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="bg-gray-100 px-2 py-1 rounded">{vehicle.capacity} Kursi</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">{vehicle.transmission}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">{vehicle.fuel}</span>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2">{vehicle.terms}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
