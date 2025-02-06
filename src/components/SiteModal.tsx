"use client";

interface SiteCount {
  filterUrl: string;
  displayName: string;
  count: number;
}

interface SiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSite: (site: string) => void;
  sites: SiteCount[];
}

export default function SiteModal({
  isOpen,
  onClose,
  onSelectSite,
  sites,
}: SiteModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-overlay show">
        <div className="modal-header">
          <span>Select a site to filter</span>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>
        <div className="tag-list">
          {sites.map((site) => (
            <div
              key={site.filterUrl}
              className="tag-count"
              onClick={() => {
                onSelectSite(site.filterUrl);
                onClose();
              }}
            >
              <span>{site.displayName}</span>
              <span>{site.count}</span>
            </div>
          ))}
          <span className="cursor"></span>
        </div>
      </div>
    </>
  );
}
