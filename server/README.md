# Contact API

Node.js 22+ and MongoDB running locally are required. The frontend and API live in the same project.

From the project root, run in two VS Code terminals:

```powershell
npm run server
```

```powershell
npm run dev
```

Restart your existing Vite process once to load the `/api` proxy. Do not start a second frontend server on a different port. Default frontend origin: `http://127.0.0.1:5173`. API: `http://127.0.0.1:3001`.

Defaults connect to `mongodb://127.0.0.1:27017`, database `myportfolio`, collection `responses`. In Compass, refresh that collection after submitting. No public API lists stored phone numbers. Optional settings: copy `server/.env.example` to `server/.env`; this file is ignored by Git. Never use VITE_ variables for database credentials.

POST `/api/contact` accepts `{reason,mobile,whatsapp}`. The reason is restricted to the three dropdown choices. Ten-digit Indian mobiles are normalized to +91; other numbers need their country code. WhatsApp availability is self-declared, not automatically detected. Each accepted request is saved with a timestamp and `status: new`. Invalid input returns 400; unavailable MongoDB returns 503. No request is claimed saved until MongoDB acknowledges the insert. The API limits body size, validates the browser origin, and applies a small per-IP request limit.

For WhatsApp numbers, the successful response also provides a prefilled `wa.me` link to +91 7339339065. The visitor must open it and press Send in WhatsApp. This does not automatically send a WhatsApp notification or SMS. That would require a configured messaging provider, which the owner chose not to use for now. All requests are saved so WhatsApp handoff never loses the enquiry.

Production hosting must reverse-proxy `/api` to this Node process, configure `SITE_ORIGIN` to the real site origin, and use a private authenticated MongoDB connection. Vite's development proxy is not included in the static production bundle.

Tests: `npm test`. To test actual MongoDB persistence:

```powershell
$env:TEST_MONGODB='1'
npm test
```

The live test uses a reserved example number and removes only the document it inserted. Unit tests never send messages or require MongoDB.
