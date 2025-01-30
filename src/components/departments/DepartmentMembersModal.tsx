import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../contexts/ToastContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface DepartmentMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentName: string;
}

interface Member {
  id: string;
  nome_completo: string;
  email: string;
  telefone: string;
  celular: string;
  cargo_ministerial: string;
  foto_url: string | null;
}

export function DepartmentMembersModal({ isOpen, onClose, departmentName }: DepartmentMembersModalProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useToast();
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user || !isOpen || !departmentName) return;

    async function fetchMembers() {
      try {
        const { data, error } = await supabase
          .from('membros')
          .select('*')
          .eq('user_id', user.id)
          .eq('departamento', departmentName)
          .order('nome_completo');

        if (error) throw error;
        setMembers(data || []);
      } catch (error) {
        console.error('Error fetching members:', error);
        addToast('Erro ao carregar membros', 'error');
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, [user, isOpen, departmentName, addToast]);

  if (!isOpen) return null;

  const filteredMembers = members.filter(member =>
    member.nome_completo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Membros do Departamento</h2>
            <p className="text-sm text-gray-600 mt-1">
              {departmentName} - Total de membros: <span className="font-semibold">{members.length}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-800"
              />
            </div>
          </div>

          {/* Members List */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 250px)' }}>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <LoadingSpinner />
              </div>
            ) : filteredMembers.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Membro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cargo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {member.foto_url ? (
                            <img
                              src={member.foto_url}
                              alt={member.nome_completo}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserPlus className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {member.nome_completo}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{member.email}</div>
                        <div className="text-sm text-gray-500">
                          {member.celular || member.telefone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {member.cargo_ministerial || 'Membro'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum membro encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}