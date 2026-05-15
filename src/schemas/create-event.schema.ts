import * as yup from 'yup';
import { ROLE_IDS, VALIDATION_MESSAGES } from '@/lib/features/create-event/resources/constants';


// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Validates a value that is either a File object or a URL string.
 * Works for featured images, additional images, and videos.
 */
const fileOrUrlSchema = yup.mixed<File | string>().test(
    'file-or-url',
    'Please provide a valid file or image URL',
    (value) => {
        if (!value) return false;
        if (value instanceof File) return true;
        if (typeof value === 'string') {
            try { new URL(value); return true; } catch { return false; }
        }
        return false;
    }
);

const optionalFileOrUrl = yup.mixed<File | string>().nullable().optional().test(
    'optional-file-or-url',
    'Please provide a valid file or URL',
    (value) => {
        if (!value) return true; // optional
        if (value instanceof File) return true;
        if (typeof value === 'string') {
            try { new URL(value); return true; } catch { return false; }
        }
        return false;
    }
);

/** Coerces empty strings / null / undefined to undefined, otherwise parses as number. */
function toOptionalNumber(value: unknown) {
    if (value === '' || value === null || value === undefined) return undefined;
    return Number(value);
}


// ─── Step 1: Basic Information ────────────────────────────────────────────────

const eventDateSchema = yup.object({
    startDateTime: yup.string().required('Start date & time is required'),
    endDateTime: yup.string().required('End date & time is required'),
}).test('start-in-future', 'Start date must be in the future', function (value) {
    if (!value?.startDateTime) return true;
    return new Date(value.startDateTime) > new Date();
}).test('end-after-start', 'End date must be after the start date', function (value) {
    if (!value?.startDateTime || !value?.endDateTime) return true;
    return new Date(value.endDateTime) > new Date(value.startDateTime);
});

export const step1Schema = yup.object({
    eventTitle: yup.string().required('Event title is required').max(100, 'Title cannot exceed 100 characters'),
    eventCategory: yup.string().required('Please select an event category'),
    additionalTags: yup.array(yup.string().defined()).max(5, 'You can add a maximum of 5 tags').default([]),
    eventType: yup.string().oneOf(['single', 'recurring'] as const).required(),

    // Date fields — conditionally validated below
    startDateTime: yup.string().default(''),
    endDateTime: yup.string().default(''),
    dates: yup.array(eventDateSchema).default([]),

    // Location
    locationType: yup.string().oneOf(['physical', 'online', 'tba'] as const).required(),
    venueName: yup.string().optional()
        .max(100, 'Venue name must not exceed 100 characters'),
    address: yup.string().optional()
        .max(200, 'Street address must not exceed 200 characters'),
    country: yup.string().optional(),
    state: yup.string().optional(),
    city: yup.string().optional()
        .max(60, 'City name must not exceed 60 characters'),
    postalCode: yup.string().optional(),
    onlineLink: yup.string().optional(),
})
    // ── Single: start date required ──
    .test('single-start-required', 'Please select a start date & time', function (values) {
        if (values.eventType !== 'single') return true;
        if (!values.startDateTime) return this.createError({ path: 'startDateTime', message: 'Please select a start date & time' });
        return true;
    })
    // ── Single: start must be future ──
    .test('single-start-future', 'Start date & time must be in the future', function (values) {
        if (values.eventType !== 'single' || !values.startDateTime) return true;
        if (new Date(values.startDateTime) <= new Date())
            return this.createError({ path: 'startDateTime', message: 'Start date & time must be in the future' });
        return true;
    })
    // ── Single: end required ──
    .test('single-end-required', 'Please select an end date & time', function (values) {
        if (values.eventType !== 'single') return true;
        if (!values.endDateTime) return this.createError({ path: 'endDateTime', message: 'Please select an end date & time' });
        return true;
    })
    // ── Single: end after start ──
    .test('single-end-after-start', 'End date & time must be after the start date', function (values) {
        if (values.eventType !== 'single' || !values.startDateTime || !values.endDateTime) return true;
        if (new Date(values.endDateTime) <= new Date(values.startDateTime))
            return this.createError({ path: 'endDateTime', message: 'End date & time must be after the start date' });
        return true;
    })
    // ── Recurring: at least one date ──
    .test('recurring-has-dates', 'Please add at least one date for this recurring event', function (values) {
        if (values.eventType !== 'recurring') return true;
        if (!values.dates || values.dates.length === 0)
            return this.createError({ path: 'dates', message: 'Please add at least one date for this recurring event' });
        return true;
    })
    // ── Physical: venue required ──
    .test('physical-venue', 'Venue details are required', function (values) {
        if (values.locationType !== 'physical') return true;
        if (!values.venueName) return this.createError({ path: 'venueName', message: 'Venue name is required' });
        return true;
    })
    .test('physical-address', 'Address is required', function (values) {
        if (values.locationType !== 'physical') return true;
        if (!values.address) return this.createError({ path: 'address', message: 'Street address is required' });
        return true;
    })
    .test('physical-city', 'City is required', function (values) {
        if (values.locationType !== 'physical') return true;
        if (!values.city) return this.createError({ path: 'city', message: 'City is required' });
        return true;
    })
    .test('physical-country', 'Country is required', function (values) {
        if (values.locationType !== 'physical') return true;
        if (!values.country) return this.createError({ path: 'country', message: 'Country is required' });
        return true;
    })
    // ── Online: link required & valid ──
    .test('online-link-required', 'Event link is required', function (values) {
        if (values.locationType !== 'online') return true;
        if (!values.onlineLink) return this.createError({ path: 'onlineLink', message: 'Please provide the online event link (e.g. Zoom, Google Meet)' });
        return true;
    })
    .test('online-link-url', 'Event link must be a valid URL', function (values) {
        if (values.locationType !== 'online' || !values.onlineLink) return true;
        try { new URL(values.onlineLink); return true; }
        catch { return this.createError({ path: 'onlineLink', message: 'Please enter a valid URL (e.g. https://zoom.us/j/...)' }); }
    });


