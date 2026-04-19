'use client'
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
  return (
    <div>
      <section className="fixed top-0 w-full flex justify-between items-center px-4 md:px-12 py-2 z-[100] bg-white/70 backdrop-blur-xl border-b border-black/5">
          <div className="text-xl md:text-2xl font-extrabold tracking-tighter">
            M<span className="text-green-700">S</span>M
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-10 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-600">
            <Link href='/'className="hover:text-green-700 transition-all ">Home</Link>
            <Link prefetch={true} href ='/Collection'  className="hover:text-green-700 transition-all">Collection</Link>
            <button  className="hover:text-green-700 transition-all uppercase">Vision</button>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" onClick={()=> setshowpop(!showpop)} className="hidden md:flex bg-green-900 text-white py-2 px-6 md:py-3 md:px-8 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-green-800 transition-all shadow-xl shadow-green-900/20">
              Inquire
            </a>
            
            {/* Mobile Toggle Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-black transition-transform active:scale-90"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </section>

        {/* --- MOBILE MENU OVERLAY --- */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ y: 0 }}
              animate={{ y: '10%' }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed rounded-lg  z-10 inset-0 z-[90] bg-white/10 backdrop-blur-md flex flex-col items-center justify-center space-y-8 lg:hidden h-[300px]"
            >
              <section className="flex flex-col items-center space-y-3">
                {/* Mobile Navigation Links */}
                <Link 
                  href="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-xl mt-4 font-bold hover:text-green-700 transition-colors"
                >
                  Home
                </Link>

                <Link 
                  href="/Collection" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-xl mt-4 font-bold hover:text-green-700 transition-colors"
                >
                  Collections
                </Link>

                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    // Add vision logic here if needed
                  }}
                  className="text-xl mt-4 font-bold hover:text-green-700 transition-colors"
                >
                  Our Vision
                </button>
              </section>
              
              <button onClick={()=> setshowpop(!showpop)} className="bg-green-900 text-white py-4 px-10 rounded-full text-xs font-bold uppercase tracking-widest">
                Inquire Now
              </button>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  )
}

export default Navbar