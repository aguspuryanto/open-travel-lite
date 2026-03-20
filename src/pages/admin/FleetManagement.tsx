import React, { useState } from 'react';
import { useAppContext, Vehicle } from '../../context/AppContext';
import { Plus, Edit, Trash2, X, Sparkles } from 'lucide-react';
import { generateVehicleTerms } from '../../services/geminiService';
import ConfirmModal from '../../components/ConfirmModal';

export default function FleetManagement() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [formData, setFormData] = useState<Partial<Vehicle>>({
    name: '',
    licensePlate: '',
    capacity: 4,
    transmission: 'Manual',
    fuel: 'Bensin',
    year: new Date().getFullYear(),
    images: [''],
    facilities: [],
    terms: '',
    status: 'Available'
  });

  const [isGeneratingTerms, setIsGeneratingTerms] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleGenerateTerms = async () => {
    if (!formData.name) {
      alert('Masukkan nama kendaraan terlebih dahulu.');
      return;
    }
    setIsGeneratingTerms(true);
    try {
      const terms = await generateVehicleTerms(formData.name);
      setFormData(prev => ({ ...prev, terms }));
    } catch (error) {
      alert('Gagal menghasilkan syarat & ketentuan.');
    } finally {
      setIsGeneratingTerms(false);
    }
  };

  const handleOpenModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData(vehicle);
    } else {
      setEditingVehicle(null);
      setFormData({
        name: '',
        licensePlate: '',
        capacity: 4,
        transmission: 'Manual',
        fuel: 'Bensin',
        year: new Date().getFullYear(),
        images: [''],
        facilities: [],
        terms: '',
        status: 'Available'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVehicle) {
      await updateVehicle(editingVehicle.id, formData);
    } else {
      await addVehicle(formData as Omit<Vehicle, 'id'>);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteVehicle(itemToDelete);
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("Gagal menghapus armada.");
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Armada</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={20} /> Tambah Armada
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Armada</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spesifikasi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-md object-cover" src={vehicle.images[0]} alt="" referrerPolicy="no-referrer" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{vehicle.name}</div>
                        <div className="text-sm text-gray-500">{vehicle.licensePlate} • {vehicle.year}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{vehicle.capacity} Kursi, {vehicle.transmission}</div>
                    <div className="text-sm text-gray-500">{vehicle.fuel}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${vehicle.status === 'Available' ? 'bg-green-100 text-green-800' : 
                        vehicle.status === 'Rented' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenModal(vehicle)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(vehicle.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsModalOpen(false)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {editingVehicle ? 'Edit Armada' : 'Tambah Armada'}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleSave}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Kendaraan</label>
                        <input 
                          type="text" 
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Plat Nomor</label>
                        <input 
                          type="text" 
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.licensePlate}
                          onChange={e => setFormData({...formData, licensePlate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Kapasitas</label>
                        <input 
                          type="number" 
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.capacity}
                          onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tahun</label>
                        <input 
                          type="number" 
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.year}
                          onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Transmisi</label>
                        <select 
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.transmission}
                          onChange={e => setFormData({...formData, transmission: e.target.value as any})}
                        >
                          <option value="Manual">Manual</option>
                          <option value="Automatic">Automatic</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bahan Bakar</label>
                        <select 
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.fuel}
                          onChange={e => setFormData({...formData, fuel: e.target.value})}
                        >
                          <option value="Bensin">Bensin</option>
                          <option value="Diesel">Diesel</option>
                          <option value="Listrik">Listrik</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">URL Gambar</label>
                      <input 
                        type="url" 
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.images?.[0] || ''}
                        onChange={e => setFormData({...formData, images: [e.target.value]})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value as any})}
                      >
                        <option value="Available">Available</option>
                        <option value="Rented">Rented</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Syarat & Ketentuan</label>
                        <button 
                          type="button" 
                          onClick={handleGenerateTerms}
                          disabled={isGeneratingTerms || !formData.name}
                          className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 disabled:opacity-50"
                        >
                          <Sparkles size={14} />
                          {isGeneratingTerms ? 'Menghasilkan...' : 'Generate AI'}
                        </button>
                      </div>
                      <textarea 
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.terms}
                        onChange={e => setFormData({...formData, terms: e.target.value})}
                        placeholder="Syarat dan ketentuan sewa..."
                      />
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!itemToDelete}
        title="Hapus Armada"
        message="Apakah Anda yakin ingin menghapus armada ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
