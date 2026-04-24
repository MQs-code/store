"use client";
import React, { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import imageCompression from "browser-image-compression";
import { addProduct, bulkAddProducts } from "../server/action";
import supabase from "../server/supabase";
import ProductCard from "../Productcard/page.jsx";
import Swal from "sweetalert2";
import { Search, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Collection() {
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ==========================================
  // --- ADMIN AUTHENTICATION LOGIC ---
  // ==========================================
  const validateAdmin = async () => {
  const { value: password } = await Swal.fire({
    title: "ADMIN PORTAL",
    input: "password",
    inputLabel: "Identity Verification Required",
    confirmButtonText: "AUTHENTICATE",
    showCancelButton: true,
    background: "#ffffff",
    buttonsStyling: false, 

    // --- REFINED RESPONSIVE SIZING ---
    customClass: {
      // Mobile: 90% width, smaller padding | Desktop: 480px width, larger padding
      popup: "rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border border-green-900/5 w-[90%] max-w-[480px] p-6 md:p-14 !m-0",
      
      // Responsive typography
      title: "serif text-xl md:text-4xl font-medium tracking-tight text-green-950 mb-2",
      inputLabel: "text-[8px] md:text-[10px] font-bold tracking-[0.3em] text-green-900/40 uppercase mb-4",
      
      // Compact input for mobile
      input: "rounded-xl md:rounded-2xl border-none bg-stone-50 py-4 md:py-8 text-center text-xl md:text-3xl tracking-[0.5em] text-green-950 focus:ring-1 focus:ring-green-900/10 mx-auto w-full",
      
      // Responsive button scale
      confirmButton: "bg-green-900 hover:bg-green-950 text-white rounded-full px-8 md:px-12 py-3 md:py-5 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-green-900/40 transition-all active:scale-95 m-2 w-full md:w-auto",
      cancelButton: "text-stone-400 hover:text-stone-600 font-bold text-[9px] md:text-[10px] uppercase tracking-widest transition-colors m-2"
    },
    
    backdrop: `rgba(6, 78, 59, 0.12)`,
    heightAuto: false, // Prevents layout shifts on mobile
  });

  if (password === "admin123") return true;

  if (password !== undefined) {
    Swal.fire({
      icon: "error",
      title: "ACCESS DENIED",
      buttonsStyling: false,
      customClass: {
        popup: "rounded-[2rem] w-[85%] max-w-[350px] p-8",
        title: "serif font-bold text-red-900 text-lg",
        confirmButton: "bg-red-900 text-white rounded-full px-8 py-3 text-[10px] font-bold uppercase tracking-widest"
      }
    });
  }
  return false;
};

  // ==========================================
  // --- PRODUCT DATA FETCHING ---
  // ==========================================
  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) {
      setProducts(data);
      localStorage.setItem("cached_products", JSON.stringify(data));
    }
    setLoading(false);
    setIsUploading(false);
  };

  useEffect(() => {
    const cachedData = localStorage.getItem("cached_products");
    if (cachedData) {
      setProducts(JSON.parse(cachedData));
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // ==========================================
  // --- SEARCH & FILTER LOGIC ---
  // ==========================================
  useEffect(() => {
    const timer = setTimeout(() => setIsSearchExpanded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, products]);

  // ==========================================
  // --- EXCEL UPLOAD HANDLING ---
  // ==========================================
 const handleExcelUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // IMPORTANT: Do NOT put validateAdmin() here. 
  // It was already checked when the user clicked the button.

  setIsUploading(true);
  const reader = new FileReader();
  reader.onload = async (evt) => {
    try {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const rawData = XLSX.utils.sheet_to_json(wb.Sheets[wsname]);

      // Clean your data for the server
      const cleanData = rawData.map(item => ({
  name: String(item.name || "New Asset"),
  price: Number(item.price || 0),
  description: String(item.description || ""),
  // Change the key here to 'images' to match your database column
  images: String(item.image || "") 
}));
      await bulkAddProducts(cleanData);
      fetchProducts();
      
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
      e.target.value = ""; // Clears the file so the button is ready again
    }
  };
  reader.readAsBinaryString(file);
};

  // ==========================================
  // --- SINGLE PRODUCT SUBMISSION ---
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const imageFile = formData.get("image");

    try {
      if (imageFile && imageFile.size > 0) {
        const options = { maxSizeMB: 0.1, maxWidthOrHeight: 1024 };
        const compressedFile = await imageCompression(imageFile, options);
        formData.set("image", compressedFile, imageFile.name);
      }
      const result = await addProduct(formData);
      if (result.success) {
        setIsOpen(false);
        setImagePreview(null);
        form.reset();
        Swal.fire({
          icon: "success",
          title: "ASSET PUBLISHED",
          text: "Item successfully added to the curated collection.",
          buttonsStyling: false,
          customClass: {
            popup: "rounded-[3rem] p-12",
            title: "serif font-bold text-green-900",
            confirmButton: "bg-green-900 text-white rounded-full px-12 py-4 font-bold text-[10px] uppercase tracking-widest"
          }
        });
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  // ==========================================
  // --- UI STATE MANAGERS ---
  // ==========================================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-is-open');
    } else {
      document.body.classList.remove('menu-is-open');
    }
  }, [isMenuOpen]);

  return (
    <main className="min-h-screen bg-[#FDFDFD] pb-24 lg:pb-32 selection:bg-green-900 selection:text-white overflow-x-hidden">
      
      {/* GLOBAL LOADING OVERLAY */}
      <AnimatePresence>
        {isUploading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-white/70 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <Loader2 className="text-green-900 w-12 h-12" />
            </motion.div>
            <p className="mt-4 serif italic text-green-900 tracking-widest uppercase text-[10px] font-bold">Synchronizing Gallery...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <div className="pt-30 pb-10 px-6 max-w-7xl mx-auto relative">
        <div className="text-left md:text-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <span className="text-[10px] font-black tracking-[0.5em] text-green-900/40 uppercase mb-4 block">
            Limited Inventory
          </span>
          <h1 className="text-[11vw] md:text-[7.5rem] font-light tracking-tighter text-slate-900 uppercase leading-[0.8] mb-10">
            Curated{" "}
            <span className="font-serif italic font-bold text-green-900">
              Collection
            </span>
          </h1>
        </div>

        {/* SEARCH BAR */}
       <div className={`relative mx-auto transition-all duration-700 z-[100] 
  ${isSearchExpanded 
    ? "w-[90vw] md:w-full max-w-2xl opacity-100" // Mobile: 90% of screen width | Desktop: max-w-2xl
    : "w-12 md:w-full md:max-w-5xl opacity-100"
  }`}
  style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }} // Smooth luxury easing
>
          <div className="fixed top-20 right-4 md:relative md:top-0 md:right-0 flex items-center justify-end">
            <input
              type="text"
              placeholder="Search masterpieces..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`transition-all duration-700 outline-none ${isSearchExpanded ? "absolute right-0 w-[280px] md:w-full bg-white backdrop-blur-3xl border border-green-700/20 py-3 md:py-4 pl-10 pr-12 rounded-2xl shadow-lg opacity-100" : "w-0 opacity-0 md:w-full md:opacity-100 md:relative md:bg-white/60 md:backdrop-blur-3xl md:border md:border-green-700/20 md:py-4 md:pl-10 md:pr-12 md:rounded-full md:shadow-none border-none shadow-none pointer-events-none md:pointer-events-auto"} text-slate-900`}
            />
            <div className="absolute right-3 flex items-center">
              {isSearchExpanded ? (
                <button onClick={() => setIsSearchExpanded(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100/50 text-slate-500"><X size={16} /></button>
              ) : (
                <button onClick={() => setIsSearchExpanded(true)} className={`search-icon-trigger relative w-10 h-10 flex items-center justify-center rounded-full bg-transparent text-black transition-all duration-300 md:hidden ${(typeof isMenuOpen !== "undefined" && isMenuOpen) ? "opacity-0 pointer-events-none" : "opacity-100"}`}><Search size={20} /></button>
              )}
              <div className="hidden md:block text-slate-400 mr-2 "><Search size={20} /></div>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS GRID */}
     <div className="max-w-full mx-auto overflow-hidden">
  {filteredProducts.length > 0 ? (
    <div className="flex flex-nowrap overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 pb-12 md:grid md:grid-cols-3 md:flex-wrap md:px-12 gap-8 md:gap-12">
      {filteredProducts.map((item, index) => (
        <div key={item.id} className="shrink-0 w-[280px] md:w-full snap-center animate-in fade-in slide-in-from-right-10 duration-1000" style={{ animationDelay: `${index * 100}ms` }}>
          <ProductCard product={item} refreshData={fetchProducts} validateAdmin={validateAdmin} />
        </div>
      ))}
    </div>
  ) : (
    /* --- EMPTY STATE --- */
    <div className="flex flex-col items-center justify-center py-40 px-6 text-center">
      <h3 className="serif text-2xl font-medium text-slate-900 italic mb-2">No products added yet</h3>
      <p className="text-slate-500 text-sm tracking-widest uppercase font-bold opacity-50">
        Gallery is currently empty
      </p>
    </div>
  )}
</div>

      {/* FLOATING ACTION BUTTONS */}
   <div className=" fixed bottom-10 right-6 md:right-10 flex flex-col gap-3 z-50 ">
        {/* XLS BUTTON */}
       <button
  type="button"
  onClick={async () => {
    // 1. Ask for password ONLY ONCE
    const isAdmin = await validateAdmin(); 
    
    // 2. ONLY if correct, open the file picker
    if (isAdmin) {
      const fileInput = document.getElementById('xls-upload');
      if (fileInput) fileInput.click();
    }
  }}
  className="hidden md:flex bg-blue-500 text-white font-bold rounded-full p-4 shadow-2xl"
>
  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">XLS</span>
  <input 
    id="xls-upload" 
    type="file" 
    className="hidden" 
    onChange={handleExcelUpload} 
    accept=".xlsx, .xls"
  />
</button>

        {/* ADD PRODUCT BUTTON WITH AUTH */}
        <button
          onClick={async () => { 
            if (await validateAdmin()) setIsOpen(true); 
          }}
          className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-green-900 text-white flex items-center justify-center shadow-2xl active:scale-95 transition-all hover:bg-green-800"
        >
          <span className="text-3xl md:text-5xl font-light">+</span>
        </button>
      </div>

      {/* ASSET MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md"
          >
            <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                className="bg-white w-full max-w-[500px] rounded-t-[3rem] sm:rounded-[2.5rem] p-8 relative shadow-2xl"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-3 top-8 text-black/40 hover:text-red-500 transition-colors"
              >
                <X size={24} />
              </button>
              <h2 className="serif font-bold text-2xl mb-6 text-green-900 tracking-tight">ADD NEW PRODUCT</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-green-900/20 rounded-[2rem] bg-slate-50 overflow-hidden cursor-pointer hover:bg-green-50/50 transition-colors">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      className="h-full w-full object-cover"
                      alt="preview"
                    />
                  ) : (
                    <div className="text-center">
                        <div className="bg-green-900/10 p-3 rounded-full mb-2 inline-block">
                             <Loader2 className="text-green-900 w-5 h-5 opacity-20" />
                        </div>
                        <p className="text-[10px] font-black tracking-widest text-green-900/40 uppercase">Upload Preview</p>
                    </div>
                  )}
                  <input
                    type="file"
                    name="image"
                    className="hidden"
                    onChange={handleImageChange}
                    required
                  />
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  className="w-full py-4 border-b border-slate-100 outline-none focus:border-green-900 transition-colors serif font-bold"
                  required
                />
                     <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  className="w-full py-4 border-b border-slate-100 outline-none focus:border-green-900 transition-colors font-bold"
                
                />
                <input
                  type="text"
                  name="price"
                  placeholder="Price "
                  className="w-full py-4 border-b border-slate-100 outline-none focus:border-green-900 transition-colors font-bold"
                  required
                />
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-5 bg-green-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-green-900/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isUploading ? "Processing..." : "Publish to Collection"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .menu-is-open .search-icon-trigger { opacity: 0 !important; pointer-events: none !important; }
      `}</style>
    </main>
  );
}