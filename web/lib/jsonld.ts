type JsonRecord = Record<string, unknown>

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function schemaTypes(value: unknown): string[] {
  if (!isRecord(value)) return []
  const type = value['@type']
  if (typeof type === 'string') return [type]
  if (Array.isArray(type)) return type.filter((item): item is string => typeof item === 'string')
  return []
}

function nodesOf(data: unknown): JsonRecord[] {
  if (Array.isArray(data)) return data.flatMap(nodesOf)
  if (!isRecord(data)) return []
  const graph = data['@graph']
  if (Array.isArray(graph)) return graph.filter(isRecord)
  return schemaTypes(data).length ? [data] : []
}

function requireFields(issues: string[], node: JsonRecord, type: string, fields: string[]) {
  for (const field of fields) {
    const value = node[field]
    if (value === undefined || value === null || value === '') issues.push(`${type} missing ${field}`)
  }
}

/**
 * Structural checks for the JSON-LD this site emits. This is not a substitute
 * for the Schema.org validator; verify-seo also submits the homepage graph there.
 */
export function jsonLdIssues(data: unknown): string[] {
  const issues: string[] = []
  const serialized = JSON.stringify(data)
  if (serialized.includes('TODO')) issues.push('JSON-LD contains a TODO placeholder')
  if (serialized.includes('discovery-driveres')) issues.push('JSON-LD contains the misspelled program slug')
  if (serialized.includes('285270287994540')) issues.push('JSON-LD contains the unconfirmed Facebook URL')
  if (serialized.includes('facebook.com/share/')) issues.push('JSON-LD contains a Facebook share redirect')
  if (!isRecord(data) || data['@context'] !== 'https://schema.org') issues.push('JSON-LD @context must be https://schema.org')

  for (const node of nodesOf(data)) {
    const types = schemaTypes(node)
    if (!types.length) issues.push('JSON-LD node missing @type')
    if (types.includes('EducationalOrganization') || types.includes('Preschool') || types.includes('ChildCare')) {
      requireFields(issues, node, types.join('+'), ['name', 'url', 'telephone', 'address', 'geo', 'openingHoursSpecification', 'foundingDate'])
      if (!types.includes('EducationalOrganization') || !types.includes('Preschool') || !types.includes('ChildCare')) {
        issues.push('School node must include EducationalOrganization, Preschool, and ChildCare')
      }
      const address = isRecord(node.address) ? node.address : undefined
      if (address?.postalCode !== '1105') issues.push('School address missing postalCode 1105')
      const geo = isRecord(node.geo) ? node.geo : undefined
      if (typeof geo?.latitude !== 'number' || typeof geo?.longitude !== 'number') issues.push('School geo must be numeric')
      const hours = isRecord(node.openingHoursSpecification) ? node.openingHoursSpecification : undefined
      const days = Array.isArray(hours?.dayOfWeek) ? hours.dayOfWeek : []
      if (!days.includes('Monday') || !days.includes('Saturday') || days.includes('Sunday')) {
        issues.push('Opening hours must be Monday through Saturday')
      }
      if (hours?.opens !== '08:00' || hours?.closes !== '17:00') issues.push('Opening hours must be 08:00-17:00')
    }
    if (types.includes('FAQPage')) {
      const questions = Array.isArray(node.mainEntity) ? node.mainEntity.filter(isRecord) : []
      if (questions.length < 8 || questions.length > 12) issues.push(`FAQPage has ${questions.length} questions; expected 8-12`)
      for (const question of questions) {
        if (typeof question.name !== 'string' || !question.name.trim()) issues.push('FAQ question missing name')
        const answer = isRecord(question.acceptedAnswer) ? question.acceptedAnswer : undefined
        if (typeof answer?.text !== 'string' || !answer.text.trim()) issues.push('FAQ answer missing text')
      }
    }
    if (types.includes('Course')) {
      requireFields(issues, node, 'Course', ['name', 'description', 'provider'])
    }
    if (types.includes('BreadcrumbList')) {
      const items = Array.isArray(node.itemListElement) ? node.itemListElement.filter(isRecord) : []
      if (items.length < 2) issues.push('BreadcrumbList needs at least two items')
      items.forEach((item, index) => {
        if (item.position !== index + 1) issues.push('BreadcrumbList positions must be sequential')
        if (typeof item.name !== 'string' || typeof item.item !== 'string') issues.push('BreadcrumbList item needs name and item')
      })
    }
    if (types.includes('ItemList')) {
      const items = Array.isArray(node.itemListElement) ? node.itemListElement : []
      if (!items.length) issues.push('ItemList is empty')
    }
    if (types.includes('WebPage')) requireFields(issues, node, 'WebPage', ['name', 'url'])
    if (types.includes('Article')) requireFields(issues, node, 'Article', ['headline', 'url'])
  }
  return issues
}
