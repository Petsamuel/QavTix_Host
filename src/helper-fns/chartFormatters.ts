// ── Nice ticks algorithm ──────────────────────────────────────────────────────
// Given a max data value, returns evenly spaced, human-readable Y-axis ticks.
// e.g. maxValue=3400 → [0, 1000, 2000, 3000, 4000]
//      maxValue=250  → [0, 50, 100, 150, 200, 250]
//      maxValue=8500 → [0, 2000, 4000, 6000, 8000, 10000]

export function getNiceTicks(maxValue: number, targetSteps = 5): { ticks: number[]; yMax: number } {
    if (maxValue <= 0) {
        // No data — show a minimal scale so the chart still renders
        return { ticks: [0, 200, 400, 600, 800, 1000], yMax: 1000 }
    }

    // Find the magnitude of the range
    const roughStep  = maxValue / targetSteps
    const magnitude  = Math.pow(10, Math.floor(Math.log10(roughStep)))

    // Pick the nearest "nice" multiplier: 1, 2, 5 are the universal clean steps
    const niceMultipliers = [1, 2, 5, 10]
    const niceStep = niceMultipliers
        .map(m => m * magnitude)
        .find(step => step >= roughStep) ?? magnitude * 10

    // Round the max up to the next clean step boundary
    const niceMax = Math.ceil(maxValue / niceStep) * niceStep

    const ticks: number[] = []
    for (let v = 0; v <= niceMax; v += niceStep) {
        ticks.push(v)
    }

    return { ticks, yMax: niceMax }
}



// Tick formatter

export function formatYTick(value: number): string {
    if (value === 0) return "0"
    if (value >= 1_000_000) return `${value / 1_000_000}M`
    if (value >= 1_000)     return `${value / 1_000}k`
    return String(value)
}