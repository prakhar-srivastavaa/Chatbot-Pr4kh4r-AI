import { useState, useRef, useEffect } from "react";

interface ResizableSidebarProps {
  children: React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
}

export function ResizableSidebar({
  children,
  minWidth = 200,
  maxWidth = 500,
  defaultWidth = 256,
}: ResizableSidebarProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
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
  }, [isResizing, minWidth, maxWidth]);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  return (
    <div className="relative flex" ref={sidebarRef}>
      <div style={{ width: `${width}px` }} className="flex-shrink-0">
        {children}
      </div>
      <div
        className="w-1 cursor-col-resize hover:bg-primary/20 active:bg-primary/40 transition-colors relative group"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-y-0 -left-1 -right-1" />
      </div>
    </div>
  );
}
