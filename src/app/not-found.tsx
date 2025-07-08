'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { i18n } from '@/lib/i18n/i18n-config';

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Crear partículas flotantes
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  return (
    <div 
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
      onMouseMove={handleMouseMove}
    >
      {/* Partículas flotantes */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}

      {/* Efecto de seguimiento del mouse */}
      <div
        className="absolute w-96 h-96 bg-gradient-radial from-cyan-400/20 to-transparent rounded-full pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center p-6">
        {/* Número 404 animado */}
        <div className="relative mb-8">
          <h1 className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-pulse-slow">
            404
          </h1>
          <div className="absolute inset-0 text-9xl md:text-[12rem] font-black text-white/10 animate-bounce-slow">
            404
          </div>
        </div>

        {/* Robot perdido animado */}
        <div className="mb-8 relative">
          <div className="text-8xl animate-wiggle">🤖</div>
          <div className="absolute -top-2 -right-2 text-2xl animate-spin-slow">💫</div>
          <div className="absolute -bottom-2 -left-2 text-xl animate-bounce">❓</div>
        </div>

        {/* Texto principal */}
        <div className="mb-8 space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold text-white animate-slide-in-up">
            ¡Oops! Página no encontrada
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 animate-slide-in-up animation-delay-200">
            Parece que esta página se fue de vacaciones 🏖️
          </p>
          <p className="text-lg text-gray-400 animate-slide-in-up animation-delay-400">
            No te preocupes, nuestro robot está trabajando para encontrarla
          </p>
        </div>

        {/* Botones animados */}
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-up animation-delay-600">
          <Link 
            href={`/${i18n.defaultLocale}`}
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <span className="relative z-10 flex items-center gap-2">
              🏠 Volver al inicio
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </Link>

          <button 
            onClick={() => window.history.back()}
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
          >
            <span className="relative z-10 flex items-center gap-2">
              ⬅️ Página anterior
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </button>
        </div>

        {/* Mensaje divertido */}
        <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 animate-slide-in-up animation-delay-800">
          <p className="text-gray-300 text-sm">
            💡 <strong>Dato curioso:</strong> Esta página está tan perdida que ni Google Maps la encuentra
          </p>
        </div>

        {/* Elementos decorativos flotantes */}
        <div className="absolute top-20 left-10 text-4xl animate-float animation-delay-1000">🌟</div>
        <div className="absolute top-40 right-20 text-3xl animate-float animation-delay-1500">✨</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-float animation-delay-2000">🚀</div>
        <div className="absolute bottom-40 right-10 text-3xl animate-float animation-delay-2500">🎈</div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-2500 {
          animation-delay: 2.5s;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}

