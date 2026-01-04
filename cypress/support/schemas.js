/**
 * Centralized schema validators for test data generators
 * Single source of truth for all generator output schemas
 */

// ============================================
// USER & PROFILE
// ============================================

export const expectValidUser = (user) => {
  expect(user).to.be.an('object');
  expect(user).to.have.all.keys(
    'id', 'firstName', 'lastName', 'email', 'phone', 'avatar',
    'dateOfBirth', 'gender', 'address', 'preferences'
  );
  expect(user.id).to.be.a('string');
  expect(user.firstName).to.be.a('string');
  expect(user.lastName).to.be.a('string');
  expect(user.email).to.be.a('string');
  expect(user.gender).to.be.oneOf(['male', 'female', 'other']);
};

export const expectValidAddress = (address) => {
  expect(address).to.be.an('object');
  expect(address).to.have.all.keys(
    'id', 'street', 'city', 'state', 'zipCode', 'country',
    'apartment', 'isDefault', 'type', 'coordinates'
  );
  expect(address.type).to.be.oneOf(['home', 'work', 'billing', 'shipping']);
  expect(address.coordinates).to.have.all.keys('lat', 'lng');
};

// ============================================
// E-COMMERCE
// ============================================

export const expectValidProduct = (product) => {
  expect(product).to.be.an('object');
  expect(product).to.have.all.keys(
    'id', 'name', 'description', 'price', 'category',
    'inStock', 'image', 'sku', 'relatedProducts'
  );
  expect(product.id).to.be.a('string');
  expect(product.price).to.be.a('number');
  expect(product.inStock).to.be.a('boolean');
};

export const expectValidOrder = (order) => {
  expect(order).to.be.an('object');
  expect(order).to.have.all.keys(
    'id', 'customerName', 'orderDate', 'products', 'totalAmount', 'shippingAddress'
  );
  expect(order.id).to.be.a('string');
  expect(order.products).to.be.an('array');
  expect(order.totalAmount).to.be.a('number');
};

export const expectValidReview = (review) => {
  expect(review).to.be.an('object');
  expect(review).to.have.all.keys(
    'id', 'productId', 'rating', 'comment', 'reviewerName',
    'reviewDate', 'helpful', 'verified'
  );
  expect(review.rating).to.be.a('number').and.to.be.within(1, 5);
  expect(review.verified).to.be.a('boolean');
};

export const expectValidCategory = (category) => {
  expect(category).to.be.an('object');
  expect(category).to.have.all.keys(
    'id', 'name', 'description', 'parentId', 'slug', 'isActive'
  );
  expect(category.isActive).to.be.a('boolean');
};

export const expectValidCart = (cart) => {
  expect(cart).to.be.an('object');
  expect(cart).to.have.all.keys(
    'id', 'userId', 'items', 'itemCount', 'subtotal', 'tax',
    'discount', 'total', 'couponCode', 'createdAt', 'updatedAt', 'expiresAt'
  );
  expect(cart.items).to.be.an('array').and.to.have.length.at.least(1);
  expect(cart.subtotal).to.be.a('number');
  expect(cart.total).to.be.a('number');
};

export const expectValidCartItem = (item) => {
  expect(item).to.have.all.keys(
    'id', 'productId', 'productName', 'productImage', 'price',
    'quantity', 'subtotal', 'variant'
  );
  expect(item.subtotal).to.equal(parseFloat((item.price * item.quantity).toFixed(2)));
};

export const expectValidWishlist = (wishlist) => {
  expect(wishlist).to.be.an('object');
  expect(wishlist).to.have.all.keys(
    'id', 'userId', 'name', 'isPublic', 'items', 'totalItems',
    'totalValue', 'createdAt', 'updatedAt'
  );
  expect(wishlist.name).to.be.oneOf(['My Wishlist', 'Birthday Ideas', 'Holiday List', 'Favorites']);
  expect(wishlist.isPublic).to.be.a('boolean');
};

