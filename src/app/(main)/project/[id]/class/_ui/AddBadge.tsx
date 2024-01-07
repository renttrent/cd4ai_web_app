import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverClose, PopoverTrigger } from "@radix-ui/react-popover";
import { useState } from "react";

export const AddBadge = ({ onAdd }: { onAdd: (data: string) => void }) => {
  const [value, setValue] = useState("");

  return (
    <Popover>
      <PopoverTrigger>
        <Badge>
          <span className="">+</span>
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="flex gap-2 p-2">
        <div className="flex flex-1 flex-row gap-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder=""
          />
        </div>
        <PopoverClose>
          <Button
            onClick={() => {
              onAdd(value);
              setValue("");
            }}
          >
            Add
          </Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
};
