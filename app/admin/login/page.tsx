import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { adminCodeConfigured } from "@/lib/auth/admin-code";
import { getAdminUser } from "@/lib/auth/admin";

export default async function AdminLoginPage() {
  const admin = await getAdminUser();
  if (admin) redirect("/admin/dashboard");

  return (
    <main className="admin-shell paper-bg flex min-h-svh items-center justify-center px-5">
      <div className="w-full max-w-md rounded-[28px] border border-olive/10 bg-paper-light p-8">
        <p className="eyebrow">Alex & Paloma</p>
        <h1 className="mt-3 font-serif text-3xl text-olive">Entrar no painel</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/75">
          Digite o código de acesso para ver quem confirmou e organizar a lista.
        </p>
        {adminCodeConfigured() ? (
          <LoginForm />
        ) : (
          <p className="mt-6 rounded-2xl bg-terracotta/10 p-4 text-sm text-wine">
            O código de acesso do painel ainda não está configurado.
          </p>
        )}
      </div>
    </main>
  );
}
