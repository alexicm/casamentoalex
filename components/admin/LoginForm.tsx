"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { unlockAdminWithCode } from "@/app/admin/actions";

export function LoginForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await unlockAdminWithCode(code);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Não foi possível entrar agora. Tente de novo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <label className="block text-sm text-olive">
        Código de acesso
        <input
          type="password"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Digite o código"
          className="focus-ring mt-2 min-h-12 w-full rounded-2xl border border-olive/20 bg-paper px-4 tracking-[0.2em]"
        />
      </label>
      {error ? (
        <p className="text-sm text-wine" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="ink-button focus-ring min-h-12 w-full rounded-full bg-olive text-sm tracking-[0.16em] text-paper-light uppercase"
      >
        {loading ? "Entrando..." : "Entrar no painel"}
      </button>
    </form>
  );
}
