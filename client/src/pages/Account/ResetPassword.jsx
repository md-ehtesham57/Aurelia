import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useResetPasswordMutation } from '../../features/auth/authApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [done, setDone] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Invalid reset link');
      return;
    }
    try {
      await resetPassword({ token, password: data.password }).unwrap();
      setDone(true);
      toast.success('Password reset successful');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to reset password');
    }
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 sm:py-16 text-center">
        <h1 className="font-serif text-2xl sm:text-3xl mb-4">Invalid Link</h1>
        <p className="text-text-muted mb-6">This reset link is invalid or has expired.</p>
        <Link to="/forgot-password" className="text-primary hover:text-primary-dark transition-colors text-sm">
          Request a new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 sm:py-16 text-center">
        <h1 className="font-serif text-2xl sm:text-3xl mb-4">Password Reset</h1>
        <p className="text-text-muted mb-6">Your password has been reset successfully.</p>
        <Link to="/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <h1 className="font-serif text-2xl sm:text-3xl text-center mb-6 sm:mb-8">Set New Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-surface rounded p-4 sm:p-6 space-y-4">
        <Input
          label="New Password"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />
        <Input
          label="Confirm Password"
          type="password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
