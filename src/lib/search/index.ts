export interface SearchResult {
  type: 'software'
  slug: string
  title: string
  excerpt: string
  url: string
}

export interface SearchAdapter {
  search(query: string): Promise<SearchResult[]>
  initialize(index: SearchIndex): void
}

export interface SearchIndex {
  software: Array<{ slug: string; name: string; description: string }>
  faq: Array<{ id: string; question: string; answer: string }>
}
