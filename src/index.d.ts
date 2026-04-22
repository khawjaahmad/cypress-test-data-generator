// Type definitions for cypress-test-data-generator
// Project: https://github.com/khawjaahmad/cypress-test-data-generator

export = dataGenerator;

declare function dataGenerator(
    on?: unknown,
    config?: unknown
): dataGenerator.DataGenerator;

declare namespace dataGenerator {
    /**
     * Register every generator as a cy.task in one line.
     *
     * @example
     * // cypress.config.js
     * const dataGenerator = require('cypress-test-data-generator');
     * setupNodeEvents(on, config) {
     *   dataGenerator.registerTasks(on, config);
     *   return config;
     * }
     */
    function registerTasks(on: unknown, config: unknown): DataGenerator;
}

declare namespace dataGenerator {
    // ============================================================
    // CORE
    // ============================================================

    /** Locales bundled with pre-configured fallback chains. Any other string falls back to 'en'. */
    type Locale =
        | 'en'
        | 'de'
        | 'fr'
        | 'es'
        | 'it'
        | 'pt_BR'
        | 'ja'
        | 'zh_CN'
        | 'ko'
        | 'ru'
        | (string & {});

    /** Common options accepted by every generator. */
    interface BaseOptions {
        /** Seed for reproducible output. Same seed + same locale = same data. */
        seed?: number | string;
        /** Locale code. Falls back to 'en' for unknown locales. */
        locale?: Locale;
    }

    /** Plugin transform function invoked on every generator's output. */
    type Plugin<TIn = unknown, TOut = TIn> = (data: TIn) => TOut;

    interface ErrorResult {
        error: string;
    }

    // ============================================================
    // SHARED SHAPES
    // ============================================================

    interface Address {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    }

    interface Coordinates {
        latitude: number;
        longitude: number;
    }

    interface AddressWithCoordinates extends Address {
        coordinates: Coordinates;
    }

    interface PersonRef {
        id: string;
        name: string;
    }

    interface ContactRef extends PersonRef {
        email: string;
    }

    // ============================================================
    // USER & PROFILE
    // ============================================================

    interface UserOptions extends BaseOptions {
        /** Country override. If omitted, Faker picks a random country. */
        country?: string | null;
        /** Inclusive minimum age. */
        ageMin?: number;
        /** Inclusive maximum age. */
        ageMax?: number;
        /** Alternative age range shape. */
        ageRange?: { min: number; max: number };
        /**
         * When true, invalid options throw instead of returning
         * `{ error: string }`. Recommended for new code.
         *
         * The default is `false` for backwards compatibility; this will
         * flip to `true` in v3.0.
         */
        strict?: boolean;
    }

    /** UserOptions narrowed to strict-mode — return type excludes ErrorResult. */
    interface StrictUserOptions extends UserOptions {
        strict: true;
    }

    interface User {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        age: number;
        address: Address;
    }

    interface FullAddress extends Address {
        id: string;
        latitude: number;
        longitude: number;
        isDefault: boolean;
    }

    // ============================================================
    // E-COMMERCE
    // ============================================================

    interface ProductOptions extends BaseOptions {
        customFields?: Record<string, unknown>;
        relatedProducts?: Product[];
    }

    interface Product {
        id: string;
        name: string;
        description: string;
        price: number;
        category: string;
        inStock: boolean;
        image: string;
        sku: string;
        relatedProducts: Product[];
        [customField: string]: unknown;
    }

    interface ProductWithRelationsOptions extends BaseOptions {
        relatedProductCount?: number;
    }

    interface ProductWithRelations extends Product {
        relatedProducts: Array<Product & { relatedToProductId: string }>;
    }

    interface OrderOptions extends BaseOptions {
        productCount?: number;
    }

    interface Order {
        id: string;
        customerName: string;
        orderDate: Date;
        products: Product[];
        totalAmount: number;
        shippingAddress: Address;
    }

    interface ReviewOptions extends BaseOptions {
        productId?: string;
    }

    interface Review {
        id: string;
        productId: string;
        rating: number;
        comment: string;
        reviewerName: string;
        reviewDate: string;
        helpful: number;
        verified: boolean;
    }

    interface CategoryOptions extends BaseOptions {
        parentId?: string | null;
    }

    interface Category {
        id: string;
        name: string;
        description: string;
        parentId: string | null;
        slug: string;
        isActive: boolean;
    }

