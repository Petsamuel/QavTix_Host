import logoSrc from "@/public-assets/logo/logo-1.png"
type Primitive = string | number | boolean | null | undefined

/**
 * Flattens a nested object into dot-notation keys.
 * Arrays of primitives → joined with ", "
 * Arrays of objects → each item becomes its own row (handled at top level)
 * Nested objects → flattened with "." separator
 * Skips image URLs and base64 strings automatically
 */
function flattenObject(
    obj: Record<string, unknown>,
    prefix = '',
    skipKeys: string[] = []
): Record<string, Primitive> {
    const result: Record<string, Primitive> = {}

    for (const [key, value] of Object.entries(obj)) {
        if (skipKeys.includes(key)) continue

        const flatKey = prefix ? `${prefix}.${key}` : key

        // Skip image URLs
        if (
            typeof value === 'string' &&
            (value.startsWith('http') && (value.match(/\.(jpg|jpeg|png|webp|svg|gif)/i) || value.includes('cloudinary') || value.includes('s3')))
        ) continue

        if (value === null || value === undefined) {
            result[flatKey] = ''
        } else if (typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(result, flattenObject(value as Record<string, unknown>, flatKey, skipKeys))
        } else if (Array.isArray(value)) {
            if (value.length === 0) {
                result[flatKey] = ''
            } else if (typeof value[0] !== 'object') {
                // Primitive array → join
                result[flatKey] = (value as Primitive[]).join(', ')
            }
            // Object arrays are skipped here — handle at row level
        } else {
            result[flatKey] = value as Primitive
        }
    }

    return result
}

/**
 * Converts human-readable column headers.
 * "event_name" → "Event Name", "total_spent" → "Total Spent"
 */
function formatHeader(key: string): string {
    return key
        .replace(/\./g, ' > ')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
}

/**
 * Escapes a CSV cell value
 */
function escapeCSV(value: Primitive): string {
    if (value === null || value === undefined) return ''
    const str = String(value)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
    }
    return str
}

// Format Exporters

function toCSV(rows: Record<string, Primitive>[]): string {
    if (rows.length === 0) return ''
    const headers = Object.keys(rows[0])
    const headerRow = headers.map(formatHeader).map(escapeCSV).join(',')
    const dataRows  = rows.map(row =>
        headers.map(h => escapeCSV(row[h])).join(',')
    )
    return [headerRow, ...dataRows].join('\n')
}

function toJSON(rows: Record<string, Primitive>[]): string {
    // Re-key with formatted headers for readability
    const formatted = rows.map(row =>
        Object.fromEntries(
            Object.entries(row).map(([k, v]) => [formatHeader(k), v ?? ''])
        )
    )
    return JSON.stringify(formatted, null, 2)
}

async function toXLSX(rows: Record<string, Primitive>[], sheetName: string): Promise<Blob> {
    const XLSX = await import('xlsx')
    const headers = Object.keys(rows[0] ?? {}).map(formatHeader)
    const data    = rows.map(row => Object.values(row).map(v => v ?? ''))
    const sheet   = XLSX.utils.aoa_to_sheet([headers, ...data])
    const wb      = XLSX.utils.book_new()

    // Column widths — auto size based on content
    sheet['!cols'] = headers.map((h, i) => ({
        wch: Math.max(
            h.length,
            ...data.map(r => String(r[i] ?? '').length),
            10
        )
    }))

    XLSX.utils.book_append_sheet(wb, sheet, sheetName)
    const buffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}

