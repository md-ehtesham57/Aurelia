import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useVerifyEmailMutation } from '../../features/auth/authApi';
import Loader from '../../components/common/Loader';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [verifyEmail, { isLoading, isSuccess, isError, error }] = useVerifyEmailMutation();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (token && !done) {
      setDone(true);
      verifyEmail({ token });
    }
  }, [token, done, verifyEmail]);

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 text-center">
      {isSuccess ? (
        <>
          <h1 className="font-serif text-2xl sm:text-3xl mb-4">Email Verified!</h1>
          <p className="text-text-muted mb-6">Your email has been verified successfully.</p>
          <Link to="/login" className="text-primary hover:text-primary-dark transition-colors text-sm">Sign In</Link>
        </>
      ) : isError ? (
        <>
          <h1 className="font-serif text-2xl sm:text-3xl mb-4">Verification Failed</h1>
          <p className="text-text-muted mb-6">{error?.data?.message || 'Invalid or expired link'}</p>
          <Link to="/" className="text-primary hover:text-primary-dark transition-colors text-sm">Go Home</Link>
        </>
      ) : (
        <>
          <h1 className="font-serif text-2xl sm:text-3xl mb-4">Invalid Link</h1>
          <p className="text-text-muted mb-6">No verification token provided.</p>
          <Link to="/" className="text-primary hover:text-primary-dark transition-colors text-sm">Go Home</Link>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