    interface Inventory {
        productId: string;
        quantity: number;
        lastUpdated: Date;
        warehouseLocation: string;
        reorderPoint: number;
    }

    interface Coupon {
        code: string;
        discountType: 'percentage' | 'fixed';
        discountValue: number;
        expirationDate: Date;
        minPurchaseAmount: number;
        isActive: boolean;
    }

    interface ShippingMethod {
        id: string;
        name: 'Standard' | 'Express' | 'Overnight' | 'Economy' | 'Priority';
        price: number;
        estimatedDeliveryDays: number;
        provider: string;
        isAvailable: boolean;
    }

    interface PaymentMethod {
        id: string;
        type:
            | 'Credit Card'
            | 'Debit Card'
            | 'PayPal'
            | 'Bank Transfer'
            | 'Cash on Delivery'
            | 'Apple Pay'
            | 'Google Pay';
        name: string;
        isDefault: boolean;
        lastFour: string;
        expiryDate: Date;
    }

    interface CartOptions extends BaseOptions {
        itemCount?: number;
    }

    interface CartItem {
        id: string;
        productId: string;
        productName: string;
        productImage: string;
        price: number;
        quantity: number;
        subtotal: number;
        variant: { size: 'XS' | 'S' | 'M' | 'L' | 'XL'; color: string } | null;
    }

    interface Cart {
        id: string;
        userId: string;
        items: CartItem[];
        itemCount: number;
        subtotal: number;
        tax: number;
        discount: number;
        total: number;
        couponCode: string | null;
        createdAt: string;
        updatedAt: string;
        expiresAt: string;
    }

    interface WishlistOptions extends BaseOptions {
        itemCount?: number;
    }

    interface WishlistItem {
        id: string;
        productId: string;
        productName: string;
        productImage: string;
        price: number;
        originalPrice: number;
        inStock: boolean;
        addedAt: string;
        priority: 'low' | 'medium' | 'high';
        notes: string | null;
    }

    interface Wishlist {
        id: string;
        userId: string;
        name: string;
        isPublic: boolean;
        items: WishlistItem[];
        totalItems: number;
        totalValue: number;
        createdAt: string;
        updatedAt: string;
    }

    interface ReturnOptions extends BaseOptions {
        orderId?: string | null;
    }

    interface ReturnItem {
        productId: string;
        productName: string;
        quantity: number;
        price: number;
    }

    interface Return {
        id: string;
        orderId: string;
        customerId: string;
        status:
            | 'pending'
            | 'approved'
            | 'rejected'
            | 'processing'
            | 'completed'
            | 'cancelled';
        reason: string;
        description: string;
        items: ReturnItem[];
        refundAmount: number;
        refundMethod: 'original_payment' | 'store_credit' | 'bank_transfer';
        returnShippingLabel: string | null;
        trackingNumber: string | null;
        photos: string[];
        requestedAt: string;
        processedAt: string | null;
        completedAt: string | null;
    }

    // ============================================================
    // SOCIAL & COMMUNICATION
    // ============================================================

    type SocialPlatform =
        | 'twitter'
        | 'instagram'
        | 'linkedin'
        | 'facebook'
        | 'tiktok'
        | 'youtube';

    interface SocialProfileOptions extends BaseOptions {
        platform?: SocialPlatform;
    }

    interface SocialProfile {
        id: string;
        platform: SocialPlatform;
        username: string;
        displayName: string;
        bio: string;
        avatarUrl: string;
        coverImageUrl: string;
        followers: number;
        following: number;
        postsCount: number;
        isVerified: boolean;
        isPrivate: boolean;
        joinedDate: string;
        website: string | null;
        location: string;
    }

    interface CommentOptions extends BaseOptions {
        parentId?: string | null;
        postId?: string | null;
    }

    interface Comment {
        id: string;
        postId: string;
        parentId: string | null;
        authorId: string;
        authorName: string;
        authorAvatar: string;
        content: string;
        likes: number;
        dislikes: number;
        repliesCount: number;
        isEdited: boolean;
        isPinned: boolean;
        createdAt: string;
        updatedAt: string;
    }

    type NotificationType =
        | 'message'
        | 'like'
        | 'comment'
        | 'follow'
        | 'mention'
        | 'system'
        | 'payment'
        | 'reminder'
        | 'alert';

    interface NotificationOptions extends BaseOptions {
        type?: NotificationType;
    }

