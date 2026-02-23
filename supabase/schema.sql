# Supabase Configuration for MentalSys SaaS

# Database Schema for PostgreSQL
# Execute this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Clinics table (multi-tenant)
CREATE TABLE clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) UNIQUE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    description TEXT,
    website VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User-Clinic relationship (many-to-many)
CREATE TABLE user_clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, clinic_id)
);

-- Plans table
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    plan_type VARCHAR(50) NOT NULL,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_quarterly DECIMAL(10,2) NOT NULL,
    price_yearly DECIMAL(10,2) NOT NULL,
    max_patients INTEGER NOT NULL DEFAULT 50,
    max_users INTEGER NOT NULL DEFAULT 1,
    max_storage_gb INTEGER NOT NULL DEFAULT 5,
    max_appointments_per_month INTEGER NOT NULL DEFAULT 200,
    max_reports_per_month INTEGER NOT NULL DEFAULT 20,
    includes_telemedicine BOOLEAN DEFAULT false,
    includes_ai_features BOOLEAN DEFAULT false,
    includes_advanced_analytics BOOLEAN DEFAULT false,
    priority_support BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    trial_days INTEGER DEFAULT 7,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
    billing_period VARCHAR(20) NOT NULL DEFAULT 'monthly',
    status VARCHAR(20) NOT NULL DEFAULT 'trial',
    start_date TIMESTAMP NOT NULL DEFAULT NOW(),
    end_date TIMESTAMP,
    next_billing_date TIMESTAMP,
    trial_end_date TIMESTAMP,
    auto_renew BOOLEAN DEFAULT true,
    cancellation_date TIMESTAMP,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    cpf VARCHAR(14),
    birth_date DATE,
    gender VARCHAR(20),
    address TEXT,
    emergency_contact VARCHAR(255),
    medical_history TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    appointment_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    type VARCHAR(50) DEFAULT 'consultation',
    status VARCHAR(50) DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can only see their own data" ON users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Clinics are visible to their members" ON clinics
    FOR ALL USING (
        id IN (
            SELECT clinic_id FROM user_clinics 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Patients are visible to clinic members" ON patients
    FOR ALL USING (
        clinic_id IN (
            SELECT clinic_id FROM user_clinics 
            WHERE user_id = auth.uid()
        )
    );

-- Insert default plans
INSERT INTO plans (name, description, plan_type, price_monthly, price_quarterly, price_yearly, max_patients, max_users, max_storage_gb, max_appointments_per_month, max_reports_per_month, includes_telemedicine, includes_ai_features, includes_advanced_analytics, priority_support, trial_days) VALUES
('Plano Básico', 'Perfeito para clínicas iniciantes', 'basic', 99.90, 269.73, 1078.92, 50, 1, 5, 200, 20, false, false, false, false, 7),
('Plano Intermediário', 'Ideal para clínicas em crescimento', 'intermediate', 199.90, 539.73, 2158.92, 200, 5, 25, 1000, 100, true, false, true, true, 14),
('Plano Premium', 'Completo para clínicas estabelecidas', 'premium', 399.90, 1079.73, 4318.92, 1000, 20, 100, 5000, 500, true, true, true, true, 30),
('Plano Enterprise', 'Personalizado para grandes redes', 'enterprise', 999.90, 2699.73, 10798.92, 999999, 999999, 999, 99999, 9999, true, true, true, true, 30);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_clinics_cnpj ON clinics(cnpj);
CREATE INDEX idx_clinics_is_active ON clinics(is_active);
CREATE INDEX idx_subscriptions_clinic_id ON subscriptions(clinic_id);
CREATE INDEX idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_patients_clinic_id ON patients(clinic_id);
CREATE INDEX idx_patients_is_active ON patients(is_active);
CREATE INDEX idx_appointments_clinic_id ON appointments(clinic_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_user_clinics_user_id ON user_clinics(user_id);
CREATE INDEX idx_user_clinics_clinic_id ON user_clinics(clinic_id);