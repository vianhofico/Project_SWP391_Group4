USE [TestSWP391]
GO

-- Disable constraints temporarily to avoid foreign key issues
ALTER TABLE Carts NOCHECK CONSTRAINT ALL;
ALTER TABLE PasswordResetToken NOCHECK CONSTRAINT ALL;
ALTER TABLE Posts NOCHECK CONSTRAINT ALL;
ALTER TABLE Enrollments NOCHECK CONSTRAINT ALL;
ALTER TABLE Ratings NOCHECK CONSTRAINT ALL;
ALTER TABLE Comments NOCHECK CONSTRAINT ALL;
ALTER TABLE Reports NOCHECK CONSTRAINT ALL;
ALTER TABLE OrderItems NOCHECK CONSTRAINT ALL;
ALTER TABLE Transactions NOCHECK CONSTRAINT ALL;
ALTER TABLE UserNotifications NOCHECK CONSTRAINT ALL;
ALTER TABLE CartItems NOCHECK CONSTRAINT ALL;
ALTER TABLE Scores NOCHECK CONSTRAINT ALL;

-- USERS: Check for existing IDs before inserting
SET IDENTITY_INSERT Users ON;
IF NOT EXISTS (SELECT 1 FROM Users WHERE userId = 1)
    INSERT INTO Users (userId, fullName, email, birthDate, password, role, createdAt, isActive, reportCount, imageUrl)
    VALUES (1, 'Alice Smith', 'alice@example.com', '1990-01-01', 'password1', 'USER', '2024-01-01 10:00:00', 1, 0, 'img1.jpg');
IF NOT EXISTS (SELECT 1 FROM Users WHERE userId = 2)
    INSERT INTO Users (userId, fullName, email, birthDate, password, role, createdAt, isActive, reportCount, imageUrl)
    VALUES (2, 'Bob Johnson', 'bob@example.com', '1985-05-12', 'password2', 'ADMIN', '2024-01-02 11:00:00', 1, 1, 'img2.jpg');
IF NOT EXISTS (SELECT 1 FROM Users WHERE userId = 3)
    INSERT INTO Users (userId, fullName, email, birthDate, password, role, createdAt, isActive, reportCount, imageUrl)
    VALUES (3, 'Charlie Lee', 'charlie@example.com', '1992-07-23', 'password3', 'USER', '2024-01-03 12:00:00', 1, 2, 'img3.jpg');
IF NOT EXISTS (SELECT 1 FROM Users WHERE userId = 4)
    INSERT INTO Users (userId, fullName, email, birthDate, password, role, createdAt, isActive, reportCount, imageUrl)
    VALUES (4, 'Diana King', 'diana@example.com', '1995-09-15', 'password4', 'USER', '2024-01-04 13:00:00', 0, 0, 'img4.jpg');
IF NOT EXISTS (SELECT 1 FROM Users WHERE userId = 5)
    INSERT INTO Users (userId, fullName, email, birthDate, password, role, createdAt, isActive, reportCount, imageUrl)
    VALUES (5, 'Evan Wright', 'evan@example.com', '1988-03-30', 'password5', 'USER', '2024-01-05 14:00:00', 1, 1, 'img5.jpg');
SET IDENTITY_INSERT Users OFF;

-- POSTTOPICS: Check for existing IDs
SET IDENTITY_INSERT PostTopics ON;
IF NOT EXISTS (SELECT 1 FROM PostTopics WHERE postTopicId = 1)
    INSERT INTO PostTopics (postTopicId, name, createdAt) VALUES (1, 'General', '2024-01-01 10:00:00');
IF NOT EXISTS (SELECT 1 FROM PostTopics WHERE postTopicId = 2)
    INSERT INTO PostTopics (postTopicId, name, createdAt) VALUES (2, 'Help', '2024-01-02 10:00:00');
IF NOT EXISTS (SELECT 1 FROM PostTopics WHERE postTopicId = 3)
    INSERT INTO PostTopics (postTopicId, name, createdAt) VALUES (3, 'Feedback', '2024-01-03 10:00:00');
IF NOT EXISTS (SELECT 1 FROM PostTopics WHERE postTopicId = 4)
    INSERT INTO PostTopics (postTopicId, name, createdAt) VALUES (4, 'News', '2024-01-04 10:00:00');
IF NOT EXISTS (SELECT 1 FROM PostTopics WHERE postTopicId = 5)
    INSERT INTO PostTopics (postTopicId, name, createdAt) VALUES (5, 'Off-topic', '2024-01-05 10:00:00');
SET IDENTITY_INSERT PostTopics OFF;

-- COURSES: Check for existing IDs
SET IDENTITY_INSERT Courses ON;
IF NOT EXISTS (SELECT 1 FROM Courses WHERE courseId = 1)
    INSERT INTO Courses (courseId, title, description, price, createdAt, rating, imageUrl, videoTrailerUrl, status)
    VALUES (1, 'Java Basics', 'Intro to Java', 100, '2024-01-01 10:00:00', 4.5, 'java.jpg', 'trailer1.mp4', 1);
