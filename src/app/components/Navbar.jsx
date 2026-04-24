'use client'
import { Menu, X, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), { ssr: false });
const AnimatePresence = dynamic(() => import('framer-motion').then((mod) => mod.AnimatePresence), { ssr: false });

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-is-open');
    } else {
      document.body.classList.remove('menu-is-open');
    }
  }, [isMenuOpen]);

  return (
    <div>
      {/* HIGHLIGHT: 'fixed top-0 left-0' ensures it sticks to the top correctly */}
      <section className="fixed top-0 left-0 w-full flex justify-between items-center px-4 md:px-12 py-2 z-[100] bg-white/20 backdrop-blur-xl border-b border-black/5">
        <div className="text-xl md:text-2xl font-extrabold tracking-tighter">
          M<span className="text-green-700">S</span>M
        </div>

        <div className="hidden lg:flex items-center space-x-10 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-600">
          <Link href='/' className="hover:text-green-700 transition-all">Home</Link>
          <Link href='/Collection' className="hover:text-green-700 transition-all">Collection</Link>
          <Link href='/vision' className="hover:text-green-700 transition-all uppercase">Vision</Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative flex items-center justify-end">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`transition-all duration-700 outline-none 
                ${isSearchExpanded
                  ? "absolute right-0 w-[200px] md:w-64 bg-white border border-green-700/20 py-2 px-4 pr-10 rounded-full shadow-lg opacity-100"
                  : "w-0 opacity-0 border-none shadow-none pointer-events-none"
                } text-slate-900`}
            />
          </div>

          <Link 
            href="/inquire" 
            className="hidden md:flex bg-green-900 text-white py-2 px-6 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-green-800 transition-all"
          >
            Inquire
          </Link>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-black transition-transform active:scale-90 flex md:hidden"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </section>

      {/* --- MOBILE MENU OVERLAY --- */}
    <AnimatePresence>
  {isMenuOpen && (
    /* --- KEY 1: Added key="overlay" --- */
    <MotionDiv 
      key="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] bg-black/20 backdrop-blur-sm lg:hidden"
      onClick={() => setIsMenuOpen(false)} 
    />
  )}

  {isMenuOpen && (
    /* --- KEY 2: Added key="menu" --- */
    <MotionDiv 
      key="menu"
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[90] bg-white/70 backdrop-blur-2xl flex flex-col items-center justify-start pt-20 space-y-6 md:hidden h-[340px] shadow-2xl rounded-b-[3rem] pb-0"
    >
      <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold">Home</Link>
      <Link href="/Collection" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold">Collections</Link>
      <Link href="/vision" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold">Our Vision</Link>
      
      <Link href="/inquire" onClick={() => setIsMenuOpen(false)} className="bg-green-900 text-white py-3 px-8 rounded-full text-xs font-bold uppercase mb-0">
        Inquire Now
      </Link>
    </MotionDiv>
  )}
</AnimatePresence>
    </div>
  )
}

export default Navbar;  