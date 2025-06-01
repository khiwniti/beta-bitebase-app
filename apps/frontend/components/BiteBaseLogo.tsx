import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface BiteBaseLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
  variant?: "default" | "white" | "dark" | "gradient";
  clickable?: boolean;
  href?: string;
  animated?: boolean;
}

const sizeMap = {
  xs: { icon: 16, text: "text-sm" },
  sm: { icon: 20, text: "text-base" },
  md: { icon: 24, text: "text-lg" },
  lg: { icon: 32, text: "text-xl" },
  xl: { icon: 40, text: "text-2xl" },
};

export default function BiteBaseLogo({
  size = "md",
  className = "",
  showText = true,
  variant = "default",
  clickable = true,
  href = "/",
  animated = false,
}: BiteBaseLogoProps) {
  const [imageError, setImageError] = useState(false);

  // Ensure size is valid, fallback to 'md' if not
  const validSize = size && sizeMap[size] ? size : "md";
  const { icon: iconSize, text: textSize } = sizeMap[validSize];

  const getTextColor = () => {
    switch (variant) {
      case "white":
        return "text-white";
      case "dark":
        return "text-gray-900";
      case "gradient":
        return "bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent";
      default:
        return "text-gray-900";
    }
  };

  const getSubtextColor = () => {
    switch (variant) {
      case "white":
        return "text-gray-200";
      case "dark":
        return "text-gray-600";
      case "gradient":
        return "bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent";
      default:
        return "text-gray-500";
    }
  };

  const logoContent = (
    <div
      className={`flex items-center ${animated ? "transition-all duration-300 hover:scale-105" : ""} ${className}`}
    >
      <div className="relative flex-shrink-0">
        {!imageError ? (
          <Image
            src="/bitebase-logo-03.png"
            alt="BiteBase Intelligence Logo"
            width={iconSize}
            height={iconSize}
            className={`object-contain ${animated ? "transition-transform duration-300 hover:rotate-12" : ""}`}
            priority
            onError={() => setImageError(true)}
          />
        ) : (
          // Fallback SVG logo if image fails to load
          <div
            className={`flex items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-blue-600 text-white font-bold ${animated ? "transition-transform duration-300 hover:rotate-12" : ""}`}
            style={{
              width: `${iconSize}px`,
              height: `${iconSize}px`,
              fontSize: `${iconSize * 0.4}px`,
            }}
          >
            B
          </div>
        )}
      </div>

      {showText && (
        <div className="ml-2 flex items-center">
          <span className={`font-bold ${textSize} ${getTextColor()}`}>
            BiteBase
          </span>
          <span className={`ml-1 text-sm ${getSubtextColor()}`}>
            Intelligence
          </span>
        </div>
      )}
    </div>
  );

  if (clickable && href) {
    return (
      <div
        className={`inline-flex ${animated ? "transition-opacity duration-300 hover:opacity-80" : ""}`}
      >
        <Link href={href} aria-label="BiteBase Intelligence - Home">
          {logoContent}
        </Link>
      </div>
    );
  }

  return logoContent;
}

// Icon-only version for smaller spaces
export function BiteBaseIcon({
  size = "md",
  className = "",
  variant = "default",
  animated = false,
}: {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "default" | "white" | "dark" | "gradient";
  animated?: boolean;
}) {
  const [imageError, setImageError] = useState(false);

  // Ensure size is valid, fallback to 'md' if not
  const validSize = size && sizeMap[size] ? size : "md";
  const iconSize = sizeMap[validSize].icon;

  return (
    <div className={`relative ${className}`}>
      {!imageError ? (
        <Image
          src="/bitebase-logo-03.png"
          alt="BiteBase Intelligence"
          width={iconSize}
          height={iconSize}
          className={`object-contain ${animated ? "transition-transform duration-300 hover:scale-110 hover:rotate-12" : ""}`}
          priority
          onError={() => setImageError(true)}
        />
      ) : (
        // Fallback SVG icon
        <div
          className={`flex items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-blue-600 text-white font-bold ${animated ? "transition-transform duration-300 hover:scale-110 hover:rotate-12" : ""}`}
          style={{
            width: `${iconSize}px`,
            height: `${iconSize}px`,
            fontSize: `${iconSize * 0.4}px`,
          }}
        >
          B
        </div>
      )}
    </div>
  );
}

// Animated loading version
export function BiteBaseLogoLoading({
  size = "md",
  className = "",
}: {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  // Ensure size is valid, fallback to 'md' if not
  const validSize = size && sizeMap[size] ? size : "md";
  const iconSize = sizeMap[validSize].icon;

  return (
    <div className={`flex items-center ${className}`}>
      <div
        className="flex items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-blue-600 text-white font-bold animate-pulse"
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          fontSize: `${iconSize * 0.4}px`,
        }}
      >
        B
      </div>
      <div className="ml-2 flex items-center">
        <div className="h-4 bg-gray-300 rounded animate-pulse w-20"></div>
        <div className="ml-1 h-3 bg-gray-200 rounded animate-pulse w-16"></div>
      </div>
    </div>
  );
}

// Compact version for mobile/small screens
export function BiteBaseLogoCompact({
  className = "",
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "white" | "dark" | "gradient";
}) {
  return (
    <BiteBaseLogo
      size="sm"
      showText={false}
      variant={variant}
      className={className}
      animated={true}
    />
  );
}
