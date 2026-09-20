"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { FaGithub, FaPlayCircle } from 'react-icons/fa';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 }
  }
};

export function HeroSection() {
  return (
    <section className="relative px-6 lg:px-12 pt-32 pb-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
      <motion.div 
        className="flex w-full flex-col max-w-2xl text-left"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-6xl lg:text-7xl xl:text-[80px] font-bold tracking-tighter text-[#17191F] leading-[1.05]"
        >
          Recover lost revenue{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400">effortlessly.</span>
        </motion.h1>

        <motion.span 
          variants={itemVariants}
          className="text-[#5B6270] font-medium text-3xl lg:text-4xl tracking-tight leading-tight mt-6 block"
        >
          Automate your retry logic and follow-ups.
        </motion.span>
        
        <motion.p 
          variants={itemVariants}
          className="mt-4 max-w-xl text-[19px] leading-relaxed font-medium text-[#5B6270]"
        >
          Retry automatically figures out why a payment failed and follows up with your customer at the right time. Built from the ground up for Indian businesses and UPI.
        </motion.p>
        
        <motion.div variants={itemVariants} className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 rounded-none bg-[#635BFF] px-8 py-3.5 text-[15px] font-medium text-white shadow-[0_4px_14px_0_rgba(99,91,255,0.39)] transition-all hover:bg-[#635BFF]/90 active:scale-[0.98]"
          >
            Start recovering revenue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="https://retry-testing.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-none bg-white border border-[#E6E8EC] px-8 py-3.5 text-[15px] font-medium text-[#17191F] shadow-sm transition-all hover:bg-[#F7F8FA]"
          >
            View testing website
            <ArrowRight className="h-4 w-4 text-[#5B6270] transition-transform group-hover:translate-x-0.5" />
          </a>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6 flex items-center gap-4">
          <a href="https://github.com/hemanthreddykoduru/Retry" target="_blank" rel="noopener noreferrer" className="bg-white text-[#17191F] text-[14px] px-5 py-2.5 rounded-none font-medium border border-[#E6E8EC] hover:bg-[#F7F8FA] transition-colors shadow-sm flex items-center gap-2">
            <FaGithub size={16} className="text-[#5B6270]" />
            GitHub
          </a>
          <a href="https://youtu.be/s3hobYdQoTY" target="_blank" rel="noopener noreferrer" className="bg-white text-[#17191F] text-[14px] px-5 py-2.5 rounded-none font-medium border border-[#E6E8EC] hover:bg-[#F7F8FA] transition-colors shadow-sm flex items-center gap-2">
            <FaPlayCircle size={16} className="text-[#5B6270]" />
            Demo
          </a>
        </motion.div>
      </motion.div>

      {/* Right column: Animated Product Preview */}
      <motion.div 
        className="w-full lg:w-[45%] relative mt-12 lg:mt-0 hidden md:block"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/10 to-pink-500/10 blur-2xl rounded-[3rem] -z-10" />
        
        <div className="transform -rotate-2 hover:rotate-0 transition-transform duration-500 ease-out">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_24px_48px_-12px_rgba(30,27,75,0.15)] rounded-none p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                  ₹
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 leading-tight">Payment Failed</h3>
                  <p className="text-xs text-zinc-500">Just now • Network issue</p>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-md bg-red-50 text-red-600 text-xs font-semibold border border-red-100">
                -₹4,500
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-zinc-100 rounded-md w-3/4" />
                  <div className="h-3 bg-zinc-50 rounded-md w-1/2" />
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-100">
                  <span className="text-[10px]">✓</span>
                </div>
                <div className="space-y-1.5 flex-1">
                  <p className="text-sm font-medium text-zinc-900">Recovery call dispatched</p>
                  <p className="text-xs text-zinc-500">Customer accepted AI voice call</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Recovered
              </span>
              <span className="text-xs font-medium text-zinc-500 border border-zinc-200 rounded px-2 py-1">
                +₹4,500
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