async function toPDF(
    rows:      Record<string, Primitive>[],
    title:     string,
    sheetName: string
): Promise<Blob> {
    const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable'),
    ])

    const doc     = new jsPDF({ orientation: rows.length > 0 && Object.keys(rows[0]).length > 6 ? 'landscape' : 'portrait' })
    const headers = Object.keys(rows[0] ?? {}).map(formatHeader)
    const data    = rows.map(row => Object.values(row).map(v => String(v ?? '')))

    const pageWidth = doc.internal.pageSize.getWidth()
    
    // Logo
    try {
        doc.addImage(logoSrc.src, 'PNG', pageWidth - 40, 10, 26, 10)
    } catch (e) {
        console.error('[toPDF] Failed to add logo:', e)
    }

    // Title
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(title, 14, 16)

    // Subtitle
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(120)
    doc.text(`Exported: ${new Date().toLocaleString()}  |  ${rows.length} records`, 14, 23)
    doc.setTextColor(0)

    autoTable(doc, {
        head:       [headers],
        body:       data,
        startY:     30,
        styles:     { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [239, 246, 255] },
    })

    return doc.output('blob')
}

// Download trigger

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a   = document.createElement('a')
    a.href     = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

function downloadText(text: string, filename: string, mime: string) {
    downloadBlob(new Blob([text], { type: mime }), filename)
}

// Public API 

export interface ExportConfig {
    /** The array of objects to export */
    data:       Record<string, unknown>[]
    format:     ExportFormat
    /** File name without extension */
    filename:   string
    /** Sheet/document title (used in PDF header and XLSX sheet name) */
    title?:     string
    /** Top-level keys to exclude entirely (e.g. internal IDs, image fields) */
    skipKeys?:  string[]
}

export async function exportData({
    data,
    format,
    filename,
    title     = filename,
    skipKeys  = [],
}: ExportConfig): Promise<void> {
    if (!data || data.length === 0) {
        console.warn('[exportData] No data to export')
        return
    }

    // Always skip images and known useless keys
    const alwaysSkip = ['profile_picture', 'event_image', 'avatar', 'banner', 'thumbnail', ...skipKeys]

    const rows = data.map(item => flattenObject(item as Record<string, unknown>, '', alwaysSkip))

    const timestamp = new Date().toISOString().slice(0, 10)
    const name      = `${filename}_${timestamp}`

    switch (format) {
        case 'csv': {
            downloadText(toCSV(rows), `${name}.csv`, 'text/csv')
            break
        }
        case 'json': {
            downloadText(toJSON(rows), `${name}.json`, 'application/json')
            break
        }
        case 'xlsx': {
            const blob = await toXLSX(rows, title)
            downloadBlob(blob, `${name}.xlsx`)
            break
        }
        case 'pdf': {
            const blob = await toPDF(rows, title, title)
            downloadBlob(blob, `${name}.pdf`)
            break
        }
    }
}




export function exportTransactions(
    items:    Transaction[],
    format:   ExportFormat,
) {
    return exportData({
        data:     items as unknown as Record<string, unknown>[],
        format,
        filename: 'transactions',
        title:    'Transaction History',
        skipKeys: ['profile_picture', 'image'],  // nested keys also caught by flattenObject
    })
}

// ── Multi-sheet XLSX (summary + transactions + geo) ──────────────────────────
// Only makes sense for XLSX — for other formats fall back to transactions only

