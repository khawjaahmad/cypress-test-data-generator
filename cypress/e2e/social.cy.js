import {
  expectValidSocialProfile,
  expectValidComment,
  expectValidNotification,
  expectValidMessage
} from '../support/schemas';

describe('Social & Communication Generators', () => {
  describe('Social Profile Generator', () => {
    context('Basic Generation', () => {
      it('generates valid social profile with default options', () => {
        cy.task('generateSocialProfile').then(expectValidSocialProfile);
      });

      it('generates profile for specific platform', () => {
        cy.task('generateSocialProfile', { platform: 'instagram' }).then((profile) => {
          expect(profile.platform).to.equal('instagram');
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates identical profiles with same seed', () => {
        const seed = 12345;
        cy.task('generateSocialProfile', { seed }).then((p1) => {
          cy.task('generateSocialProfile', { seed }).then((p2) => {
            expect(p1.id).to.equal(p2.id);
            expect(p1.username).to.equal(p2.username);
            expect(p1.displayName).to.equal(p2.displayName);
          });
        });
      });

      it('generates different profiles with different seeds', () => {
        cy.task('generateSocialProfile', { seed: 111 }).then((p1) => {
          cy.task('generateSocialProfile', { seed: 222 }).then((p2) => {
            expect(p1.username).to.not.equal(p2.username);
          });
        });
      });
    });
  });

  describe('Comment Generator', () => {
    context('Basic Generation', () => {
      it('generates valid comment with default options', () => {
        cy.task('generateComment').then(expectValidComment);
      });

      it('generates comment with specific post ID', () => {
        const postId = 'test-post-123';
        cy.task('generateComment', { postId }).then((comment) => {
          expect(comment.postId).to.equal(postId);
        });
      });

      it('generates reply with parent ID', () => {
        const parentId = 'parent-comment-123';
        cy.task('generateComment', { parentId }).then((comment) => {
          expect(comment.parentId).to.equal(parentId);
          expect(comment.repliesCount).to.equal(0);
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates comments with same core data using same seed', () => {
        const seed = 54321;
        cy.task('generateComment', { seed }).then((c1) => {
          cy.task('generateComment', { seed }).then((c2) => {
            expect(c1.id).to.equal(c2.id);
            expect(c1.authorName).to.equal(c2.authorName);
            expect(c1.content).to.equal(c2.content);
          });
        });
      });
    });
  });

  describe('Notification Generator', () => {
    context('Basic Generation', () => {
      it('generates valid notification with default options', () => {
        cy.task('generateNotification').then(expectValidNotification);
      });

      it('generates notification with specific type', () => {
        cy.task('generateNotification', { type: 'payment' }).then((notification) => {
          expect(notification.type).to.equal('payment');
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates notifications with same core data using same seed', () => {
        const seed = 99999;
        cy.task('generateNotification', { seed }).then((n1) => {
          cy.task('generateNotification', { seed }).then((n2) => {
            expect(n1.id).to.equal(n2.id);
            expect(n1.type).to.equal(n2.type);
            expect(n1.title).to.equal(n2.title);
          });
        });
      });
    });
  });

  describe('Message Generator', () => {
    context('Basic Generation', () => {
      it('generates valid message with default options', () => {
        cy.task('generateMessage').then(expectValidMessage);
      });

      it('generates message with specific conversation ID', () => {
        const conversationId = 'conv-123';
        cy.task('generateMessage', { conversationId }).then((message) => {
          expect(message.conversationId).to.equal(conversationId);
        });
      });

      it('generates message with specific sender and receiver', () => {
        const senderId = 'sender-123';
        const receiverId = 'receiver-456';
        cy.task('generateMessage', { senderId, receiverId }).then((message) => {
          expect(message.senderId).to.equal(senderId);
          expect(message.receiverId).to.equal(receiverId);
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates messages with same core data using same seed', () => {
        const seed = 77777;
        cy.task('generateMessage', { seed }).then((m1) => {
          cy.task('generateMessage', { seed }).then((m2) => {
            expect(m1.id).to.equal(m2.id);
            expect(m1.senderId).to.equal(m2.senderId);
            expect(m1.content).to.equal(m2.content);
          });
        });
      });
    });
  });
});
