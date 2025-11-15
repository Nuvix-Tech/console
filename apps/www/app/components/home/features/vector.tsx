import { FlickeringGrid } from "~/magicui/flickering-grid";

export const Vector = () => {
  return (
    <>
      <div className="relative flex items-center justify-center w-full h-full">
        <FlickeringGrid color="#7a764c" className="absolute inset-0 z-0" />
      </div>
    </>
  );
};
