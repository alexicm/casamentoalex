import { LoginForm } from "@/components/admin/LoginForm";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";

export default function AdminLoginPage() {
  return (
    <main className="admin-shell paper-bg flex min-h-svh items-center justify-center px-5">
      <div className="w-full max-w-md rounded-[28px] border border-olive/10 bg-paper-light p-8">
        <p className="eyebrow">Alex & Paloma</p>
        <h1 className="mt-3 font-serif text-3xl text-olive">Entrar no painel</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/75">
          Acesso restrito à organização do casamento. Não há senha padrão no
          código.
        </p>
        {!isSupabaseAuthConfigured() ? (
          <p className="mt-6 rounded-2xl bg-terracotta/10 p-4 text-sm text-wine">
            Configure as variáveis do Supabase em `.env.local` para ativar o
            login.
          </p>
        ) : (
          <LoginForm />
        )}
      </div>
    </main>
  );
}
