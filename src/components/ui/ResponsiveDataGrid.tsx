import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: React.ReactNode;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  mobilePriority?: "primary" | "secondary" | "hidden";
}

interface ResponsiveDataGridProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  className?: string;
  rowHref?: (item: T) => string;
}

export function ResponsiveDataGrid<T>({
  data,
  columns,
  keyExtractor,
  className,
  rowHref,
}: ResponsiveDataGridProps<T>) {
  return (
    <div className={cn("w-full", className)}>
      {/* Desktop Table View */}
      <div className="hidden md:block w-full overflow-x-auto rounded-lg border border-border-glass bg-bg-glass">
        <table className="w-full text-sm text-left">
          <thead className="bg-background/50 border-b border-border-glass text-muted-foreground uppercase text-[11px] tracking-wider font-bold">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={cn("px-6 py-4", col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-glass">
            {data.map((item) => (
              <tr 
                key={keyExtractor(item)} 
                className={cn(
                  "hover:bg-accent/5 transition-colors group relative",
                )}
              >
                {columns.map((col, idx) => (
                  <td key={idx} className={cn("px-6 py-4 whitespace-nowrap text-[13px] relative", col.className)}>
                    {col.cell ? col.cell(item) : String((item as any)[col.accessorKey] || "")}
                    {/* Add absolute link over the first column to make row clickable without invalid HTML */}
                    {rowHref && idx === 0 && (
                       <Link href={rowHref(item)} className="absolute inset-0 z-10" aria-label="View details" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="flex md:hidden flex-col gap-4">
        {data.map((item) => (
          <div 
            key={keyExtractor(item)}
            className={cn(
              "bg-bg-glass border border-border-glass rounded-xl p-5 flex flex-col gap-3 relative",
              rowHref && "active:scale-[0.98] transition-transform touch-manipulation"
            )}
          >
            {rowHref && (
              <Link href={rowHref(item)} className="absolute inset-0 z-10" aria-label="View details" />
            )}
            
            {/* Primary Columns */}
            <div className="flex flex-col gap-1.5 relative z-20 pointer-events-none">
              {columns.filter(c => c.mobilePriority === "primary" || !c.mobilePriority).map((col, idx) => (
                <div key={idx} className="text-[15px] leading-snug text-foreground font-semibold">
                  {col.cell ? col.cell(item) : String((item as any)[col.accessorKey] || "")}
                </div>
              ))}
            </div>
            
            {/* Secondary Attributes Grid */}
            {columns.some(c => c.mobilePriority === "secondary") && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-3 pt-3 border-t border-border-glass/50 relative z-20 pointer-events-none">
                {columns.filter(c => c.mobilePriority === "secondary").map((col, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                      {col.header}
                    </span>
                    <span className="text-[13px] font-medium text-foreground">
                      {col.cell ? col.cell(item) : String((item as any)[col.accessorKey] || "-")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
