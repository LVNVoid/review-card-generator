"use client";

import * as React from "react";
import { GoogleLogo, GoogleReviewStars } from "@/components/ui/google-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { activateCardAction, expandAndConvertReviewUrlAction } from "@/actions/card-actions";
import { cn } from "@/lib/utils";
import { LocationFinderModal } from "@/components/editor/location-finder-modal";
import {
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  Search,
  Loader2,
} from "lucide-react";

interface ActivateClientProps {
  cardId: string;
  initialStatus: string;
  existingBusinessName?: string | null;
  existingReviewUrl?: string | null;
}

export function ActivateClient({
  cardId,
  initialStatus,
  existingBusinessName,
  existingReviewUrl,
}: ActivateClientProps) {
  const [businessName, setBusinessName] = React.useState(existingBusinessName || "");
  const [googleReviewUrl, setGoogleReviewUrl] = React.useState(existingReviewUrl || "");
  const [pin, setPin] = React.useState("");
  const [confirmPin, setConfirmPin] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(initialStatus === "ACTIVE");
  const [showHelper, setShowHelper] = React.useState(false);
  const [showLocationModal, setShowLocationModal] = React.useState(false);
  const [isConvertingUrl, setIsConvertingUrl] = React.useState(false);

  const autoConvertShortlink = async (val: string) => {
    const trimmed = val.trim();
    if (
      trimmed.includes("maps.app.goo.gl") ||
      trimmed.includes("goo.gl/") ||
      (trimmed.includes("g.page/") && !trimmed.includes("/review"))
    ) {
      setIsConvertingUrl(true);
      try {
        const res = await expandAndConvertReviewUrlAction(trimmed);
        if (res.success && res.directUrl && res.directUrl !== trimmed) {
          setGoogleReviewUrl(res.directUrl);
          if (res.businessName && !businessName.trim()) {
            setBusinessName(res.businessName);
          }
        }
      } catch (err) {
        console.warn("Auto convert failed:", err);
      } finally {
        setIsConvertingUrl(false);
      }
    }
  };

  const handleReviewUrlChange = (val: string) => {
    setGoogleReviewUrl(val);
    autoConvertShortlink(val);
  };

  const handleLocationSelect = (data: { businessName?: string; reviewUrl: string }) => {
    if (data.businessName && !businessName.trim()) {
      setBusinessName(data.businessName);
    }
    setGoogleReviewUrl(data.reviewUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!businessName.trim()) {
      setError("Masukkan nama tempat usaha Anda");
      return;
    }

    if (!googleReviewUrl.trim()) {
      setError("Masukkan URL Google Maps atau Google Review Anda");
      return;
    }

    if (!googleReviewUrl.startsWith("http://") && !googleReviewUrl.startsWith("https://")) {
      setError("URL harus diawali dengan https://");
      return;
    }

    if (pin.length < 4 || !/^\d+$/.test(pin)) {
      setError("Buat PIN keamanan 4-8 digit angka");
      return;
    }

    if (pin !== confirmPin) {
      setError("Konfirmasi PIN tidak cocok");
      return;
    }

    setLoading(true);
    try {
      const res = await activateCardAction({
        id: cardId,
        businessName: businessName.trim(),
        googleReviewUrl: googleReviewUrl.trim(),
        pin,
      });

      if (!res.success) {
        setError(res.error);
      } else {
        setIsSuccess(true);
      }
    } catch {
      setError("Terjadi kesalahan sistem. Silakan coba sesaat lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-canvas text-primary flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 text-center shadow-xl">
          <div className="mx-auto w-16 h-16 rounded-full bg-google-green/10 border border-google-green/30 flex items-center justify-center text-google-green">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-surface-muted text-secondary border border-border">
              KARTU #{cardId} AKTIF
            </span>
            <h1 className="text-xl sm:text-2xl font-black font-google-sans tracking-tight text-primary">
              Kartu Berhasil Diaktifkan!
            </h1>
            <p className="text-sm text-secondary font-google-sans-text leading-relaxed">
              Mulai sekarang, setiap pelanggan yang men-scan QR code atau menempelkan HP ke chip NFC kartu ini akan otomatis diarahkan ke profil ulasan Google bisnis Anda.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-canvas border border-border text-left space-y-2">
            <div className="text-xs text-secondary font-medium uppercase tracking-wider">
              Tujuan Ulasan
            </div>
            <div className="font-bold text-sm text-primary truncate font-google-sans">
              {businessName || existingBusinessName}
            </div>
            <div className="text-xs text-google-blue truncate font-mono">
              {googleReviewUrl || existingReviewUrl}
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <a
              href={`/r/${cardId}`}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 text-sm font-semibold rounded-xl bg-google-blue text-white shadow-sm hover:opacity-90 transition-opacity"
            >
              <span>Uji Coba Scan (Buka Ulasan)</span>
              <ExternalLink size={16} />
            </a>

            <p className="text-[11px] text-secondary font-google-sans-text">
              Simpan nomor PIN Anda dengan aman. PIN dibutuhkan jika sewaktu-waktu Anda ingin memperbarui tautan review bisnis Anda.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-primary flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-google-blue selection:text-white">
      <div className="w-full max-w-lg space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border shadow-xs">
            <GoogleLogo size={18} />
            <span className="text-xs font-bold font-google-sans text-primary">
              Google Review Setup
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-google-sans tracking-tight text-primary">
            Aktivasi Kartu Ulasan
          </h1>
          <p className="text-xs sm:text-sm text-secondary font-google-sans-text">
            Hubungkan kartu fisik Anda dengan halaman profil ulasan Google Maps bisnis Anda.
          </p>
        </div>

        {/* Card Identification Tag */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-surface border border-border rounded-xl">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-google-yellow" />
            <span className="text-xs text-secondary font-medium">ID Kartu Fisik:</span>
          </div>
          <span className="font-mono text-xs sm:text-sm font-bold text-google-blue bg-surface-muted px-2.5 py-0.5 rounded border border-border">
            {cardId}
          </span>
        </div>

        {/* Setup Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-border rounded-2xl p-6 sm:p-7 space-y-5 shadow-lg"
        >
          {error && (
            <div className="p-3.5 rounded-xl bg-google-red/10 border border-google-red/30 flex items-start gap-2.5 text-google-red text-xs leading-snug">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Business Name Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-primary font-google-sans uppercase tracking-wider">
              1. Nama Tempat Usaha / Toko
            </label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Contoh: Kopi Sangkara / Bistro Kita"
              required
              className="bg-canvas"
            />
            <p className="text-[11px] text-secondary font-google-sans-text">
              Nama ini akan tampil sebagai konfirmasi saat kartu diakses.
            </p>
          </div>

          <div className="border-t border-border pt-2" />

          {/* Review Link Field */}
          <div className="space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <label className="block text-xs font-bold text-primary font-google-sans uppercase tracking-wider">
                2. Link Google Review / Maps
              </label>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(true)}
                  className="text-xs font-bold font-google-sans text-google-blue hover:underline inline-flex items-center gap-1.5 cursor-pointer bg-google-blue/10 px-2.5 py-1 rounded-lg border border-google-blue/20 transition-colors hover:bg-google-blue/15 min-h-[32px]"
                >
                  <Search size={12} />
                  <span>Bantu Cari Lokasi</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowHelper(!showHelper)}
                  className="text-[11px] text-secondary hover:text-primary inline-flex items-center gap-1 cursor-pointer min-h-[32px] px-1"
                >
                  <HelpCircle size={12} />
                  <span>Panduan</span>
                </button>
              </div>
            </div>

            <Input
              value={googleReviewUrl}
              onChange={(e) => handleReviewUrlChange(e.target.value)}
              placeholder="https://g.page/r/... atau https://maps.app.goo.gl/..."
              required
              className="bg-canvas font-mono text-xs"
            />

            {isConvertingUrl ? (
              <div className="flex items-center gap-1.5 text-[11px] text-google-blue font-mono pt-0.5 animate-pulse">
                <Loader2 size={13} className="shrink-0 animate-spin" />
                <span>Mengonversi shortlink ke format ulasan langsung Google...</span>
              </div>
            ) : googleReviewUrl ? (
              <div className="flex items-center gap-1.5 text-[11px] text-google-green font-google-sans-text pt-0.5">
                <CheckCircle2 size={13} className="shrink-0 text-google-green" />
                <span>Kartu fisik otomatis memunculkan pop-up form ulasan 5-bintang saat di-scan pelanggan.</span>
              </div>
            ) : null}

            {showHelper && (
              <div className="p-3.5 rounded-xl bg-canvas border border-border text-xs text-secondary space-y-2">
                <p className="font-bold text-primary">Cara mendapatkan link ulasan langsung Google:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] leading-relaxed">
                  <li>Buka aplikasi <strong>Google Maps</strong> atau cari nama toko Anda di <strong>Google Search</strong>.</li>
                  <li>Pilih tombol <strong>Minta Ulasan</strong> atau di tab Ulasan klik <strong>Bagikan formulir ulasan</strong>.</li>
                  <li>Atau klik tombol <strong>Bantu Cari Lokasi</strong> di atas untuk mengambil tautan ulasan secara instan.</li>
                </ol>
              </div>
            )}
          </div>

          <div className="border-t border-border pt-2" />

          {/* PIN Protection */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-google-green" />
              <label className="text-xs font-bold text-primary font-google-sans uppercase tracking-wider">
                3. Buat PIN Keamanan (4-8 Digit Angka)
              </label>
            </div>
            <p className="text-[11px] text-secondary font-google-sans-text">
              Diperlukan jika nanti Anda ingin mengubah link ulasan atau memindahkan kartu ke cabang lain.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Input
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="PIN Baru (4-8 angka)"
                  required
                  className={cn("bg-canvas font-mono text-center", pin.length > 0 && "tracking-widest")}
                />
              </div>
              <div>
                <Input
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="Ulangi PIN"
                  required
                  className={cn("bg-canvas font-mono text-center", confirmPin.length > 0 && "tracking-widest")}
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-3">
            <Button
              type="submit"
              variant="google"
              size="lg"
              disabled={loading}
              className="w-full font-google-sans text-sm tracking-wide"
            >
              {loading ? "Memproses Aktivasi..." : "Aktifkan Kartu Sekarang"}
            </Button>
          </div>
        </form>

        {/* Footer Guarantee */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-xs text-secondary">
            <GoogleReviewStars size={13} />
            <span>Terintegrasi Standar Google Maps Review NFC & QR</span>
          </div>
        </div>
      </div>

      <LocationFinderModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelect={handleLocationSelect}
        initialQuery={businessName}
      />
    </div>
  );
}
