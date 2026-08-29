import type { CreateMedia } from './media.types';

export const normalizeMediaFormValues = (values: CreateMedia): CreateMedia => {
  const optionalText = (value?: string): string | undefined => value?.trim() || undefined;

  return {
    ...values,
    title: values.title.trim(),
    url: values.url.trim(),
    description: optionalText(values.description),
    copyright: optionalText(values.copyright),
    contact: optionalText(values.contact),
    chiefEditor: optionalText(values.chiefEditor),
    address: optionalText(values.address),
    phone: optionalText(values.phone),
    email: optionalText(values.email),
  };
};
