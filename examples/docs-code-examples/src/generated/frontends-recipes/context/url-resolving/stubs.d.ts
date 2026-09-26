declare module "#imports" {
  export function useLocalePath(): (route: {
    path: string;
    query?: Record<string, unknown>;
  }) => string;
}

export {};
