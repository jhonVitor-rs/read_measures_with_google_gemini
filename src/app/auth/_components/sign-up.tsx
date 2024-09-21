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
import { signIn } from "next-auth/react"; // Use from next-auth/react
import { useRouter } from "next/navigation";

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
  const form = useForm({
    resolver: zodResolver(UserSchema),
  });

  const router = useRouter(); // Use router to navigate after successful sign-in

  const onSubmit = form.handleSubmit(async (data) => {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast({
        title: errorData.error_code,
        description: errorData.error_description,
        variant: "destructive",
      });
    } else {
      const responseData = await response.json();

      const result = await signIn("credentials", {
        redirect: false, // Avoid redirection by NextAuth
        email: responseData.user.email,
        password: data.password, // Use the password from the form directly
      });

      if (result?.error) {
        toast({
          title: "Sign-in Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        // Redirect to the dashboard or another page after successful sign-in
        router.push("/dashboard");
      }
    }
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
