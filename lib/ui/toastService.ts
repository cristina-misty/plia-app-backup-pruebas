import { toast } from "sonner";

/**
 * Muestra un toast de éxito
 */
export const toastSuccess = (title?: string, description?: string) =>
  toast.success(title, {
    description,
    duration: 3500,
  });

/**
 * Muestra un toast de error
 */
export const toastError = (title: string, description?: string) =>
  toast.error(title, {
    description,
    duration: 4000,
  });

/**
 * Muestra un toast informativo
 */
export const toastInfo = (title?: string, description?: string) =>
  toast.info(title, {
    description,
    duration: 3000,
  });

/**
 * Muestra un toast asociado a una promesa
 * (útil para peticiones async)
 */
export const toastPromise = <T>(
  promise: Promise<T>,
  messages: { loading?: string; success?: string; error?: string }
) => {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
};
