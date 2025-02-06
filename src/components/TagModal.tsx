"use client";

import { useState } from "react";

interface TagCount {
  tag: string;
  count: number;
}

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTag: (tag: string) => void;
  tags: TagCount[];
}

export default function TagModal({
  isOpen,
  onClose,
  onSelectTag,
  tags,
}: TagModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay show">
      <div className="modal-header">
        <span>Select a tag to filter</span>
        <button onClick={onClose} className="close-button">
          ×
        </button>
      </div>
      <div className="tag-list">
        {tags.map((tag) => (
          <div
            key={tag.tag}
            className="tag-count"
            onClick={() => {
              onSelectTag(tag.tag);
              onClose();
            }}
          >
            <span>{tag.tag}</span>
            <span>{tag.count}</span>
          </div>
        ))}
        <span className="cursor"></span>
      </div>
    </div>
  );
}
