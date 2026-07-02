import { memo, useCallback, useState } from "react";
import { Check, ListPlus } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { useSelectedListStore } from "@/stores/useSelectedListStore";
import { Button } from "@/components/ui/Button";

interface AddToListButtonProps {
  profile: UserProfileSummary;
  platform: Platform;
  size?: "sm" | "md";
  stopPropagation?: boolean;
}

export const AddToListButton = memo(function AddToListButton({
  profile,
  platform,
  size = "md",
  stopPropagation = false,
}: AddToListButtonProps) {
  const addProfile = useSelectedListStore((s) => s.addProfile);
  const isInList = useSelectedListStore((s) => s.isInList(profile.username));
  const [feedback, setFeedback] = useState<"added" | "duplicate" | null>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (stopPropagation) e.stopPropagation();

      if (isInList) return;

      const added = addProfile(profile, platform);
      setFeedback(added ? "added" : "duplicate");
      window.setTimeout(() => setFeedback(null), 2000);
    },
    [addProfile, isInList, platform, profile, stopPropagation]
  );

  if (isInList) {
    return (
      <Button
        variant="secondary"
        size={size}
        disabled
        aria-label={`@${profile.username} is already in your list`}
        className="shrink-0"
      >
        <Check className="w-4 h-4" aria-hidden />
        In List
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleClick}
      aria-label={`Add @${profile.username} to list`}
      className="shrink-0"
    >
      <ListPlus className="w-4 h-4" aria-hidden />
      {feedback === "duplicate" ? "Already added" : feedback === "added" ? "Added!" : "Add to List"}
    </Button>
  );
});
