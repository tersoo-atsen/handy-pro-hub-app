import { Check, Loader } from 'lucide-react';

interface VerificationBadgeProps {
  verified?: boolean | null;
  className?: string;
}

export function VerificationBadge({ verified, className = '' }: VerificationBadgeProps) {
  const isVerified = Boolean(verified);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium text-white shrink-0 ${className}`}
      style={{
        backgroundColor: isVerified ? 'var(--color-brand-blue)' : 'var(--color-primary)',
      }}
    >
      {isVerified ? (
        <>
          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
          Verified
        </>
      ) : (
        <>
          <Loader className="h-3.5 w-3.5" />
          Unverified
        </>
      )}
    </span>
  );
}
