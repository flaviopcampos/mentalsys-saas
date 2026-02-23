import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  Settings,
  Plus,
  HelpCircle,
  BookOpen,
  Video,
  Play
} from 'lucide-react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import ClinicRegistrationWizard from '@/components/admin/ClinicRegistrationWizard';

// Tutorial em vídeo component
const VideoTutorial: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <Video className="w-6 h-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold">Tutoriais em Vídeo</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
          <h4 className="font-medium mb-2">📹 Cadastro de Clínicas</h4>
          <p className="text-sm text-gray-600 mb-3">
            Aprenda a cadastrar uma nova clínica em menos de 10 minutos
          </p>
          <Button size="sm" variant="outline" className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Assistir (3 min)
          </Button>
        </div>
        
        <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
          <h4 className="font-medium mb-2">📹 Gestão de Planos</h4>
          <p className="text-sm text-gray-600 mb-3">
            Configure planos de assinatura e gerencie preços
          </p>
          <Button size="sm" variant="outline" className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Assistir (5 min)
          </Button>
        </div>
        
        <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
          <h4 className="font-medium mb-2">📹 Dashboard Analytics</h4>
          <p className="text-sm text-gray-600 mb-3">
            Entenda as métricas e relatórios do sistema
          </p>
          <Button size="sm" variant="outline" className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Assistir (4 min)
          </Button>
        </div>
        
        <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
          <h4 className="font-medium mb-2">📹 Suporte e Configurações</h4>
          <p className="text-sm text-gray-600 mb-3">
            Configure suporte e personalize o sistema
          </p>
          <Button size="sm" variant="outline" className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Assistir (6 min)
          </Button>
        </div>
      </div>
    </div>
  );
};

// Help Center component
const HelpCenter: React.FC = () => {
  const faqs = [
    {
      question: "Como cadastrar uma nova clínica?",
      answer: "Use o assistente de cadastro em 3 passos simples. Preencha os dados da clínica, escolha um plano e configure o administrador. Leva menos de 10 minutos!"
    },
    {
      question: "Quais são os planos disponíveis?",
      answer: "Temos 4 planos: Básico (R$99/mês), Intermediário (R$199/mês), Premium (R$399/mês) e Enterprise (sob consulta). Todos têm período de trial gratuito."
    },
    {
      question: "Como funciona o período de trial?",
      answer: "Cada plano tem um período de trial gratuito: Básico (7 dias), Intermediário (14 dias), Premium e Enterprise (30 dias). Você pode cancelar a qualquer momento."
    },
    {
      question: "Como gerenciar assinaturas e pagamentos?",
      answer: "No dashboard você visualiza todas as assinaturas, pode cancelar, alterar planos e ver o histórico de pagamentos. O sistema gera faturas automaticamente."
    },
    {
      question: "Onde encontro relatórios e analytics?",
      answer: "O dashboard mostra métricas em tempo real como número de assinaturas, receita, churn rate e muito mais. Você pode exportar relatórios em PDF ou Excel."
    },
    {
      question: "Como funciona o suporte técnico?",
      answer: "Oferecemos suporte por chat, email e telefone (dependendo do plano). O tempo de resposta varia de 24h (Básico) a 4h (Premium/Enterprise)."
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <HelpCircle className="w-6 h-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold">Central de Ajuda</h3>
      </div>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
            <p className="text-sm text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center mb-2">
          <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
          <h4 className="font-medium text-blue-900">Documentação Completa</h4>
        </div>
        <p className="text-sm text-blue-800 mb-3">
          Acesse nossa documentação completa com guias detalhados, API reference e tutoriais passo a passo.
        </p>
        <Button size="sm" variant="outline" className="w-full">
          Acessar Documentação
        </Button>
      </div>
    </div>
  );
};

// Quick Actions component
const QuickActions: React.FC = () => {
  const actions = [
    {
      title: "Cadastrar Clínica",
      description: "Adicionar nova clínica ao sistema",
      icon: <Plus className="w-5 h-5" />,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => window.location.href = '#cadastro'
    },
    {
      title: "Ver Planos",
      description: "Gerenciar planos de assinatura",
      icon: <CreditCard className="w-5 h-5" />,
      color: "bg-green-500 hover:bg-green-600",
      action: () => window.location.href = '#planos'
    },
    {
      title: "Analytics",
      description: "Ver relatórios e métricas",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => window.location.href = '#analytics'
    },
    {
      title: "Usuários",
      description: "Gerenciar usuários do sistema",
      icon: <Users className="w-5 h-5" />,
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => window.location.href = '#usuarios'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.action}
          className={`${action.color} text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-left`}
        >
          <div className="flex items-center mb-2">
            {action.icon}
            <h3 className="font-semibold ml-2">{action.title}</h3>
          </div>
          <p className="text-sm opacity-90">{action.description}</p>
        </button>
      ))}
    </div>
  );
};

// Main Admin Interface component
const AdminInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showRegistration, setShowRegistration] = useState(false);

  const handleRegistrationComplete = () => {
    setShowRegistration(false);
    setActiveTab("dashboard");
    // Recarregar dados do dashboard
    window.location.reload();
  };

  if (showRegistration) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowRegistration(false)}
              className="mb-4"
            >
              ← Voltar ao Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Cadastro de Nova Clínica</h1>
            <p className="text-gray-600">Preencha os dados para cadastrar uma nova clínica no sistema</p>
          </div>
          <ClinicRegistrationWizard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600">Gerencie clínicas, planos e assinaturas de forma simples</p>
            </div>
            <Button 
              onClick={() => setShowRegistration(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Clínica
            </Button>
          </div>
          
          {/* Quick Actions */}
          <QuickActions />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="registration" className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Cadastro
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="flex items-center">
              <Video className="w-4 h-4 mr-2" />
              Tutoriais
            </TabsTrigger>
            <TabsTrigger value="help" className="flex items-center">
              <HelpCircle className="w-4 h-4 mr-2" />
              Ajuda
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="registration" className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Cadastro de Nova Clínica</h2>
              <p className="text-gray-600 mb-6">
                Use nosso assistente passo a passo para cadastrar uma nova clínica. O processo leva menos de 10 minutos!
              </p>
              <Button 
                onClick={() => setShowRegistration(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Iniciar Cadastro
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="tutorials" className="space-y-6">
            <VideoTutorial />
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <HelpCenter />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2024 MentalSys - Sistema de Gestão para Clínicas de Saúde Mental</p>
          <p className="mt-1">
            Precisa de ajuda?{' '}
            <a href="mailto:suporte@mentalsys.com.br" className="text-blue-600 hover:text-blue-800">
              suporte@mentalsys.com.br
            </a>{' '}
            |{' '}
            <a href="tel:08001234567" className="text-blue-600 hover:text-blue-800">
              0800 123 4567
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminInterface;