"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { ObjectSchema, object, string } from "yup";
import { useMutation } from "@tanstack/react-query";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { PulseLoader } from "react-spinners";
import { useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

type LoginState = {
  username: string;
  password: string;
};

const LoginSchema: ObjectSchema<LoginState> = object({
  username: string().required(),
  password: string().required(),
}).required();

export default function Login() {
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
  });
  const { register, handleSubmit } = useValidatedForm({
    schema: LoginSchema,
  });

  useEffect(() => {
    if (isSuccess) {
      router.push("/");
    }
  }, [isSuccess]);

  const params = useSearchParams();
  const { toast } = useToast();
  useEffect(() => {
    const isSuccess = params.get("success") == "true";
    if (isSuccess) {
      toast({
        title: "Sign up was sucessful",
        description: "You can use your credentials to login.",
        variant: "default",
      });
    }
  }, []);

  const onSubmit = async (data: LoginState) => {
    try {
      await mutateAsync(data);
    } catch {
      //ignore
    }
  };

  return (
    <div
      className={cn(
        "w-full grid gap-2 shadow-xs px-4 py-6 border-2 border-gray-100 rounded-xl shadow-gray-300"
      )}
    >
      <div className="flex flex-col gap-2 items-center">
        <span className="text-2xl font-semibold">Login to your account</span>
        <span className="text-sm text-gray-600">
          Enter your credentials below
        </span>
      </div>
      {isError && <Alert variant="destructive">Invalid Credentials</Alert>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label htmlFor="username">Username</Label>
            <Input
              {...register("username")}
              id="email"
              placeholder="your username here"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isPending}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password">Password</Label>
            <Input
              {...register("password")}
              id="password"
              placeholder="your password here"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isPending}
            />
          </div>
          <Button disabled={isPending}>
            {isPending && <PulseLoader size={7} color="white" />}
            {!isPending && <span>Sign In</span>}
          </Button>
        </div>
      </form>
      <div className="relative text-center">
        <span className="text-xs ">
          By clicking continue, you agree to our Terms of Service and Privacy
          Policy.
        </span>
      </div>

      <div className="m-auto">
        <span className="text-xs text-gray-600">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </Link>
        </span>
      </div>
    </div>
  );
}
