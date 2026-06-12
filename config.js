// ============================================================
//  QuickRailTickets — Admin Configuration
//  Edit this file to update WhatsApp number and UPI details
// ============================================================

const CONFIG = {

  // WhatsApp number with country code (no + or spaces)
  // Example: India number 98765 43210 → "919876543210"
  WHATSAPP_NUMBER: "919876543210",

  // UPI ID for payment QR
  UPI_ID: "quickrailtickets@upi",

  // Business name shown on UPI payment page
  UPI_NAME: "QuickRailTickets",

  // Optional: your business email for confirmation messages
  SUPPORT_EMAIL: "support@quickrailtickets.com",

  // WhatsApp message template — use {name}, {from}, {to}, {date}, {passengers}
  WA_MESSAGE_TEMPLATE:
    "Hello QuickRailTickets! 🚂\n\nI want to book a ticket:\n" +
    "👤 Name: {name}\n" +
    "📱 Mobile: {mobile}\n" +
    "🚉 From: {from}\n" +
    "🚉 To: {to}\n" +
    "📅 Date: {date}\n" +
    "👥 Passengers: {passengers}\n\n" +
    "Please confirm availability and send payment details. Thank you!",
};
