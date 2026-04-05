import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const normalizeRole = (roleValue) => String(roleValue || "ROLE_TOURIST").replace(/^ROLE_/i, "").toLowerCase();

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { completeOAuthLogin } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const email = searchParams.get("email");
    const fullName = searchParams.get("fullName");
    const role = searchParams.get("role");

    if (!accessToken || !email) {
      navigate("/auth", { replace: true });
      return;
    }

    completeOAuthLogin({
      id: Date.now(),
      accessToken,
      refreshToken: refreshToken || "",
      tokenType: "Bearer",
      email,
      fullName: fullName || email.split("@")[0],
      roles: [role || "ROLE_TOURIST"],
    }, {
      role: normalizeRole(role),
      gender: "other",
    });

    navigate("/tourist-dashboard", { replace: true });
  }, [completeOAuthLogin, navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <p className="text-sm text-muted-foreground">Completing Google sign-in...</p>
    </div>
  );
}
