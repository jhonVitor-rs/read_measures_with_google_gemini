"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Pencil, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GetUser } from "./actions";
import { toast } from "@/hooks/use-toast";
import { UpdateUserMutation } from "@/hooks/update-user";
import { useRouter } from "next/navigation";
import { UserExit } from "./user-exit";
import { UpdatePassword } from "./update-password";

const formSchema = z.object({
  name: z.string().min(3, "O nome precisa ter mais de 3 letras"),
  email: z.string().email().min(5, "O e-mail precisa ter mais de 5 letras"),
});

export function UserPage({ id }: { id: string }) {
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const mutation = UpdateUserMutation(id);

  const { data, isError, error } = useSuspenseQuery({
    queryKey: ["user", id],
    queryFn: () => GetUser(),
  });
  console.log(data);

  useEffect(() => {
    if (isError)
      toast({
        title: error?.name,
        description: error?.message,
        variant: "destructive",
      });
  }, [isError, error]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name as string,
      email: data.email as string,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    mutation.mutate({
      user: { email: data.email, name: data.name },
    });
    setEditMode(false);
    router.refresh();
  });

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex-1">Dados do usuário</CardTitle>
            <div className="flex items-center justify-center gap-2">
              <UpdatePassword
                id={id}
                onClose={() => ref.current?.click()}
                ref={ref}
              >
                <Button>Alterar Senha</Button>
              </UpdatePassword>
              {!editMode ? (
                <Button
                  onClick={() => setEditMode(true)}
                  size={"icon"}
                  variant={"ghost"}
                >
                  <Pencil />
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button type="submit" variant={"default"}>
                    Salvar
                  </Button>
                  <Button
                    onClick={() => setEditMode(false)}
                    size={"icon"}
                    variant={"destructive"}
                  >
                    <X />
                  </Button>
                </div>
              )}
              <UserExit id={id} />
            </div>
          </CardHeader>
          <CardContent className="flex min-h-96 flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  {!editMode ? (
                    <FormLabel className="flex w-full rounded-lg bg-black p-2 text-2xl font-bold text-primary shadow shadow-primary">
                      {data.name}
                    </FormLabel>
                  ) : (
                    <FormControl>
                      <Input
                        className="bg-black px-2 py-6 text-2xl font-semibold shadow shadow-primary"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  {!editMode ? (
                    <FormLabel className="flex w-full rounded-lg bg-black p-2 text-2xl font-bold text-primary shadow shadow-primary">
                      {data.email}
                    </FormLabel>
                  ) : (
                    <FormControl>
                      <Input
                        className="bg-black px-2 py-6 text-2xl font-semibold shadow shadow-primary"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
