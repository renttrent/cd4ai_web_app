import Papa from "papaparse";

import { type ClassValue, clsx } from "clsx";

import { twMerge } from "tailwind-merge";
import csv from "csv-parser";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatDate = (d: string) => {
  const date = new Date(d)
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
    .split(" ")
    .join(" ");
  return date;
};

export const shortFormatDate = (d: string) => {
  const date = new Date(d)
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
    .split(" ")
    .join(" ");
  return date;
};

export const getFileName = (path: string) => {
  const last = path.split("/").pop();
  const fileName = last?.split("-").pop();
  return fileName;
};

export const parseCsvAsync = function (fileUrl: string) {
  return new Promise(function (complete, error) {
    Papa.parse(fileUrl, { download: true, header: true, complete, error });
  });
};
