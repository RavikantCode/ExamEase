'use client'

import React, { useState } from 'react';
import { Search, Send, Edit, FileText, AlertCircle, CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      {/* Header */}
      <div className="bg-[#000000] border-b border-neutral-800 p-6">
        <div className="max-w-[1800px] mx-auto">
          <h1 className="text-3xl font-bold">
            <span className="text-2xl md:text-2xl font-semibold text-white">
              E
              <span className="text-2xl md:text-4xl relative top-1 bg-gradient-to-r from-[#8B5CF6] to-[#0B0B0B] bg-clip-text text-transparent">
                X
              </span>
              amEase
            </span>
            <span className="ml-3 text-lg font-normal text-neutral-400">Remuneration Management</span>
          </h1>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#111111] border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-neutral-400 text-sm">Total Faculty</div>
              <Users className="text-[#8B5CF6]" size={20} />
            </div>
            <div className="text-4xl font-bold text-white">{stats.totalFaculty}</div>
          </div>
          
          <div className="bg-gradient-to-br from-[#10B981]/10 to-[#059669]/5 border border-[#10B981]/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[#10B981] text-sm font-medium">Submitted</div>
              <CheckCircle className="text-[#10B981]" size={20} />
            </div>
            <div className="text-4xl font-bold text-white mb-1">{stats.submitted}</div>
            <div className="text-[#10B981] text-sm">({stats.submittedPercentage}%)</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-orange-400 text-sm font-medium">Pending</div>
              <Clock className="text-orange-400" size={20} />
            </div>
            <div className="text-4xl font-bold text-white mb-1">{stats.pending}</div>
            <div className="text-orange-400 text-sm">({stats.pendingPercentage}%)</div>
          </div>

          <div className="bg-[#111111] border border-neutral-800 rounded-xl p-6 flex items-center justify-center">
            <button className="px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] rounded-lg font-medium transition-all w-full flex items-center justify-center gap-2">
              <Send size={16} />
              Send Reminders
            </button>
          </div>
        </div>

        {/* General Details */}
        <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="text-[#8B5CF6]" size={20} />
            General Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-400 mb-1 block">Pay Period</label>
              <select 
                value={selectedPayPeriod}
                onChange={(e) => setSelectedPayPeriod(e.target.value)}
                className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8B5CF6]"
              >
                <option value="October 1, 2025 - October 31, 2025">October 1, 2025 - October 31, 2025</option>
                <option value="November 1, 2025 - November 30, 2025">November 1, 2025 - November 30, 2025</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-neutral-400 mb-1 block">Search Faculty</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                <input 
                  type="text" 
                  placeholder="Search by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-neutral-800 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview' 
                ? 'border-[#8B5CF6] text-[#8B5CF6]' 
                : 'border-transparent text-neutral-400 hover:text-neutral-300'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'pending' 
                ? 'border-[#8B5CF6] text-[#8B5CF6]' 
                : 'border-transparent text-neutral-400 hover:text-neutral-300'
            }`}
          >
            Pending Submissions ({stats.pending})
          </button>
          <button 
            onClick={() => setActiveTab('submitted')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'submitted' 
                ? 'border-[#8B5CF6] text-[#8B5CF6]' 
                : 'border-transparent text-neutral-400 hover:text-neutral-300'
            }`}
          >
            Submitted ({stats.submitted})
          </button>
          <button 
            onClick={() => setActiveTab('verification')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'verification' 
                ? 'border-[#8B5CF6] text-[#8B5CF6]' 
                : 'border-transparent text-neutral-400 hover:text-neutral-300'
            }`}
          >
            Verification Queue
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#111111] border border-neutral-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Submission Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-neutral-400">Submitted</span>
                      <span className="text-[#10B981] font-medium">{stats.submitted} / {stats.totalFaculty}</span>
                    </div>
                    <div className="w-full bg-[#1D1D1D] rounded-full h-3 overflow-hidden border border-neutral-800">
                      <div 
                        className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full transition-all duration-500"
                        style={{ width: `${stats.submittedPercentage}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-neutral-400">Pending</span>
                      <span className="text-orange-400 font-medium">{stats.pending} / {stats.totalFaculty}</span>
                    </div>
                    <div className="w-full bg-[#1D1D1D] rounded-full h-3 overflow-hidden border border-neutral-800">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
                        style={{ width: `${stats.pendingPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#111111] border border-neutral-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Bulk Reminders
                  </button>
                  <button className="w-full px-4 py-3 bg-[#1D1D1D] border border-neutral-700 hover:bg-[#2D2D2D] rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    Download Report
                  </button>
                  <button className="w-full px-4 py-3 bg-[#1D1D1D] border border-neutral-700 hover:bg-[#2D2D2D] rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <Edit className="w-4 h-4" />
                    Manage Period
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#111111] border border-neutral-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Submissions</h3>
              <div className="space-y-3">
                {submittedList.slice(0, 3).map((item) => (
                  <div key={item.id} className="bg-[#1D1D1D] border border-neutral-800 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{item.department} • {item.employeeId}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-[#10B981]">₹{item.amount}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{item.submittedOn}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="bg-[#111111] border border-neutral-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1D1D1D] border-b border-neutral-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Employee ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Faculty Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {pendingSubmissions.map((item) => (
                    <tr key={item.id} className="hover:bg-[#1D1D1D] transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">{item.employeeId}</td>
                      <td className="px-6 py-4 text-sm">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-neutral-400">{item.department}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium border border-orange-500/30">
                          <AlertCircle className="w-3 h-3" />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] rounded-lg text-sm font-medium transition-all flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Send Reminder
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'submitted' && (
          <div className="bg-[#111111] border border-neutral-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1D1D1D] border-b border-neutral-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Employee ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Faculty Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Amount Claimed</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Submitted On</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {submittedList.map((item) => (
                    <tr key={item.id} className="hover:bg-[#1D1D1D] transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">{item.employeeId}</td>
                      <td className="px-6 py-4 text-sm">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-neutral-400">{item.department}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#10B981]">₹{item.amount}</td>
                      <td className="px-6 py-4 text-sm text-neutral-400">{item.submittedOn}</td>
                      <td className="px-6 py-4">
                        <button className="px-4 py-2 bg-[#1D1D1D] border border-neutral-700 hover:bg-[#2D2D2D] rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="bg-[#111111] border border-neutral-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1D1D1D] border-b border-neutral-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Submission ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Faculty Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Claimed Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Verified Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {verificationQueue.map((item, index) => (
                    <tr key={index} className="hover:bg-[#1D1D1D] transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-[#8B5CF6]">{item.submissionId}</td>
                      <td className="px-6 py-4 text-sm">{item.faculty}</td>
                      <td className="px-6 py-4 text-sm text-neutral-400">{item.department}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/30">
                          {item.status}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {item.claimed > 0 ? <span className="text-yellow-400 font-medium">₹{item.claimed}</span> : <span className="text-neutral-500">-</span>}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {item.verified > 0 ? <span className="text-[#10B981] font-medium">₹{item.verified}</span> : <span className="text-neutral-500">-</span>}
                      </td>
                      <td className="px-6 py-4">
                        <button className="px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] rounded-lg text-sm font-medium transition-all flex items-center gap-2">
                          <Edit className="w-4 h-4" />
                          Review & Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemunerationDashboard;