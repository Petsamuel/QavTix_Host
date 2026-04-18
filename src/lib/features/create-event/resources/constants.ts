// Event Categories
export const EVENT_CATEGORIES = [
    { value: 'music', label: 'Music & Concerts' },
    { value: 'sports', label: 'Sports & Fitness' },
    { value: 'arts', label: 'Arts & Theater' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'business', label: 'Business & Networking' },
    { value: 'technology', label: 'Technology & Innovation' },
    { value: 'education', label: 'Education & Learning' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'travel', label: 'Travel & Adventure' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'charity', label: 'Charity & Causes' },
    { value: 'community', label: 'Community & Culture' },
] as const;

// Additional Tags (Popular suggestions)
export const POPULAR_TAGS = [
    'Music', 'Concert', 'Live', 'Festival', 'Party',
    'Workshop', 'Conference', 'Seminar', 'Networking',
    'Exhibition', 'Comedy', 'Theater', 'Dance',
    'Sports', 'Fitness', 'Wellness', 'Outdoor',
    'Family', 'Kids', 'Educational', 'Charity'
]

// Currencies
export const CURRENCIES = [
    { value: 'NGN', label: '₦ NGN', symbol: '₦' },
    { value: 'USD', label: '$ USD', symbol: '$' },
    { value: 'GBP', label: '£ GBP', symbol: '£' },
    { value: 'EUR', label: '€ EUR', symbol: '€' },
] as const;

// Ticket Types (Common presets)
export const TICKET_TYPE_PRESETS = [
    'VIP',
    'Regular',
    'Standard',
    'Premium',
    'Early Bird',
    'General Admission',
    'Student',
    'Group',
    'Table'
];

// Recurrence Frequencies
export const RECURRENCE_FREQUENCIES = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
] as const;

// Days of Week
export const DAYS_OF_WEEK = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
];

// Refund Policy Options
export const REFUND_POLICIES = [
    { value: 'no', label: 'No Refund' },
    { value: 'partial', label: 'Partial Refund (50%)' },
    { value: 'full', label: 'Full Refund (100%)' },
    { value: 'custom', label: 'Custom Percentage' },
] as const;



// Collaborator Permissions
export const COLLABORATOR_ROLES = [
  { id: 'manager', title: 'Manager', description: 'Can oversee all platform operations, manage attendees, monitor financials, access sales and analytics, manage marketing tools, supervise check-in activities, assign roles and permissions etc.' },
  { id: 'financials', title: 'Financials', description: 'Can view financial data, manage payouts, track revenue, and access transaction reports.' },
  { id: 'customers', title: 'Customers', description: 'Can view customer details, manage attendees, and handle customer-related actions.' },
  { id: 'marketing', title: 'Marketing Tools', description: 'Can access promotions, create campaigns, and manage referral or discount tools.' },
  { id: 'sales', title: 'Sales & Analytics', description: 'Can track sales performance, view analytics, and generate reports.' },
  { id: 'checkin', title: 'Check-in System', description: 'Can manage attendee check-ins, validate tickets, and monitor entry status.' },
] as const;


export const ROLE_IDS = COLLABORATOR_ROLES.map(v => v.id)


// Social Media Platforms
export const SOCIAL_PLATFORMS = [
    { value: 'facebook', label: 'Facebook', icon: 'mdi:facebook' },
    { value: 'twitter', label: 'Twitter/X', icon: 'mdi:twitter' },
    { value: 'instagram', label: 'Instagram', icon: 'mdi:instagram' },
    { value: 'linkedin', label: 'LinkedIn', icon: 'mdi:linkedin' },
    { value: 'youtube', label: 'YouTube', icon: 'mdi:youtube' },
    { value: 'tiktok', label: 'TikTok', icon: 'ic:baseline-tiktok' },
    { value: 'website', label: 'Website', icon: 'mdi:web' },
] as const;

// File Upload Limits
export const FILE_UPLOAD_LIMITS = {
    featuredImage: {
        maxSize: 5 * 1024 * 1024, // 5MB
        acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
        label: 'JPG, PNG, WEBP (Max 5MB)'
    },
    additionalImages: {
        maxCount: 10,
        maxSize: 5 * 1024 * 1024, // 5MB each
        acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
        label: 'Up to 10 gallery images'
    },
    video: {
        maxSize: 30 * 1024 * 1024, // 30MB
        acceptedFormats: ['video/mp4', 'video/mov', 'video/wmv', 'video/avi'],
        label: 'MP4, MOV, WMV, AVI (Max 30MB)'
    }
} as const;

// Character Limits
export const CHARACTER_LIMITS = {
    eventTitle: 100,
    shortDescription: 160,
    fullDescription: 5000,
    organizerDescription: 500,
    ticketDescription: 200,
    venueName: 100,
    promoCode: 20,
} as const;

// Step Configuration
export const STEPS_CONFIG = [
    {
        number: 1,
        title: 'Basic Information',
        subtitle: 'Event basics',
        icon: 'mdi:information-outline'
    },
    {
        number: 2,
        title: 'Details & Media',
        subtitle: 'Event details',
        icon: 'mdi:image-multiple-outline'
    },
    {
        number: 3,
        title: 'Tickets & Pricing',
        subtitle: 'Ticket setup',
        icon: 'mdi:ticket-outline'
    },
    {
        number: 4,
        title: 'Settings',
        subtitle: 'Configuration',
        icon: 'mdi:cog-outline'
    },
    {
        number: 5,
        title: 'Review & Publish',
        subtitle: 'Final review',
        icon: 'mdi:check-circle-outline'
    }
] as const;

// Default Values
export const DEFAULT_VALUES = {
    currency: 'NGN',
    country: 'NG',
    locationType: 'physical' as const,
    eventType: 'single' as const,
    refundPolicy: 'no' as const,
    qrCodeEnabled: true,
    orderConfirmation: true,
    ticketDelivery: true,
    reminders: false,
    postEventEmails: false,
    customizeSenderName: false,
    affiliateEnabled: false,
    percentageCommission: 10,
} as const;

// Validation Messages
export const VALIDATION_MESSAGES = {
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    invalidUrl: 'Please enter a valid URL',
    invalidPhone: 'Please enter a valid phone number',
    minLength: (min: number) => `Minimum ${min} characters required`,
    maxLength: (max: number) => `Maximum ${max} characters allowed`,
    minValue: (min: number) => `Minimum value is ${min}`,
    maxValue: (max: number) => `Maximum value is ${max}`,
    invalidDate: 'Please select a valid date',
    endDateBeforeStart: 'End date must be after start date',
    fileTooLarge: (max: string) => `File size must be less than ${max}`,
    invalidFileType: 'Invalid file type',
} as const;