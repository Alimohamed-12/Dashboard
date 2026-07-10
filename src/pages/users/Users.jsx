import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, X } from 'lucide-react';

import UserHeader from './UserHeader';
import UserStats from './UserState';
import UserTable from './UserTable';

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNDNjYmQ0MzMwYTZjN2ZkYWZlOTc1ZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MzU2MTY5NCwiZXhwIjoxNzgzOTkzNjk0fQ.pbcJKo6R3cwfMp-H5wJ95SVDk8KJhR92vV2C2z8N8Og";

function CreateUserForm({ onClose, onUserCreated }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setFormData({ username: '', email: '', password: '', phone: '' });
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      setError('من فضلك املأ الحقول المطلوبة');
      return;
    }
    setLoading(true);
    setError('');

    const localUser = {
      _id: Date.now().toString(),
      username: formData.username,
      name: formData.username,
      email: formData.email,
      phone: formData.phone,
      role: 'customer',
      verified: false
    };
    onUserCreated(localUser);
    handleClear();
    onClose();
    setLoading(false);

    try {
      await fetch('https://e-commerce-api-3wara.vercel.app/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`
        },
        body: JSON.stringify({
          username: localUser.username,
          email: localUser.email,
          password: formData.password,
          phone: localUser.phone
        })
      });
    } catch (err) {
      console.error('فشل الحفظ في السيرفر (تم الحفظ محليًا فقط):', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-cyan-100 mb-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#0ea5e9] p-2.5 rounded-xl text-white"><UserPlus size={20} /></div>
          <div>
            <h3 className="font-bold text-gray-900">Create New User</h3>
            <p className="text-gray-400 text-sm">Fill in the details below to add a new user</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">Username <span className="text-red-400">*</span></label>
          <input name="username" value={formData.username} onChange={handleChange} placeholder="e.g. john_doe" className="w-full mt-1 bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-[#0ea5e9]/20" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">Email <span className="text-red-400">*</span></label>
          <input name="email" value={formData.email} onChange={handleChange} placeholder="e.g. john@email.com" className="w-full mt-1 bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-[#0ea5e9]/20" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">Password <span className="text-red-400">*</span></label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" className="w-full mt-1 bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-[#0ea5e9]/20" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. +1 234 567 890" className="w-full mt-1 bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-[#0ea5e9]/20" />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="flex justify-between items-center border-t border-cyan-100 pt-4">
        <p className="text-red-400 text-xs">* Required fields</p>
        <div className="flex gap-3">
          <button onClick={handleClear} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50">Clear</button>
          <button onClick={handleSubmit} disabled={loading} className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold disabled:opacity-50">
            <UserPlus size={16} />
            {loading ? 'جاري الإنشاء...' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Users() {
  const [usersList, setUsersList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('https://e-commerce-api-3wara.vercel.app/users/all', {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    })
    .then((response) => {
      console.log("الداتا اللي جات من الباك إند:", response.data);
      const fetchedUsers = response.data.users || response.data || [];
      setUsersList(fetchedUsers);
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
  }, []);

  const handleUserCreated = (newUser) => {
    setUsersList((prev) => [newUser, ...prev]);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsersList((prev) =>
      prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
    );
  };

  const handleMakeAdmin = (user) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u._id === user._id
          ? { ...u, role: u.role === 'admin' ? 'customer' : 'admin' }
          : u
      )
    );
  };

  const handleDeleteUser = (user) => {
    setUsersList((prev) => prev.filter((u) => u._id !== user._id));
  };

  const filteredUsers = usersList.filter((user) => {
    const name = (user?.name || user?.username || '').toLowerCase();
    const email = (user?.email || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <UserHeader
        onAddUserClick={() => setShowForm(!showForm)}
        showForm={showForm}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />
      {showForm && (
        <CreateUserForm onClose={() => setShowForm(false)} onUserCreated={handleUserCreated} />
      )}
      <UserStats users={filteredUsers} />
      <UserTable
        users={filteredUsers}
        onUpdateUser={handleUserUpdated}
        onMakeAdmin={handleMakeAdmin}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
}

export default Users;