    interface Notification {
        id: string;
        type: NotificationType;
        title: string;
        message: string;
        isRead: boolean;
        priority: 'low' | 'medium' | 'high' | 'urgent';
        actionUrl: string | null;
        imageUrl: string | null;
        senderId: string | null;
        senderName: string | null;
        createdAt: string;
        expiresAt: string | null;
    }

    interface MessageOptions extends BaseOptions {
        conversationId?: string | null;
        senderId?: string | null;
        receiverId?: string | null;
    }

    interface MessageReaction {
        emoji: string;
        userId: string;
    }

    interface Message {
        id: string;
        conversationId: string;
        senderId: string;
        receiverId: string;
        type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'location' | 'sticker';
        content: string;
        attachmentUrl: string | null;
        isDelivered: boolean;
        isRead: boolean;
        replyToId: string | null;
        reactions: MessageReaction[];
        createdAt: string;
        editedAt: string | null;
    }

    // ============================================================
    // BUSINESS & ENTERPRISE
    // ============================================================

    interface Company {
        id: string;
        name: string;
        industry: string;
        foundedYear: number;
        employees: number;
        revenue: string;
        headquarters: string;
        ceo: string;
        description: string;
        stockSymbol: string;
        website: string;
    }

    interface InvoiceOptions extends BaseOptions {
        itemCount?: number;
    }

    interface InvoiceItem {
        id: string;
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }

    interface InvoiceClient {
        id: string;
        name: string;
        email: string;
        address: Address;
    }

    interface Invoice {
        id: string;
        invoiceNumber: string;
        status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
        issueDate: string;
        dueDate: string;
        client: InvoiceClient;
        items: InvoiceItem[];
        subtotal: number;
        taxRate: number;
        tax: number;
        discount: number;
        total: number;
        currency: string;
        notes: string | null;
        paymentTerms: 'Net 15' | 'Net 30' | 'Net 60' | 'Due on receipt';
        paymentMethod:
            | 'bank_transfer'
            | 'credit_card'
            | 'paypal'
            | 'check'
            | null;
    }

    interface EmployeeOptions extends BaseOptions {
        department?: string;
    }

    interface Employee {
        id: string;
        employeeId: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        avatar: string;
        department: string;
        jobTitle: string;
        employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
        status: 'active' | 'on_leave' | 'terminated' | 'suspended';
        manager: PersonRef | null;
        salary: { amount: number; currency: string; frequency: 'yearly' };
        hireDate: string;
        terminationDate: string | null;
        workLocation: 'office' | 'remote' | 'hybrid';
        office: { building: string; floor: number; desk: string };
        skills: string[];
        emergencyContact: { name: string; relationship: string; phone: string };
    }

    interface Project {
        id: string;
        name: string;
        code: string;
        description: string;
        status:
            | 'planning'
            | 'in_progress'
            | 'on_hold'
            | 'completed'
            | 'cancelled';
        priority: 'low' | 'medium' | 'high' | 'critical';
        category: 'Development' | 'Marketing' | 'Research' | 'Infrastructure' | 'Support';
        startDate: string;
        endDate: string;
        budget: { allocated: number; spent: number; currency: string };
        progress: number;
        owner: ContactRef;
        team: Array<{ id: string; name: string; role: string }>;
        milestones: Array<{
            id: string;
            name: string;
            dueDate: string;
            completed: boolean;
        }>;
        tags: string[];
        repositoryUrl: string | null;
        documentationUrl: string | null;
    }

    interface TicketOptions extends BaseOptions {
        customerId?: string | null;
    }

    interface Ticket {
        id: string;
        ticketNumber: string;
        subject: string;
        description: string;
        status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
        priority: 'low' | 'medium' | 'high' | 'urgent';
        category: string;
        channel: 'email' | 'phone' | 'chat' | 'web' | 'social';
        customer: ContactRef;
        assignee: (PersonRef & { department: 'Support' }) | null;
        tags: string[];
        attachments: Array<{
            id: string;
            filename: string;
            size: number;
            url: string;
        }>;
        createdAt: string;
        updatedAt: string;
        resolvedAt: string | null;
        firstResponseTime: number;
        satisfactionRating: number | null;
    }

