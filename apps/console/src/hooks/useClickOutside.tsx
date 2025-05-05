import { useEffect, useState } from "react";

export function useClickedOutside(ref: React.RefObject<HTMLElement | null>) {
  const [isClickedOutside, setIsClickedOutside] = useState(false);
  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsClickedOutside(true);
    } else {
      setIsClickedOutside(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
  return isClickedOutside;
}
