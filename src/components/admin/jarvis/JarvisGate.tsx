"use client";

import { useState } from "react";
import { LoginForm } from "@/components/admin/jarvis/LoginForm";
import { JarvisDashboard } from "@/components/admin/jarvis/JarvisDashboard";

export function JarvisGate({ initialAuthed }: { initialAuthed: boolean }) {
  const [authed, setAuthed] = useState(initialAuthed);

  if (!authed) {
    return <LoginForm onSuccess={() => setAuthed(true)} />;
  }

  return <JarvisDashboard onLogout={() => setAuthed(false)} />;
}
