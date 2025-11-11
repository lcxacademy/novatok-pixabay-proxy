# NovaTok Jamendo Proxy

This micro-service hides your Jamendo API credentials and lets the NovaTok front-end fetch royalty-free music suggestions without exposing secrets.

## Quick start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set your environment variables**

   Create a `.env` file next to `server.js`:
   ```
   JAMENDO_CLIENT_ID=YOUR_JAMENDO_CLIENT_ID
   # Optional: lock the proxy to specific origins (comma separated)
   # CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
   ```

3. **Run locally**
   ```bash
   npm start
   ```
   The proxy listens on `http://localhost:3001`. Hitting `http://localhost:3001/api/jamendo-tracks?q=travel` should return JSON from Jamendo.

4. **Deploy**

   Upload these files to any Node-friendly hosting provider (Render, Railway, Heroku, VPS, etc.) and set the same environment variables there. The app only needs minimal resources.

5. **Configure NovaTok**

   Host the proxy at the same origin as your front-end **or** adjust the `MUSIC_PROXY_ENDPOINT` constant in `app.js` to point to the deployed URL, e.g.:
   ```js
   const MUSIC_PROXY_ENDPOINT = "https://yourdomain.com/api/jamendo-tracks";
   ```

## Endpoints

- `GET /api/jamendo-tracks?q=keyword`
  - `q` – required search term (e.g. `fitness hype`)
  - `limit`, `order`, `tags`, `page` – optional filters passed through to Jamendo

The proxy returns the Jamendo JSON response unchanged and caches it for five minutes.

## Notes

- Keep your Jamendo client ID secret; store it in `.env` locally and as an environment variable in production.
- If you want to restrict access, set `CORS_ORIGIN` to the exact URL(s) of your NovaTok deployment.

