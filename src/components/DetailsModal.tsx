import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, MessageSquare } from 'lucide-react';

interface PersonDetails {
  type: 'member' | 'visitor';
  name: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  dateRegistered: string;
  lastVisit?: string;
  department?: string;
  status?: string;
  devocional?: string;
  agenda?: string;
}

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: PersonDetails;
}

export function DetailsModal({ isOpen, onClose, person }: DetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{person.name}</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
              person.type === 'member' 
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {person.type === 'member' ? 'Membro' : 'Visitante'}
            </span>
          </div>

          <div className="space-y-4">
            {person.email && (
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{person.email}</span>
              </div>
            )}

            {person.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{person.phone}</span>
              </div>
            )}

            {person.whatsapp && (
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{person.whatsapp} (WhatsApp)</span>
              </div>
            )}

            {person.address && (
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{person.address}</span>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-gray-600">
                  Registrado em: {person.dateRegistered}
                </p>
                {person.lastVisit && (
                  <p className="text-gray-600 text-sm">
                    Última visita: {person.lastVisit}
                  </p>
                )}
              </div>
            </div>

            {person.type === 'member' && (
              <div className="border-t pt-4 mt-4">
                <p className="text-gray-600">
                  <span className="font-medium">Departamento:</span> {person.department}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Status:</span> {person.status}
                </p>
              </div>
            )}

            {person.type === 'visitor' && (person.devocional || person.agenda) && (
              <div className="border-t pt-4 mt-4">
                {person.devocional && (
                  <p className="text-gray-600">
                    <span className="font-medium">Receber Devocional:</span> {person.devocional}
                  </p>
                )}
                {person.agenda && (
                  <p className="text-gray-600">
                    <span className="font-medium">Receber Agenda:</span> {person.agenda}
                  </p>
                )}
              </div>
            )}

            <div className="border-t pt-4 mt-4">
              <button
                className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                onClick={() => {
                  // Future Evolution API integration will go here
                  console.log('Send message to:', person.phone || person.whatsapp);
                }}
              >
                <MessageSquare className="h-5 w-5" />
                <span>Enviar Mensagem</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}