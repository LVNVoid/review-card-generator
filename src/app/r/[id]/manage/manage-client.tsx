"use client";

import * as React from "react";
import { GoogleLogo } from "@/components/ui/google-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateCardUrlAction } from "@/actions/card-actions";
import { AlertCircle, CheckCircle2, Lock, BarChart3, ExternalLink } from "lucide-react";

interface ManageClientProps {
  cardId: string;
  businessName: string | null;
  googleReviewUrl: string | null;
  scanCount: number;
  activatedAt: string | null;
}

export function ManageClient({
  cardId,
  businessName: initialBusinessName,
  googleReviewUrl: initialReviewUrl,
  scanCount,
  activatedAt,
}: ManageClientProps) {
  const [pin, setPin] = React.useState("");
  const [businessName, setBusinessName] = React.useState(initialBusinessName || "");
  const [googleReviewUrl, setGoogleReviewUrl] = React.useState(initialReviewUrl || "");
  const [isUnlocked, setIsUnlocked] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!pin) {
      setError("Masukkan PIN kartu Anda");
      return;
    }

    setLoading(true);
    try {
      const res = await updateCardUrlAction({
        id: cardId,
        pin,
        newReviewUrl: googleReviewUrl,
        newBusinessName: businessName,
      });

      if (!res.success) {
        setError(res.error || "Gagal memperbarui kartu");
      } else {
        setIsUnlocked(true);
        setSuccessMsg("Pengaturan kartu berhasil diperbarui!");
      }
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-primary flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border shadow-xs">
            <GoogleLogo size={18} />
            <span className="text-xs font-bold font-google-sans text-primary">
              Portal Manajemen Kartu
            </span>
          </div>
          <h1 className="text-2xl font-black font-google-sans tracking-tight text-primary">
            Kelola Kartu #{cardId}
          </h1>
        </div>

        {/* Analytics Card */}
        <div className="bg-surface border border-border rounded-2xl p-5 grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-canvas rounded-xl border border-border space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs text-secondary">
              <BarChart3 size={14} className="text-google-blue" />
              <span>Total Scan</span>
            </div>
            <div className="text-2xl font-black text-primary font-mono">{scanCount}</div>
          </div>
          <div className="p-3 bg-canvas rounded-xl border border-border space-y-1">
            <div className="text-xs text-secondary">Status Kartu</div>
            <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold text-google-green bg-google-green/10 border border-google-green/30">
              AKTIF
            </div>
          </div>
        </div>

        {/* Management Form */}
        <form
          onSubmit={handleUpdate}
          className="bg-surface border border-border rounded-2xl p-6 space-y-5 shadow-lg"
        >
          {error && (
            <div className="p-3 rounded-xl bg-google-red/10 border border-google-red/30 flex items-start gap-2 text-google-red text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-google-green/10 border border-google-green/30 flex items-start gap-2 text-google-green text-xs">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-primary font-google-sans uppercase tracking-wider">
              Nama Usaha
            </label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="bg-canvas"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-primary font-google-sans uppercase tracking-wider">
              Link Tujuan Ulasan Google
            </label>
            <Input
              value={googleReviewUrl}
              onChange={(e) => setGoogleReviewUrl(e.target.value)}
              className="bg-canvas font-mono text-xs"
              required
            />
          </div>

          <div className="space-y-1.5 pt-2 border-t border-border">
            <div className="flex items-center gap-1.5">
              <Lock size={14} className="text-secondary" />
              <label className="text-xs font-bold text-primary font-google-sans uppercase tracking-wider">
                Verifikasi PIN Kartu
              </label>
            </div>
            <Input
              type="password"
              inputMode="numeric"
              maxLength={8}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              placeholder="Masukkan PIN pemilik kartu"
              className="bg-canvas font-mono text-center tracking-widest"
              required
            />
          </div>

          <Button
            type="submit"
            variant="google"
            size="lg"
            disabled={loading}
            className="w-full font-google-sans text-sm"
          >
            {loading ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
          </Button>
        </form>

        <div className="text-center">
          <a
            href={`/r/${cardId}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-google-blue hover:underline"
          >
            <span>Uji Buka URL Review</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
