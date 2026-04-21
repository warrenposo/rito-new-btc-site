import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Footer } from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/\S+@\S+\.\S+/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo,
      });
      if (resetError) throw resetError;
      setMessage(
        'If an account exists for this email, you will receive a reset link shortly. Open it on this same site (check spam).',
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1421] flex flex-col">
      <div className="relative h-28 bg-[#050C1A] flex items-center justify-center">
        <h1 className="text-3xl font-bold text-white">Reset password</h1>
      </div>
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md rounded-lg border border-white/5 bg-[#0F1A2B] p-6 sm:p-8">
          <p className="text-sm text-white/60 mb-6">
            Enter your account email. We will send you a link to choose a new password.
          </p>
          {error && (
            <div className="mb-4 rounded-md border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>
          )}
          {message && (
            <div className="mb-4 rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200">
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white/70">
                Email
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#0B1421] pl-10 text-white border-white/10"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-semibold"
            >
              {loading ? 'Sending…' : 'Send reset link'}
            </Button>
          </form>
          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
