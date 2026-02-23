## Admin & Developer Notes (Casino Platform AIO Upgrade)

### Mongo-backed modules

- **Promotions & Referrals**
  - Model: `src/models/Promotion.ts`, `src/models/Referral.ts`
  - APIs:
    - `GET/POST /api/promotions`
    - `GET/PATCH/DELETE /api/promotions/[id]`
    - `GET/POST /api/referrals`
    - `POST /api/referrals/claim`
  - Admin UI stub: `app/admin/promotions/page.tsx`

- **Chat**
  - Model: `src/models/ChatMessage.ts`
  - APIs:
    - `GET/POST /api/chat/messages`
    - `POST /api/chat/moderation`
  - Player UI: `components/GlobalChat.tsx` (uses `ChatWindow`, `ChannelSwitcher`, `TypingIndicator`)
  - Admin UI stub: `app/admin/chat/page.tsx`

- **Leaderboards**
  - Model: `src/models/LeaderboardEntry.ts`
  - API: `GET /api/leaderboards`
  - Player/Admin UI: `components/Leaderboard.tsx` with filters and live polling

- **Admin Panel**
  - Layout: `app/admin/layout.tsx`, `components/admin/AdminSidebar.tsx`, `components/admin/AdminHeader.tsx`
  - Sections:
    - Overview: `app/admin/page.tsx`
    - Users: `app/admin/users/page.tsx` (uses `/api/admin/users`, `/api/admin/users/[id]`)
    - Promotions: `app/admin/promotions/page.tsx`
    - Leaderboards: `app/admin/leaderboards/page.tsx`
    - Chat: `app/admin/chat/page.tsx`
    - Settings / Emergency Mode: `app/admin/settings/page.tsx` (drives `/api/admin/system/emergency`)

### Mines SFX & Audio Controls

- Core audio engine: `src/lib/game-sounds.ts` (Web Audio API, master volume + mute via `sound-settings.ts`)
- Mines integration: `components/games/CryptoMinesGame.tsx`
  - Adds per-session **mute toggle** and **volume slider**
  - Uses semantic sounds:
    - Safe click: `gameSounds.safeClick()`
    - Mine explosion: `gameSounds.mineExplosion()`
    - Win sequence: `gameSounds.winSequence()` + simple fireworks visuals

### Test data helpers

Use `src/lib/seed-test-data.ts` from a script or protected API route to quickly seed:

- `seedTestPromotions()`
- `seedTestLeaderboards()`
- `seedTestChat()`
- `seedAdminUserIfMissing()`

Each helper connects via the existing `lib/mongodb.ts` connector.

