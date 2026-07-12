import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Pusher from "pusher-js";
import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";

export interface INotification {
  _id: string;
  userId: string;
  type: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export function useNotifications() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const queryKey = ["notifications", userId];

  const query = useQuery<INotification[]>({
    queryKey,
    queryFn: async () => {
      if (!session) return [];
      const res = await apiClient.get("/users/me/notifications");
      return res.data.data || [];
    },
    enabled: !!session,
  });

  const markReadMutation = useMutation({
    mutationFn: async () => {
      await apiClient.patch("/users/me/notifications/mark-read");
    },
    onSuccess: () => {
      queryClient.setQueryData(queryKey, (old: INotification[] = []) =>
        old.map((n) => ({ ...n, read: true }))
      );
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Pusher Realtime Subscription
  useEffect(() => {
    if (!userId) return;

    // Use environment keys
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY || "placeholder_pusher_key";
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mt1";

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
    });

    const channelName = `notifications-${userId}`;
    const channel = pusher.subscribe(channelName);
    
    channel.bind("new-notification", (newNotification: any) => {
      const normalizedNotification: INotification = {
        _id: newNotification.id || newNotification._id,
        userId: newNotification.userId,
        type: newNotification.type,
        message: newNotification.message,
        link: newNotification.link,
        read: !!newNotification.read,
        createdAt: newNotification.createdAt,
      };

      // Add to React Query cache
      queryClient.setQueryData(queryKey, (old: INotification[] = []) => {
        if (old.some((n) => n._id === normalizedNotification._id)) return old;
        return [normalizedNotification, ...old];
      });

      // Dispatch custom DOM event to trigger the pulse animation in the bell UI
      window.dispatchEvent(new CustomEvent("new-notification-pulse"));
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [userId, queryClient, queryKey]);

  return {
    ...query,
    markAllAsRead: markReadMutation.mutate,
    isMarkingRead: markReadMutation.isPending,
  };
}
