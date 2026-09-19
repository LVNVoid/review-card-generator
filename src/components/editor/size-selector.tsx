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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {sizeList.map((size) => {
          const isSelected = selectedSize === size.id;
          return (
            <button
              key={size.id}
              type="button"
              onClick={() => onSelectSize(size.id)}
              className={cn(
                "flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all cursor-pointer min-h-[44px]",
                isSelected
                  ? "bg-accent-subtle border-accent shadow-sm"
                  : "bg-surface border-border hover:border-secondary/40 hover:bg-surface-muted"
              )}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                  {size.id.includes("pvc") ? (
                    <CreditCard className="w-3.5 h-3.5 text-accent" />
                  ) : size.id.includes("standee") ? (
                    <PanelsTopLeft className="w-3.5 h-3.5 text-accent" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5 text-accent" />
                  )}
                  {size.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-muted text-secondary border border-border">
                  {size.badge}
                </span>
              </div>
              <p className="text-[11px] text-secondary leading-normal font-normal">
                {size.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