    interface Meeting {
        id: string;
        title: string;
        description: string;
        type:
            | 'one_on_one'
            | 'team'
            | 'all_hands'
            | 'interview'
            | 'external'
            | 'training';
        status:
            | 'scheduled'
            | 'in_progress'
            | 'completed'
            | 'cancelled'
            | 'rescheduled';
        startTime: string;
        endTime: string;
        duration: 15 | 30 | 45 | 60 | 90 | 120;
        timezone: string;
        location:
            | {
                  type: 'virtual';
                  url: string;
                  platform: 'Zoom' | 'Google Meet' | 'Teams' | 'Webex';
              }
            | { type: 'physical'; room: string; building: string };
        organizer: ContactRef;
        attendees: Array<
            ContactRef & {
                status: 'accepted' | 'declined' | 'tentative' | 'pending';
                isOptional: boolean;
            }
        >;
        isRecurring: boolean;
        recurrence:
            | {
                  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
                  until: string;
              }
            | null;
        agenda: string[];
        notes: string | null;
        recordingUrl: string | null;
    }

    interface JobListing {
        id: string;
        title: string;
        company: string;
        location: string;
        description: string;
        requirements: string[];
        salary: { min: number; max: number };
        employmentType:
            | 'Full-time'
            | 'Part-time'
            | 'Contract'
            | 'Temporary'
            | 'Internship'
            | 'Remote';
        postedDate: string;
        applicationDeadline: string;
    }

    // ============================================================
    // FINANCE
    // ============================================================

    interface CreditCard {
        id: string;
        cardNumber: string;
        cardHolder: string;
        expiryDate: string;
        cvv: string;
        cardType: string;
        isDefault: boolean;
    }

    interface Transaction {
        id: string;
        amount: number;
        currency: string;
        type: 'purchase' | 'refund' | 'transfer' | 'withdrawal' | 'deposit';
        status: 'pending' | 'completed' | 'failed' | 'cancelled';
        date: string;
        description: string;
        accountNumber: string;
    }

    interface BankAccount {
        id: string;
        accountNumber: string;
        routingNumber: string;
        iban: string;
        bic: string;
        accountType: 'checking' | 'savings' | 'money_market' | 'cd' | 'ira';
        accountName: string;
        balance: number;
        availableBalance: number;
        currency: string;
        status: 'active' | 'frozen' | 'closed' | 'pending';
        owner: ContactRef;
        bank: { name: string; branch: string; address: string };
        openedDate: string;
        lastActivityDate: string;
        interestRate: number;
        overdraftLimit: number;
        isJointAccount: boolean;
    }

    type LoanType =
        | 'personal'
        | 'mortgage'
        | 'auto'
        | 'student'
        | 'business'
        | 'home_equity';

    interface LoanOptions extends BaseOptions {
        type?: LoanType;
    }

    interface Loan {
        id: string;
        loanNumber: string;
        type: LoanType;
        status:
            | 'pending'
            | 'approved'
            | 'active'
            | 'paid_off'
            | 'defaulted'
            | 'cancelled';
        borrower: ContactRef & { creditScore: number };
        principal: number;
        interestRate: number;
        term: 12 | 24 | 36 | 48 | 60 | 120 | 180 | 240 | 360;
        monthlyPayment: number;
        totalInterest: number;
        totalPayable: number;
        remainingBalance: number;
        currency: string;
        startDate: string;
        endDate: string;
        nextPaymentDate: string;
        paymentsMade: number;
        paymentsRemaining: number;
        collateral:
            | {
                  type: 'property' | 'vehicle' | 'savings' | 'investment';
                  value: number;
                  description: string;
              }
            | null;
        lender: { name: string; contactEmail: string };
    }

    type InsurancePolicyType =
        | 'health'
        | 'auto'
        | 'home'
        | 'life'
        | 'travel'
        | 'pet'
        | 'business'
        | 'disability';

    interface InsurancePolicyOptions extends BaseOptions {
        type?: InsurancePolicyType;
    }

    interface InsurancePolicy {
        id: string;
        policyNumber: string;
        type: InsurancePolicyType;
        status: 'active' | 'expired' | 'cancelled' | 'pending' | 'suspended';
        policyholder: ContactRef & { phone: string; dateOfBirth: string };
        coverage: { amount: number; deductible: number; currency: string };
        premium: {
            amount: number;
            frequency: 'monthly' | 'quarterly' | 'semi-annually' | 'annually';
            nextDueDate: string;
        };
        effectiveDate: string;
        expirationDate: string;
        beneficiaries: Array<{
            name: string;
            relationship: 'Spouse' | 'Child' | 'Parent' | 'Sibling' | 'Other';
            percentage: number;
        }>;
        insurer: { name: string; contactNumber: string; claimsEmail: string };
        claims: Array<{
            id: string;
            date: string;
            amount: number;
            status: 'pending' | 'approved' | 'denied' | 'paid';
            description: string;
        }>;
        autoRenewal: boolean;
    }

