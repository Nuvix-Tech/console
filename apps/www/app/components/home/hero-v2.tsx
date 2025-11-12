import { Column } from "@nuvix/ui/components";

export const HeroV2 = () => {
  return (
    <div className="mx-4 my-2">
      <Column
        minHeight={"xl"}
        solid="accent-weak"
        radius="xs"
        padding="8"
        onSolid="accent-weak"
      ></Column>
    </div>
  );
};
