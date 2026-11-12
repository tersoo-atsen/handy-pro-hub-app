/// <reference types="next" />
/// <reference types="next/image-types/global" />

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
