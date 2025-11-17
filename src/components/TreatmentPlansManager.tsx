import { TreatmentPlan } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Edit2, Trash2, Pill, Calendar, Clock } from 'lucide-react';

interface TreatmentPlansManagerProps {
  plans: TreatmentPlan[];
  onEdit: (plan: TreatmentPlan) => void;
  onDelete: (planId: string) => void;
}

export function TreatmentPlansManager({ plans, onEdit, onDelete }: TreatmentPlansManagerProps) {
  if (plans.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <Pill className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>لا توجد خطط علاج حتى الآن</p>
            <p className="text-sm mt-2">قم بإضافة خطة علاج جديدة للبدء</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPlanActive = (plan: TreatmentPlan) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(plan.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + plan.durationDays);
    
    return today >= start && today < end;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-4">
      {plans.map((plan) => {
        const isActive = isPlanActive(plan);
        
        return (
          <Card key={plan.id} className={isActive ? 'border-green-300 bg-green-50/30' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center gap-2">
                    <CardTitle>{plan.name}</CardTitle>
                    {isActive && (
                      <Badge className="bg-green-500">نشطة</Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(plan.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{plan.durationDays} يوم</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(plan)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(plan.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">الأدوية ({plan.medications.length}):</p>
                <div className="space-y-2">
                  {plan.medications.map((med) => (
                    <div
                      key={med.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border"
                    >
                      <div>
                        <p>{med.name}</p>
                        <p className="text-sm text-gray-600">{med.dosage}</p>
                      </div>
                      <div className="text-left text-sm text-gray-600">
                        <p>{med.timesPerDay} مرة/يوم</p>
                        <p>أول جرعة: {med.firstDoseTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
