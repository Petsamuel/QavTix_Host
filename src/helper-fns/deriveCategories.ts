// Takes the API category list and the current items.
// Returns Category[] where:
//   - value = category id as string  (sent to the API filter param)
//   - label = category name          (shown in the UI)
//   - count = how many items in this tab have this category
//   - items with no matching category are ignored in the count

import { ApiCategory } from "@/actions/filters/index"

export function deriveCategories(
    apiCategories: ApiCategory[],
    items: { category?: string | null }[] = [],
): Category[] {
    // Build a count map keyed by lowercase category name
    const countMap = new Map<string, number>()
    for (const item of items) {
        if (!item.category) continue
        const key = item.category.toLowerCase()
        countMap.set(key, (countMap.get(key) ?? 0) + 1)
    }

    return apiCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        value: String(cat.id),
        label: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
        count: countMap.get(cat.name.toLowerCase()) ?? 0,   // 0 if no items match
    }))
}