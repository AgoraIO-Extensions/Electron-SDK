declare module 'ffi-napi' {
  export type LibraryObjectDefinitionToLibraryDefinition<T> = {
    [K in keyof T]: T[K] extends [infer R, unknown[]]
      ? (...args: any[]) => R
      : never;
  };

  export type LibraryObject<T> = T;

  const ffi: {
    Library<T extends Record<string, unknown>>(
      libraryPath: string,
      definition: T
    ): LibraryObject<LibraryObjectDefinitionToLibraryDefinition<T>>;
  };

  export default ffi;
}
