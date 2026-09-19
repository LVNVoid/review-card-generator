---
version: alpha
name: Review Card Generator Design System
description: Design system for Google Review QR Card Generator workbench and print templates
colors:
  primary: "#F9FAFB"
  secondary: "#9CA3AF"
  neutral: "#0B0F19"
  surface: "#111827"
  surface-muted: "#1F2937"
  border: "#374151"
  accent: "#2563EB"
  accent-hover: "#1D4ED8"
  accent-subtle: "#1E3A8A"
  google-blue: "#1A73E8"
  google-red: "#EA4335"
  google-yellow: "#FBBC04"
  google-green: "#34A853"
  card-white: "#FFFFFF"
  card-dark: "#121214"
  card-border-light: "#E5E7EB"
  card-border-dark: "#27272A"
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    lineHeight: 1.5
---

# Review Card Generator Design System

## Core Aesthetic Principles
1. **Precision WYSIWYG**: Live preview mencerminkan kartu fisik 100% (skala proporsional milimeter, margin cetak, garis panduan potong).
2. **Zero Hardcoded Colors**: Seluruh komponen UI workbench maupun template kartu mengonsumsi token CSS variables (`--color-*`).
3. **High-DPI Contrast**: Komponen template kartu dirancang dengan kontras tajam (WCAG AAA) agar kode QR dapat dipindai seketika oleh sensor kamera smartphone dalam berbagai kondisi pencahayaan.
