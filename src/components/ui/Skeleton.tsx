"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "rect" | "circle" | "text";
}

export function Skeleton({ className, variant = "rect" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-bg-glass border border-border-glass",
        variant === "circle" ? "rounded-full" : "rounded-xl",
        className
      )}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

export function DossierSkeleton() {
  return (
    <div className="glass-card p-6 space-y-6 bg-bg-glass border-border-glass">
      <div className="flex justify-between items-start">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8" variant="circle" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
      <Skeleton className="h-10 w-full rounded-2xl" />
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="glass-card p-5 border-border-glass bg-bg-glass flex items-center justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-10 w-10 rounded-xl" />
    </div>
  );
}

export function VolumeSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-12" />
      </div>
      <Skeleton className="h-1.5 w-full rounded-full" />
    </div>
  );
}

export function IncidentSkeleton() {
  return (
    <div className="flex items-center gap-6 px-4">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}
