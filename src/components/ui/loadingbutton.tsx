import { PulseLoader } from "react-spinners";
import { Button, ButtonProps } from "./button";
import React from "react";

export const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { isLoading?: boolean }
>(({ children, isLoading, ...props }, ref) => {
  return (
    <Button {...props} ref={ref}>
      {isLoading ? <PulseLoader size={7} color="white" /> : children}
    </Button>
  );
});
