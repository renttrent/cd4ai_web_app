"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AiFillFileAdd } from "react-icons/ai";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { ObjectSchema, array, object, string } from "yup";
import { useMutation } from "@tanstack/react-query";
import { createProject } from "@/util/projects/projects";

type FormState = {
  name: string;
  description: string;
  files: Array<any>;
};

const FormSchema: ObjectSchema<FormState> = object({
  name: string().required(),
  description: string().required(),
  files: array().required(),
}).required();

export function AddProjectButton() {
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (data: FormState) => {
      const res = await createProject(data);
      console.log(res.data);
    },
  });

  const { register, handleSubmit } = useValidatedForm({
    schema: FormSchema,
  });

  const onSubmit = async (data: FormState) => {
    console.log("here");
    try {
      console.log(data);
      // await mutateAsync(data);
    } catch {
      //ignore
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex flex-row gap-2 items-center">
          <AiFillFileAdd />
          Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
          <DialogDescription>
            Add your project details here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  {...register("name")}
                  id="name"
                  className="col-span-3"
                  disabled={isPending}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Description
                </Label>
                <Input
                  {...register("description")}
                  id="description"
                  className="col-span-3"
                  disabled={isPending}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="files">Choose Files</Label>
                <Input
                  {...register("files")}
                  id="files"
                  type="file"
                  accept=".txt,.csv"
                  className="col-span-3"
                  disabled={isPending}
                  multiple
                />
              </div>
            </div>
            <Button>Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
