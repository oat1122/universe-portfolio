export default function DashboardPage() {
  return (
    <section>
      <header className="mb-6">
        <div className="mb-2 flex items-center gap-3">
          <span className="h-5 w-1 bg-primary" />
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Overview
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
      </header>

      <article className="rounded-xl border border-border bg-surface p-8">
        <p className="text-sm text-muted-foreground">
          Posts management UI lands here when the admin write flow ships.
        </p>
      </article>
    </section>
  );
}
