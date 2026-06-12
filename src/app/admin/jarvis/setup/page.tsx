import { getJarvisSession } from "@/lib/jarvis/auth";
import { JarvisSetupGate } from "@/components/admin/jarvis/JarvisSetupGate";

export default async function JarvisSetupPage() {
  const authed = await getJarvisSession();
  return <JarvisSetupGate initialAuthed={authed} />;
}
