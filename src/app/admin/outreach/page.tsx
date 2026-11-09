import type { Metadata } from 'next';
import OutreachDashboard from '@/components/admin/outreach/OutreachDashboard';
import { authed } from '@/lib/outreach/auth';
export const metadata:Metadata={title:'SWL | Partnership desk',robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
export default async function Page(){return <OutreachDashboard initialAuthed={await authed()}/>}