export const expectValidReturn = (returnRequest) => {
  expect(returnRequest).to.be.an('object');
  expect(returnRequest).to.have.all.keys(
    'id', 'orderId', 'customerId', 'status', 'reason', 'description',
    'items', 'refundAmount', 'refundMethod', 'returnShippingLabel',
    'trackingNumber', 'photos', 'requestedAt', 'processedAt', 'completedAt'
  );
  expect(returnRequest.status).to.be.oneOf([
    'pending', 'approved', 'rejected', 'processing', 'completed', 'cancelled'
  ]);
  expect(returnRequest.refundMethod).to.be.oneOf([
    'original_payment', 'store_credit', 'bank_transfer'
  ]);
};

// ============================================
// SOCIAL & COMMUNICATION
// ============================================

export const expectValidSocialProfile = (profile) => {
  expect(profile).to.be.an('object');
  expect(profile).to.have.all.keys(
    'id', 'platform', 'username', 'displayName', 'bio', 'avatarUrl',
    'coverImageUrl', 'followers', 'following', 'postsCount', 'isVerified',
    'isPrivate', 'joinedDate', 'website', 'location'
  );
  expect(profile.platform).to.be.oneOf(['twitter', 'instagram', 'linkedin', 'facebook', 'tiktok', 'youtube']);
  expect(profile.isVerified).to.be.a('boolean');
  expect(profile.isPrivate).to.be.a('boolean');
};

export const expectValidComment = (comment) => {
  expect(comment).to.be.an('object');
  expect(comment).to.have.all.keys(
    'id', 'postId', 'parentId', 'authorId', 'authorName', 'authorAvatar',
    'content', 'likes', 'dislikes', 'repliesCount', 'isEdited', 'isPinned',
    'createdAt', 'updatedAt'
  );
  expect(comment.content).to.be.a('string').and.to.have.length.greaterThan(0);
  expect(comment.likes).to.be.a('number').and.to.be.at.least(0);
  expect(comment.isEdited).to.be.a('boolean');
};

export const expectValidNotification = (notification) => {
  expect(notification).to.be.an('object');
  expect(notification).to.have.all.keys(
    'id', 'type', 'title', 'message', 'isRead', 'priority',
    'actionUrl', 'imageUrl', 'senderId', 'senderName', 'createdAt', 'expiresAt'
  );
  expect(notification.type).to.be.oneOf([
    'message', 'like', 'comment', 'follow', 'mention', 'system', 'payment', 'reminder', 'alert'
  ]);
  expect(notification.priority).to.be.oneOf(['low', 'medium', 'high', 'urgent']);
  expect(notification.isRead).to.be.a('boolean');
};

export const expectValidMessage = (message) => {
  expect(message).to.be.an('object');
  expect(message).to.have.all.keys(
    'id', 'conversationId', 'senderId', 'receiverId', 'type', 'content',
    'attachmentUrl', 'isDelivered', 'isRead', 'replyToId', 'reactions',
    'createdAt', 'editedAt'
  );
  expect(message.type).to.be.oneOf(['text', 'image', 'file', 'audio', 'video', 'location', 'sticker']);
  expect(message.isDelivered).to.be.a('boolean');
  expect(message.isRead).to.be.a('boolean');
  expect(message.reactions).to.be.an('array');
};

// ============================================
// BUSINESS & ENTERPRISE
// ============================================

export const expectValidCompany = (company) => {
  expect(company).to.be.an('object');
  expect(company).to.have.all.keys(
    'id', 'name', 'industry', 'foundedYear', 'employees', 'revenue',
    'headquarters', 'ceo', 'description', 'stockSymbol', 'website'
  );
  expect(company.id).to.be.a('string');
  expect(company.employees).to.be.a('number');
};

export const expectValidInvoice = (invoice) => {
  expect(invoice).to.be.an('object');
  expect(invoice).to.have.all.keys(
    'id', 'invoiceNumber', 'status', 'issueDate', 'dueDate', 'client',
    'items', 'subtotal', 'taxRate', 'tax', 'discount', 'total',
    'currency', 'notes', 'paymentTerms', 'paymentMethod'
  );
  expect(invoice.invoiceNumber).to.match(/^INV-\d{6}$/);
  expect(invoice.status).to.be.oneOf(['draft', 'sent', 'paid', 'overdue', 'cancelled', 'refunded']);
  expect(invoice.items).to.be.an('array').and.to.have.length.at.least(1);
};

