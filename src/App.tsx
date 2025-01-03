import React from 'react';
import { Header } from './components/Header';
import { Features } from './components/Features';
import { ChatDemo } from './components/ChatDemo';
import { CTA } from './components/CTA';
import { TypebotChat } from './components/TypebotChat';
import { WaveBackground } from './components/WaveBackground';

export default function App() {
  return (
    <div className="min-h-screen bg-[#D3D3D3] relative overflow-hidden">
      <WaveBackground />
      <div className="relative z-10">
        <Header />
        <Features />
        <ChatDemo />
        <CTA />
        <TypebotChat />
      </div>
    </div>
  );
}