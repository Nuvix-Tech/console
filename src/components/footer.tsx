export const Footer = () => {
  return (
    <footer className="border-t border-fg-subtle py-4 mt-8 px-10">
      <div className="container mx-auto text-center text-sm text-fg-muted">
        <p>© {new Date().getFullYear()} Nuvix. All rights reserved.</p>
      </div>
    </footer>
  );
};
