"use client";

import { fetcher } from "@/lib/fetcher";
import type { User } from "@/types/api";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export function useAuth() {
  const { data, isLoading, error, mutate } = useSWR<User | null>("/auth/me", {
    revalidateOnFocus: true,
    dedupingInterval: 20000,
  });
  const router = useRouter();

  const logout = async () => {
    await fetcher("/auth/logout", { method: "POST" });
    await mutate(null, false); // clear cache immediately, skip revalidation
    router.push("/auth/login");
  };

  return {
    user: data ?? null,
    isLoading,
    isAuthenticated: !!data,
    error,
    logout,
    revalidate: mutate,
  };
}

export function useLogin() {
  const router = useRouter();

  const loginWithEmail = async (email: string, password: string) => {
    await fetcher("/auth/emailpassword", {
      method: "POST",
      body: { email, password },
    });
    router.replace("/dashboard");
  };

  const signupWithEmail = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    await fetcher("/auth/signup", {
      method: "POST",
      body: { name, email, password, confirmPassword },
    });
    router.replace("/dashboard");
  };

  const loginWithGoogle = () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`;
    router.push(url);
  };

  const loginWithGithub = () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/github`;
    router.push(url);
  };

  return {
    loginWithGoogle,
    loginWithGithub,
    loginWithEmail,
    signupWithEmail,
  };
}
