"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { FilledButton } from "@/components/ui/FilledButton";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Image from 'next/image'

export default function Welcome() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get("name") || "User";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2c5154] to-[#1d3638] relative overflow-hidden flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-12"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Image 
              src="/logo.svg" 
              alt="Vault Logo" 
              width={64}
              height={64}
              className="h-16 w-auto mx-auto"
              priority
            />
          </motion.div>

          {/* Welcome Message */}
          <div className="space-y-2">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full"
            >
              <Sparkles className="w-5 h-5 text-[#e36c59]" />
              <span className="text-white/90 font-medium">Welcome to your journey</span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
              Welcome, <span className="text-[#e36c59]">{name}</span>!
            </h1>
          </div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-8"
          >
            <p className="text-xl sm:text-2xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
              Your journey toward understanding your true self begins here.
              Let's unlock your potential together!
            </p>

            {/* Get Started Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="pt-8 flex justify-center"
            >
              <FilledButton
                variant="default"
                size="lg"
                className="bg-[#e36c59] hover:bg-[#e36c59]/90 text-white px-12 py-4 text-lg font-semibold rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl w-full max-w-[280px]"
                onClick={() => router.push("/")}
              >
                Get Started
              </FilledButton>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-[#e36c59]/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-[#2c5154]/40 rounded-full blur-3xl" />
    </div>
  );
} 