"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/mock-data";
import { cn } from "@/components/ui/cn";

interface AssistantPanelProps {
  open: boolean;
  initialMessages: ChatMessage[];
}

export function AssistantPanel({ open, initialMessages }: AssistantPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  if (!open) return null;

  const send = () => {
    const text = input.trim();
    if (!text || pending) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setPending(true);
    window.setTimeout(() => {
      const reply: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
        content:
          "Context: I’m using your current workspace signals. That OAuth pattern is still the hot path — I can map it to identity timelines or draft a response playbook. Say “brief” or “deep dive”.",
      };
      setMessages((m) => [...m, reply]);
      setPending(false);
    }, 700);
  };

  return (
    <aside
      className={cn(
        "flex w-full shrink-0 flex-col border-l border-[var(--ss-border)] bg-[var(--ss-bg)]/95 backdrop-blur-xl",
        "lg:w-[min(100%,380px)]",
      )}
      aria-label="AI assistant"
    >
      <div className="border-b border-[var(--ss-border)] px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-[var(--ss-text)]">Shield copilot</p>
            <p className="text-[11px] text-[var(--ss-text-muted)]">Context-aware · Session memory on</p>
          </div>
          <span className="rounded-full border border-[var(--ss-border)] bg-[var(--ss-surface)] px-2 py-0.5 font-mono text-[10px] text-[var(--ss-text-faint)]">
            GPT‑4 class
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="ss-scroll flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
          <div className="rounded-xl border border-[var(--ss-border)] bg-[var(--ss-violet-dim)]/30 px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--ss-violet)]">
              Memory
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--ss-text-muted)]">
              Recalling: OAuth anomaly thread, canary pause, and your preference for concise exec summaries.
            </p>
          </div>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "max-w-[95%] rounded-2xl border px-3 py-2.5 text-sm leading-relaxed",
                msg.role === "user"
                  ? "ml-auto border-[var(--ss-border-strong)] bg-[var(--ss-surface-hover)] text-[var(--ss-text)]"
                  : "mr-auto border-[var(--ss-border)] bg-[var(--ss-surface)] text-[var(--ss-text-muted)]",
              )}
            >
              <p className="text-[var(--ss-text)]">{msg.content}</p>
              <p className="mt-2 font-mono text-[10px] text-[var(--ss-text-faint)]">{msg.time}</p>
            </div>
          ))}
          {pending && (
            <div className="mr-auto flex items-center gap-2 rounded-2xl border border-[var(--ss-border)] bg-[var(--ss-surface)] px-3 py-2">
              <span className="size-1.5 animate-pulse rounded-full bg-[var(--ss-accent)]" />
              <span className="size-1.5 animate-pulse rounded-full bg-[var(--ss-accent)] [animation-delay:150ms]" />
              <span className="size-1.5 animate-pulse rounded-full bg-[var(--ss-accent)] [animation-delay:300ms]" />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-[var(--ss-border)] p-3">
          <div className="ss-card ss-card-focus rounded-xl p-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={2}
              placeholder="Ask about risks, timelines, or remediation…"
              className="w-full resize-none bg-transparent px-3 py-2 text-sm text-[var(--ss-text)] placeholder:text-[var(--ss-text-faint)] focus:outline-none"
            />
            <div className="flex items-center justify-between border-t border-[var(--ss-border)] px-2 py-1.5">
              <span className="text-[10px] text-[var(--ss-text-faint)]">Enter to send · Shift+Enter newline</span>
              <button
                type="button"
                onClick={send}
                disabled={pending || !input.trim()}
                className="rounded-lg bg-[var(--ss-accent-dim)] px-3 py-1.5 text-xs font-medium text-[var(--ss-accent)] transition hover:bg-[rgba(94,234,212,0.22)] disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
