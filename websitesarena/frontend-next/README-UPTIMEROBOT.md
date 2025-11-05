# Keep-alive endpoint and UptimeRobot setup

This project exposes a small endpoint you can use with uptime monitoring services (for example UptimeRobot) to keep the site "warm" and prevent it from sleeping on platforms that idle apps when there are no visitors.

Endpoint

- Path: `/api/keepalive`
- Method: `GET` (also responds to `HEAD`)
- Response: `200 OK` with JSON `{ "ok": true }`

Example monitor URL (production):

https://your-production-domain.com/api/keepalive

How to configure UptimeRobot

1. Create a new HTTP(s) monitor in UptimeRobot.
2. Choose a friendly name (e.g. "Websites Arena - Keepalive").
3. Paste your full URL from above (including `https://`).
4. Set the monitoring interval (e.g. every 5 minutes). Save.

Local testing (PowerShell)

Invoke a quick GET to verify the route responds:

```powershell
# from project root (or any machine with network access to the app)
Invoke-RestMethod -Uri "websitesraena.com/api/keepalive"
```

Notes

- If you deploy behind a custom domain or proxy, use that domain in the monitor URL.
- Many hosts provide native "always-on" or scheduling options; using an uptime monitor is a compatible lightweight alternative.
