"use client";

import React, { useEffect, useState, createContext, useContext } from "react";

interface PwaContextType {
  isOffline: boolean;
}

const PwaContext = createContext<PwaContextType>({ isOffline: false });

export const usePwa = () => useContext(PwaContext);

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Register Service Worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("[PWA] ServiceWorker registration successful:", registration.scope);
          })
          .catch((err) => {
            console.log("[PWA] ServiceWorker registration failed: ", err);
          });
      });
    }

    // 2. Monitor connectivity
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    setIsOffline(!window.navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <PwaContext.Provider value={{ isOffline }}>
      {children}
    </PwaContext.Provider>
  );
}