    interface Subscription {
        id: string;
        planName: 'Basic' | 'Standard' | 'Premium' | 'Enterprise';
        price: number;
        billingCycle: 'monthly' | 'quarterly' | 'yearly';
        status: 'active' | 'cancelled' | 'paused' | 'expired';
        startDate: string;
        nextBillingDate: string;
        features: string[];
        autoRenew: boolean;
    }

    // ============================================================
    // CONTENT & MEDIA
    // ============================================================

    interface BlogPost {
        id: string;
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        featuredImage: string;
        status: 'draft' | 'published' | 'scheduled' | 'archived';
        author: { id: string; name: string; avatar: string; bio: string };
        category:
            | 'Technology'
            | 'Business'
            | 'Lifestyle'
            | 'Travel'
            | 'Food'
            | 'Health'
            | 'Finance';
        tags: string[];
        readingTime: number;
        views: number;
        likes: number;
        commentsCount: number;
        isFeatured: boolean;
        allowComments: boolean;
        seo: {
            metaTitle: string;
            metaDescription: string;
            keywords: string[];
        };
        publishedAt: string;
        updatedAt: string;
    }

    interface EventTicket {
        id: string;
        name: 'General Admission' | 'VIP' | 'Early Bird' | 'Student';
        price: number;
        currency: string;
        available: number;
    }

    interface EventSpeaker {
        id: string;
        name: string;
        title: string;
        avatar: string;
        bio: string;
    }

    interface Event {
        id: string;
        name: string;
        description: string;
        type:
            | 'conference'
            | 'workshop'
            | 'meetup'
            | 'webinar'
            | 'concert'
            | 'festival'
            | 'networking'
            | 'exhibition';
        status: 'draft' | 'published' | 'cancelled' | 'postponed' | 'completed';
        startDate: string;
        endDate: string;
        timezone: string;
        venue: {
            name: string;
            address: string;
            city: string;
            country: string;
            coordinates: Coordinates;
        };
        isVirtual: boolean;
        virtualUrl: string | null;
        coverImage: string;
        organizer: ContactRef & { logo: string };
        speakers: EventSpeaker[];
        tickets: EventTicket[];
        capacity: number;
        registrations: number;
        categories: string[];
        isFree: boolean;
        registrationDeadline: string;
    }

    // ============================================================
    // TRAVEL & AUTOMOTIVE
    // ============================================================

    interface TravelItinerary {
        travelerName: string;
        destination: string;
        departureDate: string;
        returnDate: string;
        flightDetails: {
            airline: string;
            flightNumber: string;
            departureTime: string;
            arrivalTime: string;
        };
        hotelReservation: {
            hotelName: string;
            checkIn: string;
            checkOut: string;
            roomType: 'Standard' | 'Deluxe' | 'Suite' | 'Penthouse';
        };
        carRental: {
            company: string;
            carModel: string;
            pickupLocation: string;
        };
        plannedActivities: string[];
        travelInsurance: { provider: string; policyNumber: string };
        passportNumber: string;
        emergencyContact: {
            name: string;
            phone: string;
            relationship: 'Spouse' | 'Parent' | 'Sibling' | 'Friend';
        };
    }

    interface Vehicle {
        id: string;
        make: string;
        model: string;
        type: string;
        color: string;
        fuelType: string;
        year: number;
        mileage: number;
        price: number;
        vin: string;
        licensePlate: string;
    }

    // ============================================================
    // REAL ESTATE
    // ============================================================

    type PropertyType =
        | 'house'
        | 'apartment'
        | 'condo'
        | 'townhouse'
        | 'land'
        | 'commercial'
        | 'industrial';

    interface PropertyOptions extends BaseOptions {
        type?: PropertyType;
    }

