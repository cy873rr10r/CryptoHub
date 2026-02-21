import toast from "react-hot-toast";


export const notifySuccess = (message) => {
  toast.success(message, {
    style: {
      textAlign: 'center',
    },
  });
};

export const notifyError = (message) => {
  toast.error(message, {
    style: {
      textAlign: 'center',
    },
  });
};

export const notifyInfo = (message) => {
  toast(message, {
    style: {
      textAlign: 'center',
    },
  });
};