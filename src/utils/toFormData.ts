export function toFormData<T extends Record<string, any>>(data: T): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach(item => formData.append(`${key}[]`, item));
      return;
    }

    formData.append(key, value);
  });

  return formData;
}