    interface Property {
        id: string;
        listingId: string;
        type: PropertyType;
        status: 'for_sale' | 'for_rent' | 'sold' | 'pending' | 'off_market';
        title: string;
        description: string;
        address: AddressWithCoordinates;
        price: number;
        currency: string;
        pricePerSqFt: number;
        bedrooms: number;
        bathrooms: number;
        squareFeet: number;
        lotSize: number;
        yearBuilt: number;
        features: string[];
        images: string[];
        virtualTourUrl: string | null;
        agent: {
            id: string;
            name: string;
            phone: string;
            email: string;
            company: string;
            photo: string;
        };
        openHouses: Array<{
            date: string;
            startTime: '10:00' | '11:00' | '12:00' | '13:00' | '14:00';
            endTime: '15:00' | '16:00' | '17:00' | '18:00';
        }>;
        listedDate: string;
        daysOnMarket: number;
        views: number;
        saves: number;
    }

    // ============================================================
    // FOOD & RESTAURANT
    // ============================================================

    interface RestaurantHours {
        open: string;
        close: string;
    }

    interface Restaurant {
        id: string;
        name: string;
        description: string;
        cuisine: string[];
        priceRange: '$' | '$$' | '$$$' | '$$$$';
        rating: number;
        reviewCount: number;
        address: Address;
        coordinates: Coordinates;
        phone: string;
        email: string;
        website: string;
        hours: {
            monday: RestaurantHours;
            tuesday: RestaurantHours;
            wednesday: RestaurantHours;
            thursday: RestaurantHours;
            friday: RestaurantHours;
            saturday: RestaurantHours;
            sunday: RestaurantHours;
        };
        features: string[];
        images: string[];
        isOpen: boolean;
        acceptsReservations: boolean;
        deliveryPartners: Array<'Uber Eats' | 'DoorDash' | 'Grubhub' | 'Postmates'>;
        averageWaitTime: number;
        establishedYear: number;
    }

    interface MenuItemOptions extends BaseOptions {
        restaurantId?: string | null;
    }

    interface MenuItem {
        id: string;
        restaurantId: string;
        name: string;
        description: string;
        category:
            | 'Appetizers'
            | 'Main Course'
            | 'Desserts'
            | 'Beverages'
            | 'Soups'
            | 'Salads'
            | 'Sides'
            | 'Specials';
        price: number;
        currency: string;
        image: string;
        ingredients: string[];
        allergens: string[];
        dietaryInfo: string[];
        calories: number;
        preparationTime: number;
        spicyLevel: number;
        isAvailable: boolean;
        isPopular: boolean;
        isNewItem: boolean;
        rating: number;
        reviewCount: number;
        customizations: Array<{
            name: 'Size' | 'Spice Level' | 'Add-ons' | 'Sauce';
            options: Array<{ name: string; priceModifier: number }>;
        }>;
        nutritionInfo: {
            protein: number;
            carbs: number;
            fat: number;
            fiber: number;
            sodium: number;
        };
    }

    interface FoodOrderOptions extends BaseOptions {
        itemCount?: number;
    }

    interface FoodOrderItem {
        id: string;
        name: string;
        price: number;
        quantity: number;
        subtotal: number;
        specialInstructions: string | null;
        customizations: string[];
    }

    interface FoodOrder {
        id: string;
        orderNumber: string;
        status:
            | 'pending'
            | 'confirmed'
            | 'preparing'
            | 'ready'
            | 'out_for_delivery'
            | 'delivered'
            | 'cancelled';
        type: 'delivery' | 'pickup' | 'dine_in';
        restaurant: { id: string; name: string; address: string; phone: string };
        customer: ContactRef & { phone: string };
        deliveryAddress: Omit<Address, 'country'> & {
            instructions: string | null;
        };
        items: FoodOrderItem[];
        subtotal: number;
        deliveryFee: number;
        tax: number;
        tip: number;
        total: number;
        paymentMethod:
            | 'credit_card'
            | 'debit_card'
            | 'cash'
            | 'apple_pay'
            | 'google_pay';
        isPaid: boolean;
        estimatedDeliveryTime: string;
        actualDeliveryTime: string | null;
        driver:
            | {
                  id: string;
                  name: string;
                  phone: string;
                  vehicle: string;
                  rating: number;
              }
            | null;
        rating: number | null;
        review: string | null;
        createdAt: string;
        updatedAt: string;
    }

    // ============================================================
    // TECHNICAL & API
    // ============================================================

    interface ApiResponseOptions extends BaseOptions {
        success?: boolean;
    }