export const expectValidEmployee = (employee) => {
  expect(employee).to.be.an('object');
  expect(employee).to.have.all.keys(
    'id', 'employeeId', 'firstName', 'lastName', 'email', 'phone',
    'avatar', 'department', 'jobTitle', 'employmentType', 'status',
    'manager', 'salary', 'hireDate', 'terminationDate', 'workLocation',
    'office', 'skills', 'emergencyContact'
  );
  expect(employee.employeeId).to.match(/^EMP-\d{6}$/);
  expect(employee.employmentType).to.be.oneOf(['full-time', 'part-time', 'contract', 'intern']);
  expect(employee.status).to.be.oneOf(['active', 'on_leave', 'terminated', 'suspended']);
  expect(employee.workLocation).to.be.oneOf(['office', 'remote', 'hybrid']);
};

export const expectValidProject = (project) => {
  expect(project).to.be.an('object');
  expect(project).to.have.all.keys(
    'id', 'name', 'code', 'description', 'status', 'priority', 'category',
    'startDate', 'endDate', 'budget', 'progress', 'owner', 'team',
    'milestones', 'tags', 'repositoryUrl', 'documentationUrl'
  );
  expect(project.code).to.match(/^[A-Z]{3}-\d{4}$/);
  expect(project.status).to.be.oneOf(['planning', 'in_progress', 'on_hold', 'completed', 'cancelled']);
  expect(project.priority).to.be.oneOf(['low', 'medium', 'high', 'critical']);
  expect(project.progress).to.be.a('number').and.to.be.within(0, 100);
};

export const expectValidTicket = (ticket) => {
  expect(ticket).to.be.an('object');
  expect(ticket).to.have.all.keys(
    'id', 'ticketNumber', 'subject', 'description', 'status', 'priority',
    'category', 'channel', 'customer', 'assignee', 'tags', 'attachments',
    'createdAt', 'updatedAt', 'resolvedAt', 'firstResponseTime', 'satisfactionRating'
  );
  expect(ticket.ticketNumber).to.match(/^TKT-\d{8}$/);
  expect(ticket.status).to.be.oneOf(['open', 'in_progress', 'pending', 'resolved', 'closed']);
  expect(ticket.priority).to.be.oneOf(['low', 'medium', 'high', 'urgent']);
  expect(ticket.channel).to.be.oneOf(['email', 'phone', 'chat', 'web', 'social']);
};

export const expectValidMeeting = (meeting) => {
  expect(meeting).to.be.an('object');
  expect(meeting).to.have.all.keys(
    'id', 'title', 'description', 'type', 'status', 'startTime', 'endTime',
    'duration', 'timezone', 'location', 'organizer', 'attendees', 'isRecurring',
    'recurrence', 'agenda', 'notes', 'recordingUrl'
  );
  expect(meeting.type).to.be.oneOf(['one_on_one', 'team', 'all_hands', 'interview', 'external', 'training']);
  expect(meeting.status).to.be.oneOf(['scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled']);
  expect(meeting.duration).to.be.oneOf([15, 30, 45, 60, 90, 120]);
};

export const expectValidJobListing = (job) => {
  expect(job).to.be.an('object');
  expect(job).to.have.all.keys(
    'id', 'title', 'company', 'location', 'description', 'requirements',
    'salary', 'employmentType', 'postedDate', 'applicationDeadline'
  );
  expect(job.requirements).to.be.an('array').and.have.length(3);
  expect(job.salary).to.have.all.keys('min', 'max');
  expect(job.employmentType).to.be.oneOf(['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Remote']);
};

// ============================================
// FINANCE
// ============================================

