import React from "react";

interface WavingFlagProps {
  size?: "sm" | "lg";
}

export const WavingFlag: React.FC<WavingFlagProps> = ({ size = "sm" }) => {
  const width = size === "lg" ? 52 : 28;
  const height = size === "lg" ? 34 : 18;
  const canton = {
    w: size === "lg" ? 20 : 11,
    h: size === "lg" ? 17 : 9,
  };
  const starRadius = size === "lg" ? 1 : 0.55;

  return (
    <span
      className="inline-flex items-center relative overflow-hidden flex-shrink-0"
      style={{ width, height }}
      id="waving-flag-container"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        style={{
          animation: "flagWave 1.8s ease-in-out infinite",
          transformOrigin: "left center",
          display: "block",
        }}
        id="waving-flag-svg"
      >
        {/* Red stripes */}
        {[0, 2, 4, 6, 8, 10, 12].map((d) => (
          <rect
            key={`r${d}`}
            x="0"
            y={d * (height / 13)}
            width={width}
            height={height / 13}
            fill="#B22234"
          />
        ))}
        {/* White stripes */}
        {[1, 3, 5, 7, 9, 11].map((d) => (
          <rect
            key={`w${d}`}
            x="0"
            y={d * (height / 13)}
            width={width}
            height={height / 13}
            fill="#FFFFFF"
          />
        ))}
        {/* Canton (blue field) */}
        <rect x="0" y="0" width={canton.w} height={canton.h} fill="#3C3B6E" />
        {/* Simplified grid of stars */}
        {[canton.w * 0.18, canton.w * 0.36, canton.w * 0.54, canton.w * 0.72, canton.w * 0.9].map(
          (cx) =>
            [canton.h * 0.17, canton.h * 0.5, canton.h * 0.83].map((cy) => (
              <circle
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r={starRadius}
                fill="#FFFFFF"
              />
            ))
        )}
      </svg>
      <style>
        {`
          @keyframes flagWave {
            0%   { transform: skewY(0deg) scaleX(1); }
            25%  { transform: skewY(-2deg) scaleX(0.97); }
            50%  { transform: skewY(0deg) scaleX(1); }
            75%  { transform: skewY(2deg) scaleX(0.97); }
            100% { transform: skewY(0deg) scaleX(1); }
          }
        `}
      </style>
    </span>
  );
};
