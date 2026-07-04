"use client";

import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Loader2, Save, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { updateMakeAction, addModelAction, updateModelAction, deleteModelAction, type ActionResult } from "@/features/admin/admin-actions";
import { toast } from "@/hooks/use-toast";
import type { Make, VehicleModel } from "@/types";

interface CatalogMakeClientProps {
  make: Make;
  initialModels: VehicleModel[];
}

export function CatalogMakeClient({ make, initialModels }: CatalogMakeClientProps) {
  const [editingModel, setEditingModel] = useState<VehicleModel | null>(null);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-foreground">{make.name}</h1>
            {make.country && (
              <Badge variant="outline" className="font-semibold px-2.5 py-0.5 text-xs text-primary border-primary/20 bg-primary/5">
                {make.country}
              </Badge>
            )}
          </div>
          <p className="text-lg text-muted-foreground">
            Configure vehicle make details and manage individual model entries.
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Make & Model Cards */}
        <div className="space-y-6 lg:col-span-1">
          <EditMakeCard make={make} />
          <AddModelCard makeId={make.id} makeName={make.name} />
        </div>

        {/* Right Side: Models list */}
        <div className="lg:col-span-2">
          <ModelsTableCard makeId={make.id} models={initialModels} onEditModel={setEditingModel} />
        </div>
      </div>

      {/* Edit Model Slide-over */}
      <EditModelSheet model={editingModel} onClose={() => setEditingModel(null)} />
    </div>
  );
}

