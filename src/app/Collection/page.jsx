"use client";
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import imageCompression from 'browser-image-compression';
import { addProduct, bulkAddProducts } from '../server/action'; 
import supabase from '../server/supabase'; 
import ProductCard from '../Productcard/page.jsx'; 

export default function Collection() {
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setProducts(data);
    if (error) console.error("Fetch Error:", error.message);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      setIsUploading(true);
      const result = await bulkAddProducts(data);
      if (result.success) {
        alert("Excel data uploaded!");
        fetchProducts();
      } else {
        alert("Excel Error: " + result.message);
      }
      setIsUploading(false);
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const imageFile = formData.get('image');

    try {
      if (imageFile && imageFile.size > 0) {
        const options = {
          maxSizeMB: 0.1, 
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(imageFile, options);
        formData.set('image', compressedFile, imageFile.name);
      }

      const result = await addProduct(formData);
      if (result.success) {
        setIsOpen(false);
        setImagePreview(null);
        form.reset();
        fetchProducts();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] pb-24 lg:pb-32">
      {/* Header */}
      <div className="pt-16 pb-8 md:pt-24 md:pb-12 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-light tracking-tighter italic text-black uppercase leading-tight">
          Curated <span className='text-green-900 font-serif font-bold not-italic block sm:inline-block sm:ml-4'>Collection</span>
        </h1>
        <div className="h-[1px] w-12 bg-green-900/30 mx-auto mt-6"></div>
      </div>

      {/* --- Main Gallery Container --- */}
      <div className="max-w-[100vw] mx-auto  md:px-12 py-6 md:py-12">
  {loading ? (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-sm uppercase tracking-widest text-slate-400 animate-pulse font-medium">
        Loading Products...
      </div>
    </div>
  ) : (
    /* Mobile: flex-nowrap + overflow-x-auto for horizontal scroll
       PC: md:grid + md:grid-cols-3 for large, fixed cards (no scroll)
    */
    <div className="flex flex-nowrap overflow-x-auto no-scrollbar md:overflow-visible md:grid md:grid-cols-3 gap-2 md:gap-10">
      {products.map((item) => (
        <div 
          key={item.id} 
          className="snap-start shrink-0 w-[280px] md:w-full"
        >
          <ProductCard product={item} refreshData={fetchProducts} />
        </div>
      ))}
    </div>
  )}
</div>

      {/* --- Responsive Action Buttons --- */}
    <div className="fixed bottom-10 right-10 flex flex-col gap-3 md:gap-4 z-50">
  
  {/* Excel Button - Mobile par 'hidden' class se gayab ho jayega, sirf PC (md size) par 'flex' hoga */}
  <label 
    htmlFor="excel-upload-input"
    className="hidden md:flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-600 text-white shadow-xl cursor-pointer hover:bg-blue-700 hover:-translate-y-1 active:scale-90 transition-all duration-300 group"
  >
    <span className="text-[8px] md:text-[10px] font-black tracking-tighter group-hover:tracking-widest transition-all">XLS</span>
    <input 
      id="excel-upload-input"
      type="file" 
      className="hidden" 
      accept=".xlsx, .xls" 
      onChange={handleExcelUpload} 
      disabled={isUploading} 
    />
  </label>

  {/* Add Product (+) Button - Yeh mobile aur PC dono par nazar aayega */}
  <button 
    onClick={(e) => {
      e.stopPropagation();
      setIsOpen(true);
    }}
    className='w-14 h-14 md:w-20 md:h-20 rounded-full bg-green-900 text-white flex items-center justify-center shadow-2xl hover:bg-black hover:-translate-y-1 active:scale-95 transition-all duration-300'
  >
    <span className='text-3xl md:text-5xl font-light'>+</span>
  </button>
</div>

      {/* --- Add New Product Modal --- */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/70 backdrop-blur-md transition-all animate-in fade-in duration-300"
        >
          <div 
            className="bg-white w-full max-w-[500px] rounded-t-[3rem] sm:rounded-[2.5rem] p-8 sm:p-12 relative shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-500 ease-out" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Handle */}
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8 sm:hidden"></div>
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-serif font-black text-slate-900">Add New Product</h2>
                <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">Inventory Management</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-300 hover:text-red-500">
                <span className="text-xl text-gray-500">✕</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-">
              {/* Image Upload Area */}
              <label className="group relative flex flex-col items-center justify-center w-full h-40 md:h-52 border-2 border-dashed border-green-900 hover:border-green-900/30 rounded-[2rem] cursor-pointer transition-all overflow-hidden bg-slate-50">
                {imagePreview ? (
                  <img src={imagePreview} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Preview"/>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-500 group-hover:text-green-900 group-hover:scale-110 transition-all">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Upload Visual Asset</span>
                  </div>
                )}
                <input type="file" name="image" className="hidden" onChange={handleImageChange} required />
              </label>

            <div className="space-y-5">
  {/* CHANGE 1: Added text-slate-900 and placeholder:text-slate-400 */}
  <input 
    type="text" 
    name="name" 
    placeholder="Collection Name" 
    className="w-full py-4 border-b border-slate-100 outline-none focus:border-green-900 transition-colors text-sm font-medium text-slate-900 placeholder:text-slate-600 bg-transparent" 
    required 
  />

  <div className="relative">
    {/* CHANGE 2: Added text-slate-900 and placeholder:text-slate-400 */}
    <input 
      type="number" 
      name="price" 
      placeholder="Price" 
      className="w-full py-4 border-b border-slate-100 outline-none focus:border-green-900 transition-colors text-sm font-medium pr-12 text-slate-900 placeholder:text-slate-600 bg-transparent" 
      required 
    />
    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600">PKR</span>
  </div>

  {/* CHANGE 3: Added text-slate-900 and placeholder:text-slate-400 */}
  <textarea 
    name="description" 
    placeholder="Small Details..." 
    className="w-full py-2 mb-5 border-b border-slate-100 outline-none focus:border-green-900 transition-colors text-sm resize-none text-slate-900 placeholder:text-slate-600 bg-transparent" 
    required 
  />
</div>

              <button 
                type="submit" 
                disabled={isUploading} 
                className="w-full py-5 bg-green-900 text-white rounded-2xl uppercase text-[11px] font-black tracking-[0.2em] shadow-2xl shadow-green-900/20 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isUploading ? "Processing..." : "Publish to Gallery"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}