IF NOT EXISTS (SELECT 1 FROM Courses WHERE courseId = 2)
    INSERT INTO Courses (courseId, title, description, price, createdAt, rating, imageUrl, videoTrailerUrl, status)
    VALUES (2, 'Spring Boot', 'Spring Boot course', 120, '2024-01-02 10:00:00', 4.7, 'spring.jpg', 'trailer2.mp4', 1);
IF NOT EXISTS (SELECT 1 FROM Courses WHERE courseId = 3)
    INSERT INTO Courses (courseId, title, description, price, createdAt, rating, imageUrl, videoTrailerUrl, status)
    VALUES (3, 'SQL Mastery', 'Learn SQL', 90, '2024-01-03 10:00:00', 4.2, 'sql.jpg', 'trailer3.mp4', 1);
IF NOT EXISTS (SELECT 1 FROM Courses WHERE courseId = 4)
    INSERT INTO Courses (courseId, title, description, price, createdAt, rating, imageUrl, videoTrailerUrl, status)
    VALUES (4, 'Web Dev', 'Frontend basics', 110, '2024-01-04 10:00:00', 4.6, 'web.jpg', 'trailer4.mp4', 0);
IF NOT EXISTS (SELECT 1 FROM Courses WHERE courseId = 5)
    INSERT INTO Courses (courseId, title, description, price, createdAt, rating, imageUrl, videoTrailerUrl, status)
    VALUES (5, 'Algorithms', 'Algo course', 130, '2024-01-05 10:00:00', 4.8, 'algo.jpg', 'trailer5.mp4', 1);
SET IDENTITY_INSERT Courses OFF;

-- CARTS: Insert only if userId exists
SET IDENTITY_INSERT Carts ON;
IF EXISTS (SELECT 1 FROM Users WHERE userId = 1) AND NOT EXISTS (SELECT 1 FROM Carts WHERE cartId = 1)
    INSERT INTO Carts (cartId, createdAt, userId) VALUES (1, '2024-01-01 10:00:00', 1);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 2) AND NOT EXISTS (SELECT 1 FROM Carts WHERE cartId = 2)
    INSERT INTO Carts (cartId, createdAt, userId) VALUES (2, '2024-01-02 10:00:00', 2);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 3) AND NOT EXISTS (SELECT 1 FROM Carts WHERE cartId = 3)
    INSERT INTO Carts (cartId, createdAt, userId) VALUES (3, '2024-01-03 10:00:00', 3);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 4) AND NOT EXISTS (SELECT 1 FROM Carts WHERE cartId = 4)
    INSERT INTO Carts (cartId, createdAt, userId) VALUES (4, '2024-01-04 10:00:00', 4);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 5) AND NOT EXISTS (SELECT 1 FROM Carts WHERE cartId = 5)
    INSERT INTO Carts (cartId, createdAt, userId) VALUES (5, '2024-01-05 10:00:00', 5);
SET IDENTITY_INSERT Carts OFF;

-- NOTIFICATIONS
SET IDENTITY_INSERT Notifications ON;
IF NOT EXISTS (SELECT 1 FROM Notifications WHERE notificationId = 1)
    INSERT INTO Notifications (notificationId, title, content, createdAt) VALUES (1, 'Welcome', 'Welcome to the platform!', '2024-01-01 10:00:00');
IF NOT EXISTS (SELECT 1 FROM Notifications WHERE notificationId = 2)
    INSERT INTO Notifications (notificationId, title, content, createdAt) VALUES (2, 'Update', 'System update tonight.', '2024-01-02 10:00:00');
IF NOT EXISTS (SELECT 1 FROM Notifications WHERE notificationId = 3)
    INSERT INTO Notifications (notificationId, title, content, createdAt) VALUES (3, 'Reminder', 'Don''t forget to enroll!', '2024-01-03 10:00:00');
IF NOT EXISTS (SELECT 1 FROM Notifications WHERE notificationId = 4)
    INSERT INTO Notifications (notificationId, title, content, createdAt) VALUES (4, 'Alert', 'New course available.', '2024-01-04 10:00:00');
IF NOT EXISTS (SELECT 1 FROM Notifications WHERE notificationId = 5)
    INSERT INTO Notifications (notificationId, title, content, createdAt) VALUES (5, 'Survey', 'Please give feedback.', '2024-01-05 10:00:00');
SET IDENTITY_INSERT Notifications OFF;

-- PASSWORD RESET TOKEN: Insert only if userId exists
SET IDENTITY_INSERT PasswordResetToken ON;
IF EXISTS (SELECT 1 FROM Users WHERE userId = 1) AND NOT EXISTS (SELECT 1 FROM PasswordResetToken WHERE id = 1)
    INSERT INTO PasswordResetToken (id, token, user_userId, expiryDate) VALUES (1, 'token1', 1, '2024-02-01 10:00:00');
