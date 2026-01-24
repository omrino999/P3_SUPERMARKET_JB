import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit, Trash2, Package, FolderTree, X } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [items, setItems] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    department_id: '',
    image_url: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setItems([]); // Clear items immediately to prevent type mismatch during tab switch
      if (activeTab === 'products') {
        const [prodRes, deptRes] = await Promise.all([
          api.get('/products'),
          api.get('/departments')
        ]);
        setItems(prodRes.data);
        setDepartments(deptRes.data);
      } else {
        const res = await api.get('/departments');
        setItems(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        price: item.price || '',
        department_id: item.department_id || '',
        image_url: item.image_url || ''
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', price: '', department_id: '', image_url: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = activeTab === 'products' ? '/admin/products' : '/admin/departments';
    
    try {
      if (editingItem) {
        await api.put(`${endpoint}/${editingItem.id}`, formData);
      } else {
        await api.post(endpoint, formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    const endpoint = activeTab === 'products' ? '/admin/products' : '/admin/departments';
    try {
      await api.delete(`${endpoint}/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 bg-red-50/30 dark:bg-red-950/10 p-8 rounded-3xl min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <h1 className="text-4xl font-black text-gray-800 dark:text-gray-100">Admin Dashboard</h1>
        <div className="flex bg-white dark:bg-gray-800 p-1 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'products' ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            <Package size={20} /> Products
          </button>
          <button 
            onClick={() => setActiveTab('departments')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'departments' ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            <FolderTree size={20} /> Departments
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden transition-colors">
        <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 capitalize">{activeTab} List</h2>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center gap-2"
          >
            <Plus size={20} /> Add New
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 border-b border-gray-50 dark:border-gray-700">
                <th className="px-8 py-4">Name</th>
                {activeTab === 'products' && (
                  <>
                    <th className="px-8 py-4">Price</th>
                    <th className="px-8 py-4">Department</th>
                  </>
                )}
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="4" className="px-8 py-6 h-16 bg-gray-50/20 dark:bg-gray-700/20"></td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-gray-500 dark:text-gray-400 font-medium italic">
                    No {activeTab} found. Click "Add New" to get started.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors group">
                    <td className="px-8 py-4 font-bold text-gray-800 dark:text-gray-200">{item.name}</td>
                    {activeTab === 'products' && (
                      <>
                        <td className="px-8 py-4 text-green-600 dark:text-green-400 font-bold">${item.price?.toFixed(2) || '0.00'}</td>
                        <td className="px-8 py-4">
                          <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-lg text-xs font-bold uppercase">
                            {departments.find(d => d.id === item.department_id)?.name || 'Unknown'}
                          </span>
                        </td>
                      </>
                    )}
                    <td className="px-8 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenModal(item)}
                        className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md relative z-10 shadow-2xl animate-in zoom-in-95 duration-200 transition-colors">
            <div className="p-8 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-2xl font-black text-gray-800 dark:text-gray-100">
                {editingItem ? `Edit ${activeTab.slice(0, -1)}` : `Add ${activeTab.slice(0, -1)}`}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  required
                />
              </div>

              {activeTab === 'products' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Price ($)</label>
                    <input 
                      type="number" step="0.01"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-green-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Department</label>
                    <select 
                      value={formData.department_id}
                      onChange={e => setFormData({...formData, department_id: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-green-500 transition-all bg-white dark:bg-gray-700"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Image URL</label>
                    <input 
                      type="text"
                      value={formData.image_url}
                      onChange={e => setFormData({...formData, image_url: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-green-500 transition-all"
                      placeholder="https://..."
                    />
                  </div>
                </>
              )}

              <button 
                type="submit"
                className="w-full bg-green-600 text-white font-black py-4 rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 transition-all mt-4"
              >
                {editingItem ? 'Save Changes' : `Create ${activeTab.slice(0, -1)}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
