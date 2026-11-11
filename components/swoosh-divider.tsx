import { cn } from "@/lib/utils";

interface SwooshDividerProps {
  className?: string;
  variant?: "navy" | "gold" | "red";
}

export function SwooshDivider({ className = "", variant = "navy" }: SwooshDividerProps) {
  const colorMap = {
    navy: "text-[#1F2E8C] dark:text-[#3B4CCA]",
    gold: "text-[#D4AF37]",
    red: "text-[#E4202B]",
  };

  return (
    <div className={cn("w-full overflow-hidden py-1", className)}>
      <svg
        viewBox="0 0 1200 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-6 md:h-8"
        preserveAspectRatio="none"
      >
        {/* First curved swoosh */}
        <path
          d="M0,18 C300,32 500,4 750,22 C950,36 1100,10 1200,18"
          stroke="currentColor"
          strokeWidth="2.5"
          className={colorMap[variant]}
          strokeLinecap="round"
          fill="none"
        />
        {/* Second companion swoosh */}
        <path
          d="M0,26 C280,10 520,34 780,12 C960,0 1120,24 1200,26"
          stroke="#E4202B"
          strokeWidth="1.5"
          strokeOpacity="0.7"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

export default SwooshDivider;
