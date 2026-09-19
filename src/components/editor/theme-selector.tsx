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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {themeList.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          const IconComponent = icons[theme.id];

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme.id)}
              className={cn(
                "flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all cursor-pointer min-h-[44px]",
                isSelected
                  ? "bg-accent-subtle border-accent shadow-sm"
                  : "bg-surface border-border hover:border-secondary/40 hover:bg-surface-muted"
              )}
            >
              <div className="flex items-center gap-2 mb-1.5 w-full">
                <IconComponent className="w-4 h-4 text-accent shrink-0" />
                <span className="text-xs font-bold text-primary truncate">
                  {theme.name}
                </span>
              </div>
              <span className="text-[10px] font-medium text-accent mb-1">
                {theme.tag}
              </span>
              <p className="text-[11px] text-secondary leading-snug font-normal">
                {theme.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
