"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface HPLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  textColor?: "white" | "navy" | "ink";
}

export function HPLogo({
  className,
  size = "md",
  showText = false,
  textColor = "white",
}: HPLogoProps) {
  const [imageError, setImageError] = useState(false);

  const dimensionMap = {
    sm: { box: 36, font: "text-xs", circle: "w-9 h-9" },
    md: { box: 48, font: "text-sm", circle: "w-12 h-12" },
    lg: { box: 64, font: "text-base", circle: "w-16 h-16" },
    xl: { box: 80, font: "text-lg", circle: "w-20 h-20" },
  };

  const { box, font, circle } = dimensionMap[size];

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      {!imageError ? (
        <div className={cn("relative flex-shrink-0 flex items-center justify-center", circle)}>
          <Image
            src="/hp-logo.png"
            alt="HPCL Logo"
            width={box}
            height={box}
            className="object-contain"
            onError={() => setImageError(true)}
            unoptimized
            priority
          />
        </div>
      ) : (
        <div
          className={cn(
            "relative rounded-full bg-white flex items-center justify-center p-1 shadow-sm flex-shrink-0 border-2 border-[#1F2E8C]",
            circle
          )}
          style={{ width: box, height: box }}
        >
          {/* High-fidelity SVG HPCL Emblem recreation */}
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="46" stroke="#1F2E8C" strokeWidth="5" fill="#FFFFFF" />
            <path
              d="M 20 32 A 40 40 0 0 1 80 32"
              stroke="#E4202B"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <text
              x="50"
              y="56"
              textAnchor="middle"
              fill="#E4202B"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontWeight="900"
              fontSize="34"
              letterSpacing="-1"
            >
              HP
            </text>
            <path
              d="M 28 66 C 36 62, 42 70, 48 76 C 42 77, 34 76, 28 66 Z"
              fill="#1F2E8C"
            />
            <path
              d="M 72 66 C 64 62, 58 70, 52 76 C 58 77, 66 76, 72 66 Z"
              fill="#1F2E8C"
            />
            <circle cx="50" cy="74" r="2.5" fill="#E4202B" />
          </svg>
        </div>
      )}

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-[#E4202B]">
            हिन्दुस्तान पेट्रोलियम
          </span>
          <span
            className={cn(
              "font-bold tracking-tight font-[family-name:var(--font-poppins)]",
              font,
              textColor === "white"
                ? "text-white"
                : textColor === "navy"
                ? "text-[#1F2E8C]"
                : "text-[#0F1535]"
            )}
          >
            Hindustan Petroleum
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            19th All India Sports Meet
          </span>
        </div>
      )}
    </div>
  );
}

export default HPLogo;
