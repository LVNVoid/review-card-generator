"use client";

import * as React from "react";
import Link from "next/link";
import { GoogleLogo } from "@/components/ui/google-icons";
import { QrRenderer } from "@/components/preview/qr-renderer";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { listCardsAction } from "@/actions/card-actions";
import { cn } from "@/lib/utils";
import {
  Search,
  Plus,
  QrCode,
  ExternalLink,
  Settings,
  Copy,
  Check,
  RefreshCw,
  Clock,
  CheckCircle2,
  ArrowLeft,
  X,
  Sparkles,
  Layers,
} from "lucide-react";

export interface CardItem {
  id: string;
  status: "PENDING" | "ACTIVE" | "INACTIVE";
  businessName: string | null;
  tagline: string | null;
  googleReviewUrl: string | null;
  batchId: string | null;
  scanCount: number;
  activatedAt: Date | string | null;
  lastScannedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CardsMetrics {
  total: number;
  active: number;
  pending: number;
  totalScans: number;
}

interface CardsClientProps {
  initialCards: CardItem[];
  initialMetrics: CardsMetrics;
}

export function CardsClient({ initialCards, initialMetrics }: CardsClientProps) {
  const [cards, setCards] = React.useState<CardItem[]>(initialCards);
  const [metrics, setMetrics] = React.useState<CardsMetrics>(initialMetrics);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | "ACTIVE" | "PENDING">("ALL");
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [activeQrModal, setActiveQrModal] = React.useState<CardItem | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await listCardsAction();
      if (res.success && res.cards) {
        setCards(res.cards as CardItem[]);
        if (res.metrics) setMetrics(res.metrics);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCards = React.useMemo(() => {
    return cards.filter((card) => {
      const matchesStatus =
        statusFilter === "ALL" || card.status === statusFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        card.id.toLowerCase().includes(query) ||
        (card.businessName && card.businessName.toLowerCase().includes(query)) ||
        (card.batchId && card.batchId.toLowerCase().includes(query));
      return matchesStatus && matchesQuery;
    });
  }, [cards, statusFilter, searchQuery]);

  const formatDate = (dateStr: Date | string | null) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
    } catch {
      return String(dateStr);
    }
  };

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://review-card-generator-orcin.vercel.app";

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-primary pb-20">
      {/* Top Navbar Header */}
      <header className="h-16 border-b border-border bg-canvas/90 backdrop-blur sticky top-0 z-30 flex items-center px-3.5 sm:px-6 lg:px-8 justify-between gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <Link
            href="/"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-surface border border-border flex items-center justify-center shadow-sm hover:border-google-blue transition-colors shrink-0"
            title="Kembali ke Generator"
          >
            <ArrowLeft size={16} className="text-secondary" />
          </Link>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <GoogleLogo size={18} />
              <h1 className="text-xs sm:text-sm font-semibold tracking-tight text-primary truncate font-google-sans">
                Daftar Kartu QR
              </h1>
              <span className="hidden sm:inline-flex text-[10px] font-mono text-google-green bg-google-green/10 px-2 py-0.5 rounded border border-google-green/30 font-medium">
                DATABASE LIVE
              </span>
            </div>
            <span className="hidden sm:block text-[11px] text-secondary">
              Kelola status dan riwayat kartu Google Review NFC/QR
            </span>
          </div>
        </div>

        {/* Action Header Button */}
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />

          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-9 px-2.5 sm:px-3 text-xs font-google-sans cursor-pointer rounded-full"
          >
            <RefreshCw size={13} className={cn(isRefreshing && "animate-spin")} />
            <span className="hidden sm:inline ml-1">Segarkan</span>
          </Button>

