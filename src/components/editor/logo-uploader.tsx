"use client";

import * as React from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LogoUploaderProps {
  logoDataUrl?: string;
  onLogoChange: (dataUrl?: string) => void;
}

export function LogoUploader({ logoDataUrl, onLogoChange }: LogoUploaderProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file logo maksimal 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onLogoChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onLogoChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {logoDataUrl ? (
        <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-surface-muted border border-border">
          <div className="w-12 h-12 rounded-lg bg-card-white border border-border flex items-center justify-center overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoDataUrl}
              alt="Logo Preview"
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-primary block truncate">
              Logo Bisnis Tersemat
            </span>
            <span className="text-[11px] text-secondary block font-mono">
              Otomatis dipasang di tengah kode QR
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
            className="text-google-red border-google-red/30 hover:bg-google-red/10 hover:border-google-red/50"
            title="Hapus Logo"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Hapus</span>
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "w-full flex flex-col items-center justify-center p-6 sm:p-7 rounded-xl border border-dashed border-border bg-surface text-center cursor-pointer transition-all",
            "hover:border-google-blue/50 hover:bg-google-blue/5 min-h-[56px]"
          )}
        >
          <div className="w-10 h-10 rounded-xl bg-surface-muted border border-border flex items-center justify-center text-google-blue mb-2.5">
            <Upload className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-primary block mb-1">
            Unggah Logo Bisnis di Tengah QR
          </span>
          <span className="text-[11px] text-secondary max-w-xs leading-relaxed block font-normal">
            PNG transparan atau SVG persegi disarankan (Maksimal 2MB)
          </span>
        </button>
      )}
    </div>
  );
}
