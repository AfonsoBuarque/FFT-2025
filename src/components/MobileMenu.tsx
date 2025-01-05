import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavLink } from './NavLink';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-700 hover:text-gray-900"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg py-4 px-6 z-50">
          <nav className="flex flex-col space-y-4">
            <NavLink href="#features">Recursos</NavLink>
            <NavLink href="#demo">Demonstração</NavLink>
            <NavLink href="#contact">Contato</NavLink>
          </nav>
        </div>
      )}
    </div>
  );
}