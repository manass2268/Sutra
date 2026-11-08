import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Account created successfully! 🎉');
      navigate('/'); 
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md p-10 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            Join SUTRA
          </h2>
          <p className="text-gray-400 text-sm">Create an account to get started</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-6 text-sm text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-600 transition-all"
              placeholder="hello@sutra.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-600 transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 hover:underline transition-colors font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}