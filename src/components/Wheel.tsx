import { useEffect, useRef, useState } from "react";
import { getThemePalette } from "@/lib/themeColors";

interface WheelProps {
  entries: string[];
  onSpinComplete?: (winner: string) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
  theme?: string;
  isFullscreen?: boolean;
}

export const Wheel = ({
  entries,
  onSpinComplete,
  isSpinning,
  setIsSpinning,
  theme = "Light",
  isFullscreen = false,
}: WheelProps) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<SVGGElement>(null);

  const colors = getThemePalette(theme);

  const spinWheel = () => {
    if (isSpinning || entries.length === 0) return;

    setIsSpinning(true);
    const segmentAngleLocal = 360 / entries.length;
    const winnerIdx = Math.floor(Math.random() * entries.length);
    const targetNormalized =
      (360 - ((winnerIdx * segmentAngleLocal + segmentAngleLocal / 2) % 360)) %
      360;
    const currentNormalized = ((rotation % 360) + 360) % 360;
    const deltaNormalized = (targetNormalized - currentNormalized + 360) % 360;
    const spins = 5 + Math.floor(Math.random() * 5);
    const totalRotation = rotation + spins * 360 + deltaNormalized;

    setRotation(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const winner = entries[winnerIdx];
      onSpinComplete?.(winner);
    }, 4000);
  };

  const segmentAngle = entries.length > 0 ? 360 / entries.length : 0;

  const calculateTextMetrics = (text: string, segmentIndex: number) => {
    const radius = 240;
    const textRadius = radius * 0.65;

    const segmentAngleRad = (segmentAngle * Math.PI) / 180;
    const arcLength = textRadius * segmentAngleRad;

    const availableWidth = arcLength * 0.7;

    const charWidthRatio = 0.6;

    let idealFontSize = availableWidth / (charWidthRatio * text.length);

    const minFontSize = 6;
    const maxFontSize = 24;
    idealFontSize = Math.max(minFontSize, Math.min(maxFontSize, idealFontSize));

    const maxChars = Math.floor(
      availableWidth / (idealFontSize * charWidthRatio)
    );

    const displayText =
      text.length > maxChars && text.length > 6
        ? text.substring(0, Math.max(4, maxChars - 3)) + "..."
        : text;

    const finalFontSize = Math.min(
      idealFontSize,
      availableWidth / (charWidthRatio * displayText.length)
    );

    return {
      fontSize: Math.max(minFontSize, finalFontSize),
      displayText,
    };
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:gap-5 md:gap-8 w-full h-full">
      <div
        className={`relative w-full aspect-square ${
          isFullscreen
            ? "max-w-[400px] sm:max-w-[500px] md:max-w-[800px] lg:max-w-[900px]"
            : "max-w-[280px] sm:max-w-[350px] md:max-w-[600px] lg:max-w-[700px]"
        }`}
      >
        <div
          className={`absolute left-1/2 -translate-x-1/2 z-10 ${
            isFullscreen
              ? "-top-6 sm:-top-8 md:-top-12 lg:-top-14"
              : "-top-4 sm:-top-5 md:-top-8 lg:-top-10"
          }`}
        >
          <div
            className={`w-0 h-0 border-l-transparent border-r-transparent border-t-foreground ${
              isFullscreen
                ? "border-l-[16px] sm:border-l-[20px] md:border-l-[28px] lg:border-l-[32px] border-r-[16px] sm:border-r-[20px] md:border-r-[28px] lg:border-r-[32px] border-t-[32px] sm:border-t-[40px] md:border-t-[56px] lg:border-t-[64px]"
                : "border-l-[12px] sm:border-l-[14px] md:border-l-[20px] lg:border-l-[25px] border-r-[12px] sm:border-r-[14px] md:border-r-[20px] lg:border-r-[25px] border-t-[24px] sm:border-t-[28px] md:border-t-[40px] lg:border-t-[50px]"
            }`}
          />
        </div>

        <div className="relative w-full h-full">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 500 500"
            className="drop-shadow-xl md:drop-shadow-2xl"
            style={{ filter: "drop-shadow(0 10px 40px rgba(0, 0, 0, 0.3))" }}
          >
            <g
              ref={wheelRef}
              style={{
                transition: isSpinning
                  ? "all 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                  : "none",
                transform: `translate(250px, 250px) rotate(${rotation}deg)`,
                transformOrigin: "0 0",
              }}
            >
              {entries.map((entry, index) => {
                const startAngle =
                  (index * segmentAngle - 90) * (Math.PI / 180);
                const endAngle =
                  ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
                const radius = 240;

                const x1 = radius * Math.cos(startAngle);
                const y1 = radius * Math.sin(startAngle);
                const x2 = radius * Math.cos(endAngle);
                const y2 = radius * Math.sin(endAngle);

                const largeArcFlag = segmentAngle > 180 ? 1 : 0;

                const pathData = [
                  `M 0 0`,
                  `L ${x1} ${y1}`,
                  `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  `Z`,
                ].join(" ");

                const textAngle =
                  startAngle + (segmentAngle / 2) * (Math.PI / 180);
                const textRadius = radius * 0.65;
                const textX = textRadius * Math.cos(textAngle);
                const textY = textRadius * Math.sin(textAngle);
                const textRotation =
                  (index * segmentAngle + segmentAngle / 2) % 360;

                const { fontSize, displayText } = calculateTextMetrics(
                  entry,
                  index
                );

                return (
                  <g key={index}>
                    <path
                      d={pathData}
                      fill={colors[index % colors.length]}
                      stroke="hsl(var(--background))"
                      strokeWidth="2"
                    />
                    <text
                      x={textX}
                      y={textY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textRotation} ${textX} ${textY})`}
                      className="font-medium select-none"
                      fill="#ffffff"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {displayText}
                    </text>
                  </g>
                );
              })}
              <circle
                cx="0"
                cy="0"
                r="40"
                fill="hsl(var(--background))"
                stroke="hsl(var(--border))"
                strokeWidth="2"
              />
            </g>{" "}
            q
          </svg>
        </div>
      </div>

      <button
        onClick={spinWheel}
        disabled={isSpinning || entries.length === 0}
        className={`bg-primary text-primary-foreground font-semibold rounded hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
          isFullscreen
            ? "px-6 sm:px-8 md:px-12 lg:px-16 py-3 sm:py-4 md:py-6 lg:py-8 text-base sm:text-lg md:text-2xl lg:text-3xl"
            : "px-4 sm:px-5 md:px-8 py-2 sm:py-2.5 md:py-4 text-sm sm:text-base md:text-lg"
        }`}
      >
        {isSpinning ? "spinning" : "spin"}
      </button>
    </div>
  );
};
