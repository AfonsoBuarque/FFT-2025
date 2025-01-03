import React from 'react';
import { Cross } from 'lucide-react';

interface SuccessMessageProps {
  onClose: () => void;
}

export function SuccessMessage({ onClose }: SuccessMessageProps) {
  return (
    <div className="text-center py-8">
      <div className="mb-6">
        <Cross className="mx-auto h-16 w-16 text-gray-700" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Solicitação Enviada com Sucesso!
      </h3>
      <p className="text-gray-600 mb-8">
        Entraremos em contato em breve para agendar sua demonstração.
      </p>
      <button
        onClick={onClose}
        className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
      >
        Fechar
      </button>
    </div>
  );
}