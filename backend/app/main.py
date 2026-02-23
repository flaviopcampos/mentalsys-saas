"""
MentalSys SaaS v5 - Main Application
Sistema multiempresa para gestão de clínicas de saúde mental
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import uvicorn
import os
from datetime import datetime

# Criar aplicação FastAPI
app = FastAPI(
    title="MentalSys SaaS v5",
    description="Sistema completo para gestão de clínicas de saúde mental",
    version="5.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS para desenvolvimento
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar domínios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rota de health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "5.0.0",
        "environment": os.getenv("ENVIRONMENT", "development")
    }

# Rota raiz
@app.get("/")
async def root():
    return {
        "message": "MentalSys SaaS v5 - Sistema de Gestão de Clínicas",
        "version": "5.0.0",
        "status": "operational",
        "documentation": "/docs"
    }

# Middleware de tratamento de erros
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc),
            "timestamp": datetime.now().isoformat()
        }
    )

# Importar rotas principais
try:
    from app.api.v1.auth_simple import router as auth_router
    app.include_router(auth_router, prefix="/api/v1/auth", tags=["Autenticação"])
    print("[OK] Rotas de autenticação carregadas")
except ImportError as e:
    print(f"[AVISO] Rotas de autenticação não disponíveis: {e}")

try:
    from app.api.v1.users import router as users_router
    app.include_router(users_router, prefix="/api/v1/users", tags=["Usuários"])
    print("[OK] Rotas de usuários carregadas")
except ImportError as e:
    print(f"[AVISO] Rotas de usuários não disponíveis: {e}")

try:
    from app.api.v1.patients import router as patients_router
    app.include_router(patients_router, prefix="/api/v1/patients", tags=["Pacientes"])
    print("[OK] Rotas de pacientes carregadas")
except ImportError as e:
    print(f"[AVISO] Rotas de pacientes não disponíveis: {e}")

try:
    from app.api.v1.clinics import router as clinics_router
    app.include_router(clinics_router, prefix="/api/v1/clinics", tags=["Clínicas"])
    print("[OK] Rotas de clínicas carregadas")
except ImportError as e:
    print(f"[AVISO] Rotas de clínicas não disponíveis: {e}")

try:
    from app.api.v1.reports_endpoints import router as reports_router
    app.include_router(reports_router, prefix="/api/v1/reports", tags=["Relatórios"])
    print("[OK] Rotas de relatórios carregadas")
except ImportError as e:
    print(f"[AVISO] Rotas de relatórios não disponíveis: {e}")

try:
    from app.api.v1.plans import router as plans_router
    app.include_router(plans_router, prefix="/api/v1/plans", tags=["Planos e Assinaturas"])
    print("[OK] Rotas de planos carregadas")
except ImportError as e:
    print(f"[AVISO] Rotas de planos não disponíveis: {e}")

# Configurações de execução
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    reload = os.getenv("ENVIRONMENT", "development") == "development"
    
    print("[INICIANDO] Iniciando MentalSys SaaS v5 em {}:{}".format(host, port))
    print("[INFO] Ambiente: {}".format('Desenvolvimento' if reload else 'Produção'))
    print("[DOC] Documentação: http://{}:{}/docs".format(host, port))
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )