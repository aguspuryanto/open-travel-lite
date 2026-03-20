import React, { useState } from 'react';
import { useAppContext, VehicleActivity } from '../../context/AppContext';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, AlertCircle, Plus, Edit, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import ConfirmModal from '../../components/ConfirmModal';

export default function Operations() {
  const { activities, vehicles, addActivity, updateActivity, deleteActivity } = useAppContext();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<VehicleActivity | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<VehicleActivity>>({
    vehicleId: '',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    route: '',
    type: 'Rental',
    customerName: '',
    description: '',
    status: 'Scheduled'
  });

  const filteredActivities = activities.filter(activity => {
    if (filterStatus === 'all') return true;
    return activity.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'On Trip':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium inline-flex items-center gap-1"><MapPin size={12}/> Sedang Jalan</span>;
      case 'Completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium inline-flex items-center gap-1"><CheckCircle size={12}/> Selesai</span>;
      case 'Cancelled':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium inline-flex items-center gap-1"><XCircle size={12}/> Dibatalkan</span>;
      case 'Scheduled':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium inline-flex items-center gap-1"><Calendar size={12}/> Terjadwal</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium inline-flex items-center gap-1"><AlertCircle size={12}/> {status}</span>;
    }
  };

  const handleOpenModal = (activity?: VehicleActivity) => {
    if (activity) {
      setEditingActivity(activity);
      setFormData(activity);
    } else {
      setEditingActivity(null);
      setFormData({
        vehicleId: vehicles.length > 0 ? vehicles[0].id : '',
        date: new Date().toISOString().split('T')[0],
        time: '08:00',
        route: '',
        type: 'Rental',
        customerName: '',
        description: '',
        status: 'Scheduled'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingActivity) {
      await updateActivity(editingActivity.id, formData);
    } else {
      await addActivity(formData as Omit<VehicleActivity, 'id'>);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await deleteActivity(itemToDelete);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operasional & Aktivitas</h1>
          <p className="text-gray-500 text-sm mt-1">Pantau pergerakan armada dan jadwal perjalanan.</p>
        </div>
        
        <div className="flex gap-2">
          <select 
            className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="Scheduled">Terjadwal</option>
            <option value="On Trip">Sedang Jalan</option>
            <option value="Completed">Selesai</option>
            <option value="Cancelled">Dibatalkan</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Plus size={20} /> Tambah Aktivitas
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal & Waktu
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Armada
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rute / Tujuan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity) => {
                  const vehicle = vehicles.find(v => v.id === activity.vehicleId);
                  return (
                    <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {format(new Date(activity.date), 'dd MMM yyyy', { locale: idLocale })}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Clock size={12} /> {activity.time}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                            {vehicle?.images[0] ? (
                              <img className="h-full w-full object-cover" src={vehicle.images[0]} alt="" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-400">
                                <MapPin size={20} />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{vehicle?.name || 'Armada Dihapus'}</div>
                            <div className="text-xs text-gray-500">{vehicle?.capacity} Kursi</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{activity.route}</div>
                        <div className="text-xs text-gray-500 mt-1">{activity.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <User size={14} className="mr-2 text-gray-400" />
                          {activity.customerName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(activity.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleOpenModal(activity)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(activity.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada aktivitas yang ditemukan.
                  </td>
                </tr>
              )}
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
                    {editingActivity ? 'Edit Aktivitas' : 'Tambah Aktivitas'}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleSave}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Armada</label>
                      <select 
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.vehicleId}
                        onChange={e => setFormData({...formData, vehicleId: e.target.value})}
                      >
                        <option value="" disabled>Pilih Armada</option>
                        {vehicles.map(v => (
                          <option key={v.id} value={v.id}>{v.name} ({v.licensePlate})</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                        <input 
                          type="date" 
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.date}
                          onChange={e => setFormData({...formData, date: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Waktu</label>
                        <input 
                          type="time" 
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.time}
                          onChange={e => setFormData({...formData, time: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rute / Tujuan</label>
                      <input 
                        type="text" 
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.route}
                        onChange={e => setFormData({...formData, route: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tipe</label>
                        <select 
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.type}
                          onChange={e => setFormData({...formData, type: e.target.value})}
                        >
                          <option value="Rental">Rental</option>
                          <option value="Travel">Travel</option>
                          <option value="Tour">Tour</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select 
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.status}
                          onChange={e => setFormData({...formData, status: e.target.value as any})}
                        >
                          <option value="Scheduled">Terjadwal</option>
                          <option value="On Trip">Sedang Jalan</option>
                          <option value="Completed">Selesai</option>
                          <option value="Cancelled">Dibatalkan</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nama Pelanggan</label>
                      <input 
                        type="text" 
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.customerName}
                        onChange={e => setFormData({...formData, customerName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Deskripsi / Catatan</label>
                      <textarea 
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
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
        title="Hapus Aktivitas"
        message="Apakah Anda yakin ingin menghapus aktivitas ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
