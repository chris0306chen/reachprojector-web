"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "邮箱或密码错误");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500">
            <span className="text-2xl font-bold text-white">R</span>
          </div>
          <h1 className="text-2xl font-bold text-white">REACH 管理后台</h1>
          <p className="mt-2 text-slate-400">HK REACH SOURCING LIMITED</p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <h2 className="mb-6 text-xl font-bold text-slate-900">管理员登录</h2>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" /><span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">邮箱地址</span>
              <span className="relative block">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)}
                  placeholder="请输入管理员邮箱" required
                  className="w-full rounded-lg border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500" />
              </span>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">密码</span>
              <span className="relative block">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input type={showPassword ? "text" : "password"} value={password}
                  onChange={(event) => setPassword(event.target.value)} placeholder="请输入密码" required
                  className="w-full rounded-lg border border-slate-300 py-3 pl-11 pr-12 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label={showPassword ? "隐藏密码" : "显示密码"}>
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </span>
            </label>
            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-slate-900 py-3 font-medium text-white hover:bg-slate-800 disabled:opacity-50">
              {loading ? "正在登录……" : "登录"}
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-slate-400">仅限授权管理员使用</p>
        </div>
      </div>
    </div>
  );
}
