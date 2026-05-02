import { Card, CardContent } from "@/components/ui/card";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";

export default function DashboardPage() {
  return (
    <section>
      <header className="mb-6">
        <EyebrowLabel className="mb-2">Overview</EyebrowLabel>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
      </header>

      <Card className="p-8">
        <CardContent className="text-muted-foreground">
          Posts management UI lands here when the admin write flow ships.
        </CardContent>
      </Card>
    </section>
  );
}
