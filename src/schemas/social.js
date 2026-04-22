const { z } = require('zod');

const SocialPlatformSchema = z.enum([
    'twitter',
    'instagram',
    'linkedin',
    'facebook',
    'tiktok',
    'youtube',
]);

const SocialProfileSchema = z.object({
    id: z.string(),
    platform: SocialPlatformSchema,
    username: z.string(),
    displayName: z.string(),
    bio: z.string(),
    avatarUrl: z.string(),
    coverImageUrl: z.string(),
    followers: z.number().int(),
    following: z.number().int(),
    postsCount: z.number().int(),
    isVerified: z.boolean(),
    isPrivate: z.boolean(),
    joinedDate: z.string(),
    website: z.string().nullable(),
    location: z.string(),
});

const CommentSchema = z.object({
    id: z.string(),
    postId: z.string(),
    parentId: z.string().nullable(),
    authorId: z.string(),
    authorName: z.string(),
    authorAvatar: z.string(),
    content: z.string(),
    likes: z.number().int(),
    dislikes: z.number().int(),
    repliesCount: z.number().int(),
    isEdited: z.boolean(),
    isPinned: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

const NotificationTypeSchema = z.enum([
    'message',
    'like',
    'comment',
    'follow',
    'mention',
    'system',
    'payment',
    'reminder',
    'alert',
]);

const NotificationSchema = z.object({
    id: z.string(),
    type: NotificationTypeSchema,
    title: z.string(),
    message: z.string(),
    isRead: z.boolean(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']),
    actionUrl: z.string().nullable(),
    imageUrl: z.string().nullable(),
    senderId: z.string().nullable(),
    senderName: z.string().nullable(),
    createdAt: z.string(),
    expiresAt: z.string().nullable(),
});

const MessageReactionSchema = z.object({
    emoji: z.string(),
    userId: z.string(),
});

const MessageSchema = z.object({
    id: z.string(),
    conversationId: z.string(),
    senderId: z.string(),
    receiverId: z.string(),
    type: z.enum(['text', 'image', 'file', 'audio', 'video', 'location', 'sticker']),
    content: z.string(),
    attachmentUrl: z.string().nullable(),
    isDelivered: z.boolean(),
    isRead: z.boolean(),
    replyToId: z.string().nullable(),
    reactions: z.array(MessageReactionSchema),
    createdAt: z.string(),
    editedAt: z.string().nullable(),
});

module.exports = {
    SocialPlatformSchema,
    SocialProfileSchema,
    CommentSchema,
    NotificationTypeSchema,
    NotificationSchema,
    MessageReactionSchema,
    MessageSchema,
};
