import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  Video, 
  Trash2, 
  Plus, 
  Check, 
  AlertCircle, 
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { Product, Shop } from '../types';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

interface ProductUploadModalProps {
  productToEdit?: Product | null;
  onClose: () => void;
  onSuccess: () => void;
  shops: Shop[];
}

export const ProductUploadModal: React.FC<ProductUploadModalProps> = ({
  productToEdit,
  onClose,
  onSuccess,
  shops,
}) => {
  const { currentUser, currentShop, toast } = useApp();

  const [shopId, setShopId] = useState(
    productToEdit?.shopId || currentShop?.id || (shops.length > 0 ? shops[0].id : '')
  );
  const [name, setName] = useState(productToEdit?.name || '');
  const [category, setCategory] = useState(productToEdit?.category || 'Electronics');
  const [priceRwf, setPriceRwf] = useState(productToEdit ? String(productToEdit.priceRwf) : '');
  const [originalPriceRwf, setOriginalPriceRwf] = useState(
    productToEdit?.originalPriceRwf ? String(productToEdit.originalPriceRwf) : ''
  );
  const [stock, setStock] = useState(productToEdit ? String(productToEdit.stock) : '15');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [featured, setFeatured] = useState(productToEdit?.featured || false);

  // Images and Video state
  const [images, setImages] = useState<string[]>(productToEdit?.images || []);
  const [videoUrl, setVideoUrl] = useState<string>(productToEdit?.videoUrl || '');
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // Specifications
  const [specs, setSpecs] = useState<Array<{ key: string; val: string }>>(() => {
    if (productToEdit?.specs) {
      return Object.entries(productToEdit.specs).map(([key, val]) => ({ key, val }));
    }
    return [
      { key: 'Condition', val: 'Brand New Original' },
      { key: 'Warranty', val: '6 Months Clear Mall Warranty' }
    ];
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Read file as base64 and upload to backend
  const handleFileUpload = async (file: File, isVideo = false) => {
    setIsUploadingMedia(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        if (!base64Data) {
          toast('Failed to read file', 'error');
          setIsUploadingMedia(false);
          return;
        }

        try {
          const res = await api.uploadMedia(base64Data);
          if (isVideo) {
            setVideoUrl(res.url);
            toast('Product video uploaded successfully!', 'success');
          } else {
            setImages((prev) => [...prev, res.url]);
            toast('Product photo uploaded successfully!', 'success');
          }
        } catch (err: any) {
          // Fallback to data URL directly if server disk write fails
          if (isVideo) {
            setVideoUrl(base64Data);
            toast('Video attached', 'info');
          } else {
            setImages((prev) => [...prev, base64Data]);
            toast('Photo attached', 'info');
          }
        } finally {
          setIsUploadingMedia(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setIsUploadingMedia(false);
      toast('Upload failed: ' + err.message, 'error');
    }
  };

  const handleSpecChange = (index: number, field: 'key' | 'val', value: string) => {
    setSpecs((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addSpecRow = () => {
    setSpecs((prev) => [...prev, { key: '', val: '' }]);
  };

  const removeSpecRow = (index: number) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast('Product title is required', 'error');
      return;
    }
    if (!priceRwf || Number(priceRwf) <= 0) {
      toast('Please enter a valid price in RWF', 'error');
      return;
    }
    if (!shopId) {
      toast('Please select a vendor shop', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const specObj: Record<string, string> = {};
      specs.forEach((s) => {
        if (s.key.trim() && s.val.trim()) {
          specObj[s.key.trim()] = s.val.trim();
        }
      });

      const payload = {
        shopId,
        name: name.trim(),
        category,
        priceRwf: Number(priceRwf),
        originalPriceRwf: originalPriceRwf ? Number(originalPriceRwf) : undefined,
        stock: Number(stock) || 1,
        description: description.trim(),
        featured,
        images: images.length > 0 ? images : ['/src/assets/images/product_smartphone_flagship_1790926862084.jpg'],
        videoUrl: videoUrl.trim() || undefined,
        specs: specObj,
      };

      if (productToEdit) {
        await api.updateProduct(productToEdit.id, payload);
        toast(`Updated "${name}" successfully`, 'success');
      } else {
        await api.createProduct(payload);
        toast(`Uploaded "${name}" to Clear Mall 555!`, 'success');
      }

      onSuccess();
    } catch (err: any) {
      toast(err.message || 'Failed to save product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!productToEdit) return;
    if (!window.confirm(`Are you sure you want to delete "${productToEdit.name}"?`)) return;

    try {
      await api.deleteProduct(productToEdit.id);
      toast('Product deleted', 'info');
      onSuccess();
    } catch (err: any) {
      toast(err.message || 'Failed to delete product', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              {productToEdit ? 'Edit Product' : 'Upload New Product'}
            </h2>
            <p className="text-xs text-slate-500">
              Direct photo & video uploads from your phone gallery or live camera.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Shop Selection (if admin or multiple shops) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Shop Storefront *
            </label>
            <select
              value={shopId}
              onChange={(e) => setShopId(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              {shops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.address.split(',')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Product Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Samsung Galaxy S24 Ultra Titanium Pro (512GB)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Category & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="Cars & Automotive">Cars & Automotive</option>
                <option value="Electronics">Electronics & Computing</option>
                <option value="Fashion & Shoes">Fashion, Shoes & Apparel</option>
                <option value="Beauty & Fragrance">Luxury Perfumes & Beauty</option>
                <option value="Home & Living">Home, Furniture & Living</option>
                <option value="Smartphones & Gadgets">Smartphones & Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Stock Inventory Quantity *
              </label>
              <input
                type="number"
                min="1"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Price & Original Price (RWF) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Selling Price (RWF) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="55000"
                  value={priceRwf}
                  onChange={(e) => setPriceRwf(e.target.value)}
                  className="w-full text-xs font-mono font-bold pl-3 pr-12 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  RWF
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Original Regular Price (Optional Discount)
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="70000"
                  value={originalPriceRwf}
                  onChange={(e) => setOriginalPriceRwf(e.target.value)}
                  className="w-full text-xs font-mono pl-3 pr-12 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  RWF
                </span>
              </div>
            </div>
          </div>

          {/* Media Upload Section: Photos & Videos from Phone Gallery / Camera */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Product Photos & Videos
                </span>
                <span className="text-[11px] text-slate-500">
                  Direct capture or select from your phone gallery
                </span>
              </div>
              {isUploadingMedia && (
                <div className="flex items-center gap-1.5 text-xs text-orange-600 font-semibold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </div>
              )}
            </div>

            {/* Hidden native inputs for gallery and camera */}
            <input
              type="file"
              ref={imageInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, false);
              }}
            />
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, false);
              }}
            />
            <input
              type="file"
              ref={videoInputRef}
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, true);
              }}
            />

            {/* Quick Upload Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:border-orange-500 hover:text-orange-600 flex flex-col items-center gap-1 transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-orange-500" />
                <span>Gallery Photo</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-600 flex flex-col items-center gap-1 transition-colors"
              >
                <Camera className="w-4 h-4 text-blue-500" />
                <span>Take Photo</span>
              </button>

              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className="p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-600 flex flex-col items-center gap-1 transition-colors"
              >
                <Video className="w-4 h-4 text-emerald-500" />
                <span>Upload Video</span>
              </button>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-white">
                    <img src={img} alt="Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 p-0.5 bg-rose-600 text-white rounded-full text-[10px]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Video preview / input */}
            {videoUrl && (
              <div className="pt-2 flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                <div className="flex items-center gap-2 truncate">
                  <Video className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold truncate">Video Attached Ready</span>
                </div>
                <button
                  type="button"
                  onClick={() => setVideoUrl('')}
                  className="text-rose-600 hover:underline font-bold text-xs"
                >
                  Remove Video
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Product Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe product highlights, origin, warranty, and package contents..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Specifications Table Builder */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Specifications (Key / Value)
              </label>
              <button
                type="button"
                onClick={addSpecRow}
                className="text-xs text-orange-600 font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>
            </div>
            <div className="space-y-2">
              {specs.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Feature (e.g. Battery)"
                    value={item.key}
                    onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                    className="w-1/2 text-xs px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 5000mAh)"
                    value={item.val}
                    onChange={(e) => handleSpecChange(index, 'val', e.target.value)}
                    className="w-1/2 text-xs px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecRow(index)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="featured-check"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
            />
            <label htmlFor="featured-check" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Feature on CLEAR MALL 555 Homepage Spotlight
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {productToEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-lg border border-rose-200 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{productToEdit ? 'Save Changes' : 'Publish Product'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
