"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

/** Loads JWT + user from localStorage into the auth store (client only). */
export function AuthBootstrap() {
  useEffect(() => {
    useAuthStore.getState().bootstrap();
  }, []);
  return null;
}
