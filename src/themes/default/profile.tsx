import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth-store";
import type { BarbershopPageProps } from "../types";

export default function DefaultProfilePage({ slug }: BarbershopPageProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/${slug}/entrar`);
    }
  }, [isAuthenticated, slug, navigate]);

  return (
    <div className="min-h-screen p-6">
      {/* histórico e cancelamentos — implementado em components/profile/ */}
    </div>
  );
}
