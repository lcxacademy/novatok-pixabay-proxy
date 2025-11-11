# NovaTok Pixabay Proxy

This micro-service hides your private Pixabay API key and lets the NovaTok front-end fetch royalty-free music suggestions without exposing credentials.

## Quick start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set your environment variables**

   Create a `.env` file next to `server.js`:
   ```
   PIXABAY_KEY=YOUR_PIXABAY_KEY
   # Optional: lock the proxy to specific origins (comma separated)
   # CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
   ```

3. **Run locally**
   ```bash
   npm start
   ```
   The proxy listens on `http://localhost:3001`. Hitting `http://localhost:3001/api/pixabay-music?q=travel vlog` should return JSON from Pixabay.

4. **Deploy**

   Upload these files to any Node-friendly hosting provider (Render, Railway, Heroku, VPS, etc.) and set the same environment variables there. The app only needs minimal resources.

5. **Configure NovaTok**

   Host the proxy at the same origin as your front-end **or** adjust the `PIXABAY_PROXY_ENDPOINT` constant in `app.js` to point to the deployed URL, e.g.:
   ```js
   const PIXABAY_PROXY_ENDPOINT = "https://yourdomain.com/api/pixabay-music";
   ```

## Endpoints

- `GET /api/pixabay-music?q=keyword`
  - `q` – required search term (e.g. `fitness hype`)
  - `per_page`, `order`, `min_duration`, `max_duration`, `page` – optional filters passed through to Pixabay

The proxy returns the Pixabay JSON response unchanged and caches it for five minutes.

## Notes

- The provided key is included for convenience; if you cycle the key later, just update the `.env` file or hosting environment variable.
- If you want to restrict access, set `CORS_ORIGIN` to the exact URL(s) of your NovaTok deployment.

