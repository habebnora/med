import { Dose } from '../types';
import { DoseCard } from './DoseCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';

interface TodayDosesProps {
  doses: Dose[];
  onToggleDose: (doseId: string) => void;
}

export function TodayDoses({ doses, onToggleDose }: TodayDosesProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayDoses = doses.filter((d) => d.date === today);

  // ترتيب حسب الوقت
  const sortedDoses = [...todayDoses].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });

  const pendingDoses = sortedDoses.filter((d) => !d.taken);
  const takenDoses = sortedDoses.filter((d) => d.taken);

  if (todayDoses.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>لا توجد جرعات مقررة لليوم</p>
            <p className="text-sm mt-2">قم بإضافة خطة علاج جديدة للبدء</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* إحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>إجمالي الجرعات</CardDescription>
            <CardTitle className="text-3xl">{todayDoses.length}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>تم أخذها</CardDescription>
            <CardTitle className="text-3xl text-green-600">{takenDoses.length}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>في انتظارك</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{pendingDoses.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* الجرعات المعلقة */}
      {pendingDoses.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg">جرعات في انتظارك ({pendingDoses.length})</h2>
          </div>
          <div className="space-y-3">
            {pendingDoses.map((dose) => (
              <DoseCard
                key={dose.id}
                dose={dose}
                onToggle={() => onToggleDose(dose.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* الجرعات المأخوذة */}
      {takenDoses.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h2 className="text-lg">جرعات تم أخذها ({takenDoses.length})</h2>
          </div>
          <div className="space-y-3">
            {takenDoses.map((dose) => (
              <DoseCard
                key={dose.id}
                dose={dose}
                onToggle={() => onToggleDose(dose.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
