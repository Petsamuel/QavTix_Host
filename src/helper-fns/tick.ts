export function tick(ms = 500) {
    return new Promise(res => setTimeout(res, ms))
}