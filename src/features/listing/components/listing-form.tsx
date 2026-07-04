"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActionResult } from "@/features/auth/auth-actions";
import { toast } from "@/hooks/use-toast";
import { getYearOptions } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const ALL = "all";
const EMPTY_CONDITION = "new";
const YEARS = getYearOptions();

export interface PartTypeOption { id: string; name: string; slug: string; }
export interface MakeOption { id: string; name: string; slug: string; }
export interface NestedOption { id: string; name: string; slug: string; }
export interface VendorOption { id: string; name: string; businessName: string | null; }

export interface ListingFormInitial {
  id?: string;
  vendorId?: string;
  partTypeId?: string;
  makeId?: string;
  modelId?: string;
  years?: number[];
  title?: string;
  description?: string;
  partNumber?: string;
  sku?: string;
  condition?: "new" | "remanufactured" | "used" | "refurbished";
  priceRands?: string;
  stock?: string;
  imageUrl?: string;
}

export function ListingForm({
  action,
  partTypes,
  makes,
  vendors,
  initial,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  partTypes: PartTypeOption[];
  makes: MakeOption[];
  vendors?: VendorOption[];
  initial?: ListingFormInitial;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    async (_p, fd) => action(fd),
    { ok: true },
  );
  const isEdit = !!initial?.id;

  useEffect(() => {
    if (state.ok && state.redirectTo) {
      toast.success(isEdit ? "Listing updated" : "Listing created", isEdit ? "Your changes have been saved." : "Your part is now live in search.");
      router.push(state.redirectTo);
    } else if (!state.ok) {
      toast.error("Couldn’t save listing", state.error);
    }
  }, [state, router, isEdit]);

  const [makeId, setMakeId] = useState<string>(initial?.makeId ?? "");
  const [modelId, setModelId] = useState<string>(initial?.modelId ?? "");
  const [selectedYears, setSelectedYears] = useState<number[]>(initial?.years ?? []);
  const [models, setModels] = useState<NestedOption[]>([]);
  const isAdmin = !!vendors && vendors.length > 0;

  useEffect(() => {
    if (!initial?.makeId) return;
    void fetch(`/api/catalog/models?makeId=${initial.makeId}`)
      .then((r) => r.json())
      .then((m: NestedOption[]) => setModels(m));
  }, [initial?.makeId]);

  async function onMakeChange(v: string) {
    setMakeId(v);
    setModelId("");
    setSelectedYears([]);
    if (v) {
      const m = await fetch(`/api/catalog/models?makeId=${v}`).then((r) => r.json());
      setModels(m as NestedOption[]);
    } else {
      setModels([]);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initial?.id ? "Edit listing" : "New listing"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {!state.ok && state.error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>
          )}

          {initial?.id && <input type="hidden" name="id" value={initial.id} />}

          {isAdmin && vendors && (
            <div className="space-y-1.5">
              <Label htmlFor="vendorId">Vendor (admin only)</Label>
              <input type="hidden" name="vendorId" value={initial?.vendorId ?? ""} />
              <Select
                value={initial?.vendorId ?? ""}
                onValueChange={(v) => {
                  const el = document.getElementById("vendorId") as HTMLInputElement | null;
                  if (el) el.value = v;
                }}
              >
                <SelectTrigger id="vendorId"><SelectValue placeholder="Select vendor" /></SelectTrigger>
                <SelectContent>
                  {vendors.map((v) => (
                    <SelectItem key={v.id} value={v.id}>{v.businessName ?? v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={initial?.title} required placeholder="Front brake pad set — Toyota Hilux 2018" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="partNumber">Part number</Label>
              <Input id="partNumber" name="partNumber" defaultValue={initial?.partNumber} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sku">SKU (your internal code)</Label>
              <Input id="sku" name="sku" defaultValue={initial?.sku} required />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="partTypeId">Part type</Label>
              <Select name="partTypeId" defaultValue={initial?.partTypeId} required>
                <SelectTrigger id="partTypeId"><SelectValue placeholder="Pick part type" /></SelectTrigger>
                <SelectContent>
                  {partTypes.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="condition">Condition</Label>
              <Select name="condition" defaultValue={initial?.condition ?? EMPTY_CONDITION} required>
                <SelectTrigger id="condition"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="remanufactured">Remanufactured</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="refurbished">Refurbished</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <fieldset className="space-y-2 rounded-md border p-3">
            <legend className="px-1 text-sm font-medium">Fits vehicle (optional — leave blank for universal fit)</legend>
            <input type="hidden" name="makeId" value={makeId} />
            <input type="hidden" name="modelId" value={modelId} />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="makeSelect">Make</Label>
                <Select value={makeId || ALL} onValueChange={onMakeChange}>
                  <SelectTrigger id="makeSelect"><SelectValue placeholder="Any make" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Any make (universal)</SelectItem>
                    {makes.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="modelSelect">Model</Label>
                <Select value={modelId || ALL} onValueChange={(v) => setModelId(v === ALL ? "" : v)} disabled={!makeId}>
                  <SelectTrigger id="modelSelect"><SelectValue placeholder="Any model" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Any model</SelectItem>
                    {models.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className={cn("space-y-1.5 col-span-full", !makeId && "opacity-50")}>
                <Label>Fits model years</Label>
                <div className="h-40 overflow-y-auto rounded-md border border-input p-3 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 bg-background">
                  {YEARS.map((y) => {
                    const id = `year-${y}`;
                    return (
                      <label key={y} htmlFor={id} className={cn("flex items-center gap-2 text-sm font-normal p-1 rounded transition-colors select-none", makeId ? "cursor-pointer hover:bg-muted" : "cursor-not-allowed")}>
                        <Checkbox
                          id={id}
                          name="years"
                          value={y}
                          checked={selectedYears.includes(y)}
                          disabled={!makeId}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedYears([...selectedYears, y].sort((a, b) => b - a));
                            } else {
                              setSelectedYears(selectedYears.filter((x) => x !== y));
                            }
                          }}
                        />
                        {y}
                      </label>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">Select all years that this part fits. Leave empty if it fits all/any years.</p>
              </div>
            </div>
          </fieldset>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={initial?.description} rows={3} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="priceRands">Price (ZAR)</Label>
              <Input id="priceRands" name="priceRands" type="number" min="0" step="0.01" defaultValue={initial?.priceRands} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" name="stock" type="number" min="0" step="1" defaultValue={initial?.stock ?? "0"} required />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input id="imageUrl" name="imageUrl" type="url" defaultValue={initial?.imageUrl} placeholder="https://…" />
          </div>

          <div className="flex justify-end gap-2">
            <Button asChild variant="ghost">
              <a href={initial?.id ? "/vendor/listings" : "/vendor"}>Cancel</a>
            </Button>
            <Button type="submit" disabled={pending}>{pending ? "Saving…" : initial?.id ? "Save changes" : "Create listing"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}