declare module 'gray-matter' {
  interface GrayMatterFile<T> {
    data: T;
    content: string;
    excerpt?: string;
  }

  function matter<T>(input: string): GrayMatterFile<T>;

  export = matter;
}
