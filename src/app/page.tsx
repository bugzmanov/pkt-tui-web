"use client";

import { useEffect, useState } from "react";
import Entry from "@/components/Entry";
import TagModal from "@/components/TagModal";
import CommandBar from "@/components/CommandBar";
import {
  formatDate,
  getAllSites,
  getAllTags,
  getEntryType,
  getSiteInfo,
  getStats,
} from "@/utils/helpers";
import data from "@/data.json";
import { Entry as EntryType } from "@/types";
import TypeModal from "@/components/TypeModal";
import SiteModal from "@/components/SiteModal";
import path from "path";
import deltaContent from "@/delta.jsonl";
// const fs = require("fs");

function getData(): EntryType[] {
  // Load base data
  // Load delta data
  // const deltaPath = path.join(process.cwd(), "src/delta.json");
  // const deltaContent = fs.readFileSync(deltaPath, "utf8");

  const deltaEntries = deltaContent
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line));

  // Separate deletion records from actual delta entries
  const deletionIds = new Set(
    deltaEntries
      .filter((entry) => entry.status === "2")
      .map((entry) => entry.item_id),
  );

  const baseEntries = (Object.values(data.list) as EntryType[]).filter(
    (entry) => !deletionIds.has(entry.item_id),
  ) as EntryType[];
  //
  // Combine and sort all entries
  const newDeltaEntries = deltaEntries.filter(
    (entry) => entry.status !== "2",
  ) as EntryType[];

  // Merge and sort all entries
  const entriesMap = new Map();

  [...baseEntries, ...newDeltaEntries].forEach((entry) => {
    const existingEntry = entriesMap.get(entry.item_id);
    if (
      !existingEntry ||
      Number(entry.time_added) > Number(existingEntry.time_added)
    ) {
      entriesMap.set(entry.item_id, entry);
    }
  });

  // Convert map back to array and sort
  return Array.from(entriesMap.values()).sort(
    (a, b) => Number(b.time_added) - Number(a.time_added),
  );
}

export default function Home() {
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const entries = getData(); /*(Object.values(data.list) as EntryType[]).sort(
    (a, b) => Number(b.time_added) - Number(a.time_added),
  );*/

  // Filter entries by selected tag, type and site
  const filteredEntries = entries.filter((entry) => {
    let matchesTag = true;
    let matchesType = true;
    let matchesSite = true;

    if (selectedTag) {
      matchesTag = entry.tags?.[selectedTag] !== undefined;
    }

    if (selectedType) {
      const entryType = getEntryType(entry);
      matchesType = entryType === selectedType;
    }

    if (selectedSite) {
      const { filterUrl } = getSiteInfo(entry);
      matchesSite = filterUrl === selectedSite;
    }

    return matchesTag && matchesType && matchesSite;
  });
  //
  // Group entries by date
  const entriesByDate = filteredEntries.reduce(
    (acc, entry) => {
      const date = formatDate(entry.time_added);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(entry);
      return acc;
    },
    {} as Record<string, EntryType[]>,
  );

  // Get tag counts
  const tagCounts = getAllTags(entries);
  const sortedTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);

  const siteCounts = getAllSites(entries);
  const sortedSites = Object.entries(siteCounts)
    .map(([filterUrl, { count, displayName }]) => ({
      filterUrl,
      displayName,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "t") {
        e.preventDefault();
        setIsTagModalOpen(true);
      } else if (e.key.toLowerCase() === "i") {
        e.preventDefault();
        setIsTypeModalOpen(true);
      } else if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        setIsSiteModalOpen(true);
      } else if (e.key.toLowerCase() === "c") {
        e.preventDefault();
        clearFilters();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const clearFilters = () => {
    setSelectedTag(null);
    setSelectedType(null);
    setSelectedSite(null);
  };

  const getDisplayNameForFilter = (filterUrl: string) => {
    return (
      Object.entries(siteCounts).find(([url]) => url === filterUrl)?.[1]
        .displayName || filterUrl
    );
  };

  return (
    <>
      <div className="container">
        {Object.entries(entriesByDate).map(([date, dateEntries]) => {
          const stats = getStats(dateEntries);

          return (
            <div key={date} className="entry-group">
              {dateEntries.map((entry, index) => (
                <Entry
                  key={entry.item_id}
                  entry={entry}
                  date={index === 0 ? date : undefined}
                  stats={
                    index === 0 && dateEntries.length > 1 ? stats : undefined
                  }
                  onTagClick={(tag) => setSelectedTag(tag)}
                />
              ))}
            </div>
          );
        })}
      </div>

      <TagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onSelectTag={setSelectedTag}
        tags={sortedTags}
      />

      <TypeModal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        onSelectType={setSelectedType}
      />

      <SiteModal
        isOpen={isSiteModalOpen}
        onClose={() => setIsSiteModalOpen(false)}
        onSelectSite={setSelectedSite}
        sites={sortedSites}
      />

      <CommandBar
        onFilterClick={() => setIsTagModalOpen(true)}
        onTypeFilterClick={() => setIsTypeModalOpen(true)}
        onSiteFilterClick={() => setIsSiteModalOpen(true)}
        selectedTag={selectedTag}
        selectedType={selectedType}
        selectedSite={selectedSite}
        onClearFilter={clearFilters}
        getDisplayNameForSite={getDisplayNameForFilter}
      />
    </>
  );
}
