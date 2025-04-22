import axios from "axios";

export const setupAxiosInterceptors = (
  showAlert: (msg: string, type?: "error" | "success") => void
) => {
  axios.interceptors.response.use(
    (res) => res,
    (err) => {
      const msg =
        err.response?.data?.error || err.message || "Something went wrong";
      showAlert(msg);
      return Promise.reject(err);
    }
  );
};
