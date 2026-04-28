
import { CompleteEventFormData } from "@/schemas/create-event.schema"
import { ApiCategory } from "@/actions/filters"
import { countries, getStates } from "@/components-data/location"
import { UploadedMediaItem } from "./uploadEventMedia"


export function mapEventToFormData(
    event: EditEventDetails,
    categories: ApiCategory[],
): Partial<CompleteEventFormData> {

    const categoryId = categories.find(c => c.id === event.category)?.id?.toString() ?? ""

    const countryValue = countries.find(v => v.label === event.event_location?.country)?.value ?? event.event_location?.country ?? ""
    const stateValue = getStates(countryValue).find(v => v.label === event.event_location?.state)?.value ?? event.event_location?.state ?? ""

    // Featured image — use the media url marked as featured (or first image)
    const featuredMedia = event.media?.find(m => m.is_featured) ?? event.media?.[0]
    const featuredImageUrl: string | undefined = featuredMedia?.image_url ?? undefined

    // Additional images — all non-featured images
    const additionalImageUrls: string[] = event.media
        ?.filter(m => !m.is_featured && m.image_url)
        ?.map(m => m.image_url) ?? []

    // Video
    const videoUrl: string | undefined = featuredMedia?.video_url ?? undefined

    // Social links
    const socialMediaLinks = (event.social_links ?? []).map((l, i) => ({
        id: String(i),
        platform: "custom",
        url: l.url,
    }))

    // Tickets — map all fields including promo codes
    const ticketTypes = (event.tickets ?? []).map(t => ({
        id: String(t.id),
        ticketType: t.ticket_type,
        description: t.description ?? "",
        price: parseFloat(t.price ?? "0"),
        currency: event.currency ?? "NGN",
        quantity: t.quantity ?? 1,
        perPersonMax: t.per_person_max ?? undefined,
        promoCode: t.promo_codes?.length > 0
            ? {
                codeWord: t.promo_codes[0].code,
                discountAmount: t.promo_codes[0].discount_percentage ?? 0,
                maximumUsers: t.promo_codes[0].maximum_users ?? 1,
                validTill: t.promo_codes[0].valid_till ?? "",
            }
            : undefined,
    }))

    // Sales period — pulled from first ticket (all tickets share same period)
    const firstTicket = event.tickets?.[0]
    const salesPeriod = {
        startDateTime: firstTicket?.sales_start ? firstTicket.sales_start.slice(0, 16) : "",
        endDateTime: firstTicket?.sales_end ? firstTicket.sales_end.slice(0, 16) : "",
    }

    return {
        basicInformation: {
            eventTitle: event.event_name,
            eventCategory: categoryId,
            additionalTags: event.tags ?? [],
            eventType: event.event_type ?? "single",
            startDateTime: event.start_datetime ? event.start_datetime.slice(0, 16) : "",
            endDateTime: event.end_datetime ? event.end_datetime.slice(0, 16) : "",
            dates: [],

            locationType: event.location_type,
            venueName: event.event_location?.venue_name ?? "",
            address: event.event_location?.address ?? "",
            country: countryValue,
            state: stateValue,
            city: event.event_location?.city ?? "",
            postalCode: event.event_location?.postal_code ?? "",
            onlineLink: event.location_type === "online"
                ? (event.event_location?.address ?? "")
                : "",
        },

        detailsMedia: {
            shortDescription: event.short_description ?? "",
            fullDescription: event.full_description ?? "",
            featuredImage: featuredImageUrl as any,
            additionalImages: additionalImageUrls as any,
            eventVideo: videoUrl as any,
            organizerDisplayName: event.organizer_display_name ?? "",
            organizerDescription: event.organizer_description ?? "",
            publicEmail: event.public_email ?? "",
            phoneNumber: event.phone_number ?? "",
            countryCode: "",
            socialMediaLinks,
        },

        ticketsPricing: {
            ticketTypes,
            salesPeriod,
            refundPolicy: event.refund_policy ?? "no",
            customRefundPercentage: event.refund_policy === 'custom'
                ? (event.refund_percentage ?? 1)
                : undefined,
        },

        settings: {
            checkInSettings: {
                qrCodeEnabled: event.qr_enabled ?? false,
                ageRestriction: event.age_restriction ?? false,
                minimumAge: event.minimum_age ?? undefined,
            },
            emailNotifications: {
                orderConfirmation: event.order_confirmation ?? true,
                ticketDelivery: event.ticket_delivery ?? true,
                reminders: event.reminders ?? true,
                postEventEmails: event.post_event_emails ?? true,
                customizeSenderName: event.customize_sender_name ?? false,
            },
            affiliateProgram: {
                enabled: event.affiliate_enabled ?? false,
                percentageCommission: event.commission_percentage
                    ? parseFloat(event.commission_percentage)
                    : undefined,
                startDate: event.affiliate_start
                    ? new Date(event.affiliate_start)
                    : undefined,
                endDate: event.affiliate_end
                    ? new Date(event.affiliate_end)
                    : undefined,
            },
            permissions: {
                collaborators: (event.permissions ?? []).map(p => ({
                    id: String(p.id),
                    name: p.email?.split("@")[0] ?? "",
                    email: p.email,
                    role: p.role,
                    status: p.status,
                    permissions: [p.role],
                })),
            },
        },
    }
}