// ─── Step 2: Details & Media ──────────────────────────────────────────────────

const socialMediaLinkSchema = yup.object({
    id: yup.string().required(),
    platform: yup.string().required(),
    url: yup.string().url(VALIDATION_MESSAGES.invalidUrl).required(),
});

export const step2Schema = yup.object({
    shortDescription: yup.string()
        .required('Short description is required')
        .max(160, 'Short description cannot exceed 160 characters'),
    fullDescription: yup.string()
        .required('Full description is required')
        .max(5000, 'Full description cannot exceed 5,000 characters'),

    // Accepts a File upload OR an existing image URL (e.g. when editing an event)
    featuredImage: fileOrUrlSchema
        .required('Please upload a featured image for your event')
        .test('max-size', 'Featured image must be smaller than 10 MB', (value) => {
            if (!(value instanceof File)) return true;
            return value.size <= 10 * 1024 * 1024;
        }),

    additionalImages: yup.array(optionalFileOrUrl)
        .max(10, 'You can add a maximum of 10 additional images')
        .default([]),

    eventVideo: optionalFileOrUrl,

    organizerDisplayName: yup.string().required('Organiser display name is required'),
    organizerDescription: yup.string().max(500, 'Organiser description cannot exceed 500 characters').optional(),
    publicEmail: yup.string().email('Please enter a valid email address').required('Public email is required'),
    phoneNumber: yup.string().optional(),
    countryCode: yup.string().optional(),

    socialMediaLinks: yup.array(socialMediaLinkSchema).default([]),
});


// ─── Step 3: Tickets & Pricing ────────────────────────────────────────────────

const promoCodeSchema = yup.object({
    codeWord: yup.string().optional(),
    discountAmount: yup.number()
        .transform((val) => (isNaN(val) ? undefined : val))
        .min(0, 'Discount cannot be negative')
        .optional(),
    maximumUsers: yup.number()
        .transform((val) => (isNaN(val) ? undefined : val))
        .optional(),
    validTill: yup.string().optional(),
}).test('promo-complete', 'Please fill in all promo code fields', function (value) {
    const hasPromoCode = !!value?.codeWord?.trim()
    if (!hasPromoCode) return true

    const errors: yup.ValidationError[] = []
    const base = this.path ? `${this.path}.` : ''   // ← add this

    if (value?.discountAmount === undefined || value?.discountAmount === null)
        errors.push(this.createError({ path: `${base}discountAmount`, message: 'Discount amount is required' }))

    if (!value?.maximumUsers || value.maximumUsers < 1)
        errors.push(this.createError({ path: `${base}maximumUsers`, message: 'Maximum number of users is required' }))

    if (!value?.validTill?.trim())
        errors.push(this.createError({ path: `${base}validTill`, message: 'Expiry date is required' }))

    if (errors.length > 0) throw new yup.ValidationError(errors)

    return true
}).optional()




const ticketTypeSchema = yup.object({
    id: yup.string().required(),
    ticketType: yup.string().required('Ticket type is required'),
    description: yup.string().optional(),
    price: yup.number().typeError('Please enter a valid price').min(0, 'Price cannot be negative').required('Price is required'),
    currency: yup.string().required('Please select a currency'),
    quantity: yup.number()
        .typeError('Please enter a quantity')
        .min(1, 'Quantity must be at least 1')
        .test('max-tickets', function (value) {
            const max = this.options.context?.maxTickets ?? 750
            if (value && value > max) {
                return this.createError({ message: `Quantity exceeds ${max} limit, Upgrade your plan` })
            }
            return true
        })
        .required('Please enter a quantity'),
    perPersonMax: yup.number()
        .typeError('Please enter a valid limit')
        .min(1)
        .test('max-per-person', function (value) {
            const max = this.options.context?.maxTickets ?? 750
            if (value && value > max) {
                return this.createError({ message: `Limit cannot exceed ${max} attendees` })
            }
            return true
        })
        .optional(),
    promoCode: promoCodeSchema,
});

export type TicketType = yup.InferType<typeof ticketTypeSchema>;

