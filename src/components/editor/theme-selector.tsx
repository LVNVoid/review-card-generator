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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {themeList.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          const IconComponent = icons[theme.id];

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme.id)}
              className={cn(
                "flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer min-h-[48px]",
                isSelected
                  ? "bg-surface-muted border-primary shadow-sm"
                  : "bg-surface border-border hover:border-border-hover hover:bg-surface-muted/50"
              )}
            >
              <div className="flex items-center gap-1.5 mb-1 w-full">
                <IconComponent className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs font-semibold text-primary truncate">
                  {theme.name}
                </span>
              </div>
              <span className="text-[10px] font-mono text-secondary mb-1">
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
