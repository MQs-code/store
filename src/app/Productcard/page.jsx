"use client";
import React, { useState } from "react";
import Image from "next/image";

import {
  ChevronRight,
  X,
  Trash2,
  Edit3,
  Check,
  AlertTriangle,
} from "lucide-react";
import { sendWhatsAppMessage } from "../utils/whatsapp";
import { deleteProduct, updateProduct } from "../server/action";
import Swal from "sweetalert2";

const ProductCard = ({ product, refreshData }) => {
  if (!product) return null;

  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image_url);

  const [editForm, setEditForm] = useState({
    name: product.name,
    price: product.price,
    description: product.description || "",
    stock_status: product.stock, // <--- IS LINE KO ADD KAREIN
  });

  // --- ADMIN VALIDATION FIRST ---
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
        popup:
          "rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border border-green-900/5 w-[90%] max-w-[480px] p-6 md:p-14 !m-0",

        // Responsive typography
        title:
          "serif text-xl md:text-4xl font-medium tracking-tight text-green-950 mb-2",
        inputLabel:
          "text-[8px] md:text-[10px] font-bold tracking-[0.3em] text-green-900/40 uppercase mb-4",

        // Compact input for mobile
        input:
          "rounded-xl md:rounded-2xl border-none bg-stone-50 py-4 md:py-8 text-center text-xl md:text-3xl tracking-[0.5em] text-green-950 focus:ring-1 focus:ring-green-900/10 mx-auto w-full",

        // Responsive button scale
        confirmButton:
          "bg-green-900 hover:bg-green-950 text-white rounded-full px-8 md:px-12 py-3 md:py-5 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-green-900/40 transition-all active:scale-95 m-2 w-full md:w-auto",
        cancelButton:
          "text-stone-400 hover:text-stone-600 font-bold text-[9px] md:text-[10px] uppercase tracking-widest transition-colors m-2",
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
          confirmButton:
            "bg-red-900 text-white rounded-full px-8 py-3 text-[10px] font-bold uppercase tracking-widest",
        },
      });
    }
    return false;
  };
  // --- TRIGGER FUNCTIONS ---
  const triggerEdit = async () => {
    if (await validateAdmin()) {
      setShowEditModal(true);
    }
  };

  const triggerDelete = async () => {
    if (await validateAdmin()) {
      setShowDeleteModal(true);
    }
  };

  // --- FINAL ACTIONS ---
  const handleDelete = async () => {
    setIsProcessing(true);
    const result = await deleteProduct(product.id, product.image_url);

    if (result.success) {
      setShowDeleteModal(false);
      Swal.fire({
        icon: "success",
        title: "Inventory Success",
        text: "Product removed from gallery.",
        confirmButtonColor: "#064e3b",
      });
      refreshData();
    } else {
      Swal.fire("Error", result.message, "error");
    }
    setIsProcessing(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const res = await updateProduct(product.id, editForm);
    if (res.success) {
      setShowEditModal(false);
      Swal.fire({
        icon: "success",
        title: "Inventory Success",
        text: "Product details updated.",
        confirmButtonColor: "#064e3b",
      });
      refreshData();
    } else {
      Swal.fire("Error", res.message, "error");
    }
    setIsProcessing(false);
  };

  return (
    <>
      <div className="group relative bg-white border border-slate-100 rounded-3xl transition-all duration-500 shadow-2xl flex flex-col overflow-hidden max-w-[250px] h-[350px] sm:h-auto sm:max-w-full mx-auto">
        {/* Admin Buttons */}
        <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={triggerEdit}
            className="p-3 bg-white/90 backdrop-blur rounded-2xl text-slate-700 hover:bg-black hover:text-white shadow-xl transition-all"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={triggerDelete}
            className="p-3 bg-white/90 backdrop-blur rounded-2xl text-red-500 hover:bg-red-500 hover:text-white shadow-xl transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Instant Load Image */}
        <div className="relative aspect-square sm:aspect-[5/4] bg-black/5 overflow-hidden">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            priority={true}
            // ADD THIS LINE TO FIX THE ERROR:
           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="h-full w-full object-contain p-6 sm:p-8 transition-transform duration-700 group-hover:scale-110"
  onError={() => setImgSrc('https://placehold.co/600x600?text=Premium+Asset')}
          />
        </div>

        <div className="p-5 sm:p-8 flex flex-col flex-grow">
          <div className="flex relative">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                {product?.name}
              </h3>
            </div>
            <div
              className={`absolute right-0 top-1 flex items-center gap-1 px-2 py-0.5 rounded-full border shrink-0 ${product.stock ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${product.stock ? "bg-green-500" : "bg-red-500"} ${product.stock ? "animate-pulse" : ""}`}
              />
              <span
                className={`text-[10px] font-black uppercase tracking-tighter ${product.stock ? "text-green-700" : "text-red-700"}`}
              >
                {product.stock ? "IN STOCK" : "OUT OF STOCK"}
              </span>
            </div>
          </div>

          <p className="text-xl sm:text-2xl font-black text-green-900 mb-4">
            {product.price} PKR
          </p>
          <button
            onClick={() => setShowBuyModal(true)}
            className="mt-auto w-full bg-green-900 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold uppercase text-[9px] sm:text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-black transition-all"
          >
            Buy Now <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* 1. EDIT MODAL (Pops in after password) */}
      {showEditModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-6 right-6 p-2 hover:bg-green-900 rounded-full text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-serif font-bold mb-8">Edit Product</h2>
            <form onSubmit={handleUpdate} className="space-y-6">
              <input
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-green-900/20 text-black"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Name"
                required
              />
              <input
                type="number"
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-green-900/20 text-black"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: e.target.value })
                }
                placeholder="Price"
                required
              />
              {/* --- LINE 152: TOGGLE IN EDIT MODAL --- */}
<div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-black/5 mb-4">
  <div className="flex flex-col">
    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Availability</span>
    <span className={`text-xs font-bold ${editForm.stock_status ? 'text-green-600' : 'text-red-600'}`}>
      {editForm.stock_status ? 'Show as In Stock' : 'Show as Out of Stock'}
    </span>
  </div>

  <button
    type="button"
    onClick={() => setEditForm({ ...editForm, stock_status: !editForm.stock_status })}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
      editForm.stock_status ? 'bg-green-600 shadow-lg shadow-green-900/20' : 'bg-slate-300'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
        editForm.stock_status ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
</div>
              <button
                disabled={isProcessing}
                className="w-full py-5 bg-green-900 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-black transition-all"
              >
                {isProcessing ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. DELETE MODAL (Pops in after password) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="bg-white w-full max-w-[90%] sm:max-w-sm rounded-[2.5rem] p-6 sm:p-10 text-center shadow-2xl">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Confirm Delete
            </h2>
            <p className="text-slate-500 text-sm mb-8">
              Remove <span className="font-bold">{product.name}</span>{" "}
              permanently?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                disabled={isProcessing}
                className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all"
              >
                {isProcessing ? "Deleting..." : "Confirm Delete"}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full py-4 bg-black/10 text-slate-500 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. BUY MODAL */}
      {showBuyModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="h-48 bg-slate-50 relative flex items-center justify-center">
              <Image
                src={imgSrc}
                fill
                className="object-contain p-6"
                alt="buy"
              />
              <button
                onClick={() => setShowBuyModal(false)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full text-black"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-10 text-center">
              <h2 className="text-2xl font-bold mb-2 text-black">
                Confirm Order
              </h2>
              <button
                onClick={() => sendWhatsAppMessage(product)}
                className="w-full py-5 bg-green-900 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-black transition-all"
              >
                WhatsApp Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
