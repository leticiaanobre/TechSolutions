import React from 'react';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type HourBankInfo = {
  plan: string;
  totalHours: number;
  usedHours: number;
  completedTasks: number;
  hourDetails: Array<{
    task: string;
    hoursSpent: number;
    completedAt: string;
  }>;
};

export function HourBank() {
  const [hourBank, setHourBank] = React.useState<HourBankInfo | null>(null);

  React.useEffect(() => {
    // TODO: Fetch hour bank info from Supabase
  }, []);

  if (!hourBank) return null;

  const availableHours = hourBank.totalHours - hourBank.usedHours;
  const percentageUsed = (hourBank.usedHours / hourBank.totalHours) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Hours Overview</h3>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Used Hours</span>
            <span>{hourBank.usedHours}</span>
          </div>
          <Progress value={percentageUsed} />
          <div className="flex justify-between text-sm">
            <span>Available Hours</span>
            <span>{availableHours}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {hourBank.hourDetails.slice(0, 3).map((detail, index) => (
            <Card key={index}>
              <CardHeader className="p-4">
                <CardTitle className="text-sm">{detail.task}</CardTitle>
                <CardDescription>
                  {new Date(detail.completedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-sm">Hours spent: {detail.hoursSpent}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}