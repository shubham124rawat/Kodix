"use client";

import { AnimatePresence, motion } from "motion/react";
import { cloneElement, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";

type Side = "top" | "bottom" | "left" | "right";

const offset = 8;

export function Tooltip({
  content,
  children,
  className,
  side = "top",
}: {
  content: string;
  children: React.ReactElement<Record<string, unknown>>;
  className?: string;
  side?: Side;
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const tipRef = useRef<HTMLElement | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    if (!visible) return;
    const trigger = triggerRef.current;
    const tip = tipRef.current;
    if (!trigger || !tip) return;

    const triggerRect = trigger.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    let left = triggerRect.left + triggerRect.width / 2 - tipRect.width / 2;
    let top = triggerRect.top - tipRect.height - offset;

    if (side === "bottom") top = triggerRect.bottom + offset;
    if (side === "left") {
      left = triggerRect.left - tipRect.width - offset;
      top = triggerRect.top + triggerRect.height / 2 - tipRect.height / 2;
    }
    if (side === "right") {
      left = triggerRect.right + offset;
      top = triggerRect.top + triggerRect.height / 2 - tipRect.height / 2;
    }

    const viewportPadding = 4;
    left = Math.max(
      viewportPadding,
      Math.min(left, window.innerWidth - tipRect.width - viewportPadding)
    );
    top = Math.max(
      viewportPadding,
      Math.min(top, window.innerHeight - tipRect.height - viewportPadding)
    );

    setPos({ left, top });
  }, [visible, side, content]);

  return (
    <>
      {cloneElement(children, {
        ref: triggerRef,
        onMouseEnter: () => setVisible(true),
        onMouseLeave: () => setVisible(false),
        onFocus: () => setVisible(true),
        onBlur: () => setVisible(false),
        "aria-describedby": visible ? id : undefined,
      })}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {visible && pos && (
              <motion.span
                ref={tipRef}
                id={id}
                role="tooltip"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={cn(
                  "pointer-events-none fixed z-50 rounded-md border border-border bg-surface-elevated px-2 py-1 text-xs whitespace-nowrap text-text-primary shadow-lg shadow-black/40",
                  className
                )}
                style={{
                  left: pos.left,
                  top: pos.top,
                }}
              >
                {content}
              </motion.span>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