export const expectValidCreditCard = (card) => {
  expect(card).to.be.an('object');
  expect(card).to.have.all.keys(
    'id', 'cardNumber', 'cardHolder', 'expiryDate', 'cvv', 'cardType', 'isDefault'
  );
  expect(card.isDefault).to.be.a('boolean');
};

export const expectValidTransaction = (transaction) => {
  expect(transaction).to.be.an('object');
  expect(transaction).to.have.all.keys(
    'id', 'amount', 'currency', 'type', 'status', 'date', 'description', 'accountNumber'
  );
  expect(transaction.type).to.be.oneOf(['purchase', 'refund', 'transfer', 'withdrawal', 'deposit']);
  expect(transaction.status).to.be.oneOf(['pending', 'completed', 'failed', 'cancelled']);
};

export const expectValidBankAccount = (account) => {
  expect(account).to.be.an('object');
  expect(account).to.have.all.keys(
    'id', 'accountNumber', 'routingNumber', 'iban', 'bic', 'accountType',
    'accountName', 'balance', 'availableBalance', 'currency', 'status',
    'owner', 'bank', 'openedDate', 'lastActivityDate', 'interestRate',
    'overdraftLimit', 'isJointAccount'
  );
  expect(account.accountType).to.be.oneOf(['checking', 'savings', 'money_market', 'cd', 'ira']);
  expect(account.status).to.be.oneOf(['active', 'frozen', 'closed', 'pending']);
  expect(account.isJointAccount).to.be.a('boolean');
};

export const expectValidLoan = (loan) => {
  expect(loan).to.be.an('object');
  expect(loan).to.have.all.keys(
    'id', 'loanNumber', 'type', 'status', 'borrower', 'principal',
    'interestRate', 'term', 'monthlyPayment', 'totalInterest', 'totalPayable',
    'remainingBalance', 'currency', 'startDate', 'endDate', 'nextPaymentDate',
    'paymentsMade', 'paymentsRemaining', 'collateral', 'lender'
  );
  expect(loan.loanNumber).to.match(/^LN-\d{10}$/);
  expect(loan.type).to.be.oneOf(['personal', 'mortgage', 'auto', 'student', 'business', 'home_equity']);
  expect(loan.status).to.be.oneOf(['pending', 'approved', 'active', 'paid_off', 'defaulted', 'cancelled']);
};

export const expectValidInsurancePolicy = (policy) => {
  expect(policy).to.be.an('object');
  expect(policy).to.have.all.keys(
    'id', 'policyNumber', 'type', 'status', 'policyholder', 'coverage',
    'premium', 'effectiveDate', 'expirationDate', 'beneficiaries',
    'insurer', 'claims', 'autoRenewal'
  );
  expect(policy.policyNumber).to.match(/^POL-[A-Z0-9]{10}$/);
  expect(policy.type).to.be.oneOf(['health', 'auto', 'home', 'life', 'travel', 'pet', 'business', 'disability']);
  expect(policy.status).to.be.oneOf(['active', 'expired', 'cancelled', 'pending', 'suspended']);
};

export const expectValidSubscription = (subscription) => {
  expect(subscription).to.be.an('object');
  expect(subscription).to.have.all.keys(
    'id', 'planName', 'price', 'billingCycle', 'status',
    'startDate', 'nextBillingDate', 'features', 'autoRenew'
  );
  expect(subscription.planName).to.be.oneOf(['Basic', 'Standard', 'Premium', 'Enterprise']);
  expect(subscription.billingCycle).to.be.oneOf(['monthly', 'quarterly', 'yearly']);
  expect(subscription.status).to.be.oneOf(['active', 'cancelled', 'paused', 'expired']);
};

// ============================================
// CONTENT & MEDIA
// ============================================

export const expectValidBlogPost = (post) => {
  expect(post).to.be.an('object');
  expect(post).to.have.all.keys(
    'id', 'slug', 'title', 'excerpt', 'content', 'featuredImage', 'status',
    'author', 'category', 'tags', 'readingTime', 'views', 'likes',
    'commentsCount', 'isFeatured', 'allowComments', 'seo', 'publishedAt', 'updatedAt'
  );
  expect(post.status).to.be.oneOf(['draft', 'published', 'scheduled', 'archived']);
  expect(post.readingTime).to.be.a('number').and.to.be.at.least(2);
  expect(post.isFeatured).to.be.a('boolean');
  expect(post.allowComments).to.be.a('boolean');
};

