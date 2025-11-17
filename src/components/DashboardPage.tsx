import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { LogOut, Plus, Calendar, Pill } from 'lucide-react';
import { TreatmentPlan, Dose } from '../types';
import { TodayDoses } from './TodayDoses';
import { TreatmentPlansManager } from './TreatmentPlansManager';
import { TreatmentPlanDialog } from './TreatmentPlanDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';

interface DashboardPageProps {
  onLogout: () => void;
}

export function DashboardPage({ onLogout }: DashboardPageProps) {
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [doses, setDoses] = useState<Dose[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<TreatmentPlan | null>(null);

  // تحميل البيانات من localStorage
  useEffect(() => {
    const storedPlans = localStorage.getItem('treatmentPlans');
    const storedDoses = localStorage.getItem('doses');
    
    if (storedPlans) {
      setPlans(JSON.parse(storedPlans));
    }
    if (storedDoses) {
      setDoses(JSON.parse(storedDoses));
    }
  }, []);

  // حفظ الخطط في localStorage
  useEffect(() => {
    localStorage.setItem('treatmentPlans', JSON.stringify(plans));
  }, [plans]);

  // حفظ الجرعات في localStorage
  useEffect(() => {
    localStorage.setItem('doses', JSON.stringify(doses));
  }, [doses]);

  // توليد الجرعات من الخطط
  const generateDoses = (plan: TreatmentPlan): Dose[] => {
    const generatedDoses: Dose[] = [];
    const startDate = new Date(plan.startDate);

    for (let day = 0; day < plan.durationDays; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + day);
      const dateStr = currentDate.toISOString().split('T')[0];

      plan.medications.forEach((med) => {
        const [hours, minutes] = med.firstDoseTime.split(':').map(Number);
        const hoursInterval = 24 / med.timesPerDay;

        for (let i = 0; i < med.timesPerDay; i++) {
          const doseHours = (hours + hoursInterval * i) % 24;
          const doseTime = `${String(Math.floor(doseHours)).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

          generatedDoses.push({
            id: `${plan.id}-${med.id}-${dateStr}-${i}`,
            planId: plan.id,
            planName: plan.name,
            medicationId: med.id,
            medicationName: med.name,
            dosage: med.dosage,
            time: doseTime,
            date: dateStr,
            taken: false,
          });
        }
      });
    }

    return generatedDoses;
  };

  const handleAddPlan = (plan: TreatmentPlan) => {
    const newPlans = [...plans, plan];
    setPlans(newPlans);

    // توليد الجرعات للخطة الجديدة
    const newDoses = generateDoses(plan);
    setDoses([...doses, ...newDoses]);

    toast.success('تم إضافة خطة العلاج بنجاح!');
    setIsAddDialogOpen(false);
  };

  const handleEditPlan = (plan: TreatmentPlan) => {
    const newPlans = plans.map((p) => (p.id === plan.id ? plan : p));
    setPlans(newPlans);

    // إزالة الجرعات القديمة وإضافة الجديدة
    const filteredDoses = doses.filter((d) => d.planId !== plan.id);
    const newDoses = generateDoses(plan);
    setDoses([...filteredDoses, ...newDoses]);

    toast.success('تم تحديث خطة العلاج بنجاح!');
    setEditingPlan(null);
  };

  const handleDeletePlan = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (plan && window.confirm(`هل أنت متأكد من حذف خطة "${plan.name}"؟`)) {
      setPlans(plans.filter((p) => p.id !== planId));
      setDoses(doses.filter((d) => d.planId !== planId));
      toast.success('تم حذف خطة العلاج');
    }
  };

  const handleToggleDose = (doseId: string) => {
    setDoses(
      doses.map((d) =>
        d.id === doseId ? { ...d, taken: !d.taken } : d
      )
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-green-500 w-10 h-10 rounded-lg flex items-center justify-center">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl">منظم مواعيد الدواء</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="today">
              <Calendar className="w-4 h-4 ml-2" />
              جرعات اليوم
            </TabsTrigger>
            <TabsTrigger value="plans">
              <Pill className="w-4 h-4 ml-2" />
              خطط العلاج
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            <TodayDoses doses={doses} onToggleDose={handleToggleDose} />
          </TabsContent>

          <TabsContent value="plans" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة خطة علاج جديدة
              </Button>
            </div>
            
            <TreatmentPlansManager
              plans={plans}
              onEdit={(plan) => setEditingPlan(plan)}
              onDelete={handleDeletePlan}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <TreatmentPlanDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddPlan}
      />

      {editingPlan && (
        <TreatmentPlanDialog
          open={!!editingPlan}
          onOpenChange={(open) => !open && setEditingPlan(null)}
          onSave={handleEditPlan}
          initialPlan={editingPlan}
        />
      )}
    </div>
  );
}
