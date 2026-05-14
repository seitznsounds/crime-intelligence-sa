"use client";

import * as React from "react";
import { Maximize2 } from "lucide-react";
import { FullScreenDataModal } from "./FullScreenDataModal";

interface MobileExpandableChartProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function MobileExpandableChart({ title, description, children }: MobileExpandableChartProps) {
  return (
    <>
      {/* Desktop View (Full Render) */}
      <div className="hidden md:block w-full h-full min-h-[350px]">
        {children}
      </div>

      {/* Mobile View (Preview with Modal) */}
      <div className="block md:hidden">
        <FullScreenDataModal
          title={title}
          description={description}
          trigger={
            <button className="w-full relative group rounded-xl border border-border-glass bg-bg-glass overflow-hidden active:scale-[0.98] transition-all touch-manipulation text-left">
              {/* Overlay indicating it's expandable */}
              <div className="absolute inset-0 z-10 bg-background/5 group-hover:bg-background/20 transition-colors flex items-center justify-center pointer-events-auto">
                <div className="bg-background/95 backdrop-blur-md px-4 py-2 rounded-full border border-border-glass flex items-center gap-2 shadow-xl shadow-black/20">
                  <Maximize2 className="h-4 w-4 text-accent-blue" />
                  <span className="text-[13px] font-bold tracking-tight text-foreground">Tap to Interact</span>
                </div>
              </div>
              
              {/* Preview container */}
              <div className="h-[220px] w-full p-4 pointer-events-none opacity-50 filter blur-[1px] select-none">
                {children}
              </div>
            </button>
          }
        >
          {/* Expanded Full Screen Content */}
          <div className="w-full h-[65vh] min-h-[400px]">
             {children}
          </div>
        </FullScreenDataModal>
      </div>
    </>
  );
}
