# IncuXai MongoDB Schema

## Users
- userId (string, unique)
- role (admin, student, professional, startup, sponsor)
- name
- email (unique)
- mobile
- discordId
- avatar
- timestamps

## Teams
- teamId (string, unique)
- teamName
- category (student, professional, startup)
- leader (User ref)
- members (User refs)
- projectDetails { title, theme, techStack[], description }
- paymentStatus (pending, paid, failed, refunded)
- discordVerified
- qrTicketUrl
- timestamps

## Payments
- transactionId (string, unique)
- team (Team ref)
- amount
- status (created, paid, failed, refunded)
- razorpayOrderId
- razorpayPaymentId
- gstInvoiceUrl
- timestamps

## Submissions
- team (Team ref, unique)
- githubLink
- pptUrl
- demoVideo
- apkBuild
- submittedAt
- timestamps

## Sponsors
- name
- sponsorTier (platinum, gold, silver, community)
- logo
- links[]
- timestamps

## Announcements
- title
- content
- visibility (all, student, professional, startup, admin)
- timestamps

## Support Tickets
- ticketId (string, unique)
- user (User ref)
- category (registration, payment, technical, general)
- status (open, in_progress, resolved)
- messages[{ sender, message, createdAt }]
- timestamps

## Chatbot Logs
- user (User ref)
- message
- response
- timestamps

## Campus Ambassadors
- user (User ref, unique)
- referralCode (unique)
- points
- leaderboardRank
- timestamps

## Audit Logs
- actor (User ref)
- action
- target
- metadata
- timestamps