    interface ApiResponse {
        success: boolean;
        statusCode: number;
        message: string;
        data: {
            id: string;
            createdAt: string;
            updatedAt: string;
        } | null;
        error: {
            code: string;
            message: string;
            details: string | null;
        } | null;
        meta: {
            requestId: string;
            timestamp: string;
            version: string;
            rateLimit: {
                limit: number;
                remaining: number;
                reset: string;
            };
        };
        pagination: {
            page: number;
            pageSize: 10 | 20 | 50 | 100;
            totalItems: number;
            totalPages: number;
        } | null;
    }

    type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

    interface LogEntryOptions extends BaseOptions {
        level?: LogLevel;
    }

    interface LogEntry {
        id: string;
        timestamp: string;
        level: LogLevel;
        message: string;
        service: 'api' | 'auth' | 'database' | 'cache' | 'queue' | 'scheduler' | 'webhook';
        environment: 'development' | 'staging' | 'production';
        requestId: string;
        userId: string | null;
        sessionId: string | null;
        ip: string;
        userAgent: string;
        method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
        path: string;
        statusCode: number;
        responseTime: number;
        metadata: { hostname: string; pid: number; memory: number };
        stack: string | null;
    }

    // ============================================================
    // HEALTHCARE & EDUCATION
    // ============================================================

    interface MedicalRecord {
        patientId: string;
        name: string;
        dateOfBirth: string;
        gender: 'female' | 'male';
        bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
        height: number;
        weight: number;
        allergies: string[];
        medications: string[];
        diagnoses: string[];
        treatmentHistory: string;
        upcomingAppointments: string;
        primaryCarePhysician: string;
    }

    interface Education {
        id: string;
        degree:
            | 'Bachelor'
            | 'Master'
            | 'PhD'
            | 'Associate'
            | 'Diploma'
            | 'Certificate';
        fieldOfStudy: string;
        university: string;
        graduationYear: number;
        gpa: number;
        honors: 'Cum Laude' | 'Magna Cum Laude' | 'Summa Cum Laude' | null;
        activities: string[];
        startDate: string;
        endDate: string;
    }

    // ============================================================
    // RELATIONAL SCENARIO
    // ============================================================

    interface ScenarioOptions extends BaseOptions {
        /** Number of users to generate. Default: 3. */
        users?: number;
        /** Orders created for each user. Default: 0. */
        ordersPerUser?: number;
        /** Products in each order. Default: 3. */
        productsPerOrder?: number;
        /**
         * Size of the shared product catalog. Default: enough so every
         * order can pick `productsPerOrder` distinct items without overlap.
         */
        productsCount?: number;
        /** Reviews per product, each authored by a random user. Default: 0. */
        reviewsPerProduct?: number;
    }

    /** Order shape inside a Scenario — includes userId (FK) and shares the user's address. */
    interface ScenarioOrder {
        id: string;
        userId: string;
        customerName: string;
        orderDate: Date;
        products: Product[];
        totalAmount: number;
        shippingAddress: Address;
    }

    /** Review shape inside a Scenario — includes userId (FK) in addition to productId. */
    interface ScenarioReview extends Review {
        userId: string;
    }

    interface Scenario {
        users: User[];
        products: Product[];
        orders: ScenarioOrder[];
        reviews: ScenarioReview[];
    }

    // ============================================================
    // BULK / METHOD-NAME OVERLOAD
    // ============================================================

    /**
     * Mapping from generator method name to its return type.
     * Used to give `generateBulk('generateUser', n)` a precise return type.
     */
    interface GeneratorReturnMap {
        generateUser: User;
        generateAddress: FullAddress;
        generateProduct: Product;
        generateProductWithRelations: ProductWithRelations;
        generateOrder: Order;
        generateReview: Review;
        generateCategory: Category;
        generateCoupon: Coupon;
        generateShippingMethod: ShippingMethod;
        generatePaymentMethod: PaymentMethod;
        generateCart: Cart;
        generateWishlist: Wishlist;
        generateReturn: Return;
        generateSocialProfile: SocialProfile;
        generateComment: Comment;
        generateNotification: Notification;
        generateMessage: Message;
        generateCompany: Company;
        generateInvoice: Invoice;
        generateEmployee: Employee;
        generateProject: Project;
        generateTicket: Ticket;
        generateMeeting: Meeting;
        generateJobListing: JobListing;
        generateCreditCard: CreditCard;
        generateTransaction: Transaction;
        generateBankAccount: BankAccount;
        generateLoan: Loan;
        generateInsurancePolicy: InsurancePolicy;
        generateSubscription: Subscription;
        generateBlogPost: BlogPost;
        generateEvent: Event;
        generateTravelItinerary: TravelItinerary;
        generateVehicle: Vehicle;
        generateProperty: Property;
        generateRestaurant: Restaurant;
        generateMenuItem: MenuItem;
        generateFoodOrder: FoodOrder;
        generateApiResponse: ApiResponse;
        generateLogEntry: LogEntry;
        generateMedicalRecord: MedicalRecord;
        generateEducation: Education;
        generateScenario: Scenario;
    }

