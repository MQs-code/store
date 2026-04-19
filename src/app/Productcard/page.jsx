"use client";
import React, { useState } from 'react';
import { ChevronRight, X, Trash2, Edit3, Check, AlertTriangle } from 'lucide-react';
import { sendWhatsAppMessage } from '../utils/whatsapp';
import { deleteProduct, updateProduct } from '../server/action';

const ProductCard = ({ product, refreshData }) => {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State for Editing
  const [editForm, setEditForm] = useState({
    name: product.name,
    price: product.price,
    description: product.description || ""
  });

  // --- ACTIONS ---
  const handleDelete = async () => {
    setIsProcessing(true);
    const res = await deleteProduct(product.id, product.image_url);
    if (res.success) {
      refreshData();
      setShowDeleteModal(false);
    } else {
      alert(res.message);
    }
    setIsProcessing(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const res = await updateProduct(product.id, editForm);
    if (res.success) {
      refreshData();
      setShowEditModal(false);
    } else {
      alert(res.message);
    }
    setIsProcessing(false);
  };

  return (
    <>
      <div className="group relative bg-white border border-slate-100 rounded-3xl transition-all duration-500 shadow-2xl flex flex-col overflow-hidden max-w-[250px] h-[350px] sm:h-auto sm:max-w-full mx-auto">
        
       <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 translate-y-0 md:translate-y-2 md:group-hover:translate-y-0">
  
  <button onClick={() => setShowEditModal(true)} className="p-3 bg-white/90 backdrop-blur rounded-2xl text-slate-700 hover:bg-black hover:text-white shadow-xl transition-all">
    <Edit3 size={18} />
  </button>

  <button onClick={() => setShowDeleteModal(true)} className="p-3 bg-white/90 backdrop-blur rounded-2xl text-red-500 hover:bg-red-500 hover:text-white shadow-xl transition-all">
    <Trash2 size={18} />
  </button>

</div>
        <div className="relative aspect-square sm:aspect-[5/4] bg-black/5 overflow-hidden">
          <img src={product.image_url} className="h-full w-full object-contain p-6 sm:p-8 transition-transform duration-700 group-hover:scale-110" alt={product.name} />
        </div>

        <div className="p-5 sm:p-8 flex flex-col flex-grow">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">{product.name}</h3>
          <p className="text-xl sm:text-2xl font-black text-green-900 mb-4">{product.price} PKR</p>
          
          <button onClick={() => setShowBuyModal(true)} className="mt-auto w-full bg-green-900 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold uppercase text-[9px] sm:text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-black transition-all">
            Buy Now <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* --- MODAL WRAPPER FUNCTION --- */}
      {/* 1. EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative animate-in zoom-in-95">
            <button onClick={() => setShowEditModal(false)} className="absolute top-6 right-6 p-2 hover:bg-green-900 rounded-full text-slate-400 hover:text-white"><X size={24}/></button>
            <h2 className="text-3xl font-serif font-bold mb-8">Edit Product</h2>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Product Name</label>
                <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-green-900/20 text-black" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Price (PKR)</label>
                <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-green-900/20 text-black" value={editForm.price} onChange={(e) => setEditForm({...editForm, price: e.target.value})} required />
              </div>
              <button disabled={isProcessing} className="w-full py-5 bg-green-900 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-green-900/20 hover:bg-black transition-all">
                {isProcessing ? "Updating..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
       <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
         <div className="bg-white w-full max-w-[90%] sm:max-w-sm rounded-[2.5rem] p-6 sm:p-10 text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Are you sure?</h2>
            <p className="text-slate-500 text-sm mb-8">This will permanently remove <span className="font-bold text-slate-900">{product.name}</span> from your store and storage.</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleDelete} disabled={isProcessing} className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all">
                {isProcessing ? "Deleting..." : "Yes, Delete Product"}
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="w-full py-4 bg-black/10 text-slate-500 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-slate-200">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. BUY MODAL */}
      {showBuyModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="h-48 bg-slate-50 relative flex items-center justify-center">
              <img src={product.image_url} className="h-full object-contain p-6" alt="buy" />
              <button onClick={() => setShowBuyModal(false)} className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-black"><X size={20}/></button>
            </div>
            <div className="p-10 text-center">
              <h2 className="text-2xl font-bold mb-2 text-black">Confirm Order</h2>
              <p className="text-slate-500 text-sm mb-8 italic">Ready to purchase this luxury piece?</p>
              <button onClick={() => sendWhatsAppMessage(product)} className="w-full py-5 bg-green-900 text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-green-900/20 hover:bg-black transition-all">Confirm to WhatsApp</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;