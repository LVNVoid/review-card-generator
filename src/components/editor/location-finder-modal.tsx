"use client";

import * as React from "react";
import { resolveReviewUrl } from "@/lib/google-review-url";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleLogo } from "@/components/ui/google-icons";
import {
  Search,
  ExternalLink,
  ClipboardPaste,
  CheckCircle2,
  AlertCircle,
  X,
  MapPin,
  Share2,
  Copy,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (data: { businessName?: string; reviewUrl: string }) => void;
  initialQuery?: string;
}

export function LocationFinderModal({
  isOpen,
  onClose,
  onSelect,
  initialQuery = "",
}: LocationFinderModalProps) {
  const [query, setQuery] = React.useState(initialQuery);
  const [pastedUrl, setPastedUrl] = React.useState("");
  const [clipboardError, setClipboardError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setPastedUrl("");
      setClipboardError(null);
    }
  }, [isOpen, initialQuery]);

  // Handle Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resolved = resolveReviewUrl(pastedUrl);

  const handleOpenMaps = () => {
    const trimmed = query.trim();
    const url = trimmed
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`
      : "https://www.google.com/maps";
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handlePasteFromClipboard = async () => {
    setClipboardError(null);
    try {
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        setClipboardError("Fitur clipboard otomatis tidak didukung browser ini. Tempel link secara manual di kotak bawah.");
        return;
      }
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        setClipboardError("Clipboard kosong. Salin tautan tempat di Google Maps terlebih dahulu.");
        return;
      }
      setPastedUrl(text.trim());
    } catch {
      setClipboardError("Izin clipboard ditolak. Tempel link secara manual pada kolom input.");
    }
  };

  const handleApply = () => {
    if (!resolved.isValid) return;
    onSelect({
      businessName: query.trim() || undefined,
      reviewUrl: resolved.targetUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header with Google Colors */}
        <div className="h-[2px] w-full grid grid-cols-4 shrink-0">
          <div className="bg-google-blue h-full" />
          <div className="bg-google-red h-full" />
          <div className="bg-google-yellow h-full" />
          <div className="bg-google-green h-full" />
        </div>

        <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between shrink-0 bg-surface">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-canvas border border-border flex items-center justify-center shrink-0">
              <GoogleLogo size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-google-sans text-primary flex items-center gap-2">
                Bantu Cari Lokasi Google Maps
              </h2>
              <p className="text-xs text-secondary font-google-sans-text">
                Dapatkan link ulasan toko tanpa perlu Google Maps API Key
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-muted transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Step 1: Search Name */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-google-blue uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-google-blue/15 flex items-center justify-center text-[11px]">
                  1
                </span>
                Ketik Nama Tempat & Buka Maps
              </span>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Contoh: Kopi Sangkara Ambarawa"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleOpenMaps();
                  }
                }}
                className="bg-canvas"
              />
              <Button
                type="button"
                variant="google"
                onClick={handleOpenMaps}
                className="shrink-0 text-xs px-3 font-google-sans h-11"
              >
                <Search size={14} />
                <span className="hidden sm:inline">Cari di Maps</span>
                <ExternalLink size={12} className="opacity-80" />
              </Button>
            </div>
          </div>

          {/* Step 2: Micro-Guide */}
          <div className="p-3.5 rounded-xl bg-canvas border border-border space-y-2">
            <span className="text-[11px] font-mono font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-surface-muted border border-border flex items-center justify-center text-[10px]">
                2
              </span>
              Cara Ambil Link di Google Maps
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-secondary font-google-sans-text">
              <div className="flex items-start gap-2 p-2 rounded-lg bg-surface border border-border/60">
                <Share2 size={14} className="text-google-blue shrink-0 mt-0.5" />
                <span>
                  Buka profil toko di Maps, klik tombol <strong>Bagikan</strong> (Share).
                </span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-surface border border-border/60">
                <Copy size={14} className="text-google-green shrink-0 mt-0.5" />
                <span>
                  Pilih <strong>Salin Tautan</strong> (Copy Link) ke clipboard.
                </span>
              </div>
            </div>
          </div>

          {/* Step 3: Paste & Resolve */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-google-green uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-google-green/15 flex items-center justify-center text-[11px]">
                  3
                </span>
                Tempel & Verifikasi Link
              </span>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handlePasteFromClipboard}
                className="h-7 px-2.5 text-xs font-google-sans text-google-green hover:text-google-green"
              >
                <ClipboardPaste size={12} />
                <span>Tempel dari Clipboard</span>
              </Button>
            </div>

            <Input
              placeholder="Tempel link ulasan Google Maps di sini..."
              value={pastedUrl}
              onChange={(e) => {
                setPastedUrl(e.target.value);
                setClipboardError(null);
              }}
              className="bg-canvas font-mono text-xs"
            />

            {clipboardError && (
              <p className="text-[11px] text-google-yellow font-google-sans-text flex items-center gap-1">
                <AlertCircle size={12} className="shrink-0" />
                <span>{clipboardError}</span>
              </p>
            )}

            {pastedUrl && (
              <div className="pt-1">
                {resolved.isValid ? (
                  <div className="p-3 rounded-xl bg-google-green/10 border border-google-green/30 flex items-start gap-2.5 text-xs text-google-green font-google-sans-text">
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-google-green" />
                    <div className="space-y-0.5">
                      <p className="font-bold">Link Valid Terdeteksi ({resolved.type})</p>
                      <p className="text-[11px] text-primary/80 font-mono truncate max-w-[360px]">
                        {resolved.targetUrl}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-google-red/10 border border-google-red/30 flex items-start gap-2.5 text-xs text-google-red font-google-sans-text">
                    <AlertCircle size={16} className="shrink-0 mt-0.5 text-google-red" />
                    <div>
                      <p className="font-bold">Link Tidak Valid</p>
                      <p className="text-[11px] text-google-red/80">
                        {resolved.errorMessage || "Pastikan URL berasal dari Google Maps atau format Place ID yang valid."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-border bg-surface-muted flex items-center justify-end gap-2 shrink-0">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Batal
          </Button>

          <Button
            type="button"
            variant="google"
            size="sm"
            disabled={!resolved.isValid}
            onClick={handleApply}
            className="font-google-sans text-xs"
          >
            <Sparkles size={14} />
            <span>Gunakan Link Ini</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
