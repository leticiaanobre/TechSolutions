'use client'

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
// import { useToast } from "@/hooks/use-toast";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  hourBank: {
    total: number;
    used: number;
    plan: string;
  } | null;
  skills: string[];
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isRegistering } = useAuthStore();
//   const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client',
    hourBank: {
      total: 20,
      used: 0,
      plan: 'basic'
    },
    skills: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value,
      hourBank: value === 'developer' ? null : {
        total: 20,
        used: 0,
        plan: 'basic'
      }
    }));
  };

  const handlePlanChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      hourBank: prev.hourBank ? {
        ...prev.hourBank,
        plan: value,
        total: value === 'basic' ? 20 : value === 'standard' ? 40 : 80
      } : null
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      // Convert formData to RegisterFormData
      const registerData = {
        ...formData,
        hourBank: formData.hourBank || null
      };
      await register(registerData)
      router.push('/dashboard')
    } catch (error) {
      console.error('Register failed:', error)
    }
  };

  return (
    <main className="min-h-screen w-full flex">
      {/* Left side - Register Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-16 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-2">
            <h1 className="text-3xl font-medium text-blue-500 mb-2">Bem vindo a <strong>TechSolutions!</strong></h1>
            <p className="font-bold text-xl text-gray-800">Crie sua conta agora mesmo!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div className='flex flex-row items-center justify-between'>
                <div className={`${formData.role === 'client' ? 'w-1/2 mr-2' : 'w-full'}`}>
                    <Label>Tipo de conta</Label>
                    <Select
                    value={formData.role}
                    onValueChange={handleRoleChange}
                    >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de conta" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="client">Cliente</SelectItem>
                        <SelectItem value="developer">Funcionário</SelectItem>
                    </SelectContent>
                    </Select>
                </div>

                {formData.role === 'client' && (
                    <div className='w-1/2 ml-2'>
                    <Label>Plano de horas</Label>
                    <Select
                        value={formData.hourBank?.plan}
                        onValueChange={handlePlanChange}
                    >
                        <SelectTrigger>
                        <SelectValue placeholder="Selecione seu plano" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="basic">Básico (20 horas)</SelectItem>
                        <SelectItem value="standard">Padrão (40 horas)</SelectItem>
                        <SelectItem value="premium">Premium (80 horas)</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* <p className="text-sm text-muted-foreground mt-1">
                        Horas disponíveis: {formData.hourBank?.total}
                    </p> */}
                    </div>
                )}
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Digite seu e-mail"
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Digite sua senha"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirme sua senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Digite sua senha novamente"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isRegistering}
            >
              {isRegistering ? 'Cadastrando...' : 'Criar conta'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-blue-500 hover:text-blue-600">
                Faça login
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-blue-600 items-center justify-center p-8">
        <div className="max-w-md text-white flex flex-col items-center">
          <Image
            src="/illustration.png"
            alt="Dashboard Illustration"
            width={350}
            height={400}
            className="mb-8"
          />
          <h2 className="text-2xl font-bold mb-2">Transforme sua gestão em realidade.</h2>
          <p className="text-blue-100 mb-8 text-center">
            Acompanhe todos os detalhes com facilidade em um único lugar.
          </p>
        </div>
      </div>
    </main>
  );
}
