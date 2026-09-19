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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {sizeList.map((size) => {
          const isSelected = selectedSize === size.id;
          return (
            <button
              key={size.id}
              type="button"
              onClick={() => onSelectSize(size.id)}
              className={cn(
                "flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer min-h-[48px]",
                isSelected
                  ? "bg-surface-muted border-primary shadow-sm"
                  : "bg-surface border-border hover:border-border-hover hover:bg-surface-muted/50"
              )}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                  {size.id.includes("pvc") ? (
                    <CreditCard className="w-3.5 h-3.5 text-primary" />
                  ) : size.id.includes("standee") ? (
                    <PanelsTopLeft className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5 text-primary" />
                  )}
                  {size.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border text-secondary">
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
