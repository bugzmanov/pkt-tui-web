"use client";

const DOCUMENT_TYPES = [
  { id: "text", label: "1 - Text" },
  { id: "video", label: "2 - Videos" },
  { id: "pdf", label: "3 - PDFs" },
];

interface TypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: string) => void;
}

export default function TypeModal({
  isOpen,
  onClose,
  onSelectType,
}: TypeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay show">
      <div className="modal-header">
        <span>Select document type to filter</span>
        <button onClick={onClose} className="close-button">
          ×
        </button>
      </div>
      <div className="tag-list">
        {DOCUMENT_TYPES.map((type) => (
          <div
            key={type.id}
            className="tag-count"
            onClick={() => {
              onSelectType(type.id);
              onClose();
            }}
          >
            <span>{type.label}</span>
          </div>
        ))}
        <span className="cursor"></span>
      </div>
    </div>
  );
}
