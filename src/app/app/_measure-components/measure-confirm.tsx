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
import { UpdateMeasure } from "@/hooks/update-measure";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { forwardRef, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  value: z.coerce
    .number({
      required_error: "O valor é obrigatório",
      invalid_type_error: "O valor deve ser um número válido",
    })
    .min(0, "O valor deve ser maior ou igual a 0"), // Exemplo de validação adicional
});

export const MeasureConfirm = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    id: string;
    value: number;
    hasConfirmed: boolean;
    closeModal: () => void;
  }
>(({ children, id, value, hasConfirmed, closeModal }, ref) => {
  const router = useRouter();
  const mutation = UpdateMeasure({ id, onClose: closeModal });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    mutation.mutate({ confirmed_value: data.value });
    router.refresh();
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div ref={ref}>{children}</div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajustar medição</DialogTitle>
          <DialogDescription>
            Aqui você pode ajustar o valor da sua medição caso esteja errado
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da medição</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      {...field}
                      disabled={hasConfirmed}
                    />
                  </FormControl>
                  <FormDescription>
                    Preencha com o valor correto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={hasConfirmed}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

MeasureConfirm.displayName = "MeasureConfirm";
