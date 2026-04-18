interface SendCampaignPayload {
    event_id:      string
    campaign_name: string
    subject:       string
    html_content:  string
    sender_name:   string
    sender_email:  string
}

interface SendSingleEmailPayload {
    recipient_email: string
    subject:         string
    html_content:    string
    sender_name:     string
    sender_email:    string
}

interface SendSingleSmsPayload {
    recipient_phone: string
    message:         string
    sender_name:     string
}

interface CampaignResult {
    success:  boolean
    message?: string
}