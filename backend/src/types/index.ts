export type QueryResult = {
  count: number;
  data: any;
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

export interface ILink {
  href: string;
  rel: string;
  textContent: string;
}

export interface IImage {
  src: string;
  alt: string;
}

export interface IResponseData<T> {
  count: number;
  data: T[];
}

export interface IParseNews {
  news: {
    mediaId: number;
    externalId: string;
    externalCode: string;
    date: Date;
    header: string;
    summary: string;
    text: string;
    url: string;
  };
  links: ILink[];
  images: IImage[];
}
