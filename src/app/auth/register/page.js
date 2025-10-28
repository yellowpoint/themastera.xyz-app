'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { generateVerifyEmailCallbackURL } from '@/utils/auth';

export default function RegisterPage() {
  const { signUp, loading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    agreeTerms: false,
    agreeMarketing: false
  });

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegister = async () => {
    // Clear previous errors
    setError('');

    // Form validation
    if (!formData.username.trim()) {
      setError('Please enter your username');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!formData.password) {
      setError('Please enter your password');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signUp(
        {
          email: formData.email,
          password: formData.password,
          name: formData.username,
          callbackURL: generateVerifyEmailCallbackURL(formData.email),
          referral_code: formData.referralCode || null,
          agree_marketing: formData.agreeMarketing,
        }
      );

      if (result.error) {
        setError(getErrorMessage(result.error));
      } else {
        setError('Registration successful! Please check your email and click the verification link to activate your account.');
      }
    } catch (err) {
      setError('Registration failed, please try again later');
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Error message handling - directly return the original error message from Better Auth
  const getErrorMessage = (error) => {
    const errorString = typeof error === 'string' ? error : error?.message || '';
    return errorString || 'Registration failed, please try again later';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-content1 border-divider">
          <CardHeader className="flex flex-col gap-3 pb-6">
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-r from-lime-400 to-green-400 rounded-xl flex items-center justify-center">
                <span className="text-black font-bold text-xl">M</span>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Join Mastera</h1>
              <p className="text-gray-400 text-sm">Start your creative journey</p>
            </div>
          </CardHeader>

          <CardContent className="gap-4 flex flex-col">
            <div className="flex flex-col gap-2">
              <label className="text-gray-300 text-sm">Username</label>
              <Input
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-300 text-sm">Email Address</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-300 text-sm">Password</label>
              <div className="relative">
                <Input
                  type={isVisible ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-300 text-sm">Confirm Password</label>
              <div className="relative">
                <Input
                  type={isConfirmVisible ? 'text' : 'password'}
                  placeholder="Enter password again"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                />
                <button
                  type="button"
                  onClick={toggleConfirmVisibility}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {isConfirmVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-300 text-sm">Referral Code (Optional)</label>
              <Input
                type="text"
                placeholder="Enter referral code for extra rewards"
                value={formData.referralCode}
                onChange={(e) => handleInputChange('referralCode', e.target.value)}
              />
              <p className="text-gray-400 text-xs">Get 500 Mastera Points by registering with a referral code</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeTerms', checked === true)}
                />
                <label htmlFor="agreeTerms" className="text-gray-300 text-sm">
                  I agree to the{' '}
                  <Link href="#" className="text-lime-400 hover:text-lime-300">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="#" className="text-lime-400 hover:text-lime-300">Privacy Policy</Link>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="agreeMarketing"
                  checked={formData.agreeMarketing}
                  onCheckedChange={(checked) => handleInputChange('agreeMarketing', checked === true)}
                />
                <label htmlFor="agreeMarketing" className="text-gray-300 text-sm">
                  Receive product updates and marketing information
                </label>
              </div>
            </div>

            {/* Error message display */}
            {error && (
              <div className={`text-sm p-3 rounded-lg ${error.includes('Registration successful')
                ? 'bg-green-900/50 text-green-400 border border-green-700'
                : 'bg-red-900/50 text-red-400 border border-red-700'
                }`}>
                {error}
              </div>
            )}

            <Button
              className="w-full bg-gradient-to-r from-lime-400 to-green-400 text-black font-semibold"
              onClick={handleRegister}
              disabled={!formData.agreeTerms || isSubmitting || loading}
            >
              {isSubmitting || loading ? 'Creating...' : 'Create Account'}
            </Button>

            <Separator className="my-4" />

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-divider hover:border-lime-400"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign up with Google
              </Button>

              <Button
                variant="outline"
                className="w-full border-divider hover:border-lime-400"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
                Sign up with Twitter
              </Button>
            </div>

            <div className="text-center mt-6">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-lime-400 hover:text-lime-300">Log in now</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}