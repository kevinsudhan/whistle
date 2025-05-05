"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { FiArrowLeft, FiUser, FiPercent, FiCalendar, FiUsers } from "react-icons/fi";
import { useAccount, useWalletClient } from "wagmi";
import { WS_Abi, WS_CONTRACT_ADDRESS } from "@/config/WS_Abi";
import { parseEther } from "ethers";

// Dynamic import of Lottie component
const LottiePlayer = dynamic(() => import("lottie-react"), { ssr: false });

// Define the request type
interface LoanRequest {
  id: string;
  purpose: string;
  amount: number;
  period: string;
  interestRate: string;
  riskScore: string;
  stakers: number;
  borrowerAddress: string;
}

export default function LendPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [action, setAction] = useState<'lend' | 'stake'>('lend');
  const [error, setError] = useState<string | null>(null);
  
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  // Mock approved loan requests
  const approvedRequests: LoanRequest[] = [
    {
      id: "req1",
      purpose: "Education Fees",
      amount: 25000,
      period: "2 months",
      interestRate: "8.5%",
      riskScore: "Low",
      stakers: 3,
      borrowerAddress: "0x1234567890123456789012345678901234567890"
    },
    {
      id: "req2",
      purpose: "Business Expansion",
      amount: 50000,
      period: "3 months",
      interestRate: "9.2%",
      riskScore: "Medium",
      stakers: 5,
      borrowerAddress: "0x2345678901234567890123456789012345678901"
    },
    {
      id: "req3",
      purpose: "Medical Emergency",
      amount: 15000,
      period: "1 month",
      interestRate: "7.8%",
      riskScore: "Low",
      stakers: 2,
      borrowerAddress: "0x3456789012345678901234567890123456789012"
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!isConnected || !address) {
      setError("Please connect your wallet first");
      return;
    }
    
    if (!walletClient) {
      setError("Wallet client not available");
      return;
    }
    
    if (!selectedRequest) {
      setError("Please select a request first");
      return;
    }
    
    const selectedLoanRequest = approvedRequests.find(r => r.id === selectedRequest);
    if (!selectedLoanRequest) {
      setError("Selected request not found");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (action === 'stake') {
        // Call the stakeForLoan function from the contract
        const hash = await walletClient.writeContract({
          address: WS_CONTRACT_ADDRESS as `0x${string}`,
          abi: WS_Abi,
          functionName: 'stakeForLoan',
          args: [selectedLoanRequest.borrowerAddress as `0x${string}`],
          account: address,
          value: parseEther("0.01") // Small amount of ETH for staking
        });
        
        console.log("Stake transaction hash:", hash);
      } else {
        // For lending, we would implement the lending logic here
        // This is a placeholder for now
        console.log("Lending for:", selectedLoanRequest.purpose);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Navigate after animation completes
      setTimeout(() => {
        router.push('/community/svce');
      }, 3000);
    } catch (err) {
      console.error("Error during transaction:", err);
      setError(err instanceof Error ? err.message : "Transaction failed. Please try again.");
      setIsSubmitting(false);
    }
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
            <h1 className="text-2xl font-bold cooper-font">
              {action === 'lend' ? 'Lend' : 'Stake'}
            </h1>
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
        <div className="max-w-7xl mx-auto">
          {/* Action Tabs */}
          <motion.div 
            className="flex border-b border-white/10 mb-8"
            variants={fadeIn}
          >
            <button 
              className={`py-3 px-6 font-medium text-lg ${action === 'lend' ? 'text-white border-b-2 border-secondary-yellow' : 'text-white/50'}`}
              onClick={() => setAction('lend')}
            >
              Lend
            </button>
            <button 
              className={`py-3 px-6 font-medium text-lg ${action === 'stake' ? 'text-white border-b-2 border-secondary-yellow' : 'text-white/50'}`}
              onClick={() => setAction('stake')}
            >
              Stake
            </button>
          </motion.div>
          
          {/* Error message */}
          {error && (
            <motion.div 
              className="mb-6 p-3 bg-red-500/20 border border-red-500 rounded-lg text-white text-sm"
              variants={fadeIn}
            >
              {error}
            </motion.div>
          )}
          
          {/* Approved Requests */}
          <motion.div 
            className="mb-8"
            variants={fadeIn}
          >
            <h2 className="text-xl font-bold mb-6">
              {action === 'lend' ? 'Approved Loan Requests' : 'Stake Opportunities'}
            </h2>
            
            {approvedRequests.length === 0 ? (
              <div className="glass p-6 rounded-xl">
                <p className="text-white/50 italic">No approved requests available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedRequests.map((request) => (
                  <div 
                    key={request.id}
                    className={`bg-white/5 rounded-lg border overflow-hidden cursor-pointer transition-colors ${
                      selectedRequest === request.id 
                        ? 'border-secondary-yellow bg-white/10' 
                        : 'border-white/10 hover:bg-white/10'
                    }`}
                    onClick={() => setSelectedRequest(request.id)}
                  >
                    <div className="p-4">
                      <div className="mb-3">
                        <h5 className="font-bold text-lg mb-1">{request.purpose}</h5>
                        <p className="text-2xl font-bold text-secondary-yellow">₹{request.amount.toLocaleString()}</p>
                      </div>
                      
                      <div className="flex justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <Image 
                            src="/images/token-icon.svg" 
                            alt="SVCE Token" 
                            width={16} 
                            height={16} 
                          />
                          <span className="text-sm text-white/70">1250 Tokens</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiUsers className="text-secondary-blue" size={14} />
                          <span className="text-sm text-white/70">{request.stakers} Stakers</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-white/70">
                        <span>Period: {request.period}</span>
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
            )}
          </motion.div>

          {/* Action Form */}
          {selectedRequest && (
            <motion.form 
              onSubmit={handleSubmit}
              className="glass p-6 rounded-xl"
              variants={fadeIn}
            >
              <h2 className="text-xl font-bold mb-6">
                {action === 'lend' 
                  ? `Lend for ${approvedRequests.find(r => r.id === selectedRequest)?.purpose}`
                  : `Stake for ${approvedRequests.find(r => r.id === selectedRequest)?.purpose}`
                }
              </h2>
              
              {/* Interest Rate */}
              <div className="mb-8 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">
                    {action === 'lend' ? 'Expected Return' : 'Potential Reward'}
                  </span>
                  <span className="text-xl font-bold text-secondary-yellow">
                    {approvedRequests.find(r => r.id === selectedRequest)?.interestRate}
                  </span>
                </div>
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full whistle-button-primary py-3 rounded-lg text-base font-bold"
                disabled={isSubmitting}
              >
                {action === 'lend' 
                  ? (isSubmitting ? "Processing..." : "Confirm Lending")
                  : (isSubmitting ? "Processing..." : "Confirm Staking")
                }
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
            {action === 'lend' 
              ? "Your lending has been confirmed"
              : "Your staking has been confirmed"
            }
          </p>
        </div>
      )}
    </div>
  );
}
