import { Entry as EntryType, Stats } from "@/types";
import { getEntryType } from "@/utils/helpers";

interface EntryProps {
  date?: string;
  entry: EntryType;
  stats?: Stats;
  onTagClick?: (tag: string) => void;
}

export default function Entry({ date, entry, stats, onTagClick }: EntryProps) {
  const type = getEntryType(entry);
  const tags = Object.keys(entry.tags || []);
  const title = entry.given_title || entry.resolved_title || entry.resolved_url;
  const isTopEntry = entry.tags && "top" in entry.tags;

  const Star = () => (isTopEntry ? <span className="star">★</span> : null);

  return (
    <div className="entry">
      <div className="date-cell">{date}</div>
      <div className="content-cell">
        <a
          href={entry.resolved_url}
          className={`title ${isTopEntry ? "top-entry" : ""}`}
          target="_blank"
        >
          <Star />
          {title}
        </a>
        <div className="tag-label">
          [{type}]:{" "}
          <span className="tag">
            {tags.map((tag, index) => (
              <span key={tag}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onTagClick?.(tag);
                  }}
                  className="clickable-tag"
                >
                  {tag}
                </a>
                {index < tags.length - 1 ? ", " : ""}
              </span>
            ))}
          </span>
        </div>
      </div>
      <div className="stats-cell">
        {stats && (
          <>
            {`░▒▓ Text: ${stats.text}  | PDFs: ${stats.pdfs}  | Vids: ${stats.videos} ▓▒░`}
          </>
        )}
      </div>
    </div>
  );
}
