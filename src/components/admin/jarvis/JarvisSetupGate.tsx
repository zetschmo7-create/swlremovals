"use client";

import { Suspense, useState } from "react";
import { LoginForm } from "@/components/admin/jarvis/LoginForm";
import { GmailSetup } from "@/components/admin/jarvis/GmailSetup";

export function JarvisSetupGate({ initialAuthed }: { initialAuthed: boolean }) {
  const [authed, setAuthed] = useState(initialAuthed);

  if (!authed) {
    return <LoginForm onSuccess={() => setAuthed(true)} />;
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-white/40">
          Loading setup…
        </div>
      }
    >
      <GmailSetup onLogout={() => setAuthed(false)} />
    </Suspense>
  );
}
