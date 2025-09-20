import { FlickeringGrid } from "~/magicui/flickering-grid";

export const Vector = () => {
  return (
    <>
      <div className="relative flex items-center justify-center w-full h-full">
        <FlickeringGrid color="#68a0a6" className="absolute inset-0 z-0" />
      </div>
    </>
  );
};
