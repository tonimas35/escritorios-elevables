const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG || "escritoriosel-21";

export function affiliateLink(asin: string): string {
  return `https://www.amazon.es/dp/${asin}?tag=${AMAZON_TAG}&linkCode=ogi&th=1&psc=1`;
}

export function trackClick(asin: string) {
  if (typeof window !== "undefined") {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag === "function") {
      w.gtag("event", "affiliate_click", {
        event_category: "affiliate",
        event_label: asin,
      });
    }
  }
}
