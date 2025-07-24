let Link: any;

try {
  Link = (await import("next/link")).default;
} catch {
  // @ts-ignore
  Link = (await import("react-router")).Link;
}

export { Link };
