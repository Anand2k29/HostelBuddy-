import React, { useState } from 'react';
import { LostItem } from '../types';
import { MapPin, Phone, CameraOff, X, Upload, Search, PackageSearch, Package, Plus, Calendar, Filter, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type FilterType = 'ALL' | 'LOST' | 'FOUND';

export const LostFound: React.FC<{ items: LostItem[]; onAdd: (item: Omit<LostItem, 'id' | 'date'>) => void; }> = ({ items, onAdd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
    setSubmitted(true);
    setTimeout(() => {
      setNewItem(initialItemState);
      setIsModalOpen(false);
      setSubmitted(false);
    }, 1800);
  };

  const filteredItems = items.filter(item => {
    if (filterType !== 'ALL' && item.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.location.toLowerCase().includes(q);
    }
    return true;
  });

  const lostCount = items.filter(i => i.type === 'LOST').length;
  const foundCount = items.filter(i => i.type === 'FOUND').length;

  return (
    <div className="space-y-8 pb-12 text-white font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#26262a] pb-6">
        <div>
          <h1 className="text-xl font-black text-white font-mc-title uppercase tracking-wide">Lost & Found</h1>
          <p className="text-slate-400 font-mono-readable text-xs mt-1.5">[ Post missing items or found objects — help your blockmates recover their loot ]</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-mc uppercase text-[10px] py-2 px-4 shrink-0 flex items-center gap-2"
        >
          <Plus size={12} className="stroke-[3]" />
          <span>Post Item</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Posts', value: items.length, color: 'text-mc-cyan', border: 'border-mc-cyan/25' },
          { label: 'Lost Items', value: lostCount, color: 'text-red-400', border: 'border-red-500/25' },
          { label: 'Found Items', value: foundCount, color: 'text-emerald-400', border: 'border-emerald-500/25' },
        ].map(stat => (
          <div key={stat.label} className={`mc-card bg-[#1f1f26]/80 p-4 text-center border ${stat.border}`}>
            <p className={`text-2xl font-black font-mc-title ${stat.color}`}>{stat.value}</p>
            <p className="text-[8px] text-slate-500 font-mc-sub uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter + Search Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-[#1f1f26]/60 p-3 rounded border border-[#26262a]">
        <div className="flex items-center space-x-1.5 bg-[#141419] border border-[#26262a] px-3 py-1.5 rounded">
          <Filter size={12} className="text-mc-cyan" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="bg-transparent text-xs font-bold text-slate-300 outline-none cursor-pointer border-none p-0 focus:ring-0 font-mc-sub uppercase w-20"
          >
            <option value="ALL">All</option>
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
          </select>
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="/search [item name, location...]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-mono-readable bg-[#141419] border-2 border-[#3c3c44] focus:border-mc-cyan text-white pl-8 pr-4 py-2 outline-none rounded-sm"
          />
          <Search size={12} className="absolute left-3 top-3.5 text-slate-500" />
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-[9px] font-bold font-mc-sub uppercase text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 px-3 py-2 rounded flex items-center gap-1.5"
          >
            <X size={10} /> Clear
          </button>
        )}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-16 mc-card bg-[#1f1f26]/80 text-center border-dashed"
            >
              <div className="p-4 bg-[#141419] border border-[#26262a] rounded-sm mb-4">
                <PackageSearch size={28} className="text-slate-500" />
              </div>
              <h3 className="text-white font-mc-title text-[9px] uppercase">No Items Found</h3>
              <p className="text-slate-400 text-xs mt-2 font-mono-readable">Adjust your filters or post a new item.</p>
            </motion.div>
          ) : filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.04, duration: 0.3 }}
              className="mc-card bg-[#1f1f26]/90 overflow-hidden group hover:border-mc-cyan transition-all"
            >
              {/* Image Area */}
              <div className="h-44 w-full overflow-hidden bg-[#141419] border-b border-[#26262a] relative">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-slate-600 gap-3">
                    <Package size={36} className="opacity-40" />
                    <span className="text-[9px] font-mc-sub uppercase text-slate-600">No Image</span>
                  </div>
                )}
                {/* Type Badge Overlay */}
                <div className={`absolute top-3 left-3 px-2.5 py-1 text-[8px] font-mc-sub font-bold uppercase rounded border shadow-lg ${
                  item.type === 'LOST'
                    ? 'bg-red-900/80 text-red-300 border-red-500/50 backdrop-blur-sm'
                    : 'bg-emerald-900/80 text-emerald-300 border-emerald-500/50 backdrop-blur-sm'
                }`}>
                  {item.type === 'LOST' ? '❌ LOST' : '✅ FOUND'}
                </div>
                {/* Status Badge */}
                <div className={`absolute top-3 right-3 px-2.5 py-1 text-[8px] font-mc-sub font-bold uppercase rounded border shadow-lg backdrop-blur-sm ${
                  item.status === 'OPEN'
                    ? 'bg-yellow-900/80 text-yellow-300 border-yellow-500/50'
                    : 'bg-slate-800/80 text-slate-400 border-slate-600/50'
                }`}>
                  {item.status}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-wide font-mc-sub truncate group-hover:text-mc-cyan transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-slate-400 text-xs font-mono-readable mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1 border-t border-[#26262a]">
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono-readable">
                    <MapPin size={11} className="text-mc-cyan shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono-readable">
                    <Phone size={11} className="text-mc-cyan shrink-0" />
                    <span className="truncate">{item.contact}</span>
                  </div>
                  {item.date && (
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono-readable">
                      <Calendar size={11} className="shrink-0" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Post Item Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#07090e]/85 backdrop-blur-sm"
              onClick={() => !submitted && setIsModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="relative bg-[#1f1f26] text-white rounded-sm w-full max-w-2xl border-3 border-[#101014] overflow-hidden"
              style={{ boxShadow: 'inset 2px 2px 0px rgba(255,255,255,0.05), inset -2px -2px 0px rgba(0,0,0,0.3), 0 12px 40px rgba(0,0,0,0.7)' }}
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-[#26262a] flex justify-between items-center bg-[#141419]/60">
                <div>
                  <h2 className="text-xs font-black text-white font-mc-title uppercase">Post Lost or Found Item</h2>
                  <p className="text-[10px] text-slate-500 font-mono-readable mt-0.5">Fill in the loot details so your blockmates can help you.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-[#26262a] rounded-md transition-colors text-slate-400">
                  <X size={16} className="stroke-[2.5]" />
                </button>
              </div>

              {!submitted ? (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[8px] font-bold text-slate-400 uppercase font-mc-sub tracking-wider mb-1.5">Item Name <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          value={newItem.name}
                          onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                          placeholder="e.g., Blue Water Bottle"
                          className="w-full text-xs font-mono-readable p-2.5 bg-[#141419] border-2 border-[#3c3c44] focus:border-mc-cyan text-white rounded-sm outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[8px] font-bold text-slate-400 uppercase font-mc-sub tracking-wider mb-1.5">Type</label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['LOST', 'FOUND'] as const).map(t => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setNewItem({ ...newItem, type: t })}
                              className={`py-2.5 text-[9px] font-bold font-mc-sub uppercase border-2 rounded-sm transition-all ${
                                newItem.type === t
                                  ? t === 'LOST'
                                    ? 'bg-red-500/20 border-red-500/60 text-red-300'
                                    : 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                                  : 'bg-[#141419] border-[#3c3c44] text-slate-400 hover:border-slate-500'
                              }`}
                            >
                              {t === 'LOST' ? '❌ Lost' : '✅ Found'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[8px] font-bold text-slate-400 uppercase font-mc-sub tracking-wider mb-1.5">Last Seen Location <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          value={newItem.location}
                          onChange={e => setNewItem({ ...newItem, location: e.target.value })}
                          placeholder="e.g., Block B, 3rd Floor Corridor"
                          className="w-full text-xs font-mono-readable p-2.5 bg-[#141419] border-2 border-[#3c3c44] focus:border-mc-cyan text-white rounded-sm outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[8px] font-bold text-slate-400 uppercase font-mc-sub tracking-wider mb-1.5">Contact Info <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          value={newItem.contact}
                          onChange={e => setNewItem({ ...newItem, contact: e.target.value })}
                          placeholder="Phone or Room Number"
                          className="w-full text-xs font-mono-readable p-2.5 bg-[#141419] border-2 border-[#3c3c44] focus:border-mc-cyan text-white rounded-sm outline-none"
                        />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      {/* Image Upload */}
                      <div>
                        <label className="block text-[8px] font-bold text-slate-400 uppercase font-mc-sub tracking-wider mb-1.5">Item Photo (Optional)</label>
                        <div className="w-full h-36 border-2 border-dashed border-[#3c3c44] hover:border-mc-cyan rounded-sm flex items-center justify-center text-center p-3 relative transition-all cursor-pointer group/upload">
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleImageChange}
                          />
                          {newItem.image ? (
                            <img src={newItem.image} alt="Preview" className="h-full w-full object-contain rounded" />
                          ) : (
                            <div className="text-slate-500 group-hover/upload:text-mc-cyan transition-colors">
                              <Upload size={24} className="mx-auto mb-2" />
                              <p className="text-[9px] font-mc-sub uppercase">Click to Upload Photo</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-[8px] font-bold text-slate-400 uppercase font-mc-sub tracking-wider mb-1.5">Description <span className="text-red-400">*</span></label>
                        <textarea
                          rows={4}
                          value={newItem.description}
                          onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                          placeholder="Describe the item — color, brand, distinctive marks..."
                          className="w-full text-xs font-mono-readable p-2.5 bg-[#141419] border-2 border-[#3c3c44] focus:border-mc-cyan text-white rounded-sm outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-5 border-t border-[#26262a] mt-5">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2 bg-[#141419] hover:bg-[#26262a] text-slate-300 text-xs font-bold font-mc-sub uppercase border border-[#3c3c44] rounded-sm transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-6 py-2 btn-mc text-[10px] uppercase flex items-center gap-2"
                    >
                      <Plus size={12} />
                      Post Item
                    </button>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-12 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-16 h-16 bg-[#141419] border-3 border-emerald-500 rounded flex items-center justify-center mb-5">
                    <CheckCircle2 size={32} className="text-emerald-400" />
                  </div>
                  <p className="text-emerald-400 font-mc-sub text-[10px] uppercase font-bold tracking-widest">Item Posted!</p>
                  <h3 className="text-white font-mc-title text-[10px] mt-2 uppercase">Loot Report Filed</h3>
                  <p className="text-slate-400 text-xs font-mono-readable mt-3">Your blockmates can now see this listing.</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};