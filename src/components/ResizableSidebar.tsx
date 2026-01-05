
import { useState, useRef, useEffect } from "react";

interface ResizableSidebarProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
  minSidebarWidth?: number;
  maxSidebarWidth?: number;
  minMainWidth?: number;
  maxMainWidth?: number;
  defaultSidebarWidth?: number;
}

export function ResizableSidebar({
  sidebar,
  main,
  minSidebarWidth = 200,
  maxSidebarWidth = 480,
  minMainWidth = 320,
  maxMainWidth = 9999,
  defaultSidebarWidth = 384, // 40% of 960px
}: ResizableSidebarProps) {
  // Use window width to set max sidebar width dynamically
  const [sidebarWidth, setSidebarWidth] = useState(defaultSidebarWidth);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      let newSidebarWidth = e.clientX - containerRect.left;
      const totalWidth = containerRect.width;
      // Clamp sidebar width
      const minSidebar = minSidebarWidth;
      const maxSidebar = Math.min(maxSidebarWidth, totalWidth * 0.6); // never more than 60%
      newSidebarWidth = Math.max(minSidebar, Math.min(newSidebarWidth, maxSidebar));
      // Ensure main area is at least minMainWidth
      if (totalWidth - newSidebarWidth < minMainWidth) {
        newSidebarWidth = totalWidth - minMainWidth;
      }
      setSidebarWidth(newSidebarWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    if (isResizing) {
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, minSidebarWidth, maxSidebarWidth, minMainWidth]);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  return (
    <div className="relative flex h-full w-full" ref={containerRef}>
      <div style={{ width: `${sidebarWidth}px`, minWidth: `${minSidebarWidth}px`, maxWidth: `${maxSidebarWidth}px` }} className="flex-shrink-0 h-full overflow-hidden">
        {sidebar}
      </div>
      <div
        className="w-1 cursor-col-resize hover:bg-primary/20 active:bg-primary/40 transition-colors relative group h-full flex-shrink-0"
        onMouseDown={handleMouseDown}
        style={{ touchAction: 'none' }}
      >
        <div className="absolute inset-y-0 -left-1 -right-1" />
      </div>
      <div className="flex-1 h-full flex flex-col overflow-hidden" style={{ minWidth: `${minMainWidth}px` }}>
        {main}
      </div>
    </div>
  );
}