IF EXISTS (SELECT 1 FROM Users WHERE userId = 2) AND NOT EXISTS (SELECT 1 FROM PasswordResetToken WHERE id = 2)
    INSERT INTO PasswordResetToken (id, token, user_userId, expiryDate) VALUES (2, 'token2', 2, '2024-02-02 10:00:00');
IF EXISTS (SELECT 1 FROM Users WHERE userId = 3) AND NOT EXISTS (SELECT 1 FROM PasswordResetToken WHERE id = 3)
    INSERT INTO PasswordResetToken (id, token, user_userId, expiryDate) VALUES (3, 'token3', 3, '2024-02-03 10:00:00');
IF EXISTS (SELECT 1 FROM Users WHERE userId = 4) AND NOT EXISTS (SELECT 1 FROM PasswordResetToken WHERE id = 4)
    INSERT INTO PasswordResetToken (id, token, user_userId, expiryDate) VALUES (4, 'token4', 4, '2024-02-04 10:00:00');
IF EXISTS (SELECT 1 FROM Users WHERE userId = 5) AND NOT EXISTS (SELECT 1 FROM PasswordResetToken WHERE id = 5)
    INSERT INTO PasswordResetToken (id, token, user_userId, expiryDate) VALUES (5, 'token5', 5, '2024-02-05 10:00:00');
SET IDENTITY_INSERT PasswordResetToken OFF;

-- POSTS: Insert only if userId and postTopicId exist
SET IDENTITY_INSERT Posts ON;
IF EXISTS (SELECT 1 FROM Users WHERE userId = 1) AND EXISTS (SELECT 1 FROM PostTopics WHERE postTopicId = 1) AND NOT EXISTS (SELECT 1 FROM Posts WHERE postId = 1)
    INSERT INTO Posts (postId, title, content, createdAt, status, postTopicId, userId) VALUES (1, 'First Post', 'Hello world!', '2024-01-01 10:00:00', 'ACTIVE', 1, 1);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 2) AND EXISTS (SELECT 1 FROM PostTopics WHERE postTopicId = 2) AND NOT EXISTS (SELECT 1 FROM Posts WHERE postId = 2)
    INSERT INTO Posts (postId, title, content, createdAt, status, postTopicId, userId) VALUES (2, 'Need Help', 'How to Java?', '2024-01-02 10:00:00', 'ACTIVE', 2, 2);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 3) AND EXISTS (SELECT 1 FROM PostTopics WHERE postTopicId = 3) AND NOT EXISTS (SELECT 1 FROM Posts WHERE postId = 3)
    INSERT INTO Posts (postId, title, content, createdAt, status, postTopicId, userId) VALUES (3, 'Feedback', 'Great site!', '2024-01-03 10:00:00', 'ACTIVE', 3, 3);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 4) AND EXISTS (SELECT 1 FROM PostTopics WHERE postTopicId = 4) AND NOT EXISTS (SELECT 1 FROM Posts WHERE postId = 4)
    INSERT INTO Posts (postId, title, content, createdAt, status, postTopicId, userId) VALUES (4, 'Announcement', 'New course!', '2024-01-04 10:00:00', 'ACTIVE', 4, 4);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 5) AND EXISTS (SELECT 1 FROM PostTopics WHERE postTopicId = 5) AND NOT EXISTS (SELECT 1 FROM Posts WHERE postId = 5)
    INSERT INTO Posts (postId, title, content, createdAt, status, postTopicId, userId) VALUES (5, 'Random', 'Just chatting', '2024-01-05 10:00:00', 'ACTIVE', 5, 5);
SET IDENTITY_INSERT Posts OFF;


-- CHAPTERS: Insert only if courseId exists
SET IDENTITY_INSERT Chapters ON;
IF EXISTS (SELECT 1 FROM Courses WHERE courseId = 1) AND NOT EXISTS (SELECT 1 FROM Chapters WHERE chapterId = 1)
    INSERT INTO Chapters (chapterId, title, createdAt, courseId) VALUES (1, 'Intro', '2024-01-01 10:00:00', 1);
IF EXISTS (SELECT 1 FROM Courses WHERE courseId = 2) AND NOT EXISTS (SELECT 1 FROM Chapters WHERE chapterId = 2)
    INSERT INTO Chapters (chapterId, title, createdAt, courseId) VALUES (2, 'Basics', '2024-01-02 10:00:00', 2);
IF EXISTS (SELECT 1 FROM Courses WHERE courseId = 3) AND NOT EXISTS (SELECT 1 FROM Chapters WHERE chapterId = 3)
    INSERT INTO Chapters (chapterId, title, createdAt, courseId) VALUES (3, 'Advanced', '2024-01-03 10:00:00', 3);
