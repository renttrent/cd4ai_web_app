import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Modal } from "./Modal";
import { useFileDownload } from "@/hooks/use-file-download";

export const FileBadge = ({ name, path }: { name: string; path: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Modal
        className="max-h-[400px] flex flex-col"
        title="File Preview"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <FilePreview path={path} />
      </Modal>
      <Badge className="cursor-pointer" onClick={() => setIsOpen(true)}>
        {name}
      </Badge>
    </div>
  );
};

const FilePreview = ({ path }: { path: string }) => {
  const { data, download } = useFileDownload(false);
  const [text, setText] = useState("");
  useEffect(() => {
    download(path);
  }, [path]);

  useEffect(() => {
    data?.blob.text().then((text) => setText(text));
  }, [data]);

  if (data?.blob.type == "text/plain") {
    return <div className="flex-1 bg-gray-100 overflow-auto">{text}</div>;
  }
  if (data?.blob.type == "text/csv") {
    return <div className="flex-1 bg-gray-100 overflow-auto">{text}</div>;
  }

  return <div>Preview Not Possible for {data?.blob.type}</div>;
};
