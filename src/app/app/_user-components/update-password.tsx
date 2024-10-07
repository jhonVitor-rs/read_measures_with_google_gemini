"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpdateUserMutation } from "@/hooks/update-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { forwardRef, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GenSaltPassword, VerifyPassword } from "./actions";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  password: z
    .string({ required_error: "Password is required!" })
    .min(6, "Password must have more than 6 characters!")
    .max(32, "Password must be less than 32 characteres!"),
  newPassword: z
    .string({ required_error: "Password is required!" })
    .min(6, "Password must have more than 6 characters!")
    .max(32, "Password must be less than 32 characteres!"),
});

export const UpdatePassword = forwardRef<
  HTMLDivElement,
  { children: ReactNode; id: string; onClose: () => void }
>(({ children, id, onClose }, ref) => {
  const router = useRouter();
  const mutation = UpdateUserMutation(id);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      newPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const isValidPassword = await VerifyPassword(id, data.password);
      if (isValidPassword) {
        const hashPassword = await GenSaltPassword(data.newPassword);
        await mutation.mutateAsync({ user: { password: hashPassword } });
        toast({
          title: "Sucesso",
          description: "Senha atualizada com sucesso",
        });
        router.refresh();
        onClose();
      } else {
        toast({
          title: "Erro",
          description: "Senha atual incorreta",
          variant: "destructive",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar a senha",
        variant: "destructive",
      });
    }
  });

  const onOpen = () => {
    form.reset({
      password: "",
      newPassword: "",
    });
  };

  return (
    <Dialog onOpenChange={onOpen}>
      <DialogTrigger asChild>
        <div ref={ref}>{children}</div>
      </DialogTrigger>
      <DialogContent className="bg-black shadow shadow-primary">
        <DialogHeader>
          <DialogTitle>Aqui você pode aualizar sua senha</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha atual</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Preencha com sua senha atual
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" type="password" {...field} />
                  </FormControl>
                  <FormDescription>Preencha com a nova senha</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Atualizar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

UpdatePassword.displayName = "UpdatePassword";
