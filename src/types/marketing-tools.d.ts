interface PromoCode {
    id:                  number
    code:                string
    status:              string
    discount_percentage: number
    usage_limit:         number
    usage_count:         number
    revenue_impact:      string
    expiry_date:         string
    event_name:          string
    event_category:      string
    event_image:         string
}

interface AffiliateLink {
    id:               number
    affiliate_url:    string
    affiliate_name:   string
    affiliate_email:  string
    event_name:       string
    category:         string
    event_image:      string
    clicks:           number
    sales:            number
    conversion_rate:  number
    rank:             number
    total_earnings:   string
    created_at:       string
}

interface AffiliateCards {
    total_affiliates:      number
    new_this_month:        number
    total_tickets_sold:    number
    total_commission_paid: string
}

interface EmailCampaign {
    id:             string
    campaign_name:  string
    subject:        string
    sender_name:    string
    sender_email:   string
    recipients:     number
    sent_at:        string
    open_rate:      number | null
    click_rate:     number | null
    status:         string
    event_id:       string
    event_name:     string
    event_category: string
    event_image:    string
}

interface MarketingData {
    promoCodes:     TabSlice<PromoCode>
    affiliateLinks: TabSlice<AffiliateLink> & { cards: AffiliateCards }
    campaigns:      TabSlice<EmailCampaign>
}


type CreatePromoCodePayload = {
	event_id: string,
	code: string,
	discount_percentage: string
	usage_limit: number,
	valid_until: string // e.g 2026-04-13
} 