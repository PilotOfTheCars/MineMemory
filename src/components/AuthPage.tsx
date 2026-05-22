import React, { useState, useEffect } from 'react';
import { UserAccount } from '../types';
import { sounds } from '../utils/audio';
import { Key, Mail, User, ShieldAlert, Check, HelpCircle, Sparkles, Wand2 } from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: (email: string, displayName: string) => void;
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize Showcase Account inside localStorage if it doesn't exist
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('minememory_users');
      const users: Record<string, UserAccount> = storedUsers ? JSON.parse(storedUsers) : {};
      
      // Ensure "Test" showcase is seeded securely
      const testEmailLower = 'test';
      if (!users[testEmailLower]) {
        users[testEmailLower] = {
          email: 'Test',
          passwordHash: 'Test', // plain text password for this sandbox is fine
          displayName: 'Steve Showcase'
        };
        localStorage.setItem('minememory_users', JSON.stringify(users));
      }
    } catch (e) {
      console.error('Failed to seed showcase user:', e);
    }
  }, []);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const emailTrim = email.trim();
    const emailLower = emailTrim.toLowerCase();
    const pwTrim = password;

    if (!emailTrim || !pwTrim) {
      sounds.playHurt();
      setError('Please provide clean email credentials!');
      return;
    }

    try {
      const storedUsers = localStorage.getItem('minememory_users');
      const users: Record<string, UserAccount> = storedUsers ? JSON.parse(storedUsers) : {};

      if (isLogin) {
        // --- LOGIN FLOW ---
        // Special case handling for 'Test' showcase credentials (case-insensitive for ease, but support exact)
        const matchedUser = users[emailLower];
        
        if (matchedUser && matchedUser.passwordHash === pwTrim) {
          sounds.playLevelUp();
          setSuccess('Login Authorized! Syncing terminal grids...');
          setTimeout(() => {
            onLoginSuccess(matchedUser.email, matchedUser.displayName);
          }, 800);
        } else {
          sounds.playHurt();
          setError('Unauthorized Access: Bad email or password mismatch!');
        }
      } else {
        // --- SIGNUP FLOW ---
        if (users[emailLower]) {
          sounds.playHurt();
          setError('Account Conflict: An inhabitant with this email already lives here!');
          return;
        }

        if (pwTrim.length < 3) {
          sounds.playHurt();
          setError('Tragedy: Password must contain at least 3 blocks!');
          return;
        }

        if (pwTrim !== confirmPassword) {
          sounds.playHurt();
          setError('Discrepancy: Passwords do not align on the compass!');
          return;
        }

        // Create new account
        const finalDisplayName = displayName.trim() || `Explorer_${Math.floor(Math.random() * 9000 + 1000)}`;
        users[emailLower] = {
          email: emailTrim,
          passwordHash: pwTrim,
          displayName: finalDisplayName
        };

        localStorage.setItem('minememory_users', JSON.stringify(users));
        sounds.playLevelUp();
        setSuccess('Access provisioned! Redirecting to login terminal...');
        
        // Switch state
        setTimeout(() => {
          setIsLogin(true);
          setConfirmPassword('');
          setDisplayName('');
        }, 1000);
      }
    } catch (err) {
      sounds.playHurt();
      setError('System Failure: Local Storage core integrity error!');
    }
  };

  const handleAutoFillShowcase = () => {
    sounds.playClick();
    setEmail('Test');
    setPassword('Test');
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="relative min-h-screen bg-minecraft-sky py-12 px-4 flex flex-col items-center justify-center text-zinc-900 overflow-hidden select-none">
      
      {/* Minecraft style background clouds & rolling scenery */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-8 left-[10%] w-60 h-14 bg-white/80 border-b-4 border-r-4 border-white/20 shadow-[6px_6px_0_rgba(0,0,0,0.1)]"></div>
        <div className="absolute top-20 right-[5%] w-80 h-16 bg-white/95 border-b-4 border-l-4 border-white/25 shadow-[6px_6px_0_rgba(0,0,0,0.1)]"></div>
        
        {/* Rolling Green Hills at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-[#4e792c] border-t-8 border-[#3b5d21] opacity-75"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#3b5d21] border-t-8 border-[#294216]"></div>
      </div>
      
      <div className="w-full max-w-sm z-10 space-y-6">
        
        {/* Logo Shield Header */}
        <div className="text-center space-y-2 bg-black/35 p-4 border-4 border-[#3a2a19] rounded-none outline outline-4 outline-[#825430] text-white">
          <div className="w-14 h-14 bg-[#5a8934] border-4 border-white mx-auto flex items-center justify-center text-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] rotate-3">
            M
          </div>
          <h1 className="font-pressstart text-2xl tracking-wider text-[#ffff55]" style={{ textShadow: '2px 2px 0px #000' }}>
            MINE<span className="text-white">MEMORY</span>
          </h1>
          <p className="font-pressstart text-[8px] tracking-widest text-[#aeff55] uppercase font-bold">
            SURVIVAL CORE ENCRYPTION OS
          </p>
        </div>

        {/* Diagnostic notification state messages */}
        {error && (
          <div className="bg-red-950/90 border-4 border-red-600 p-3 text-xs flex items-center gap-2 text-white font-mono shadow-md font-bold">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-[#1e2f18]/90 border-4 border-[#5fac52] p-3 text-xs flex items-center gap-2 text-white font-mono shadow-md font-bold">
            <Check className="w-4 h-4 shrink-0 text-mc-green" />
            <span>{success}</span>
          </div>
        )}

        {/* Standard GUI Panel container */}
        <div className="mc-gui-panel p-5 shadow-2xl relative border-4 text-stone-900">
          
          {/* Tab Selector Buttons */}
          <div className="flex gap-2 border-b-4 border-[#8e8e8e] pb-3 mb-4">
            <button
              onClick={() => { sounds.playClick(); setIsLogin(true); setError(null); }}
              className={`flex-1 py-1.5 px-2 font-mono text-center text-xs tracking-wider uppercase border-4 font-bold ${
                isLogin
                  ? 'bg-[#5fac52] border-white text-white'
                  : 'bg-[#8c8c8c] border-stone-600 text-stone-800'
              }`}
            >
              🔑 SECURE LOGIN
            </button>
            <button
              onClick={() => { sounds.playClick(); setIsLogin(false); setError(null); }}
              className={`flex-1 py-1.5 px-2 font-mono text-center text-xs tracking-wider uppercase border-4 font-bold ${
                !isLogin
                  ? 'bg-[#5fac52] border-white text-white'
                  : 'bg-[#8c8c8c] border-stone-600 text-stone-800'
              }`}
            >
              ✍ PROVISION
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {/* Display Name for SignUp */}
            {!isLogin && (
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-pressstart text-stone-700">DisplayName (Optional):</label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2 w-4 h-4 text-stone-300" />
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="e.g. Herobrine"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-[#4a4a4a] border-2 border-[#1e1e1e] p-1.5 pl-9 text-xs font-mono text-white focus:outline-none focus:border-yellow-400 font-bold"
                  />
                </div>
              </div>
            )}

            {/* Email Form */}
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-pressstart text-stone-700">Realm Email ID:</label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 w-4 h-4 text-stone-300" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Test"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#4a4a4a] border-2 border-[#1e1e1e] p-1.5 pl-9 text-xs font-mono text-white focus:outline-none placeholder-stone-400 font-bold"
                />
              </div>
            </div>

            {/* Password Form */}
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-pressstart text-stone-700">Vault Ciphercode:</label>
              <div className="relative">
                <Key className="absolute left-2.5 top-2.5 w-4 h-4 text-stone-300" />
                <input
                  type="password"
                  required
                  placeholder="e.g. Test"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#4a4a4a] border-2 border-[#1e1e1e] p-1.5 pl-9 text-xs font-mono text-white focus:outline-none placeholder-stone-400 font-bold"
                />
              </div>
            </div>

            {/* Password Confirmation for signup */}
            {!isLogin && (
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-pressstart text-stone-700 font-bold">Align Cipher:</label>
                <div className="relative">
                  <Key className="absolute left-2.5 top-2.5 w-4 h-4 text-stone-300" />
                  <input
                    type="password"
                    required
                    placeholder="Verify code again"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#4a4a4a] border-2 border-[#1e1e1e] p-1.5 pl-9 text-xs font-mono text-white focus:outline-none font-bold"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full mc-button mc-button-green py-2 text-xs font-bold uppercase tracking-wider h-11"
            >
              {isLogin ? '🏆 DECIPHER & LOGIN' : '☄ CREATE FRESH INDEX'}
            </button>

          </form>

          {/* Special ShowCase Callout Widget */}
          <div className="mt-6 pt-4 border-t-2 border-[#8b8b8b] text-center space-y-2.5">
            <div className="bg-[#4a4a4a] border-2 border-[#1e1e1e] p-2 flex flex-col items-center shadow-inner text-white">
              <span className="font-pressstart text-[8px] text-[#ffff55] flex items-center gap-1.5 mb-1 uppercase">
                <Sparkles className="w-3 h-3 text-[#fcaa00]" /> DEMO ARCHIVE TRIAL
              </span>
              <p className="text-[10px] text-zinc-200 font-mono font-bold leading-relaxed">
                Log in with Showcase ID of <span className="text-[#ffff55] font-bold select-all">Test</span> and Code <span className="text-[#ffff55] font-bold select-all">Test</span> to view populated demo worlds!
              </p>
            </div>

            <button
              onClick={handleAutoFillShowcase}
              className="w-full py-2 px-3 bg-[#4e3925] hover:bg-[#6b4e33] border-2 border-[#302113] flex items-center justify-center gap-1.5 text-[8px] font-pressstart text-amber-100 transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5 text-[#ffff55]" /> AUTOFILL DEMO ACCOUNT
            </button>
          </div>

        </div>

      </div>

      {/* Footer system details */}
      <div className="mt-8 text-center text-[10px] text-white bg-black/35 px-4 py-2 border-2 border-[#533d26] font-mono font-bold tracking-wider z-10">
        SECURITY HANDSHAKE SECURED BY MINEMEMORY CORE TERMINAL
      </div>
    </div>
  );
}
