import { getJarvisSession } from "@/lib/jarvis/auth";
import { JarvisGate } from "@/components/admin/jarvis/JarvisGate";

export default async function JarvisPage() {
  const authed = await getJarvisSession();
  return <JarvisGate initialAuthed={authed} />;
}
