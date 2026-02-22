import React, { createContext, useContext, useState } from "react";
const AuthContext = createContext(null);
const MOCK_USERS_KEY = "stayvista_mock_users";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Admin@123";
const DEFAULT_AVATARS = {
    male: "https://api.dicebear.com/7.x/personas/svg?seed=male-traveller&backgroundType=gradientLinear",
    female: "https://api.dicebear.com/7.x/personas/svg?seed=female-traveller&backgroundType=gradientLinear",
    other: "https://api.dicebear.com/7.x/personas/svg?seed=traveller-default&backgroundType=gradientLinear",
};
const normalizeGender = (value) => {
    if (value === "male" || value === "female")
        return value;
    return "other";
};
const getDefaultAvatarByGender = (gender) => DEFAULT_AVATARS[normalizeGender(gender)] || DEFAULT_AVATARS.other;
const getStoredUsers = () => {
    try {
        const raw = localStorage.getItem(MOCK_USERS_KEY);
        if (!raw)
            return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch {
        return [];
    }
};
const setStoredUsers = (users) => {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const login = async (email, password, role) => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (role === "admin") {
            const normalizedInput = (email || "").trim().toLowerCase();
            const isValidAdmin = normalizedInput === ADMIN_USERNAME && password === ADMIN_PASSWORD;
            if (!isValidAdmin) {
                throw new Error("Invalid admin credentials");
            }
            setUser({
                id: "admin-fixed",
                name: "Admin",
                email: ADMIN_USERNAME,
                role: "admin",
                gender: "other",
                avatar: getDefaultAvatarByGender("other"),
                phone: "",
            });
            return;
        }
        const storedUsers = getStoredUsers();
        const existingUser = storedUsers.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());
        const gender = normalizeGender(existingUser?.gender);
        setUser({
            id: existingUser?.id || "user-" + Date.now(),
            name: existingUser?.name || email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            email,
            role,
            gender,
            avatar: existingUser?.avatar || getDefaultAvatarByGender(gender),
            phone: existingUser?.phone || "",
        });
    };
    const signup = async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (data.role === "admin") {
            throw new Error("Admin signup is disabled");
        }
        const normalizedGender = normalizeGender(data.gender);
        const newUser = {
            id: "user-" + Date.now(),
            name: data.name,
            email: data.email,
            role: data.role,
            gender: normalizedGender,
            avatar: getDefaultAvatarByGender(normalizedGender),
            phone: data.phone,
        };
        const storedUsers = getStoredUsers();
        const nextUsers = storedUsers.filter((candidate) => candidate.email.toLowerCase() !== data.email.toLowerCase());
        nextUsers.push(newUser);
        setStoredUsers(nextUsers);
        setUser(newUser);
    };
    const loginWithGoogle = async ({ email, name, avatar, role = "tourist" }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (role === "admin") {
            throw new Error("Admin Google login is disabled");
        }
        const storedUsers = getStoredUsers();
        const existingUser = storedUsers.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());
        const gender = normalizeGender(existingUser?.gender);
        const resolvedAvatar = avatar || existingUser?.avatar || getDefaultAvatarByGender(gender);
        const nextUser = {
            id: existingUser?.id || "user-" + Date.now(),
            name: name || existingUser?.name || email.split("@")[0],
            email,
            role,
            gender,
            avatar: resolvedAvatar,
            phone: existingUser?.phone || "",
        };
        const nextUsers = storedUsers.filter((candidate) => candidate.email.toLowerCase() !== email.toLowerCase());
        nextUsers.push(nextUser);
        setStoredUsers(nextUsers);
        setUser(nextUser);
    };
    const logout = () => {
        setUser(null);
    };
    const updateProfile = (data) => {
        setUser((prev) => {
            if (!prev) {
                return prev;
            }
            return {
                ...prev,
                ...data,
            };
        });
    };
        return (<AuthContext.Provider value={{ user, isLoggedIn: !!user, login, signup, loginWithGoogle, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>);
};
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
