"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings, Shield, LogIn, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { signInWithGoogle, signOut } from "@/lib/supabase/auth-actions";
import { type User as SupabaseUser } from "@supabase/supabase-js";

export default function UserMenu({ user }: { user: SupabaseUser | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-5 py-2.5 bg-background border border-border-glass-bright/30 rounded-full text-[11px] font-black uppercase tracking-widest hover:border-accent-blue/50 transition-all shadow-sm active:scale-95"
      >
        <LogIn className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Sign In</span>
      </Link>
    );
  }

  const initials = user.email?.substring(0, 2).toUpperCase() || "??";
  const isAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || user.app_metadata?.role === 'admin';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-3 bg-background border border-border-glass-bright/30 rounded-full hover:border-accent-blue/50 transition-all shadow-sm active:scale-95"
      >
        <div className="flex flex-col items-end mr-1 hidden xs:block">
            <span className="text-[10px] font-black uppercase tracking-tighter leading-none line-clamp-1 max-w-[100px]">
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
            </span>
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-0.5">
                Operative
            </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue text-[10px] font-black">
          {user.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full rounded-full" />
          ) : (
            initials
          )}
        </div>
        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-56 glass-card p-2 border-border-glass bg-bg-glass backdrop-blur-xl z-[60] shadow-2xl"
          >
            <div className="p-3 mb-2 border-b border-white/5">
                <p className="text-[11px] font-black uppercase tracking-tight line-clamp-1">{user.email}</p>
                <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-[0.2em] mt-1">Verified Watchdog</p>
            </div>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 text-accent-blue transition-all group"
              >
                <Shield className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-widest">Command Center</span>
              </Link>
            )}

            <button
              onClick={() => { /* Handle profile */ setIsOpen(false); }}
              className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-all text-muted-foreground hover:text-foreground"
            >
              <User className="w-4 h-4" />
              <span className="text-[11px] font-black uppercase tracking-widest">My Dossiers</span>
            </button>

            <button
              onClick={() => { /* Handle settings */ setIsOpen(false); }}
              className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-all text-muted-foreground hover:text-foreground"
            >
              <Settings className="w-4 h-4" />
              <span className="text-[11px] font-black uppercase tracking-widest">Settings</span>
            </button>

            <div className="mt-2 pt-2 border-t border-white/5">
                <button
                onClick={() => signOut()}
                className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-accent-crimson/10 text-accent-crimson transition-all"
                >
                <LogOut className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-widest">Terminate Session</span>
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