// Serializer
//
// Maps the multi-step form context onto the EXACT shape the API expects.

export function buildEventPayload(
    data: Partial<CompleteEventFormData>,
    status: "active" | "draft",
    media: any[] = []
) {
    const info = data.basicInformation
    const details = data.detailsMedia
    const tickets = data.ticketsPricing
    const settings = data.settings

    //  Refund policy
    // API uses: "no", "partial", "full", "custom"
    const refundPolicyMap: Record<string, string> = {
        no: "no",
        partial: "partial",
        full: "full",
        custom: "custom",
    }
    const refundPolicy = refundPolicyMap[tickets?.refundPolicy ?? "no"] ?? "no"

    //  Tickets
    const ticketsPayload = (tickets?.ticketTypes ?? []).map((t) => ({
        ticket_type: t.ticketType,
        description: t.description ?? "",
        price: String(t.price ?? 0),
        currency: t.currency ?? "NGN",
        quantity: t.quantity ?? 0,
        per_person_max: t.perPersonMax ?? null,
        sales_start: tickets?.salesPeriod?.startDateTime ?? null,
        sales_end: tickets?.salesPeriod?.endDateTime ?? null,
        promo_codes: t.promoCode?.codeWord
            ? [
                {
                    code: t.promoCode.codeWord,
                    discount_percentage: t.promoCode.discountAmount ?? 0,
                    maximum_users: t.promoCode.maximumUsers ?? null,
                    valid_till: t.promoCode.validTill ?? null,
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

    return {
        event_status: status,

        //  Basic info
        event_name: info?.eventTitle,
        category: Number(info?.eventCategory), // backend accepts slug or numeric id — adjust if needed
        tags_input: info?.additionalTags ?? [],
        event_type: info?.eventType ?? "single",
        start_datetime: info?.eventType === "recurring" && info?.dates?.length ? info.dates[0].startDateTime : (info?.startDateTime ?? null),
        end_datetime: info?.eventType === "recurring" && info?.dates?.length ? info.dates[info.dates.length - 1].endDateTime : (info?.endDateTime ?? null),
        // Recurring event dates are included as nested objects
        ...(info?.eventType === "recurring" && info.dates?.length
            ? {
                recurring_dates: info.dates.map((d) => ({
                    start_datetime: d.startDateTime,
                    end_datetime: d.endDateTime,
                }))
            }
            : {}
        ),

        // Location 
        location_type: info?.locationType ?? "physical",
        ...(info?.locationType === "online" ? { event_location: { address: info.onlineLink, venue_name: info.venueName, country: "", state: "", city: "" } } : {}),
        ...(info?.locationType === "physical" ? {
            event_location: {
                venue_name: info.venueName ?? "",
                address: info.address ?? "",
                country: countries.find(v => v.value === info.country)?.label ?? info.country,
                state: info.country ? getStates(info.country).find(v => v.value === info.state)?.label : "",
                city: info.city ?? "",
                postal_code: info.postalCode ?? "",
            },
        } : {}),

        // Description & organizer
        short_description: details?.shortDescription ?? "",
        full_description: details?.fullDescription ?? "",
        organizer_display_name: details?.organizerDisplayName ?? "",
        organizer_description: details?.organizerDescription ?? "",
        public_email: details?.publicEmail ?? "",
        phone_number: details?.phoneNumber ?? "",

        // Ticketing 
        tickets: ticketsPayload,
        refund_policy: refundPolicy,
        refund_percentage: tickets?.refundPolicy === "custom"
            ? (tickets?.customRefundPercentage ?? 0)
            : 0,

        // Settings 
        qr_enabled: settings?.checkInSettings?.qrCodeEnabled ?? false,
        age_restriction: settings?.checkInSettings?.ageRestriction ?? false,
        minimum_age: settings?.checkInSettings?.minimumAge ?? null,

        order_confirmation: settings?.emailNotifications?.orderConfirmation ?? true,
        ticket_delivery: settings?.emailNotifications?.ticketDelivery ?? true,
        reminders: settings?.emailNotifications?.reminders ?? true,
        post_event_emails: settings?.emailNotifications?.postEventEmails ?? true,
        customize_sender_name: settings?.emailNotifications?.customizeSenderName ?? false,

        affiliate_enabled: settings?.affiliateProgram?.enabled ?? false,
        commission_percentage: String(settings?.affiliateProgram?.percentageCommission ?? 0),
        affiliate_start: settings?.affiliateProgram?.startDate ?? null,
        affiliate_end: settings?.affiliateProgram?.endDate ?? null,

        // Misc
        currency: ticketsPayload[0]?.currency ?? "NGN",
        social_links: socialLinks,
        permissions,
        media: (media as UploadedMediaItem[]).map(m => ({
            image_url: m.resource_type === 'image' ? m.secure_url : "",
            video_url: m.resource_type === 'video' ? m.secure_url : "",
            is_featured: m.is_featured,
        })),
    }
}