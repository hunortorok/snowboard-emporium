# Snowboard Emporium Mock Ecommerce Site

<img width="1392" height="860" alt="Screenshot 2026-06-20 at 15 17 25" src="https://github.com/user-attachments/assets/481f1ca0-9665-4d71-8f0c-d257bad7afa0" />

This is a mock Shopify Hydrogen ecommerce shop for learning purposes.

## Overview

This project uses the Shopify Hydrogen platform to connect to a dev Shopify storefront. This was a project to learn how Shopify Hydrogen works and also to tinker with Zustand state management and Claude Code.

## Tech Stack

- React Router v7
- Hydrogen
- JavaScript
- Zustand
- Netlify
- Vite
- Shopify CLI
- ESLint
- Prettier

## Architecture / Key Decisions

- Did not replicate cart state in Zustand to avoid diverging sources of truth.
- Zustand handles client-only state (wish list and cart UI) while Hydrogen handles the authoritative server state (stock, product data, cart, etc).
- Opted to use real dev store to get experience closer to an actual production site
- Netlify hosting. Oxygen, Hydrogen's native hosting, required a paid plan which I wanted to avoid for a mock site. Pointed edge function handler (`server.js`) to correct adapter.
- Opted to use scaffold to avoid needing to build out boilerplate. Ran through codebase and made sure that mental models for setup made sense. Removed fluff after key features were narrowed down.
- Storefront API client requires request context before being built, so it must be instantiated on every request. A module-level instance would lack the necessary data (locale, session, etc). Context bleeding could also be a concern.

## Features

- Product Listing and Product Display Pages
- Collection Pages
- Cart and Cart Drawer UI
- Client-only Wishlist

## Known Issues / Limitations

- This is a mock ecommerce site so this project isn't as feature-rich as a prod site would be
- Cart prices are tied to server, so there is a slight delay before the price updates when changing product quantity

## What I Learned

- Gained a deeper understanding of React Router SSR patterns: loaders, actions, and how data flows server-to-client.
- Got familiar with Shopify Hydrogen fundamentals: its built-in components, server-authoritative cart state, and the request-scoped storefront client.
- Practical experience with Zustand, including the boundary of what belongs in client state, UI flags and the wishlist, versus what stays server-authoritative.

## Getting Started

**Requirements:**
- Node.js 18.0.0+
- A Shopify dev store with the Headless channel (for Storefront API tokens)

**Setup:**

```bash
git clone https://github.com/hunortorok/snowboard-emporium.git
cd hydrogen-quickstart
npm install
cp .env.example .env   # then fill in your values
```

**Environment variables** (`.env`):

| Variable | Description |
|----------|-------------|
| `PUBLIC_STORE_DOMAIN` | Dev store domain |
| `PUBLIC_STOREFRONT_API_TOKEN` | Public Storefront API token |
| `PRIVATE_STOREFRONT_API_TOKEN` | Private Storefront API token |
| `PUBLIC_STOREFRONT_API_VERSION` | Storefront API version |
| `SESSION_SECRET` | Session cookie secret |

Tokens come from the **Headless** channel in Shopify admin.

**Development:**

```bash
npm run dev      # local dev
npm run build    # production build
```
