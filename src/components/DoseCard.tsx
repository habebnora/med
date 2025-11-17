import { Dose } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle2, Circle, Clock, Pill, Info } from 'lucide-react';
import { useState } from 'react';
import { MedicationInfoDialog } from './MedicationInfoDialog';

interface DoseCardProps {
  dose: Dose;
  onToggle: () => void;
}

export function DoseCard({ dose, onToggle }: DoseCardProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <Card className={`${dose.taken ? 'bg-gray-50 border-gray-200' : 'border-blue-200 bg-blue-50/30'}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* أيقونة الوقت */}
            <div className="flex-shrink-0 mt-1">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                dose.taken ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                <Clock className={`w-5 h-5 ${dose.taken ? 'text-green-600' : 'text-blue-600'}`} />
              </div>
            </div>

            {/* معلومات الدواء */}
            <div className="flex-grow min-w-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className={dose.taken ? 'line-through opacity-60' : ''}>
                  <h3 className="font-semibold">{dose.medicationName}</h3>
                  <p className="text-sm text-gray-600">{dose.dosage}</p>
                </div>
                <Badge variant={dose.taken ? 'secondary' : 'default'} className="flex-shrink-0">
                  {dose.time}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Pill className="w-4 h-4" />
                <span>{dose.planName}</span>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={dose.taken ? 'outline' : 'default'}
                  onClick={onToggle}
                  className="flex-grow"
                >
                  {dose.taken ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 ml-2" />
                      تم أخذها
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 ml-2" />
                      تم أخذها
                    </>
                  )}
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowInfo(true)}
                >
                  <Info className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <MedicationInfoDialog
        open={showInfo}
        onOpenChange={setShowInfo}
        medicationName={dose.medicationName}
      />
    </>
  );
}
