import { SmartLink } from "@nuvix/ui/components";
import { ComponentProps, forwardRef, useRef } from "react";

type LinkProps = ComponentProps<typeof SmartLink>;

export interface PrefetchableLinkProps extends Omit<LinkProps, "onMouseEnter" | "onMouseLeave"> {
  prefetcher: () => void;
}

const DELAY = 75;

const PrefetchableLink = forwardRef<HTMLAnchorElement, PrefetchableLinkProps>(
  function PrefetchableLink({ prefetcher, children, ...props }, ref) {
    const mouseOverStartRef = useRef<number | null>(null);
    const prefetchTimeoutRef = useRef<number | null>(null);

    function onPrefetch() {
      const now = Date.now();

      // setTimeout is not guaranteed to be precise, so we need to check the time again
      if (mouseOverStartRef.current && now - mouseOverStartRef.current >= DELAY) {
        prefetcher();
      }
    }

    function onMouseEnter() {
      mouseOverStartRef.current = Date.now();
      prefetchTimeoutRef.current = window.setTimeout(onPrefetch, DELAY);
    }

    function onMouseLeave() {
      mouseOverStartRef.current = null;
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current);
        prefetchTimeoutRef.current = null;
      }
    }

    return (
      <SmartLink
        unstyled
        ref={ref}
        {...props}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </SmartLink>
    );
  },
);

export default PrefetchableLink;
