const makeWASocket = require("@whiskeysockets/baileys").default;
const {
  useMultiFileAuthState,
  DisconnectReason,
  delay,
  getContentType,
} = require("@whiskeysockets/baileys");

const qrcode = require("qrcode-terminal");
const pino = require("pino");

// ==================== AI / AUTO REPLY ENGINE ====================
const replies = {
  greetings: [
    "Hello! 😊",
    "Hi there! How can I help you?",
    "Hey! Nice to see you 👋",
    "Greetings from KING_BLESS XMD Bot 🤖",
  ],
  goodbye: [
    "Goodbye! See you soon 👋",
    "Bye! Have a great day 🌟",
    "Take care! 🫡",
  ],
  howareyou: [
    "I'm just a bot, but I'm feeling great! 😄",
    "Doing fantastic, thank you! And you?",
    "Always ready to help 💪",
  ],
  help: [
    "I can chat with you! Try typing:\n- .menu for main menu\n- .settings for settings\n- .groupmenu for group menu\n- Or just talk to me naturally 😊",
  ],
  love: [
    "I love you too! ❤️",
    "Thanks! Sending virtual hugs 🤗",
    "You're amazing! 💖",
  ],
  default: [
    "Interesting! Tell me more 🤔",
    "I see... Go on.",
    "That's cool! 😎",
    "I'm here to chat anytime!",
    "Maybe try asking for .menu?",
  ],
};

