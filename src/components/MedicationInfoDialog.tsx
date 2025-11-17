import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface MedicationInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicationName: string;
}

export function MedicationInfoDialog({ open, onOpenChange, medicationName }: MedicationInfoDialogProps) {
  const [info, setInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedicationInfo = async () => {
    setIsLoading(true);
    setError(null);
    setInfo(null);

    try {
      // في التطبيق الحقيقي، هنا سنستخدم Gemini API
      // حاليًا سنستخدم بيانات تجريبية
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // محاكاة استجابة Gemini AI
      const mockInfo = `
**${medicationName}**

**الاستخدامات الشائعة:**
يستخدم هذا الدواء عادة لعلاج الأعراض المرتبطة بالحالة الطبية المحددة. يعمل من خلال آليات علاجية محددة تساعد في تخفيف الأعراض وتحسين الحالة الصحية.

**كيفية الاستخدام:**
• يُنصح بتناول الدواء وفقًا لتوجيهات الطبيب
• يمكن تناوله مع الطعام أو بدونه حسب الإرشادات
• الالتزام بالجرعة المحددة والمواعيد المقررة

**الأعراض الجانبية الشائعة:**
• صداع خفيف
• دوخة
• اضطرابات معوية خفيفة
• جفاف الفم

**تحذيرات هامة:**
• لا تتوقف عن تناول الدواء دون استشارة الطبيب
• أخبر طبيبك إذا كنت تتناول أدوية أخرى
• تجنب الكحول أثناء العلاج
• احفظ الدواء في مكان بارد وجاف

**متى تتصل بالطبيب:**
اتصل بطبيبك فورًا إذا واجهت أي أعراض جانبية شديدة أو غير عادية، أو إذا لم تتحسن حالتك بعد فترة العلاج المحددة.
      `;

      setInfo(mockInfo.trim());
    } catch (err) {
      setError('حدث خطأ أثناء جلب معلومات الدواء. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setInfo(null);
      setError(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            معلومات عن {medicationName}
          </DialogTitle>
          <DialogDescription>
            معلومات مقدمة من الذكاء الاصطناعي (Gemini AI)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* إخلاء المسؤولية */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>إخلاء مسؤولية:</strong> المعلومات المقدمة هنا إرشادية فقط ولا تغني عن استشارة الطبيب أو الصيدلي. استشر طبيبك دائمًا قبل تناول أي دواء.
            </AlertDescription>
          </Alert>

          {/* المحتوى */}
          {!info && !isLoading && !error && (
            <div className="text-center py-8">
              <Button onClick={fetchMedicationInfo}>
                <Sparkles className="w-4 h-4 ml-2" />
                جلب معلومات الدواء
              </Button>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-blue-500" />
              <p className="text-gray-600">جارٍ جلب المعلومات من Gemini AI...</p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {info && (
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border">
                {info}
              </div>
              <Button
                onClick={fetchMedicationInfo}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                تحديث المعلومات
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