export async function exportSalesAnalyticsFull(
    cards:        SalesAnalyticsCardsData,
    transactions: Transaction[],
    geo:          GeoBreakdownData,
    breakdown:    SalesBreakdownItem[],
    format:       ExportFormat,
) {
    if (format !== 'xlsx') {
        // Non-XLSX: just export the transactions table
        return exportTransactions(transactions, format)
    }

    const XLSX = await import('xlsx')
    const wb   = XLSX.utils.book_new()

    // ── Sheet 1: KPI Summary ─────────────────────────────────────────────────
    const summaryRows = [
        ['Metric',                 'Value'],
        ['Total Revenue',          cards.total_revenue],
        ['Revenue Change',         `${cards.total_revenue_change}`],
        ['Tickets Sold',           cards.tickets_sold],
        ['Conversion Rate',        `${cards.conversion_rate}%`],
        ['Conversion Change',      `${cards.conversion_change}%`],
        ['Average Order Value',    cards.average_order_value],
        ['AOV Change',             `${cards.aov_change}%`],
        ['Page Views',             cards.page_views],
        ['Refunds',                cards.refunds],
        ['Repeat Buyers',          cards.repeat_buyers],
    ]
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows)
    summarySheet['!cols'] = [{ wch: 26 }, { wch: 18 }]
    styleHeaderRow(summarySheet, summaryRows[0].length)
    XLSX.utils.book_append_sheet(wb, summarySheet, 'KPI Summary')

    // ── Sheet 2: Transactions ────────────────────────────────────────────────
    const txHeaders = [
        'Payment ID', 'Customer Name', 'Customer Email',
        'Event', 'Category', 'Purchase Date',
        'Quantity', 'Amount', 'Status',
    ]
    const txRows = transactions.map(t => [
        t.payment_id,
        t.purchased_by.full_name,
        t.purchased_by.email,
        t.event.name,
        t.event.category,
        t.purchase_date,
        t.quantity,
        t.amount,
        t.status,
    ])
    const txSheet = XLSX.utils.aoa_to_sheet([txHeaders, ...txRows])
    txSheet['!cols'] = autoColWidths([txHeaders, ...txRows])
    styleHeaderRow(txSheet, txHeaders.length)
    XLSX.utils.book_append_sheet(wb, txSheet, 'Transactions')

    // ── Sheet 3: Sales Breakdown (by ticket type) ────────────────────────────
    const bdHeaders = ['Ticket Type', 'Count', 'Percentage']
    const bdRows    = breakdown.map(b => [b.ticket_type, b.count, `${b.percentage}%`])
    const bdSheet   = XLSX.utils.aoa_to_sheet([bdHeaders, ...bdRows])
    bdSheet['!cols'] = autoColWidths([bdHeaders, ...bdRows])
    styleHeaderRow(bdSheet, bdHeaders.length)
    XLSX.utils.book_append_sheet(wb, bdSheet, 'Sales Breakdown')

    // ── Sheet 4: Geographic Breakdown ────────────────────────────────────────
    const geoHeaders = ['City', 'State', 'Tickets', 'Revenue', 'Clicks']
    const geoRows    = geo.locations.map(g => [g.city, g.state, g.tickets, g.revenue, g.clicks])
    const geoSheet   = XLSX.utils.aoa_to_sheet([geoHeaders, ...geoRows])
    geoSheet['!cols'] = autoColWidths([geoHeaders, ...geoRows])
    styleHeaderRow(geoSheet, geoHeaders.length)
    XLSX.utils.book_append_sheet(wb, geoSheet, 'Geographic Breakdown')

    // ── Write & download ─────────────────────────────────────────────────────
    const buffer  = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
    const blob    = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const timestamp = new Date().toISOString().slice(0, 10)
    const url       = URL.createObjectURL(blob)
    const a         = document.createElement('a')
    a.href          = url
    a.download      = `sales_analytics_${timestamp}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
}


function autoColWidths(rows: (string | number)[][]): { wch: number }[] {
    if (!rows.length) return []
    return rows[0].map((_, colIdx) =>
        ({ wch: Math.max(10, ...rows.map(r => String(r[colIdx] ?? '').length)) })
    )
}

/** Bold + blue background on row 1 using XLSX cell styles (xlsx-js-style compatible) */
function styleHeaderRow(sheet: import('xlsx').WorkSheet, colCount: number) {
    for (let c = 0; c < colCount; c++) {
        const addr = encodeCellAddress(0, c)
        if (!sheet[addr]) continue
        sheet[addr].s = {
            font:      { bold: true, color: { rgb: 'FFFFFF' } },
            fill:      { fgColor: { rgb: '2563EB' } },
            alignment: { horizontal: 'center' },
        }
    }
}

function encodeCellAddress(row: number, col: number): string {
    // Convert col index to letter(s): 0→A, 1→B, 25→Z, 26→AA …
    let letter = ''
    let c = col
    do {
        letter = String.fromCharCode(65 + (c % 26)) + letter
        c      = Math.floor(c / 26) - 1
    } while (c >= 0)
    return `${letter}${row + 1}`
}