IF EXISTS (SELECT 1 FROM Courses WHERE courseId = 4) AND NOT EXISTS (SELECT 1 FROM Chapters WHERE chapterId = 4)
    INSERT INTO Chapters (chapterId, title, createdAt, courseId) VALUES (4, 'Practice', '2024-01-04 10:00:00', 4);
IF EXISTS (SELECT 1 FROM Courses WHERE courseId = 5) AND NOT EXISTS (SELECT 1 FROM Chapters WHERE chapterId = 5)
    INSERT INTO Chapters (chapterId, title, createdAt, courseId) VALUES (5, 'Summary', '2024-01-05 10:00:00', 5);
SET IDENTITY_INSERT Chapters OFF;

-- ORDERS: Insert only if userId exists
SET IDENTITY_INSERT Orders ON;
IF EXISTS (SELECT 1 FROM Users WHERE userId = 1) AND NOT EXISTS (SELECT 1 FROM Orders WHERE orderId = 1)
    INSERT INTO Orders (orderId, amount, createdAt, userId) VALUES (1, 100, '2024-01-01 10:00:00', 1);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 2) AND NOT EXISTS (SELECT 1 FROM Orders WHERE orderId = 2)
    INSERT INTO Orders (orderId, amount, createdAt, userId) VALUES (2, 120, '2024-01-02 10:00:00', 2);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 3) AND NOT EXISTS (SELECT 1 FROM Orders WHERE orderId = 3)
    INSERT INTO Orders (orderId, amount, createdAt, userId) VALUES (3, 90, '2024-01-03 10:00:00', 3);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 4) AND NOT EXISTS (SELECT 1 FROM Orders WHERE orderId = 4)
    INSERT INTO Orders (orderId, amount, createdAt, userId) VALUES (4, 110, '2024-01-04 10:00:00', 4);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 5) AND NOT EXISTS (SELECT 1 FROM Orders WHERE orderId = 5)
    INSERT INTO Orders (orderId, amount, createdAt, userId) VALUES (5, 130, '2024-01-05 10:00:00', 5);
SET IDENTITY_INSERT Orders OFF;

-- ENROLLMENTS: Insert only if userId and courseId exist
SET IDENTITY_INSERT Enrollments ON;
IF EXISTS (SELECT 1 FROM Users WHERE userId = 1) AND EXISTS (SELECT 1 FROM Courses WHERE courseId = 1) AND NOT EXISTS (SELECT 1 FROM Enrollments WHERE enrollmentId = 1)
    INSERT INTO Enrollments (enrollmentId, enrolledAt, progress, userId, courseId) VALUES (1, '2024-01-01 10:00:00', 0.1, 1, 1);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 2) AND EXISTS (SELECT 1 FROM Courses WHERE courseId = 2) AND NOT EXISTS (SELECT 1 FROM Enrollments WHERE enrollmentId = 2)
    INSERT INTO Enrollments (enrollmentId, enrolledAt, progress, userId, courseId) VALUES (2, '2024-01-02 10:00:00', 0.2, 2, 2);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 3) AND EXISTS (SELECT 1 FROM Courses WHERE courseId = 3) AND NOT EXISTS (SELECT 1 FROM Enrollments WHERE enrollmentId = 3)
    INSERT INTO Enrollments (enrollmentId, enrolledAt, progress, userId, courseId) VALUES (3, '2024-01-03 10:00:00', 0.3, 3, 3);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 4) AND EXISTS (SELECT 1 FROM Courses WHERE courseId = 4) AND NOT EXISTS (SELECT 1 FROM Enrollments WHERE enrollmentId = 4)
    INSERT INTO Enrollments (enrollmentId, enrolledAt, progress, userId, courseId) VALUES (4, '2024-01-04 10:00:00', 0.4, 4, 4);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 5) AND EXISTS (SELECT 1 FROM Courses WHERE courseId = 5) AND NOT EXISTS (SELECT 1 FROM Enrollments WHERE enrollmentId = 5)
    INSERT INTO Enrollments (enrollmentId, enrolledAt, progress, userId, courseId) VALUES (5, '2024-01-05 10:00:00', 0.5, 5, 5);
SET IDENTITY_INSERT Enrollments OFF;

