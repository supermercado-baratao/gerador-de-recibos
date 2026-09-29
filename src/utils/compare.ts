export const hasChanges = <T extends object>(saved: T, data: Partial<T>) =>
  (Object.keys(data) as (keyof T)[]).some((key) => saved[key] !== data[key])

export const omitMetadata = <
  T extends { id: string; createdAt: unknown; updatedAt: unknown }
>({
  id,
  createdAt,
  updatedAt,
  ...data
}: T): Omit<T, 'id' | 'createdAt' | 'updatedAt'> => data
