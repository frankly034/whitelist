export interface DynamicObject<T> {
  [key: string]: T;
}

export interface IWhitelist {
  ips: string[],
  path: string,
}