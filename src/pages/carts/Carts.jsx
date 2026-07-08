import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { ShoppingCart, User, Package } from "lucide-react";
export default function Carts() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchCarts();
  }, []);
  const fetchCarts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/carts/admin");
      // Expecting: [{ _id, user: { name, email }, items: [{ product: { name, image, price }, quantity }] }]
      setCarts(res.data?.carts || res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load carts from the API.");
    } finally {
      setLoading(false);
    }
  };
  const getCartTotal = (cart) =>
    cart.items?.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    ) || 0;
  return (
    <div className="p-6 space-y-6">
      {/* Header Card */}
      <div className="w-full rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-8">
        <span className="text-xs font-bold tracking-widest text-cyan-500 dark:text-cyan-400 uppercase">
          Carts
        </span>
        <h1 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Cart overview
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
          All active carts returned from the API are rendered here with their
          latest item details.
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-10 text-center text-sm text-gray-400">
          Loading carts...
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="rounded-2xl border border-dashed border-red-200 dark:border-red-800 p-10 text-center text-sm text-red-500">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && carts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-10 text-center text-sm text-gray-400">
          No carts returned from the API.
        </div>
      )}

      {/* Carts list */}
      {!loading && !error && carts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {carts.map((cart) => (
            <div
              key={cart._id}
              className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-6"
            >
              {/* Cart owner */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
                    <User size={16} className="text-cyan-600 dark:text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {cart.user?.name || "Guest User"}
                    </p>
                    <p className="text-xs text-gray-400">{cart.user?.email}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <ShoppingCart size={14} />
                  {cart.items?.length || 0} items
                </span>
              </div>

              {/* Products in cart */}
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {cart.items?.length ? (
                  cart.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex items-center gap-3">
                        {item.product?.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-gray-800"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <Package size={18} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                            {item.product?.name || "Unknown product"}
                          </p>
                          <p className="text-xs text-gray-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {(item.product?.price || 0) * item.quantity} AED
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 py-3">This cart is empty.</p>
                )}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Total
                </span>
                <span className="text-base font-bold text-gray-900 dark:text-white">
                  {getCartTotal(cart)} AED
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
