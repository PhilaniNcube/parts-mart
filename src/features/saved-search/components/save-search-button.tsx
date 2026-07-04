"use client";

import { useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";
import { BellPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSavedSearchAction } from "@/features/saved-search/saved-search-actions";
import { toast } from "@/hooks/use-toast";
import type { SearchFilters } from "@/types";

export function SaveSearchButton() {
  const sp = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function save() {
    const name = prompt("Name this alert (e.g. Toyota Hilux brake pads)", "My search");
    if (!name) return;
    const filters: SearchFilters = {};
    const q = sp.get("q");
    const make = sp.get("make");
    const model = sp.get("model");
    const year = sp.get("year");
    const partTypeId = sp.get("partTypeId");
    const partNumber = sp.get("partNumber");
    if (q) filters.q = q;
    if (make) filters.make = make;
    if (model) filters.model = model;
    if (year) filters.year = year;
    if (partTypeId) filters.partTypeId = partTypeId;
    if (partNumber) filters.partNumber = partNumber;
    const fd = new FormData();
    fd.set("name", name);
    fd.set("filters", JSON.stringify(filters));
    startTransition(async () => {
      const res = await createSavedSearchAction(fd);
      if (res.ok) {
        setSaved(true);
        toast.success("Alert saved", "You’ll get an email when matching parts appear.");
      } else {
        toast.error("Couldn’t save alert", res.error);
      }
    });
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={save} disabled={pending || saved} className="gap-2">
      <BellPlus className="h-4 w-4" />
      {saved ? "Alert saved" : pending ? "Saving…" : "Save this search as alert"}
    </Button>
  );
}