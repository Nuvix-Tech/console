"use client";

import { useState, useCallback } from "react";
import { COOKIES_KEYS } from "../lib/constants";

function updateHtmlAttribute(value: string) {
  if (document.documentElement) {
    document.documentElement.setAttribute("data-neutral", value);
  }
}

function getPreferenceFromCookie() {
  try {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${COOKIES_KEYS.PREFERENCE}=`))
      ?.split("=")[1];
    if (cookieValue) {
      return JSON.parse(decodeURIComponent(cookieValue));
    }
  } catch {}
  return {};
}

export function usePreference() {
  const [preferences, setPreferences] = useState(() => getPreferenceFromCookie());

  const setPref = useCallback(({ neutral }: { neutral: string }) => {
    const data = JSON.stringify({ neutral });
    const encodedData = encodeURIComponent(data);

    const cookieString = `${COOKIES_KEYS.PREFERENCE}=${encodedData}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=Lax`;
    document.cookie = cookieString;

    updateHtmlAttribute(neutral);

    // Update the local state to reflect the new preferences
    setPreferences({ neutral });
  }, []);

  const getPref = useCallback(() => preferences, [preferences]);

  return { setPref, getPref };
}
