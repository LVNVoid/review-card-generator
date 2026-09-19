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
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {themeList.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          const IconComponent = icons[theme.id];

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme.id)}
              className={cn(
                "flex flex-col items-start p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer min-h-[56px]",
                isSelected
                  ? "bg-surface-muted border-google-blue ring-1 ring-google-blue/30 shadow-sm"
                  : "bg-surface border-border hover:border-border-hover hover:bg-surface-muted/40"
              )}
            >
              <div className="flex items-center gap-2 mb-1.5 w-full">
                <IconComponent
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isSelected ? "text-google-blue" : "text-secondary"
                  )}
                />
                <span className="text-xs font-semibold text-primary truncate">
                  {theme.name}
                </span>
              </div>
              <span className={cn(
                "text-[10px] font-mono mb-1 px-1.5 py-0.2 rounded border",
                isSelected
                  ? "bg-google-blue/10 border-google-blue/30 text-google-blue"
                  : "bg-surface border-border text-secondary"
              )}>
                {theme.tag}
              </span>
              <p className="text-[11px] text-secondary leading-relaxed font-normal">
                {theme.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
