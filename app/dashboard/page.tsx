
"use client";

import { useSession } from "next-auth/react";
import Loading from "../auth/callback/loading";
export default function DashboardPage() {
  const { data: session, status } = useSession();

 if (status === "loading") {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center"> {/* Add margin-left to account for sidebar */}
      <div className="text-center">
        <div className="text-white mt-4">
          <Loading></Loading>
        </div>
      </div>
    </div>
  );
}


  return (
    <main className="min-h-screen bg-[#111111]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome, {session?.user?.name}
        </h1>
      </div>
    </main>
  );
}
