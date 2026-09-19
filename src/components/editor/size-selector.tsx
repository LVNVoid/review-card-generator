"use client";

import * as React from "react";
import { CARD_SIZES, CardSizeId } from "@/types/card";
import { cn } from "@/lib/utils";
import { CreditCard, PanelsTopLeft, Maximize2 } from "lucide-react";

interface SizeSelectorProps {
  selectedSize: CardSizeId;
  onSelectSize: (size: CardSizeId) => void;
}

export function SizeSelector({ selectedSize, onSelectSize }: SizeSelectorProps) {
  const sizeList = Object.values(CARD_SIZES);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sizeList.map((size) => {
          const isSelected = selectedSize === size.id;
          return (
            <button
              key={size.id}
              type="button"
              onClick={() => onSelectSize(size.id)}
              className={cn(
                "flex flex-col items-start p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer min-h-[56px]",
                isSelected
                  ? "bg-surface-muted border-google-blue ring-1 ring-google-blue/30 shadow-sm"
                  : "bg-surface border-border hover:border-border-hover hover:bg-surface-muted/40"
              )}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="text-xs font-semibold text-primary flex items-center gap-2">
                  {size.id.includes("pvc") ? (
                    <CreditCard className={cn("w-4 h-4", isSelected ? "text-google-blue" : "text-secondary")} />
                  ) : size.id.includes("standee") ? (
                    <PanelsTopLeft className={cn("w-4 h-4", isSelected ? "text-google-blue" : "text-secondary")} />
                  ) : (
                    <Maximize2 className={cn("w-4 h-4", isSelected ? "text-google-blue" : "text-secondary")} />
                  )}
                  {size.name}
                </span>
                <span className={cn(
                  "text-[10px] font-mono px-2 py-0.5 rounded border transition-colors",
                  isSelected
                    ? "bg-google-blue/10 border-google-blue/30 text-google-blue font-medium"
                    : "bg-surface border-border text-secondary"
                )}>
                  {size.badge}
                </span>
              </div>
              <p className="text-[11px] text-secondary leading-relaxed font-normal">
                {size.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