export const expectValidEvent = (event) => {
  expect(event).to.be.an('object');
  expect(event).to.have.all.keys(
    'id', 'name', 'description', 'type', 'status', 'startDate', 'endDate',
    'timezone', 'venue', 'isVirtual', 'virtualUrl', 'coverImage', 'organizer',
    'speakers', 'tickets', 'capacity', 'registrations', 'categories',
    'isFree', 'registrationDeadline'
  );
  expect(event.type).to.be.oneOf([
    'conference', 'workshop', 'meetup', 'webinar', 'concert', 'festival', 'networking', 'exhibition'
  ]);
  expect(event.status).to.be.oneOf(['draft', 'published', 'cancelled', 'postponed', 'completed']);
  expect(event.isVirtual).to.be.a('boolean');
};

// ============================================
// TRAVEL & AUTOMOTIVE
// ============================================

export const expectValidTravelItinerary = (itinerary) => {
  expect(itinerary).to.be.an('object');
  expect(itinerary).to.have.all.keys(
    'travelerName', 'destination', 'departureDate', 'returnDate',
    'flightDetails', 'hotelReservation', 'carRental', 'plannedActivities',
    'travelInsurance', 'passportNumber', 'emergencyContact'
  );
  expect(itinerary.travelerName).to.be.a('string');
  expect(itinerary.destination).to.be.a('string');
  expect(itinerary.departureDate).to.match(/^\d{4}-\d{2}-\d{2}$/);
  expect(itinerary.returnDate).to.match(/^\d{4}-\d{2}-\d{2}$/);
};

export const expectValidVehicle = (vehicle) => {
  expect(vehicle).to.be.an('object');
  expect(vehicle).to.have.all.keys(
    'id', 'vin', 'make', 'model', 'year', 'color', 'type',
    'fuelType', 'transmission', 'mileage', 'price', 'condition',
    'features', 'owner'
  );
  expect(vehicle.type).to.be.oneOf(['sedan', 'suv', 'truck', 'coupe', 'hatchback', 'van', 'wagon']);
  expect(vehicle.fuelType).to.be.oneOf(['gasoline', 'diesel', 'electric', 'hybrid', 'plugin_hybrid']);
  expect(vehicle.transmission).to.be.oneOf(['automatic', 'manual', 'cvt']);
  expect(vehicle.condition).to.be.oneOf(['new', 'used', 'certified']);
};

// ============================================
// REAL ESTATE
// ============================================

export const expectValidProperty = (property) => {
  expect(property).to.be.an('object');
  expect(property).to.have.all.keys(
    'id', 'listingId', 'type', 'status', 'title', 'description', 'address',
    'price', 'currency', 'pricePerSqFt', 'bedrooms', 'bathrooms', 'squareFeet',
    'lotSize', 'yearBuilt', 'features', 'images', 'virtualTourUrl', 'agent',
    'openHouses', 'listedDate', 'daysOnMarket', 'views', 'saves'
  );
  expect(property.listingId).to.match(/^MLS-\d{8}$/);
  expect(property.type).to.be.oneOf([
    'house', 'apartment', 'condo', 'townhouse', 'land', 'commercial', 'industrial'
  ]);
  expect(property.status).to.be.oneOf(['for_sale', 'for_rent', 'sold', 'pending', 'off_market']);
};

// ============================================
// FOOD & RESTAURANT
// ============================================

