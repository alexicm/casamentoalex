"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signError) {
        setError("Não foi possível entrar. Confira o e-mail e a senha.");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("O login ainda não está disponível.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <label className="block text-sm text-olive">
        E-mail
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="focus-ring mt-2 min-h-12 w-full rounded-2xl border border-olive/20 bg-paper px-4"
        />
      </label>
      <label className="block text-sm text-olive">
        Senha
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="focus-ring mt-2 min-h-12 w-full rounded-2xl border border-olive/20 bg-paper px-4"
        />
      </label>
      {error ? <p className="text-sm text-wine">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="ink-button focus-ring min-h-12 w-full rounded-full bg-olive text-sm tracking-[0.16em] text-paper-light uppercase"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
