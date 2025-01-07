'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, Lock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login')
      }

      // Handle successful login here (e.g., store token, redirect)
      toast({
        title: "Sucesso!",
        description: "Login realizado com sucesso.",
      })

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao fazer login",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-16 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-8">
              <Image
                src="/logo.png"
                alt="TechSolutions Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-2xl font-bold text-blue-600">TechSolutions</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Faça login com sua conta</h1>
            <p className="text-muted-foreground">
              Bem vindo de volta! Comece a gerenciar seus clientes e tarefas.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nome@exemplo.com"
                icon={<Mail className="h-5 w-5 text-gray-400" />}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Login"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Não tem conta?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Criar conta
            </Link>
          </p>
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
          <h2 className="text-2xl font-bold mb-2">Connect with every application.</h2>
          <p className="text-blue-100 mb-8 text-center">
            Everything you need is in an easily customizable dashboard
          </p>
        </div>
      </div>
    </main>
  )
}
