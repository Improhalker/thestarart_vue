export function toFormData<T extends object>(data: T): FormData {
  const formData = new FormData();

  (Object.entries(data) as Array<[string, unknown]>).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (Array.isArray(value)) {
      if (value.length === 0) formData.append(key, "");
      value.forEach(item => formData.append(`${key}[]`, String(item)));
      return;
    }

    if (typeof value === "boolean") {
      formData.append(key, value ? "1" : "0");
      return;
    }

    if (value instanceof Blob) formData.append(key, value);
    else formData.append(key, String(value));
  });

  return formData;
}
