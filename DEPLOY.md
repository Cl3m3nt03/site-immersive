# Deploy — GitHub Pages

Site hosted free on GitHub Pages.

- **Repo:** https://github.com/Cl3m3nt03/site-immersive
- **Live URL:** https://cl3m3nt03.github.io/site-immersive/

## Redeploy (after code changes)

```bash
npm run deploy
```

That runs `predeploy` (`npm run build`) then pushes `dist/` to the `gh-pages` branch. Live ~1 min later.

To also save source changes:

```bash
git add -A
git commit -m "your message"
git push
```

## One-time setup (already done)

1. `npm i -D gh-pages`
2. `vite.config.ts` → `base: '/site-immersive/'` (must match repo name)
3. `package.json` scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
4. GitHub repo → **Settings → Pages → Source = "Deploy from a branch" → Branch = `gh-pages` / (root)**

## Notes / limits

- `three-vendor` chunk ~1.17 MB (320 KB gzip) — heavy, expected for Three.js.
- `video_scrool.mp4` shipped in repo → eats bandwidth.
- GitHub Pages soft limits: **1 GB repo**, **100 GB/mo bandwidth**. If traffic high → move to **Cloudflare Pages** (unlimited bandwidth, free).
- `base` path is tied to repo name. Rename repo → update `base` in `vite.config.ts`.
