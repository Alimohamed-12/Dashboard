import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNDNjYmQ0MzMwYTZjN2ZkYWZlOTc1ZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MzU2MTY5NCwiZXhwIjoxNzgzOTkzNjk0fQ.pbcJKo6R3cwfMp-H5wJ95SVDk8KJhR92vV2C2z8N8Og";
    axios.get('https://e-commerce-api-3wara.vercel.app/orders/admin/recent', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then((response) => {
      setOrders(response.data.orders || []);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading recent orders...</p>;

  return (
    <div className="bg-white rounded-xl p-4 shadow-md mt-6">
      <h2 className="text-cyan-400 text-xs tracking-[3px] uppercase">Recent Orders</h2>
      <h1 className="text-xl text-gray-800 mt-2 font-semibold">Latest customer activity</h1>

      <ul className="mt-4 space-y-4">
        {orders.map((order, idx) => (
          <li key={idx} className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="text-gray-800 font-medium">{order.customerName || "Customer"}</p>
              <p className="text-gray-500 text-sm">
                {order.productName} • {new Date(order.date).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  order.status === "confirmed" ? "bg-green-100 text-green-600" :
                  order.status === "processing" ? "bg-blue-100 text-blue-600" :
                  order.status === "pending" ? "bg-yellow-100 text-yellow-600" :
                  order.status === "delivered" ? "bg-cyan-100 text-cyan-600" :
                  order.status === "cancelled" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
                }`}
              >
                {order.status}
              </span>
              <p className="text-gray-700 mt-1">${order.amount}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
