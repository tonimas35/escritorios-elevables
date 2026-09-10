"use client";

import { affiliateLink, trackClick } from "@/lib/affiliate";

interface AffiliateButtonProps {
  asin: string;
  text?: string;
  size?: "sm" | "md" | "lg";
}

export function AffiliateButton({
  asin,
  text = "Ver precio actual en Amazon",
  size = "md",
}: AffiliateButtonProps) {
  // El precio real solo es fiable en Amazon: el CTA invita a comprobarlo alli.
  const displayText = text;

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
      <span aria-hidden="true">→</span>
    </a>
  );
}
