import { getFile } from "@/util/projects/get-file";
import { useMutation } from "@tanstack/react-query";

export const useFileDownload = (shouldDownload = false) => {
  const onSuccess = ({ url }: { url: string }) => {
    const a = document.createElement("a");
    a.style.display = "none";
    a.target = "_blank";
    a.href = url ?? "";
    a.download = "";
    a.click();
  };

  const { mutate, isPending, data } = useMutation({
    mutationFn: async ({ path }: { path: string }) => {
      return getFile(path);
    },
    onSuccess: shouldDownload ? onSuccess : undefined,
  });

  const download = (path: string) => {
    mutate({ path });
  };

  return {
    download,
    data,
    isPending,
  };
};