          <Link href="/">
            <Button
              variant="google"
              size="sm"
              className="h-9 px-3 text-xs font-google-sans font-semibold cursor-pointer shadow-sm rounded-full"
            >
              <Plus size={14} />
              <span>Buat Kartu Baru</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3.5 py-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* 2x2 Metric Grid for Mobile (4-col on Desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-surface border border-border space-y-1 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-mono font-medium text-secondary uppercase">
                Total Kartu
              </span>
              <Layers size={13} className="text-secondary" />
            </div>
            <div className="text-lg sm:text-2xl font-bold font-google-sans text-primary">
              {metrics.total}
            </div>
            <span className="text-[10px] text-secondary">Unit terdaftar</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-surface border border-border space-y-1 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-mono font-medium text-google-green uppercase">
                Kartu Aktif
              </span>
              <CheckCircle2 size={13} className="text-google-green" />
            </div>
            <div className="text-lg sm:text-2xl font-bold font-google-sans text-google-green">
              {metrics.active}
            </div>
            <span className="text-[10px] text-secondary">Terpasang di toko</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-surface border border-border space-y-1 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-mono font-medium text-google-yellow uppercase">
                Pending
              </span>
              <Clock size={13} className="text-google-yellow" />
            </div>
            <div className="text-lg sm:text-2xl font-bold font-google-sans text-google-yellow">
              {metrics.pending}
            </div>
            <span className="text-[10px] text-secondary">Siap dijual / aktivasi</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-surface border border-border space-y-1 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-mono font-medium text-m3-primary uppercase">
                Total Scan
              </span>
              <Sparkles size={13} className="text-m3-primary" />
            </div>
            <div className="text-lg sm:text-2xl font-bold font-google-sans text-m3-primary">
              {metrics.totalScans}
            </div>
            <span className="text-[10px] text-secondary">Interaksi pelanggan</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-surface border border-border rounded-2xl p-2.5 sm:p-3 space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-3 shadow-xs">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID kartu / nama toko / batch..."
              className="pl-8 h-9.5 text-xs sm:text-sm bg-canvas rounded-xl"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center p-1 rounded-full bg-canvas border border-border self-start sm:self-auto shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={cn(
                "flex-1 sm:flex-initial px-3.5 py-1.5 rounded-full text-xs font-medium font-google-sans transition-all cursor-pointer text-center",
                statusFilter === "ALL"
                  ? "bg-surface text-primary shadow-xs font-semibold"
                  : "text-secondary hover:text-primary"
              )}
            >
              Semua ({cards.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("ACTIVE")}
              className={cn(
                "flex-1 sm:flex-initial px-3.5 py-1.5 rounded-full text-xs font-medium font-google-sans transition-all cursor-pointer text-center",
                statusFilter === "ACTIVE"
                  ? "bg-surface text-google-green shadow-xs font-semibold"
                  : "text-secondary hover:text-primary"
              )}
            >
              Aktif ({metrics.active})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("PENDING")}
              className={cn(
                "flex-1 sm:flex-initial px-3.5 py-1.5 rounded-full text-xs font-medium font-google-sans transition-all cursor-pointer text-center",
                statusFilter === "PENDING"
                  ? "bg-surface text-google-yellow shadow-xs font-semibold"
                  : "text-secondary hover:text-primary"
              )}
            >
              Pending ({metrics.pending})
            </button>
          </div>
        </div>

        {/* Card Feed */}
        {filteredCards.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-xl bg-surface border border-border space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-surface-muted flex items-center justify-center text-secondary">
              <QrCode size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-primary font-google-sans">
                Tidak ada kartu ditemukan
              </h3>
              <p className="text-xs text-secondary max-w-sm mx-auto font-google-sans-text">
                {searchQuery
                  ? "Coba ganti kata kunci pencarian atau bersihkan filter status."
                  : "Belum ada kartu di database. Buat kartu pertama Anda di generator."}
              </p>
            </div>
            {searchQuery ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="text-xs"
              >
                Reset Pencarian
              </Button>
            ) : (
              <Link href="/">
                <Button variant="google" size="sm" className="text-xs">
                  <Plus size={13} />
                  <span>Buat Kartu Baru</span>
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCards.map((card) => {
              const isActive = card.status === "ACTIVE";
              const proxyUrl = `${origin}/r/${card.id}`;
              const activateUrl = `${origin}/r/${card.id}/activate`;
              const manageUrl = `${origin}/r/${card.id}/manage`;

              return (
                <div
                  key={card.id}
                  className="p-3.5 sm:p-4 rounded-2xl bg-surface border border-border hover:border-border-hover transition-all space-y-3 shadow-xs"
                >
                  {/* Row 1: Header (Serial ID, Status Badge, Batch ID) */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-canvas border border-border font-mono text-xs font-bold text-m3-primary">
                        <span>{card.id}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(proxyUrl, `id-${card.id}`)}
                          className="text-secondary hover:text-primary transition-colors cursor-pointer"
                          title="Salin Link Proxy"
                        >
                          {copiedId === `id-${card.id}` ? (
                            <Check size={12} className="text-google-green" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>

                      {card.batchId && (
                        <span className="hidden sm:inline-block text-[10px] font-mono text-secondary px-2 py-0.5 rounded-full bg-canvas border border-border">
                          {card.batchId}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold font-google-sans bg-google-green/10 text-google-green border border-google-green/30">
                          <CheckCircle2 size={11} />
                          <span>AKTIF</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold font-google-sans bg-google-yellow/10 text-google-yellow border border-google-yellow/30">
                          <Clock size={11} />
                          <span>MENUNGGU AKTIVASI</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Business Name & URL Target */}
                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-bold text-primary font-google-sans truncate">
                      {card.businessName || (
                        <span className="text-secondary italic font-normal text-xs sm:text-sm">
                          (Belum diaktivasi — siap jual ke toko/resto)
                        </span>
                      )}
                    </h3>

                    {isActive && card.googleReviewUrl ? (
                      <div className="flex items-center gap-1.5 text-xs text-secondary font-mono truncate">
                        <span className="text-google-green font-medium shrink-0">Ulasan:</span>
                        <a
                          href={card.googleReviewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline hover:text-primary truncate text-[11px]"
                        >
                          {card.googleReviewUrl}
                        </a>
                      </div>
                    ) : (
                      <div className="text-[11px] text-secondary font-mono truncate">
                        Link aktivasi:{" "}
                        <span className="text-primary">{activateUrl}</span>
                      </div>
                    )}
                  </div>

                  {/* Row 3: Meta & Stats */}
                  <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-y-1 text-[10.5px] text-secondary font-mono">
                    <div className="flex items-center gap-3">
                      <span className="text-primary font-bold">
                        👁️ {card.scanCount}x scan
                      </span>
                      <span>Dibuat: {formatDate(card.createdAt)}</span>
                    </div>

                    {card.lastScannedAt && (
                      <span>Terakhir scan: {formatDate(card.lastScannedAt)}</span>
                    )}
                  </div>

                  {/* Row 4: Action Buttons (Thumb-friendly on Mobile) */}
                  <div className="pt-1 flex flex-wrap items-center gap-2">
                    {/* View QR Code Button */}
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setActiveQrModal(card)}
                      className="h-8 text-xs font-google-sans flex-1 sm:flex-initial cursor-pointer"
                    >
                      <QrCode size={13} />
                      <span>Lihat QR</span>
                    </Button>

                    {isActive ? (
                      <>
                        {/* Test Proxy Link */}
                        <a
                          href={proxyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 sm:flex-initial"
                        >
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-full h-8 text-xs font-google-sans cursor-pointer hover:text-google-blue"
                          >
                            <ExternalLink size={13} />
                            <span>Uji Scan</span>
                          </Button>
                        </a>

                        {/* Manage Link */}
                        <a
                          href={manageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 sm:flex-initial"
                        >
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-full h-8 text-xs font-google-sans cursor-pointer"
                          >
                            <Settings size={13} />
                            <span>Kelola</span>
                          </Button>
                        </a>
                      </>
                    ) : (
                      <>
                        {/* Open Activation Page */}
                        <a
                          href={activateUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 sm:flex-initial"
                        >
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-full h-8 text-xs font-google-sans cursor-pointer text-google-yellow hover:text-google-yellow"
                          >
                            <ExternalLink size={13} />
                            <span>Form Aktivasi</span>
                          </Button>
                        </a>

                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => copyToClipboard(activateUrl, `act-${card.id}`)}
                          className="h-8 text-xs font-google-sans cursor-pointer"
                        >
                          {copiedId === `act-${card.id}` ? (
                            <>
                              <Check size={12} className="text-google-green" />
                              <span>Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Salin Link</span>
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* QR Preview Modal */}
      {activeQrModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-surface border border-border rounded-2xl p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-google-blue">
                  {activeQrModal.id}
                </span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-semibold font-google-sans",
                    activeQrModal.status === "ACTIVE"
                      ? "bg-google-green/10 text-google-green border border-google-green/30"
                      : "bg-google-yellow/10 text-google-yellow border border-google-yellow/30"
                  )}
                >
                  {activeQrModal.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveQrModal(null)}
                className="text-secondary hover:text-primary p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold text-primary font-google-sans truncate">
                {activeQrModal.businessName || "Kartu Kosong (Belum Diaktivasi)"}
              </h4>
              <p className="text-xs text-secondary font-mono truncate">
                {`${origin}/r/${activeQrModal.id}`}
              </p>
            </div>

            {/* QR Renderer Container with Safe Quiet Zone */}
            <div className="p-4 bg-white rounded-2xl flex items-center justify-center shadow-inner mx-auto w-[220px] h-[220px]">
              <QrRenderer
                url={`${origin}/r/${activeQrModal.id}`}
                size={188}
                darkColor="#0b0c0e"
                lightColor="#ffffff"
              />
            </div>

            <p className="text-[11px] text-center text-secondary font-google-sans-text leading-relaxed">
              {activeQrModal.status === "ACTIVE"
                ? "Scan QR ini langsung membuka form ulasan bintang 5 Google Maps."
                : "Scan QR ini membawa pemilik kartu ke form aktivasi mandiri."}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  copyToClipboard(
                    `${origin}/r/${activeQrModal.id}`,
                    `modal-${activeQrModal.id}`
                  )
                }
                className="flex-1 h-9 text-xs font-google-sans cursor-pointer"
              >
                {copiedId === `modal-${activeQrModal.id}` ? (
                  <>
                    <Check size={13} className="text-google-green" />
                    <span>Link Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Salin Link</span>
                  </>
                )}
              </Button>

              <Button
                variant="google"
                size="sm"
                onClick={() => setActiveQrModal(null)}
                className="flex-1 h-9 text-xs font-google-sans font-semibold cursor-pointer"
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
