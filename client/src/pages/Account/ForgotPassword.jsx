import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForgotPasswordMutation } from '../../features/auth/authApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Invalid email'),
});

const ForgotPassword = () => {
  const [sent, setSent] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data).unwrap();
      setSent(true);
      toast.success('Reset link sent if the email exists');
    } catch {
      toast.error('Something went wrong');
    }
  };

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 sm:py-16 text-center">
        <h1 className="font-serif text-2xl sm:text-3xl mb-4">Check Your Email</h1>
        <p className="text-text-muted mb-6">
          If an account with that email exists, we've sent a password reset link.
        </p>
        <Link to="/login" className="text-primary hover:text-primary-dark transition-colors text-sm">
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <h1 className="font-serif text-2xl sm:text-3xl text-center mb-6 sm:mb-8">Forgot Password</h1>
      <p className="text-sm text-text-muted text-center mb-6">
        Enter your email and we'll send you a reset link.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-surface rounded p-4 sm:p-6 space-y-4">
        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </Button>
        <p className="text-center text-sm text-text-muted">
          <Link to="/login" className="text-primary hover:text-primary-dark transition-colors">
            Back to Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
