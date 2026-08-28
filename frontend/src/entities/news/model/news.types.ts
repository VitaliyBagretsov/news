export interface News {
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
