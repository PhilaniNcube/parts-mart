"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toggleVendorStatusAction } from "@/features/admin/admin-actions";
import { toast } from "@/hooks/use-toast";

export function VendorStatusToggle({ vendorId, status }: { vendorId: string; status: "active" | "suspended" }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const suspended = status === "suspended";
  const [current, setCurrent] = useState(status);

  return (
    <div className="flex items-center gap-2">
      <Badge variant={current === "active" ? "success" : "destructive"} className="capitalize">{current}</Badge>
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => {
          const next = current === "active" ? "suspended" : "active";
          const fd = new FormData();
          fd.set("vendorId", vendorId);
          fd.set("next", next);
          startTransition(async () => {
            const res = await toggleVendorStatusAction(fd);
            if (res.ok) {
              setCurrent(next);
              toast.success(
                next === "suspended" ? "Vendor suspended" : "Vendor reactivated",
                next === "suspended" ? "Their listings are now hidden from search." : "They can list parts again.",
              );
              router.refresh();
            } else {
              toast.error("Couldn’t update status", res.error);
            }
          });
        }}
      >
        {suspended ? <><Check className="h-4 w-4" /> Reactivate</> : <><Ban className="h-4 w-4" /> Suspend</>}
      </Button>
    </div>
  );
}