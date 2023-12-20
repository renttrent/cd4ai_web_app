import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button, ButtonProps } from "../ui/button";

export const ConfirmPopover = ({
  children,
  title,
  description,
  onConfirm,
  actionName = "Confirm",
  variant,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  onConfirm?: () => void;
  actionName?: string;
  variant?: ButtonProps["variant"];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover modal open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent align="end" sideOffset={10}>
        <div className="flex flex-col gap-2 ">
          <div className="text-sm font-medium text-gray-800">{title}</div>
          <div className="text-sm text-gray-600">{description}</div>
          <div className="flex justify-between gap-2 flex-wrap">
            <Button
              onClick={() => setOpen(false)}
              variant="ghost"
              className="mt-2"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                onConfirm?.();
              }}
              variant={variant}
              className="mt-2"
            >
              {actionName}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
