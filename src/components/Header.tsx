import React from 'react';
import { ChevronRight } from 'lucide-react';
import { NavLink } from './NavLink';
import { MobileMenu } from './MobileMenu';
import { Logo } from './Logo';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-[#D3D3D3]/50 to-[#C0C0C0]/50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo />
            <span className="text-xl font-bold text-gray-800">FaithFlow Tech</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <NavLink href="#features">Recursos</NavLink>
            <NavLink href="#demo">Demonstração</NavLink>
            <NavLink href="#contact">Contato</NavLink>
          </div>
          <MobileMenu />
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
              Tecnologia a Serviço da Fé
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
              Transforme a maneira como sua igreja gerencia membros e visitantes com nossa solução impulsionada por IA.
            </p>
            <a href="#demo" className="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition">
              Experimente Grátis por 15 dias
              <ChevronRight className="ml-2 h-5 w-5" />
            </a>
          </div>
          <div className="w-full md:w-1/2 mt-8 md:mt-0 px-4 md:px-0">
            <img 
              src="https://i.postimg.cc/xCdgXVG9/istockphoto-1386871386-1024x1024.png"
              alt="Igreja moderna"
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </header>
  );
}