    // ============================================================
    // PUBLIC INTERFACE
    // ============================================================

    interface DataGenerator {
        // core
        registerPlugin(plugin: Plugin): void;
        setSeed(seed: number | string | null | undefined): void;
        setLocale(locale: Locale): void;

        // bulk — two overloads: method name (typed) or callback (generic)
        generateBulk<K extends keyof GeneratorReturnMap>(
            generatorName: K,
            count: number,
            options?: BaseOptions & Record<string, unknown>
        ): Array<GeneratorReturnMap[K]>;
        generateBulk<T>(
            fn: (options: BaseOptions & Record<string, unknown>) => T,
            count: number,
            options?: BaseOptions & Record<string, unknown>
        ): T[];

        // user & profile
        // Overload: strict:true → throws on invalid input, return is always User.
        generateUser(options: StrictUserOptions): User;
        generateUser(options?: UserOptions): User | ErrorResult;
        generateAddress(options?: BaseOptions): FullAddress;

        // e-commerce
        generateProduct(options?: ProductOptions): Product;
        generateProductWithRelations(
            options?: ProductWithRelationsOptions
        ): ProductWithRelations;
        generateOrder(options?: OrderOptions): Order;
        generateReview(options?: ReviewOptions): Review;
        generateCategory(options?: CategoryOptions): Category;
        generateInventory(productId?: string, options?: BaseOptions): Inventory;
        generateCoupon(options?: BaseOptions): Coupon;
        generateShippingMethod(options?: BaseOptions): ShippingMethod;
        generatePaymentMethod(options?: BaseOptions): PaymentMethod;
        generateCart(options?: CartOptions): Cart;
        generateWishlist(options?: WishlistOptions): Wishlist;
        generateReturn(options?: ReturnOptions): Return;

        // social
        generateSocialProfile(options?: SocialProfileOptions): SocialProfile;
        generateComment(options?: CommentOptions): Comment;
        generateNotification(options?: NotificationOptions): Notification;
        generateMessage(options?: MessageOptions): Message;

        // business
        generateCompany(options?: BaseOptions): Company;
        generateInvoice(options?: InvoiceOptions): Invoice;
        generateEmployee(options?: EmployeeOptions): Employee;
        generateProject(options?: BaseOptions): Project;
        generateTicket(options?: TicketOptions): Ticket;
        generateMeeting(options?: BaseOptions): Meeting;
        generateJobListing(options?: BaseOptions): JobListing;

        // finance
        generateCreditCard(options?: BaseOptions): CreditCard;
        generateTransaction(options?: BaseOptions): Transaction;
        generateBankAccount(options?: BaseOptions): BankAccount;
        generateLoan(options?: LoanOptions): Loan;
        generateInsurancePolicy(options?: InsurancePolicyOptions): InsurancePolicy;
        generateSubscription(options?: BaseOptions): Subscription;

        // content & media
        generateBlogPost(options?: BaseOptions): BlogPost;
        generateEvent(options?: BaseOptions): Event;

        // travel & automotive
        generateTravelItinerary(options?: BaseOptions): TravelItinerary;
        generateVehicle(options?: BaseOptions): Vehicle;

        // real estate
        generateProperty(options?: PropertyOptions): Property;

        // food & restaurant
        generateRestaurant(options?: BaseOptions): Restaurant;
        generateMenuItem(options?: MenuItemOptions): MenuItem;
        generateFoodOrder(options?: FoodOrderOptions): FoodOrder;

        // technical & api
        generateApiResponse(options?: ApiResponseOptions): ApiResponse;
        generateLogEntry(options?: LogEntryOptions): LogEntry;

        // healthcare & education
        generateMedicalRecord(options?: BaseOptions): MedicalRecord;
        generateEducation(options?: BaseOptions): Education;

        // relational
        generateScenario(options?: ScenarioOptions): Scenario;
    }
}
