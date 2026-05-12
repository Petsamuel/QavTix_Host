export function formatLocation(location: string | null | undefined): string {
    if (!location) return "TBA"

    // If the string contains a URL-like structure (e.g. "https:google.meet.com" or "https://"), 
    // or if it has commas from joining empty fields (", , ,")
    
    // Split by comma, trim whitespace, and filter out empty strings or just commas
    const parts = location.split(",").map(s => s.trim()).filter(Boolean)
    
    if (parts.length === 0) return "TBA"
    
    // Check if the first part is a URL. If it's a URL, we might just want to show "Virtual Event"
    // or the URL itself if it's not too long.
    const firstPart = parts[0]
    if (firstPart.startsWith("http:") || firstPart.startsWith("https:")) {
        return "Virtual Event"
    }

    return parts.join(", ")
}