-- RATINGS: Insert only if userId and courseId exist
SET IDENTITY_INSERT Ratings ON;
IF EXISTS (SELECT 1 FROM Users WHERE userId = 1) AND EXISTS (SELECT 1 FROM Courses WHERE courseId = 1) AND NOT EXISTS (SELECT 1 FROM Ratings WHERE ratingId = 1)
    INSERT INTO Ratings (ratingId, rating, feedback, createdAt, userId, courseId) VALUES (1, 5, 'Great!', '2024-01-01 10:00:00', 1, 1);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 2) AND EXISTS (SELECT 1 FROM Courses WHERE courseId = 2) AND NOT EXISTS (SELECT 1 FROM Ratings WHERE ratingId = 2)
    INSERT INTO Ratings (ratingId, rating, feedback, createdAt, userId, courseId) VALUES (2, 4, 'Good', '2024-01-02 10:00:00', 2, 2);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 3) AND EXISTS (SELECT 1 FROM Courses WHERE courseId = 3) AND NOT EXISTS (SELECT 1 FROM Ratings WHERE ratingId = 3)
    INSERT INTO Ratings (ratingId, rating, feedback, createdAt, userId, courseId) VALUES (3, 3, 'Okay', '2024-01-03 10:00:00', 3, 3);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 4) AND EXISTS (SELECT 1 FROM Courses WHERE courseId = 4) AND NOT EXISTS (SELECT 1 FROM Ratings WHERE ratingId = 4)
    INSERT INTO Ratings (ratingId, rating, feedback, createdAt, userId, courseId) VALUES (4, 2, 'Bad', '2024-01-04 10:00:00', 4, 4);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 5) AND EXISTS (SELECT 1 FROM Courses WHERE courseId = 5) AND NOT EXISTS (SELECT 1 FROM Ratings WHERE ratingId = 5)
    INSERT INTO Ratings (ratingId, rating, feedback, createdAt, userId, courseId) VALUES (5, 1, 'Terrible', '2024-01-05 10:00:00', 5, 5);
SET IDENTITY_INSERT Ratings OFF;

-- COMMENTS: Insert only if userId and postId exist, handle parentCommentId
SET IDENTITY_INSERT Comments ON;
IF EXISTS (SELECT 1 FROM Users WHERE userId = 1) AND EXISTS (SELECT 1 FROM Posts WHERE postId = 1) AND NOT EXISTS (SELECT 1 FROM Comments WHERE commentId = 1)
    INSERT INTO Comments (commentId, content, createdAt, userId, parentCommentId, postId) VALUES (1, 'Nice post!', '2024-01-01 10:00:00', 1, NULL, 1);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 2) AND EXISTS (SELECT 1 FROM Posts WHERE postId = 1) AND EXISTS (SELECT 1 FROM Comments WHERE commentId = 1) AND NOT EXISTS (SELECT 1 FROM Comments WHERE commentId = 2)
    INSERT INTO Comments (commentId, content, createdAt, userId, parentCommentId, postId) VALUES (2, 'Thanks!', '2024-01-02 10:00:00', 2, 1, 1);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 3) AND EXISTS (SELECT 1 FROM Posts WHERE postId = 2) AND NOT EXISTS (SELECT 1 FROM Comments WHERE commentId = 3)
    INSERT INTO Comments (commentId, content, createdAt, userId, parentCommentId, postId) VALUES (3, 'Interesting', '2024-01-03 10:00:00', 3, NULL, 2);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 4) AND EXISTS (SELECT 1 FROM Posts WHERE postId = 3) AND NOT EXISTS (SELECT 1 FROM Comments WHERE commentId = 4)
    INSERT INTO Comments (commentId, content, createdAt, userId, parentCommentId, postId) VALUES (4, 'I agree', '2024-01-04 10:00:00', 4, NULL, 3);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 5) AND EXISTS (SELECT 1 FROM Posts WHERE postId = 4) AND NOT EXISTS (SELECT 1 FROM Comments WHERE commentId = 5)
    INSERT INTO Comments (commentId, content, createdAt, userId, parentCommentId, postId) VALUES (5, 'Good luck', '2024-01-05 10:00:00', 5, NULL, 4);
SET IDENTITY_INSERT Comments OFF;

-- REPORTS: Insert only if reporterId, targetId, postId, or commentId exist
SET IDENTITY_INSERT Reports ON;
IF EXISTS (SELECT 1 FROM Users WHERE userId = 1) AND EXISTS (SELECT 1 FROM Users WHERE userId = 2) AND EXISTS (SELECT 1 FROM Posts WHERE postId = 1) AND NOT EXISTS (SELECT 1 FROM Reports WHERE reportId = 1)
    INSERT INTO Reports (reportId, content, createdAt, status, reporterId, targetId, postId, commentId) VALUES (1, 'Spam', '2024-01-01 10:00:00', 'OPEN', 1, 2, 1, NULL);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 2) AND EXISTS (SELECT 1 FROM Users WHERE userId = 3) AND EXISTS (SELECT 1 FROM Posts WHERE postId = 2) AND NOT EXISTS (SELECT 1 FROM Reports WHERE reportId = 2)
    INSERT INTO Reports (reportId, content, createdAt, status, reporterId, targetId, postId, commentId) VALUES (2, 'Abuse', '2024-01-02 10:00:00', 'CLOSED', 2, 3, 2, NULL);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 3) AND EXISTS (SELECT 1 FROM Users WHERE userId = 4) AND EXISTS (SELECT 1 FROM Comments WHERE commentId = 3) AND NOT EXISTS (SELECT 1 FROM Reports WHERE reportId = 3)
    INSERT INTO Reports (reportId, content, createdAt, status, reporterId, targetId, postId, commentId) VALUES (3, 'Offensive', '2024-01-03 10:00:00', 'OPEN', 3, 4, NULL, 3);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 4) AND EXISTS (SELECT 1 FROM Users WHERE userId = 5) AND EXISTS (SELECT 1 FROM Posts WHERE postId = 4) AND NOT EXISTS (SELECT 1 FROM Reports WHERE reportId = 4)
    INSERT INTO Reports (reportId, content, createdAt, status, reporterId, targetId, postId, commentId) VALUES (4, 'Duplicate', '2024-01-04 10:00:00', 'OPEN', 4, 5, 4, NULL);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 5) AND EXISTS (SELECT 1 FROM Users WHERE userId = 1) AND EXISTS (SELECT 1 FROM Comments WHERE commentId = 5) AND NOT EXISTS (SELECT 1 FROM Reports WHERE reportId = 5)
    INSERT INTO Reports (reportId, content, createdAt, status, reporterId, targetId, postId, commentId) VALUES (5, 'Other', '2024-01-05 10:00:00', 'CLOSED', 5, 1, NULL, 5);
