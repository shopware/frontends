# Redirect Service

Simple Vercel project that redirects all routes to `https://frontends.shopware.com`.

## Deployment

Deploy to Vercel:

```bash
vercel deploy
```

## How it works

- `vercel.json` contains a redirect rule that matches all routes `/(.*)`
- All traffic is permanently redirected (301) to `https://frontends.shopware.com`
- The `public/index.html` serves as a fallback with meta refresh and JavaScript redirect

## Local Development

```bash
pnpm dev
```

Visit `http://localhost:3000` to test the redirect.

