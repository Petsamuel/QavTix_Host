import { CHARACTER_LIMITS, ROLE_IDS, VALIDATION_MESSAGES } from '@/lib/features/create-event/resources/constants';
import { z } from 'zod';


// [Basic Information Schema]


const eventDateSchema = z.object({
    startDateTime: z.string().min(1, "Start date is required"),
    endDateTime: z.string().min(1, "End date is required"),
})
.refine((data) => {
    const start = new Date(data.startDateTime);
    return start > new Date();
}, {
    message: "Start time must be in the future",
    path: ["startDateTime"],
})
.refine((data) => {
    const start = new Date(data.startDateTime);
    const end = new Date(data.endDateTime);
    return end > start;
}, {
    message: "End time must be after start time",
    path: ["endDateTime"],
})

export const step1Schema = z.object({
    eventTitle: z.string().min(1, "Event title is required").max(100),
    eventCategory: z.string().min(1, "Category is required"),
    additionalTags: z.array(z.string()).max(5, "Maximum 5 tags allowed"),
    eventType: z.enum(['single', 'recurring']),
    
    // Date Fields - Make them nullable instead of optional
    startDateTime: z.string(),
    endDateTime: z.string(),
    dates: z.array(eventDateSchema),

    // Location Fields
    locationType: z.enum(['physical', 'online', 'tba']),
    venueName: z.string().optional(),
    address: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    onlineLink: z.url("Please enter a valid URL").optional().or(z.literal("")),
})
.refine((data) => {
    // Only validate if single event type
    if (data.eventType !== 'single') return true;
    
    return !!data.startDateTime && !!data.endDateTime;
}, {
    message: "Start date and time is required for single events",
    path: ["startDateTime"]
})
.refine((data) => {
    // Only validate if single event type and dates exist
    if (data.eventType !== 'single' || !data.startDateTime) return true;
    
    const start = new Date(data.startDateTime);
    return start > new Date();
}, {
    message: "Start date and time must be in the future",
    path: ["startDateTime"]
})
.refine((data) => {
    // Only validate if single event type and both dates exist
    if (data.eventType !== 'single' || !data.startDateTime || !data.endDateTime) return true;
    
    const start = new Date(data.startDateTime);
    const end = new Date(data.endDateTime);
    return end > start;
}, {
    message: "End date and time must be after start time",
    path: ["endDateTime"]
})
.refine((data) => {
    // Validate recurring events have dates
    if (data.eventType !== 'recurring') return true;
    
    return !!data.dates && data.dates.length > 0;
}, {
    message: "Please add at least one date for recurring events",
    path: ["dates"]
})
.refine((data) => {
    // Validate physical location
    if (data.locationType !== 'physical') return true;
    
    return !!data.venueName && !!data.address && !!data.city && !!data.country;
}, {
    message: "Venue name is required",
    path: ["venueName"]
})
.refine((data) => {
    if (data.locationType !== 'physical') return true;
    return !!data.address;
}, {
    message: "Address is required",
    path: ["address"]
})
.refine((data) => {
    if (data.locationType !== 'physical') return true;
    return !!data.city;
}, {
    message: "City is required",
    path: ["city"]
})
.refine((data) => {
    if (data.locationType !== 'physical') return true;
    return !!data.country;
}, {
    message: "Country is required",
    path: ["country"]
})
.refine((data) => {
    // Validate online location
    if (data.locationType !== 'online') return true;
    
    return !!data.onlineLink;
}, {
    message: "Online event link is required",
    path: ["onlineLink"]
})





// [Details & Media Schema]

const socialMediaLinkSchema = z.object({
    id: z.string(),
    platform: z.string(),
    url: z.url(VALIDATION_MESSAGES.invalidUrl),
})

export const step2Schema = z.object({
    shortDescription: z.string()
        .min(1, "Required")
        .max(160, "Max 160 characters"),
    fullDescription: z.string()
        .min(1, "Required")
        .max(5000, "Max 5000 characters"),
    
    // File Validation using instanceof
    featuredImage: z.instanceof(File, { message: "Featured image is required" })
        .refine((file) => file.size <= 10 * 1024 * 1024, "Max size is 10MB"),
    
    additionalImages: z.array(z.instanceof(File))
        .max(10, "Maximum 10 images allowed"),
    
    eventVideo: z.instanceof(File).optional(),

    organizerDisplayName: z.string().min(1, "Required"),
    organizerDescription: z.string().max(500).optional(),
    publicEmail: z.email("Invalid email"),
    phoneNumber: z.string().optional(),
    countryCode: z.string().optional(),
    
    socialMediaLinks: z.array(socialMediaLinkSchema), 
})





