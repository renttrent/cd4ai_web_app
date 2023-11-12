"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, UseFormProps, UseFormReturn } from "react-hook-form";
import { ObjectSchema } from "yup";

export type UseValidatedFormProps<TFieldValues extends FieldValues> = Omit<
  UseFormProps<TFieldValues>,
  "resolver"
> & {
  schema: ObjectSchema<TFieldValues>;
};

export const useValidatedForm = <TFieldValues extends FieldValues>({
  schema,
  ...props
}: UseValidatedFormProps<TFieldValues>): UseFormReturn<TFieldValues> => {
  const resolver = useMemo(
    () => yupResolver(schema as ObjectSchema<any>),
    [schema]
  );

  return useForm({
    resolver,
    ...props,
  });
};