SET IDENTITY_INSERT Reports OFF;

-- ORDERITEMS: Insert only if courseId and orderId exist
SET IDENTITY_INSERT OrderItems ON;
IF EXISTS (SELECT 1 FROM Courses WHERE courseId = 1) AND EXISTS (SELECT 1 FROM Orders WHERE orderId = 1) AND NOT EXISTS (SELECT 1 FROM OrderItems WHERE orderItemId = 1)
    INSERT INTO OrderItems (orderItemId, price, courseId, orderId) VALUES (1, 100, 1, 1);
IF EXISTS (SELECT 1 FROM Courses WHERE courseId = 2) AND EXISTS (SELECT 1 FROM Orders WHERE orderId = 2) AND NOT EXISTS (SELECT 1 FROM OrderItems WHERE orderItemId = 2)
    INSERT INTO OrderItems (orderItemId, price, courseId, orderId) VALUES (2, 120, 2, 2);
IF EXISTS (SELECT 1 FROM Courses WHERE courseId = 3) AND EXISTS (SELECT 1 FROM Orders WHERE orderId = 3) AND NOT EXISTS (SELECT 1 FROM OrderItems WHERE orderItemId = 3)
    INSERT INTO OrderItems (orderItemId, price, courseId, orderId) VALUES (3, 90, 3, 3);
IF EXISTS (SELECT 1 FROM Courses WHERE courseId = 4) AND EXISTS (SELECT 1 FROM Orders WHERE orderId = 4) AND NOT EXISTS (SELECT 1 FROM OrderItems WHERE orderItemId = 4)
    INSERT INTO OrderItems (orderItemId, price, courseId, orderId) VALUES (4, 110, 4, 4);
IF EXISTS (SELECT 1 FROM Courses WHERE courseId = 5) AND EXISTS (SELECT 1 FROM Orders WHERE orderId = 5) AND NOT EXISTS (SELECT 1 FROM OrderItems WHERE orderId = 5)
    INSERT INTO OrderItems (orderItemId, price, courseId, orderId) VALUES (5, 130, 5, 5);
SET IDENTITY_INSERT OrderItems OFF;

-- EXAMS: Insert only if courseId and chapterId exist
SET IDENTITY_INSERT Exams ON;
IF EXISTS (SELECT 1 FROM Courses WHERE courseId = 1) AND EXISTS (SELECT 1 FROM Chapters WHERE chapterId = 1) AND NOT EXISTS (SELECT 1 FROM Exams WHERE examId = 1)
    INSERT INTO Exams (examId, title, createdAt, courseId, chapterId) VALUES (1, 'Quiz 1', '2024-01-01 10:00:00', 1, 1);
IF EXISTS (SELECT 1 FROM Courses WHERE courseId = 2) AND EXISTS (SELECT 1 FROM Chapters WHERE chapterId = 2) AND NOT EXISTS (SELECT 1 FROM Exams WHERE examId = 2)
    INSERT INTO Exams (examId, title, createdAt, courseId, chapterId) VALUES (2, 'Quiz 2', '2024-01-02 10:00:00', 2, 2);
IF EXISTS (SELECT 1 FROM Courses WHERE courseId = 3) AND EXISTS (SELECT 1 FROM Chapters WHERE chapterId = 3) AND NOT EXISTS (SELECT 1 FROM Exams WHERE examId = 3)
    INSERT INTO Exams (examId, title, createdAt, courseId, chapterId) VALUES (3, 'Quiz 3', '2024-01-03 10:00:00', 3, 3);
