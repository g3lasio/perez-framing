"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { widgetApi, widgetToken, type ChatReply, type WidgetConfig } from "@/lib/leadprimeWidget";

export type AssistantCopy = {
  label: string;
  title: string;
  status: string;
  trigger: string;
  intro: string;
  chips: readonly string[];
  placeholder: string;
  send: string;
  close: string;
  open: string;
  error: string;
  busy: string;
  unavailable: string;
  offline: string;
  disclaimer: string;
  callAction: string;
  textAction: string;
  powered: string;
};

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
};

/**
 * Business assistant panel backed by the Leadprime Embed Kit.
 *
 * It speaks to the same public widget endpoints as Leadprime's own `embed.js`
 * (`/api/widget/config` and `/api/widget/chat`) instead of injecting that script,
 * so the assistant keeps the account's identity and knowledge base while staying
 * inside this site's interface, its Spanish/English toggle, and its focus and
 * keyboard behavior. Answers come from the business's Leadprime agent only —
 * there is no local fallback bot.
 */
export default function AssistantChat({
  lang,
  copy,
  phoneHref,
}: {
  lang: "en" | "es";
  copy: AssistantCopy;
  phoneHref: string;
}) {
  // Whether Leadprime refused the token. Affects what the panel says on open —
  // never whether the panel exists.
  // widgetToken is a build-time constant, so an unconfigured deployment is known
  // before the first render rather than through an effect.
  const [rejected, setRejected] = useState(!widgetToken);
  const [config, setConfig] = useState<WidgetConfig>({});
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const sessionRef = useRef<string | null>(null);
  const leadRef = useRef<string | null>(null);
  const messageId = useRef(0);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Ask Leadprime for the owner-managed branding (agent name, greeting, consent).
  //
  // The chat is ALWAYS rendered, whatever this returns. An earlier version hid the
  // whole widget when Leadprime answered 401/403, which meant a token that was
  // disabled or a domain missing from the allow-list made the chat silently vanish
  // from the site — indistinguishable from it having been removed. A rejected token
  // is a configuration problem for the owner to fix, not a reason to take the
  // visitor's contact channel away: the panel still opens, and it still offers a
  // call and a text.
  useEffect(() => {
    if (!widgetToken) return;

    const controller = new AbortController();

    fetch(`${widgetApi.config}?token=${encodeURIComponent(widgetToken)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (response.status === 401 || response.status === 403) {
          setRejected(true);
          // Addressed to whoever owns the site, not the visitor.
          console.warn(
            "[Leadprime] The widget token was rejected (%d). Check that the token is " +
              "enabled and that this domain is on its allow-list in the Leadprime " +
              "account. The assistant stays on the page and offers phone and text.",
            response.status,
          );
          return;
        }
        if (response.ok) {
          const data = (await response.json()) as WidgetConfig;
          setConfig(data ?? {});
        }
      })
      .catch(() => {
        // A transient network failure changes nothing: the panel still opens and the
        // send path reports its own errors.
      });

    return () => controller.abort();
  }, []);

  // Closing always hands focus back to the trigger, whichever way the panel was
  // dismissed — otherwise keyboard users are dropped at the top of the document.
  // The trigger stays mounted while the panel is open, so this can run before the
  // panel unmounts rather than racing a timer against React's commit.
  const closePanel = useCallback(() => {
    triggerRef.current?.focus();
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closePanel]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, sending]);

  const push = useCallback((role: Message["role"], text: string) => {
    messageId.current += 1;
    setMessages((current) => [...current, { id: messageId.current, role, text }]);
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || sending) return;

      if (!sessionRef.current) {
        sessionRef.current = `ws_${Math.random().toString(36).slice(2, 14)}`;
      }

      setDraft("");
      push("user", text);
      setSending(true);

      try {
        const response = await fetch(widgetApi.chat, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: widgetToken,
            message: text,
            sessionId: sessionRef.current,
            leadId: leadRef.current,
            pageUrl: window.location.href,
            pageTitle: document.title,
          }),
        });

        if (response.status === 429) {
          push("bot", copy.busy);
          return;
        }

        if (!response.ok) {
          push("bot", copy.error);
          return;
        }

        const data = (await response.json()) as ChatReply;
        if (data.leadId) leadRef.current = data.leadId;
        push("bot", data.reply?.trim() || copy.error);
      } catch {
        push("bot", copy.error);
      } finally {
        setSending(false);
      }
    },
    [copy.busy, copy.error, push, sending],
  );

  function openPanel() {
    setOpen(true);
    if (messages.length > 0) return;
    // The greeting is the account's own, falling back to the site's copy only if
    // Leadprime has none configured. If the token was refused, say so plainly
    // instead of inviting a question that cannot be answered — the call and text
    // actions below stay available either way.
    push("bot", rejected ? copy.unavailable : config.greeting?.trim() || copy.intro);
  }

  function toggle() {
    if (open) closePanel();
    else openPanel();
  }

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const heading = config.agentName?.trim() || copy.title;
  // An avatar set in the Leadprime account wins (that is the Embed Kit contract);
  // otherwise the business's own mark. Never Leadprime's logo: the visitor is
  // talking to Perez, and the vendor's brand here only creates confusion.
  const avatar =
    config.avatarUrl?.trim() || config.logoUrl?.trim() || "/assets/logo-mark.png";
  // Suggested questions only make sense while the agent can actually answer them.
  const showChips = messages.length <= 1 && !sending && !rejected;

  return (
    <div className={`chat-widget${open ? " open" : ""}`}>
      {open && (
        <section className="chat-panel" aria-label={copy.label}>
          <header>
            <span className="chat-mark">
              {/* eslint-disable-next-line @next/next/no-img-element -- the avatar
                  may be an arbitrary remote URL from the Leadprime account, which
                  next/image would require a remotePatterns entry for. */}
              <img src={avatar} alt="" width={38} height={38} />
            </span>
            <div>
              <small>{copy.label}</small>
              <strong>{heading}</strong>
            </div>
            <button type="button" aria-label={copy.close} onClick={closePanel}>
              <Icon name="close" size={19} />
            </button>
          </header>

          <div className={`chat-status${rejected ? " offline" : ""}`}>
            <i />
            {rejected ? copy.offline : copy.status}
          </div>

          <div
            className="chat-log"
            ref={listRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            aria-label={copy.label}
          >
            {messages.map((message) => (
              <p key={message.id} className={`chat-bubble ${message.role}`}>
                {message.text}
              </p>
            ))}
            {sending && (
              <p className="chat-bubble bot chat-typing" aria-hidden="true">
                <i />
                <i />
                <i />
              </p>
            )}
          </div>

          {showChips && (
            <div className="chat-chips">
              {copy.chips.map((chip) => (
                <button key={chip} type="button" onClick={() => void send(chip)}>
                  {chip}
                </button>
              ))}
            </div>
          )}

          <form
            className="chat-input"
            onSubmit={(event) => {
              event.preventDefault();
              void send(draft);
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={draft}
              maxLength={500}
              autoComplete="off"
              placeholder={copy.placeholder}
              aria-label={copy.placeholder}
              onChange={(event) => setDraft(event.target.value)}
            />
            <button type="submit" aria-label={copy.send} disabled={sending || !draft.trim()}>
              <Icon name="send" size={18} />
            </button>
          </form>

          <div className="chat-escalate">
            <a href={`tel:${phoneHref}`}>
              <Icon name="phone" size={15} />
              {copy.callAction}
            </a>
            <a href={`sms:${phoneHref}`}>
              <Icon name="message" size={15} />
              {copy.textAction}
            </a>
          </div>

          <p className="chat-disclaimer">
            {config.requireConsent && config.consentText?.trim()
              ? config.consentText
              : copy.disclaimer}
          </p>

          <div className="chat-powered">
            <span>{copy.powered}</span>
            <i />
            {lang === "es" ? "Conocimiento del negocio" : "Business knowledge"}
          </div>
        </section>
      )}

      <button
        ref={triggerRef}
        className="chat-trigger"
        type="button"
        aria-label={open ? copy.close : copy.open}
        aria-expanded={open}
        onClick={toggle}
      >
        {open ? (
          <Icon name="close" size={24} />
        ) : (
          <>
            <span className="chat-trigger-mark">
              {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
              <img src={avatar} alt="" width={30} height={30} />
            </span>
            <span>{copy.trigger}</span>
          </>
        )}
      </button>
    </div>
  );
}
