import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export function useAdmin() {
  const { isAuthenticated, user } = useAuth();

  const { data: adminStatus, isLoading } = useQuery({
    queryKey: ["/api/auth/admin-status"],
    enabled: isAuthenticated,
    retry: false,
  });

  return {
    isAdmin: adminStatus?.isAdmin || false,
    isLoading: isLoading && isAuthenticated,
    canAccessAdmin: isAuthenticated && adminStatus?.isAdmin,
  };
}