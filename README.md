# CCW Map

A mobile-first app that tracks concealed carry weapon (CCW) laws across all 50 US states + DC, with an interactive reciprocity map.

## Features

- **Interactive Reciprocity Map** — Mapbox-powered map with state boundaries. Tap a state to see which other states honor your permit.
- **Complete Law Database** — Curated dataset covering permit types, carry laws, self-defense laws, magazine restrictions, and more for every state.
- **Reciprocity Matrix** — See at a glance where you can legally carry with your home state's permit.
- **Legislative Tracking** — LegiScan API integration to monitor new gun-related bills and legislation.
- **Cross-Platform** — Runs on iOS, Android, and Web (deployable to Vercel).

## Tech Stack

- **React Native + Expo** (with Expo Router for navigation)
- **Mapbox GL** for interactive maps (via `@rnmapbox/maps` for native, `mapbox-gl` for web)
- **TypeScript** throughout
- **Vercel** for web deployment

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure API keys in the following files:
   - `src/constants/mapbox.ts` — Replace `YOUR_MAPBOX_PUBLIC_TOKEN` with your Mapbox public access token
   - `app.json` — Replace `YOUR_MAPBOX_SECRET_TOKEN` with your Mapbox secret token (for native builds)
   - `src/services/legiscan.ts` — Replace `YOUR_LEGISCAN_API_KEY` with your LegiScan API key

3. Run the app:
   ```bash
   # Web
   npm run web

   # iOS
   npm run ios

   # Android
   npm run android
   ```

## Deploy to Vercel

```bash
npx vercel
```

Or connect the GitHub repo to Vercel — it will auto-detect the config from `vercel.json`.

## Data Sources

- **CCW Laws**: Curated from USCCA, Handgunlaw.us, NRA-ILA, and official state statutes
- **Reciprocity**: USCCA reciprocity data, USACarry, state attorney general offices
- **State Boundaries**: US Census Bureau GeoJSON via PublicaMundi
- **Legislation**: LegiScan API

## Disclaimer

This app is for informational purposes only. Gun laws change frequently and vary by jurisdiction. Always verify current laws with official state sources before carrying a firearm. This is not legal advice.
