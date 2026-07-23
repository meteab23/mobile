"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  ArrowUp,
  ThumbsDown,
  ThumbsUp,
  Sparkles,
  Calculator,
  Copy,
  Check,
} from "lucide-react";
import { SUGGESTED_PROMPTS, USER } from "@/lib/demo-data";
import { generateAssistantReply, getWelcomeMessages } from "@/lib/chat-engine";
import { formatAED, uid } from "@/lib/format";
import type { ChatMessage } from "@/lib/types";

function renderMarkdownLite(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-ink-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function MessageBubble({
  message,
  onFeedback,
}: {
  message: ChatMessage;
  onFeedback: (id: string, value: "up" | "down") => void;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  return (
    <div
      className={`animate-fade-up flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[min(100%,640px)] ${
          isUser
            ? "rounded-2xl rounded-br-md bg-ink-800 px-4 py-3 text-sand-50"
            : "w-full"
        }`}
      >
        {!isUser && (
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gulf-600">
            <Sparkles size={14} />
            Mizan
          </div>
        )}
        <div
          className={`whitespace-pre-wrap text-[15px] leading-relaxed ${
            isUser ? "text-sand-50" : "prose-chat text-ink-700"
          }`}
        >
          {renderMarkdownLite(message.content)}
        </div>

        {message.evidence && message.evidence.length > 0 && (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {message.evidence.map((e, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 shadow-soft"
              >
                <div className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
                  {e.title}
                </div>
                <div className="mt-0.5 font-mono text-sm font-medium text-ink-800">
                  {e.value}
                </div>
                <div className="mt-0.5 text-xs text-ink-400">{e.detail}</div>
              </div>
            ))}
          </div>
        )}

        {message.scenario && (
          <div className="mt-3 overflow-hidden rounded-2xl border border-gulf-200 bg-gulf-50/80">
            <div className="flex items-center gap-2 border-b border-gulf-200/80 px-4 py-2.5 text-sm font-medium text-gulf-800">
              <Calculator size={15} />
              Verifiable scenario · {message.scenario.title}
            </div>
            <div className="grid grid-cols-3 gap-2 px-4 py-3">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-ink-400">
                  Baseline
                </div>
                <div className="font-mono text-sm font-medium text-ink-800">
                  {formatAED(message.scenario.baseline, true)}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-ink-400">
                  Projected
                </div>
                <div className="font-mono text-sm font-medium text-gulf-700">
                  {formatAED(message.scenario.projected, true)}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-ink-400">
                  Delta
                </div>
                <div className="font-mono text-sm font-medium text-tide-500">
                  {formatAED(message.scenario.delta, true)}
                </div>
              </div>
            </div>
            <ul className="space-y-1 border-t border-gulf-200/80 px-4 py-3 text-xs text-ink-500">
              {message.scenario.notes.map((n, i) => (
                <li key={i}>• {n}</li>
              ))}
              <li className="pt-1 text-ink-400">Unit: {message.scenario.unit}</li>
            </ul>
          </div>
        )}

        {!isUser && (
          <div className="mt-2 flex items-center gap-1">
            <button
              onClick={() => onFeedback(message.id, "up")}
              className={`rounded-lg p-1.5 transition ${
                message.feedback === "up"
                  ? "bg-gulf-100 text-gulf-700"
                  : "text-ink-300 hover:bg-sand-100 hover:text-ink-600"
              }`}
              aria-label="Thumbs up"
            >
              <ThumbsUp size={14} />
            </button>
            <button
              onClick={() => onFeedback(message.id, "down")}
              className={`rounded-lg p-1.5 transition ${
                message.feedback === "down"
                  ? "bg-clay-400/20 text-clay-600"
                  : "text-ink-300 hover:bg-sand-100 hover:text-ink-600"
              }`}
              aria-label="Thumbs down"
            >
              <ThumbsDown size={14} />
            </button>
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(message.content);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="rounded-lg p-1.5 text-ink-300 transition hover:bg-sand-100 hover:text-ink-600"
              aria-label="Copy"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ChatView({
  compact = false,
  seedPrompt,
}: {
  compact?: boolean;
  seedPrompt?: string | null;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    getWelcomeMessages(),
  );
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const seeded = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (seedPrompt && !seeded.current) {
      seeded.current = true;
      void send(seedPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedPrompt]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMsg: ChatMessage = {
      id: uid("msg"),
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    startTransition(() => {
      setMessages((m) => [...m, userMsg]);
      setInput("");
      setTyping(true);
    });

    await new Promise((r) => setTimeout(r, 600 + Math.random() * 700));
    const assistant = generateAssistantReply(trimmed);
    setMessages((m) => [...m, assistant]);
    setTyping(false);
  }

  function onFeedback(id: string, value: "up" | "down") {
    setMessages((msgs) =>
      msgs.map((m) =>
        m.id === id
          ? { ...m, feedback: m.feedback === value ? null : value }
          : m,
      ),
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        className={`scrollbar-thin flex-1 overflow-y-auto ${
          compact ? "px-4 py-4" : "px-4 py-6 sm:px-8"
        }`}
      >
        <div
          className={`mx-auto flex flex-col gap-5 ${
            compact ? "max-w-none" : "max-w-2xl"
          }`}
        >
          {!compact && messages.length <= 1 && (
            <div className="animate-fade-up mb-2">
              <p className="font-display text-3xl font-medium tracking-tight text-ink-900 sm:text-4xl">
                Good afternoon, {USER.firstName}
              </p>
              <p className="mt-2 max-w-lg text-ink-500">
                Ask anything about your UAE finances — net worth, cashflow,
                goals, or what-if scenarios. I&apos;ll show the math.
              </p>
            </div>
          )}

          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} onFeedback={onFeedback} />
          ))}

          {typing && (
            <div className="flex items-center gap-2 text-sm text-ink-400">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-gulf-500" />
                <span
                  className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-gulf-500"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-gulf-500"
                  style={{ animationDelay: "0.3s" }}
                />
              </span>
              Thinking…
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div
        className={`border-t border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md ${
          compact ? "p-3" : "p-4 sm:px-8 sm:pb-6"
        }`}
      >
        <div className={`mx-auto ${compact ? "" : "max-w-2xl"}`}>
          {!compact && (
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-ink-600 transition hover:border-gulf-300 hover:bg-gulf-50 hover:text-gulf-800"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex items-end gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-soft focus-within:border-gulf-300 focus-within:ring-2 focus-within:ring-gulf-100"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              rows={1}
              placeholder="Ask Mizan about your money…"
              className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-ink-800 outline-none placeholder:text-ink-300"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gulf-700 text-sand-50 transition hover:bg-gulf-600 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send"
            >
              <ArrowUp size={18} />
            </button>
          </form>
          {!compact && (
            <p className="mt-2 text-center text-[11px] text-ink-300">
              Demo data · Not financial advice · AED · UAE
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
