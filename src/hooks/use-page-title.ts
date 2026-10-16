import { useEffect } from "react";

const BASE = "ScholarMate";

export function usePageTitle(title?: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} | ${BASE}` : previous;
    return () => { document.title = previous; };
  }, [title]);
}
