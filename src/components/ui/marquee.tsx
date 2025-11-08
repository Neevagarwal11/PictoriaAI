// src/components/ui/marquee.tsx
"use client";
import React, { ComponentPropsWithoutRef, useMemo } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  duration?: string;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  duration = "80s",
  ...props
}: MarqueeProps) {
  // normalize children into an array and optionally reverse their order
  const childrenArray = React.Children.toArray(children);
  const orderedChildren = reverse ? [...childrenArray].reverse() : childrenArray;

  const styleVars = useMemo(
    () =>
      ({
        "--duration": duration,
        "--gap": "1rem",
        // NOTE: animationDirection is set on the animated track below via inline style
      } as React.CSSProperties),
    [duration]
  );

  // Inline style for the animated track. This *must* be applied onto the element
  // that has the `animation` rule (animate-marquee / animate-marquee-vertical).
  const animatedTrackStyle: React.CSSProperties = {
    animationDirection: reverse ? "reverse" : "normal",
  };

  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [--gap:1rem]",
        vertical ? "flex-col" : "flex-row",
        className
      )}
      style={styleVars}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          // Apply the animation class and inline animationDirection here:
          className={cn(
            "flex shrink-0 justify-around [gap:var(--gap)]",
            vertical ? "flex-col animate-marquee-vertical" : "flex-row animate-marquee",
            pauseOnHover && "group-hover:[animation-play-state:paused]"
          )}
          style={animatedTrackStyle}
          aria-hidden={i > 0} // duplicates after the first are decorative
        >
          {orderedChildren}
        </div>
      ))}
    </div>
  );
}
