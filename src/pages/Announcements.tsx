import React from 'react';
import { Announcement, User, UserRole } from '../types';
import { Bell, Pin } from 'lucide-react';

interface AnnouncementsProps {
  user: User;
  data: Announcement[];
}

export const Announcements: React.FC<AnnouncementsProps> = ({ user, data }) => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
        {user.role === UserRole.ADMIN && (
             <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
                + Post New
             </button>
        )}
      </div>

      <div className="grid gap-4">
        {data.map(item => (
            <div key={item.id} className="relative bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {item.priority === 'URGENT' && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">URGENT</div>
                )}
                <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                        <Bell size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                        <p className="text-slate-500 text-xs mb-3 flex items-center">
                            <Pin size={12} className="mr-1" /> Posted on {new Date(item.date).toLocaleDateString()}
                        </p>
                        <p className="text-slate-700 leading-relaxed">{item.content}</p>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};