"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { string, object, ObjectSchema } from "yup";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { useMutation } from "@tanstack/react-query";
import { SignUpRequestParams, signUp } from "@/util/auth/signup";
import { Alert } from "@/components/ui/alert";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PulseLoader } from "react-spinners";

type SignUpState = {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
};

const signUpSchema: ObjectSchema<SignUpState> = object({
  firstname: string().required(),
  lastname: string().required(),
  username: string().required(),
  password: string().required(),
}).required();

export default function Login() {
  const router = useRouter();
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (data: SignUpRequestParams) => {
      return signUp(data);
    },
  });
  const { register, handleSubmit } = useValidatedForm({
    schema: signUpSchema,
  });

  const onSubmit = async (data: SignUpState) => {
    try {
      await mutateAsync(data);
    } catch {
      //ignore
    }
  };

  useEffect(() => {
    if (isSuccess) {
      router.push("/");
    }
  }, [isSuccess]);

  return (
    <div
      className={cn(
        "w-full grid gap-2 shadow-xs px-4 py-6 border-2 border-gray-100 rounded-xl shadow-gray-300"
      )}
    >
      {isError && (
        // @ts-ignore
        <Alert variant="destructive">{`Sign Up Failed - ${JSON.stringify(
          error
        )}`}</Alert>
      )}
      <div className="flex flex-col gap-2 items-center">
        <span className="text-2xl font-semibold">Create new account</span>
        <span className="text-sm text-gray-600">
          Enter your credentials below
        </span>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="firstname">
              First Name
            </Label>
            <Input
              {...register("firstname")}
              id="firstname"
              placeholder="John"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isPending}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="lastname">
              Last Name
            </Label>
            <Input
              {...register("lastname")}
              id="lastname"
              placeholder="Smith"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isPending}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="username">
              Username
            </Label>
            <Input
              {...register("username")}
              id="username"
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
            {isPending && <PulseLoader size={7} color="white" />}
            {!isPending && <span>Sign Up</span>}
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
        <div className="text-xs text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
