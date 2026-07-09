import React from "react";

export default function OrderStatus({ dashboard }) {
  const orders = dashboard?.orders || {};

  const statusCards = [
    {
      title: "Pending",
      value: orders.pending || 0,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      title: "Processing",
      value: orders.processing || 0,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Confirmed",
      value: orders.confirmed || 0,
      color: "text-cyan-500",
      bg: "bg-cyan-50",
    },
    {
      title: "Shipped",
      value: orders.shipped || 0,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
    },
    {
      title: "Delivered",
      value: orders.delivered || 0,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      title: "Cancelled",
      value: orders.cancelled || 0,
      color: "text-red-500",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-cyan-400 text-sm tracking-[5px] uppercase">
            Order Status
          </h2>

          <h1 className="text-2xl font-semibold text-gray-800 mt-2">
            Live Fulfillment Breakdown
          </h1>

          <p className="text-gray-500 mt-2 mb-6">
            Current status of all customer orders.
          </p>
        </div>

        <span className="bg-cyan-100 text-cyan-700 text-xs font-semibold px-4 py-2 rounded-full">
          Updated from API
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statusCards.map((item) => (
          <div
            key={item.title}
            className={`${item.bg} rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
          >
            <h3 className={`text-sm font-semibold uppercase ${item.color}`}>
              {item.title}
            </h3>

            <p className={`text-4xl font-bold mt-3 ${item.color}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}