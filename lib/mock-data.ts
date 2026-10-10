export type Chat = {
  id: string
  title: string
}

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export type SourceChunk = {
  id: string
  title: string
  page: number
  excerpt: string
  score: number
}

export const chats: Chat[] = [
  { id: "overlap", title: "What is chunk overlap?" },
  { id: "refund", title: "Cite the refund policy" },
  { id: "embed-vs-keyword", title: "Embedding vs keyword search" },
]

export const messagesByChat: Record<string, Message[]> = {
  overlap: [
    {
      id: "overlap-1",
      role: "user",
      content: "What is chunk overlap, and why do people use it?",
    },
    {
      id: "overlap-2",
      role: "assistant",
      content:
        "Overlap is the repeated text shared by neighboring chunks. It keeps a sentence that sits on a split from being cut in half, so retrieval can still find it.",
    },
  ],
  refund: [
    {
      id: "refund-1",
      role: "user",
      content: "What does the refund policy say about opened items?",
    },
    {
      id: "refund-2",
      role: "assistant",
      content:
        "Opened items can be returned within 14 days if the packaging is included. Digital downloads are excluded.",
    },
  ],
  "embed-vs-keyword": [
    {
      id: "embed-1",
      role: "user",
      content: "When should I use embeddings instead of keyword search?",
    },
    {
      id: "embed-2",
      role: "assistant",
      content:
        "Embeddings help when the question uses different words than the document. Keyword search is better when the exact term must appear.",
    },
  ],
}

export const sources: SourceChunk[] = [
  {
    id: "chunk-1",
    title: "retrieval-notes.pdf",
    page: 3,
    excerpt:
      "Neighboring chunks share a small overlap so a sentence that crosses a boundary is still stored in full.",
    score: 0.86,
  },
  {
    id: "chunk-2",
    title: "refund-policy.pdf",
    page: 1,
    excerpt:
      "Opened items may be returned within 14 days when the original packaging is included. Digital downloads are final.",
    score: 0.71,
  },
]
