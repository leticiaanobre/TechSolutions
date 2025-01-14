import React from 'react';
import { CreateTaskForm } from './create-task-form';
import { TaskList } from './task-list';
import { HourBank } from './hour-bank';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ClientDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Client Dashboard</h1>
          <CreateTaskForm />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Tasks Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="in-progress">
                <TabsList>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="in-progress">
                  <TaskList filter="in-progress" />
                </TabsContent>
                <TabsContent value="history">
                  <TaskList filter="all" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hour Bank</CardTitle>
            </CardHeader>
            <CardContent>
              <HourBank />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}