// [Tickets & Pricing Schema]
const promoCodeSchema = z.object({
    codeWord:       z.string().min(1, "Code is required"),
    discountAmount: z.coerce.number("Invalid discount amount").min(0, "Discount must be 0 or greater"),
    maximumUsers:   z.coerce.number("Invalid user count").min(1, "At least 1 user allowed"),
    validTill:      z.string().min(1, "Valid until date is required"),
})

const ticketTypeSchema = z.object({
    id:           z.string(),
    ticketType:   z.string().min(1, "Ticket type is required"),
    description:  z.string().optional(),
    price:        z.coerce.number("Invalid price").min(0, "Price must be 0 or greater"),
    currency:     z.string().min(1, "Currency is required"),
    quantity:     z.coerce.number("Invalid quantity").min(1, "Quantity must be at least 1"),
    perPersonMax: z.coerce.number("Invalid max per person").min(1).optional(),
    promoCode:    promoCodeSchema.optional(),
})

export type TicketType = z.infer<typeof ticketTypeSchema>;

export const step3Schema = z.object({
    ticketTypes:            z.array(ticketTypeSchema).min(1, "At least one ticket type is required"),
    salesPeriod: z.object({
        startDateTime: z.string().min(1, "Start date is required"),
        endDateTime:   z.string().min(1, "End date is required"),
    }),
    refundPolicy:           z.enum(['no', 'partial', 'full', 'custom']),
    customRefundPercentage: z.coerce.number("Invalid input").min(1).max(100).default(0).optional(),
})

// [Settings Schema]

const collaboratorSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
    avatar: z.string().optional(),
    role: z.enum([...ROLE_IDS, "host"]),
    permissions: z.array(z.string()),
    status: z.enum(['active', 'disabled', 'pending']),
})

export const step4Schema = z.object({
    checkInSettings: z.object({
        qrCodeEnabled: z.boolean(),
        ageRestriction: z.boolean(),
        minimumAge: z.coerce.number("Invalid input").min(18, "Minimum age must be at least 18").default(18).optional(),
    }),
    
    emailNotifications: z.object({
        orderConfirmation: z.boolean(),
        ticketDelivery: z.boolean(),
        reminders: z.boolean(),
        postEventEmails: z.boolean(),
        customizeSenderName: z.boolean(),
        senderName: z.string().optional(),
    }),
    
    affiliateProgram: z.object({
        enabled: z.boolean(),
        percentageCommission: z.coerce.number("Invalid input")
            .min(1)
            .max(50)
            .optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
    }),
    
    permissions: z.object({
        collaborators: z.array(collaboratorSchema),
    }),
}).refine((data) => {
    // Age restriction requires minimum age
    if (data.checkInSettings.ageRestriction) {
        return !!data.checkInSettings.minimumAge;
    }
    return true;
}, {
    message: 'Please specify minimum age',
    path: ['checkInSettings', 'minimumAge'],
}).refine((data) => {
    // Custom sender name requires name
    if (data.emailNotifications.customizeSenderName) {
        return !!data.emailNotifications.senderName;
    }
    return true;
}, {
    message: 'Please enter sender name',
    path: ['emailNotifications', 'senderName'],
}).refine((data) => {
    // Affiliate program requires commission
    if (data.affiliateProgram.enabled) {
        return !!data.affiliateProgram.percentageCommission;
    }
    return true;
}, {
    message: 'Please enter commission percentage',
    path: ['affiliateProgram', 'percentageCommission'],
})



export const completeEventSchema = z.object({
    basicInformation: step1Schema,
    detailsMedia: step2Schema,
    ticketsPricing: step3Schema,
    settings: step4Schema,
    reviewPublish: z.object({
        status: z.enum(['draft', 'published']),
        publishedAt: z.date().optional(),
    }),
})




// Type exports
export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.output<typeof step3Schema>;
export type Step4FormData = z.infer<typeof step4Schema>;
export type CompleteEventFormData = z.infer<typeof completeEventSchema>;