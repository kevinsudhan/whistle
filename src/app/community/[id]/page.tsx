"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import CountUp from "@/components/CountUp";
import { FiAward, FiCheck, FiX, FiLock } from "react-icons/fi";

// Dynamic imports for charts
const PieChart = dynamic(() => import('react-apexcharts'), { ssr: false });
const LineChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Define the request type
interface LoanRequest {
  id: string;
  borrower: string;
  purpose: string;
  amount: number;
  period: string;
  stakers: number;
}

export default function CommunityDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tokens] = useState(1250);
  const [daoPassword, setDaoPassword] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [pendingRequests, setPendingRequests] = useState<LoanRequest[]>([
    {
      id: "req1",
      borrower: "Rahul S.",
      purpose: "Education Fees",
      amount: 25000,
      period: "2 months",
      stakers: 3
    },
    {
      id: "req2",
      borrower: "Priya M.",
      purpose: "Business Expansion",
      amount: 50000,
      period: "3 months",
      stakers: 5
    },
    {
      id: "req3",
      borrower: "Ankit P.",
      purpose: "Medical Emergency",
      amount: 15000,
      period: "1 month",
      stakers: 2
    }
  ]);
  const [approvedRequests, setApprovedRequests] = useState<LoanRequest[]>([]);

  // Mock data for charts and stats
  const loanStats = {
    loansLended: 156,
    closed: 120,
    inProgress: 36,
    totalAmount: "₹15,75,000",
    successfulStakes: 142,
    unsuccessfulStakes: 14,
    totalStakers: 156
  };

  // Monthly lending data (January to December)
  const monthlyLendingData = [
    { month: "Jan", amount: 75000 },
    { month: "Feb", amount: 120000 },
    { month: "Mar", amount: 95000 },
    { month: "Apr", amount: 150000 },
    { month: "May", amount: 175000 },
    { month: "Jun", amount: 210000 },
    { month: "Jul", amount: 190000 },
    { month: "Aug", amount: 230000 },
    { month: "Sep", amount: 250000 },
    { month: "Oct", amount: 280000 },
    { month: "Nov", amount: 0 },
    { month: "Dec", amount: 0 }
  ];

  // Handle DAO tab click
  const handleDaoClick = () => {
    setIsPasswordModalOpen(true);
  };

  // Handle password submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (daoPassword === "123") {
      setActiveTab("dao");
      setIsPasswordModalOpen(false);
      setPasswordError("");
      setDaoPassword("");
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  // Handle request approval
  const handleApproveRequest = (requestId: string) => {
    const requestToApprove = pendingRequests.find(req => req.id === requestId);
    if (requestToApprove) {
      setApprovedRequests([...approvedRequests, requestToApprove]);
      setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
    }
  };

  // Handle request rejection
  const handleRejectRequest = (requestId: string) => {
    setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
  };

  // Pie chart options
  const pieChartOptions = {
    labels: ['Closed', 'In Progress'],
    colors: ['#4D94FF', '#FFD700'],
    legend: {
      position: 'bottom',
      labels: {
        colors: '#ffffff'
      }
    },
    chart: {
      background: 'transparent'
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#000000']
      },
      formatter: function(val: number) {
        return Math.round(val) + '%';
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              color: '#ffffff'
            },
            value: {
              show: true,
              color: '#ffffff'
            },
            total: {
              show: true,
              color: '#ffffff'
            }
          }
        }
      }
    }
  };

  const pieChartSeries = [
    loanStats.closed, 
    loanStats.inProgress
  ];

  // Line chart options
  const lineChartOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    colors: ['#4D94FF'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: monthlyLendingData.map(item => item.month),
      labels: {
        style: {
          colors: '#ffffff'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#ffffff'
        },
        formatter: function(value: number) {
          return '₹' + (value / 1000) + 'K';
        }
      }
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.1)'
    },
    tooltip: {
      theme: 'dark'
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#FFD700'],
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.2,
        stops: [0, 100]
      }
    }
  };

  const lineChartSeries = [
    {
      name: 'Amount Lent',
      data: monthlyLendingData.map(item => item.amount)
    }
  ];

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
            <Image 
              src="/images/whistle-logo.svg" 
              alt="Whistle Logo" 
              width={40} 
              height={40} 
            />
            <h1 className="text-2xl font-bold cooper-font">Whistle!</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white/10 rounded-full px-4 py-1">
              <Image 
                src="/images/token-icon.svg" 
                alt="SVCE Token" 
                width={24} 
                height={24} 
              />
              <span className="ml-2 font-bold">{tokens}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-sm font-bold">KD</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <motion.main 
        className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 pb-24"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          {/* Community Header */}
          <motion.div 
            className="flex items-center justify-between mb-8"
            variants={fadeIn}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Image 
                  src="/images/token-icon.svg" 
                  alt="SVCE" 
                  width={32} 
                  height={32} 
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">SVCE Community</h2>
                <p className="text-white/70">Sri Venkateswara College of Engineering</p>
              </div>
            </div>
            
            <button 
              className="whistle-button-primary py-2 px-6 rounded-full text-sm"
              onClick={() => router.push('/my-activities')}
            >
              My Activities
            </button>
          </motion.div>

          {/* Tabs */}
          <motion.div 
            className="flex border-b border-white/10 mb-8"
            variants={fadeIn}
          >
            <button 
              className={`py-3 px-6 font-medium text-lg ${activeTab === 'dashboard' ? 'text-white border-b-2 border-secondary-yellow' : 'text-white/50'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`py-3 px-6 font-medium text-lg flex items-center gap-2 ${activeTab === 'dao' ? 'text-white border-b-2 border-secondary-yellow' : 'text-white/50'}`}
              onClick={handleDaoClick}
            >
              <FiAward className="text-yellow-400" />
              DAO
            </button>
            <button 
              className={`py-3 px-6 font-medium text-lg ${activeTab === 'history' ? 'text-white border-b-2 border-secondary-yellow' : 'text-white/50'}`}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
          </motion.div>

          {/* Dashboard Content */}
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                variants={fadeIn}
              >
                <div className="glass p-6 rounded-xl">
                  <h3 className="text-lg font-medium text-white/70 mb-2">Loans Lended</h3>
                  <p className="text-3xl font-bold">
                    <CountUp end={loanStats.loansLended} duration={2.5} />
                  </p>
                </div>
                
                <div className="glass p-6 rounded-xl">
                  <h3 className="text-lg font-medium text-white/70 mb-2">Total Amount</h3>
                  <p className="text-3xl font-bold">
                    <CountUp end={parseInt(loanStats.totalAmount.replace(/[^\d]/g, ""))} prefix="₹" duration={2.5} />
                  </p>
                </div>
                
                <div className="glass p-6 rounded-xl">
                  <h3 className="text-lg font-medium text-white/70 mb-2">Total Stakers</h3>
                  <p className="text-3xl font-bold">
                    <CountUp end={loanStats.totalStakers} duration={2.5} />
                  </p>
                </div>
                
                <div className="glass p-6 rounded-xl">
                  <h3 className="text-lg font-medium text-white/70 mb-2">Success Rate</h3>
                  <p className="text-3xl font-bold">
                    <CountUp 
                      end={Math.round((loanStats.successfulStakes / loanStats.totalStakers) * 100)} 
                      suffix="%" 
                      duration={2.5} 
                    />
                  </p>
                </div>
              </motion.div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Pie Chart */}
                <motion.div 
                  className="glass p-6 rounded-xl"
                  variants={fadeIn}
                >
                  <h3 className="text-xl font-bold mb-4">Loan Status</h3>
                  <div className="h-80">
                    {typeof window !== 'undefined' && (
                      <PieChart
                        options={pieChartOptions as any}
                        series={pieChartSeries}
                        type="donut"
                        height="100%"
                      />
                    )}
                  </div>
                </motion.div>
                
                {/* Line Chart */}
                <motion.div 
                  className="glass p-6 rounded-xl"
                  variants={fadeIn}
                >
                  <h3 className="text-xl font-bold mb-4">Monthly Lending</h3>
                  <div className="h-80">
                    {typeof window !== 'undefined' && (
                      <LineChart
                        options={lineChartOptions as any}
                        series={lineChartSeries as any}
                        type="area"
                        height="100%"
                      />
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Stakes Section */}
              <motion.div 
                className="glass p-6 rounded-xl mb-8"
                variants={fadeIn}
              >
                <h3 className="text-xl font-bold mb-4">Staking Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">
                      <CountUp end={loanStats.totalStakers} duration={2.5} />
                    </div>
                    <p className="text-white/70">Total Stakers</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2 text-green-400">
                      <CountUp end={loanStats.successfulStakes} duration={2.5} />
                    </div>
                    <p className="text-white/70">Successful Stakes</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2 text-red-400">
                      <CountUp end={loanStats.unsuccessfulStakes} duration={2.5} />
                    </div>
                    <p className="text-white/70">Unsuccessful Stakes</p>
                  </div>
                </div>
                
                <div className="mt-6 bg-white/10 rounded-full h-4 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-secondary-yellow to-secondary-blue"
                    style={{ width: `${(loanStats.successfulStakes / loanStats.totalStakers) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span>0%</span>
                  <span>{Math.round((loanStats.successfulStakes / loanStats.totalStakers) * 100)}%</span>
                  <span>100%</span>
                </div>
              </motion.div>
            </>
          )}

          {/* DAO Content */}
          {activeTab === 'dao' && (
            <>
              <motion.div
                className="glass p-6 rounded-xl mb-8"
                variants={fadeIn}
              >
                <div className="flex items-center gap-2 mb-4">
                  <FiAward className="text-yellow-400 text-xl" />
                  <h3 className="text-xl font-bold">DAO Admin Panel</h3>
                </div>
                <p className="text-white/70 mb-6">
                  As a DAO admin, you can approve or reject loan requests from community members.
                </p>

                {/* Pending Requests */}
                <h4 className="text-lg font-bold mb-4">Pending Requests</h4>
                {pendingRequests.length === 0 ? (
                  <p className="text-white/50 italic">No pending requests</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingRequests.map((request) => (
                      <div 
                        key={request.id}
                        className="bg-white/5 rounded-lg border border-white/10 overflow-hidden hover:bg-white/10 transition-colors"
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
                              <span className="text-sm text-white/70">{request.stakers} Stakers</span>
                            </div>
                          </div>
                          
                          <div className="text-sm text-white/70 mb-4">
                            <span className="block">Period: {request.period}</span>
                          </div>
                        </div>
                        
                        <div className="flex border-t border-white/10">
                          <button
                            onClick={() => handleApproveRequest(request.id)}
                            className="flex-1 py-3 text-center text-green-400 hover:bg-green-500/20 transition-colors"
                          >
                            Approve
                          </button>
                          <div className="w-px bg-white/10"></div>
                          <button
                            onClick={() => handleRejectRequest(request.id)}
                            className="flex-1 py-3 text-center text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Approved Requests */}
              <motion.div
                className="glass p-6 rounded-xl mb-8"
                variants={fadeIn}
              >
                <h3 className="text-xl font-bold mb-4">Approved Requests</h3>
                {approvedRequests.length === 0 ? (
                  <p className="text-white/50 italic">No approved requests yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {approvedRequests.map((request) => (
                      <div 
                        key={request.id}
                        className="bg-white/5 rounded-lg border border-white/10 overflow-hidden"
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h5 className="font-bold text-lg mb-1">{request.purpose}</h5>
                              <p className="text-2xl font-bold text-secondary-yellow">₹{request.amount.toLocaleString()}</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                              Approved
                            </span>
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
                              <span className="text-sm text-white/70">{request.stakers} Stakers</span>
                            </div>
                          </div>
                          
                          <div className="text-sm text-white/70">
                            <span className="block">Period: {request.period}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </>
          )}

          {/* History Content */}
          {activeTab === 'history' && (
            <motion.div
              className="glass p-6 rounded-xl mb-8"
              variants={fadeIn}
            >
              <h3 className="text-xl font-bold mb-4">Transaction History</h3>
              <p className="text-white/70">
                Your transaction history will appear here.
              </p>
            </motion.div>
          )}
        </div>
      </motion.main>

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <motion.div 
            className="glass p-6 rounded-xl w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <FiLock className="text-secondary-yellow" size={20} />
              <h3 className="text-xl font-bold">DAO Access</h3>
            </div>
            
            <p className="text-white/70 mb-6">
              Please enter the DAO password to access the admin panel.
            </p>
            
            <form onSubmit={handlePasswordSubmit}>
              {passwordError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-white text-sm">
                  {passwordError}
                </div>
              )}
              
              <div className="mb-4">
                <input
                  type="password"
                  value={daoPassword}
                  onChange={(e) => setDaoPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary-yellow"
                  placeholder="Enter password"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordError("");
                    setDaoPassword("");
                  }}
                  className="py-2 px-4 rounded-lg border border-white/20 text-white/70 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="whistle-button-primary py-2 px-6 rounded-lg"
                >
                  Access
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/10 py-4 px-6 z-20">
        <div className="max-w-md mx-auto flex justify-around gap-4">
          <button 
            onClick={() => router.push('/request')}
            className="whistle-button-primary rounded-full px-8 py-3 text-base font-bold flex-1"
          >
            Request
          </button>
          
          <button 
            onClick={() => router.push('/lend')}
            className="whistle-button-secondary rounded-full px-8 py-3 text-base font-bold flex-1"
          >
            Lend/Stake
          </button>
        </div>
      </div>
    </div>
  );
}
