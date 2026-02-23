import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Circle, 
  AlertCircle, 
  Upload, 
  Building, 
  Users, 
  CreditCard,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  TrendingUp,
  Video
} from 'lucide-react';

// Tipos
interface ClinicFormData {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  description: string;
  website?: string;
  planId: string;
  billingPeriod: 'monthly' | 'quarterly' | 'yearly';
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminPassword?: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_quarterly: number;
  price_yearly: number;
  limits: {
    max_patients: number;
    max_users: number;
    max_storage_gb: number;
    includes_telemedicine: boolean;
    includes_ai_features: boolean;
    priority_support: boolean;
  };
  trial_days: number;
}

interface ValidationError {
  field: string;
  message: string;
}

const ClinicRegistrationWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [formData, setFormData] = useState<ClinicFormData>({
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    description: '',
    website: '',
    planId: '',
    billingPeriod: 'monthly',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Estados do Brasil
  const brazilianStates = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' },
  ];

  // Carregar planos disponíveis
  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      // Mock de planos - em produção, buscar da API
      const mockPlans: Plan[] = [
        {
          id: 'plan-basic-001',
          name: 'Plano Básico',
          description: 'Perfeito para clínicas iniciantes',
          price_monthly: 99.90,
          price_quarterly: 269.73,
          price_yearly: 1078.92,
          limits: {
            max_patients: 50,
            max_users: 1,
            max_storage_gb: 5,
            includes_telemedicine: false,
            includes_ai_features: false,
            priority_support: false,
          },
          trial_days: 7,
        },
        {
          id: 'plan-intermediate-001',
          name: 'Plano Intermediário',
          description: 'Ideal para clínicas em crescimento',
          price_monthly: 199.90,
          price_quarterly: 539.73,
          price_yearly: 2158.92,
          limits: {
            max_patients: 200,
            max_users: 5,
            max_storage_gb: 25,
            includes_telemedicine: true,
            includes_ai_features: false,
            priority_support: true,
          },
          trial_days: 14,
        },
        {
          id: 'plan-premium-001',
          name: 'Plano Premium',
          description: 'Completo para clínicas estabelecidas',
          price_monthly: 399.90,
          price_quarterly: 1079.73,
          price_yearly: 4318.92,
          limits: {
            max_patients: 1000,
            max_users: 20,
            max_storage_gb: 100,
            includes_telemedicine: true,
            includes_ai_features: true,
            priority_support: true,
          },
          trial_days: 30,
        },
        {
          id: 'plan-enterprise-001',
          name: 'Plano Enterprise',
          description: 'Personalizado para grandes redes',
          price_monthly: 999.90,
          price_quarterly: 2699.73,
          price_yearly: 10798.92,
          limits: {
            max_patients: 999999,
            max_users: 999999,
            max_storage_gb: 999,
            includes_telemedicine: true,
            includes_ai_features: true,
            priority_support: true,
          },
          trial_days: 30,
        },
      ];
      setPlans(mockPlans);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
    }
  };

  // Validação de CNPJ
  const validateCNPJ = (cnpj: string): boolean => {
    const cleanedCNPJ = cnpj.replace(/[^\d]/g, '');
    if (cleanedCNPJ.length !== 14) return false;
    
    // Validação básica de CNPJ
    if (/^(\d)\1+$/.test(cleanedCNPJ)) return false;
    
    return true;
  };

  // Validação de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validação de telefone
  const validatePhone = (phone: string): boolean => {
    const cleanedPhone = phone.replace(/[^\d]/g, '');
    return cleanedPhone.length >= 10 && cleanedPhone.length <= 11;
  };

  // Validação de CEP
  const validateZipCode = (zipCode: string): boolean => {
    const cleanedZipCode = zipCode.replace(/[^\d]/g, '');
    return cleanedZipCode.length === 8;
  };

  // Validação do formulário por etapa
  const validateStep = (step: number): ValidationError[] => {
    const newErrors: ValidationError[] = [];

    switch (step) {
      case 1: // Informações da Clínica
        if (!formData.name.trim()) {
          newErrors.push({ field: 'name', message: 'Nome da clínica é obrigatório' });
        }
        if (!formData.cnpj.trim()) {
          newErrors.push({ field: 'cnpj', message: 'CNPJ é obrigatório' });
        } else if (!validateCNPJ(formData.cnpj)) {
          newErrors.push({ field: 'cnpj', message: 'CNPJ inválido' });
        }
        if (!formData.email.trim()) {
          newErrors.push({ field: 'email', message: 'Email é obrigatório' });
        } else if (!validateEmail(formData.email)) {
          newErrors.push({ field: 'email', message: 'Email inválido' });
        }
        if (!formData.phone.trim()) {
          newErrors.push({ field: 'phone', message: 'Telefone é obrigatório' });
        } else if (!validatePhone(formData.phone)) {
          newErrors.push({ field: 'phone', message: 'Telefone inválido' });
        }
        if (!formData.address.trim()) {
          newErrors.push({ field: 'address', message: 'Endereço é obrigatório' });
        }
        if (!formData.city.trim()) {
          newErrors.push({ field: 'city', message: 'Cidade é obrigatória' });
        }
        if (!formData.state) {
          newErrors.push({ field: 'state', message: 'Estado é obrigatório' });
        }
        if (!formData.zipCode.trim()) {
          newErrors.push({ field: 'zipCode', message: 'CEP é obrigatório' });
        } else if (!validateZipCode(formData.zipCode)) {
          newErrors.push({ field: 'zipCode', message: 'CEP inválido' });
        }
        break;

      case 2: // Plano e Pagamento
        if (!formData.planId) {
          newErrors.push({ field: 'planId', message: 'Selecione um plano' });
        }
        if (!formData.billingPeriod) {
          newErrors.push({ field: 'billingPeriod', message: 'Selecione o período de cobrança' });
        }
        break;

      case 3: // Administrador
        if (!formData.adminName.trim()) {
          newErrors.push({ field: 'adminName', message: 'Nome do administrador é obrigatório' });
        }
        if (!formData.adminEmail.trim()) {
          newErrors.push({ field: 'adminEmail', message: 'Email do administrador é obrigatório' });
        } else if (!validateEmail(formData.adminEmail)) {
          newErrors.push({ field: 'adminEmail', message: 'Email do administrador inválido' });
        }
        if (!formData.adminPhone.trim()) {
          newErrors.push({ field: 'adminPhone', message: 'Telefone do administrador é obrigatório' });
        } else if (!validatePhone(formData.adminPhone)) {
          newErrors.push({ field: 'adminPhone', message: 'Telefone do administrador inválido' });
        }
        break;
    }

    return newErrors;
  };

  // Avançar para próxima etapa
  const nextStep = () => {
    const stepErrors = validateStep(currentStep);
    setErrors(stepErrors);

    if (stepErrors.length === 0) {
      setCompletedSteps([...completedSteps, currentStep]);
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  // Voltar para etapa anterior
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Ir para etapa específica
  const goToStep = (step: number) => {
    if (step <= currentStep || completedSteps.includes(step - 1)) {
      setCurrentStep(step);
    }
  };

  // Formatar CNPJ
  const formatCNPJ = (value: string): string => {
    const cleaned = value.replace(/[^\d]/g, '');
    if (cleaned.length <= 14) {
      return cleaned
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
    return cleaned.slice(0, 14).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  // Formatar telefone
  const formatPhone = (value: string): string => {
    const cleaned = value.replace(/[^\d]/g, '');
    if (cleaned.length <= 10) {
      return cleaned
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    } else {
      return cleaned
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    }
  };

  // Formatar CEP
  const formatZipCode = (value: string): string => {
    const cleaned = value.replace(/[^\d]/g, '');
    if (cleaned.length <= 8) {
      return cleaned
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1');
    }
    return cleaned.slice(0, 8).replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  // Atualizar campo do formulário
  const updateField = (field: keyof ClinicFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Limpar erro do campo ao digitar
    setErrors(errors.filter(error => error.field !== field));
  };

  // Obter plano selecionado
  const selectedPlan = plans.find(plan => plan.id === formData.planId);

  // Calcular preço com base no período de cobrança
  const getPlanPrice = (plan: Plan): number => {
    switch (formData.billingPeriod) {
      case 'monthly':
        return plan.price_monthly;
      case 'quarterly':
        return plan.price_quarterly;
      case 'yearly':
        return plan.price_yearly;
      default:
        return plan.price_monthly;
    }
  };

  // Finalizar cadastro
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui seria feita a chamada real à API
      console.log('Dados da clínica:', formData);
      
      alert('Clínica cadastrada com sucesso! Você será redirecionado para o dashboard.');
      
      // Redirecionar para o dashboard (em produção)
      // navigate('/dashboard');
      
    } catch (error) {
      console.error('Erro ao cadastrar clínica:', error);
      alert('Erro ao cadastrar clínica. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Componente de navegação por etapas
  const StepNavigation = () => (
    <div className="flex items-center justify-between mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <button
            onClick={() => goToStep(step)}
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
              currentStep === step
                ? 'border-blue-500 bg-blue-500 text-white'
                : completedSteps.includes(step)
                ? 'border-green-500 bg-green-500 text-white'
                : 'border-gray-300 bg-white text-gray-500'
            } ${step <= currentStep || completedSteps.includes(step - 1) ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            disabled={step > currentStep && !completedSteps.includes(step - 1)}
          >
            {completedSteps.includes(step) ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
          <div className="ml-2 hidden sm:block">
            <span className={`text-sm font-medium ${
              currentStep === step ? 'text-blue-600' : 
              completedSteps.includes(step) ? 'text-green-600' : 'text-gray-500'
            }`}>
              {step === 1 && 'Dados da Clínica'}
              {step === 2 && 'Plano e Pagamento'}
              {step === 3 && 'Administrador'}
              {step === 4 && 'Confirmação'}
            </span>
          </div>
          {step < 4 && <div className="w-16 sm:w-24 border-t-2 border-gray-300 mx-2" />}
        </div>
      ))}
    </div>
  );

  // Renderização das etapas
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Building className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">Informações da Clínica</h3>
              <p className="text-gray-600">Preencha os dados básicos da sua clínica</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">Nome da Clínica *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Clínica Vida e Saúde"
                  className={errors.find(e => e.field === 'name') ? 'border-red-500' : ''}
                />
                {errors.find(e => e.field === 'name') && (
                  <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'name')?.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => updateField('cnpj', formatCNPJ(e.target.value))}
                  placeholder="00.000.000/0001-00"
                  maxLength={18}
                  className={errors.find(e => e.field === 'cnpj') ? 'border-red-500' : ''}
                />
                {errors.find(e => e.field === 'cnpj') && (
                  <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'cnpj')?.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="contato@clinica.com.br"
                  className={errors.find(e => e.field === 'email') ? 'border-red-500' : ''}
                />
                {errors.find(e => e.field === 'email') && (
                  <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'email')?.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', formatPhone(e.target.value))}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                  className={errors.find(e => e.field === 'phone') ? 'border-red-500' : ''}
                />
                {errors.find(e => e.field === 'phone') && (
                  <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'phone')?.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address">Endereço *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Rua das Flores, 123"
                  className={errors.find(e => e.field === 'address') ? 'border-red-500' : ''}
                />
                {errors.find(e => e.field === 'address') && (
                  <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'address')?.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="São Paulo"
                  className={errors.find(e => e.field === 'city') ? 'border-red-500' : ''}
                />
                {errors.find(e => e.field === 'city') && (
                  <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'city')?.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="state">Estado *</Label>
                <Select value={formData.state} onValueChange={(value) => updateField('state', value)}>
                  <SelectTrigger className={errors.find(e => e.field === 'state') ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {brazilianStates.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.find(e => e.field === 'state') && (
                  <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'state')?.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="zipCode">CEP *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => updateField('zipCode', formatZipCode(e.target.value))}
                  placeholder="01234-567"
                  maxLength={9}
                  className={errors.find(e => e.field === 'zipCode') ? 'border-red-500' : ''}
                />
                {errors.find(e => e.field === 'zipCode') && (
                  <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'zipCode')?.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Descrição da Clínica</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Descreva os serviços e especialidades da sua clínica..."
                  rows={3}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="website">Website (opcional)</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  placeholder="https://www.clinica.com.br"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CreditCard className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">Escolha seu Plano</h3>
              <p className="text-gray-600">Selecione o plano ideal para sua clínica</p>
            </div>

            {/* Seletor de período de cobrança */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <Label>Período de Cobrança</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { value: 'monthly', label: 'Mensal', discount: '0%' },
                  { value: 'quarterly', label: 'Trimestral', discount: '10%' },
                  { value: 'yearly', label: 'Anual', discount: '20%' },
                ].map((period) => (
                  <button
                    key={period.value}
                    onClick={() => updateField('billingPeriod', period.value as any)}
                    className={`p-3 rounded-lg border-2 text-center transition-colors ${
                      formData.billingPeriod === period.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{period.label}</div>
                    <div className="text-sm text-green-600">{period.discount} de desconto</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cards de planos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.map((plan) => {
                const price = getPlanPrice(plan);
                const isSelected = formData.planId === plan.id;
                
                return (
                  <div
                    key={plan.id}
                    onClick={() => updateField('planId', plan.id)}
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
                        <p className="text-gray-600 text-sm">{plan.description}</p>
                      </div>
                      {isSelected && <CheckCircle className="w-6 h-6 text-blue-500" />}
                    </div>

                    <div className="mb-4">
                      <div className="text-2xl font-bold text-gray-900">
                        R$ {price.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formData.billingPeriod === 'monthly' && 'por mês'}
                        {formData.billingPeriod === 'quarterly' && 'por trimestre'}
                        {formData.billingPeriod === 'yearly' && 'por ano'}
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        {plan.trial_days} dias grátis
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-2 text-gray-500" />
                        <span>Até {plan.limits.max_patients.toLocaleString()} pacientes</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-2 text-gray-500" />
                        <span>Até {plan.limits.max_users} usuários</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{plan.limits.max_storage_gb}GB de armazenamento</span>
                      </div>
                      {plan.limits.includes_telemedicine && (
                        <div className="flex items-center text-sm">
                          <Video className="w-4 h-4 mr-2 text-green-500" />
                          <span className="text-green-600">Telemedicina incluída</span>
                        </div>
                      )}
                      {plan.limits.includes_ai_features && (
                        <div className="flex items-center text-sm">
                          <Shield className="w-4 h-4 mr-2 text-green-500" />
                          <span className="text-green-600">IA Avançada</span>
                        </div>
                      )}
                      {plan.limits.priority_support && (
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-green-500" />
                          <span className="text-green-600">Suporte prioritário</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {errors.find(e => e.field === 'planId') && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.find(e => e.field === 'planId')?.message}</AlertDescription>
              </Alert>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Users className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">Administrador Principal</h3>
              <p className="text-gray-600">Informações do administrador da clínica</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                <p className="text-blue-800 text-sm">
                  Este será o usuário administrador principal da clínica com acesso completo ao sistema.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="adminName">Nome Completo *</Label>
                <Input
                  id="adminName"
                  value={formData.adminName}
                  onChange={(e) => updateField('adminName', e.target.value)}
                  placeholder="Dr. João Silva"
                  className={errors.find(e => e.field === 'adminName') ? 'border-red-500' : ''}
                />
                {errors.find(e => e.field === 'adminName') && (
                  <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'adminName')?.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="adminEmail">Email *</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) => updateField('adminEmail', e.target.value)}
                  placeholder="admin@clinica.com.br"
                  className={errors.find(e => e.field === 'adminEmail') ? 'border-red-500' : ''}
                />
                {errors.find(e => e.field === 'adminEmail') && (
                  <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'adminEmail')?.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="adminPhone">Telefone *</Label>
                <Input
                  id="adminPhone"
                  value={formData.adminPhone}
                  onChange={(e) => updateField('adminPhone', formatPhone(e.target.value))}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                  className={errors.find(e => e.field === 'adminPhone') ? 'border-red-500' : ''}
                />
                {errors.find(e => e.field === 'adminPhone') && (
                  <p className="text-red-500 text-sm mt-1">{errors.find(e => e.field === 'adminPhone')?.message}</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Próximos Passos</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Após o cadastro, você receberá um email de confirmação</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Acesso imediato ao período de trial gratuito</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Tutorial guiado para configuração inicial</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Suporte técnico disponível 24/7</span>
                </li>
              </ul>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">Confirmação do Cadastro</h3>
              <p className="text-gray-600">Revise as informações antes de finalizar</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-green-800 font-medium">Tudo certo! Suas informações foram validadas.</p>
              </div>
            </div>

            {/* Resumo das informações */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Dados da Clínica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nome:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CNPJ:</span>
                    <span className="font-medium">{formData.cnpj}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Endereço:</span>
                    <span className="font-medium">{formData.address}, {formData.city} - {formData.state}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Plano Selecionado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedPlan && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plano:</span>
                        <span className="font-medium">{selectedPlan.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Período:</span>
                        <span className="font-medium">
                          {formData.billingPeriod === 'monthly' && 'Mensal'}
                          {formData.billingPeriod === 'quarterly' && 'Trimestral'}
                          {formData.billingPeriod === 'yearly' && 'Anual'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valor:</span>
                        <span className="font-medium text-green-600">
                          R$ {getPlanPrice(selectedPlan).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trial:</span>
                        <span className="font-medium">{selectedPlan.trial_days} dias grátis</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Administrador</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nome:</span>
                    <span className="font-medium">{formData.adminName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{formData.adminEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Telefone:</span>
                    <span className="font-medium">{formData.adminPhone}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Termos e condições */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Termos e Condições</h4>
              <p className="text-sm text-gray-600 mb-3">
                Ao clicar em "Finalizar Cadastro", você concorda com nossos termos de serviço e política de privacidade.
                Seu período de trial começará imediatamente e você poderá cancelar a qualquer momento.
              </p>
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-xs text-gray-500">
                  Seus dados estão protegidos conforme a LGPD (Lei Geral de Proteção de Dados)
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Cadastro de Clínica</CardTitle>
            <CardDescription>Cadastre sua clínica e comece a usar o MentalSys em minutos</CardDescription>
          </CardHeader>
          <CardContent>
            <StepNavigation />
            
            {/* Barra de progresso */}
            <Progress value={(currentStep / 4) * 100} className="mb-8" />

            {/* Conteúdo da etapa */}
            <div className="mb-8">
              {renderStep()}
            </div>

            {/* Botões de navegação */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6"
              >
                Voltar
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  className="px-6"
                >
                  Continuar
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-6 bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processando...
                    </>
                  ) : (
                    'Finalizar Cadastro'
                  )}
                </Button>
              )}
            </div>

            {/* Tempo estimado */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>Tempo estimado: 5-7 minutos</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suporte */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Precisa de ajuda?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              Fale com nosso suporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClinicRegistrationWizard;