"use client";

import { CheckCircle2, XCircle, Bell, Trash2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/card";

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch notifications from API
  const fetchNotifications = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      const res = await fetch('/api/notifications');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to mark as read');
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications/mark-all-read', { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to mark all as read');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => fetchNotifications(), 30000);
    return () => clearInterval(interval);
  }, []);

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-zinc-400">Loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-[#0b0b0b] text-white space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600/20 rounded-lg">
            <Bell className="text-purple-500" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-200">Notifications</h1>
            {unread.length > 0 && (
              <p className="text-sm text-zinc-400 mt-0.5">You have {unread.length} unread notification{unread.length !== 1 ? 's' : ''}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchNotifications(true)}
            disabled={refreshing}
            className="px-4 py-2 bg-[#161616] border border-zinc-800 hover:border-purple-500 rounded-lg text-sm text-zinc-300 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {unread.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm text-white transition-all font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* RECENT NOTIFICATIONS */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-zinc-200">Recent Notifications</h2>
        {unread.length === 0 ? (
          <div className="bg-[#161616] border border-zinc-800 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-zinc-400 text-lg">No new notifications 🎉</p>
            <p className="text-zinc-500 text-sm mt-2">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {unread.map((n) => (
              <Card
                key={n.id}
                className="bg-[#161616] border-2 border-purple-500/50 hover:border-purple-500 transition-all duration-200 cursor-pointer relative overflow-hidden"
                onClick={() => markAsRead(n.id)}
              >
                <div className="absolute top-0 right-0 w-2 h-full bg-purple-500"></div>
                <CardHeader className="flex flex-row items-start justify-between p-5 pr-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`p-3 rounded-xl mt-1 ${
                        n.type === "error" || n.type === "rejected"
                          ? "bg-red-600/20 border border-red-500/30"
                          : "bg-green-600/20 border border-green-500/30"
                      }`}
                    >
                      {n.type === "error" || n.type === "rejected" ? (
                        <XCircle className="text-red-500" size={24} />
                      ) : (
                        <CheckCircle2 className="text-green-400" size={24} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <h3 className="font-semibold text-lg text-white">{n.title}</h3>
                        {n.status && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              n.type === "error" || n.type === "rejected"
                                ? "bg-red-700 text-white"
                                : "bg-green-700 text-white"
                            }`}
                          >
                            {n.status}
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-300 text-sm leading-relaxed mb-2">{n.message}</p>
                      {n.verifiedAmount !== undefined && n.verifiedAmount !== null && (
                        <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <p className="text-green-400 text-sm font-semibold">
                            💰 Verified Amount: ₹{n.verifiedAmount.toLocaleString()}
                          </p>
                        </div>
                      )}
                      {n.remark && (
                        <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                          <p className="text-yellow-400 text-xs font-medium">
                            📝 Admin Remark: {n.remark}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span className="text-xs text-zinc-500 whitespace-nowrap">{n.time}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(n.id);
                      }}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                      title="Delete notification"
                    >
                      <Trash2 className="text-red-400 group-hover:text-red-300" size={18} />
                    </button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ALL NOTIFICATIONS */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-zinc-200">Previous Notifications</h2>
        {read.length === 0 ? (
          <div className="bg-[#121212] border border-zinc-800 rounded-xl p-8 text-center">
            <p className="text-zinc-500">No previous notifications.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {read.map((n) => (
              <Card
                key={n.id}
                className="bg-[#121212] border border-zinc-800 hover:border-zinc-700 transition-all duration-200 opacity-70 hover:opacity-100"
              >
                <CardHeader className="flex flex-row items-start justify-between p-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`p-2.5 rounded-lg ${
                        n.type === "error" || n.type === "rejected"
                          ? "bg-red-600/20"
                          : "bg-green-600/20"
                      }`}
                    >
                      {n.type === "error" || n.type === "rejected" ? (
                        <XCircle className="text-red-500" size={20} />
                      ) : (
                        <CheckCircle2 className="text-green-400" size={20} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base text-zinc-200">{n.title}</h3>
                      <p className="text-zinc-400 text-sm mt-1 leading-relaxed">{n.message}</p>
                      {n.verifiedAmount !== undefined && n.verifiedAmount !== null && (
                        <p className="text-green-400 text-sm mt-2 font-semibold">
                          Verified Amount: ₹{n.verifiedAmount.toLocaleString()}
                        </p>
                      )}
                      {n.remark && (
                        <p className="text-yellow-400 text-xs mt-2 italic">
                          Admin Remark: {n.remark}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span className="text-xs text-zinc-500 whitespace-nowrap">{n.time}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(n.id);
                      }}
                      className="p-1.5 hover:bg-red-500/20 rounded transition-colors group"
                      title="Delete notification"
                    >
                      <Trash2 className="text-red-400/60 group-hover:text-red-400" size={16} />
                    </button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default NotificationPage