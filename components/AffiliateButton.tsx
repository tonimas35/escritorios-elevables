"use client";

import { affiliateLink, trackClick } from "@/lib/affiliate";

interface AffiliateButtonProps {
  asin: string;
  text?: string;
  size?: "sm" | "md" | "lg";
  showPrice?: number;
}

export function AffiliateButton({
  asin,
  text = "Ver en Amazon",
  size = "md",
  showPrice,
}: AffiliateButtonProps) {
  const displayText = showPrice ? `${showPrice} € — Ver en Amazon` : text;

  const sizeClass =
    size === "sm"
      ? "px-4 py-2 text-xs"
      : size === "lg"
      ? "w-full py-3.5 text-sm"
      : "px-6 py-3 text-xs";

  return (
    <a
      href={affiliateLink(asin)}
      onClick={() => trackClick(asin)}
      target="_blank"
      rel="nofollow sponsored noopener"
      className={`btn-primary ${sizeClass}`}
    >
      {displayText}
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
      </svg>
    </a>
  );
}
