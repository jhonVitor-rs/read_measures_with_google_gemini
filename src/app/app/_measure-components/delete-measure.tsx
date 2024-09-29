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
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { forwardRef, ReactNode } from "react";

export const DeleteMeasure = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    id: string;
    closeModal: () => void;
  }
>(({ children, id, closeModal }, ref) => {
  const router = useRouter();

  const onDelete = async () => {
    const response = await fetch(`/api/measures/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const responseData = await response.json();
    if (!response.ok) {
      toast({
        title: responseData.error_code,
        description: responseData.error_description,
        variant: "default",
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Medição deletada com sucesso",
      });
      closeModal();
      router.refresh();
    }
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
