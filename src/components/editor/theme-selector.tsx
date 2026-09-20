"use client";

import * as React from "react";
import { CARD_THEMES, CardThemeId } from "@/types/card";
import { cn } from "@/lib/utils";
import { Sparkles, Moon, PenTool } from "lucide-react";

interface ThemeSelectorProps {
  selectedTheme: CardThemeId;
  onSelectTheme: (theme: CardThemeId) => void;
}

export function ThemeSelector({ selectedTheme, onSelectTheme }: ThemeSelectorProps) {
  const themeList = Object.values(CARD_THEMES);

  const icons: Record<CardThemeId, React.ComponentType<{ className?: string }>> = {
    "google-official": Sparkles,
    "dark-acrylic": Moon,
    "minimalist": PenTool,
  };

  return (
    <div className="space-y-2">
      <div className="flex sm:grid sm:grid-cols-3 gap-2.5 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scrollbar-none snap-x -mx-1 px-1">
        {themeList.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          const IconComponent = icons[theme.id];

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme.id)}
              className={cn(
                "flex flex-col items-start p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer min-h-[56px] w-[190px] sm:w-auto shrink-0 snap-start",
                isSelected
                  ? "bg-m3-tonal/20 border-m3-primary ring-1 ring-m3-primary/30 shadow-xs"
                  : "bg-surface border-border hover:border-border-hover hover:bg-surface-muted/40"
              )}
            >
              <div className="flex items-center gap-1.5 mb-1 w-full">
                <IconComponent
                  className={cn(
                    "w-3.5 h-3.5 shrink-0",
                    isSelected ? "text-m3-primary" : "text-secondary"
                  )}
                />
                <span className="text-xs font-semibold text-primary truncate font-google-sans">
                  {theme.name}
                </span>
              </div>
              <span className={cn(
                "text-[9px] font-mono mb-1 px-2 py-0.5 rounded-full border",
                isSelected
                  ? "bg-m3-tonal/40 border-m3-primary/30 text-m3-primary"
                  : "bg-surface-muted border-border text-secondary"
              )}>
                {theme.tag}
              </span>
              <p className="text-[10.5px] sm:text-[11px] text-secondary leading-snug font-normal line-clamp-2">
                {theme.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
