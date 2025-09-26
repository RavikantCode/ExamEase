'use client';
import React from 'react';
import { Download, DollarSign, Award, Clock, TrendingUp, Sparkles, Star } from 'lucide-react';
import { FacultyInfo } from "../types/faculty";
import { Activity } from "../types/activity";

type Props = {
  grandTotal: number;
  activitiesCount: number;
  estimatedTime: number;
  ratePerHour: number;
  onExport: () => void;
  disabledExport: boolean;
  onSendToAdmin?: () => void;
  facultyInfo: FacultyInfo;
  activities: Activity[];
};

export default function SummaryDashboard({
  grandTotal,
  activitiesCount,
  estimatedTime,
  ratePerHour,
  onExport,
  disabledExport,
  onSendToAdmin,
  facultyInfo,
  activities
}: Props) {

  const handleExportClick = () => {
    console.log('Export button clicked!');
    console.log('disabledExport:', disabledExport);
    console.log('onExport function:', onExport);
    
    if (disabledExport) {
      console.log('Export is disabled');
      return;
    }

    try {
      onExport();
    } catch (error) {
      console.error('Error calling onExport:', error);
    }
  };

  const handleSendToAdmin = async () => {
    console.log('Send to Admin button clicked!');
    try {
      const res = await fetch("/api/faculty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facultyInfo,
          activities,
        }),
      });
  
      const data = await res.json();
      console.log('API Response:', data);
      
      if (data.success) {
        alert("✅ Report sent to Administration successfully!");
      } else {
        alert("❌ Failed to send report. Check logs.");
      }
    } catch (err) {
      console.error('Send to admin error:', err);
      alert("⚠️ Something went wrong while sending report");
    }
  };

  console.log("faculty hai yeh summary dashboard", facultyInfo);
  console.log("activities hain summarydashboard", activities);
  console.log("Export disabled status:", disabledExport);

  return (
    <div className="space-y-8 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Amount */}
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-purple-500/20 p-6 rounded-2xl shadow-xl hover:shadow-purple-500/30 transition-all duration-300 backdrop-blur-sm group hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Amount</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                ₹{grandTotal.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl backdrop-blur-sm">
              <DollarSign className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <div className="mt-3 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Activities */}
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-purple-500/20 p-6 rounded-2xl shadow-xl hover:shadow-purple-500/30 transition-all duration-300 backdrop-blur-sm group hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Activities</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {activitiesCount}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl backdrop-blur-sm">
              <Award className="h-8 w-8 text-cyan-400" />
            </div>
          </div>
          <div className="mt-3 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Est. Hours */}
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-purple-500/20 p-6 rounded-2xl shadow-xl hover:shadow-purple-500/30 transition-all duration-300 backdrop-blur-sm group hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Est. Hours</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {estimatedTime}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl backdrop-blur-sm">
              <Clock className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <div className="mt-3 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Rate per Hour */}
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-purple-500/20 p-6 rounded-2xl shadow-xl hover:shadow-purple-500/30 transition-all duration-300 backdrop-blur-sm group hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Rate/Hour</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                ₹{ratePerHour}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl backdrop-blur-sm">
              <TrendingUp className="h-8 w-8 text-cyan-400" />
            </div>
          </div>
          <div className="mt-3 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-purple-500/30 p-8 rounded-2xl shadow-2xl backdrop-blur-sm relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-cyan-500/5 to-purple-600/5 animate-pulse"></div>

        <div className="relative z-10">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <div className="p-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg mr-3 backdrop-blur-sm">
              <Sparkles className="text-purple-400" size={20} />
            </div>
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Export Your Report
            </span>
          </h3>

          <div className="space-y-6">
          
            <button
              onClick={handleExportClick}
              disabled={disabledExport}
              className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-white py-4 px-6 rounded-2xl flex items-center justify-center space-x-3 
                         disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Download size={20} />
              </div>
              <span className="font-semibold text-lg">
                {disabledExport ? 'Export Disabled' : 'Export Detailed Report with Insights'}
              </span>
              <Star className="animate-pulse" size={16} />
            </button>

            {/* Send to Administration Button */}
            <button
              onClick={handleSendToAdmin}
              className="w-full bg-gradient-to-r from-cyan-600 via-purple-500 to-pink-500 text-white py-4 px-6 rounded-2xl flex items-center justify-center space-x-3
                         shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-105 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <TrendingUp size={20} />
              </div>
              <span className="font-semibold text-lg">Send Report to Administration</span>
            </button>

            {/* Report Includes */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full mr-3 animate-pulse"></div>
                <p className="font-semibold text-gray-200 text-lg">Your report will include:</p>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Detailed breakdown of all activities with time tracking</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Performance insights and advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Time estimation and productivity metrics dashboard</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Professional format ready for accounts department submission</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}