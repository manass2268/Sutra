import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Mail, Lock, Eye, ShieldCheck, HelpCircle, Home, MessageSquare, Search, Plus, EyeOff } from 'lucide-react';
import Logo from '../assets/SUTRA-favicon-64.png';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      setError("Invalid Email or Password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040B0A] text-white font-sans flex flex-col relative overflow-hidden">
      {/* Top Navbar */}
      <header className="flex justify-between items-center px-8 py-6 relative z-20">
        <div className="flex items-center gap-2">
            <img src={Logo} alt="SUTRA Logo" className="w-12 h-12" />
          <span className="text-xl font-bold tracking-wider">SUTRA</span>
        </div>
        <div className="flex gap-6 text-sm text-gray-400">
          <Link to="/help" className="flex items-center gap-2 hover:text-white transition-colors">
            <HelpCircle size={16} /> Need help?
          </Link>
          <Link to="/" className="flex items-center gap-2 hover:text-white transition-colors border-l border-white/10 pl-6">
            <Home size={16} /> Back to home
          </Link>
        </div>
      </header>

      {/* Main Content Split */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl mx-auto px-8 gap-16 relative z-20">
        
        {/* Left Section: Branding & Mockup */}
        <div className="flex-1 w-full max-w-xl">
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-4">
            Welcome back to <br />
            <span className="text-[#00FF85]">your space.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-12 max-w-md leading-relaxed">
            Private conversations. Clear connections. Your people, all in one place.
          </p>

          {/* Chat UI Mockup Graphic */}
          <div className="relative p-6 bg-[#081310] border border-white/5 rounded-2xl shadow-2xl backdrop-blur-xl w-[90%]">
            <div className="flex items-start gap-4">
              {/* Sidebar */}
              <div className="flex flex-col gap-4 items-center bg-white/5 py-4 px-2 rounded-xl">
                <MessageSquare size={20} className="text-[#00FF85]" />
                <div className="w-8 h-8 rounded-lg bg-white/10"></div>
                <div className="w-8 h-8 rounded-lg bg-white/10"></div>
              </div>
              {/* Main Chat Area */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-white/90">Chats</h3>
                  <div className="flex gap-2">
                    <button className="p-1.5 bg-white/5 rounded-md"><Search size={14} /></button>
                    <button className="p-1.5 bg-white/5 rounded-md"><Plus size={14} /></button>
                  </div>
                </div>
                {/* Chat Item 1 */}
                <div className="flex items-center gap-3 mb-4 p-2 bg-white/5 rounded-lg border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center text-sm font-bold relative">
                    RK
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00FF85] rounded-full border-2 border-[#081310]"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm text-white/90">Rohan K.</span>
                      <span className="text-[10px] text-gray-500">3:42 PM</span>
                    </div>
                    <p className="text-xs text-gray-400">Meeting at 4 PM, confirm?</p>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#00FF85] text-black flex items-center justify-center text-[10px] font-bold">2</div>
                </div>
                {/* Chat Item 2 */}
                <div className="flex items-center gap-3 p-2">
                  <div className="w-10 h-10 rounded-full bg-teal-900 flex items-center justify-center text-sm font-bold relative">
                    SS
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00FF85] rounded-full border-2 border-[#081310]"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm text-white/90">Shalini S.</span>
                      <span className="text-[10px] text-gray-500">1:10 PM</span>
                    </div>
                    <p className="text-xs text-gray-400">The updated design is live.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Shield Icon */}
            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-[#00FF85]/10 rounded-2xl flex items-center justify-center border border-[#00FF85]/20 backdrop-blur-xl animate-pulse">
               <Lock size={24} className="text-[#00FF85]" />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-12 text-sm text-gray-300">
            <ShieldCheck size={20} className="text-[#00FF85]" />
            Your conversations stay protected.
          </div>
        </div>

        {/* Right Section: Login Form */}
        <div className="w-full max-w-md">
          <div className="bg-[#0A1211] border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,255,133,0.05)]">
            <div className="text-center mb-8">
              <img src={Logo} alt="SUTRA Logo" className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Sign in to SUTRA</h2>
              <p className="text-gray-400 text-sm">Continue to your secure workspace</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
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
                  placeholder="Email address"
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

              <div className="flex justify-end">
                <a href="#" className="text-sm text-[#00FF85] hover:underline">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00FF85] hover:bg-[#00e677] text-black font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] mt-2 disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#0A1211] text-gray-500">or continue with</span>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-3 bg-transparent border border-white/20 hover:bg-white/5 text-white font-medium py-3 px-4 rounded-xl transition-colors">
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <p className="mt-8 text-center text-sm text-gray-400">
              New to Sutra? <Link to="/register" className="text-[#00FF85] hover:underline font-medium">Create an account</Link>
            </p>

            <div className="flex items-center justify-center gap-2 mt-8 text-xs text-gray-500">
              <ShieldCheck size={14} className="text-[#00FF85]" />
              Secure sign-in with encrypted access
            </div>
          </div>
        </div>
      </main>

      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#00FF85]/10 rounded-full blur-[150px] pointer-events-none"></div>
    </div>
  );
}