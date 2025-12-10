'use client'

import React, { useState } from 'react';
import { Search, Send, Edit, FileText, AlertCircle, CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';
import { WalletCards } from "lucide-react"
import { IndianRupee } from "lucide-react";


const RemunerationDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayPeriod, setSelectedPayPeriod] = useState('October 1, 2025 - October 31, 2025');

  // Mock data
  const stats = {
    totalFaculty: 120,
    submitted: 85,
    pending: 35,
    submittedPercentage: 71,
    pendingPercentage: 29
  };

  const pendingSubmissions = [
    { id: 1, employeeId: '2234', name: 'Amit Singh', department: 'Science', status: 'Not Received' },
    { id: 2, employeeId: '2235', name: 'Rajesh Kumar', department: 'Arts', status: 'Not Received' },
    { id: 3, employeeId: '2236', name: 'Priya Patel', department: 'Commerce', status: 'Not Received' },
    { id: 4, employeeId: '2237', name: 'Sunita Verma', department: 'Science', status: 'Not Received' },
    { id: 5, employeeId: '2238', name: 'Karan Shah', department: 'Arts', status: 'Not Received' },
  ];

  const submittedList = [
    { id: 1, employeeId: '2201', name: 'Nilish Soni', department: 'Science', amount: 1050, submittedOn: '2025-10-15' },
    { id: 2, employeeId: '2202', name: 'Priya Sharma', department: 'Arts', amount: 980, submittedOn: '2025-10-14' },
    { id: 3, employeeId: '2203', name: 'Rahul Mehta', department: 'Commerce', amount: 1200, submittedOn: '2025-10-13' },
    { id: 4, employeeId: '2204', name: 'Anjali Desai', department: 'Science', amount: 950, submittedOn: '2025-10-12' },
    { id: 5, employeeId: '2205', name: 'Vikram Patel', department: 'Arts', amount: 1100, submittedOn: '2025-10-11' },
  ];

  const verificationQueue = [
    { submissionId: '#00125', faculty: 'Nilish Soni', department: 'Science', status: 10, claimed: 980, verified: 1050, action: 'review' },
    { submissionId: '#00124', faculty: 'Priya Sharma', department: 'Arts', status: 30, claimed: 0, verified: 0, action: 'upload' },
    { submissionId: '#00123', faculty: 'Rahul Mehta', department: 'Commerce', status: 30, claimed: 980, verified: 1050, action: 'reminder' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white pb-6">
      {/* Header */}
      <div className="bg-[#000000] border-b border-neutral-800 p-3 sm:p-4 md:p-6">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
              E
              <span className="text-xl sm:text-2xl md:text-4xl relative top-0.5 md:top-1 bg-gradient-to-r from-[#8B5CF6] to-[#0B0B0B] bg-clip-text text-transparent">
                X
              </span>
              amEase
            </span>
            <span className="text-sm sm:text-base md:text-lg font-normal text-neutral-400">Remuneration Management</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-3 sm:px-4 md:px-6 mt-4 sm:mt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-[#111111] border border-neutral-800 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="text-neutral-400 text-xs sm:text-sm">Total Faculty</div>
              <Users className="text-[#8B5CF6]" size={18} />
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">{stats.totalFaculty}</div>
          </div>
          
          <div className="bg-gradient-to-br from-[#10B981]/10 to-[#059669]/5 border border-[#10B981]/30 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="text-[#10B981] text-xs sm:text-sm font-medium">Submitted</div>
              <CheckCircle className="text-[#10B981]" size={18} />
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">{stats.submitted}</div>
            <div className="text-[#10B981] text-xs sm:text-sm">({stats.submittedPercentage}%)</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="text-orange-400 text-xs sm:text-sm font-medium">Pending</div>
              <Clock className="text-orange-400" size={18} />
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">{stats.pending}</div>
            <div className="text-orange-400 text-xs sm:text-sm">({stats.pendingPercentage}%)</div>
          </div>

          <div className="bg-[#111111] border border-neutral-800 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="text-orange-400 text-xs sm:text-sm font-medium">Verified Amounts</div>
              <WalletCards className="text-orange-400" size={18}/>
            </div>
            
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-1">
              <IndianRupee className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6'/>12,500
            </span>
          </div>
        </div>

        {/* General Details */}
        <div className="bg-[#111111] border border-neutral-800 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <TrendingUp className="text-[#8B5CF6]" size={18} />
            General Details
          </h2>
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">Search Faculty</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg pl-10 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 border-b border-neutral-800 overflow-x-auto scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm md:text-base border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview' 
                ? 'border-[#8B5CF6] text-[#8B5CF6]' 
                : 'border-transparent text-neutral-400 hover:text-neutral-300'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm md:text-base border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'pending' 
                ? 'border-[#8B5CF6] text-[#8B5CF6]' 
                : 'border-transparent text-neutral-400 hover:text-neutral-300'
            }`}
          >
            Pending <span className="hidden sm:inline">Submissions</span> ({stats.pending})
          </button>
          <button 
            onClick={() => setActiveTab('submitted')}
            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm md:text-base border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'submitted' 
                ? 'border-[#8B5CF6] text-[#8B5CF6]' 
                : 'border-transparent text-neutral-400 hover:text-neutral-300'
            }`}
          >
            Submitted ({stats.submitted})
          </button>
          <button 
            onClick={() => setActiveTab('verification')}
            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm md:text-base border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'verification' 
                ? 'border-[#8B5CF6] text-[#8B5CF6]' 
                : 'border-transparent text-neutral-400 hover:text-neutral-300'
            }`}
          >
            <span className="hidden sm:inline">Verification Queue</span>
            <span className="sm:hidden">Verification</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-[#111111] border border-neutral-800 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Submission Progress</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-2">
                      <span className="text-neutral-400">Submitted</span>
                      <span className="text-[#10B981] font-medium">{stats.submitted} / {stats.totalFaculty}</span>
                    </div>
                    <div className="w-full bg-[#1D1D1D] rounded-full h-2 sm:h-3 overflow-hidden border border-neutral-800">
                      <div 
                        className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full transition-all duration-500"
                        style={{ width: `${stats.submittedPercentage}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-2">
                      <span className="text-neutral-400">Pending</span>
                      <span className="text-orange-400 font-medium">{stats.pending} / {stats.totalFaculty}</span>
                    </div>
                    <div className="w-full bg-[#1D1D1D] rounded-full h-2 sm:h-3 overflow-hidden border border-neutral-800">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
                        style={{ width: `${stats.pendingPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#111111] border border-neutral-800 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Actions</h3>
                <div className="space-y-2 sm:space-y-3">
                  <button className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2">
                    <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                    Send Reminders To Everyone
                  </button>
                  <button className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-[#1D1D1D] border border-neutral-700 hover:bg-[#2D2D2D] rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                    Download Report
                  </button>
                  <button className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-[#1D1D1D] border border-neutral-700 hover:bg-[#2D2D2D] rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    Manage Period
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#111111] border border-neutral-800 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent Submissions</h3>
              <div className="space-y-2 sm:space-y-3">
                {submittedList.slice(0, 3).map((item) => (
                  <div key={item.id} className="bg-[#1D1D1D] border border-neutral-800 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                    <div>
                      <p className="font-medium text-xs sm:text-sm">{item.name}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{item.department} • {item.employeeId}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-semibold text-xs sm:text-sm text-[#10B981]">₹{item.amount}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{item.submittedOn}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="bg-[#111111] border border-neutral-800 rounded-lg sm:rounded-xl overflow-hidden">
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead className="bg-[#1D1D1D] border-b border-neutral-800">
                    <tr>
                      <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">ID</th>
                      <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Name</th>
                      <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider hidden sm:table-cell">Dept</th>
                      <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider hidden md:table-cell">Status</th>
                      <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {pendingSubmissions.map((item) => (
                      <tr key={item.id} className="hover:bg-[#1D1D1D] transition-colors">
                        <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-xs sm:text-sm font-medium">{item.employeeId}</td>
                        <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-xs sm:text-sm">
                          <div>{item.name}</div>
                          <div className="sm:hidden text-xs text-neutral-400 mt-0.5">{item.department}</div>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-xs sm:text-sm text-neutral-400 hidden sm:table-cell">{item.department}</td>
                        <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 hidden md:table-cell">
                          <span className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium border border-orange-500/30">
                            <AlertCircle className="w-3 h-3" />
                            {item.status}
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
                          <button className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] rounded-lg text-xs font-medium transition-all flex items-center gap-1 sm:gap-2">
                            <Send className="w-3 h-3" />
                            <span className="hidden sm:inline">Remind</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'submitted' && (
          <div className="bg-[#111111] border border-neutral-800 rounded-lg sm:rounded-xl overflow-hidden">
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead className="bg-[#1D1D1D] border-b border-neutral-800">
                    <tr>
                      <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">ID</th>
                      <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Name</th>
                      <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider hidden sm:table-cell">Dept</th>
                      <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Amount</th>
                      <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                      <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {submittedList.map((item) => (
                      <tr key={item.id} className="hover:bg-[#1D1D1D] transition-colors">
                        <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-xs sm:text-sm font-medium">{item.employeeId}</td>
                        <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-xs sm:text-sm">
                          <div>{item.name}</div>
                          <div className="sm:hidden text-xs text-neutral-400 mt-0.5">{item.department}</div>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-xs sm:text-sm text-neutral-400 hidden sm:table-cell">{item.department}</td>
                        <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-xs sm:text-sm font-semibold text-[#10B981]">₹{item.amount}</td>
                        <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-xs sm:text-sm text-neutral-400 hidden md:table-cell">{item.submittedOn}</td>
                        <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
                          <button className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-[#1D1D1D] border border-neutral-700 hover:bg-[#2D2D2D] rounded-lg text-xs font-medium transition-colors flex items-center gap-1 sm:gap-2">
                            <FileText className="w-3 h-3" />
                            <span className="hidden sm:inline">View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="bg-[#111111] border border-neutral-800 rounded-lg sm:rounded-xl overflow-hidden">
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead className="bg-[#1D1D1D] border-b border-neutral-800">
                    <tr>
                      <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Sub ID</th>
                      <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Faculty</th>
                      <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider hidden sm:table-cell">Dept</th>
                      <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider hidden md:table-cell">Status</th>
                      <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider hidden lg:table-cell">Claimed</th>
                      <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider hidden lg:table-cell">Verified</th>
                      <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {verificationQueue.map((item, index) => (
                      <tr key={index} className="hover:bg-[#1D1D1D] transition-colors">
                        <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-xs sm:text-sm font-medium text-[#8B5CF6]">{item.submissionId}</td>
                        <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-xs sm:text-sm">
                          <div>{item.faculty}</div>
                          <div className="sm:hidden text-xs text-neutral-400 mt-0.5">{item.department}</div>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-xs sm:text-sm text-neutral-400 hidden sm:table-cell">{item.department}</td>
                        <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 hidden md:table-cell">
                          <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/30">
                            {item.status}%
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-xs sm:text-sm hidden lg:table-cell">
                          {item.claimed > 0 ? <span className="text-yellow-400 font-medium">₹{item.claimed}</span> : <span className="text-neutral-500">-</span>}
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-xs sm:text-sm hidden lg:table-cell">
                          {item.verified > 0 ? <span className="text-[#10B981] font-medium">₹{item.verified}</span> : <span className="text-neutral-500">-</span>}
                        </td>
                        <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
                          <button className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] rounded-lg text-xs font-medium transition-all flex items-center gap-1 sm:gap-2">
                            <Edit className="w-3 h-3" />
                            <span className="hidden sm:inline">Review</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemunerationDashboard;