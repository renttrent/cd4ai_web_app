"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loadingbutton";
import { Textarea } from "@/components/ui/textarea";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { createClass, updateClass } from "@/util/classes/classes";
import { useMutation } from "@tanstack/react-query";
import { ObjectSchema, object, string } from "yup";

interface ClassState {
  name: string;
  description: string;
  project_id: string;
}

const ClassSchema: ObjectSchema<ClassState> = object({
  name: string().required(),
  description: string().required(),
  project_id: string().required(),
});

type ClassFormProps =
  | {
      projectId: string;
      onSuccess?: () => void;
      editable: false;
    }
  | {
      onSuccess?: () => void;
      editable: true;
      classId: string;
      initialData: ClassState;
    };

export const ClassForm = ({ onSuccess, ...props }: ClassFormProps) => {
  const { register, handleSubmit, formState } = useValidatedForm({
    schema: ClassSchema,
    defaultValues: props.editable
      ? {
          project_id: props.initialData.project_id ?? "",
          name: props.initialData.name ?? "",
          description: props.initialData.description ?? "",
        }
      : {
          name: "",
          description: "",
          project_id: props.projectId,
        },
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (data: ClassState) => {
      return props.editable
        ? updateClass(props.classId, data)
        : createClass(data);
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
    <div className="">
      <div className="font-bold text-xl">
        {!props.editable ? "Add a Class" : "Edit Class"}
      </div>
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

        <Label htmlFor="description">Description</Label>
        <Textarea
          {...register("description")}
          id="description"
          placeholder="Description "
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

        <LoadingButton
          disabled={formState.isSubmitting}
          isLoading={formState.isSubmitting}
        >
          Submit
        </LoadingButton>
      </form>
    </div>
  );
};
