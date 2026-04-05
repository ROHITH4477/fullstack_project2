import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);
const SESSION_KEY = "stayvista_auth_session";

const DEFAULT_AVATARS = {
  male: "https://api.dicebear.com/7.x/personas/svg?seed=male-traveller&backgroundType=gradientLinear",
  female: "https://api.dicebear.com/7.x/personas/svg?seed=female-traveller&backgroundType=gradientLinear",
  other: "https://api.dicebear.com/7.x/personas/svg?seed=traveller-default&backgroundType=gradientLinear",
};

const normalizeGender = (value) => {
  if (value === "male" || value === "female") {
    return value;
  }
  return "other";
};

const getDefaultAvatarByGender = (gender) => DEFAULT_AVATARS[normalizeGender(gender)] || DEFAULT_AVATARS.other;

const normalizeRole = (roles = [], fallback = "tourist") => {
  const firstRole = Array.isArray(roles) ? roles[0] : roles;
  if (!firstRole) {
    return fallback;
  }

  return String(firstRole).replace(/^ROLE_/i, "").toLowerCase();
};

const loadStoredSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

const persistSession = (session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem("token", session.accessToken);
  localStorage.setItem("refreshToken", session.refreshToken || "");
};

const clearStoredSession = () => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");
};

const toFrontendUser = (authResponse, extras = {}) => {
  const role = normalizeRole(authResponse.roles, extras.role);
  const gender = normalizeGender(extras.gender);

  return {
    id: authResponse.id,
    name: authResponse.fullName,
    email: authResponse.email,
    role,
    gender,
    avatar: extras.avatar || getDefaultAvatarByGender(gender),
    phone: extras.phone || "",
  };
};

const persistAuthResponse = (authResponse, extras = {}) => {
  const nextUser = toFrontendUser(authResponse, extras);
  persistSession({ ...authResponse, user: nextUser });
  return nextUser;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => loadStoredSession()?.user || null);

  useEffect(() => {
    const stored = loadStoredSession();
    if (stored?.user) {
      setUser(stored.user);
    }
  }, []);

  const login = async (email, password, role) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    const nextUser = persistAuthResponse(data, { role });
    setUser(nextUser);
  };

  const signup = async (data) => {
    const payload = {
      fullName: data.name,
      email: data.email,
      password: data.password,
      role: String(data.role || "tourist").toUpperCase(),
    };

    const { data: response } = await api.post("/api/auth/signup", payload);
    const nextUser = persistAuthResponse(response, {
      phone: data.phone,
      gender: data.gender,
    });
    setUser(nextUser);
  };

  const completeOAuthLogin = (authResponse, extras = {}) => {
    const nextUser = persistAuthResponse(authResponse, extras);
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    clearStoredSession();
    setUser(null);
  };

  const updateProfile = (data) => {
    setUser((prev) => {
      if (!prev) {
        return prev;
      }

      const nextUser = { ...prev, ...data };
      const stored = loadStoredSession();
      if (stored) {
        persistSession({ ...stored, user: nextUser });
      }
      return nextUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, signup, completeOAuthLogin, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
