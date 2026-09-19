"use client";

import * as React from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        accept="image/png,image/jpeg,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {logoDataUrl ? (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border">
          <div className="w-11 h-11 rounded-lg bg-surface-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoDataUrl}
              alt="Logo Preview"
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-primary block truncate">
              Logo Toko Tersemat
            </span>
            <span className="text-[11px] text-secondary block font-mono">
              Otomatis di tengah QR Code
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-secondary hover:text-google-red"
            title="Hapus Logo"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border border-dashed border-border hover:border-border-hover bg-surface/50 hover:bg-surface-muted/50 transition-all cursor-pointer text-secondary hover:text-primary min-h-[48px]"
        >
          <Upload className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium">
            Unggah Logo Tengah QR (PNG / SVG / JPG, maks 2MB)
          </span>
        </button>
      )}
    </div>
  );
}
