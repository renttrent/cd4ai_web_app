"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { ObjectSchema, object, string ,array ,mixed} from "yup";
import { useMutation } from "@tanstack/react-query";
import { updateProjectParams } from "@/util/projects/projects";
import { useState } from "react";
import { Modal } from "./Modal";
import { queryClient } from "@/util/query-client";
import { Textarea } from "../ui/textarea";
import { LoadingButton } from "../ui/loadingbutton";
import { Project } from "@/types/types";
import { updateProject} from "@/util/projects/projects";
import { FileBadge } from "@/components/custom/FileBadge";

  const UpdateFormSchema: ObjectSchema<updateProjectParams> = object({
    name: string(),
    description: string(),
    files: array(),
    delete_file_paths: string(),
  }).defined(); 

  export function UpdateProjectButton({ project }: { project: Project }){
    const [isOpen, setIsOpen] = useState(false);
    const [files, setFiles] = useState<File[] | null>(null);
    const [CSVs, setCSVs] = useState<File[]>([]);
    const [deletedFiles, setDeletedFiles] = useState<string>('');
    console.log("deletedFiles: "  + deletedFiles);

    const handleDeleteFile = (deletedFilePath: string) => {
      setDeletedFiles((prevDeletedFiles) => deletedFiles.length > 0 ? prevDeletedFiles += "," + deletedFilePath : deletedFilePath);
    };

    const { mutateAsync, isPending } = useMutation({
      mutationFn: async (data: updateProjectParams) => {
        try {
          data.files = files;
          const res = await updateProject(project.id , data);
          console.log(res);
          setIsOpen(false);
          queryClient.invalidateQueries({ queryKey: ["projects"] });
        } catch (error) {
          console.error('Error occurred:', error);
        }
      },
    });
  
    const { register, handleSubmit } = useValidatedForm({
      schema: UpdateFormSchema,
    });
  
    const onSubmit = async (data:any) => {
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
        setDeletedFiles('');
      }
    };
  
    return (
      <>
        <Button 
            onClick={() => setIsOpen(true)} 
            variant="outline">
            Edit Project
        </Button>
        <Modal
          className="max-w-xl"
          open={isOpen}
          title="Edit Project"
          description="Update your project details here. Click Save Changes when you're done."
          onClose={() => setIsOpen(false)}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  {...register('name')}
                  id="name"
                  className="col-span-3"
                  defaultValue={project?.name || ''}
                  disabled={isPending}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  {...register('description')}
                  id="description"
                  className="col-span-3"
                  defaultValue={project?.description || ''}
                  disabled={isPending}
                />
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
              <div className="flex flex-row gap-2 my-2">
                <div className="text-stone-700">Files:</div>
                <div className="flex flex-row gap-4">
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
              <LoadingButton disabled={isPending} isLoading={isPending} type="submit">
                Save Changes
              </LoadingButton>
            </div>
          </form>
        </Modal>
      </>
    );
  }