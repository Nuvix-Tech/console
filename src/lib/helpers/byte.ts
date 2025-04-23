export const convertByteaToHex = (value: { type: "Buffer"; data: number[] }) => {
  // [Alaister] this is just a safeguard to catch sneaky null values
  try {
    return `\\x${Buffer.from(value.data).toString("hex")}`;
  } catch {
    return value;
  }
};
