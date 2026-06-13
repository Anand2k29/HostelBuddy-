import React, { useState } from 'react';
import { LostItem } from '../types';
import { MapPin, Phone, CameraOff, X, Upload } from 'lucide-react';

export const LostFound: React.FC<{ items: LostItem[]; onAdd: (item: Omit<LostItem, 'id' | 'date'>) => void; }> = ({ items, onAdd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialItemState: Omit<LostItem, 'id' | 'date'> = {
    name: '',
    description: '',
    location: '',
    type: 'LOST',
    status: 'OPEN',
    contact: '',
    image: '',
  };
  const [newItem, setNewItem] = useState(initialItemState);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({ ...newItem, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!newItem.name || !newItem.description || !newItem.location || !newItem.contact) {
      alert('Please fill out all required fields.');
      return;
    }
    onAdd(newItem);
    setNewItem(initialItemState);
    setIsModalOpen(false);
  };
  
  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Lost & Found</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-md"
          >
            + Report Item
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
              <div key={item.id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
                  <div className="h-48 w-full overflow-hidden bg-slate-100">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400">
                        <CameraOff size={32} />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-slate-900">{item.name}</h3>
                          <span className={`px-2 py-1 text-xs font-bold rounded ${item.type === 'LOST' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                              {item.type}
                          </span>
                      </div>
                      <p className="text-slate-600 text-sm mb-4">{item.description}</p>
                      
                      <div className="space-y-2 text-sm text-slate-500">
                          <div className="flex items-center space-x-2">
                              <MapPin size={16} />
                              <span>{item.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                              <Phone size={16} />
                              <span>{item.contact}</span>
                          </div>
                      </div>
                  </div>
              </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Report a Lost or Found Item</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
                  <input type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select value={newItem.type} onChange={e => setNewItem({...newItem, type: e.target.value as 'LOST' | 'FOUND'})} className="w-full px-4 py-2 rounded-lg border border-slate-300">
                    <option value="LOST">Lost</option>
                    <option value="FOUND">Found</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input type="text" value={newItem.location} onChange={e => setNewItem({...newItem, location: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Info</label>
                  <input type="text" value={newItem.contact} onChange={e => setNewItem({...newItem, contact: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
                </div>
              </div>
              <div className="space-y-2">
                 <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
                 <div className="w-full h-48 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-center p-4 relative">
                    <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageChange} />
                    {newItem.image ? (
                      <img src={newItem.image} alt="Preview" className="h-full w-full object-contain rounded-md" />
                    ) : (
                      <div className="text-slate-500">
                        <Upload size={32} className="mx-auto" />
                        <p className="mt-2">Click to upload image</p>
                      </div>
                    )}
                 </div>
                 <div className="w-full">
                  <label className="block text-sm font-medium text-slate-700 mb-1 mt-4">Description</label>
                  <textarea rows={3} value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-300" />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">Post Item</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};