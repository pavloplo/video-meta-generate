"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface AccordionProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  isLoading?: boolean;
  hasError?: boolean;
  hasContent?: boolean;
}

export const Accordion = ({
  title,
  icon,
  children,
  defaultOpen = false,
  className,
  isLoading = false,
  hasError = false,
  hasContent = false,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(defaultOpen ? undefined : 0);

  useEffect(() => {
    if (!contentRef.current) return;
    
    const resizeObserver = new ResizeObserver(() => {
      if (contentRef.current && isOpen) {
        setHeight(contentRef.current.scrollHeight);
      }
    });

    resizeObserver.observe(contentRef.current);
    return () => resizeObserver.disconnect();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn("border border-slate-200 rounded-lg overflow-hidden", className)}>
      <button
        onClick={toggleAccordion}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-base">{icon}</span>}
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {isLoading && (
            <span className="ml-2 inline-flex items-center justify-center">
              <svg
                className="animate-spin h-4 w-4 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </span>
          )}
          {hasError && !isLoading && (
            <span className="ml-2 inline-flex items-center justify-center">
              <svg
                className="h-4 w-4 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="sr-only">Error</span>
            </span>
          )}
        </div>
        <svg
          className={cn(
            "w-5 h-5 text-slate-600 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        style={{
          height: height,
          transition: "height 200ms ease-in-out",
        }}
        className="overflow-hidden"
      >
        <div ref={contentRef} className="p-4 pt-0 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};