IF EXISTS (SELECT 1 FROM Courses WHERE courseId = 4) AND EXISTS (SELECT 1 FROM Chapters WHERE chapterId = 4) AND NOT EXISTS (SELECT 1 FROM Exams WHERE examId = 4)
    INSERT INTO Exams (examId, title, createdAt, courseId, chapterId) VALUES (4, 'Quiz 4', '2024-01-04 10:00:00', 4, 4);
IF EXISTS (SELECT 1 FROM Courses WHERE courseId = 5) AND EXISTS (SELECT 1 FROM Chapters WHERE chapterId = 5) AND NOT EXISTS (SELECT 1 FROM Exams WHERE examId = 5)
    INSERT INTO Exams (examId, title, createdAt, courseId, chapterId) VALUES (5, 'Quiz 5', '2024-01-05 10:00:00', 5, 5);
SET IDENTITY_INSERT Exams OFF;

-- SCORES: Insert only if userId and examId exist
SET IDENTITY_INSERT Scores ON;
IF EXISTS (SELECT 1 FROM Users WHERE userId = 1) AND EXISTS (SELECT 1 FROM Exams WHERE examId = 1) AND NOT EXISTS (SELECT 1 FROM Scores WHERE scoreId = 1)
    INSERT INTO Scores (scoreId, attemptCount, score, takenAt, userId, examId) VALUES (1, 1, 90.0, '2024-01-01 10:00:00', 1, 1);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 2) AND EXISTS (SELECT 1 FROM Exams WHERE examId = 2) AND NOT EXISTS (SELECT 1 FROM Scores WHERE scoreId = 2)
    INSERT INTO Scores (scoreId, attemptCount, score, takenAt, userId, examId) VALUES (2, 2, 85.0, '2024-01-02 10:00:00', 2, 2);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 3) AND EXISTS (SELECT 1 FROM Exams WHERE examId = 3) AND NOT EXISTS (SELECT 1 FROM Scores WHERE scoreId = 3)
    INSERT INTO Scores (scoreId, attemptCount, score, takenAt, userId, examId) VALUES (3, 1, 70.0, '2024-01-03 10:00:00', 3, 3);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 4) AND EXISTS (SELECT 1 FROM Exams WHERE examId = 4) AND NOT EXISTS (SELECT 1 FROM Scores WHERE scoreId = 4)
    INSERT INTO Scores (scoreId, attemptCount, score, takenAt, userId, examId) VALUES (4, 3, 95.0, '2024-01-04 10:00:00', 4, 4);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 5) AND EXISTS (SELECT 1 FROM Exams WHERE examId = 5) AND NOT EXISTS (SELECT 1 FROM Scores WHERE scoreId = 5)
    INSERT INTO Scores (scoreId, attemptCount, score, takenAt, userId, examId) VALUES (5, 2, 60.0, '2024-01-05 10:00:00', 5, 5);
SET IDENTITY_INSERT Scores OFF;

-- TRANSACTIONS: Insert only if userId and orderId exist
SET IDENTITY_INSERT Transactions ON;
IF EXISTS (SELECT 1 FROM Users WHERE userId = 1) AND EXISTS (SELECT 1 FROM Orders WHERE orderId = 1) AND NOT EXISTS (SELECT 1 FROM Transactions WHERE transactionId = 1)
    INSERT INTO Transactions (transactionId, amount, paidAt, userId, orderID) VALUES (1, 100, '2024-01-01 10:00:00', 1, 1);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 2) AND EXISTS (SELECT 1 FROM Orders WHERE orderId = 2) AND NOT EXISTS (SELECT 1 FROM Transactions WHERE transactionId = 2)
    INSERT INTO Transactions (transactionId, amount, paidAt, userId, orderID) VALUES (2, 120, '2024-01-02 10:00:00', 2, 2);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 3) AND EXISTS (SELECT 1 FROM Orders WHERE orderId = 3) AND NOT EXISTS (SELECT 1 FROM Transactions WHERE transactionId = 3)
    INSERT INTO Transactions (transactionId, amount, paidAt, userId, orderID) VALUES (3, 90, '2024-01-03 10:00:00', 3, 3);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 4) AND EXISTS (SELECT 1 FROM Orders WHERE orderId = 4) AND NOT EXISTS (SELECT 1 FROM Transactions WHERE transactionId = 4)
    INSERT INTO Transactions (transactionId, amount, paidAt, userId, orderID) VALUES (4, 110, '2024-01-04 10:00:00', 4, 4);
IF EXISTS (SELECT 1 FROM Users WHERE userId = 5) AND EXISTS (SELECT 1 FROM Orders WHERE orderId = 5) AND NOT EXISTS (SELECT 1 FROM Transactions WHERE transactionId = 5)
    INSERT INTO Transactions (transactionId, amount, paidAt, userId, orderID) VALUES (5, 130, '2024-01-05 10:00:00', 5, 5);
SET IDENTITY_INSERT Transactions OFF;

