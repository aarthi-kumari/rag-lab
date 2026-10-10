import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sources } from "@/lib/mock-data"

export function SourcesPanel() {
  return (
    <aside className="hidden w-80 shrink-0 flex-col gap-3 border-l p-4 lg:flex">
      <h2 className="text-sm font-medium">Sources</h2>
      {sources.map((source) => (
        <Card key={source.id} size="sm">
          <CardHeader>
            <CardTitle>{source.title}</CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary">p. {source.page}</Badge>
              <Badge variant="outline">{source.score.toFixed(2)}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{source.excerpt}</p>
          </CardContent>
        </Card>
      ))}
    </aside>
  )
}