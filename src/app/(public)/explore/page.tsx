"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { fetchServices } from "@/lib/api/services";
import { FilterState } from "@/components/explore/FilterPanel";
import { Container } from "@/components/layout/Container";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { SkeletonCard } from "@/components/cards/SkeletonCard";
import { FilterPanel } from "@/components/explore/FilterPanel";
import { Pagination } from "@/components/explore/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";

// Helper hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function ExplorePageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Mobile Filter Sheet State
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Local Search Input State (for debouncing)
  const initialSearch = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchInput, 300);

  // Derive active filters from URL
  const filters: FilterState = {
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    location: searchParams.get("location") || "",
    rating: searchParams.get("rating") || "",
  };

  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Sync search input if URL changes externally
  useEffect(() => {
    setSearchInput(searchParams.get("search") || "");
  }, [searchParams]);

  // Update URL function
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      
      Object.entries(updates).forEach(([key, value]) => {
        if (!value) {
          current.delete(key);
        } else {
          current.set(key, value);
        }
      });
      
      // Reset to page 1 if any filter or search changes, except when explicitly changing page
      if (!updates.hasOwnProperty('page')) {
        current.set('page', '1');
      }

      router.replace(`${pathname}?${current.toString()}`);
    },
    [searchParams, pathname, router]
  );

  // Handle Search Input Debounce
  useEffect(() => {
    if (debouncedSearch !== (searchParams.get("search") || "")) {
      updateParams({ search: debouncedSearch });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  // Query Data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["services", searchParams.toString()],
    queryFn: () =>
      fetchServices({
        search: searchParams.get("search") || undefined,
        category: searchParams.get("category") || undefined,
        minPrice: searchParams.get("minPrice") || undefined,
        maxPrice: searchParams.get("maxPrice") || undefined,
        location: searchParams.get("location") || undefined,
        rating: searchParams.get("rating") || undefined,
        sort: searchParams.get("sort") || undefined,
        page: searchParams.get("page") || "1",
        limit: "12",
      }),
  });

  const handleFilterChange = (newFilters: FilterState) => {
    updateParams(newFilters as unknown as Record<string, string>);
    setIsFilterSheetOpen(false);
  };

  const activeFilterCount = Object.values(filters).filter((v) => v !== "").length;

  return (
    <div className="bg-background min-h-screen py-8">
      <Container>
        {/* Header / Search Area */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface/40" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
              />
            </div>
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterSheetOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface hover:bg-surface-container transition-colors shadow-sm whitespace-nowrap"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline font-medium text-sm">Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-on-primary text-xs font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
          <div className="w-full md:w-48 shrink-0">
            <select
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
              <FilterPanel filters={filters} onChange={handleFilterChange} />
            </div>
          </aside>

          {/* Results Area */}
          <main className="flex-1 flex flex-col min-h-[500px]">
            {isError ? (
              <EmptyState message="Failed to load services. Please try again later." />
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : data?.data.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-outline-variant rounded-2xl bg-surface/50 text-center">
                <Search className="w-12 h-12 text-on-surface/20 mb-4" />
                <h3 className="text-xl font-bold text-on-surface mb-2">No services found</h3>
                <p className="text-on-surface/60 max-w-md">
                  We couldn't find any services matching your current filters. Try broadening your search or clearing some filters.
                </p>
                <button
                  onClick={() => handleFilterChange({ category: "", minPrice: "", maxPrice: "", location: "", rating: "" })}
                  className="mt-6 px-6 py-2 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data?.data.items.map((service) => (
                    <ServiceCard key={service.id} {...service} />
                  ))}
                </div>
                
                {data && data.data.totalPages > 1 && (
                  <Pagination
                    currentPage={data.data.page}
                    totalPages={data.data.totalPages}
                    onPageChange={(p) => updateParams({ page: p.toString() })}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </Container>

      {/* Mobile Filter Bottom Sheet */}
      {isFilterSheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsFilterSheetOpen(false)}
          />
          {/* Sheet */}
          <div className="absolute inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto bg-surface rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="sticky top-0 bg-surface flex justify-center py-3 border-b border-outline-variant/50">
              <div className="w-12 h-1.5 bg-outline-variant rounded-full" />
              <button 
                onClick={() => setIsFilterSheetOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-on-surface/60 hover:bg-surface-container rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterPanel filters={filters} onChange={handleFilterChange} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center min-h-[500px]"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>}>
      <ExplorePageContent />
    </Suspense>
  );
}
