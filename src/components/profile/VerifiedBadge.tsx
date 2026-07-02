import { BadgeCheck } from "lucide-react";

interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;

  return (
    <BadgeCheck
      className="inline w-4 h-4 ml-1 text-sky-500 align-text-bottom"
      aria-label="Verified account"
    />
  );
}
