"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { X } from "lucide-react";
import { apiRequest } from "../../lib/api";

export default function LoginClient({ registered, reset }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const nextPath = searchParams.get("next") || "/";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showInstagramSoon, setShowInstagramSoon] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const isRegister = pathname.includes("register");

  const handleInstagramClick = (e) => {
    e.preventDefault();
    setShowInstagramSoon(true);
    setTimeout(() => {
      setShowInstagramSoon(false);
    }, 10000);
  };

  useEffect(() => {
    const errParam = searchParams.get("error");
    if (errParam === "account_exists") {
      setError("An account with this email already exists. Please log in with your password.");
    } else if (errParam === "oauth_failed") {
      const details = searchParams.get("details");
      setError(`Social login failed. Please try again or use your email. ${details ? `(Error: ${details})` : ""}`);
    } else if (errParam === "no_code") {
      setError("Authentication was cancelled.");
    }
  }, [searchParams]);

  const statusMessage = useMemo(() => {
    if (registered === "1") return "Registration complete. Please check your email for the verification link.";
    if (searchParams.get("verified") === "1") return "Email verified successfully! You can now log in.";
    if (reset === "success") return "Password updated. Sign in with your new credentials.";
    if (searchParams.get("expired") === "1") return "Session expired. Please re-verify your credentials to continue.";
    return "";
  }, [registered, reset, searchParams]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await apiRequest("/auth/register", {
          method: "POST",
          body: { name, email, password },
          csrf: true,
        });
        router.push("/login?registered=1");
      } else {
        await apiRequest("/auth/login", {
          method: "POST",
          body: { email, password, rememberMe },
          csrf: true,
        });
        router.push(nextPath);
        router.refresh();
      }
    } catch (requestError) {
      setError(requestError.message ?? "Authentication failed. Check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0F0E17]">
      <div className="max-w-md w-full bg-[#1A1A2E] rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-[#8B5CF6]/20 blur-[100px] pointer-events-none rounded-full" />
        
        {/* Close Button */}
        <Link 
          href="/"
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-all duration-300 z-20 hover:rotate-90 hover:scale-110"
          aria-label="Close"
        >
          <X size={24} strokeWidth={1.5} />
        </Link>

        {/* Logo */}
        <div className="flex justify-center mb-8 relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#8B5CF6]">K3</span>
            <span className="text-xl font-bold tracking-tight text-white">Katabazaar</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-8 relative z-10">
          <Link 
            href="/login" 
            className={`flex-1 text-center py-3 text-sm font-semibold transition-colors border-b-2 ${!isRegister ? 'border-[#8B5CF6] text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className={`flex-1 text-center py-3 text-sm font-semibold transition-colors border-b-2 ${isRegister ? 'border-[#8B5CF6] text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            Register
          </Link>
        </div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="text-2xl font-bold text-white mb-2">{isRegister ? "Create Account" : "Welcome Back!"}</h1>
          <p className="text-gray-400 text-sm">{isRegister ? "Join Katabazaar today" : "Login to continue shopping"}</p>
        </div>

        {statusMessage && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-xl mb-6 text-sm text-center font-medium relative z-10">
            {statusMessage}
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm text-center font-medium relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5 relative z-10">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-[#111] border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] transition-colors placeholder-gray-400"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#111] border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] transition-colors placeholder-gray-400"
              placeholder="john.doe@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              {!isRegister && (
                <Link href="/forgot-password" className="text-sm py-1 text-[#8B5CF6] hover:text-purple-400 transition-colors">
                  Forgot Password?
                </Link>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete={isRegister ? "new-password" : "current-password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#111] border border-white/10 text-white rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] transition-colors placeholder-gray-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {!isRegister && (
            <div className="flex items-center">
              <input type="checkbox" id="remember" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="w-5 h-5 rounded border-white/30 bg-[#111] text-[#8B5CF6] focus:ring-[#8B5CF6] focus:ring-offset-[#1A1A2E]" />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-400">Remember me</label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-semibold py-3.5 rounded-xl transition-colors duration-200 shadow-[0_0_20px_rgba(109,40,217,0.3)] disabled:opacity-70"
          >
            {loading ? "Please wait..." : (isRegister ? "Create Account" : "Login")}
          </button>
        </form>

        <div className="mt-8 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[#1A1A2E] text-gray-300">or continue with</span>
            </div>
          </div>

          {showInstagramSoon && (
            <div className="mt-4 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-purple-300 p-3 rounded-xl text-sm text-center font-medium animate-in fade-in zoom-in duration-300">
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                Instagram login is coming soon!
              </span>
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <a 
              href="http://localhost:4000/api/v1/auth/google"
              aria-label="Sign in with Google" 
              className="flex justify-center items-center py-2.5 border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
            >
              <img src="/images/social/google.svg" className="h-5 w-5" alt="Google" />
            </a>
            <button 
              onClick={handleInstagramClick}
              aria-label="Sign in with Instagram" 
              type="button"
              className="flex justify-center items-center py-2.5 border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-white font-medium text-sm gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-400 relative z-10">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link href={isRegister ? "/login" : "/register"} className="text-[#8B5CF6] hover:text-purple-400 font-medium transition-colors">
            {isRegister ? "Login" : "Register"}
          </Link>
        </p>
      </div>
    </div>
  );
}
