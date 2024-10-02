"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GetUser } from "./actions";
import { toast } from "@/hooks/use-toast";
import { UpdateUserMutation } from "@/hooks/update-user";
import { useRouter } from "next/navigation";
import { UserExit } from "./user-exit";

const formSchema = z.object({
  name: z.string().min(3, "O nome precisa ter mais de 3 letras"),
  email: z.string().email().min(5, "O e-mail precisa ter mais de 5 letras"),
  password: z.string().optional(),
  newPassword: z.string().optional(),
});

export function UserPage({ id }: { id: string }) {
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();
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
      password: "",
      newPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    console.log(data);
    mutation.mutate({
      newPassword: data.newPassword,
      user: { email: data.email, name: data.name, password: data.password },
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
            <div>
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
            {editMode && (
              <div className="flex w-full flex-col gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="bg-black px-2 py-6 text-2xl font-semibold shadow shadow-primary"
                          type="password"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="bg-black px-2 py-6 text-2xl font-semibold shadow shadow-primary"
                          type="password"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription className="flex w-full rounded-lg p-2 text-xl font-semibold">
                        Utilize estes campos para atualizar sua senha
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
