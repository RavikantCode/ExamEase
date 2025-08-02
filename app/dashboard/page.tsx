'use client'

import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';

export default function Dashboard() {
    const { data: session ,status} = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/signin');
        },
    });

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="text-white mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-black">
                    Welcome, {session?.user?.name}
                </h1>
            </div>
        </main>
    );
}