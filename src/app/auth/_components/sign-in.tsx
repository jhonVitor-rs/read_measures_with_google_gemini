"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { SignInAssistant } from "../actions";

const UserLoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required!" })
    .min(3, "Email must have more than 3 characters!")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required!" })
    .min(6, "Password must have more than 6 characters!")
    .max(32, "Password must be less than 32 characteres!"),
});

export function SignIn() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(UserLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const { success, message } = await SignInAssistant({
      email: data.email,
      password: data.password,
    });

    if (!success) {
      toast({
        title: "Erro",
        description: message as string,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso",
        description: message,
      });
      router.push("/");
    }
  });

  return (
    <>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Fill in your registration details to sign in
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
          <CardContent>
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
                    Enter the email you used to register!
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
                    Enter the password you used to register!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Sign In</Button>
          </CardFooter>
        </form>
      </Form>
    </>
  );
}
