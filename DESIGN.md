---
version: alpha
name: Review Card Generator Vercel Geist
description: Vercel Geist design system for Google Review QR Card Generator workbench with monochrome minimalism, precision borders, and high mobile ergonomics
colors:
  primary: "#EDEDED"
  secondary: "#888888"
  neutral: "#000000"
  surface: "#0A0A0A"
  surface-muted: "#171717"
  border: "#262626"
  accent: "#FFFFFF"
  accent-hover: "#E0E0E0"
  accent-subtle: "#1F1F1F"
  vercel-blue: "#0070F3"
  google-blue: "#1A73E8"
  google-red: "#EA4335"
  google-yellow: "#FBBC04"
  google-green: "#34A853"
  card-white: "#FFFFFF"
  card-dark: "#111111"
  card-border-light: "#E5E7EB"
  card-border-dark: "#262626"
typography:
  h1:
    fontFamily: Geist Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  h2:
    fontFamily: Geist Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body-md:
    fontFamily: Geist Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
    fontSize: 0.875rem
    lineHeight: 1.5
---

# Review Card Generator Vercel Geist Design System

## Core Aesthetic Principles
1. **Geist Minimalism**: Monokrom pekat (OLED pitch black `#000000`, card `#0A0A0A`, garis tipis presisi 1px `#262626`).
2. **Mobile Ergonomics**: Navigasi ramah jempol, touch targets minimal 44px, sticky floating preview drawer/toggle di mobile, dan dual-column sticky workbench di desktop & tablet.
3. **Zero Hardcoded Colors**: Seluruh token warna bersumber dari CSS variables `:root` di `globals.css`.
