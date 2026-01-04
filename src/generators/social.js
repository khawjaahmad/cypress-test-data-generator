const { initFaker } = require('../utils/faker-utils');

/**
 * Create social/communication generators
 * @param {Function} applyPlugins - Plugin application function
 * @returns {Object} Social generator methods
 */
const createSocialGenerators = (applyPlugins) => ({
    /**
     * Generate social media profile data
     * @param {Object} options - Generation options
     * @returns {Object} Generated social profile data
     */
    generateSocialProfile(options = {}) {
        const { seed, locale, platform = null } = options || {};
        const f = initFaker({ seed, locale });

        const platforms = ['twitter', 'instagram', 'linkedin', 'facebook', 'tiktok', 'youtube'];
        const selectedPlatform = platform || f.helpers.arrayElement(platforms);

        return applyPlugins({
            id: f.string.uuid(),
            platform: selectedPlatform,
            username: f.internet.username(),
            displayName: f.person.fullName(),
            bio: f.lorem.sentence(),
            avatarUrl: f.image.avatar(),
            coverImageUrl: f.image.url(),
            followers: f.number.int({ min: 0, max: 1000000 }),
            following: f.number.int({ min: 0, max: 5000 }),
            postsCount: f.number.int({ min: 0, max: 10000 }),
            isVerified: f.datatype.boolean(),
            isPrivate: f.datatype.boolean(),
            joinedDate: f.date.past({ years: 10 }).toISOString().split('T')[0],
            website: f.helpers.maybe(() => f.internet.url()) || null,
            location: f.location.city()
        });
    },

    /**
     * Generate comment/reply data
     * @param {Object} options - Generation options
     * @returns {Object} Generated comment data
     */
    generateComment(options = {}) {
        const { seed, locale, parentId = null, postId = null } = options || {};
        const f = initFaker({ seed, locale });

        return applyPlugins({
            id: f.string.uuid(),
            postId: postId || f.string.uuid(),
            parentId,
            authorId: f.string.uuid(),
            authorName: f.person.fullName(),
            authorAvatar: f.image.avatar(),
            content: f.lorem.paragraph(),
            likes: f.number.int({ min: 0, max: 10000 }),
            dislikes: f.number.int({ min: 0, max: 1000 }),
            repliesCount: parentId ? 0 : f.number.int({ min: 0, max: 50 }),
            isEdited: f.datatype.boolean(),
            isPinned: f.datatype.boolean(),
            createdAt: f.date.recent({ days: 30 }).toISOString(),
            updatedAt: f.date.recent({ days: 7 }).toISOString()
        });
    },

    /**
     * Generate notification data
     * @param {Object} options - Generation options
     * @returns {Object} Generated notification data
     */
    generateNotification(options = {}) {
        const { seed, locale, type = null } = options || {};
        const f = initFaker({ seed, locale });

        const notificationTypes = ['message', 'like', 'comment', 'follow', 'mention', 'system', 'payment', 'reminder', 'alert'];
        const selectedType = type || f.helpers.arrayElement(notificationTypes);

        return applyPlugins({
            id: f.string.uuid(),
            type: selectedType,
            title: f.lorem.sentence({ min: 3, max: 8 }),
            message: f.lorem.sentence(),
            isRead: f.datatype.boolean(),
            priority: f.helpers.arrayElement(['low', 'medium', 'high', 'urgent']),
            actionUrl: f.helpers.maybe(() => f.internet.url()) || null,
            imageUrl: f.helpers.maybe(() => f.image.avatar()) || null,
            senderId: f.helpers.maybe(() => f.string.uuid()) || null,
            senderName: f.helpers.maybe(() => f.person.fullName()) || null,
            createdAt: f.date.recent({ days: 7 }).toISOString(),
            expiresAt: f.helpers.maybe(() => f.date.future().toISOString()) || null
        });
    },

    /**
     * Generate chat message data
     * @param {Object} options - Generation options
     * @returns {Object} Generated message data
     */
    generateMessage(options = {}) {
        const { seed, locale, conversationId = null, senderId = null, receiverId = null } = options || {};
        const f = initFaker({ seed, locale });

        const messageTypes = ['text', 'image', 'file', 'audio', 'video', 'location', 'sticker'];

        return applyPlugins({
            id: f.string.uuid(),
            conversationId: conversationId || f.string.uuid(),
            senderId: senderId || f.string.uuid(),
            receiverId: receiverId || f.string.uuid(),
            type: f.helpers.arrayElement(messageTypes),
            content: f.lorem.paragraph(),
            attachmentUrl: f.helpers.maybe(() => f.internet.url()) || null,
            isDelivered: f.datatype.boolean(),
            isRead: f.datatype.boolean(),
            replyToId: f.helpers.maybe(() => f.string.uuid()) || null,
            reactions: f.helpers.multiple(() => ({
                emoji: f.internet.emoji(),
                userId: f.string.uuid()
            }), { count: f.number.int({ min: 0, max: 5 }) }),
            createdAt: f.date.recent({ days: 7 }).toISOString(),
            editedAt: f.helpers.maybe(() => f.date.recent({ days: 1 }).toISOString()) || null
        });
    }
});

module.exports = createSocialGenerators;
