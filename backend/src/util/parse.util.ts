import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '@constants/news.const';
import { QueryDto } from '@dto/query.dto';
import { IImage, ILink } from '@types';
import { In, ILike } from 'typeorm';

export const calculateSkip = (pageNumber: number, perPage: number): number => {
  return pageNumber
    ? pageNumber * (perPage ?? DEFAULT_LIMIT) - perPage
    : DEFAULT_OFFSET;
};

export const getWhereFromQuery = (filter) => {
  return filter
    ? Object.entries(filter).reduce(
        (result, [key, value]) => ({
          ...result,
          [`${key}`]: Array.isArray(value) ? In(value) : value,
        }),
        {},
      )
    : {};
};

export const getSearchFromQuery = (search: any) => {
  return search
    ? Object.entries(search).reduce(
        (result, [key, value]) => ({
          ...result,
          [`${key}`]: Array.isArray(value)
            ? In(value.map((elem) => ILike(`%${elem}%`)))
            : ILike(`%${value}%`),
        }),
        {},
      )
    : {};
};

export const getSortFromQuery = (sort: any) => {
  return sort
    ? Object.entries(sort).reduce(
        (acc, [key, value]) => ({ ...acc, [`"${key}"`]: value }),

        {},
      )
    : {};
};

const wrapColumnsToEscaping = (
  columns: (string | number | symbol)[],
): string => {
  return columns.reduce((prev, curr) => {
    return prev
      ? `${prev.toString()}, "${curr.toString()}"`
      : `"${curr.toString()}"`;
  }, '') as string;
};

export const prepareQuery = (query: QueryDto) => {
  return {
    limit: query.limit ?? DEFAULT_LIMIT,
    skip: calculateSkip(query.page, query.limit),
    where: getWhereFromQuery(query.filter),
    search: getSearchFromQuery(query.search),
    sort: getSortFromQuery(query.sort),
    select: query.columns ? wrapColumnsToEscaping(query.columns) : '',
    // wrappedWhere: getWrappedOptionFromQuery(query.filter),
    // wrappedSort: getWrappedSortFromQuery(query.sort),
    // wrappedSearch: getWrappedOptionSearchFromQuery(query.search),
    // between: getBetweenFromQuery(query.between),
  };
};

export const getText = (article: HTMLElement, selector: string): string => {
  return selector
    ? Array.from(article.querySelectorAll(selector)).reduce(
        (prev, curr: HTMLElement) => {
          return prev + curr.textContent;
        },
        '',
      )
    : '';
};

export const getLinks = (article: HTMLElement, selector: string): ILink[] => {
  return selector
    ? Array.from(article.querySelectorAll(selector))?.map(
        (element: HTMLAnchorElement) => ({
          href: element.href,
          rel: element.rel,
          textContent: element.textContent,
        }),
      )
    : [];
};

export const getImages = (article: HTMLElement, selector: string): IImage[] => {
  return selector
    ? Array.from(article.querySelectorAll(selector))?.map(
        (element: HTMLImageElement) => ({
          src: element.src,
          alt: element.alt,
        }),
      )
    : [];
};
