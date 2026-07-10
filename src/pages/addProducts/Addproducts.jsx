import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ArrowLeft, ImagePlus, Package, X, Plus, Loader2, CheckCircle2 } from "lucide-react";

const api = axios.create({
  baseURL: "https://e-commerce-api-3wara.vercel.app",
});

const DEV_FALLBACK_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNDNjYmQ0MzMwYTZjN2ZkYWZlOTc1ZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0MzY5NzY4NywiZXhwIjoxNzg0MTI5NjfQ.-QGbSF3VUf6y80VcN5w909MqauW90439-M42W0GqV7Y";

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || DEV_FALLBACK_TOKEN;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function AddProduct({ onBack, onCreated }) {
  const [images, setImages] = useState([]); 
  const [imagesError, setImagesError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      price: "",
      discountPrice: "",
      stock: "",
      sku: "",
      category: "electronics",
      subcategory: "",
      brand: "",
      featured: false,
      isActive: true,
    },
  });

  const priceValue = watch("price");

  const categories = [
    "electronics",
    "fashion",
    "home",
    "beauty",
    "sports",
    "toys",
    "books",
    "other",
  ];

  const addFiles = (fileList) => {
    const files = Array.from(fileList).filter((f) =>
      ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(f.type)
    );
    const mapped = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...mapped]);
    if (mapped.length) setImagesError("");
  };

  const handleFileInput = (e) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }, []);

  const removeImage = (index) => {
    setImages((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].preview);
      next.splice(index, 1);
      return next;
    });
  };

  const addTag = () => {
    const value = tagInput.trim();
    if (value && !tags.includes(value)) {
      setTags((prev) => [...prev, value]);
    }
    setTagInput("");
  };

  const removeTag = (tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const resetForm = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setTags([]);
    setImagesError("");
    reset();
  };

  const onSubmit = async (data) => {
    setApiError("");

    if (images.length === 0) {
      setImagesError("Upload at least one image");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", data.name.trim());
      fd.append("shortDescription", data.shortDescription.trim());
      fd.append("description", data.description.trim());
      fd.append("price", data.price);
      if (data.discountPrice) fd.append("discountPrice", data.discountPrice);
      fd.append("stock", data.stock);
      fd.append("sku", data.sku.trim());
      fd.append("category", data.category);
      if (data.subcategory) fd.append("subcategory", data.subcategory.trim());
      fd.append("brand", data.brand.trim());
      fd.append("featured", data.featured);
      fd.append("isActive", data.isActive);
      tags.forEach((tag) => fd.append("tags", tag));
      images.forEach((img) => fd.append("images", img.file));

      const { data: res } = await api.post("/products", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      onCreated?.(res.product);

      setTimeout(() => {
        setSuccess(false);
        resetForm();
      }, 1800);
    } catch (err) {
      const resData = err.response?.data;
      let message = resData?.message || "Failed to create product. Please try again.";
      const details = resData?.errors || resData?.details;
      if (details) {
        const list = Array.isArray(details)
          ? details.map((d) => d.message || d.msg || JSON.stringify(d)).join(" — ")
          : typeof details === "object"
          ? Object.entries(details)
              .map(([field, msg]) => `${field}: ${msg}`)
              .join(" — ")
          : String(details);
        message = `${message}: ${list}`;
      }

      setApiError(message);
      console.error("Product create failed:", resData || err);
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (field) =>
    `ap-input${errors[field] ? " ap-input-error" : ""}`;

  return (
    <div className="ap-root">
      <style>{css}</style>

      <div className="ap-wrap">
        {/* Hero */}
        <div className="ap-hero">
          <button type="button" onClick={onBack} className="ap-back">
            <ArrowLeft size={16} />
            Back to products
          </button>

          <div className="ap-hero-row">
            <div className="ap-hero-left">
              <div className="ap-hero-icon">
                <Package className="ap-cyan-icon" size={26} />
              </div>
              <div>
                <p className="ap-eyebrow">CREATE PRODUCT</p>
                <h1 className="ap-title">Launch a polished product entry</h1>
                <p className="ap-subtitle">
                  Add products with validation, image previews, multi-upload support, and smooth UX.
                </p>
              </div>
            </div>

            <div className="ap-ready">
              <p className="ap-ready-label">READY</p>
              <p className="ap-ready-text">Create, validate, and save with one click.</p>
            </div>
          </div>
        </div>

        {apiError && <div className="ap-alert">{apiError}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="ap-grid">
            {/* Gallery */}
            <div className="ap-card">
              <div className="ap-card-head">
                <div className="ap-icon-box">
                  <ImagePlus className="ap-cyan-icon" size={20} />
                </div>
                <div>
                  <h2 className="ap-card-title">Gallery</h2>
                  <p className="ap-card-sub">Upload multiple images and preview instantly.</p>
                </div>
              </div>

              {images.length > 0 && (
                <div className="ap-image-grid">
                  {images.map((img, i) => (
                    <div key={i} className="ap-image-item">
                      <img src={img.preview} alt="" />
                      <button onClick={() => removeImage(i)} className="ap-image-remove" type="button">
                        <X size={13} />
                      </button>
                      <span className="ap-image-label">IMAGE {i + 1}</span>
                    </div>
                  ))}
                </div>
              )}

              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`ap-dropzone${dragActive ? " ap-dropzone-active" : ""}`}
              >
                <ImagePlus className="ap-cyan-icon" size={22} />
                <span className="ap-dropzone-title">Upload images</span>
                <span className="ap-dropzone-sub">PNG, JPG, WEBP • multiple files supported</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  className="ap-hidden-input"
                  onChange={handleFileInput}
                />
              </label>
              {imagesError && <p className="ap-error-text">{imagesError}</p>}

              <div className="ap-tip">
                <span className="ap-tip-star">✦</span>
                <div>
                  <p className="ap-tip-title">Senior UX</p>
                  <p className="ap-tip-text">
                    Optimized product creation experience with responsive design and smooth interactions.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="ap-card">
              <div className="ap-field">
                <label className="ap-label">Product Name</label>
                <input
                  className={fieldClass("name")}
                  placeholder="iPhone 16 Pro"
                  {...register("name", { required: "Product name is required" })}
                />
                {errors.name && <p className="ap-error-text">{errors.name.message}</p>}
              </div>

              <div className="ap-field">
                <label className="ap-label">Short Description</label>
                <input
                  className={fieldClass("shortDescription")}
                  placeholder="Minimum 10 characters"
                  {...register("shortDescription", {
                    required: "Short description is required",
                    minLength: { value: 10, message: "Minimum 10 characters" },
                  })}
                />
                {errors.shortDescription && (
                  <p className="ap-error-text">{errors.shortDescription.message}</p>
                )}
              </div>

              <div className="ap-field">
                <label className="ap-label">Description</label>
                <textarea
                  rows={4}
                  className={fieldClass("description")}
                  placeholder="Minimum 20 characters"
                  {...register("description", {
                    required: "Description is required",
                    minLength: { value: 20, message: "Minimum 20 characters" },
                  })}
                />
                {errors.description && <p className="ap-error-text">{errors.description.message}</p>}
              </div>

              <div className="ap-row-2">
                <div className="ap-field">
                  <label className="ap-label">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className={fieldClass("price")}
                    placeholder="0.00"
                    {...register("price", {
                      required: "Enter a valid price",
                      min: { value: 0.01, message: "Enter a valid price" },
                    })}
                  />
                  {errors.price && <p className="ap-error-text">{errors.price.message}</p>}
                </div>
                <div className="ap-field">
                  <label className="ap-label">Discount Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className={fieldClass("discountPrice")}
                    placeholder="0.00"
                    {...register("discountPrice", {
                      validate: (value) =>
                        !value ||
                        Number(value) < Number(priceValue || 0) ||
                        "Must be less than price",
                    })}
                  />
                  {errors.discountPrice && (
                    <p className="ap-error-text">{errors.discountPrice.message}</p>
                  )}
                </div>
              </div>

              <div className="ap-row-2">
                <div className="ap-field">
                  <label className="ap-label">Stock</label>
                  <input
                    type="number"
                    className={fieldClass("stock")}
                    placeholder="0"
                    {...register("stock", {
                      required: "Enter valid stock quantity",
                      min: { value: 0, message: "Enter valid stock quantity" },
                    })}
                  />
                  {errors.stock && <p className="ap-error-text">{errors.stock.message}</p>}
                </div>
                <div className="ap-field">
                  <label className="ap-label">SKU</label>
                  <input
                    className={fieldClass("sku")}
                    placeholder="WH-001"
                    {...register("sku", { required: "SKU is required" })}
                  />
                  {errors.sku && <p className="ap-error-text">{errors.sku.message}</p>}
                </div>
              </div>

              <div className="ap-row-2">
                <div className="ap-field">
                  <label className="ap-label">Category</label>
                  <select
                    className={fieldClass("category")}
                    {...register("category", { required: "Category is required" })}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ap-field">
                  <label className="ap-label">Subcategory</label>
                  <input
                    className="ap-input"
                    placeholder="audio"
                    {...register("subcategory")}
                  />
                </div>
              </div>

              <div className="ap-field">
                <label className="ap-label">Brand</label>
                <input
                  className={fieldClass("brand")}
                  placeholder="Sony"
                  {...register("brand", { required: "Brand is required" })}
                />
                {errors.brand && <p className="ap-error-text">{errors.brand.message}</p>}
              </div>

              <div className="ap-field">
                <label className="ap-label">Tags</label>
                <div className="ap-tag-row">
                  <input
                    className="ap-input"
                    placeholder="Type a tag and press +"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                  />
                  <button onClick={addTag} type="button" className="ap-tag-add">
                    <Plus size={18} />
                  </button>
                </div>
                {tags.length > 0 ? (
                  <div className="ap-tag-list">
                    {tags.map((tag) => (
                      <span key={tag} className="ap-tag-chip">
                        {tag}
                        <button onClick={() => removeTag(tag)} type="button">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="ap-hint">Add one or more tags to organize the product.</p>
                )}
              </div>

              <div className="ap-checks">
                <label className="ap-check">
                  <input type="checkbox" {...register("featured")} />
                  <span>Featured</span>
                </label>
                <label className="ap-check">
                  <input type="checkbox" {...register("isActive")} />
                  <span>Active</span>
                </label>
              </div>

              <div className="ap-actions">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    onBack?.();
                  }}
                  className="ap-btn-cancel"
                >
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="ap-btn-submit">
                  {submitting && <Loader2 size={16} className="ap-spin" />}
                  {success && <CheckCircle2 size={16} />}
                  {submitting ? "Creating..." : success ? "Created!" : "Create Product"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
const css = `
.ap-root { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; background: #f8fafc; padding: 24px 16px; }
.ap-wrap { max-width: 1152px; margin: 0 auto; }

.ap-hero { position: relative; overflow: hidden; border-radius: 24px; background: #020617; color: #fff; padding: 32px; margin-bottom: 24px; }
.ap-back { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; background: rgba(255,255,255,0.1); border: none; color: #ffffff !important; border-radius: 999px; padding: 8px 16px; margin-bottom: 24px; cursor: pointer; transition: background 0.2s; }
.ap-back:hover { background: rgba(255,255,255,0.2); }

.ap-hero-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
.ap-hero-left { display: flex; align-items: flex-start; gap: 16px; }
.ap-hero-icon { width: 56px; height: 56px; border-radius: 16px; background: rgba(34,211,238,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ap-cyan-icon { color: #22d3ee; }
.ap-eyebrow { color: #22d3ee !important; font-size: 11px; font-weight: 700; letter-spacing: 2px; margin: 0 0 4px; }
.ap-title { color: #ffffff !important; font-size: 30px; font-weight: 800; line-height: 1.2; margin: 0 0 8px; }
.ap-subtitle { color: #94a3b8 !important; max-width: 420px; font-size: 14px; margin: 0; }

.ap-ready { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 16px 20px; flex-shrink: 0; }
.ap-ready-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #94a3b8 !important; margin: 0 0 4px; }
.ap-ready-text { font-size: 14px; color: #e2e8f0 !important; margin: 0; }

.ap-alert { margin-bottom: 24px; border-radius: 12px; background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; padding: 12px 16px; font-size: 14px; }

.ap-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
@media (min-width: 1024px) { .ap-grid { grid-template-columns: 1fr 1fr; } }

.ap-card { background: #fff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 1px 2px rgba(0,0,0,0.04); height: fit-content; }
.ap-card-head { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.ap-icon-box { width: 40px; height: 40px; border-radius: 12px; background: #ecfeff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ap-card-title { font-weight: 700; margin: 0; font-size: 16px; }
.ap-card-sub { font-size: 12px; color: #64748b; margin: 2px 0 0; }

.ap-image-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
.ap-image-item { position: relative; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
.ap-image-item img { width: 100%; height: 128px; object-fit: cover; display: block; }
.ap-image-remove { position: absolute; top: 8px; right: 8px; width: 24px; height: 24px; border-radius: 999px; background: rgba(0,0,0,0.6); color: #fff; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.ap-image-label { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.5); color: #fff; font-size: 10px; letter-spacing: 1.5px; font-weight: 600; text-align: center; padding: 4px 0; }

.ap-dropzone { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; border: 2px dashed #a5f3fc; background: rgba(236,254,255,0.5); border-radius: 16px; padding: 32px 16px; cursor: pointer; transition: all 0.2s; text-align: center; }
.ap-dropzone:hover, .ap-dropzone-active { border-color: #22d3ee; background: #ecfeff; }
.ap-dropzone-title { font-weight: 600; color: #1e293b; font-size: 14px; }
.ap-dropzone-sub { font-size: 12px; color: #64748b; }
.ap-hidden-input { display: none; }

.ap-tip { margin-top: 16px; border-radius: 12px; background: #ecfdf5; border: 1px solid #d1fae5; padding: 12px 16px; display: flex; gap: 8px; align-items: flex-start; }
.ap-tip-star { color: #10b981; margin-top: 2px; }
.ap-tip-title { font-size: 14px; font-weight: 600; color: #065f46; margin: 0; }
.ap-tip-text { font-size: 12px; color: rgba(6,95,70,0.8); margin: 2px 0 0; }

.ap-field { margin-bottom: 20px; }
.ap-label { display: block; font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 6px; }
.ap-input, select.ap-input, textarea.ap-input {
  width: 100%; box-sizing: border-box; padding: 12px 16px; border-radius: 12px;
  border: 1px solid #e2e8f0; background: #f8fafc; color: #0f172a; font-size: 14px;
  outline: none; transition: all 0.2s; font-family: inherit;
}
.ap-input::placeholder { color: #94a3b8; }
.ap-input:focus { background: #fff; border-color: #22d3ee; box-shadow: 0 0 0 3px rgba(34,211,238,0.15); }
.ap-input-error { border-color: #f87171; background: #fef2f2; }
textarea.ap-input { resize: vertical; }

.ap-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.ap-error-text { font-size: 12px; color: #ef4444; margin: 4px 0 0; }
.ap-hint { font-size: 12px; color: #94a3b8; margin: 8px 0 0; }

.ap-tag-row { display: flex; gap: 8px; }
.ap-tag-add { flex-shrink: 0; width: 48px; height: 48px; border-radius: 12px; background: #1e293b; color: #fff; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; }
.ap-tag-add:hover { background: #0f172a; }
.ap-tag-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.ap-tag-chip { display: inline-flex; align-items: center; gap: 6px; background: #ecfeff; color: #0e7490; font-size: 12px; font-weight: 500; padding: 6px 12px; border-radius: 999px; }
.ap-tag-chip button { background: none; border: none; cursor: pointer; display: flex; color: #0e7490; padding: 0; }

.ap-checks { display: flex; gap: 16px; padding-top: 4px; margin-bottom: 20px; }
.ap-check { display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; font-size: 14px; font-weight: 500; color: #334155; }
.ap-check input { width: 16px; height: 16px; cursor: pointer; }

.ap-actions { display: flex; justify-content: flex-end; gap: 12px; padding-top: 16px; border-top: 1px solid #f1f5f9; }
.ap-btn-cancel { padding: 10px 20px; border-radius: 12px; font-size: 14px; font-weight: 600; color: #64748b; background: #f1f5f9; border: none; cursor: pointer; transition: background 0.2s; }
.ap-btn-cancel:hover { background: #e2e8f0; }
.ap-btn-submit { padding: 10px 24px; border-radius: 12px; font-size: 14px; font-weight: 600; color: #fff; background: #22d3ee; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: background 0.2s; }
.ap-btn-submit:hover { background: #06b6d4; }
.ap-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.ap-spin { animation: ap-spin 1s linear infinite; }
@keyframes ap-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;
