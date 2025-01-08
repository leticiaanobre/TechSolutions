import { create } from 'zustand';
import { axiosInstance } from '@/lib/axios';  // Importando o axiosInstance
import { toast } from '@/hooks/use-toast';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
  }

interface Task {
  _id: string;
  name: string;
  description: string;
  priority: "low" | "medium" | "high";
  estimatedHours: number;
  actualHours?: number;
  dueDate: Date;
  status: "completed" | "in-progress" | "pending";
  assignedTo: string;
}

interface HourBank {
  plan: string;
  total: number;
  used: number;
  available: number;
  completedTasks: number;
  detailedHours: { task: string; hoursSpent: number; completionDate: string }[];
}

interface ClientState {
  tasks: Task[];
  hourBank: HourBank | null;
  users: User[];
  isFetchingData: boolean;
  fetchTasks: () => Promise<void>;
  createTask: (taskData: { name: string; description: string; priority: "low" | "medium" | "high"; estimatedHours: number; dueDate: Date }) => Promise<void>;
  fetchHourBank: () => Promise<void>;
  fetchTaskHistory: (status?: string) => Promise<void>;
  fetchUsers: () => Promise<void>;
}

export const useClientStore = create<ClientState>((set) => ({
  tasks: [],
  hourBank: null,
  users: [],
  isFetchingData: false,

  fetchUsers: async () => {
    set({ isFetchingData: true });
    try {
      const response = await axiosInstance.get('/api/v1/clients/users');
      set({ users: response.data });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: 'destructive',
        title: 'Error fetching users',
        description: 'Failed to load user data.',
      });
    } finally {
      set({ isFetchingData: false });
    }
  },

  fetchTasks: async () => {
    set({ isFetchingData: true });
    try {
      const response = await axiosInstance.get('/api/v1/clients/tasks'); 
      set({ tasks: response.data });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        variant: 'destructive',
        title: 'Error fetching tasks',
        description: 'Failed to load tasks.',
      });
    } finally {
      set({ isFetchingData: false });
    }
  },

  createTask: async (taskData) => {
    set({ isFetchingData: true });
    console.log(taskData);
    try {
      const response = await axiosInstance.post('/api/v1/clients/tasks', taskData); 
      set((state) => ({
        tasks: [...state.tasks, response.data],
      }));
      toast({
        variant: 'success',
        title: 'Task created successfully!',
        description: 'Your new task has been created.',
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        variant: 'destructive',
        title: 'Error creating task',
        description: 'Failed to create the task.',
      });
    } finally {
      set({ isFetchingData: false });
    }
  },

  fetchHourBank: async () => {
    set({ isFetchingData: true });
    try {
      const response = await axiosInstance.get('/api/v1/clients/hour-bank'); 
      set({ hourBank: response.data });
    } catch (error) {
      console.error('Error fetching hour bank:', error);
      toast({
        variant: 'destructive',
        title: 'Error fetching hour bank',
        description: 'Failed to load hour bank data.',
      });
    } finally {
      set({ isFetchingData: false });
    }
  },

  fetchTaskHistory: async (status = '') => {
    set({ isFetchingData: true });
    try {
      const response = await axiosInstance.get('/api/v1/clients/tasks/history', { 
        params: { status },
      });
      console.log('Task history:', response.data);
    } catch (error) {
      console.error('Error fetching task history:', error);
      toast({
        variant: 'destructive',
        title: 'Error fetching task history',
        description: 'Failed to load task history.',
      });
    } finally {
      set({ isFetchingData: false });
    }
  },
}));
