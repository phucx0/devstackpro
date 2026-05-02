"use client";

import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AppModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [dontShow, setDontShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hidden = localStorage.getItem("hide_contribute_modal");
      if (!hidden) setIsOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (dontShow) {
        localStorage.setItem("hide_contribute_modal", "true");
      }
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Overlay with blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative z-10 flex gap-5 items-center bg-[#1a1a1e] border border-white/10 p-7 rounded-2xl shadow-2xl transition-all duration-200 ${
          isClosing
            ? "scale-95 opacity-0 translate-y-2"
            : "scale-100 opacity-100 translate-y-0"
        }`}
        style={{
          animation: isClosing
            ? "none"
            : "modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 w-7 h-7 flex items-center justify-center rounded-full bg-white/8 text-white/50 hover:bg-white/15 hover:text-white transition-all cursor-pointer"
          aria-label="Close"
        >
          <X size={12} />
        </button>

        {/* Content */}
        <div className="flex flex-col gap-3 flex-1 -w-0min">
          {/* Badge */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-emerald-400">
              Open source
            </span>
          </div>

          <h2 className="text-[18px] font-semibold text-white leading-snug">
            Contribute with us!
          </h2>

          <p className="text-[13px] text-white/50 leading-relaxed">
            Help us build and improve this project. Every contribution matters.
          </p>

          {/* CTA row */}
          <div className="flex items-center gap-3 mt-1">
            <Link
              href="https://github.com/phucx0/devstackpro"
              target="_blank"
              className="inline-flex items-center gap-1.5 bg-(--noir-accent) text-[#0a0a0a] px-4 py-2 rounded-[10px] text-[13px] font-semibold hover:opacity-85 transition-opacity"
            >
              {/* GitHub icon */}
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              View on GitHub
            </Link>
          </div>

          {/* Checkbox */}
          <label className="flex items-center gap-2 mt-1 cursor-pointer group">
            <div className="relative w-4 h-4 flex-shrink-0">
              <input
                type="checkbox"
                checked={dontShow}
                onChange={(e) => setDontShow(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded-[4px] border-[1.5px] flex items-center justify-center transition-all ${
                  dontShow
                    ? "bg-emerald-400 border-emerald-400"
                    : "border-white/20 group-hover:border-white/40"
                }`}
              >
                {dontShow && (
                  <svg
                    className="w-2.5 h-2.5 text-black"
                    viewBox="0 0 10 8"
                    fill="none"
                  >
                    <path
                      d="M1 4l3 3 5-6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-[12px] text-white/40 group-hover:text-white/60 transition-colors select-none">
              Don&apos;t show this again
            </span>
          </label>
        </div>

        {/* Mascot */}
        <div className="relative w-40 h-40">
          <Image
            src="/images/mascot.png"
            alt="mascot"
            fill
            className="object-contain p-2"
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.88) translateY(12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
