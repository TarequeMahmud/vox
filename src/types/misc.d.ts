type AlertContextType = {
  message: string;
  type: "error" | "success" | "";
  showAlert: (msg: string, type?: "error" | "success") => void;
  clearAlert: () => void;
};

type AlertType = "success" | "error" | "";
