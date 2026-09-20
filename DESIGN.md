---
version: 1.0.0
name: Google Material 3 (M3) Design System
description: Google Material 3 design system for Google Review NFC & QR Card Generator with tonal elevation, pill geometry, Google Sans typography, and dual-theme (Default Dark + Light mode).
colors:
  dark:
    canvas: "#131314"
    surface: "#1E1F20"
    surface-muted: "#28292A"
    surface-container-high: "#333538"
    border: "#444746"
    border-hover: "#5E6260"
    primary: "#E3E3E3"
    secondary: "#C4C7C5"
    m3-primary: "#A8C7FA"
    m3-on-primary: "#062E6F"
    m3-tonal-container: "#004A77"
    m3-on-tonal-container: "#C2E7FF"
  light:
    canvas: "#F8F9FA"
    surface: "#FFFFFF"
    surface-muted: "#F0F4F9"
    surface-container-high: "#E9EEF6"
    border: "#E0E2E5"
    border-hover: "#C4C7C5"
    primary: "#1F1F1F"
    secondary: "#444746"
    m3-primary: "#0B57D0"
    m3-on-primary: "#FFFFFF"
    m3-tonal-container: "#D3E3FD"
    m3-on-tonal-container: "#041E49"
  brand:
    google-blue: "#1A73E8"
    google-red: "#EA4335"
    google-yellow: "#FBBC04"
    google-green: "#34A853"
typography:
  font-heading: "Google Sans, sans-serif"
  font-body: "Google Sans Text, sans-serif"
  font-mono: "Roboto Mono, monospace"
radii:
  pill: "9999px"
  card: "24px"
  surface: "16px"
  input: "14px"
---

# Google Material 3 (M3) Design System Spec

## 1. Core Principles
1. **Tonal Elevation**: Menggantikan bayangan gelap tajam dengan perbedaan level warna tonal container (`surface` -> `surface-muted` -> `surface-container-high`).
2. **Pill & Rounded Geometry**: Komponen interaktif (tombol, chip selector, search bar, badges) menggunakan bentuk pill penuh (`rounded-full`), dan kontainer kartu menggunakan radius `rounded-2xl` (16px) hingga `rounded-3xl` (24px).
3. **Google Typography Hierarchy**: Menggunakan Google Sans resmi untuk seluruh judul, label, aksi, dan Google Sans Text untuk body serta form input.
4. **Dual-Theme Support**: Dark mode sebagai default (estetika Google Gemini/Pixel), dengan light mode (Google Workspace/Cloud) yang dapat dialihkan secara instan tanpa flicker.
