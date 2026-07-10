import React, { useState, useEffect } from 'react';
import Cards from './cards';
import axios from 'axios';
import { ShoppingBag, Clock, DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import TopProducts from './TopProducts';
import OrderStatus from './OrderStatus';

import RecentOrders from './RecentOrders';


export default function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNDNjYmQ0MzMwYTZjN2ZkYWZlOTc1ZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MzU2MTY5NCwiZXhwIjoxNzgzOTkzNjk0fQ.pbcJKo6R3cwfMp-H5wJ95SVDk8KJhR92vV2C2z8N8Og";
      axios.get('https://e-commerce-api-3wara.vercel.app/orders/admin/dashboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then((response) => {
      setStats(response.data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  return (
    <div className="py-8 pr-8 pl-4 bg-gray-50/50 min-h-screen">
      <div className='bg-white rounded-xl p-4 mt-2 mb-8 shadow-md'>
        <h2 className='text-cyan-400 text-xs tracking-[3px] uppercase'>Admin overview</h2>
        <h1 className='text-2xl text-gray-800 mt-2 font-semibold'>Real-time commerce health</h1>
        <p className='text-gray-500 mt-2'>Monitor your storefront with AI-style clarity and live API metrics.</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <Cards title="Total Orders" 
        value={stats?.dashboard?.orders?.total|| 0} 
        subtitle="All orders received" Icon={ShoppingBag}
        borderColor="border-[#2dd4bf]" 
        iconBgColor="bg-[#ccfbf1]" 
        iconColor="text-[#0d9488]" />

        <Cards title="Pending Orders" value={stats?.dashboard?.orders?.pending || 0} subtitle="Awaiting action" Icon={Clock} borderColor="border-[#fb923c]" iconBgColor="bg-[#ffedd5]" iconColor="text-[#ea580c]" />
        <Cards title="Revenue" value={`$${stats?.dashboard?.revenue?.total || 0}`} subtitle="Total gross revenue" Icon={DollarSign} borderColor="border-[#f43f5e]" iconBgColor="bg-[#ffe4e6]" iconColor="text-[#e11d48]" />
        <Cards title="This Month" value={`$${stats?.dashboard?.revenue?.thisMonth || 0}`} subtitle="Monthly sales target" Icon={ShoppingCart} borderColor="border-[#38bdf8]" iconBgColor="bg-[#e0f2fe]" iconColor="text-[#0284c7]" />
        <Cards title="Top Product" value={stats?.dashboard?.topSellingProducts?.[0]?.name || "iPhone 15 Pro Max"} subtitle={`${stats?.dashboard?.topSellingProducts?.[0]?.soldCount || 6} sold`} Icon={Package} borderColor="border-[#a855f7]" iconBgColor="bg-[#f3e8ff]" iconColor="text-[#9333ea]" />
        <Cards title="Users" value={stats?.dashboard?.totalCustomers || stats?.dashboard?.usersCount || 0} subtitle="Registered customers" Icon={Users} borderColor="border-[#64748b]" iconBgColor="bg-[#f1f5f9]" iconColor="text-[#475569]" />
      </div>


      {/* ------------------------------------------------------------------------------------------ */}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderStatus dashboard={stats?.dashboard} />
        <TopProducts />
      </div>


      {/* --------------------------------------------------------------------------------------- */}
      {/* <div className="mt-8"> */}
        <RecentOrders stats={stats} />
    {/* </div> */}
    </div>
  )
}
