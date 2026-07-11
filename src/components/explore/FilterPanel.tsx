"use client";

import { useState, useEffect } from "react";
import { categories } from "@/data/categories";

export interface FilterState {
  category: string;
  minPrice: string;
  maxPrice: string;
  location: string;
  rating: string;
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  // Sync when props change (e.g. from URL or clear)
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApply = () => {
    onChange(localFilters);
  };

  const handleClear = () => {
    const cleared = {
      category: "",
      minPrice: "",
      maxPrice: "",
      location: "",
      rating: "",
    };
    setLocalFilters(cleared);
    onChange(cleared);
  };

  const handleCategoryToggle = (categoryId: string) => {
    let currentCats = localFilters.category ? localFilters.category.split(",") : [];
    if (currentCats.includes(categoryId)) {
      currentCats = currentCats.filter((c) => c !== categoryId);
    } else {
      currentCats.push(categoryId);
    }
    handleChange("category", currentCats.join(","));
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-on-surface">Filters</h3>
        <button
          onClick={handleClear}
          className="text-sm text-on-surface/60 hover:text-primary transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="font-semibold text-on-surface text-sm">Categories</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {categories.map((cat) => {
            const isChecked = localFilters.category.split(",").includes(cat.id);
            return (
              <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-primary border-primary text-on-primary' : 'border-outline-variant bg-surface group-hover:border-primary/50'}`}>
                  {isChecked && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-sm text-on-surface/80">{cat.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3 pt-4 border-t border-outline-variant">
        <h4 className="font-semibold text-on-surface text-sm">Price Range</h4>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-xs text-on-surface/60 mb-1 block">Min ($)</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={localFilters.minPrice}
              onChange={(e) => handleChange("minPrice", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <span className="text-on-surface/40 mt-4">-</span>
          <div className="flex-1">
            <label className="text-xs text-on-surface/60 mb-1 block">Max ($)</label>
            <input
              type="number"
              min="0"
              placeholder="Any"
              value={localFilters.maxPrice}
              onChange={(e) => handleChange("maxPrice", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-3 pt-4 border-t border-outline-variant">
        <h4 className="font-semibold text-on-surface text-sm">Minimum Rating</h4>
        <select
          value={localFilters.rating}
          onChange={(e) => handleChange("rating", e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-sm focus:outline-none focus:border-primary"
        >
          <option value="">Any Rating</option>
          <option value="4.5">4.5 & up (Excellent)</option>
          <option value="4.0">4.0 & up (Very Good)</option>
          <option value="3.5">3.5 & up (Good)</option>
          <option value="3.0">3.0 & up (Okay)</option>
        </select>
      </div>

      {/* Location */}
      <div className="space-y-3 pt-4 border-t border-outline-variant">
        <h4 className="font-semibold text-on-surface text-sm">Location</h4>
        <input
          type="text"
          placeholder="e.g. New York, NY"
          value={localFilters.location}
          onChange={(e) => handleChange("location", e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-sm focus:outline-none focus:border-primary"
        />
      </div>

      <button
        onClick={handleApply}
        className="w-full py-2.5 bg-primary text-on-primary rounded-lg font-semibold text-sm mt-4 hover:brightness-110 transition-all"
      >
        Apply Filters
      </button>
    </div>
  );
}
