import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SourceChunk } from "@/lib/mockData"

export function SourcesPanel({
  sources,
  showDemoBadge,
}: {
  sources: SourceChunk[]
  showDemoBadge: boolean
}) {
  return (
    <aside className="flex h-full min-h-0 flex-col gap-3 overflow-auto p-4">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-medium">Sources</h2>
        {showDemoBadge ? <Badge variant="secondary">Demo data</Badge> : null}
      </div>
      {sources.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No sources for this message.
        </p>
      ) : (
        sources.map((source) => (
          <Card key={source.id} size="sm">
            <CardHeader>
              <CardTitle>{source.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">p. {source.page}</Badge>
                <span className="font-mono text-xs font-medium text-muted-foreground">
                  {source.score.toFixed(2)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <p className="text-muted-foreground">{source.excerpt}</p>
                <p className="rounded-lg bg-muted px-3 py-2 text-muted-foreground">
                  “{source.quote}”
                </p>
                <Button type="button" variant="outline" size="sm">
                  View page
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </aside>
  )
}
