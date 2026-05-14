"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const FullScreenDataModal = ({
  trigger,
  title,
  description,
  children,
  defaultOpen = false,
  open,
  onOpenChange,
}: {
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  return (
    <DialogPrimitive.Root defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <DialogPrimitive.Trigger asChild>
          {trigger}
        </DialogPrimitive.Trigger>
      )}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed inset-0 z-50 grid w-full h-[100dvh] gap-4 bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:max-w-xl sm:rounded-lg sm:h-[85vh] sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]">
          <div className="flex flex-col h-full max-h-full">
            <div className="flex items-start justify-between border-b border-border-glass pb-4 shrink-0">
              <div className="pr-4">
                <DialogPrimitive.Title className="text-xl font-bold tracking-tight">
                  {title}
                </DialogPrimitive.Title>
                {description && (
                  <DialogPrimitive.Description className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    {description}
                  </DialogPrimitive.Description>
                )}
              </div>
              <DialogPrimitive.Close className="h-11 w-11 flex items-center justify-center rounded-full bg-secondary/50 text-secondary-foreground hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-crimson transition-colors shrink-0 touch-manipulation">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </div>
            
            <div className="flex-1 overflow-y-auto overflow-x-hidden pt-6 pb-12">
              {children}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export { FullScreenDataModal };
