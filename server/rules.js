function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function fileList(files) {
  if (files.length === 0) return "This chat has no uploaded files yet."
  const names = files.map((file) => `- ${file.originalName}`).join("\n")
  return `Files in this chat:\n${names}`
}

function ruleReply(text, files) {
  const q = normalize(text)

  if (/^(hi+|hello|hey|yo|good morning|good afternoon|good evening)( there)?$/.test(q)) {
    return "Hi. I answer a few fixed questions: chunk overlap, embeddings, RAG, or list files."
  }

  if (/^(thanks|thank you|thx)$/.test(q)) {
    return "You're welcome."
  }

  if (/\b(help|what can you do)\b/.test(q)) {
    return "Try one of these: hello, what is chunk overlap, what is an embedding, what is RAG, or list files."
  }

  if (/chunk overlap|\boverlap\b/.test(q)) {
    return "Chunk overlap is the repeated text shared by neighboring chunks when a document is split. A small overlap (about 50 to 200 tokens) keeps a sentence that sits on a boundary from being cut in half, so a later search can still find it."
  }

  if (/\bembeddings?\b/.test(q)) {
    return "An embedding turns a piece of text into a list of numbers. Similar text gets similar numbers, which is how a search can match a question to a passage even when the words are not identical. This server does not compute embeddings yet."
  }

  if (/\brag\b/.test(q) && /fine-?\s?tun/.test(q)) {
    return "Fine-tuning changes a model's weights using examples. RAG leaves the model as-is and adds retrieved passages at question time. This chat uses neither: replies come from fixed rules."
  }

  if (/\brag\b|retrieval augmented/.test(q)) {
    return "RAG means retrieval-augmented generation: look up passages from your documents, then answer from those passages. This server only matches rules, so it does not retrieve or generate yet."
  }

  if (/fine-?\s?tun/.test(q)) {
    return "Fine-tuning trains a model on your examples so the weights change. RAG does not change the model; it supplies passages at question time. This chat does neither."
  }

  if (/\b(list files|my files|uploaded files|what files|show files)\b/.test(q)) {
    return fileList(files)
  }

  if (/\b(summarize|summary|compare)\b/.test(q)) {
    const listed = fileList(files)
    return `I can't read document text yet, so I can't summarize or compare. ${listed}`
  }

  if (/\b(policy|refund|return)\b/.test(q)) {
    const listed = fileList(files)
    return `I don't have a policy stored as a rule. ${listed}`
  }

  return "I don't have a rule for that. Try hello, chunk overlap, embeddings, RAG, or list files."
}

module.exports = { ruleReply }
