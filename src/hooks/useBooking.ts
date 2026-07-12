import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

export interface BookingInput {
  serviceId: string;
  date: string;
  timeSlot: string;
  notes?: string;
}

export function useBookings() {
  const { data: session } = authClient.useSession();
  
  return useQuery({
    queryKey: ["bookings", session?.user?.id],
    queryFn: async () => {
      if (!session) return [];
      const response = await apiClient.get("/bookings");
      return response.data.data || [];
    },
    enabled: !!session,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  return useMutation({
    mutationFn: async (bookingData: BookingInput) => {
      const response = await apiClient.post("/bookings", bookingData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", session?.user?.id] });
      toast.success("Booking placed successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || "Failed to create booking.");
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiClient.patch(`/bookings/${id}`, { status });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookings", session?.user?.id] });
      toast.success(`Booking status updated to ${data.status}`);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || "Failed to update booking status.");
    },
  });
}
