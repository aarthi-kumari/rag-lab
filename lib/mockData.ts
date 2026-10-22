export const USE_MOCK_SOURCES = false

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: SourceChunk[]
}

export type SourceChunk = {
  id: string
  title: string
  page: number
  excerpt: string
  quote: string
  score: number
}

export type ChatSummary = {
  id: string
  title: string
  createdAt: string
}

export function titleFromText(text: string) {
  const trimmed = text.replace(/\s+/g, " ").trim()
  if (!trimmed) return "New chat"
  if (trimmed.length <= 40) return trimmed
  return `${trimmed.slice(0, 40)}…`
}

export const sources: SourceChunk[] = [
  {
    id: "chunk-1",
    title: "retrieval-notes.pdf",
    page: 3,
    excerpt:
      "Overlap keeps a sentence that sits on a chunk boundary from being cut in half.",
    quote:
      "Neighboring chunks share 50 to 200 tokens so a sentence that crosses a boundary is stored in full.",
    score: 0.86,
  },
  {
    id: "chunk-2",
    title: "refund-policy.pdf",
    page: 1,
    excerpt:
      "Opened physical items can be returned. Digital downloads cannot.",
    quote:
      "Opened items may be returned within 14 days when the original packaging is included.",
    score: 0.71,
  },
]

const sourcesByMessageId: Record<string, SourceChunk[]> = {
  "demo-overlap-2": [sources[0]],
  "demo-refund-2": [sources[1]],
}

export function sourcesForMessage(messageId: string) {
  if (!USE_MOCK_SOURCES) return []
  return sourcesByMessageId[messageId] ?? []
}

export const messagesByChat: Record<string, Message[]> = {
  "demo-overlap": [
    {
      id: "demo-overlap-1",
      role: "user",
      content: "What is chunk overlap, and why do people use it?",
    },
    {
      id: "demo-overlap-2",
      role: "assistant",
      content:
        "Chunk overlap is the repeated text shared by neighboring chunks when a document is split into smaller pieces. It keeps a sentence from being cut in half, so retrieval can still find it when a boundary falls in the middle of a thought.\n\nWhy it is used\n1. Preserves context. A sentence stays complete in at least one chunk.\n2. Improves retrieval quality. Embeddings can capture the full meaning.\n3. Handles boundary issues. Useful when an idea spans two chunks.\n\nExample\nIf a sentence is split between two chunks, a small overlap (50 to 200 tokens) keeps the full sentence in at least one chunk.",
      sources: sourcesForMessage("demo-overlap-2"),
    },
  ],
  "demo-refund": [
    {
      id: "demo-refund-1",
      role: "user",
      content: "What does the refund policy say about opened items?",
    },
    {
      id: "demo-refund-2",
      role: "assistant",
      content:
        "Opened items can be returned within 14 days if the original packaging is included. Digital downloads are final.",
      sources: sourcesForMessage("demo-refund-2"),
    },
  ],
}

export const demoChats: ChatSummary[] = [
  {
    id: "demo-overlap",
    title: titleFromText(messagesByChat["demo-overlap"][0].content),
    createdAt: "2026-10-22T13:54:00.000Z",
  },
  {
    id: "demo-refund",
    title: titleFromText(messagesByChat["demo-refund"][0].content),
    createdAt: "2026-10-22T11:10:00.000Z",
  },
  {
    id: "demo-embed",
    title: "Embedding vs keyword search",
    createdAt: "2026-10-22T09:42:00.000Z",
  },
  {
    id: "demo-summarize",
    title: "Summarize retrieval notes",
    createdAt: "2026-10-19T12:00:00.000Z",
  },
  {
    id: "demo-returns",
    title: "Refund and return policy",
    createdAt: "2026-10-18T12:00:00.000Z",
  },
  {
    id: "demo-finetune",
    title: "RAG vs fine-tuning",
    createdAt: "2026-10-16T12:00:00.000Z",
  },
]

export const suggestions = [
  "Summarize this document",
  "Find a policy",
  "Compare documents",
]
