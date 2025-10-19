"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  Home,
  DollarSign,
  Users,
  Calendar,
  Settings,
  CheckCircle,
  AlertCircle,
  RotateCw,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function DashboardPage() {
  const { data: session, status } = useSession();
  const [facultyCheckIn, setFacultyCheckIn] = useState<Record<number, string>>(
    {}
  );

  const departmentData = [
    { name: "Computer", value: 25 },
    { name: "IT", value: 20 },
    { name: "Data Science", value: 18 },
    { name: "AI-ML", value: 22 },
    { name: "Mechanical", value: 10 },
    { name: "Civil", value: 5 },
  ];

  const workloadData = [
    { day: "Mon", load: 12 },
    { day: "Tue", load: 19 },
    { day: "Wed", load: 15 },
    { day: "Thu", load: 28 },
    { day: "Fri", load: 22 },
  ];

  const colors = [
    "#7c3aed",
    "#3b82f6",
    "#06b6d4",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
  ];

  const [activeTab, setActiveTab] = useState("overview");

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const facultyList = [
    {
      id: 1,
      name: "Prof. Sharma",
      dept: "Computer",
      slot: "Prof. Sarna 10 AM",
      activitySlot: "12 AM",
      status: "present",
    },
    {
      id: 2,
      name: "Dr. Mehta",
      dept: "IT",
      slot: "MISSING 10 PM",
      activitySlot: "Missing",
      status: "absent",
    },
    {
      id: 3,
      name: "Prof. Gupta",
      dept: "Engineering",
      slot: "Prof. Kumar 11 AM",
      activitySlot: "11:30 AM",
      status: "present",
    },
    {
      id: 4,
      name: "Dr. Singh",
      dept: "Science",
      slot: "Prof. Verma 2 PM",
      activitySlot: "2:15 PM",
      status: "present",
    },
    {
      id: 5,
      name: "Prof. Patel",
      dept: "Mathematics",
      slot: "Prof. Desai 3 PM",
      activitySlot: "MISSING",
      status: "absent",
    },
  ];

  const presentCount = facultyList.filter((f) => f.status === "present").length;
  const absentCount = facultyList.filter((f) => f.status === "absent").length;
  const slotsMissed = absentCount;

  const handleReassign = (facultyId: number) => {
    console.log(`Reassigning faculty ${facultyId}`);
  };

  return (
    <div className="flex min-h-screen bg-[#0B0B0B] text-white">
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === "overview" && (
          <>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-3">
                  Good afternoon, {session?.user?.name?.split(" ")[0]}
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="rounded-2xl border border-blue-600/30 bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6 backdrop-blur-sm">
                <div className="flex flex-col gap-2">
                  <span className="text-3xl font-bold text-white">2</span>
                  <span className="text-sm text-white font-medium">
                    Exams Scheduled
                  </span>
                  <p className="text-xs text-gray-400">This Week</p>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-600/30 bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="text-2xl font-bold text-green-400">
                    {presentCount}
                  </span>
                </div>
                <span className="text-sm text-white font-medium">
                  Seating Plans
                </span>
                <p className="text-xs text-gray-400">Left to Approve</p>
              </div>

              <div className="rounded-2xl border border-red-600/30 bg-gradient-to-br from-red-900/20 to-red-900/10 p-6 backdrop-blur-sm">
                <div className="flex flex-col gap-2">
                  <span className="text-3xl font-bold text-red-400">
                    {slotsMissed}
                  </span>
                  <span className="text-sm text-white font-medium">
                    Slots Missed
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-600/30 bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6 backdrop-blur-sm">
                <div className="flex flex-col gap-2">
                  <span className="text-3xl font-bold text-white">$12,500</span>
                  <span className="text-sm text-white font-medium">
                    Remuneration
                  </span>
                  <p className="text-xs text-gray-400">Pending</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="rounded-2xl border border-gray-800 bg-blue-900/10 p-8 backdrop-blur-sm">
                <h2 className="text-lg font-semibold mb-6">
                  Exam Distribution
                </h2>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {departmentData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#1a1a2e",
                        border: "1px solid #7c3aed",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="mt-6 grid grid-cols-2 gap-2">
                  {departmentData.map((dept, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ background: colors[idx] }}
                      ></div>
                      <span className="text-gray-400">{dept.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-blue-900/10 p-8 backdrop-blur-sm">
                <h2 className="text-2xl font-semibold mb-8">
                  Live Faculty Status & Reassignment
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400">
                          Faculty
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400">
                          Activity Slot
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400">
                          Slot Status
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400">
                          Presence
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {facultyList.map((faculty) => (
                        <tr
                          key={faculty.id}
                          className="border-b border-gray-800 hover:bg-gray-900/30 transition"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-purple-600/30 flex items-center justify-center text-xs">
                                {faculty.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium">{faculty.name}</p>
                                <p className="text-xs text-gray-500">
                                  {faculty.dept}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-300">
                            {faculty.slot}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`text-xs font-medium ${
                                faculty.activitySlot === "MISSING"
                                  ? "text-red-400"
                                  : "text-gray-300"
                              }`}
                            >
                              {faculty.activitySlot}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {faculty.status === "present" ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span className="text-green-400 font-medium">
                                  Present
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-400" />
                                <span className="text-red-400 font-medium">
                                  Absent
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            {faculty.status === "absent" ? (
                              <button
                                onClick={() => handleReassign(faculty.id)}
                                className="px-4 py-2 rounded-lg bg-green-600/20 border border-green-600/50 text-green-400 hover:bg-green-600/30 transition font-medium text-xs"
                              >
                                REASSIGN
                              </button>
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
