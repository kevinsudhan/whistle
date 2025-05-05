"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { FiArrowLeft, FiUser, FiPercent, FiCalendar } from "react-icons/fi";

// Dynamic import of Lottie component
const LottiePlayer = dynamic(() => import("lottie-react"), { ssr: false });

export default function LendPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  // Mock loan requests
  const loanRequests = [
    {
      id: "req1",
      borrower: "Rahul S.",
      purpose: "Education Fees",
      amount: 25000,
      period: "2 months",
      interestRate: "8.5%",
      riskScore: "Low"
    },
    {
      id: "req2",
      borrower: "Priya M.",
      purpose: "Business Expansion",
      amount: 50000,
      period: "3 months",
      interestRate: "9.2%",
      riskScore: "Medium"
    },
    {
      id: "req3",
      borrower: "Ankit P.",
      purpose: "Medical Emergency",
      amount: 15000,
      period: "1 month",
      interestRate: "7.8%",
      riskScore: "Low"
    }
  ];

  // Load animation data
  useEffect(() => {
    const loadAnimation = async () => {
      try {
        // Using the specific animation file provided by the user
        const response = await fetch('/animations/Animation - 1746436161234.json');
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error("Failed to load animation:", error);
      }
    };
    
    loadAnimation();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Navigate after animation completes
    setTimeout(() => {
      router.push('/community/svce');
    }, 3000);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Grid background with less visible lines */}
        <div 
          className="absolute inset-0 z-[1]" 
          style={{ 
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-secondary-yellow opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary-blue opacity-10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 py-6 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold cooper-font">Lend</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white/10 rounded-full px-4 py-1">
              <Image 
                src="/images/token-icon.svg" 
                alt="SVCE Token" 
                width={24} 
                height={24} 
              />
              <span className="ml-2 font-bold">1250</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-sm font-bold">KD</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <motion.main 
        className="relative z-10 py-8 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="max-w-3xl mx-auto">
          {/* Loan Requests */}
          <motion.div 
            className="glass p-6 rounded-xl mb-8"
            variants={fadeIn}
          >
            <h2 className="text-xl font-bold mb-6">Loan Requests</h2>
            
            <div className="space-y-4">
              {loanRequests.map((request) => (
                <div 
                  key={request.id}
                  className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                    selectedRequest === request.id 
                      ? 'bg-white/20 border-secondary-yellow' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedRequest(request.id)}
                >
                  <div className="flex justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <FiUser className="text-white" size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold">{request.borrower}</h4>
                        <p className="text-sm text-white/70">{request.purpose}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{request.amount.toLocaleString()}</p>
                      <div className="flex items-center gap-1 text-sm">
                        <FiCalendar className="text-white/70" size={14} />
                        <span className="text-white/70">{request.period}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <FiPercent className="text-secondary-yellow" size={14} />
                      <span>Interest: {request.interestRate}</span>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        request.riskScore === 'Low' 
                          ? 'bg-green-500/20 text-green-400' 
                          : request.riskScore === 'Medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                      }`}>
                        {request.riskScore} Risk
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Lend Form */}
          {selectedRequest && (
            <motion.form 
              onSubmit={handleSubmit}
              className="glass p-6 rounded-xl"
              variants={fadeIn}
            >
              <h2 className="text-xl font-bold mb-6">Lend to {loanRequests.find(r => r.id === selectedRequest)?.borrower}</h2>
              
              {/* Interest Rate */}
              <div className="mb-8 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Expected Return</span>
                  <span className="text-xl font-bold text-secondary-yellow">
                    {loanRequests.find(r => r.id === selectedRequest)?.interestRate}
                  </span>
                </div>
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full whistle-button-primary py-3 rounded-lg text-base font-bold"
                disabled={isSubmitting}
              >
                Confirm Lending
              </button>
            </motion.form>
          )}
        </div>
      </motion.main>

      {/* Loading overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-80">
          <div className="w-64 h-64 mb-6">
            {animationData && (
              <LottiePlayer 
                animationData={animationData} 
                loop={true}
                style={{ width: '100%', height: '100%' }}
              />
            )}
          </div>
          <p className="text-xl font-medium text-white text-center">
            Your lending has been confirmed
          </p>
        </div>
      )}
    </div>
  );
}
