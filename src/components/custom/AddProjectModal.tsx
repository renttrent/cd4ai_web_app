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
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { usePapaParse } from "react-papaparse";
import { Project } from "@/types/types";

type FormState = {
  name: string;
  description: string;
};

const FormSchema: ObjectSchema<FormState> = object({
  name: string().required(),
  description: string().required(),
}).required();

export function AddProjectButton() {
  const [newProject, setNewProject] = useState<Project>();

  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (data: FormState) => {
      const { name, description } = data;
      const res = await createProject({
        name,
        description,
        files: fileList,
        files_meta_str: generateMetaStrList(),
      });
      setNewProject(res);
    },
  });

  const { register, handleSubmit } = useValidatedForm({
    schema: FormSchema,
  });

  const [files, setFiles] = useState<FileList | null>(null);
  const [fileList, setFileList] = useState<File[]>([]);
  const [CSVs, setCSVs] = useState<File[]>([]);

  const generateMetaStrList = () => {
    const metaStrList = [];
    for (let index = 0; index < CSVs.length; index++) {
      const file = CSVs[index];
      metaStrList.push({
        file_name: file.name,
        column_name: selectedColumn,
      });
    }
    return metaStrList;
  };

  useEffect(() => {
    if (files) {
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        fileList.push(file);
        if (file.type === "text/csv") {
          setCSVs((prev) => [...prev, file]);
        }
      }
    }
  }, [files]);

  const onSubmit = async (data: FormState) => {
    try {
      await mutateAsync(data);
    } catch {
      //ignore
    }
  };

  const { readString } = usePapaParse();
  const [content, setContent] = useState<string[]>([]);
  const [columns, setColumns] = useState<Array<Array<string>>>([]);

  useEffect(() => {
    content.map((text, index) => {
      readString(text, {
        worker: true,
        complete: (results: any) => {
          if (results.data[0]) {
            setColumns((prev) => {
              const newCols = [...prev];
              if (newCols[index]) {
                newCols[index] = results.data[0];
              } else {
                newCols.push(results.data[0]);
              }
              return newCols;
            });
          }
        },
      });
    });
  }, [content]);

  const getColumns = () => {
    CSVs.map((file) => {
      const reader = new FileReader();
      reader.onloadend = (event) => {
        setContent((prev) => [...prev, event.target?.result as string]);
      };
      reader.readAsText(file);
    });
  };

  useEffect(() => {
    if (CSVs.length > 0) {
      getColumns();
    }
  }, [CSVs]);

  const [selectedColumn, setSelectedColumn] = useState<Array<string>>([]);

  console.log("csvs", CSVs);
  console.log("columns", columns);
  console.log("selectedColumn", selectedColumn);

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
                  id="files"
                  type="file"
                  accept=".txt,.csv"
                  className="col-span-3"
                  disabled={isPending}
                  onChange={(e) => {
                    // @ts-ignore
                    setFiles(e.target.files);
                  }}
                  multiple
                />
              </div>
              {CSVs.length > 0 && (
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">
                    Choose a column for each file
                  </Label>
                  {CSVs.map((file, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 items-center gap-4"
                    >
                      <Label htmlFor="files">{file.name}</Label>
                      <Select
                        name="column"
                        id="column"
                        defaultValue={selectedColumn[index]}
                        onChange={(e: any) =>
                          setSelectedColumn((prev) => {
                            prev[index] = e.target.value;
                            return prev;
                          })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Choose column" />
                        </SelectTrigger>
                        <SelectContent>
                          {columns.length > 0 &&
                            columns[index].map((column, index) => (
                              <SelectItem key={index} value={column}>
                                {column}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
