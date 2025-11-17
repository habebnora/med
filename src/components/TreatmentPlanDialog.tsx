import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { TreatmentPlan, Medication } from '../types';
import { toast } from 'sonner@2.0.3';

interface TreatmentPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (plan: TreatmentPlan) => void;
  initialPlan?: TreatmentPlan;
}

export function TreatmentPlanDialog({ open, onOpenChange, onSave, initialPlan }: TreatmentPlanDialogProps) {
  const [planName, setPlanName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [durationDays, setDurationDays] = useState('7');
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    if (initialPlan) {
      setPlanName(initialPlan.name);
      setStartDate(initialPlan.startDate);
      setDurationDays(String(initialPlan.durationDays));
      setMedications(initialPlan.medications);
    } else {
      // إعادة تعيين النموذج
      setPlanName('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setDurationDays('7');
      setMedications([]);
    }
  }, [initialPlan, open]);

  const addMedication = () => {
    const newMed: Medication = {
      id: `med-${Date.now()}`,
      name: '',
      dosage: '',
      timesPerDay: 1,
      firstDoseTime: '08:00',
    };
    setMedications([...medications, newMed]);
  };

  const updateMedication = (index: number, field: keyof Medication, value: string | number) => {
    const newMedications = [...medications];
    (newMedications[index] as any)[field] = value;
    setMedications(newMedications);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!planName.trim()) {
      toast.error('الرجاء إدخال اسم الخطة');
      return;
    }

    if (medications.length === 0) {
      toast.error('الرجاء إضافة دواء واحد على الأقل');
      return;
    }

    for (const med of medications) {
      if (!med.name.trim() || !med.dosage.trim()) {
        toast.error('الرجاء إكمال جميع بيانات الأدوية');
        return;
      }
    }

    const plan: TreatmentPlan = {
      id: initialPlan?.id || `plan-${Date.now()}`,
      name: planName,
      startDate,
      durationDays: Number(durationDays),
      medications,
    };

    onSave(plan);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialPlan ? 'تعديل خطة العلاج' : 'إضافة خطة علاج جديدة'}</DialogTitle>
          <DialogDescription>
            قم بإدخال تفاصيل خطة العلاج والأدوية المطلوبة
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* معلومات الخطة */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="planName">اسم خطة العلاج *</Label>
              <Input
                id="planName"
                placeholder="مثال: علاج نزلة البرد"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">تاريخ البدء *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="durationDays">عدد الأيام *</Label>
                <Input
                  id="durationDays"
                  type="number"
                  min="1"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* الأدوية */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3>الأدوية *</h3>
              <Button type="button" size="sm" onClick={addMedication}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة دواء
              </Button>
            </div>

            {medications.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center text-gray-500">
                  <p>لم تتم إضافة أي أدوية بعد</p>
                  <p className="text-sm mt-1">اضغط "إضافة دواء" لإضافة الدواء الأول</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {medications.map((med, index) => (
                  <Card key={med.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">دواء #{index + 1}</CardTitle>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeMedication(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>اسم الدواء *</Label>
                          <Input
                            placeholder="مثال: باراسيتامول"
                            value={med.name}
                            onChange={(e) => updateMedication(index, 'name', e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>الجرعة *</Label>
                          <Input
                            placeholder="مثال: 500 ملغ"
                            value={med.dosage}
                            onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>عدد المرات في اليوم *</Label>
                          <Input
                            type="number"
                            min="1"
                            max="24"
                            value={med.timesPerDay}
                            onChange={(e) => updateMedication(index, 'timesPerDay', Number(e.target.value))}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>وقت الجرعة الأولى *</Label>
                          <Input
                            type="time"
                            value={med.firstDoseTime}
                            onChange={(e) => updateMedication(index, 'firstDoseTime', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        <p>سيتم توزيع الجرعات تلقائيًا على مدار اليوم بفترات متساوية</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* أزرار الحفظ والإلغاء */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit">
              {initialPlan ? 'حفظ التعديلات' : 'إضافة الخطة'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
