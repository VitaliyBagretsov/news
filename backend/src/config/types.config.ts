export interface IParseConfig {
  baseUrl: string;
  selectors: { [key: string]: string };
  externalCode: (url: string) => string;
  externalId: (url: string) => string;
  getDate: (element: HTMLElement) => Date
}

export interface IListNews {
  date: string;
  text: string;
  url: string;
}

export interface INews {
  id: string;
  number: number;
  baseUrl: string;
  url: string;
  tag: string;
  title: string;
  image: string;
  summary: string;
  text: string;
  date: string;
}
