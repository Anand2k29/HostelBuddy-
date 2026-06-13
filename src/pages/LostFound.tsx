import React from 'react';
import { LostItem } from '../types';
import { MapPin, Phone } from 'lucide-react';

export const LostFound: React.FC<{ items: LostItem[] }> = ({ items }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Lost & Found</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
                <div className="h-40 bg-slate-100 flex items-center justify-center text-slate-400">
                    {/* Placeholder for image */}
                    <span>No Image</span>
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
  );
};