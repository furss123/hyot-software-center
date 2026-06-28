const markdownLinePattern = /^(\s*[-*+] |\s*\d+\. |#{1,6} |>|```|•\s)/

function isMarkdownBlock(lines: string[]): boolean {
  return lines.some((line) => markdownLinePattern.test(line))
}

/**
 * Converts admin textarea content into markdown that preserves paragraph breaks.
 * Single newlines in plain text become separate paragraphs; markdown blocks are kept intact.
 */
export function prepareMarkdownContent(source: string): string {
  const normalized = source.replace(/\r\n/g, '\n').trim()
  if (!normalized) return ''

  return normalized
    .split(/\n\n+/)
    .map((block) => {
      const lines = block.split('\n')
      if (isMarkdownBlock(lines)) return block
      return lines
        .map((line) => line.trim())
        .filter(Boolean)
        .join('\n\n')
    })
    .join('\n\n')
}
