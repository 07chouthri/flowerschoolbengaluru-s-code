import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import flowerSchoolLogo from "@/assets/flower-school-logo.png";
import { AuthButtons } from "@/components/auth/AuthButtons";

interface HeaderProps {
  onAdminClick: () => void;
  onNavigate: (section: string) => void;
}

const Header = ({ onAdminClick, onNavigate }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Classes & Programs", path: "/classes" },
    { name: "Calendar", path: "/calendar" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-pink-50/95 backdrop-blur supports-[backdrop-filter]:bg-pink-50/60 border-b border-pink-200">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo - Responsive sizing */}
          <Link to="/" className="flex items-center cursor-pointer">
            <img
              src={flowerSchoolLogo}
              alt="The Flower School"
              className="h-8 sm:h-10 md:h-12 w-auto mr-2 sm:mr-3"
            />
            <div className="flex flex-col">
              <h1 className="text-sm sm:text-lg md:text-xl font-sans font-bold text-pink-700 leading-tight">
                The Flower School
              </h1>
              <p className="text-xs text-muted-foreground hidden xs:block font-sans">Bengaluru</p>
            </div>
          </Link>

          {/* Desktop Navigation - Hidden on tablet and below */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm xl:text-base text-foreground hover:text-pink-600 transition font-medium whitespace-nowrap font-sans ${
                  location.pathname === item.path
                    ? "text-pink-600 border-b-2 border-pink-600"
                    : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Tablet Navigation - Visible only on medium screens */}
          <nav className="hidden md:flex lg:hidden items-center space-x-4">
            {navItems.slice(0, 3).map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm text-foreground hover:text-pink-600 transition font-medium ${
                  location.pathname === item.path
                    ? "text-pink-600 border-b-2 border-pink-600"
                    : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <AuthButtons />
          </div>

          {/* Mobile Menu - Visible on tablet and below */}
          <div className="md:hidden lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] sm:w-[320px] md:w-[400px] bg-pink-50 p-4"
              >
                <div className="flex flex-col space-y-3 sm:space-y-4 mt-6 sm:mt-8">
                  {/* Mobile Logo */}
                  <div className="flex items-center pb-4 border-b border-pink-200">
                    <img
                      src={flowerSchoolLogo}
                      alt="The Flower School"
                      className="h-8 w-auto mr-2"
                    />
                    <div>
                      <h2 className="text-lg font-playfair font-bold text-pink-700">
                        The Flower School
                      </h2>
                      <p className="text-xs text-muted-foreground">Bengaluru</p>
                    </div>
                  </div>

                  {/* Mobile Navigation Links */}
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-base sm:text-lg font-medium text-foreground hover:text-pink-600 transition-colors py-2 px-1 font-sans ${
                        location.pathname === item.path
                          ? "text-pink-600 font-semibold bg-pink-100 rounded-md"
                          : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  {/* Mobile Auth Section */}
                  <div className="pt-4 mt-4 border-t border-pink-200">
                    <div className="mobile-auth-wrapper">
                      <AuthButtons onMenuClose={() => setIsOpen(false)} />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Tablet Menu Button - Visible only on medium screens when nav is condensed */}
          <div className="hidden md:block lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[350px] bg-pink-50"
              >
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Tablet Logo */}
                  <div className="flex items-center pb-4 border-b border-pink-200">
                    <img
                      src={flowerSchoolLogo}
                      alt="The Flower School"
                      className="h-10 w-auto mr-3"
                    />
                    <div>
                      <h2 className="text-lg font-sans font-bold text-pink-700">
                        The Flower School
                      </h2>
                      <p className="text-xs text-muted-foreground font-sans">Bengaluru</p>
                    </div>
                  </div>

                  {/* All Navigation Links */}
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium text-foreground hover:text-pink-600 transition-colors py-2 font-sans ${
                        location.pathname === item.path
                          ? "text-pink-600 font-semibold bg-pink-100 rounded-md px-3"
                          : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  {/* Tablet Auth Section */}
                  <div className="pt-4 border-t border-pink-200">
                    <AuthButtons onMenuClose={() => setIsOpen(false)} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
