/* ════════════════════════════════════════════════════════
   QuickRailTickets — App Logic
   Reads from ADMIN_CONFIG (admin-config.js)
════════════════════════════════════════════════════════ */

"use strict";

/* ── Boot ────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initConfig();
  initDateMin();
  initPriceSummary();
  initForm();
  initQRPattern();
  initFooterWA();
});

/* ── Apply admin config to page ──────────────────────── */
function initConfig() {
  // UPI ID display
  const upiEl = document.getElementById("displayUpiId");
  if (upiEl) upiEl.textContent = ADMIN_CONFIG.upiId;

  // Copy UPI button aria-label
  const copyBtn = document.getElementById("copyUpiBtn");
  if (copyBtn) copyBtn.setAttribute("aria-label", `Copy UPI ID ${ADMIN_CONFIG.upiId}`);
}

/* ── Set minimum journey date to today ───────────────── */
function initDateMin() {
  const dateInput = document.getElementById("date");
  if (!dateInput) return;
  const today = new Date().toISOString().split("T")[0];
  dateInput.setAttribute("min", today);
}

/* ── Live price summary ──────────────────────────────── */
function initPriceSummary() {
  const paxSelect = document.getElementById("passengers");
  if (!paxSelect) return;
  paxSelect.addEventListener("change", updatePrice);
}

function updatePrice() {
  const pax = parseInt(document.getElementById("passengers").value, 10);
  if (isNaN(pax)) return;

  const fare    = pax * ADMIN_CONFIG.pricePerPassenger;
  const service = ADMIN_CONFIG.serviceCharge;
  const total   = fare + service;

  document.getElementById("paxLabel").textContent    = `${pax} pax × ₹${ADMIN_CONFIG.pricePerPassenger}`;
  document.getElementById("fareAmt").textContent     = `₹${fare}`;
  document.getElementById("serviceAmt").textContent  = `₹${service}`;
  document.getElementById("totalAmt").textContent    = `₹${total}`;
}

/* ── Form validation & WhatsApp redirect ─────────────── */
function initForm() {
  const form = document.getElementById("bookingForm");
  if (!form) return;
  form.addEventListener("submit", handleSubmit);
}

