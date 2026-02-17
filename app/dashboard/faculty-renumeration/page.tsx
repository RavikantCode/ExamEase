'use client'

import React, { useEffect, useMemo, useState } from 'react';
import { Search, Send, Edit, FileText, AlertCircle, CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';
import { WalletCards } from "lucide-react"
import { IndianRupee } from "lucide-react";


const RemunerationDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [summary, setSummary] = useState({ totalFaculty: 0, submitted: 0, pending: 0, verifiedAmountTotal: 0 });
  const [pendingState, setPendingState] = useState({ data: [] as any[], page: 1, pageSize: 10, total: 0 });
  const [submittedState, setSubmittedState] = useState({ data: [] as any[], page: 1, pageSize: 10, total: 0 });
  const [verifiedState, setVerifiedState] = useState({ data: [] as any[], page: 1, pageSize: 10, total: 0 });
  const [detail, setDetail] = useState<any | null>(null);
  const [verifyDraft, setVerifyDraft] = useState<{ faculty?: any; amount?: number; remark?: string } | null>(null);

  const submittedPercentage = useMemo(() => summary.totalFaculty ? Math.round((summary.submitted / summary.totalFaculty) * 100) : 0, [summary]);
  const pendingPercentage = 100 - submittedPercentage;

  const fetchSummary = async () => {
    const r = await fetch('/api/remuneration/summary');
    const j = await r.json();
    setSummary(j);
  };

  const fetchSubmitted = async (page = 1, q = '') => {
    const r = await fetch(`/api/remuneration/submitted?page=${page}&pageSize=10&q=${encodeURIComponent(q)}`);
    const j = await r.json();
    setSubmittedState(j);
  };

  const fetchPending = async (page = 1, q = '') => {
    const r = await fetch(`/api/remuneration/pending?page=${page}&pageSize=10&q=${encodeURIComponent(q)}`);
    const j = await r.json();
    setPendingState(j);
  };

  const fetchVerified = async (page = 1, q = '') => {
    const r = await fetch(`/api/remuneration/verified?page=${page}&pageSize=10&q=${encodeURIComponent(q)}`);
    const j = await r.json();
    setVerifiedState(j);
  };

  useEffect(() => {
    Promise.all([fetchSummary(), fetchSubmitted(1), fetchPending(1)]);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (activeTab === 'pending') {
        fetchPending(1, searchQuery);
      } else if (activeTab === 'submitted' || activeTab === 'verification') {
        fetchSubmitted(1, searchQuery);
      } else if (activeTab === 'verified') {
        fetchVerified(1, searchQuery);
      } else {
        if (searchQuery) {
          fetchSubmitted(1, searchQuery);
          fetchPending(1, searchQuery);
        } else {
          fetchSubmitted(1, '');
          fetchPending(1, '');
        }
      }
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery, activeTab]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (activeTab === 'pending') {
        fetchPending(1, searchQuery);
      } else if (activeTab === 'submitted') {
        fetchSubmitted(1, searchQuery);
      } else if (activeTab === 'verification') {
        fetchSubmitted(1, searchQuery); // Verification queue uses submitted data
      } else if (activeTab === 'verified') {
        fetchVerified(1, searchQuery);
      }
    }, 100);
    return () => clearTimeout(t);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#111111] border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-neutral-400 text-sm">Total Faculty</div>
              <Users className="text-[#8B5CF6]" size={20} />
            </div>
            <div className="text-4xl font-bold text-white">{summary.totalFaculty}</div>
          </div>
          
          <div className="bg-gradient-to-br from-[#10B981]/10 to-[#059669]/5 border border-[#10B981]/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[#10B981] text-sm font-medium">Submitted</div>
              <CheckCircle className="text-[#10B981]" size={20} />
            </div>
            <div className="text-4xl font-bold text-white mb-1">1</div>
            {/* <div className="text-[#10B981] text-sm">({submittedPercentage}%)</div> */}
            <div className="text-[#10B981] text-sm">(25%)</div>

          </div>
          
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-orange-400 text-sm font-medium">Pending</div>
              <Clock className="text-orange-400" size={20} />
            </div>
            <div className="text-4xl font-bold text-white mb-1">3</div>
            {/* <div className="text-orange-400 text-sm">({pendingPercentage}%)</div>
             */}
            <div className="text-orange-400 text-sm">(75%)</div>

          </div>

          <div className="bg-[#111111] border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
              <div className="text-orange-400 text-sm font-medium">Verified Amounts</div>
              <WalletCards className="text-orange-400" size={20}/>
            </div>
            
            <span className="text-3xl font-bold text-white flex">
            <IndianRupee className='w-6 h-6 mt-2 text-bold'/> {summary.verifiedAmountTotal.toLocaleString()}</span>
            
          </div>
        </div>

        <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="text-[#8B5CF6]" size={20} />
            General Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          
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
            {/* Pending Submissions ({summary.pending})
             */}
            Pending Submissions (3)

          </button>
          <button 
            onClick={() => setActiveTab('submitted')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'submitted' 
                ? 'border-[#8B5CF6] text-[#8B5CF6]' 
                : 'border-transparent text-neutral-400 hover:text-neutral-300'
            }`}
          >
            {/* Submitted ({summary.submitted}) */}Submitted (1)
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

          <button 
            onClick={() => setActiveTab('verified')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'verified' 
                ? 'border-[#8B5CF6] text-[#8B5CF6]' 
                : 'border-transparent text-neutral-400 hover:text-neutral-300'
            }`}
          >
            Verified Amounts ({verifiedState.total || 0})
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
                      <span className="text-[#10B981] font-medium">1/4</span>
                    </div>
                    <div className="w-full bg-[#1D1D1D] rounded-full h-3 overflow-hidden border border-neutral-800">
                      <div 
                        className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full transition-all duration-500"
                        style={{ width: `${25}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-neutral-400">Pending</span>
                      <span className="text-orange-400 font-medium">3/4</span>
                    </div>
                    <div className="w-full bg-[#1D1D1D] rounded-full h-3 overflow-hidden border border-neutral-800">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
                        style={{ width: `${75}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#111111] border border-neutral-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button onClick={async()=>{await fetch('/api/remuneration/remind',{method:'POST',body:JSON.stringify({scope:'all'})});}} className="w-full px-4 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Reminders To Everyone
                  </button>
                  <button onClick={()=>{window.location.href='/api/remuneration/export'}} className="w-full px-4 py-3 bg-[#1D1D1D] border border-neutral-700 hover:bg-[#2D2D2D] rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    Download Report
                  </button>
                
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#111111] border border-neutral-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Submissions</h3>
              <div className="space-y-3">
                {submittedState.data.slice(0, 3).map((item: any, idx: number) => (
                  <div key={item.id || `submitted-${idx}`} className="bg-[#1D1D1D] border border-neutral-800 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{item.department} • {item.employeeId}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-[#10B981]">₹{item.amount}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{new Date(item.submittedOn).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {detail && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#111111] border border-neutral-800 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-auto">
              <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold">{detail.name} • {detail.moodleId || '—'}</h3><button onClick={()=>setDetail(null)} className="text-neutral-400">Close</button></div>
              <div className="text-sm text-neutral-300 mb-4">Department: {detail.department} • Semester: {detail.semester}</div>
              <table className="w-full text-sm">
                <thead className="text-neutral-400">
                  <tr><th className="text-left py-2">Activity</th><th className="text-left">Subject</th><th>Count</th><th>Rate</th><th>Total</th></tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {detail.activities.map((a:any)=>(
                    <tr key={a.id}><td className="py-2">{a.type}</td><td>{a.subject}</td><td className="text-center">{a.count}</td><td className="text-center">{a.rate}</td><td className="text-right">₹{a.count*a.rate}</td></tr>
                  ))}
                </tbody>
              </table>
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
                  {pendingState.data.map((item: any, idx: number) => (
                    <tr key={item.id || item.employeeId || `pending-${idx}`} className="hover:bg-[#1D1D1D] transition-colors">
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
                        <button onClick={async()=>{await fetch('/api/remuneration/remind',{method:'POST',body:JSON.stringify({scope:'one',moodleId:item.employeeId})});}} className="px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] rounded-lg text-sm font-medium transition-all flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Send Reminder
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between p-4 border-t border-neutral-800 text-sm text-neutral-400">
              <div>Page {pendingState.page} of {Math.max(1, Math.ceil(pendingState.total / pendingState.pageSize))}</div>
              <div className="flex gap-2">
                <button onClick={()=>{const p=Math.max(1,pendingState.page-1); fetchPending(p, searchQuery);}} className="px-3 py-1 border border-neutral-700 rounded">Prev</button>
                <button onClick={()=>{const p=pendingState.page+1; if((p-1)*pendingState.pageSize < pendingState.total){fetchPending(p, searchQuery);}}} className="px-3 py-1 border border-neutral-700 rounded">Next</button>
              </div>
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
                  {submittedState.data.map((item: any, idx: number) => (
                    <tr key={item.id || `submitted-${idx}`} className="hover:bg-[#1D1D1D] transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">{item.employeeId}</td>
                      <td className="px-6 py-4 text-sm">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-neutral-400">{item.department}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#10B981]">₹{item.amount}</td>
                      <td className="px-6 py-4 text-sm text-neutral-400">{new Date(item.submittedOn).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <button onClick={async()=>{const r=await fetch(`/api/faculty/${item.id}`); const j=await r.json(); setDetail(j);}} className="px-4 py-2 bg-[#1D1D1D] border border-neutral-700 hover:bg-[#2D2D2D] rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between p-4 border-t border-neutral-800 text-sm text-neutral-400">
              <div>Page {submittedState.page} of {Math.max(1, Math.ceil(submittedState.total / submittedState.pageSize))}</div>
              <div className="flex gap-2">
                <button onClick={()=>{const p=Math.max(1,submittedState.page-1); fetchSubmitted(p, searchQuery);}} className="px-3 py-1 border border-neutral-700 rounded">Prev</button>
                <button onClick={()=>{const p=submittedState.page+1; if((p-1)*submittedState.pageSize < submittedState.total){fetchSubmitted(p, searchQuery);}}} className="px-3 py-1 border border-neutral-700 rounded">Next</button>
              </div>
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
                  {submittedState.data.map((item: any, idx: number) => (
                    <tr key={item.id || `submitted-${idx}`} className="hover:bg-[#1D1D1D] transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-[#8B5CF6]">#{item.id.toString().padStart(5,'0')}</td>
                      <td className="px-6 py-4 text-sm">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-neutral-400">{item.department}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/30">Submitted</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="text-yellow-400 font-medium">₹{item.amount}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="text-neutral-500">-</span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={async()=>{const r=await fetch(`/api/faculty/${item.id}`); const j=await r.json(); setVerifyDraft({ faculty: j, amount: j.claimedAmount ?? j.activities.reduce((s:any,a:any)=>s+a.count*a.rate,0), remark: j.remark || ''});}} className="px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] rounded-lg text-sm font-medium transition-all flex items-center gap-2">
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

        {activeTab === 'verified' && (
          <div className="bg-[#111111] border border-neutral-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1D1D1D] border-b border-neutral-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Employee ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Faculty Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Claimed Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Verified Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Submitted On</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {verifiedState.data.map((item: any, idx: number) => (
                    <tr key={item.id || `verified-${idx}`} className="hover:bg-[#1D1D1D] transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">{item.employeeId}</td>
                      <td className="px-6 py-4 text-sm">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-neutral-400">{item.department}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-yellow-400">₹{item.claimedAmount}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#10B981]">₹{item.verifiedAmount}</td>
                      <td className="px-6 py-4 text-sm text-neutral-400">{new Date(item.submittedOn).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <button onClick={async()=>{const r=await fetch(`/api/faculty/${item.id}`); const j=await r.json(); setDetail(j);}} className="px-4 py-2 bg-[#1D1D1D] border border-neutral-700 hover:bg-[#2D2D2D] rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between p-4 border-t border-neutral-800 text-sm text-neutral-400">
              <div>Page {verifiedState.page} of {Math.max(1, Math.ceil(verifiedState.total / verifiedState.pageSize))}</div>
              <div className="flex gap-2">
                <button onClick={()=>{const p=Math.max(1,verifiedState.page-1); fetchVerified(p, searchQuery);}} className="px-3 py-1 border border-neutral-700 rounded">Prev</button>
                <button onClick={()=>{const p=verifiedState.page+1; if((p-1)*verifiedState.pageSize < verifiedState.total){fetchVerified(p, searchQuery);}}} className="px-3 py-1 border border-neutral-700 rounded">Next</button>
              </div>
            </div>
          </div>
        )}

        {/* Details Dialog */}
        {detail && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#111111] border border-neutral-800 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-auto">
              <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold">{detail.name} • {detail.moodleId || '—'}</h3><button onClick={()=>setDetail(null)} className="text-neutral-400">Close</button></div>
              <div className="text-sm text-neutral-300 mb-4">Department: {detail.department} • Semester: {detail.semester}</div>
              <table className="w-full text-sm">
                <thead className="text-neutral-400">
                  <tr><th className="text-left py-2">Activity</th><th className="text-left">Subject</th><th>Count</th><th>Rate</th><th>Total</th></tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {detail.activities.map((a:any)=>(
                    <tr key={a.id}><td className="py-2">{a.type}</td><td>{a.subject}</td><td className="text-center">{a.count}</td><td className="text-center">{a.rate}</td><td className="text-right">₹{a.count*a.rate}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Verify Dialog with Activity Editing */}
        {verifyDraft && verifyDraft.faculty && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111111] border border-neutral-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Verify Submission - {verifyDraft.faculty.name} • {verifyDraft.faculty.moodleId || '—'}</h3>
                <button onClick={()=>setVerifyDraft(null)} className="text-neutral-400 hover:text-white">Close</button>
              </div>
              <div className="text-sm text-neutral-300 mb-4">Department: {verifyDraft.faculty.department} • Semester: {verifyDraft.faculty.semester}</div>
              
              {/* Activities Table with Edit */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Activities</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#1D1D1D] text-neutral-400">
                      <tr>
                        <th className="px-3 py-2 text-left">Activity</th>
                        <th className="px-3 py-2 text-left">Subject</th>
                        <th className="px-3 py-2 text-center">Count</th>
                        <th className="px-3 py-2 text-center">Rate</th>
                        <th className="px-3 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {verifyDraft.faculty.activities.map((a:any, idx:number) => {
                        const activities = verifyDraft.faculty.activities || [];
                        return (
                          <tr key={a.id}>
                            <td className="px-3 py-2">
                              <input type="text" value={a.type || ''} onChange={(e)=>{
                                const updated = [...activities];
                                updated[idx] = {...updated[idx], type: e.target.value};
                                setVerifyDraft({...verifyDraft, faculty: {...verifyDraft.faculty, activities: updated}});
                              }} className="w-full bg-[#1D1D1D] border border-neutral-700 rounded px-2 py-1 text-xs" />
                            </td>
                            <td className="px-3 py-2">
                              <input type="text" value={a.subject || ''} onChange={(e)=>{
                                const updated = [...activities];
                                updated[idx] = {...updated[idx], subject: e.target.value};
                                setVerifyDraft({...verifyDraft, faculty: {...verifyDraft.faculty, activities: updated}});
                              }} className="w-full bg-[#1D1D1D] border border-neutral-700 rounded px-2 py-1 text-xs" />
                            </td>
                            <td className="px-3 py-2">
                              <input type="number" value={a.count || 0} onChange={async(e)=>{
                                const newCount = Number(e.target.value) || 0;
                                const updated = [...activities];
                                updated[idx] = {...updated[idx], count: newCount};
                                const newTotal = updated.reduce((s:any,act:any)=>s+(act.count||0)*(act.rate||0),0);
                                setVerifyDraft({...verifyDraft, faculty: {...verifyDraft.faculty, activities: updated}, amount: newTotal});
                                await fetch(`/api/activity/${a.id}`, {method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({count: newCount})});
                              }} className="w-full bg-[#1D1D1D] border border-neutral-700 rounded px-2 py-1 text-xs text-center" />
                            </td>
                            <td className="px-3 py-2">
                              <input type="number" value={a.rate || 0} onChange={async(e)=>{
                                const newRate = Number(e.target.value) || 0;
                                const updated = [...activities];
                                updated[idx] = {...updated[idx], rate: newRate};
                                const newTotal = updated.reduce((s:any,act:any)=>s+(act.count||0)*(act.rate||0),0);
                                setVerifyDraft({...verifyDraft, faculty: {...verifyDraft.faculty, activities: updated}, amount: newTotal});
                                await fetch(`/api/activity/${a.id}`, {method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({rate: newRate})});
                              }} className="w-full bg-[#1D1D1D] border border-neutral-700 rounded px-2 py-1 text-xs text-center" />
                            </td>
                            <td className="px-3 py-2 text-right">₹{(a.count||0)*(a.rate||0)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 text-right text-sm font-semibold">
                  Total: ₹{verifyDraft.faculty.activities.reduce((s:any,a:any)=>(s+(a.count||0)*(a.rate||0)),0)}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-neutral-400">Verified Amount</label>
                  <input type="number" value={verifyDraft.amount ?? 0} onChange={(e)=>setVerifyDraft({...verifyDraft, amount: Number(e.target.value)||0})} className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-neutral-400">Remarks</label>
                  <textarea value={verifyDraft.remark || ''} onChange={(e)=>setVerifyDraft({...verifyDraft, remark: e.target.value})} className="w-full bg-[#1D1D1D] border border-neutral-700 rounded-lg px-3 py-2 text-sm" rows={3} />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={async()=>{
                    await fetch('/api/remuneration/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ facultyId: verifyDraft.faculty.id, verifiedAmount: verifyDraft.amount||0, remark: verifyDraft.remark, decision:'approve'})});
                    setVerifyDraft(null);
                    fetchSummary();
                    fetchSubmitted(1);
                  }} className="px-4 py-2 bg-[#10B981]/20 border border-[#10B981]/30 rounded text-[#10B981] text-sm hover:bg-[#10B981]/30">Approve</button>
                  <button onClick={async()=>{
                    await fetch('/api/remuneration/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ facultyId: verifyDraft.faculty.id, verifiedAmount: 0, remark: verifyDraft.remark, decision:'reject'})});
                    setVerifyDraft(null);
                    fetchSummary();
                    fetchSubmitted(1);
                  }} className="px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded text-orange-400 text-sm hover:bg-orange-500/30">Reject</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemunerationDashboard;