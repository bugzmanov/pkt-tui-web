import { Entry, Stats } from "@/types";

interface SiteInfo {
  displayName: string;
  filterUrl: string;
}

export function formatDate(timestamp: string): string {
  return new Date(parseInt(timestamp) * 1000).toISOString().split("T")[0];
}

export function getEntryType(entry: Entry): string {
  if (
    entry.resolved_url.endsWith(".pdf") ||
    entry.resolved_url.includes("arxiv.org")
  ) {
    return "pdf";
  }
  if (
    entry.resolved_url.includes("youtube.com") ||
    entry.resolved_url.includes("vimeo.com")
  ) {
    return "video";
  }
  return "text";
}

export function getStats(entries: Entry[]): Stats {
  return entries.reduce(
    (acc, entry) => {
      const type = getEntryType(entry);
      switch (type) {
        case "pdf":
          acc.pdfs++;
          break;
        case "video":
          acc.videos++;
          break;
        case "text":
          acc.text++;
          break;
      }
      return acc;
    },
    { text: 0, pdfs: 0, videos: 0 },
  );
}

export function getAllTags(entries: Entry[]): Record<string, number> {
  return entries.reduce(
    (acc, entry) => {
      if (entry.tags) {
        Object.keys(entry.tags).forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
      }
      return acc;
    },
    {} as Record<string, number>,
  );
}

export function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export function getSiteInfo(entry: Entry): SiteInfo {
  const domain = getDomain(entry.resolved_url);

  // Handle YouTube authors
  if (domain === "youtube.com" && entry.authors) {
    const author = Object.values(entry.authors)[0];
    if (author?.url && author?.name) {
      return {
        displayName: `YT:${author.name}`,
        filterUrl: author.url,
      };
    }
  }

  // Handle Medium (keeping the original format)
  if (domain === "medium.com" && entry.authors) {
    const author = Object.values(entry.authors)[0];
    if (author?.url) {
      try {
        const authorUrl = new URL(author.url);
        return {
          displayName: `${domain}/${authorUrl.pathname.split("/")[1]}`,
          filterUrl: author.url,
        };
      } catch {
        // Fallback to domain if URL parsing fails
      }
    }
  }

  // Default case for other sites
  return {
    displayName: domain,
    filterUrl: domain,
  };
}

export function getAllSites(
  entries: Entry[],
): Record<string, { count: number; displayName: string }> {
  const siteCounts: Record<string, { count: number; displayName: string }> = {};

  entries.forEach((entry) => {
    const { displayName, filterUrl } = getSiteInfo(entry);

    if (!siteCounts[filterUrl]) {
      siteCounts[filterUrl] = {
        count: 0,
        displayName,
      };
    }
    siteCounts[filterUrl].count += 1;
  });

  return siteCounts;
}
