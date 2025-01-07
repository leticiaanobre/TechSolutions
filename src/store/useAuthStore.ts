import { create } from 'zustand';
import { axiosInstance } from '@/lib/axios';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  hourBank?: {
    total: number;
    used: number;
    plan: string;
  };
  skills?: string[];
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
  hourBank?: {
    total: number;
    used: number;
    plan: string;
  } | null;
  skills?: string[];
}

interface RegisterFormData extends RegisterData {
  confirmPassword: string;
  hourBank: {
    total: number;
    used: number;
    plan: string;
  } | null;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggingIn: boolean;
  isRegistering: boolean;
  isUpdatingProfile: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoggingIn: false,
  isRegistering: false,
  isUpdatingProfile: false,

  login: async (data: LoginData, onSuccessRedirect?: (role: string | undefined) => void) => {
  set({ isLoggingIn: true });
  try {
    const response = await axiosInstance.post('/api/v1/auth/login', data);
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    set({ user, token });
    
    toast({
      title: "Sucesso!",
      description: "Login realizado com sucesso.",
      variant: "success",
    });

    if (onSuccessRedirect) {
      onSuccessRedirect(user.role); 
    }
  } catch (error) {
    const apiError = error as ApiError;
    console.error('Login error details:', {
      error: apiError,
      response: apiError.response,
      message: apiError.message,
    });
    
    toast({
      variant: "destructive",
      title: "Erro no login",
      description: apiError.response?.data?.message || apiError.message || "Erro ao fazer login",
    });
    throw error;
  } finally {
    set({ isLoggingIn: false });
  }
},

  register: async (data) => {
    set({ isRegistering: true });
    try {
      const { confirmPassword, ...registerData } = data;
      
      // Validate passwords match
      if (registerData.password !== confirmPassword) {
        toast({
          title: "Erro na validação",
          description: "As senhas não coincidem",
          variant: "destructive",
        });
        throw new Error("Passwords don't match");
      }

      const response = await axiosInstance.post('/api/v1/auth/signup', {
        ...registerData,
        role: registerData.role || 'client',
        hourBank: registerData.hourBank || {
          total: 20,
          used: 0,
          plan: 'basic'
        }
      });
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      set({ user, token });
      
      toast({
        title: "Sucesso!",
        description: "Conta criada com sucesso.",
        variant: "success",
      });
    } catch (error) {
      const apiError = error as ApiError;
      
      // Don't show toast for password validation error since we already showed it
      if (error instanceof Error && error.message === "Passwords don't match") {
        throw error;
      }

      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: apiError.response?.data?.message || apiError.message || "Erro ao criar conta",
      });
      throw error;
    } finally {
      set({ isRegistering: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/api/v1/auth/logout');
      localStorage.removeItem('token');
      set({ user: null, token: null });
      
      toast({
        title: "Sucesso!",
        description: "Logout realizado com sucesso.",
        variant: "success",
      });
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        variant: "destructive",
        title: "Erro no logout",
        description: apiError.response?.data?.message || apiError.message || "Erro ao fazer logout",
      });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put('/api/v1/auth/update-profile', data);
      set({ user: response.data });
      
      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso.",
        variant: "success",
      });
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        variant: "destructive",
        title: "Erro na atualização",
        description: apiError.response?.data?.message || apiError.message || "Erro ao atualizar perfil",
      });
      throw error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
