"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loadingbutton";
import { Textarea } from "@/components/ui/textarea";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { createClass } from "@/util/classes/classes";
import { useMutation } from "@tanstack/react-query";
import { ObjectSchema, object, string } from "yup";

interface ClassState {
  name: string;
  short_description: string;
  long_description: string;
  project_id: string;
  init_keywords: string;
}

const ClassSchema: ObjectSchema<ClassState> = object({
  name: string().required(),
  short_description: string().required(),
  long_description: string().required(),
  project_id: string().required(),
  init_keywords: string()
    .required()
    .matches(/^[a-zA-Z ,]+$/),
});

export const CreateClassForm = ({
  projectId,
  onSuccess,
}: {
  projectId: string;
  onSuccess?: () => void;
}) => {
  const { register, handleSubmit } = useValidatedForm({
    schema: ClassSchema,
    defaultValues: {
      project_id: projectId,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: ClassState) => {
      const { init_keywords, ...rest } = data;

      const keywords = init_keywords
        .split(",")
        .map((keyword) => keyword.trim());
      const classData = {
        ...rest,
        init_keywords: keywords,
      };
      return createClass(classData);
    },
  });

  const onSubmit = async (data: ClassState) => {
    try {
      await mutateAsync(data);
      onSuccess?.();
    } catch {
      //ignore
    }
  };
  return (
    <div className="p-10">
      <div className="font-bold text-xl">Add a Class</div>
      <form
        onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
        className="flex flex-col gap-3 mt-10"
      >
        <Label htmlFor="name">Name</Label>
        <Input
          {...register("name")}
          id="name"
          placeholder="Name"
          type="text"
          autoCapitalize="none"
          autoCorrect="off"
          // disabled={isPending}
        />
        <Label htmlFor="short_description">Short Description</Label>
        <Input
          {...register("short_description")}
          id="short_description"
          placeholder="Short Description"
          type="text"
          autoCapitalize="none"
          autoCorrect="off"
          // disabled={isPending}
        />
        <Label htmlFor="long_description">Long Description</Label>
        <Textarea
          {...register("long_description")}
          id="long_description"
          placeholder="Long Description"
          autoCapitalize="none"
          autoCorrect="off"
          // disabled={isPending}
        />
        <Label hidden htmlFor="project_id">
          Project ID
        </Label>
        <Input
          hidden
          {...register("project_id")}
          id="project_id"
          className="hidden"
          placeholder="Project ID"
          type="text"
          autoCapitalize="none"
          autoCorrect="off"
          // disabled={isPending}
        />
        <Label htmlFor="init_keywords">Initial Keywords</Label>

        <Input
          {...register("init_keywords")}
          id="init_keywords"
          placeholder="Initial Keywords"
          type="text"
          autoCapitalize="none"
          autoCorrect="off"
          // disabled={isPending}
        />

        <LoadingButton disabled={isPending} isLoading={isPending}>
          Submit
        </LoadingButton>
      </form>
    </div>
  );
};
