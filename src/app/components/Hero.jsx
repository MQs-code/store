'use client'

import { useState } from "react"; // ADDED for toggle logic
import Image from "next/image";
import KineticText from "./Kinetic";
import { motion } from "framer-motion"; // ADDED AnimatePresence for smooth exit
import { useRouter } from "next/navigation";
import Navbar from './Navbar'
import Link from "next/link";

export default function DemoPage() {
  const router = useRouter();
  const [ showpop, setshowpop ] = useState(false)

  const Handlepop = () => {
    setshowpop(false)
    router.push('/contact')
    
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.4, ease: "easeOut" }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@200..800&display=swap');
        
        #root-body { 
          background: #ffffff !important; 
          color: #050505 !important; 
          font-family: 'Plus Jakarta Sans', sans-serif;
          margin: 0;
          overflow-x: hidden;
        }
        nav, footer { display: none !important; }
        
        .serif { font-family: 'Playfair Display', serif; }
        .text-gradient {
          background: linear-gradient(to right, #064e3b, #15803d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}} />
      
      <main className="min-h-screen w-full">
       
        {/* --- LUXURY NAV BAR --- */}
        <Navbar/>

        {/* --- HERO SECTION --- */}
        <section className="relative pt-32 pb-16 md:pb-20 px-6">
          <motion.div 
            {...fadeInUp}
            className="max-w-7xl mx-auto flex flex-col items-center text-center"
          >
            <div className="inline-block px-4 py-1.5 mb-6 border border-green-800/20 rounded-full bg-green-50">
                <span className="text-[9px] md:text-[10px] font-bold tracking-[0.3em] text-green-900 uppercase">Your New Neighborhood Gathering Spot</span>
            </div>
            
            <h1 className="text-5xl text-black sm:text-7xl md:text-[120px] leading-[1] md:leading-[0.85] serif mb-8">
              Muslim <span className="italic font-medium text-gradient">Shopping</span> <br className="hidden md:block" /> Mall
            </h1>
            
            <p className="max-w-2xl text-base md:text-xl text-gray-500 font-light leading-relaxed mb-10 md:mb-12">
              We’re building more than just a mall; we’re creating a space where tradition feels right at home with modern style. Something special is coming.
            </p>

            <button onClick={()=> setshowpop(!showpop)} className="w-full sm:w-auto px-10 py-4 bg-green-900 text-white rounded-full font-bold tracking-widest text-xs uppercase hover:bg-green-800 transition-all transform hover:scale-105 active:scale-95">
              Explore the Vision
            </button>
          </motion.div>
        </section>

        {/* --- KINETIC SECTION --- */}
        <section className="w-full overflow-hidden">
          <KineticText/>
        </section>

        {/* --- IMAGE DISPLAY SECTION --- */}
        <section className="min-h-[70vh] md:h-[80vh] rounded-t-[2rem] md:rounded-t-3xl flex bg-gradient-to-r from-[#133026] to-[#174032] items-center p-6 md:p-3">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-full md:w-[60vw] max-w-7xl mx-auto flex flex-col items-center text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-[60px] leading-[1.1] md:leading-[0.85] serif mb-6 md:mb-8 text-white">
              A Better Way to <br className="hidden md:block" />
              <span className="italic font-medium text-green-500">Shop & Connect.</span>
            </h1>
            
            <p className="max-w-2xl text-base md:text-xl text-gray-300 font-light leading-relaxed mb-10 md:mb-14">
              Designed for your lifestyle, and your weekends. We’ve put a lot of heart into making this a place you’ll love to visit every single day.
            </p>

            <div className="relative py-8 md:py-10 px-6 md:px-12 border-y border-white/10 w-full max-w-4xl">
              <h2 className="text-2xl md:text-5xl font-bold tracking-[0.15em] text-white mb-2">
                COMING SOON
              </h2>
              <p className="text-[10px] md:text-sm tracking-[0.3em] md:tracking-[0.5em] text-gray-400 uppercase font-medium">
                We can't wait to show you what's inside
              </p>
            </div>
          </motion.div>
        </section>

        {/* --- INTERACTIVE IMAGE SECTION --- */}
        <section className="flex flex-col lg:flex-row items-center justify-between px-6 md:px-16 py-16 md:py-20 bg-white gap-12 lg:gap-0">
          <motion.div 
            {...fadeInUp}
            className="w-full lg:w-1/2 space-y-6 text-center lg:text-left"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl serif leading-tight text-black">
              The Best Spot <br className="hidden md:block" /> 
              <span className="italic text-gradient">To Spend Your Day</span>
            </h1>
            
            <p className="text-gray-500 text-base md:text-xl font-light max-w-md mx-auto lg:mx-0">
              From morning  to evening shopping, we’re bringing together everything you need in one beautiful, welcoming location.
            </p>

           <div className="pt-4">
  <Link href="/Collection"> 
    <button className="w-full sm:w-auto bg-green-900 text-white py-4 px-10 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-green-800 transition-all shadow-xl shadow-green-900/20 active:scale-95">
      Start Shopping Soon
    </button>
  </Link>
</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 flex justify-center lg:justify-end"
          >
            <div className="relative group w-full max-w-[500px] lg:max-w-none">
              <div className="absolute -inset-4 bg-green-100/50 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
              
              <Image
                src='/show.png'
                height={900}
                width={900}
             
                priority={true}
                quality={90}
                alt="Mall Preview"
                className="relative rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl object-contain border-2 border-black shadow-green-800 w-full h-auto"
              />
            </div>
          </motion.div>
        </section>

        {/* --- HUMANIZED FEATURES SECTION --- */}
        <section className="bg-black text-white py-16 md:py-24 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 text-center md:text-left">
                <motion.div {...fadeInUp} className="space-y-4">
                    <h4 className="serif italic text-2xl md:text-3xl text-green-400">01. Quality First</h4>
                    <p className="text-gray-400 font-light text-sm md:text-base">We’ve picked the best local and international brands so you always find exactly what you’re looking for.</p>
                </motion.div>
                <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="space-y-4">
                    <h4 className="serif italic text-2xl md:text-3xl text-green-400">02. A Friendly Space</h4>
                    <p className="text-gray-400 font-light text-sm md:text-base">A comfortable, respectful environment where you can relax with friends or spend quality time with family.</p>
                </motion.div>
                <motion.div {...fadeInUp} transition={{ delay: 0.4 }} className="space-y-4">
                    <h4 className="serif italic text-2xl md:text-3xl text-green-400">03. Modern Ease</h4>
                    <p className="text-gray-400 font-light text-sm md:text-base">We're using the latest tech to make your visit smooth, from easy parking to our digital shopping guides.</p>
                </motion.div>
            </div>
        </section>

      </main>
    </>
  );
}