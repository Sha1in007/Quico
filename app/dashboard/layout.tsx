import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import DashboardShell from '@/components/DashboardShell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('quico_token')?.value;
  if (!token) redirect('/login');

  const user = verifyToken(token);
  if (!user) redirect('/login');

  return <DashboardShell>{children}</DashboardShell>;
}
