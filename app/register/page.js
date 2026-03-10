"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError("Passwords do not match");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error);
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      router.push("/feed");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&auto=format&fit=crop" alt="bg" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-2xl">✈️</span>
            <span className="text-xl font-black text-white">Wandr</span>
          </Link>
          <h1 className="text-3xl font-black text-white">Create Account</h1>
          <p className="text-white/60 mt-1 text-sm">Start sharing your travel experiences</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
          {error && <div className="mb-5 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">{error}</div>}

          <form onSubmit={submit} className="space-y-4">
            {[
              { label: "Full Name", name: "name", type: "text", placeholder: "John Doe" },
              { label: "Email", name: "email", type: "email", placeholder: "john@example.com" },
              { label: "Password", name: "password", type: "password", placeholder: "Min. 6 characters" },
              { label: "Confirm Password", name: "confirm", type: "password", placeholder: "Repeat password" },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-white/80 text-sm font-medium mb-1">{f.label}</label>
                <input
                  type={f.type} name={f.name} value={form[f.name]}
                  onChange={handle} placeholder={f.placeholder} required
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                />
              </div>
            ))}

            <button
              type="submit" disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-colors mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-white/50 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-400 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}