"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { CreateUser } from "../actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NewUser, User } from "@/services/db/schemas/user";

const UserSchema = z.object({
  name: z
    .string({ required_error: "Name is required!" })
    .min(3, "Name must have more than 3 characters!"),
  email: z
    .string({ required_error: "Email is required!" })
    .min(3, "Email must have more than 3 characters!")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required!" })
    .min(6, "Password must have more than 6 characters!")
    .max(32, "Password must be less than 32 characters!"),
});

export function SignUp() {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const router = useRouter(); // Use router to navigate after successful sign-in

  const mutation = useMutation({
    mutationFn: async (user: NewUser) =>
      await CreateUser({
        name: user.name,
        email: user.email,
        password: user.password,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData<User>(["user", data.id], (user) => user);
      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso.",
      });
      router.push("/");
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    mutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  });

  return (
    <>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Fill in your details to register</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your name to register!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your e-mail"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your email to register!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      {...field}
                      type="password"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your password to register!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Sign Up</Button>
          </CardFooter>
        </form>
      </Form>
    </>
  );
}
