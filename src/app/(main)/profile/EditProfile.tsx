"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loadingbutton";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { getUser } from "@/util/user/get-user";
import { resetUserSettings, updateUser } from "@/util/user/update-user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { InferType, object, ref, string } from "yup";

const editSchema = object({
  firstname: string(),
  lastname: string(),
  password: string(),
  confirm_password: string().oneOf([ref("password")], "Passwords must match"),
  de_model: string(),
  en_model: string(),
});

type SchemaState = InferType<typeof editSchema>;

export const EditProfile = () => {
  const { data, refetch } = useQuery({
    queryKey: ["user", "profile"],

    queryFn: async () => {
      const res = await getUser();
      return res;
    },
  });

  const { mutateAsync: updateUserAsync, isPending: isUpdatePending } =
    useMutation({
      mutationFn: async (d: SchemaState) => {
        await updateUser(d);
      },
    });

  const { mutateAsync: resetUserSettingsAsync, isPending: isResetPending } =
    useMutation({
      mutationFn: async () => {
        await resetUserSettings();
      },
      onSuccess: () => refetch(),
    });

  const form = useValidatedForm({
    schema: editSchema,
    values: {
      firstname: data?.firstname,
      lastname: data?.lastname,
      de_model: data?.account_settings?.de_embaddings_model,
      en_model: data?.account_settings?.en_embaddings_model,
      password: undefined,
      confirm_password: undefined,
    },
  });

  const onEditProfile = async (data: SchemaState) => {
    await updateUserAsync({
      firstname: data.firstname,
      lastname: data.lastname,
      de_model: data.de_model,
      en_model: data.en_model,
    });
    await refetch();
  };

  const onChangePassword = async (data: SchemaState) => {
    await updateUserAsync({
      password: data.password,
    });
    await signOut();
  };

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-lg">Profile Info</h1>
        <form
          onSubmit={form.handleSubmit(onEditProfile, console.log)}
          className="flex flex-col gap-2 max-w-3xl"
        >
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 w-full flex-wrap">
              <div className="flex-1 basis-60">
                <Label htmlFor="firstname">First Name</Label>
                <Input id="firstname" {...form.register("firstname")} />
              </div>
              <div className="flex-1 basis-60">
                <Label htmlFor="lastname">Last Name</Label>
                <Input id="lastname" {...form.register("lastname")} />
              </div>
            </div>
            <Label htmlFor="de_model">German Model</Label>
            <Input id="de_model" {...form.register("de_model")} />
            <Label htmlFor="en_model">English Model</Label>
            <Input id="en_model" {...form.register("en_model")} />
          </div>
          <div className="flex gap-2  flex-wrap">
            <LoadingButton
              isLoading={isUpdatePending}
              disabled={isUpdatePending || isResetPending}
            >
              Submit
            </LoadingButton>
            <LoadingButton
              variant="destructive"
              type="button"
              isLoading={isResetPending}
              disabled={isUpdatePending || isResetPending}
              onClick={() => resetUserSettingsAsync()}
            >
              Reset Model Settings
            </LoadingButton>
          </div>
        </form>
      </div>
      <div>
        <h1 className="text-lg">Change Password</h1>

        <form
          onSubmit={form.handleSubmit(onChangePassword, console.log)}
          className="flex flex-col gap-2 max-w-3xl"
        >
          <Label htmlFor="password">Password</Label>
          <Input id="password" {...form.register("password")} />
          <Label htmlFor="confirm_password">Confirm Password</Label>
          <Input id="confirm_password" {...form.register("confirm_password")} />
          <div>
            <LoadingButton
              isLoading={isUpdatePending}
              disabled={isUpdatePending || isResetPending}
              type="submit"
            >
              Change Password
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};
