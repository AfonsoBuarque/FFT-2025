import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Bell,
  TrendingUp,
  TrendingDown,
  UserPlus,
  ChevronRight,
  History
} from 'lucide-react';
import { Header } from '../components/Header';
import { ClientVerification } from '../components/ClientVerification';
import { DetailsModal } from '../components/DetailsModal';
import { VisitorRegistrationModal } from '../components/VisitorRegistrationModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface Visitor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  whatsapp: string;
  endereco: string;
  data_visita: string;
  receber_devocional: string;
  receber_agenda: string;
}

export function Dashboard() {
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [visitorChange, setVisitorChange] = useState<number>(0);
  const [recentVisitors, setRecentVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total de Membros',
      value: '256',
      change: '+12%',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Visitantes',
      value: visitorCount.toString(),
      change: `${visitorChange >= 0 ? '+' : ''}${visitorChange}%`,
      icon: UserPlus,
      color: 'green'
    },
    {
      title: 'Eventos',
      value: '12',
      change: '+5%',
      icon: Calendar,
      color: 'purple'
    },
    {
      title: 'Mensagens',
      value: '89',
      change: '+18%',
      icon: MessageSquare,
      color: 'yellow'
    }
  ];

  const quickActions = [
    {
      title: 'Cadastrar Visitante',
      icon: UserPlus,
      color: 'green',
      onClick: () => setIsVisitorModalOpen(true)
    },
    {
      title: 'Histórico de Visitantes',
      icon: History,
      color: 'blue',
      onClick: () => navigate('/visitors')
    },
    {
      title: 'Novo Evento',
      icon: Calendar,
      color: 'purple',
      onClick: () => {}
    },
    {
      title: 'Configurações',
      icon: Settings,
      color: 'gray',
      onClick: () => navigate('/settings')
    }
  ];

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

        // Get current period count (last 30 days)
        const { count: currentCount, error: currentError } = await supabase
          .from('cadastro_visitantes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('data_visita', thirtyDaysAgo.toISOString())
          .lte('data_visita', now.toISOString());

        if (currentError) throw currentError;

        // Get previous period count (30-60 days ago)
        const { count: previousCount, error: previousError } = await supabase
          .from('cadastro_visitantes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('data_visita', sixtyDaysAgo.toISOString())
          .lt('data_visita', thirtyDaysAgo.toISOString());

        if (previousError) throw previousError;

        // Get recent visitors
        const { data: visitors, error: visitorsError } = await supabase
          .from('cadastro_visitantes')
          .select('*')
          .eq('user_id', user.id)
          .order('data_visita', { ascending: false })
          .limit(5);

        if (visitorsError) throw visitorsError;

        // Calculate percentage change
        const current = currentCount || 0;
        const previous = previousCount || 0;
        setVisitorCount(current);
        
        if (previous === 0) {
          setVisitorChange(current > 0 ? 100 : 0);
        } else {
          const change = ((current - previous) / previous) * 100;
          setVisitorChange(Math.round(change));
        }

        setRecentVisitors(visitors || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <ClientVerification />
        
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bem-vindo de volta!</h1>
              <p className="text-gray-600">Aqui está um resumo da sua igreja</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                  <div className="flex items-center space-x-1">
                    {stat.change.startsWith('+') ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-lg bg-${action.color}-100 flex items-center justify-center`}>
                  <action.icon className={`h-6 w-6 text-${action.color}-600`} />
                </div>
                <span className="text-gray-900 font-medium">{action.title}</span>
                <ChevronRight className="h-5 w-5 text-gray-400 ml-auto" />
              </button>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Atividade Recente</h2>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-6">
                {recentVisitors.map((visitor) => (
                  <div key={visitor.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <UserPlus className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">Novo visitante registrado</p>
                        <p className="text-gray-600 text-sm">{visitor.nome}</p>
                        <p className="text-gray-500 text-sm">
                          {new Date(visitor.data_visita).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedPerson({
                        type: 'visitor',
                        name: visitor.nome,
                        email: visitor.email,
                        phone: visitor.telefone,
                        whatsapp: visitor.whatsapp,
                        address: visitor.endereco,
                        dateRegistered: new Date(visitor.data_visita).toLocaleDateString('pt-BR'),
                        lastVisit: new Date(visitor.data_visita).toLocaleDateString('pt-BR'),
                        devocional: visitor.receber_devocional,
                        agenda: visitor.receber_agenda
                      })}
                      className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                    >
                      Ver detalhes
                    </button>
                  </div>
                ))}

                {recentVisitors.length === 0 && (
                  <p className="text-center text-gray-500">Nenhum visitante registrado recentemente</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <VisitorRegistrationModal 
          isOpen={isVisitorModalOpen}
          onClose={() => setIsVisitorModalOpen(false)}
        />

        <DetailsModal 
          isOpen={!!selectedPerson}
          onClose={() => setSelectedPerson(null)}
          person={selectedPerson}
        />
      </div>
    </>
  );
}