<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1edranw7IelqsVjUlVSXYgVZbqoyuqAAi

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the env vars in [.env.local](.env.local):
   - `NEXT_PUBLIC_GEMINI_API_KEY` (cheia Gemini)
   - `DATABASE_URL` (ex: `mysql://root:password@localhost:3306/cefilm` pentru MariaDB/MySQL)
   - `JWT_SECRET` (orice string random)
3. Run the app:
   `npm run dev`
4. Build for production:
   `npm run build`
5. Start the production server:
   `npm start`

## Rute utile
- API autentificare: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- API utilizator: `/api/user/update`, `/api/user/subscribe`, `/api/user/watchlist`, `/api/user/history`, `/api/user/tickets`
- Dashboard: `/dashboard` (userul logat vede watchlist-ul, biletele și upgrade VIP)
