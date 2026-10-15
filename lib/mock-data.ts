export type ChatGroup = "today" | "previous"

export type Chat = {
  id: string
  title: string
  group: ChatGroup
  when: string
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
  quote: string
  score: number
}

export const chats: Chat[] = [
  { id: "overlap", title: "What is chunk overlap?", group: "today", when: "7:24 PM" },
  { id: "refund", title: "Cite the refund policy", group: "today", when: "5:10 PM" },
  { id: "embed-vs-keyword", title: "Embedding vs keyword search", group: "today", when: "3:42 PM" },
  { id: "summarize", title: "Summarize retrieval notes", group: "previous", when: "Oct 13" },
  { id: "returns", title: "Refund and return policy", group: "previous", when: "Oct 12" },
  { id: "finetune", title: "RAG vs fine-tuning", group: "previous", when: "Oct 10" },
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
        "Chunk overlap is the repeated text shared by neighboring chunks when a document is split into smaller pieces. It keeps a sentence from being cut in half, so retrieval can still find it when a boundary falls in the middle of a thought.\n\nWhy it is used\n1. Preserves context. A sentence stays complete in at least one chunk.\n2. Improves retrieval quality. Embeddings can capture the full meaning.\n3. Handles boundary issues. Useful when an idea spans two chunks.\n\nExample\nIf a sentence is split between two chunks, a small overlap (50 to 200 tokens) keeps the full sentence in at least one chunk.",
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
        "Opened items can be returned within 14 days if the original packaging is included. Digital downloads are final.",
    },
  ],
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
export const suggestions = [
  "Summarize this document",
  "Find a policy",
  "Compare documents",
]
export const indexedFileCount = 2