function EditMakeCard({ make }: { make: Make }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult, fd: FormData) => {
      const res = await updateMakeAction(fd);
      if (res.ok) {
        toast.success("Make updated", `${make.name} details updated successfully.`);
        router.refresh();
      }
      return res;
    },
    { ok: false, error: "" }
  );

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Edit Make Details
        </CardTitle>
        <CardDescription>Update the name and country of origin.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={make.id} />

          <div className="space-y-1.5">
            <Label htmlFor="make-name" className="text-sm font-semibold">Make name</Label>
            <Input id="make-name" name="name" required defaultValue={make.name} className="h-10 rounded-lg" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="make-country" className="text-sm font-semibold">Country of origin</Label>
            <Input id="make-country" name="country" placeholder="e.g. South Africa, Japan, Germany" defaultValue={make.country ?? ""} className="h-10 rounded-lg" />
          </div>

          {!state.ok && state.error && (
            <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
              {state.error}
            </p>
          )}

          <Button type="submit" disabled={pending} className="w-full h-10 rounded-lg font-bold gap-2">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {pending ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function AddModelCard({ makeId, makeName }: { makeId: string; makeName: string }) {
  const router = useRouter();
  const [formKey, setFormKey] = useState(0);
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult, fd: FormData) => {
      const res = await addModelAction(fd);
      if (res.ok) {
        toast.success("Model added", `New model successfully added to ${makeName}.`);
        setFormKey((prev) => prev + 1);
        router.refresh();
      }
      return res;
    },
    { ok: false, error: "" }
  );

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Add Model
        </CardTitle>
        <CardDescription>Add a new model under {makeName}.</CardDescription>
      </CardHeader>
      <CardContent>
        <form key={formKey} action={formAction} className="space-y-4">
          <input type="hidden" name="makeId" value={makeId} />

          <div className="space-y-1.5">
            <Label htmlFor="model-name" className="text-sm font-semibold">Model name</Label>
            <Input id="model-name" name="name" required placeholder="e.g. Hilux, Ranger, Polo" className="h-10 rounded-lg" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="model-bodyStyle" className="text-sm font-semibold">Body style (optional)</Label>
            <Input id="model-bodyStyle" name="bodyStyle" placeholder="e.g. Sedan, SUV, Hatchback" className="h-10 rounded-lg" />
          </div>

          {!state.ok && state.error && (
            <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
              {state.error}
            </p>
          )}

          <Button type="submit" disabled={pending} className="w-full h-10 rounded-lg font-bold gap-2">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {pending ? "Adding..." : "Add model"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

interface ModelsTableCardProps {
  makeId: string;
  models: VehicleModel[];
  onEditModel: (model: VehicleModel) => void;
}

function ModelsTableCard({ makeId, models, onEditModel }: ModelsTableCardProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete model "${name}"?`)) return;
    setDeletingId(id);
    const fd = new FormData();
    fd.append("id", id);
    fd.append("makeId", makeId);

    const res = await deleteModelAction(fd);
    setDeletingId(null);
    if (res.ok) {
      toast.success("Model deleted", `Model "${name}" was deleted successfully.`);
      router.refresh();
    } else {
      toast.error("Deletion failed", res.error);
    }
  };

  return (
    <Card className="border-border shadow-sm overflow-hidden">
      <CardHeader className="border-b border-border bg-muted/10">
        <CardTitle className="text-xl font-bold">Models Catalog</CardTitle>
        <CardDescription>Manage current models in the catalog ({models.length} model(s)).</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {models.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No models found</h3>
            <p className="text-sm">There are no models associated with this make. Use the form on the left to add one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-b border-border">
                  <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground py-4 pl-6">Model Name</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground py-4">Slug</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground py-4">Body Style</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground py-4 text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.map((m) => (
                  <TableRow key={m.id} className="group hover:bg-muted/30 transition-colors border-b border-border last:border-b-0">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-bold text-primary font-mono text-sm shrink-0">
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-foreground text-base">{m.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 font-mono text-muted-foreground text-sm">{m.slug}</TableCell>
                    <TableCell className="py-4">
                      {m.bodyStyle ? (
                        <Badge variant="secondary" className="font-semibold bg-secondary/50 text-secondary-foreground">
                          {m.bodyStyle}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm italic">Standard / None</span>
                      )}
                    </TableCell>
                    <TableCell className="py-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditModel(m)}
                          aria-label={`Edit model ${m.name}`}
                          className="text-muted-foreground hover:text-foreground h-9 w-9 rounded-lg"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={deletingId === m.id}
                          onClick={() => handleDelete(m.id, m.name)}
                          aria-label={`Delete model ${m.name}`}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9 rounded-lg"
                        >
                          {deletingId === m.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface EditModelSheetProps {
  model: VehicleModel | null;
  onClose: () => void;
}

function EditModelSheet({ model, onClose }: EditModelSheetProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult, fd: FormData) => {
      const res = await updateModelAction(fd);
      if (res.ok) {
        toast.success("Model updated", "Model details updated successfully.");
        onClose();
        router.refresh();
      }
      return res;
    },
    { ok: false, error: "" }
  );

  return (
    <Sheet open={!!model} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Edit className="h-5 w-5 text-primary" />
            </div>
            <SheetTitle className="text-xl font-bold">Edit Model</SheetTitle>
          </div>
          <SheetDescription className="text-sm text-muted-foreground">
            Update the model name and body style configuration.
          </SheetDescription>
        </SheetHeader>

        {model && (
          <form action={formAction} className="flex-1 flex flex-col">
            <div className="flex-1 px-6 py-6 space-y-5 overflow-y-auto">
              <input type="hidden" name="id" value={model.id} />
              <input type="hidden" name="makeId" value={model.makeId} />

              <div className="space-y-1.5">
                <Label htmlFor="edit-model-name" className="text-sm font-semibold">
                  Model name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-model-name"
                  name="name"
                  required
                  defaultValue={model.name}
                  className="h-10 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-model-bodyStyle" className="text-sm font-semibold">
                  Body style <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                  id="edit-model-bodyStyle"
                  name="bodyStyle"
                  defaultValue={model.bodyStyle ?? ""}
                  placeholder="e.g. SUV, Hatchback, Sedan"
                  className="h-10 rounded-lg"
                />
              </div>

              {!state.ok && state.error && (
                <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                  {state.error}
                </p>
              )}
            </div>

            <SheetFooter className="px-6 py-4 border-t border-border gap-2 flex-row justify-end">
              <SheetClose asChild>
                <Button type="button" variant="outline" className="rounded-xl" disabled={pending}>
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" className="rounded-xl font-bold gap-2" disabled={pending}>
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {pending ? "Saving..." : "Save Changes"}
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