-- USERNOTIFICATIONS: Insert only if notificationId and userId exist
IF EXISTS (SELECT 1 FROM Notifications WHERE notificationId = 1) AND EXISTS (SELECT 1 FROM Users WHERE userId = 1)
    INSERT INTO UserNotifications (notificationId, userId) SELECT 1, 1 WHERE NOT EXISTS (SELECT 1 FROM UserNotifications WHERE notificationId = 1 AND userId = 1);
IF EXISTS (SELECT 1 FROM Notifications WHERE notificationId = 1) AND EXISTS (SELECT 1 FROM Users WHERE userId = 2)
    INSERT INTO UserNotifications (notificationId, userId) SELECT 1, 2 WHERE NOT EXISTS (SELECT 1 FROM UserNotifications WHERE notificationId = 1 AND userId = 2);
IF EXISTS (SELECT 1 FROM Notifications WHERE notificationId = 2) AND EXISTS (SELECT 1 FROM Users WHERE userId = 3)
    INSERT INTO UserNotifications (notificationId, userId) SELECT 2, 3 WHERE NOT EXISTS (SELECT 1 FROM UserNotifications WHERE notificationId = 2 AND userId = 3);
IF EXISTS (SELECT 1 FROM Notifications WHERE notificationId = 3) AND EXISTS (SELECT 1 FROM Users WHERE userId = 4)
    INSERT INTO UserNotifications (notificationId, userId) SELECT 3, 4 WHERE NOT EXISTS (SELECT 1 FROM UserNotifications WHERE notificationId = 3 AND userId = 4);
IF EXISTS (SELECT 1 FROM Notifications WHERE notificationId = 4) AND EXISTS (SELECT 1 FROM Users WHERE userId = 5)
    INSERT INTO UserNotifications (notificationId, userId) SELECT 4, 5 WHERE NOT EXISTS (SELECT 1 FROM UserNotifications WHERE notificationId = 4 AND userId = 5);

-- CARTITEMS: Insert only if cartId and courseId exist
IF EXISTS (SELECT 1 FROM Carts WHERE cartId = 1) AND EXISTS (SELECT 1 FROM Courses WHERE courseId = 1)
    INSERT INTO CartItems (cartId, courseId) SELECT 1, 1 WHERE NOT EXISTS (SELECT 1 FROM CartItems WHERE cartId = 1 AND courseId = 1);
IF EXISTS (SELECT 1 FROM Carts WHERE cartId = 2) AND EXISTS (SELECT 1 FROM Courses WHERE courseId = 2)
    INSERT INTO CartItems (cartId, courseId) SELECT 2, 2 WHERE NOT EXISTS (SELECT 1 FROM CartItems WHERE cartId = 2 AND courseId = 2);
IF EXISTS (SELECT 1 FROM Carts WHERE cartId = 3) AND EXISTS (SELECT 1 FROM Courses WHERE courseId = 3)
    INSERT INTO CartItems (cartId, courseId) SELECT 3, 3 WHERE NOT EXISTS (SELECT 1 FROM CartItems WHERE cartId = 3 AND courseId = 3);
IF EXISTS (SELECT 1 FROM Carts WHERE cartId = 4) AND EXISTS (SELECT 1 FROM Courses WHERE courseId = 4)
    INSERT INTO CartItems (cartId, courseId) SELECT 4, 4 WHERE NOT EXISTS (SELECT 1 FROM CartItems WHERE cartId = 4 AND courseId = 4);
IF EXISTS (SELECT 1 FROM Carts WHERE cartId = 5) AND EXISTS (SELECT 1 FROM Courses WHERE courseId = 5)
    INSERT INTO CartItems (cartId, courseId) SELECT 5, 5 WHERE NOT EXISTS (SELECT 1 FROM CartItems WHERE cartId = 5 AND courseId = 5);

-- Re-enable constraints
ALTER TABLE Carts CHECK CONSTRAINT ALL;
ALTER TABLE PasswordResetToken CHECK CONSTRAINT ALL;
ALTER TABLE Posts CHECK CONSTRAINT ALL;
ALTER TABLE Enrollments CHECK CONSTRAINT ALL;
ALTER TABLE Ratings CHECK CONSTRAINT ALL;
ALTER TABLE Comments CHECK CONSTRAINT ALL;
ALTER TABLE Reports CHECK CONSTRAINT ALL;
ALTER TABLE OrderItems CHECK CONSTRAINT ALL;
ALTER TABLE Transactions CHECK CONSTRAINT ALL;
ALTER TABLE UserNotifications CHECK CONSTRAINT ALL;
ALTER TABLE CartItems CHECK CONSTRAINT ALL;
ALTER TABLE Scores CHECK CONSTRAINT ALL;
GO

-- COURSE-TOPIC JOIN TABLE
INSERT INTO course_topic(course_id, topic_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(3, 3),
(4, 4),
(5, 5);