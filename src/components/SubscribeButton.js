"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellRing } from "lucide-react";
import { request } from "@/lib/request";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

/**
 * Reusable Subscribe button for following/unfollowing a user.
 * - Uses shared request util
 * - Minimal, English UI, lucide icons
 */
export default function SubscribeButton({
  userId,
  isFollowing = false,
  onChanged, // (action: 'follow' | 'unfollow') => void
  className = "",
  size = "default",
  variant = isFollowing ? "secondary" : "default",
  disabled = false,
}) {
  const router = useRouter();
  const { user: currentUser } = useAuth?.() || {};
  const [following, setFollowing] = useState(!!isFollowing);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setFollowing(!!isFollowing);
  }, [isFollowing]);

  const handleClick = async () => {
    if (pending || disabled) return;
    if (!userId) return;

    // Prevent self-subscribe
    if (currentUser?.id && currentUser.id === userId) {
      toast.error("You cannot subscribe to yourself");
      return;
    }

    // Require login before subscribing
    if (!currentUser?.id) {
      toast.error("Please sign in to subscribe");
      router.push("/login");
      return;
    }
    const nextAction = following ? "unfollow" : "follow";
    setPending(true);
    try {
      const { data } = await request(`/api/users/${userId}/follow`, {
        method: "POST",
        body: { action: nextAction },
      });

      if (data?.success) {
        setFollowing(nextAction === "follow");
        if (typeof onChanged === "function") {
          onChanged(nextAction);
        }
      } else {
      }
    } catch (_) {
      // Errors are handled internally by shared request util
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      className={className}
      size={size}
      variant={variant}
      onClick={handleClick}
      disabled={pending || disabled}
      aria-label={following ? "Unsubscribe" : "Subscribe"}
    >
      {following ? (
        <span className="inline-flex items-center gap-2">
          <BellRing className="w-4 h-4" />
          Unsubscribe
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Subscribe
        </span>
      )}
    </Button>
  );
}
