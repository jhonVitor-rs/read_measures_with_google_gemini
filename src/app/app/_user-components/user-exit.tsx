"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogOut, Trash, TriangleAlert } from "lucide-react";
import { forwardRef } from "react";
import { DeleteUser, SignOut } from "./actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export const UserExit = forwardRef<HTMLButtonElement, { id: string }>(
  ({ id }, ref) => {
    const router = useRouter();

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
      mutationFn: () => DeleteUser(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user"] });
        router.push("/");
      },
      onError: (error) => {
        toast({
          title: "Erro ao deletar usuário",
          description: error.message,
          variant: "destructive",
        });
      },
    });

    const { mutate: signOut } = useMutation({
      mutationFn: () => SignOut(),
      onSuccess: () => {
        router.push("/");
      },
    });

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button ref={ref} size={"icon"} variant={"destructive"}>
            <TriangleAlert />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deseja mesmo sair/excluir sua conta?</DialogTitle>
            <DialogDescription>
              Ao excluir sua conta, você perderá acesso e todos os dados serão
              apagados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant={"link"} onClick={() => signOut()}>
              Sair da conta <LogOut />
            </Button>
            <Button variant={"destructive"} onClick={() => mutate()}>
              Excluir conta <Trash />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

UserExit.displayName = "UserExit";