function getRandomReply(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function aiResponse(text) {
  const t = text.toLowerCase().trim();
  if (["hi", "hello", "hey", "yo", "sup", "hii"].some(k => t.includes(k))) {
    return getRandomReply(replies.greetings);
  }
  if (["bye", "goodbye", "see you", "byee"].some(k => t.includes(k))) {
    return getRandomReply(replies.goodbye);
  }
  if (["how are you", "how r u", "how're you"].some(k => t.includes(k))) {
    return getRandomReply(replies.howareyou);
  }
  if (t.includes("help") || t.includes("what can you do")) {
    return getRandomReply(replies.help);
  }
  if (["i love you", "love you", "ily"].some(k => t.includes(k))) {
    return getRandomReply(replies.love);
  }
  // Default friendly response
  return getRandomReply(replies.default);
}

// ==================== MENU TEXTS ====================
const mainMenu = `╭━━━❰ *KING_BLESS XMD BOT* ❱━━━╮  
│  
│  🤖 *MAIN MENU*  
│  
│   📌 *.menu* – Show this menu  
│   ⚙️ *.settings* – Bot settings  
│   👥 *.groupmenu* – Group features  
│   ℹ️ *.help* – Get help  
│   💬 *.chat* – Talk to me  
│  
│  ──────────────  
│  ✨ Simply send any message and  
│      I will reply automatically!  
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

const settingsMenu = `╭━━━❰ *SETTINGS* ❱━━━╮  
│  
│  🛠️ *Bot Settings*  
│  
│   🔘 Auto-reply: ✅ ON  
│   🔘 Anti-delete: ✅ ON  
│   🔘 Auto-typing: ✅ ON  
│   🔘 Auto-react: ✅ ON  
│  
│  These features are always active  
│  and cannot be turned off.  
╰━━━━━━━━━━━━━━━━━━━╯`;

const groupMenu = `╭━━━❰ *GROUP MENU* ❱━━━╮  
│  
│  👥 *Group Features*  
│  
│   📢 *Admin only:*  
│     (coming soon)  
│  
│   🌐 *All members:*  
│     • Tag me to get a reply  
│     • Use .menu / .settings  
│     • Anti-delete works globally  
│  
│  I'm friendly to everyone! 🤗  
╰━━━━━━━━━━━━━━━━━━━╯`;

// ==================== MESSAGE STORE FOR ANTI-DELETE ====================
const messageStore = new Map();

// ==================== BOT START ====================
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth_info");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      console.log("📲 Scan this QR code using WhatsApp > Linked Devices:\n");
      qrcode.generate(qr, { small: true });
    }
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("Connection closed. Reconnecting:", shouldReconnect);
      if (shouldReconnect) startBot();
    } else if (connection === "open") {
      console.log("✅ Bot connected to WhatsApp!");
    }
  });

  // ==================== INCOMING MESSAGES ====================
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const remoteJid = msg.key.remoteJid;
    const isGroup = remoteJid.endsWith("@g.us");
    const sender = isGroup ? msg.key.participant : remoteJid;

    // --- store message for anti-delete ---
    const msgId = msg.key.id;
    if (msg.message) {
      messageStore.set(msgId, {
        content: msg.message,
        remoteJid: remoteJid,
        key: msg.key,
      });
    }

    // --- extract text ---
    const contentType = getContentType(msg.message);
    let text = "";
    if (contentType === "conversation") {
      text = msg.message.conversation;
    } else if (contentType === "extendedTextMessage") {
      text = msg.message.extendedTextMessage.text;
    } else if (contentType === "imageMessage") {
      text = msg.message.imageMessage.caption || "";
    } else if (contentType === "videoMessage") {
      text = msg.message.videoMessage.caption || "";
    }

    if (!text) return;

    // ==================== COMMAND HANDLING ====================
    const lower = text.trim().toLowerCase();
    if (lower === ".menu") {
      await sock.sendMessage(remoteJid, { text: mainMenu });
      return;
    }
    if (lower === ".settings") {
      await sock.sendMessage(remoteJid, { text: settingsMenu });
      return;
    }
    if (lower === ".groupmenu") {
      if (!isGroup) {
        await sock.sendMessage(remoteJid, { text: "This menu is for groups only!" });
      } else {
        await sock.sendMessage(remoteJid, { text: groupMenu });
      }
      return;
    }
    if (lower === ".help") {
      await sock.sendMessage(remoteJid, { text: getRandomReply(replies.help) });
      return;
    }
    if (lower === ".chat") {
      await sock.sendMessage(remoteJid, { text: "Sure! I'm listening... 💬" });
      return;
    }

    // ==================== AUTO REACT ====================
    const reactEmojis = {
      hi: "👋",
      hello: "👋",
      bye: "👋",
      love: "❤️",
      thanks: "🙏",
      thank: "🙏",
      lol: "😂",
      haha: "😂",
      sad: "😢",
      cool: "😎",
      wow: "😮",
    };
    for (const [word, emoji] of Object.entries(reactEmojis)) {
      if (lower.includes(word)) {
        await sock.sendMessage(remoteJid, {
          react: { text: emoji, key: msg.key },
        });
        break; // only one reaction per message
      }
    }

    // ==================== AUTO-TYPING + AI REPLY ====================
    // simulate typing for 1.5-3 seconds
    const typingTime = 1500 + Math.random() * 1500;
    await sock.sendPresenceUpdate("composing", remoteJid);
    await delay(typingTime);
    await sock.sendPresenceUpdate("paused", remoteJid);

    const aiReply = aiResponse(lower);
    await sock.sendMessage(remoteJid, { text: aiReply });
  });

  // ==================== ANTI-DELETE (MESSAGE UPDATE) ====================
  sock.ev.on("messages.update", async (updates) => {
    for (const update of updates) {
      const { key, update: msgUpdate } = update;
      // A delete typically has key without message field or message is null
      if (!msgUpdate) {
        const stored = messageStore.get(key.id);
        if (stored && stored.remoteJid) {
          const deletedBy = key.participant || key.remoteJid;
          const restoredText = await getTextFromMessageContent(stored.content);
          if (restoredText) {
            await sock.sendMessage(stored.remoteJid, {
              text: `⚠️ *Anti-Delete Detected!*\nDeleted by @${deletedBy.split("@")[0]}\n\n${restoredText}`,
              mentions: [deletedBy],
            });
          }
          messageStore.delete(key.id);
        }
      }
    }
  });
}

// Helper to extract text from stored message content
async function getTextFromMessageContent(content) {
  const type = getContentType(content);
  if (type === "conversation") return content.conversation;
  if (type === "extendedTextMessage") return content.extendedTextMessage.text;
  if (type === "imageMessage") return content.imageMessage.caption;
  if (type === "videoMessage") return content.videoMessage.caption;
  if (type === "documentMessage") return content.documentMessage?.fileName || "Document";
  if (type === "stickerMessage") return "Sticker";
  if (type === "audioMessage") return "Audio";
  return null;
}

startBot();