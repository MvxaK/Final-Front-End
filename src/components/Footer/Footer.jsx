import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import s from "./Footer.module.css";
import emailjs from "emailjs-com";

const Footer = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);

    try {
      await emailjs.send(
        "service_lyiy3sh",
        "template_qowmpr8",
        {
          message,
          from_email: user.email,
          from_name: user.displayName || "Unknown",
        },
        "iqGIrwoZDvSFPxWVY"
      );

      alert("Message sent to the host");
      setMessage("");
    } catch (err) {
      console.error("Send error:", err);
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className={s.footer}>
        <form onSubmit={handleSubmit} className={s.contactForm}>
          <input
            type="text"
            placeholder="Send message to site owner..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={s.messageInput}
          />
          <button type="submit" disabled={sending} className={s.sendButton}>
            {sending ? "Sending..." : "Send"}
          </button>
        </form>

      <div className={s.copySocial}>
        <span className={s.copyright}>
            PictureShare {new Date().getFullYear()}. All rights belongs to Kamalov Amir.
        </span>
        <div className={s.socialIcons}>
          <a href="https://github.com/MvxaK" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://t.me/" target="_blank" rel="noreferrer">Telegram</a>
          <a href="https://mail.google.com">Email</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
