interface CheckInCards {
    total_tickets:  number
    total_checkins: number
    total_not_checked_in:    number
    issues:         number
}

interface CheckInAttendee {
    full_name:        string
    email:            string
    issued_ticket_id: string
    ticket_type:      string
    qr_token:         string
    event_name:       string
    event_category:   string
    event_image:      string
    checkin_status:   string
    checked_in_at:    string | null
}

interface ScanResult {
    status:           "checked_in" | "duplicate" | "invalid"
    message:          string
    issued_ticket_id: string
    full_name:        string
    ticket_type:      string
    event_name:       string
    checked_in_at:    string
}

interface GetCheckInResult {
    success:  boolean
    data?:    CheckInCards
    message?: string
}

interface GetAttendeesResult {
    success:  boolean
    data?:    TabSlice<CheckInAttendee>
    message?: string
}

interface ScanCheckInResult {
    success:  boolean
    data?:    ScanResult
    message?: string
}

interface CheckInParams {
    event?:  string
    page?:   number
    search?: string
    status?: string
    ticket_type?: number
}