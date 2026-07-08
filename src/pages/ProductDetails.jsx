import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = "https://e-commerce-api-3wara.vercel.app";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${API_BASE}/products/${id}`);
        const data = await res.json();

        setProduct(data.product || data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex justify-center items-center text-white">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex justify-center items-center text-red-500">
        Product not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-cyan-500 px-4 py-2 rounded-lg text-black font-semibold"
      >
        ← Back
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.images?.[0]?.url || product.images?.[0]}
            alt={product.title}
            className="w-full h-[450px] object-cover rounded-xl"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold">
            {product.title}
          </h1>

          <p className="text-gray-400">
            {product.description}
          </p>

          <div className="bg-slate-800 p-4 rounded-xl">
            <h3 className="text-cyan-400 mb-2">Price</h3>
            <p>${product.price}</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl">
            <h3 className="text-cyan-400 mb-2">Discount</h3>
            <p>${product.discountPrice}</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl">
            <h3 className="text-cyan-400 mb-2">Stock</h3>
            <p>{product.stock}</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl">
            <h3 className="text-cyan-400 mb-2">SKU</h3>
            <p>{product.sku}</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl">
            <h3 className="text-cyan-400 mb-2">Category</h3>
            <p>{product.category}</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl">
            <h3 className="text-cyan-400 mb-2">Tags</h3>

            <div className="flex flex-wrap gap-2">
              {product.tags?.map((tag) => (
                <span
                  key={tag}
                  className="bg-cyan-500 text-black px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}