import { useEffect } from "react";

const BASE_TITLE = "Club District | Social Shopping Mall";

/**
 * Sets the document <title> and auto-reverts on unmount.
 * @param {string} pageTitle - Page-specific title segment (e.g. "Login")
 */
export function usePageTitle(pageTitle) {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} | Club District` : BASE_TITLE;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [pageTitle]);
}
