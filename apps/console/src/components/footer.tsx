export const Footer = () => {
  return (
    <footer className="border-t neutral-border-alpha-medium py-4 mt-8 px-10">
      <div className="container mx-auto text-center text-sm neutral-on-background-weak">
        <p>© {new Date().getFullYear()} Nuvix. All rights reserved.</p>
      </div>
    </footer>
  );
};