function handleSubmit(e) {
  e.preventDefault();

  const fields = {
    name:       { el: document.getElementById("name"),       errId: "nameErr",       label: "Full name" },
    mobile:     { el: document.getElementById("mobile"),     errId: "mobileErr",     label: "Mobile number" },
    from:       { el: document.getElementById("from"),       errId: "fromErr",       label: "From station" },
    to:         { el: document.getElementById("to"),         errId: "toErr",         label: "To station" },
    date:       { el: document.getElementById("date"),       errId: "dateErr",       label: "Journey date" },
    passengers: { el: document.getElementById("passengers"), errId: "passengersErr", label: "Passengers" },
  };

  let valid = true;

  // Clear previous errors
  Object.values(fields).forEach(f => {
    clearError(f.el, f.errId);
  });

  // Validate each field
  const name = fields.name.el.value.trim();
  if (!name || name.length < 2) {
    showError(fields.name.el, fields.name.errId, "Please enter your full name.");
    valid = false;
  }

  const mobile = fields.mobile.el.value.trim().replace(/\s/g, "");
  if (!/^\d{10}$/.test(mobile)) {
    showError(fields.mobile.el, fields.mobile.errId, "Enter a valid 10-digit mobile number.");
    valid = false;
  }

  const from = fields.from.el.value.trim();
  if (!from) {
    showError(fields.from.el, fields.from.errId, "Enter departure station.");
    valid = false;
  }

  const to = fields.to.el.value.trim();
  if (!to) {
    showError(fields.to.el, fields.to.errId, "Enter destination station.");
    valid = false;
  }

  if (from && to && from.toLowerCase() === to.toLowerCase()) {
    showError(fields.to.el, fields.to.errId, "From and To stations can't be the same.");
    valid = false;
  }

  const date = fields.date.el.value;
  if (!date) {
    showError(fields.date.el, fields.date.errId, "Select your journey date.");
    valid = false;
  } else {
    const selected = new Date(date);
    const today    = new Date(); today.setHours(0,0,0,0);
    if (selected < today) {
      showError(fields.date.el, fields.date.errId, "Date cannot be in the past.");
      valid = false;
    }
  }

  const pax = fields.passengers.el.value;
  if (!pax) {
    showError(fields.passengers.el, fields.passengers.errId, "Select passenger count.");
    valid = false;
  }

  if (!valid) return;

  // Build formatted WhatsApp message
  const formattedDate = formatDate(date);
  const fare    = parseInt(pax, 10) * ADMIN_CONFIG.pricePerPassenger;
  const total   = fare + ADMIN_CONFIG.serviceCharge;

  const message = [
    `🎟️ *New Ticket Booking Request*`,
    ``,
    `👤 *Name:* ${name}`,
    `📱 *Mobile:* +91 ${mobile}`,
    `🚉 *From:* ${from}`,
    `🏁 *To:* ${to}`,
    `📅 *Date:* ${formattedDate}`,
    `👥 *Passengers:* ${pax}`,
    ``,
    `💰 *Ticket Fare:* ₹${fare}`,
    `⚙️ *Service Charge:* ₹${ADMIN_CONFIG.serviceCharge}`,
    `✅ *Total Payable:* ₹${total}`,
    ``,
    `💸 *Please pay ₹${total} to UPI ID:* ${ADMIN_CONFIG.upiId}`,
    `📸 Kindly send payment screenshot after paying.`,
    ``,
    `Thank you for choosing ${ADMIN_CONFIG.businessName}! 🚆`,
  ].join("\n");

  const waUrl = `https://wa.me/${ADMIN_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

  // Provide feedback before opening WhatsApp
  const btn = document.getElementById("submitBtn");
  btn.disabled = true;
  btn.innerHTML = `<span class="btn__icon">⏳</span> Opening WhatsApp…`;

  showToast("Opening WhatsApp — payment details sent! 🎉");

  setTimeout(() => {
    window.open(waUrl, "_blank");
    btn.disabled = false;
    btn.innerHTML = `<span class="btn__icon">💬</span> Continue to WhatsApp &amp; Pay`;
  }, 900);
}

/* ── Copy UPI ID ─────────────────────────────────────── */
function copyUPI() {
  const upiId = ADMIN_CONFIG.upiId;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(upiId)
      .then(() => showToast(`Copied: ${upiId} ✅`))
      .catch(() => fallbackCopy(upiId));
  } else {
    fallbackCopy(upiId);
  }
}

function fallbackCopy(text) {
  const el = document.createElement("textarea");
  el.value = text;
  el.style.position = "fixed";
  el.style.opacity = "0";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  showToast(`Copied: ${text} ✅`);
}

/* ── Footer WhatsApp link ────────────────────────────── */
function initFooterWA() {
  const link = document.getElementById("footerWA");
  if (!link) return;
  const msg = `Hi! I'd like to know more about QuickRailTickets.`;
  link.href = `https://wa.me/${ADMIN_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
}

/* ── Decorative QR grid pattern ─────────────────────── */
function initQRPattern() {
  const grid = document.querySelector(".qr-grid");
  if (!grid) return;
  // Seed a pseudo-random QR-like dot pattern
  const pattern = [
    1,1,1,0,1,1,1,
    1,0,1,0,1,0,1,
    1,1,1,1,1,1,1,
    0,1,0,1,0,0,0,
    1,1,1,0,1,1,0,
    1,0,0,1,0,1,1,
    1,1,1,1,1,0,1,
  ];
  pattern.forEach(cell => {
    const span = document.createElement("span");
    if (!cell) span.style.background = "transparent";
    grid.appendChild(span);
  });
}

/* ── Toast notification ──────────────────────────────── */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

/* ── Field error helpers ─────────────────────────────── */
function showError(el, errId, msg) {
  el.classList.add("error");
  const errEl = document.getElementById(errId);
  if (errEl) errEl.textContent = msg;
}

function clearError(el, errId) {
  el.classList.remove("error");
  const errEl = document.getElementById(errId);
  if (errEl) errEl.textContent = "";
}

/* ── Date formatter ──────────────────────────────────── */
function formatDate(isoDate) {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
}
