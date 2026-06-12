# 🚄 QuickRailTickets

A fast, mobile-first railway ticket booking service website. Customers fill a form, you confirm on WhatsApp, they pay via UPI.

---

## 🗂️ File Structure

```
QuickRailTickets/
├── index.html       ← Main website (single page)
├── style.css        ← All styles
├── app.js           ← Form logic, validation, WhatsApp redirect
├── config.js        ← ⭐ ADMIN SETTINGS — edit this!
└── README.md
```

---

## ⚙️ Admin Configuration — `config.js`

**This is the only file you need to edit** to customize the website for your business.

Open `config.js` and update:

| Setting | Description | Example |
|---|---|---|
| `WHATSAPP_NUMBER` | Your WhatsApp number with country code, no `+` | `"919876543210"` |
| `UPI_ID` | Your UPI payment ID | `"yourname@upi"` |
| `UPI_NAME` | Your business name for UPI | `"QuickRailTickets"` |
| `SUPPORT_EMAIL` | Support email shown in footer | `"you@email.com"` |
| `WA_MESSAGE_TEMPLATE` | WhatsApp message format (use `{name}`, `{mobile}`, `{from}`, `{to}`, `{date}`, `{passengers}`) | See file |

---

## 🚀 Deploy to GitHub Pages

1. Create a new GitHub repository (e.g., `quickrailtickets`)
2. Upload all 4 files (`index.html`, `style.css`, `app.js`, `config.js`)
3. Go to **Settings → Pages**
4. Set Source: `Deploy from branch` → `main` → `/ (root)`
5. Click **Save** — your site will be live at:
   `https://yourusername.github.io/quickrailtickets`

---

## 📱 Adding a Real UPI QR Code

The current QR placeholder is a visual indicator. To add your real UPI QR:

**Option A — Image file:**
1. Generate your UPI QR from GPay/PhonePe/Paytm business app
2. Save it as `upi-qr.png` in the project folder
3. In `index.html`, replace the `<div class="qr-placeholder" ...>` block with:
   ```html
   <div class="qr-placeholder">
     <img src="upi-qr.png" alt="UPI QR Code" style="border-radius:8px;" />
   </div>
   ```

**Option B — Dynamic QR (UPI deep link):**
Use a service like `https://upiqr.in/api/qr?vpa=YOUR_UPI_ID&name=YOUR_NAME` as an `<img src>`.

---

## ✨ Features

- ✅ Mobile-first, fully responsive
- ✅ WhatsApp booking integration
- ✅ Form validation with inline errors
- ✅ Station swap button
- ✅ Passenger counter (1–6)
- ✅ Journey date picker (today onwards)
- ✅ Travel class selector
- ✅ UPI QR placeholder
- ✅ FAQ accordion
- ✅ Customer reviews section
- ✅ Smooth scroll & sticky header
- ✅ Animated train in hero

---

## 🛠️ Local Development

Just open `index.html` in any browser — no build step needed.

```bash
# Or use a local server (optional)
npx serve .
```

---

*© 2025 QuickRailTickets. Not affiliated with IRCTC.*
