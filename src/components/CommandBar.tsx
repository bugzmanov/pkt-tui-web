"use client";

interface CommandBarProps {
  onFilterClick?: () => void;
  onTypeFilterClick?: () => void;
  onSiteFilterClick?: () => void;
  selectedTag?: string | null;
  selectedType?: string | null;
  selectedSite?: string | null;
  onClearFilter?: () => void;
  getDisplayNameForSite: (filterUrl: string) => string;
}

export default function CommandBar({
  onFilterClick,
  onTypeFilterClick,
  onSiteFilterClick,
  selectedTag,
  selectedType,
  selectedSite,
  onClearFilter,
  getDisplayNameForSite,
}: CommandBarProps) {
  const getActiveFilters = () => {
    const filters = [];
    if (selectedTag) filters.push(`#${selectedTag}`);
    if (selectedType) filters.push(selectedType);
    if (selectedSite) filters.push(`@${getDisplayNameForSite(selectedSite)}`);
    return filters.length > 0 ? (
      <span className="filter-link">
        [{filters.join("+")}]{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onClearFilter?.();
          }}
          className="clear-link"
        >
          clear
        </a>
      </span>
    ) : null;
  };

  return (
    <div className="command-bar">
      <div className="command-buttons">
        <span className="command-joke">(ZZ) quit | </span>
        <div className="filter-actions">
          {onFilterClick && (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onFilterClick();
              }}
              className="filter-link"
            >
              t:tags
            </a>
          )}
          {onTypeFilterClick && (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onTypeFilterClick();
              }}
              className="filter-link"
            >
              i:type
            </a>
          )}
          {onSiteFilterClick && (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSiteFilterClick();
              }}
              className="filter-link"
            >
              s:site
            </a>
          )}
        </div>
      </div>
      {(selectedTag || selectedType || selectedSite) && (
        <div className="active-filters">{getActiveFilters()}</div>
      )}
    </div>
  );
}
