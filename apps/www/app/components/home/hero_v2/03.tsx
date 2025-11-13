"use client";
import { Icon } from "@nuvix/ui/components";
import { OrbitingCircles } from "components/magicui/orbiting-circles";

// Will Check Later
export const O3 = () => {
  return (
    <div className="relative min-h-[500px] size-full overflow-hidden">
      <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden">
        <OrbitingCircles iconSize={40}>
          <Icon name="authentication" decorative size="xl" onBackground="accent-strong" />
          <Icon name="messaging" decorative size="xl" onBackground="accent-strong" />
          <Icon name="database" decorative size="xl" onBackground="accent-strong" />
          <Icon name="storage" decorative size="xl" onBackground="accent-strong" />
        </OrbitingCircles>
        <OrbitingCircles iconSize={30} radius={100} reverse speed={2}>
          <Icon name="document" decorative size="l" onBackground="accent-medium" />
          <Icon name="table" decorative size="l" onBackground="accent-medium" />
          <Icon name="runner" decorative size="l" onBackground="accent-medium" />
          <Icon name="relationship" decorative size="l" onBackground="accent-medium" />
        </OrbitingCircles>
      </div>
    </div>
  );
};
