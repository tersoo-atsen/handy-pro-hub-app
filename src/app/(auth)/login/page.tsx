import { PublicNavbar } from '@/components/public-navbar';
import { PublicFooter } from '@/components/public-footer';
import { AuthCard } from '@/features/auth/components/auth-card';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      <PublicNavbar />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center py-14">
        <AuthCard defaultTab="signin" />
      </main>
      <PublicFooter />
    </div>
  );
}
