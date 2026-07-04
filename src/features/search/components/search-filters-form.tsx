"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SearchFilters } from "@/types";
import { getYearOptions } from "@/types";

export interface SearchFormOption {
  id: string;
  name: string;
  slug: string;
}

const YEARS = getYearOptions();

export function SearchFiltersForm({
  makes,
  models,
  partTypes,
  filters,
}: {
  makes: SearchFormOption[];
  models: SearchFormOption[];
  partTypes: SearchFormOption[];
  filters: SearchFilters;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const ALL = "all";
  function update(next: Partial<SearchFilters>) {
    const merged: SearchFilters = { ...filters, ...next };
    if (next.make !== undefined) {
      merged.model = undefined;
      merged.year = undefined;
    }
    if (next.model !== undefined) merged.year = undefined;

    const params = new URLSearchParams();
    if (merged.q) params.set("q", merged.q);
    if (merged.make) params.set("make", merged.make);
    if (merged.model) params.set("model", merged.model);
    if (merged.year) params.set("year", merged.year);
    if (merged.partTypeId) params.set("partTypeId", merged.partTypeId);
    if (merged.partNumber) params.set("partNumber", merged.partNumber);
    const qs = params.toString();
    startTransition(() => router.push(qs ? `/search?${qs}` : "/search"));
  }

  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="flex flex-col gap-1.5">
          <Label className="text-muted-foreground font-medium">Make</Label>
          <Select value={filters.make ?? ALL} onValueChange={(v) => update({ make: v === ALL ? undefined : v })}>
            <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Any make" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Any make</SelectItem>
              {makes.map((m) => (
                <SelectItem key={m.id} value={m.slug}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-muted-foreground font-medium">Model</Label>
          <Select
            value={filters.model ?? ALL}
            onValueChange={(v) => update({ model: v === ALL ? undefined : v })}
            disabled={!filters.make}
          >
            <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder={filters.make ? "Any model" : "Pick a make first"} /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Any model</SelectItem>
              {models.map((m) => (
                <SelectItem key={m.id} value={m.slug}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-muted-foreground font-medium">Year</Label>
          <Select
            value={filters.year ?? ALL}
            onValueChange={(v) => update({ year: v === ALL ? undefined : v })}
            disabled={!filters.make}
          >
            <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder={filters.make ? "Any year" : "Pick a make first"} /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Any year</SelectItem>
              {YEARS.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-muted-foreground font-medium">Part type</Label>
          <Select value={filters.partTypeId ?? ALL} onValueChange={(v) => update({ partTypeId: v === ALL ? undefined : v })}>
            <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Any category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Any category</SelectItem>
              {partTypes.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            id="q"
            className="w-full h-12 pl-10 pr-4 rounded-xl text-base"
            placeholder="Part number, keyword (e.g. clutch kit, brake pads...)"
            defaultValue={filters.q || filters.partNumber || ""}
            onBlur={(e) => {
              const val = e.target.value;
              // If it looks like a part number, we could set partNumber, else q.
              // For simplicity, just update q.
              update({ q: val || undefined, partNumber: undefined });
            }}
          />
        </div>
        <Button type="button" disabled={pending} onClick={() => update({})} className="h-12 px-8 rounded-xl font-bold gap-2">
          {pending ? "Searching..." : "Search"}
        </Button>
      </div>
    </div>
  );
}