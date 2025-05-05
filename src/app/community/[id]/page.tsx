"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamic imports for charts
const PieChart = dynamic(() => import('react-apexcharts'), { ssr: false });
const LineChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function CommunityDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tokens] = useState(1250);

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
              className={`py-3 px-6 font-medium text-lg ${activeTab === 'members' ? 'text-white border-b-2 border-secondary-yellow' : 'text-white/50'}`}
              onClick={() => setActiveTab('members')}
            >
              Members
            </button>
            <button 
              className={`py-3 px-6 font-medium text-lg ${activeTab === 'history' ? 'text-white border-b-2 border-secondary-yellow' : 'text-white/50'}`}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            variants={fadeIn}
          >
            <div className="glass p-6 rounded-xl">
              <h3 className="text-lg font-medium text-white/70 mb-2">Loans Lended</h3>
              <p className="text-3xl font-bold">{loanStats.loansLended}</p>
            </div>
            
            <div className="glass p-6 rounded-xl">
              <h3 className="text-lg font-medium text-white/70 mb-2">Total Amount</h3>
              <p className="text-3xl font-bold">{loanStats.totalAmount}</p>
            </div>
            
            <div className="glass p-6 rounded-xl">
              <h3 className="text-lg font-medium text-white/70 mb-2">Total Stakers</h3>
              <p className="text-3xl font-bold">{loanStats.totalStakers}</p>
            </div>
            
            <div className="glass p-6 rounded-xl">
              <h3 className="text-lg font-medium text-white/70 mb-2">Success Rate</h3>
              <p className="text-3xl font-bold">{Math.round((loanStats.successfulStakes / loanStats.totalStakers) * 100)}%</p>
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
                <div className="text-4xl font-bold mb-2">{loanStats.totalStakers}</div>
                <p className="text-white/70">Total Stakers</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 text-green-400">{loanStats.successfulStakes}</div>
                <p className="text-white/70">Successful Stakes</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 text-red-400">{loanStats.unsuccessfulStakes}</div>
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
        </div>
      </motion.main>

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
            Lend
          </button>
        </div>
      </div>
    </div>
  );
}
