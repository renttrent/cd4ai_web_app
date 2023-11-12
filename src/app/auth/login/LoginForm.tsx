"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { ObjectSchema, object, string } from "yup";
import { useMutation } from "@tanstack/react-query";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";

type LoginState = {
  username: string;
  password: string;
};

const LoginSchema: ObjectSchema<LoginState> = object({
  username: string().required(),
  password: string().required(),
}).required();

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const router = useRouter();
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (data: LoginState) => {
      const res = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
        callbackUrl: "/",
      });

      if (res?.ok) {
        return res;
      }
      if (res?.status === 401) {
        throw res;
      }
      throw new Error("An error occurred");
    },

    onSuccess: (data) => {
      router.push("/");
    },
  });
  const { register, handleSubmit } = useValidatedForm({
    schema: LoginSchema,
  });

  const onSubmit = async (data: LoginState) => {
    try {
      await mutateAsync(data);
    } catch {
      //ignore
    }
  };
  console.log("iserror", isError);
  return (
    <div
      className={cn(
        "w-full grid gap-2 shadow-xs px-4 py-6 border-2 border-gray-100 rounded-xl shadow-gray-300",
        className
      )}
      {...props}
    >
      {isError && <Alert variant="destructive">Invalid Credentials</Alert>}

      <div className="flex flex-col gap-2 items-center">
        <span className="text-2xl font-semibold">Login to your account</span>
        <span className="text-sm text-gray-600">
          Enter your credentials below
        </span>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="username">
              Username
            </Label>
            <Input
              {...register("username")}
              id="email"
              placeholder="username"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isPending}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              {...register("password")}
              id="password"
              placeholder="Password"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isPending}
            />
          </div>
          <Button disabled={isPending}>
            {isPending && <div>loading </div>}
            Sign In
          </Button>
        </div>
      </form>
      <div className="relative text-center">
        <span className="text-xs ">
          By clicking continue, you agree to our Terms of Service and Privacy
          Policy.
        </span>
      </div>
    </div>
  );
}
