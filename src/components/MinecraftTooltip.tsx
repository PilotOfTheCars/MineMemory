import React, { useState, useEffect, useRef } from 'react';

export interface TooltipData {
  title: string;
  desc?: string;
  color?: string;
  x: number;
  y: number;
  isTouch: boolean;
}

export default function MinecraftTooltip() {
  const [activeTooltip, setActiveTooltip] = useState<TooltipData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [adjustedPos, setAdjustedPos] = useState({ left: 0, top: 0 });

  useEffect(() => {
    // Listen to mouse hovers
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const trigger = target.closest('[data-mc-tooltip]');
      if (trigger) {
        const title = trigger.getAttribute('data-mc-tooltip') || '';
        const desc = trigger.getAttribute('data-mc-tooltip-desc') || '';
        const color = trigger.getAttribute('data-mc-tooltip-color') || 'text-white';
        
        setActiveTooltip({
          title,
          desc,
          color,
          x: e.clientX,
          y: e.clientY,
          isTouch: false
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setActiveTooltip(prev => {
        if (prev && !prev.isTouch) {
          return { ...prev, x: e.clientX, y: e.clientY };
        }
        return prev;
      });
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const trigger = target.closest('[data-mc-tooltip]');
      if (trigger) {
        setActiveTooltip(null);
      }
    };

    // Listen to touch events (to support mobile taps elegantly without hovering)
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const trigger = target.closest('[data-mc-tooltip]');
      if (trigger) {
        // Prevent potential standard browser highlight or zoom if desired
        const title = trigger.getAttribute('data-mc-tooltip') || '';
        const desc = trigger.getAttribute('data-mc-tooltip-desc') || '';
        const color = trigger.getAttribute('data-mc-tooltip-color') || 'text-white';

        const rect = trigger.getBoundingClientRect();
        // Position centered above the tapped element
        setActiveTooltip({
          title,
          desc,
          color,
          x: rect.left + rect.width / 2,
          y: rect.top,
          isTouch: true
        });
      } else {
        // Tap outside collapses any active touch tooltip
        setActiveTooltip(null);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  // Recalculate safe layout bounds on tooltip render
  useEffect(() => {
    if (!activeTooltip) return;

    // Use absolute positioning with bounding check
    const tooltipBox = containerRef.current;
    if (!tooltipBox) {
      // Default guess before render measures it
      setAdjustedPos({
        left: activeTooltip.isTouch ? activeTooltip.x - 100 : activeTooltip.x + 15,
        top: activeTooltip.isTouch ? activeTooltip.y - 45 : activeTooltip.y - 15
      });
      return;
    }

    const width = tooltipBox.offsetWidth;
    const height = tooltipBox.offsetHeight;
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    let targetLeft = 0;
    let targetTop = 0;

    if (activeTooltip.isTouch) {
      // Position above the tapped cell
      targetLeft = activeTooltip.x - width / 2;
      targetTop = activeTooltip.y - height - 10;
    } else {
      // Mouse offset
      targetLeft = activeTooltip.x + 18;
      targetTop = activeTooltip.y - 12;
    }

    // Horizontal boundaries security check
    if (targetLeft < 6) {
      targetLeft = 6;
    } else if (targetLeft + width > winWidth - 6) {
      if (activeTooltip.isTouch) {
        targetLeft = Math.max(6, winWidth - width - 6);
      } else {
        // Shift left of mouse to prevent clipping
        targetLeft = activeTooltip.x - width - 18;
      }
    }

    // Vertical boundaries security check
    if (targetTop < 6) {
      // Push below finger/mouse if too high
      if (activeTooltip.isTouch) {
        targetTop = activeTooltip.y + 40; // drop beneath instead
      } else {
        targetTop = activeTooltip.y + 24;
      }
    } else if (targetTop + height > winHeight - 6) {
      targetTop = Math.max(6, winHeight - height - 6);
    }

    setAdjustedPos({ left: targetLeft, top: targetTop });
  }, [activeTooltip, activeTooltip?.x, activeTooltip?.y]);

  if (!activeTooltip) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        left: `${adjustedPos.left}px`,
        top: `${adjustedPos.top}px`,
        pointerEvents: 'none',
      }}
      className="fixed z-[9999] max-w-[280px] sm:max-w-[340px] flex flex-col pointer-events-none"
    >
      <div 
        className="mc-tooltip-realistic p-2 rounded-none animate-mc-tooltip font-mono text-[11px] sm:text-[13px] leading-tight select-none cursor-none bg-[#100010]"
        style={{
          border: '3px solid #1f0147',
          outline: '3px solid #100010',
          boxShadow: 'inset 0 0 0 2px #440099, 4px 4px 0px rgba(0,0,0,0.5)',
        }}
        id="mc-world-tooltip"
      >
        {/* Title */}
        <div className={`font-pressstart text-[8px] sm:text-[9.5px] tracking-wide mb-1 select-none font-bold ${activeTooltip.color}`}>
          {activeTooltip.title}
        </div>
        
        {/* Subtitle / Description */}
        {activeTooltip.desc && (
          <div className="text-zinc-400 capitalize-first leading-snug whitespace-pre-line border-t border-purple-950/40 pt-1 mt-1 font-mono text-[10.5px] sm:text-[11.5px]">
            {activeTooltip.desc}
          </div>
        )}
        
        {/* Mobile touch tip footer */}
        {activeTooltip.isTouch && (
          <div className="text-[7.5px] text-zinc-500 font-pressstart tracking-widest mt-2 border-t border-zinc-800/60 pt-1 text-center uppercase">
            Tapped Node — Tap outside to close
          </div>
        )}
      </div>
    </div>
  );
}
