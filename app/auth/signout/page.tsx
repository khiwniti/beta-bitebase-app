"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/auth";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await logout();
        router.push("/auth");
      } catch (error) {
        console.error("Sign out error:", error);
        // Even if there's an error, redirect to auth page
        router.push("/auth");
      }
    };

    handleSignOut();
  }, [logout, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Signing you out...</p>
      </div>
    </div>
  );
}