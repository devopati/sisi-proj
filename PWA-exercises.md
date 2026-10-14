1. Update prompt. Remove self.skipWaiting() and show "A new version is ready.
   Refresh" when a new worker is waiting ( registration.waiting , then postMessage to
   it).
2. Stay logged in offline. Save the user object next to the token with JSON.stringify ,
   and show it while offline. It builds on your localStorage notes in AuthProvider.tsx .
3. Queue offline votes. Save votes made offline and send them when the online event
   fires. Show "Will send when you're back online".
4. Ready before the first visit. In install , also save /api/projects and /api/wards ,
   so those lists work offline even if the user never opened them.
5. Install it on a phone. Deploy the app and API to free hosting with HTTPS and install SISI
   on a real phone.
6. Research on vite-plugin-pwa
7. Work on Storage, sync and notifications
8. Work on notification permissions.
