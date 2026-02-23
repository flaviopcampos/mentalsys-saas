"""
Sistema de Planos e Assinaturas - MentalSys
Backend para gestão de planos de assinatura SaaS
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from enum import Enum
import uuid

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.clinic import Clinic
from app.core.config import get_settings

router = APIRouter(prefix="/api/v1/plans", tags=["Planos e Assinaturas"])

settings = get_settings()

# Enum para tipos de planos
class PlanType(str, Enum):
    BASIC = "basic"
    INTERMEDIATE = "intermediate"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"

# Enum para status de assinatura
class SubscriptionStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    TRIAL = "trial"
    SUSPENDED = "suspended"
    CANCELLED = "cancelled"
    EXPIRED = "expired"

# Enum para períodos de cobrança
class BillingPeriod(str, Enum):
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    YEARLY = "yearly"

# Modelos Pydantic
class PlanLimits(BaseModel):
    max_patients: int = Field(description="Número máximo de pacientes")
    max_users: int = Field(description="Número máximo de usuários")
    max_storage_gb: int = Field(description="Armazenamento em GB")
    max_appointments_per_month: int = Field(description="Consultas por mês")
    max_reports_per_month: int = Field(description="Relatórios por mês")
    includes_telemedicine: bool = Field(description="Inclui telemedicina")
    includes_ai_features: bool = Field(description="Inclui recursos de IA")
    includes_advanced_analytics: bool = Field(description="Inclui analytics avançado")
    priority_support: bool = Field(description="Suporte prioritário")

class PlanBase(BaseModel):
    name: str = Field(..., description="Nome do plano")
    description: str = Field(..., description="Descrição detalhada")
    plan_type: PlanType = Field(..., description="Tipo de plano")
    price_monthly: float = Field(..., description="Preço mensal em reais")
    price_quarterly: float = Field(..., description="Preço trimestral em reais")
    price_yearly: float = Field(..., description="Preço anual em reais")
    limits: PlanLimits = Field(..., description="Limites do plano")
    is_active: bool = Field(default=True, description="Plano está ativo")
    trial_days: int = Field(default=7, description="Dias de trial gratuito")

class PlanCreate(PlanBase):
    pass

class PlanUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price_monthly: Optional[float] = None
    price_quarterly: Optional[float] = None
    price_yearly: Optional[float] = None
    limits: Optional[PlanLimits] = None
    is_active: Optional[bool] = None
    trial_days: Optional[int] = None

class PlanResponse(PlanBase):
    id: str = Field(..., description="ID único do plano")
    created_at: datetime = Field(..., description="Data de criação")
    updated_at: datetime = Field(..., description="Última atualização")

class SubscriptionBase(BaseModel):
    clinic_id: str = Field(..., description="ID da clínica")
    plan_id: str = Field(..., description="ID do plano")
    billing_period: BillingPeriod = Field(..., description="Período de cobrança")
    status: SubscriptionStatus = Field(default=SubscriptionStatus.TRIAL, description="Status da assinatura")
    start_date: datetime = Field(..., description="Data de início")
    end_date: Optional[datetime] = Field(None, description="Data de término")
    next_billing_date: Optional[datetime] = Field(None, description="Próxima data de cobrança")
    auto_renew: bool = Field(default=True, description="Renovação automática")

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionUpdate(BaseModel):
    plan_id: Optional[str] = None
    billing_period: Optional[BillingPeriod] = None
    status: Optional[SubscriptionStatus] = None
    auto_renew: Optional[bool] = None

class SubscriptionResponse(SubscriptionBase):
    id: str = Field(..., description="ID único da assinatura")
    plan: PlanResponse = Field(..., description="Detalhes do plano")
    created_at: datetime = Field(..., description="Data de criação")
    updated_at: datetime = Field(..., description="Última atualização")
    is_expired: bool = Field(..., description="Está expirada")
    days_until_expiry: Optional[int] = Field(None, description="Dias até expirar")

class BillingHistoryResponse(BaseModel):
    id: str = Field(..., description="ID da cobrança")
    subscription_id: str = Field(..., description="ID da assinatura")
    amount: float = Field(..., description="Valor cobrado")
    currency: str = Field(default="BRL", description="Moeda")
    status: str = Field(..., description="Status da cobrança")
    billing_date: datetime = Field(..., description="Data da cobrança")
    due_date: datetime = Field(..., description="Data de vencimento")
    paid_date: Optional[datetime] = Field(None, description="Data de pagamento")
    description: str = Field(..., description="Descrição da cobrança")

# ROTAS DE ADMINISTRAÇÃO DE PLANOS

@router.post("/admin/plans", response_model=PlanResponse)
async def create_plan(
    plan_data: PlanCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Criar novo plano de assinatura (Admin apenas)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Acesso negado - requer privilégios de administrador")
    
    # Verificar se já existe plano com mesmo tipo
    # Aqui seria implementada a lógica de criação no banco de dados
    
    return PlanResponse(
        id=str(uuid.uuid4()),
        **plan_data.dict(),
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

@router.get("/admin/plans", response_model=List[PlanResponse])
async def list_plans(
    skip: int = 0,
    limit: int = 100,
    is_active: Optional[bool] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Listar todos os planos disponíveis"""
    # Mock de planos para demonstração
    plans = [
        PlanResponse(
            id="plan-basic-001",
            name="Plano Básico",
            description="Perfeito para clínicas iniciantes",
            plan_type=PlanType.BASIC,
            price_monthly=99.90,
            price_quarterly=269.73,  # 10% de desconto
            price_yearly=1078.92,    # 20% de desconto
            limits=PlanLimits(
                max_patients=50,
                max_users=1,
                max_storage_gb=5,
                max_appointments_per_month=200,
                max_reports_per_month=20,
                includes_telemedicine=False,
                includes_ai_features=False,
                includes_advanced_analytics=False,
                priority_support=False
            ),
            is_active=True,
            trial_days=7,
            created_at=datetime.now(),
            updated_at=datetime.now()
        ),
        PlanResponse(
            id="plan-intermediate-001",
            name="Plano Intermediário",
            description="Ideal para clínicas em crescimento",
            plan_type=PlanType.INTERMEDIATE,
            price_monthly=199.90,
            price_quarterly=539.73,  # 10% de desconto
            price_yearly=2158.92,    # 20% de desconto
            limits=PlanLimits(
                max_patients=200,
                max_users=5,
                max_storage_gb=25,
                max_appointments_per_month=1000,
                max_reports_per_month=100,
                includes_telemedicine=True,
                includes_ai_features=False,
                includes_advanced_analytics=True,
                priority_support=True
            ),
            is_active=True,
            trial_days=14,
            created_at=datetime.now(),
            updated_at=datetime.now()
        ),
        PlanResponse(
            id="plan-premium-001",
            name="Plano Premium",
            description="Completo para clínicas estabelecidas",
            plan_type=PlanType.PREMIUM,
            price_monthly=399.90,
            price_quarterly=1079.73, # 10% de desconto
            price_yearly=4318.92,    # 20% de desconto
            limits=PlanLimits(
                max_patients=1000,
                max_users=20,
                max_storage_gb=100,
                max_appointments_per_month=5000,
                max_reports_per_month=500,
                includes_telemedicine=True,
                includes_ai_features=True,
                includes_advanced_analytics=True,
                priority_support=True
            ),
            is_active=True,
            trial_days=30,
            created_at=datetime.now(),
            updated_at=datetime.now()
        ),
        PlanResponse(
            id="plan-enterprise-001",
            name="Plano Enterprise",
            description="Personalizado para grandes redes",
            plan_type=PlanType.ENTERPRISE,
            price_monthly=999.90,
            price_quarterly=2699.73, # 10% de desconto
            price_yearly=10798.92,   # 20% de desconto
            limits=PlanLimits(
                max_patients=999999,  # Ilimitado
                max_users=999999,     # Ilimitado
                max_storage_gb=999,   # Quase ilimitado
                max_appointments_per_month=99999,
                max_reports_per_month=9999,
                includes_telemedicine=True,
                includes_ai_features=True,
                includes_advanced_analytics=True,
                priority_support=True
            ),
            is_active=True,
            trial_days=30,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
    ]
    
    return plans

@router.get("/plans/{plan_id}", response_model=PlanResponse)
async def get_plan(
    plan_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter detalhes de um plano específico"""
    plans = await list_plans(db=db, current_user=current_user)
    plan = next((p for p in plans if p.id == plan_id), None)
    
    if not plan:
        raise HTTPException(status_code=404, detail="Plano não encontrado")
    
    return plan

@router.put("/admin/plans/{plan_id}", response_model=PlanResponse)
async def update_plan(
    plan_id: str,
    plan_data: PlanUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Atualizar plano existente (Admin apenas)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Acesso negado - requer privilégios de administrador")
    
    # Aqui seria implementada a lógica de atualização no banco de dados
    
    return PlanResponse(
        id=plan_id,
        **plan_data.dict(exclude_unset=True),
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

# ROTAS DE ASSINATURAS

@router.post("/subscriptions", response_model=SubscriptionResponse)
async def create_subscription(
    subscription_data: SubscriptionCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Criar nova assinatura para clínica"""
    
    # Verificar se o usuário tem permissão para criar assinatura
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    # Obter detalhes do plano
    plans = await list_plans(db=db, current_user=current_user)
    plan = next((p for p in plans if p.id == subscription_data.plan_id), None)
    
    if not plan:
        raise HTTPException(status_code=404, detail="Plano não encontrado")
    
    # Calcular datas
    start_date = datetime.now()
    
    if subscription_data.billing_period == BillingPeriod.MONTHLY:
        end_date = start_date + timedelta(days=30)
    elif subscription_data.billing_period == BillingPeriod.QUARTERLY:
        end_date = start_date + timedelta(days=90)
    else:  # YEARLY
        end_date = start_date + timedelta(days=365)
    
    # Criar assinatura
    subscription = SubscriptionResponse(
        id=str(uuid.uuid4()),
        **subscription_data.dict(),
        plan=plan,
        start_date=start_date,
        end_date=end_date,
        next_billing_date=end_date,
        auto_renew=True,
        plan=plan,
        created_at=datetime.now(),
        updated_at=datetime.now(),
        is_expired=False,
        days_until_expiry=(end_date - start_date).days
    )
    
    # Adicionar tarefa em background para enviar email de confirmação
    background_tasks.add_task(
        send_subscription_confirmation_email,
        current_user.email,
        plan.name,
        subscription_data.billing_period
    )
    
    return subscription

@router.get("/subscriptions/my", response_model=SubscriptionResponse)
async def get_my_subscription(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter assinatura atual da clínica do usuário"""
    
    # Mock de assinatura para demonstração
    plans = await list_plans(db=db, current_user=current_user)
    basic_plan = plans[0]  # Plano básico
    
    return SubscriptionResponse(
        id="sub-123456",
        clinic_id=current_user.clinic_id or "clinic-001",
        plan_id=basic_plan.id,
        billing_period=BillingPeriod.MONTHLY,
        status=SubscriptionStatus.ACTIVE,
        start_date=datetime.now() - timedelta(days=15),
        end_date=datetime.now() + timedelta(days=15),
        next_billing_date=datetime.now() + timedelta(days=15),
        auto_renew=True,
        plan=basic_plan,
        created_at=datetime.now() - timedelta(days=15),
        updated_at=datetime.now(),
        is_expired=False,
        days_until_expiry=15
    )

@router.get("/subscriptions/{subscription_id}/billing", response_model=List[BillingHistoryResponse])
async def get_billing_history(
    subscription_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter histórico de cobranças da assinatura"""
    
    # Mock de histórico de cobranças
    return [
        BillingHistoryResponse(
            id="bill-001",
            subscription_id=subscription_id,
            amount=99.90,
            currency="BRL",
            status="paid",
            billing_date=datetime.now() - timedelta(days=30),
            due_date=datetime.now() - timedelta(days=30),
            paid_date=datetime.now() - timedelta(days=29),
            description="Assinatura Plano Básico - Mensal"
        ),
        BillingHistoryResponse(
            id="bill-002",
            subscription_id=subscription_id,
            amount=99.90,
            currency="BRL",
            status="pending",
            billing_date=datetime.now(),
            due_date=datetime.now() + timedelta(days=5),
            paid_date=None,
            description="Assinatura Plano Básico - Mensal"
        )
    ]

# FUNÇÕES AUXILIARES

async def send_subscription_confirmation_email(
    email: str,
    plan_name: str,
    billing_period: str
) -> None:
    """Enviar email de confirmação de assinatura"""
    # Implementar envio de email
    print(f"[EMAIL] Confirmação de assinatura enviada para {email}")
    print(f"[EMAIL] Plano: {plan_name} - Período: {billing_period}")

# ROTAS ADICIONAIS DE ADMINISTRAÇÃO

@router.get("/admin/subscriptions", response_model=List[SubscriptionResponse])
async def list_all_subscriptions(
    skip: int = 0,
    limit: int = 100,
    status: Optional[SubscriptionStatus] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Listar todas as assinaturas (Admin apenas)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Acesso negado - requer privilégios de administrador")
    
    # Mock de múltiplas assinaturas
    plans = await list_plans(db=db, current_user=current_user)
    
    return [
        SubscriptionResponse(
            id="sub-123456",
            clinic_id="clinic-001",
            plan_id=plans[0].id,
            billing_period=BillingPeriod.MONTHLY,
            status=SubscriptionStatus.ACTIVE,
            start_date=datetime.now() - timedelta(days=15),
            end_date=datetime.now() + timedelta(days=15),
            next_billing_date=datetime.now() + timedelta(days=15),
            auto_renew=True,
            plan=plans[0],
            created_at=datetime.now() - timedelta(days=15),
            updated_at=datetime.now(),
            is_expired=False,
            days_until_expiry=15
        )
    ]

@router.post("/admin/subscriptions/{subscription_id}/cancel")
async def cancel_subscription(
    subscription_id: str,
    reason: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cancelar assinatura (Admin apenas)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Acesso negado - requer privilégios de administrador")
    
    return {
        "message": "Assinatura cancelada com sucesso",
        "subscription_id": subscription_id,
        "cancelled_at": datetime.now(),
        "reason": reason
    }

@router.get("/admin/dashboard")
async def get_admin_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Dashboard administrativo com métricas de assinaturas"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Acesso negado - requer privilégios de administrador")
    
    return {
        "total_subscriptions": 156,
        "active_subscriptions": 142,
        "trial_subscriptions": 14,
        "monthly_revenue": 15847.50,
        "churn_rate": 2.3,
        "avg_subscription_value": 115.20,
        "subscriptions_by_plan": {
            "basic": 89,
            "intermediate": 45,
            "premium": 20,
            "enterprise": 2
        },
        "recent_subscriptions": [
            {
                "clinic_name": "Clínica Vida",
                "plan_name": "Plano Básico",
                "subscription_date": datetime.now() - timedelta(days=2),
                "status": "active"
            },
            {
                "clinic_name": "Centro de Saúde Mental",
                "plan_name": "Plano Intermediário",
                "subscription_date": datetime.now() - timedelta(days=5),
                "status": "trial"
            }
        ]
    }