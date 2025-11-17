import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Pill, Lock, Phone } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // التحقق من بيانات الحساب التجريبي
    setTimeout(() => {
      if (phone === '01120492320' && password === 'Mostafa@2025') {
        toast.success('تم تسجيل الدخول بنجاح!');
        onLogin();
      } else {
        toast.error('رقم الهاتف أو كلمة المرور غير صحيحة');
      }
      setIsLoading(false);
    }, 800);
  };

  const fillDemoCredentials = () => {
    setPhone('01120492320');
    setPassword('Mostafa@2025');
    toast.info('تم إدخال بيانات الحساب التجريبي');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-gradient-to-br from-blue-500 to-green-500 w-16 h-16 rounded-2xl flex items-center justify-center">
            <Pill className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">منظم مواعيد الدواء</CardTitle>
            <CardDescription className="mt-2">
              سجل دخولك لإدارة خططك العلاجية
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <div className="relative">
                <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="01120492320"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pr-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-900 mb-2">
              <strong>حساب تجريبي:</strong>
            </p>
            <p className="text-xs text-blue-700 mb-1">
              رقم الهاتف: <code className="bg-white px-2 py-0.5 rounded">01120492320</code>
            </p>
            <p className="text-xs text-blue-700 mb-3">
              كلمة المرور: <code className="bg-white px-2 py-0.5 rounded">Mostafa@2025</code>
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={fillDemoCredentials}
            >
              استخدام الحساب التجريبي
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
