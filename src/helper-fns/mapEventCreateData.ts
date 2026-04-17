
import { CompleteEventFormData } from "@/schemas/create-event.schema"
import { ApiCategory } from "@/actions/filters"
import { countries, getStates } from "@/components-data/location"

export function mapEventToFormData(
    event:      EventDetails,
    categories: ApiCategory[],
): Partial<CompleteEventFormData> {

    // Find category id by matching name
    const categoryId = categories.find(c => c.id === event.category)?.id?.toString() ?? ""

    const countryValue = countries.find(v => v.label === event.event_location.country)?.value ?? event.event_location.country
    const stateValue   = getStates(countryValue).find(v => v.label === event.event_location.state)?.value ?? event.event_location.state

    return {
        basicInformation: {
            eventTitle:     event.title,
            eventCategory:  categoryId,
            additionalTags: [], 
            eventType:      event.event_type ?? "single",
            startDateTime:  event.start_datetime,
            endDateTime:    "",
            dates:          [],
            locationType:   event.location_type,
            venueName:      "",
            address:        event.event_location.address,
            country:        countryValue,
            state:          stateValue,
            city:           event.event_location.city,
            postalCode:     event.event_location.postal_code,
            onlineLink:     event.location_type === "online" ? event.event_location.address : ""
        },
        detailsMedia: {
            shortDescription:      "",
            fullDescription:       "",
            featuredImage:         undefined as any,
            additionalImages:      [],
            organizerDisplayName:  "",
            organizerDescription:  "",
            publicEmail:           "",
            phoneNumber:           "",
            countryCode:           "",
            socialMediaLinks:      [],
        },
        ticketsPricing: {
            ticketTypes: [],
            salesPeriod: {
                startDateTime: event.start_datetime ?? "",
                endDateTime:   event.end_datetime ?? "",
            },
            refundPolicy: event.refund_policy ?? "no",
            customRefundPercentage: event.refund_percentage,
        },
        settings: {
            checkInSettings: {
                qrCodeEnabled:  false,
                ageRestriction: false,
                minimumAge:     18,
            },
            emailNotifications: {
                orderConfirmation:    true,
                ticketDelivery:       true,
                reminders:            true,
                postEventEmails:      true,
                customizeSenderName:  false,
                senderName:           "",
            },
            affiliateProgram: {
                enabled:              false,
                percentageCommission: 0,
            },
            permissions: {
                collaborators: [],
            },
        }
    }
}



// Serializer
//
// Maps the multi-step form context onto the EXACT shape the API expects.

export function buildEventPayload(
    data:   Partial<CompleteEventFormData>,
    status: "active" | "draft"
) {
    const info     = data.basicInformation
    const details  = data.detailsMedia
    const tickets  = data.ticketsPricing
    const settings = data.settings

    //  Refund policy
    // API uses: "no", "partial", "full", "custom"
    const refundPolicyMap: Record<string, string> = {
        no: "no",
        partial:   "partial",
        full:      "full",
        custom:    "custom",
    }
    const refundPolicy = refundPolicyMap[tickets?.refundPolicy ?? "no"] ?? "no"

    //  Tickets
    const ticketsPayload = (tickets?.ticketTypes ?? []).map((t) => ({
        ticket_type:   t.ticketType,
        description:   t.description ?? "",
        price:         String(t.price ?? 0),
        currency:      t.currency ?? "NGN",
        quantity:      t.quantity ?? 0,
        per_person_max: t.perPersonMax ?? null,
        sales_start:   tickets?.salesPeriod?.startDateTime ?? null,
        sales_end:     tickets?.salesPeriod?.endDateTime   ?? null,
        promo_codes: t.promoCode?.codeWord
            ? [
                {
                    code:                t.promoCode.codeWord,
                    discount_percentage: t.promoCode.discountAmount ?? 0,
                    maximum_users:       t.promoCode.maximumUsers   ?? null,
                    valid_till:          t.promoCode.validTill       ?? null,
                },
            ]
            : [],
    }))

    //  Social links
    const socialLinks = (details?.socialMediaLinks ?? [])
        .filter((l) => l.url?.trim())
        .map((l) => ({ url: l.url }))

    //  Collaborators (excluded — Coming Soon) 
    const permissions: any[] = []

    //  Media
    // Images/video are uploaded separately via presigned URL or multipart.
    // Include URLs if they've already been resolved; otherwise omit.
    const media: any[] = []

    return {
        event_status: status,

        //  Basic info
        event_name:   info?.eventTitle,
        category:     Number(info?.eventCategory), // backend accepts slug or numeric id — adjust if needed
        tags_input:         info?.additionalTags ?? [],
        event_type:   info?.eventType ?? "single",
        start_datetime: info?.startDateTime ?? null,
        end_datetime:   info?.endDateTime   ?? null,
        // Recurring event dates are included as nested objects
        ...(info?.eventType === "recurring" && info.dates?.length
            ? { recurring_dates: info.dates.map((d) => ({
                start_datetime: d.startDateTime,
                end_datetime:   d.endDateTime,
              })) }
            : {}
        ),

        // Location 
        location_type: info?.locationType ?? "physical",
        ...(info?.locationType === "online"   ? { address: info.address, venue_name: info.venueName } : {}),
        ...(info?.locationType === "physical" ? {
            event_location: {
                venue_name:  info.venueName   ?? "",
                address:     info.address     ?? "",
                country:     countries.find(v => v.value === info.country)?.label ?? info.country,
                state:       info.country ? getStates(info.country).find(v => v.value === info.state)?.label : "",
                city:        info.city        ?? "",
                postal_code: info.postalCode  ?? "",
            },
        } : {}),

        // Description & organizer
        short_description:      details?.shortDescription      ?? "",
        full_description:       details?.fullDescription       ?? "",
        organizer_display_name: details?.organizerDisplayName  ?? "",
        organizer_description:  details?.organizerDescription  ?? "",
        public_email:           details?.publicEmail           ?? "",
        phone_number:           details?.phoneNumber           ?? "",

        // Ticketing 
        tickets:          ticketsPayload,
        refund_policy:    refundPolicy,
        refund_percentage: tickets?.refundPolicy === "custom"
            ? (tickets?.customRefundPercentage ?? 0)
            : 0,

        // Settings 
        qr_enabled:       settings?.checkInSettings?.qrCodeEnabled   ?? false,
        age_restriction:  settings?.checkInSettings?.ageRestriction  ?? false,
        minimum_age:      settings?.checkInSettings?.minimumAge      ?? null,

        order_confirmation:    settings?.emailNotifications?.orderConfirmation   ?? true,
        ticket_delivery:       settings?.emailNotifications?.ticketDelivery      ?? true,
        reminders:             settings?.emailNotifications?.reminders           ?? true,
        post_event_emails:     settings?.emailNotifications?.postEventEmails     ?? true,
        customize_sender_name: settings?.emailNotifications?.customizeSenderName ?? false,

        affiliate_enabled:     settings?.affiliateProgram?.enabled              ?? false,
        commission_percentage: String(settings?.affiliateProgram?.percentageCommission ?? 0),
        affiliate_start:       settings?.affiliateProgram?.startDate            ?? null,
        affiliate_end:         settings?.affiliateProgram?.endDate              ?? null,

        // Misc
        currency:     ticketsPayload[0]?.currency ?? "NGN",
        social_links: socialLinks,
        permissions,
        media,
    }
}