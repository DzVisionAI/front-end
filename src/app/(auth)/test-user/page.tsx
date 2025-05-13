"use client"

import { useEffect, useState } from "react";
import { authService, User } from "@/app/services/auth";

export default function TestUserPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const userInfo = await authService.getCurrentUser();
            setUser(userInfo);
            setLoading(false);
        };
        fetchUser();
    }, []);

    if (loading) return <div className="p-8">Loading...</div>;
    if (!user) return <div className="p-8 text-red-500">No user info found. Please sign in.</div>;

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Logged-in User Info</h1>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">{JSON.stringify(user, null, 2)}</pre>
        </div>
    );
} 