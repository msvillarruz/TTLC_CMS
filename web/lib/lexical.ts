type LexicalNode = {
  type: string
  children?: LexicalNode[]
  text?: string
  format?: number
  tag?: string
  url?: string
  listType?: string
  newTab?: boolean
  fields?: { url?: string; newTab?: boolean }
}

function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function serializeText(node: LexicalNode): string {
  const raw = node.text || ''
  if (!raw) return ''
  let t = esc(raw)
  const f = node.format || 0
  if (f & 16) return `<code>${t}</code>`
  if (f & 1)  t = `<strong>${t}</strong>`
  if (f & 2)  t = `<em>${t}</em>`
  if (f & 4)  t = `<s>${t}</s>`
  if (f & 8)  t = `<u>${t}</u>`
  return t
}

function serializeNode(node: LexicalNode): string {
  const kids = () => (node.children || []).map(serializeNode).join('')
  switch (node.type) {
    case 'root':
      return kids()
    case 'paragraph':
      return `<p>${kids()}</p>`
    case 'heading':
      return `<${node.tag}>${kids()}</${node.tag}>`
    case 'text':
      return serializeText(node)
    case 'linebreak':
      return '<br>'
    case 'list':
      return node.listType === 'number' ? `<ol>${kids()}</ol>` : `<ul>${kids()}</ul>`
    case 'listitem':
      return `<li>${kids()}</li>`
    case 'link': {
      const href = node.url || node.fields?.url || '#'
      const target = (node.newTab || node.fields?.newTab) ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${esc(href)}"${target}>${kids()}</a>`
    }
    case 'quote':
      return `<blockquote>${kids()}</blockquote>`
    case 'code':
      return `<pre><code>${kids()}</code></pre>`
    case 'horizontalrule':
      return '<hr>'
    default:
      return kids()
  }
}

export function serializeLexical(content: unknown): string {
  if (!content || typeof content !== 'object') return ''
  const root = (content as { root?: LexicalNode }).root
  if (!root) return ''
  return serializeNode(root)
}
