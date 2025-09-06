"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next13-progressbar";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="mt-7">
      <Button variant="destructive" onClick={handleLogout}>
        Logout
      </Button>
      <p>SettingsPage</p>
    </div>
  );
}
