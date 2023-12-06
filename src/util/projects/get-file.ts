import { axios } from "../axios";

export const getFile = async (path: string) => {
  const res = await axios.get(`/file/get/${path}`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  return { url: url, blob: res.data as Blob };
};
