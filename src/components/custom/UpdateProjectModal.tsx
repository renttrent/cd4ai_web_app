"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { ObjectSchema, object, string, array, mixed } from "yup";
import { useMutation } from "@tanstack/react-query";
import { updateProjectParams } from "@/util/projects/projects";
import { useState } from "react";
import { Modal } from "./Modal";
import { queryClient } from "@/util/query-client";
import { Textarea } from "../ui/textarea";
import { LoadingButton } from "../ui/loadingbutton";
import { Project } from "@/types/types";
import { updateProject } from "@/util/projects/projects";
import { FileBadge } from "@/components/custom/FileBadge";
import { Pen } from "lucide-react";

const UpdateFormSchema: ObjectSchema<updateProjectParams> = object({
  name: string(),
  description: string(),
  language: string().oneOf(["en", "de"]).required(),
  files: array(),
  delete_file_paths: string(),
}).defined();

export function UpdateProjectButton({ project }: { project: Project }) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<File[] | null>(null);
  const [deletedFiles, setDeletedFiles] = useState<string>("");
  const [formValues, setFormValues] = useState({
    name: project?.name || "",
    description: project?.description || "",
  });

  const handleDeleteFile = (deletedFilePath: string) => {
    setDeletedFiles((prevDeletedFiles) =>
      prevDeletedFiles.length > 0
        ? (prevDeletedFiles += "," + deletedFilePath)
        : deletedFilePath
    );
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: updateProjectParams) => {
      try {
        data.files = files;
        const res = await updateProject(project.id, data);
        console.log(res);
        setIsOpen(false);
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      } catch (error) {
        console.error("Error occurred:", error);
      }
    },
  });

  const { register, handleSubmit, reset } = useValidatedForm({
    schema: UpdateFormSchema,
  });

  const onSubmit = async (data: any) => {
    try {
      console.log(data);
      let updatedData = { ...data };

      if (deletedFiles.length > 0) {
        updatedData = {
          ...data,
          delete_file_paths: deletedFiles,
        };
      }

      await mutateAsync(updatedData);
    } catch {
      // Handle errors if necessary
    } finally {
      setDeletedFiles("");
    }
  };

  const resetFormState = () => {
    reset();
    setFiles([]);
    setDeletedFiles("");
  };

  const handleCloseModal = () => {
    resetFormState();
    setIsOpen(false);
  };

  const handleOpenModal = () => {
    resetFormState();
    setIsOpen(true);
  };

  return (
    <>
      <a
        className="text-primary"
        onClick={handleOpenModal}
        style={{ cursor: "pointer" }}
      >
        <Pen size={16} />
      </a>
      <Modal
        className="max-w-screen-md overflow-y-auto" // Adjust the maximum width as needed
        open={isOpen}
        title="Edit Project"
        description="Update your project details here. Click Save Changes when you're done."
        onClose={handleCloseModal}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Label htmlFor="name">Name</Label>
              <Input
                {...register("name")}
                id="name"
                className="col-span-1"
                defaultValue={project?.name || ""}
                disabled={isPending}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                {...register("description")}
                id="description"
                className="col-span-1"
                defaultValue={project?.description || ""}
                disabled={isPending}
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label>Language</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Input
                    {...register("language")}
                    type="radio"
                    id="lang-en-update"
                    value="en"
                    defaultChecked={project.lang === "en"}
                    disabled={isPending}
                  />
                  <Label htmlFor="lang-en-update">English</Label>
                </div>
                <div className="flex items-center gap-1">
                  <Input
                    {...register("language")}
                    type="radio"
                    id="lang-de-update"
                    value="de"
                    defaultChecked={project.lang === "de"}
                    disabled={isPending}
                  />
                  <Label htmlFor="lang-de-update">German</Label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Label htmlFor="files">Choose Files</Label>
              <Input
                id="files"
                type="file"
                accept=".txt,.csv"
                className="col-span-1"
                disabled={isPending}
                onChange={(e) => {
                  const filesArray = Array.from(e.target.files || []);
                  setFiles(filesArray);
                }}
                multiple
              />
            </div>
            <div className="flex items-center gap-2 my-2">
              <div className="text-stone-700">Files:</div>
              <div className="flex flex-wrap gap-4">
                {project.files.map((file: any, index: number) => (
                  <FileBadge
                    key={index}
                    name={file.file_name}
                    path={file.file_path}
                    onDelete={() => handleDeleteFile(file.file_path)}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <LoadingButton
                disabled={isPending}
                isLoading={isPending}
                type="submit"
              >
                Save Changes
              </LoadingButton>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
