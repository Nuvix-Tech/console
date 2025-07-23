import { Link } from "react-router";

export const Footer = () => {
  const year = new Date().getFullYear();

  const sections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "/features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Roadmap", href: "#" },
        { name: "Changelog", href: "#" },
        { name: "Documentation", href: "#" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { name: "Authentication", href: "#" },
        { name: "Database", href: "#" },
        { name: "Functions", href: "#" },
        { name: "Storage", href: "#" },
        { name: "Edge Computing", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Blog", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Press", href: "#" },
        { name: "Contact", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Community", href: "#" },
        { name: "Support", href: "#" },
        { name: "Status", href: "#" },
        { name: "Privacy", href: "#" },
        { name: "Terms", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-md justify-center items-center flex rotate-[30deg] font-bold">
                N
              </div>
              <span className="text-xl font-bold text-white">Nuvix</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-xs">
              Build scalable backends without infrastructure headaches. Deploy globally in seconds.
            </p>
            <div className="flex space-x-4">
              {["Twitter", "GitHub", "LinkedIn"].map((social) => (
                <a key={social} href="#" className="text-gray-400 hover:text-white">
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-gray-400 hover:text-orange-400">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {year} Nuvix. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-orange-400 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-400 text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-400 text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
