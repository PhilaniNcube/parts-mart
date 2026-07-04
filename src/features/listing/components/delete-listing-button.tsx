"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteListingAction } from "@/features/listing/listing-actions";
import { toast } from "@/hooks/use-toast";

export function DeleteListingButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={pending}
      aria-label="Delete listing"
      onClick={() => {
        if (!confirm("Delete this listing? This cannot be undone.")) return;
        const fd = new FormData();
        fd.set("id", id);
        startTransition(async () => {
          const res = await deleteListingAction(fd);
          if (!res.ok) {
            toast.error("Couldn’t delete", res.error);
          } else {
            toast.success("Listing deleted");
            router.refresh();
          }
        });
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}