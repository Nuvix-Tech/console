"use client";

import { COOKIES_KEYS } from "../lib/constants";

function updateHtmlAttribute(value: string) {
  if (document.documentElement) {
    document.documentElement.setAttribute("data-neutral", value);
  }
}

export function usePreference() {
  const setPref = ({ neutral }: { neutral: string }) => {
    const data = JSON.stringify({ neutral });
    const encodedData = encodeURIComponent(data);

    const cookieString = `${COOKIES_KEYS.PREFERENCE}=${encodedData}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=Lax`;
    document.cookie = cookieString;

    updateHtmlAttribute(neutral);
  };

  return { setPref };
}
