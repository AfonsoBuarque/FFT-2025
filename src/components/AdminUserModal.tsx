import React, { useState, useEffect } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { FormInput } from './ui/FormInput';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useAuthContext } from '../contexts/AuthContext';

interface AdminUserFormData {
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

interface AdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROLE_OPTIONS = [
  'Admin',
  'Manager',
  'Editor',
  'Viewer'
];

const PERMISSION_OPTIONS = [
  'members.view',
  'members.create',
  'members.edit',
  'members.delete',
  'visitors.view',
  'visitors.create',
  'visitors.edit',
  'visitors.delete',
  'messages.send',
  'settings.view',
  'settings.edit'
];

export default function AdminUserModal({ isOpen, onClose }: AdminUserModalProps) {
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const { user } = useAuthContext();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AdminUserFormData>();

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) return;

      try {
        setLoading(true);
        
        // First check if there are any admin users
        const { count: adminCount } = await supabase
          .from('admin_users')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'Admin');

        // If no admins exist, first user becomes admin
        if (adminCount === 0) {
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        // Otherwise check if current user is admin
        const { data, error } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'Admin')
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setIsAdmin(!!data?.role);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    if (isOpen) {
      checkAdminStatus();
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: AdminUserFormData) => {
    if (!isAdmin) {
      addToast('Você não tem permissão para criar usuários administradores', 'error');
      return;
    }

    try {
      setSaving(true);

      // Check for existing invites for this email
      const { data: existingInvite } = await supabase
        .from('admin_invites')
        .select('status')
        .eq('email', data.email)
        .maybeSingle();

      if (existingInvite) {
        throw new Error('Já existe um convite pendente para este email');
      }

      // Check for existing admin user with this email
      const { data: existingUser } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', data.email)
        .maybeSingle();

      if (existingUser) {
        throw new Error('Este email já está registrado como administrador');
      }

      // Create invite with properly formatted permissions
      const { data: invite, error: inviteError } = await supabase
        .from('admin_invites')
        .insert({
          email: data.email,
          name: data.name,
          role: data.role,
          permissions: data.permissions,
          invited_by: user?.id,
          status: 'pending'
        })
        .select('id, token')
        .single();

      if (inviteError) throw inviteError;

      // Generate invite link
      const inviteLink = `${window.location.origin}/admin/invite/${invite.token}`;

      // Send invite email via webhook with invite link
      await fetch('https://n8n-n8n-onlychurch.ibnltq.easypanel.host/webhook/admin-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          role: data.role,
          invite_link: inviteLink,
          invite_id: invite.id
        })
      });

      addToast('Convite enviado com sucesso!', 'success');
      reset();
      onClose();
    } catch (error: any) {
      console.error('Error creating admin invite:', error);
      addToast(error.message || 'Erro ao criar convite', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          <div className="text-center">
            <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso Negado</h3>
            <p className="text-gray-500 mb-4">
              Você não tem permissão para criar usuários administradores.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-2">
            <UserPlus className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">Convidar Administrador</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <FormInput
            label="Nome Completo"
            type="text"
            registration={register('name', { required: 'Nome é obrigatório' })}
            error={errors.name?.message}
          />

          <FormInput
            label="Email"
            type="email"
            registration={register('email', {
              required: 'Email é obrigatório',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido'
              }
            })}
            error={errors.email?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Função
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
              {...register('role', { required: 'Função é obrigatória' })}
            >
              <option value="">Selecione uma função</option>
              {ROLE_OPTIONS.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            {errors.role && (
              <span className="text-red-500 text-sm">{errors.role.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Permissões
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
              {PERMISSION_OPTIONS.map(permission => (
                <label key={permission} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={permission}
                    {...register('permissions', {
                      required: 'Selecione pelo menos uma permissão'
                    })}
                    className="rounded border-gray-300 text-gray-800 focus:ring-gray-800"
                  />
                  <span className="text-sm text-gray-700">{permission}</span>
                </label>
              ))}
            </div>
            {errors.permissions && (
              <span className="text-red-500 text-sm">{errors.permissions.message}</span>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
            >
              {saving ? <LoadingSpinner /> : 'Enviar Convite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}