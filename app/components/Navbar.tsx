

'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = pathname === href;
    
    const handleClick = (e: React.MouseEvent) => {
        if (href === '#features') {
          e.preventDefault();
          scrollToSection('features');
        } else if (href === '/#features') {
          e.preventDefault();
          scrollToSection('features');
        } else if (href === '/#about') {
          e.preventDefault();
          scrollToSection('about');
        }
      };

    return (
      <div className="relative group">
        <Link 
          href={href} 
          onClick={handleClick} 
          className={`text-sm transition ${
            isMenuOpen 
              ? 'text-white hover:text-purple-400 block py-3 px-4' 
              : 'text-gray-300 hover:text-white'
          }`}
        >
          {children}
        </Link>
        <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300 ${
          isActive ? 'bg-white scale-100' : 'bg-purple-500/0 scale-0 group-hover:scale-100 group-hover:bg-purple-500/50'
        } ${isMenuOpen ? 'hidden' : ''}`} />
      </div>
    );
  };

  return (
    <nav className="relative top-0 z-50 bg-black/50 backdrop-blur-sm border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex-shrink-0">
            <span className="text-xl md:text-2xl font-bold">
              E<span className="text-2xl md:text-4xl relative top-1 text-purple-500">X</span>amEase
            </span>
          </Link>
          
          <div className="flex-grow flex justify-center">
            <div className="hidden md:flex items-center gap-12">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/#features">Features</NavLink>
              <NavLink href="/#about">About</NavLink>
            </div>
          </div>
          
          <div className="hidden md:block flex-shrink-0">
            <Link
              href="/signin"
              className="bg-white text-black px-5 py-3.5 rounded-xl text-sm hover:bg-gray-100 transition"
            >
              Login →
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-purple-400 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <HiX className="w-6 h-6" />
              ) : (
                <HiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-80 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="py-4 space-y-2 bg-black/80 backdrop-blur-sm rounded-lg mt-2 border border-white/10">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/#features">Features</NavLink>
            <NavLink href="/#about">About</NavLink>
            <div className="px-4 pt-2">
              <Link
                href="/signin"
                className="block w-full text-center bg-white text-black py-3 rounded-lg text-sm hover:bg-gray-100 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Login →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}