export const expectValidRestaurant = (restaurant) => {
  expect(restaurant).to.be.an('object');
  expect(restaurant).to.have.all.keys(
    'id', 'name', 'description', 'cuisine', 'priceRange', 'rating', 'reviewCount',
    'address', 'coordinates', 'phone', 'email', 'website', 'hours', 'features', 'images',
    'isOpen', 'acceptsReservations', 'deliveryPartners', 'averageWaitTime', 'establishedYear'
  );
  expect(restaurant.cuisine).to.be.an('array').and.to.have.length.at.least(1);
  expect(restaurant.priceRange).to.be.oneOf(['$', '$$', '$$$', '$$$$']);
  expect(restaurant.rating).to.be.a('number').and.to.be.within(1, 5);
};

export const expectValidMenuItem = (item) => {
  expect(item).to.be.an('object');
  expect(item).to.have.all.keys(
    'id', 'restaurantId', 'name', 'description', 'category', 'price',
    'currency', 'image', 'ingredients', 'allergens', 'dietaryInfo',
    'calories', 'preparationTime', 'spicyLevel', 'isAvailable', 'isPopular',
    'isNewItem', 'rating', 'reviewCount', 'customizations', 'nutritionInfo'
  );
  expect(item.category).to.be.oneOf([
    'Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Soups', 'Salads', 'Sides', 'Specials'
  ]);
  expect(item.spicyLevel).to.be.a('number').and.to.be.within(0, 5);
};

export const expectValidFoodOrder = (order) => {
  expect(order).to.be.an('object');
  expect(order).to.have.all.keys(
    'id', 'orderNumber', 'status', 'type', 'restaurant', 'customer',
    'deliveryAddress', 'items', 'subtotal', 'deliveryFee', 'tax', 'tip',
    'total', 'paymentMethod', 'isPaid', 'estimatedDeliveryTime',
    'actualDeliveryTime', 'driver', 'rating', 'review', 'createdAt', 'updatedAt'
  );
  expect(order.orderNumber).to.match(/^ORD-\d{8}$/);
  expect(order.status).to.be.oneOf([
    'pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'
  ]);
  expect(order.type).to.be.oneOf(['delivery', 'pickup', 'dine_in']);
};

// ============================================
// TECHNICAL & API
// ============================================

export const expectValidApiResponse = (response) => {
  expect(response).to.be.an('object');
  expect(response).to.have.all.keys(
    'success', 'statusCode', 'message', 'data', 'error', 'meta', 'pagination'
  );
  expect(response.success).to.be.a('boolean');
  expect(response.statusCode).to.be.a('number');
  expect(response.message).to.be.a('string');
};

export const expectValidLogEntry = (log) => {
  expect(log).to.be.an('object');
  expect(log).to.have.all.keys(
    'id', 'timestamp', 'level', 'message', 'service', 'environment',
    'requestId', 'userId', 'sessionId', 'ip', 'userAgent', 'method',
    'path', 'statusCode', 'responseTime', 'metadata', 'stack'
  );
  expect(log.level).to.be.oneOf(['debug', 'info', 'warn', 'error', 'fatal']);
  expect(log.environment).to.be.oneOf(['development', 'staging', 'production']);
  expect(log.method).to.be.oneOf(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
};

// ============================================
// HEALTHCARE & EDUCATION
// ============================================

export const expectValidMedicalRecord = (record) => {
  expect(record).to.be.an('object');
  expect(record).to.have.all.keys(
    'id', 'patientId', 'patientName', 'dateOfBirth', 'bloodType',
    'allergies', 'conditions', 'medications', 'visits', 'emergencyContact'
  );
  expect(record.bloodType).to.be.oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);
  expect(record.allergies).to.be.an('array');
  expect(record.conditions).to.be.an('array');
  expect(record.medications).to.be.an('array');
};

export const expectValidEducation = (education) => {
  expect(education).to.be.an('object');
  expect(education).to.have.all.keys(
    'id', 'studentId', 'studentName', 'email', 'institution',
    'degree', 'fieldOfStudy', 'gpa', 'startDate', 'endDate',
    'courses', 'achievements', 'status'
  );
  expect(education.status).to.be.oneOf(['enrolled', 'graduated', 'withdrawn', 'on_leave']);
  expect(education.gpa).to.be.a('number').and.to.be.within(0, 4);
};
