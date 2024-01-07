"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AiFillFileAdd } from "react-icons/ai";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { ObjectSchema, object, string } from "yup";
import { useMutation } from "@tanstack/react-query";
import { createProject } from "@/util/projects/projects";
import { useState } from "react";
import { Modal } from "./Modal";
import { queryClient } from "@/util/query-client";
import { Textarea } from "../ui/textarea";
import { LoadingButton } from "../ui/loadingbutton";

type FormState = {
  name: string;
  description: string;
  language: "en" | "de";
};

const FormSchema: ObjectSchema<FormState> = object({
  name: string().required(),
  description: string().required(),
  language: string().oneOf(["en", "de"]).required(),
}).required();

export function AddProjectButton() {
  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (data: FormState) => {
      const { name, description, language } = data;
      const res = await createProject({
        name,
        description,
        files,
        language,
      });
      console.log(res);
    },
    onSuccess: () => {
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const { register, handleSubmit, reset } = useValidatedForm({
    schema: FormSchema,
  });

  const [files, setFiles] = useState<File[] | null>(null);
  const [CSVs, setCSVs] = useState<File[]>([]);

  const generateMetaStrList = () => {
    const metaStrList = [];
    for (let index = 0; index < CSVs.length; index++) {
      const file = CSVs[index];
      metaStrList.push({
        file_name: file.name,
      });
    }
    return metaStrList;
  };

  const onSubmit = async (data: FormState) => {
    try {
      await mutateAsync(data);
    } catch {
      //ignore
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="flex flex-row gap-2 items-center"
      >
        <AiFillFileAdd />
        Add Project
      </Button>
      <Modal
        className="max-w-xl"
        open={isOpen}
        title="Add Project"
        description="Add your project details here. Click save when you're done.
      "
        onClose={() => {
          setIsOpen(false), reset();
        }}
      >
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
                <Textarea
                  {...register("description")}
                  id="Enter project description"
                  className="col-span-3"
                  disabled={isPending}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Language</Label>
                <div className="col-span-3 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Input
                      {...register("language")}
                      type="radio"
                      id="lang-en"
                      value="en"
                    />
                    <Label htmlFor="lang-en">English</Label>
                  </div>
                  <div className="flex items-center gap-1">
                    <Input
                      {...register("language")}
                      type="radio"
                      id="lang-de"
                      value="de"
                    />
                    <Label htmlFor="lang-de">German</Label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="files">Choose Files</Label>
                <Input
                  id="files"
                  type="file"
                  accept=".txt,.csv"
                  className="col-span-3"
                  disabled={isPending}
                  onChange={(e) => {
                    // @ts-ignore
                    const length = e.target.files.length;

                    let files = [];
                    for (let index = 0; index < length; index++) {
                      // @ts-ignore
                      files.push(e.target.files[index]);
                    }
                    setFiles(files);
                  }}
                  multiple
                />
              </div>
            </div>
            <LoadingButton
              disabled={isPending}
              isLoading={isPending}
              type="submit"
            >
              Save
            </LoadingButton>
          </div>
        </form>
      </Modal>
    </>
  );
}
