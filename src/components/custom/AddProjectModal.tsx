import { Label } from "@radix-ui/react-label";
import { MouseEventHandler, MutableRefObject, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { IoIosCloseCircle } from "react-icons/io";
import { Input } from "../ui/input";
import { useValidatedForm } from "@/hooks/use-validated-form";
import { ObjectSchema, object, string } from "yup";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { PulseLoader } from "react-spinners";

interface ProjectState {
  name: string;
  description: string;
  files: string;
}

const ProjectSchema: ObjectSchema<ProjectState> = object({
  name: string().required(),
  description: string().required(),
  files: string().required(),
}).required();

export const AddProjectModal = ({
  onClose,
}: {
  onClose: MouseEventHandler<HTMLButtonElement>;
}) => {
  const modalRef = useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>;

  const { register, handleSubmit } = useValidatedForm({
    schema: ProjectSchema,
  });

  const { mutateAsync, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: async (data: ProjectState) => {
      // TODO
    },
  });

  const onSubmit = async (data: ProjectState) => {
    try {
      await mutateAsync(data);
    } catch {
      //ignore
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      //@ts-ignore
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // @ts-ignore
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return createPortal(
    <div>
      <div className="absolute top-0 left-0 w-screen h-screen bg-black/20" />
      <div
        ref={modalRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 shadow-xl w-1/2 rounded-lg"
      >
        <div className="relative w-full">
          <button onClick={onClose} className="absolute right-4 top-2 text-xl">
            <IoIosCloseCircle />
          </button>
          <div className="p-10">
            <div className="font-bold text-xl">Add a Project</div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 mt-10"
            >
              <Label className="sr-only" htmlFor="name">
                Name
              </Label>
              <Input
                {...register("name")}
                id="email"
                placeholder="Name"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                // disabled={isPending}
              />
              <Label className="sr-only" htmlFor="description">
                Description
              </Label>
              <Input
                {...register("description")}
                id="email"
                placeholder="Description"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                // disabled={isPending}
              />
              <Button disabled={isPending}>
                {isPending && <PulseLoader size={7} color="white" />}
                {!isPending && <span>Submit</span>}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
