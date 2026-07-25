# KING_BLESS-MD

# 🤖 KING_BLESS XMD WhatsApp Bot

<p align="center">
  <img height="1254" src="https://github.com/user-attachments/assets/b7bdef85-a0a9-4bd9-8b11-5bb2db2a9af7" />
</p>

<p align="center">
  <strong>An intelligent, auto-reply WhatsApp bot with AI chat, menus, anti-delete, and more – all without API keys or owner numbers.</strong>
</p>

---

## ✨ Features

- 🧠 **AI Chatbot** – Smart rule-based replies (no API required)
- 📋 **Beautiful Menus** – `.menu`, `.settings`, `.groupmenu` with rich formatting
- ⚡ **Auto-Reply** – Responds to any message instantly
- ⌨️ **Auto-Typing** – Simulates typing before replying
- 💬 **Auto-React** – Reacts with emojis to keywords (love, hi, sad, etc.)
- 🛡️ **Anti-Delete** – Detects deleted messages and re-sends them
- 🌍 **Works Everywhere** – Private chats and groups, no admin number needed
- 🔒 **No .env / No API Config** – Plug-and-play, fully local
- 📦 **Baileys Multi-Device** – Uses WhatsApp Web multi-device protocol

---

## 📸 Screenshots

| Main Menu | Auto Reply |
|-----------|------------|
| ![Main Menu] | ![Auto Reply](https://via.placeholder.com/300x500/0d1117/58a6ff?text=Auto+Reply) |

> Replace these placeholders with real screenshots by uploading them to your repo and updating the image URLs.

---

## 🚀 Installation

1. **Clone the repository**
   ```bash
   https://github.com/your-username/king-bless-bot.git
   cd king-bless-bot
   ```
   
   2. Install dependencies
   ```bash
   npm install @whiskeysockets/baileys qrcode-terminal pino
   ```
3. Run the bot
   ```bash
   node bot.js
   ```
4. Scan the QR code
   · Open WhatsApp on your phone → Settings → Linked Devices → Link a Device
   · Scan the QR code shown in the terminal.

✅ The bot is now connected and ready to chat!

---

🤖 Commands

Command Description
.menu Show the main menu
.settings Show bot settings
.groupmenu Show group features (groups only)
.help Get help and instructions
.chat Start a casual conversation

Any other message will trigger the AI auto-reply.

---

⚙️ How It Works

· AI Engine – Matches common greetings, emotions, and questions, and responds with randomly chosen friendly answers.
· Auto-Typing – Sends WhatsApp composing status for 1.5–3 seconds, then replies.
· Auto-React – Detects keywords like "love", "sad", "haha" and adds an emoji reaction to the message.
· Anti-Delete – Stores every received message. If a message is deleted, the bot reposts it with a warning and the deleter's mention.
· No Owner Number – The bot responds to anyone who messages it, in both private and group chats.

---

📂 File Structure

```
king-bless-bot/
├── auth_info/           # Session credentials (auto-generated)
├── bot.js               # Main bot code
└── README.md
```

---

⚠️ Disclaimer

This project is for educational purposes only. Do not spam or misuse the bot.
We are not responsible for any improper use. WhatsApp may ban accounts that violate its Terms of Service.

---

❤️ Credits

· Baileys – WhatsApp Web API
· qrcode-terminal – Terminal QR code rendering
· pino – Logger

---

<p align="center">
  Made with 💙 by KING_BLESS
</p>
```

---
