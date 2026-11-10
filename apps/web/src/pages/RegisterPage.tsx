import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Mail, Lock, Eye, ShieldCheck, HelpCircle, EyeOff, User, LogIn, Users, Zap, ArrowRight } from 'lucide-react';
import Logo from '../assets/SUTRA-favicon-64.png';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Email/Password Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms of Service to continue.");
      return;
    }

    setLoading(true);
    try {
      // 1. Firebase Auth par Account create karo
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Firebase Profile mein user ka 'Full Name' save karo
      await updateProfile(userCredential.user, {
        displayName: fullName
      });

      // 3. BACKEND SYNC: Token nikalkar Express API par bhejo
      const token = await userCredential.user.getIdToken();
      await fetch("http://localhost:5000/api/users/sync-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ displayName: fullName })
      });

      alert('Account created successfully! 🎉');
      navigate('/dashboard'); // Dashboard par bhejo
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In Integration
  const handleGoogleSignIn = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      // 1. Google se Sign In karo
      const userCredential = await signInWithPopup(auth, provider);
      
      // 2. BACKEND SYNC: Token nikalkar Express API par bhejo
      const token = await userCredential.user.getIdToken();
      await fetch("http://localhost:5000/api/users/sync-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ displayName: userCredential.user.displayName })
      });

      alert('Welcome to SUTRA! 🎉');
      navigate('/dashboard'); // Dashboard par bhejo
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  return (
    <div className="min-h-screen bg-[#040B0A] text-white font-sans flex flex-col relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 -left-40 w-[500px] h-[500px] bg-[#00FF85]/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-[#00FF85]/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Top Navbar */}
      <header className="flex justify-between items-center px-8 py-6 relative z-20">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="SUTRA Logo" className="w-10 h-11 mx-auto mb-4" />
          <span className="text-xl font-bold tracking-wider">SUTRA</span>
        </div>
        <div className="flex gap-6 text-sm text-gray-400">
          <Link to="/help" className="flex items-center gap-2 hover:text-white transition-colors">
            <HelpCircle size={16} /> Need help?
          </Link>
          <Link to="/login" className="flex items-center gap-2 hover:text-white transition-colors border-l border-white/10 pl-6">
            <LogIn size={16} /> Back to login
          </Link>
        </div>
      </header>

      {/* Main Content Split */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl mx-auto px-8 gap-16 relative z-20">
        
        {/* Left Section: Branding & Info */}
        <div className="flex-1 w-full max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8 backdrop-blur-md">
             <User size={14} className="text-[#00FF85]" /> Join Sutra
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-4">
            Create your <br />
            <span className="text-[#00FF85]">Sutra account.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-12 max-w-md leading-relaxed">
            Be a part of a private, secure and focused communication space.
          </p>

          {/* Features List */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} className="text-[#00FF85]" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Private & Secure</h3>
                <p className="text-sm text-gray-400">Your data stays protected.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Users size={20} className="text-[#00FF85]" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Invite & Connect</h3>
                <p className="text-sm text-gray-400">Join your trusted network.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Zap size={20} className="text-[#00FF85]" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Fast & Reliable</h3>
                <p className="text-sm text-gray-400">Seamless messaging, anytime.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Registration Form */}
        <div className="w-full max-w-md">
          <div className="bg-[#0A1211] border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,255,133,0.05)]">
            <div className="text-center mb-8">
              <img src={Logo} alt="SUTRA Logo" className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Create an Account</h2>
              <p className="text-gray-400 text-sm">Get started with Sutra in a few steps.</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#050A09] border border-white/10 rounded-xl focus:outline-none focus:border-[#00FF85] text-white placeholder-gray-500 transition-colors"
                  placeholder="Full Name"
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#050A09] border border-white/10 rounded-xl focus:outline-none focus:border-[#00FF85] text-white placeholder-gray-500 transition-colors"
                  placeholder="Email Address"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-[#050A09] border border-white/10 rounded-xl focus:outline-none focus:border-[#00FF85] text-white placeholder-gray-500 transition-colors"
                  placeholder="Password"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Confirm Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-[#050A09] border border-white/10 rounded-xl focus:outline-none focus:border-[#00FF85] text-white placeholder-gray-500 transition-colors"
                  placeholder="Confirm Password"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 py-2">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 bg-[#050A09] border-white/10 rounded focus:ring-[#00FF85] focus:ring-offset-0 text-[#00FF85] accent-[#00FF85]"
                  />
                </div>
                <label className="text-xs text-gray-400 leading-tight">
                  I agree to the <a href="#" className="text-[#00FF85] hover:underline">Terms of Service</a> and <a href="#" className="text-[#00FF85] hover:underline">Privacy Policy</a>.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#00FF85] hover:bg-[#00e677] text-black font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] mt-2 disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={18} />
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-[#0A1211] text-gray-500">or sign up with</span>
              </div>
            </div>

            {/* Google Authentication Button */}
            <button 
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-transparent border border-white/20 hover:bg-white/5 text-white font-medium py-3 px-4 rounded-xl transition-colors"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <p className="mt-8 text-center text-sm text-gray-400">
              Already have an account? <Link to="/login" className="text-[#00FF85] hover:underline font-medium">Log in</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}