export const step3Schema = yup.object({
    ticketTypes: yup.array(ticketTypeSchema)
        .min(1, 'Please add at least one ticket type')
        .test('total-quantity', function (value) {
            const max = this.options.context?.maxTickets ?? 750
            const total = (value ?? []).reduce((acc, t) => acc + (Number(t.quantity) || 0), 0)
            if (total > max) {
                return this.createError({ message: `Total ticket quantity (${total}) exceeds your plan limit of ${max}. Upgrade your plan to increase this limit.` })
            }
            return true
        })
        .required(),

    salesPeriod: yup.object({
        startDateTime: yup.string().required('Sales start date & time is required'),
        endDateTime: yup.string().required('Sales end date & time is required'),
    })
        .test('sales-start-future', 'Sales start date must be in the future', function (value) {
            if (!value?.startDateTime) return true;
            if (new Date(value.startDateTime) <= new Date())
                return this.createError({
                    path: `${this.path}.startDateTime`,  // ← absolute path
                    message: 'Sales start date must be in the future'
                });
            return true;
        })
        .test('sales-end-after-start', 'Sales end date must be after the start date', function (value) {
            if (!value?.startDateTime || !value?.endDateTime) return true;
            if (new Date(value.endDateTime) <= new Date(value.startDateTime))
                return this.createError({
                    path: `${this.path}.endDateTime`,  // ← absolute path
                    message: 'Sales end date must be after the start date'
                });
            return true;
        }),

    refundPolicy: yup.string()
        .oneOf(['no', 'partial', 'full', 'custom'] as const)
        .required('Please select a refund policy'),

    // Only validated when refundPolicy === 'custom'
    customRefundPercentage: yup.mixed().transform(toOptionalNumber),
})
    .test('custom-refund-pct', 'Custom refund percentage is required', function (values) {
        if (values.refundPolicy !== 'custom') return true;
        const val = toOptionalNumber(values.customRefundPercentage);
        if (typeof val !== 'number' || isNaN(val) || val < 1 || val > 100) {
            return this.createError({
                path: 'customRefundPercentage',
                message: 'Please enter a refund percentage between 1% and 100%',
            });
        }
        return true;
    });


// ─── Step 4: Settings ─────────────────────────────────────────────────────────

const collaboratorSchema = yup.object({
    id: yup.string().required(),
    name: yup.string().required(),
    email: yup.string().email().required(),
    avatar: yup.string().optional(),
    role: yup.string().oneOf([...ROLE_IDS, 'host'] as const).required(),
    permissions: yup.array(yup.string().defined()).default([]),
    status: yup.string().oneOf(['active', 'disabled', 'pending'] as const).required(),
});

export const step4Schema = yup.object({
    checkInSettings: yup.object({
        qrCodeEnabled: yup.boolean().required(),
        ageRestriction: yup.boolean().required(),
        // Validated directly on the field so the error path is checkInSettings.minimumAge
        minimumAge: yup.mixed()
            .transform(toOptionalNumber)
            .when('ageRestriction', {
                is: true,
                then: (schema) =>
                    schema.test(
                        'min-age-required',
                        'Minimum age must be 18 or older',
                        (val) => {
                            const age = Number(val)
                            return !isNaN(age) && age >= 18
                        }
                    ),
                otherwise: (schema) => schema.optional(),
            }),
    }),

    emailNotifications: yup.object({
        orderConfirmation: yup.boolean().required(),
        ticketDelivery: yup.boolean().required(),
        reminders: yup.boolean().required(),
        postEventEmails: yup.boolean().required(),
        customizeSenderName: yup.boolean().required(),
    }),

    affiliateProgram: yup.object({
        enabled: yup.boolean().required(),
        // Validated directly on the field so the error path is affiliateProgram.percentageCommission
        percentageCommission: yup.mixed()
            .transform(toOptionalNumber)
            .when('enabled', {
                is: true,
                then: (schema) =>
                    schema.test(
                        'commission-range',
                        'Commission must be between 1% and 50%',
                        (val) => {
                            const n = Number(val)
                            return !isNaN(n) && n >= 1 && n <= 50
                        }
                    ),
                otherwise: (schema) => schema.optional(),
            }),
        startDate: yup.date().optional(),
        endDate: yup.date().optional(),
    }),

    permissions: yup.object({
        collaborators: yup.array(collaboratorSchema).default([]),
    }),
});


// ─── Full combined schema ─────────────────────────────────────────────────────

export const completeEventSchema = yup.object({
    basicInformation: step1Schema,
    detailsMedia: step2Schema,
    ticketsPricing: step3Schema,
    settings: step4Schema,
    reviewPublish: yup.object({
        status: yup.string().oneOf(['draft', 'published'] as const).required(),
        publishedAt: yup.date().optional(),
    }),
});


// ─── Type exports ─────────────────────────────────────────────────────────────

export type Step1FormData = yup.InferType<typeof step1Schema>;
export type Step2FormData = yup.InferType<typeof step2Schema>;
export type Step3FormData = yup.InferType<typeof step3Schema>;
export type Step4FormData = yup.InferType<typeof step4Schema>;
export type CompleteEventFormData = yup.InferType<typeof completeEventSchema>;