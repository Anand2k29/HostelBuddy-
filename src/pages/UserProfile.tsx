import React, { useState } from 'react';
import { User, Issue, IssueStatus } from '../types';
import { User as UserIcon, Mail, MapPin, Hash, CheckCircle2, AlertCircle, Edit2, Save, X, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserProfileProps {
  user: User;
  issues: Issue[];
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, issues }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state to manage edits before saving
  const [formData, setFormData] = useState({
    name: user.name,
    roomNumber: user.roomNumber,
    email: user.email,
    phone: '+1 (555) 000-0000' // Mock phone since it's not in User type yet
  });

  const myIssues = issues.filter(i => i.reporterId === user.id);
  const resolvedCount = myIssues.filter(i => i.status === IssueStatus.RESOLVED || i.status === IssueStatus.CLOSED).length;
  const pendingCount = myIssues.length - resolvedCount;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'REPORTED': return 'bg-slate-100 text-slate-600';
      case 'ASSIGNED': return 'bg-yellow-100 text-yellow-700';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
      case 'RESOLVED': return 'bg-green-100 text-green-700';
      case 'CLOSED': return 'bg-slate-800 text-slate-200';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const handleSave = () => {
    // In a real app, this would make an API call
    console.log("Saving user data:", formData);
    setIsEditing(false);
    // Here we would ideally call a prop function like onUpdateUser(formData)
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      roomNumber: user.roomNumber,
      email: user.email,
      phone: '+1 (555) 000-0000'
    });
    setIsEditing(false);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const InputField = ({ label, value, onChange, icon: Icon, type = "text", disabled = false }: any) => (
    <div className={`flex items-center p-4 rounded-2xl border transition-all duration-200 ${isEditing && !disabled ? 'bg-white border-indigo-200 ring-4 ring-indigo-500/5' : 'bg-slate-50 border-slate-100'}`}>
      <div className={`p-2 rounded-lg shadow-sm mr-4 ${isEditing && !disabled ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-slate-400'}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <p className="text-xs text-slate-400 font-semibold uppercase mb-0.5">{label}</p>
        {isEditing && !disabled ? (
          <input 
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent font-medium text-slate-900 outline-none placeholder:text-slate-300"
          />
        ) : (
          <p className="text-sm text-slate-900 font-medium truncate">{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">My Profile</h1>
          <p className="text-slate-500 font-medium">Manage your personal information and view activity.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Details Card */}
        <motion.div variants={item} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-fit relative overflow-hidden">
          
          {/* Edit Button Group */}
          <div className="absolute top-6 right-6 flex space-x-2">
            {isEditing ? (
              <>
                <button 
                  onClick={handleCancel}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Cancel"
                >
                  <X size={20} />
                </button>
                <button 
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all"
                >
                  <Save size={16} />
                  <span>Save</span>
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-bold shadow-sm transition-all"
              >
                <Edit2 size={16} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          <div className="flex flex-col items-center text-center mt-4">
            <div className="relative mb-6 group">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.name} 
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-50 shadow-lg transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-4xl font-bold border-4 border-indigo-50 shadow-lg">
                  {user.name[0]}
                </div>
              )}
              {isEditing && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-bold">Change</span>
                 </div>
              )}
              <div className="absolute bottom-1 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
            </div>
            
            {/* Name Field (Special display) */}
            {isEditing ? (
              <input 
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
                 className="text-2xl font-bold text-slate-900 text-center bg-transparent border-b-2 border-indigo-200 focus:border-indigo-600 outline-none w-full max-w-[200px] mb-1 pb-1"
              />
            ) : (
              <h2 className="text-2xl font-bold text-slate-900 mb-1">{formData.name}</h2>
            )}

            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold tracking-wide uppercase mb-8 mt-2">
              {user.role}
            </span>

            <div className="w-full space-y-4 text-left">
              <InputField 
                label="Email Address" 
                value={formData.email} 
                icon={Mail} 
                disabled={true} 
                onChange={() => {}} 
              />
              
              <InputField 
                label="Phone Number" 
                value={formData.phone} 
                icon={Phone} 
                onChange={(val: string) => setFormData({...formData, phone: val})} 
              />

              <InputField 
                label="Room Number" 
                value={formData.roomNumber} 
                icon={MapPin} 
                onChange={(val: string) => setFormData({...formData, roomNumber: val})} 
              />

              <InputField 
                label="User ID" 
                value={`#${user.id}`} 
                icon={Hash} 
                disabled={true}
                onChange={() => {}} 
              />
            </div>
          </div>
        </motion.div>

        {/* Stats & History */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Row */}
          <motion.div variants={item} className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
              <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl">
                <AlertCircle size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Pending Issues</p>
                <h3 className="text-3xl font-bold text-slate-900">{pendingCount}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
              <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Resolved Issues</p>
                <h3 className="text-3xl font-bold text-slate-900">{resolvedCount}</h3>
              </div>
            </div>
          </motion.div>

          {/* Activity Table */}
          <motion.div variants={item} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50">
              <h3 className="text-lg font-bold text-slate-900">My Reported Issues</h3>
            </div>
            {myIssues.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">Issue</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-400 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {myIssues.map(issue => (
                      <tr key={issue.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{issue.title}</div>
                          <div className="text-xs text-slate-500 truncate max-w-[300px]">{issue.description}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(issue.status)}`}>
                            {issue.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-slate-500 font-medium">
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500">
                You haven't reported any issues yet.
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};