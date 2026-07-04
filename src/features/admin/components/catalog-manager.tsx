"use client";

import { useState, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addMakeAction, addModelAction } from "@/features/admin/admin-actions";
import type { ActionResult } from "@/features/auth/auth-actions";

const ALL = "all";

export interface MakeOption { id: string; name: string; slug: string; }

export function CatalogManager({ makes }: { makes: MakeOption[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <AddMakeCard />
      <AddModelCard makes={makes} />
    </div>
  );
}

const stateOK = { ok: true } as ActionResult;

function AddMakeCard() {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    async (_p, fd) => addMakeAction(fd),
    stateOK,
  );
  return (
    <Card>
      <CardHeader><CardTitle>Add make</CardTitle></CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-3">
          {!state.ok && <ErrorP>{state.error}</ErrorP>}
          <div className="space-y-1.5">
            <Label htmlFor="name">Make name</Label>
            <Input id="name" name="name" required placeholder="e.g. Tata" />
          </div>
          <Button type="submit" disabled={pending} className="w-full">{pending ? "Adding…" : "Add make"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function AddModelCard({ makes }: { makes: MakeOption[] }) {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    async (_p, fd) => addModelAction(fd),
    stateOK,
  );
  const [makeId, setMakeId] = useState("");
  return (
    <Card>
      <CardHeader><CardTitle>Add model</CardTitle></CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-3">
          {!state.ok && <ErrorP>{state.error}</ErrorP>}
          <input type="hidden" name="makeId" value={makeId} />
          <div className="space-y-1.5">
            <Label>Make</Label>
            <Select value={makeId || ALL} onValueChange={(v) => setMakeId(v === ALL ? "" : v)}>
              <SelectTrigger><SelectValue placeholder="Pick make" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>—</SelectItem>
                {makes.map((m) => (<SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="name">Model name</Label>
            <Input id="name" name="name" required placeholder="e.g. Xenon" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bodyStyle">Body style (optional)</Label>
            <Input id="bodyStyle" name="bodyStyle" placeholder="Hatchback / SUV" />
          </div>
          <Button type="submit" disabled={pending} className="w-full">{pending ? "Adding…" : "Add model"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ErrorP({ children }: { children: string }) {
  return <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{children}</p>;
}