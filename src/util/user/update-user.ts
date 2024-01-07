import { axios } from "../axios";

interface UpdateUserRequest {
  firstname?: string;
  lastname?: string;
  password?: string;
  en_model?: string;
  de_model?: string;
}

export async function updateUser(request: UpdateUserRequest) {
  await axios.put("/user", request, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function resetUserSettings() {
  await axios.put("/user/reset-default-settings");
}
