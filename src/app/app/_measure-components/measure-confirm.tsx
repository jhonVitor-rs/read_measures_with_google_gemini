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
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ReactNode, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  value: z.coerce
    .number({
      required_error: "O valor é obrigatório",
      invalid_type_error: "O valor deve ser um número válido",
    })
    .min(0, "O valor deve ser maior ou igual a 0"),
});

export function MeasureConfirm({
  children,
  id,
  value,
  hasConfirmed,
}: {
  children: ReactNode;
  id: string;
  value: number;
  hasConfirmed: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const response = await fetch(`/api/measures/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        confirmed_value: data.value,
      }),
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
        description: "Medição ajustada com sucesso",
      });
      router.refresh();
      ref.current?.click();
    }
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div ref={ref}>{children}</div>
      </DialogTrigger>
      <DialogContent className="bg-black shadow shadow-primary">
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
                      type="number"
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
}
