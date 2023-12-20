import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Modal } from "./Modal";
import { useFileDownload } from "@/hooks/use-file-download";
import { File } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { parseCsvAsync } from "@/lib/utils";

export const FileBadge = ({ name, path, onDelete }: { name: string; path: string; onDelete?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      setIsDeleted(true);
    }
  };

  return (
    <div>
      {!isDeleted && (<Modal
        className="h-[85%] w-[90%] max-w-none flex flex-col"
        title="File Preview"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <FilePreview path={path} />
      </Modal>
      )}
      {!isDeleted && (<Badge className="cursor-pointer flex gap-1 hover:bg-blue-600">
        <File size="15px" />
        <span onClick={() => setIsOpen(true)}>{name}</span>
        {onDelete && <span onClick={handleDelete}>&times; </span>}
      </Badge>
      )}
    </div>
  );
};

const FilePreview = ({ path }: { path: string }) => {
  const { data, download } = useFileDownload(false);
  const [text, setText] = useState("");
  const [csvdata, setCsvData] = useState<{ [k: string]: string }[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  useEffect(() => {
    download(path);
  }, [path]);

  useEffect(() => {
    data?.blob.text().then((text) => setText(text));
    if (data?.blob.type == "text/csv") {
      parseCsvAsync(data?.url).then((res: any) => {
        if (res?.meta?.fields) {
          setCsvHeaders(res.meta.fields ?? []);
        }
        if (res.data) {
          setCsvData(res.data);
        }
      });
    }
  }, [data]);

  if (data?.blob.type == "text/plain") {
    return <div className="flex-1 bg-gray-100 overflow-auto">{text}</div>;
  }
  if (data?.blob.type == "text/csv") {
    return (
      <div className="flex-1 bg-gray-100 overflow-auto">
        <Table className="h-[inherit] overflow-x-scroll overflow-y-scroll">
          <TableHeader>
            <TableRow>
              {csvHeaders.map((head) => {
                return (
                  <TableHead className="w-[100px]" key={head}>
                    {head}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {csvdata.map((row, index) => (
              <TableRow key={index}>
                {Object.keys(row).map((cell, index) => {
                  return (
                    <TableCell className="w-[100px]" key={index}>
                      {row[cell]}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  if (!data) {
    return null;
  }
  return <div>Preview Not Possible for {data?.blob.type}</div>;
};
