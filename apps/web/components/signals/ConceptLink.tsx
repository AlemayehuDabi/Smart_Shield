import Link from "next/link";
import { GraduationCap } from "@/components/ui/icons";
import { lessonById } from "@/lib/data/lessons";

/**
 * In-context education hook. Wraps a term used in a signal's reasoning; on
 * hover/focus it reveals a micro-lesson tooltip that links into the Learn hub.
 * Pure CSS reveal (group-hover / focus-within) — server-safe.
 */
export function ConceptLink({ id }: { id: string }) {
  const lesson = lessonById(id);
  if (!lesson) return null;

  return (
    <span className="group relative inline-block align-baseline">
      <Link
        href={`/learn?c=${id}`}
        className="cursor-help whitespace-nowrap border-b border-dashed border-[var(--ss-violet)] font-medium text-[var(--ss-violet)] outline-none transition-colors hover:text-[var(--ss-violet-bright)] focus-visible:ring-2 focus-visible:ring-[var(--ss-violet)]/40"
      >
        {lesson.title.toLowerCase()}
      </Link>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-64 -translate-x-1/2 translate-y-1 rounded-xl border border-[var(--ss-violet)]/30 bg-[var(--ss-bg-raised)] p-3 opacity-0 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)] transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
      >
        <span className="flex items-center gap-1.5">
          <GraduationCap size={13} className="text-[var(--ss-violet)]" />
          <span className="text-[12px] font-semibold text-[var(--ss-text)]">{lesson.title}</span>
          <span className="ml-auto font-mono text-[9.5px] text-[var(--ss-text-faint)]">
            {lesson.minutes} min
          </span>
        </span>
        <span className="mt-1.5 block text-[11.5px] leading-relaxed text-[var(--ss-text-muted)]">
          {lesson.definition}
        </span>
        <span className="mt-2 block font-mono text-[9.5px] font-semibold uppercase tracking-wider text-[var(--ss-violet)]">
          Open lesson →
        </span>
      </span>
    </span>
  );
}
