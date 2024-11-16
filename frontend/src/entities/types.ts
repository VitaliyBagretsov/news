export type QueryResult<T> = {
  count: number;
  data: T[];
};

export interface IMedia {
  id: number;
  title: string;
  description: string;
  url: string;
  copyright: string;
  contact: string;
  chiefEditor: string;
  address: string;
  email: string;
  phone: string;
  isActive: boolean;
  logo: string;
}

export interface INews {
  id: number;
  mediaId: number;
  externalId: string;
  externalCode: string;
  date: Date;
  header: string;
  summary: string;
  text: string;
  url: string;
}
