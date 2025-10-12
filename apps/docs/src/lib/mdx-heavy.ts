export function parseMetaString(meta: string | null | undefined): Record<string, string> {
  if (!meta) {
    return {};
  }

  const map: Record<string, string> = {};

  // If there is no '=', treat the whole meta as a trimmed title
  if (!meta.includes("=")) {
    map["title"] = meta.trim();
    return map;
  }

  // Match: key="value", key='value', key=value (no quotes), key (standalone)
  // We'll use a robust regex that matches all patterns
  // Updated to support hyphens in attribute names
  const metaRegex = /([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s"']+)))?/g;
  let match: RegExpExecArray | null;

  while ((match = metaRegex.exec(meta)) !== null) {
    const name = match[1];
    const value = match[2] ?? match[3] ?? match[4];
    // If key is alone (no value at all), treat as boolean true string
    map[name] = value !== undefined ? value : "true";
  }

  if (map.lineNumbers !== undefined) {
    map["data-line-numbers"] = map["lineNumbers"];
    delete map["lineNumbers"];
  }

  return map;
}
