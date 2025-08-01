import qs from 'qs';

export const filterNullValues = (obj: Record<string, unknown> = {}) => {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v));
};

export const buildQueryString = <T extends object>(payload?: T): string =>
  qs.stringify(filterNullValues(payload ?? {}), { skipNulls: true });
