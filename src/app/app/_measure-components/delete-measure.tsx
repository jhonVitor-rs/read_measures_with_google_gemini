"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { forwardRef, ReactNode } from "react";
import { DeleteMeasure as DeleteMeasureMutation } from "@/hooks/delete-measure";

export const DeleteMeasure = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    id: string;
    closeModal: () => void;
  }
>(({ children, id, closeModal }, ref) => {
  const router = useRouter();
  const mutation = DeleteMeasureMutation({ id, onClose: closeModal });

  const onDelete = async () => {
    mutation.mutate();
    router.refresh();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div ref={ref}>{children}</div>
      </DialogTrigger>
      <DialogContent className="bg-black shadow shadow-primary">
        <DialogHeader>
          <DialogTitle>Delete</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja deletar esta medição?
          </DialogDescription>
        </DialogHeader>
        <Button variant={"destructive"} onClick={onDelete}>
          Sim, tenho certza
        </Button>
      </DialogContent>
    </Dialog>
  );
});

DeleteMeasure.displayName = "DeleteMeasure";
