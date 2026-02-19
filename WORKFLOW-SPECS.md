# Fundraising Wizard - GHL Workflow Specifications

## Overview
These specs document all automated workflows for the FW platform. Each can be built in GHL using these exact configurations.

---

## 1. New Supporter Welcome ✅ (BUILT - needs follow-up email)
**Trigger:** Tag Added = `supporter`

**Actions:**
1. **Send Email** - "Welcome Email"
   - Subject: `You're In! Your Support Makes Magic Happen ✨`
   - Body: Welcome message with {{contact.first_name}}, what to expect, call to share

2. **Wait** - 1 day

3. **Send Email** - "How It Works" (TO ADD)
   - Subject: `Here's How Your Blanket Gets Made 🎨`
   - Body: Step-by-step process, timeline, set expectations

---

## 2. Coordinator Welcome Sequence
**Trigger:** Tag Added = `coordinator`

**Actions:**
1. **Send Email** - "Welcome Coordinator"
   - Subject: `Welcome to Fundraising Wizard! Let's Raise Some Money 🚀`
   - Body: 
     - Congratulations on starting the fundraiser
     - What happens next (design process)
     - Link to coordinator dashboard
     - Support contact info

2. **Wait** - 2 hours

3. **Send Email** - "Design Tool Introduction"
   - Subject: `Create Your Custom Blanket Design in Minutes`
   - Body:
     - Link to design app
     - Design tips
     - Example designs
     - Help resources

4. **Add Tag** - `email-sequence-welcome-complete`

---

## 3. Design Reminder Sequence
**Trigger:** Tag Added = `design-incomplete` (add when coordinator starts but doesn't finish)

**Actions:**
1. **Wait** - 24 hours

2. **If/Else** - Check if tag `design-complete` exists
   - If YES → End workflow
   - If NO → Continue

3. **Send Email** - "Finish Your Design"
   - Subject: `Your blanket design is 90% done! 🎨`
   - Body: 
     - Where they left off
     - One-click return link
     - Offer help if stuck

4. **Wait** - 48 hours

5. **If/Else** - Check tag again
   - If YES → End
   - If NO → Continue

6. **Send Email** - "Need Help With Your Design?"
   - Subject: `Quick question about your fundraiser`
   - Body:
     - Personal touch
     - Offer to help
     - Reply CTA

---

## 4. Campaign Launch Sequence
**Trigger:** Pipeline Stage Changed to "Design Complete" (or tag `admin-approved`)

**Actions:**
1. **Send Email** - "Your Campaign is LIVE!"
   - Subject: `🎉 Your Fundraiser is Live - Time to Share!`
   - Body:
     - Celebration!
     - Their unique fundraiser URL
     - Sharing tips
     - Social media templates
     - First 48 hours are crucial messaging

2. **Wait** - 2 days

3. **Send Email** - "How's It Going?"
   - Subject: `Quick check-in: How's your fundraiser doing?`
   - Body:
     - Stats if available (via custom fields)
     - Tips for getting more sales
     - Success stories

---

## 5. Supporter Order Confirmation
**Trigger:** Tag Added = `first-time-buyer` OR Opportunity Stage = "Purchased"

**Actions:**
1. **Send Email** - "Order Confirmed"
   - Subject: `Order Confirmed! 🎁 You're Amazing`
   - Body:
     - Order details (from custom fields)
     - What happens next
     - Delivery timeline
     - Share with friends CTA

---

## 6. Campaign Milestone Alerts (To Coordinator)
**Trigger:** Custom field `total_orders` changes (or use webhook)

**Logic:** Create separate workflows for each milestone or use If/Else

**Milestones:**
- 10 orders: "You hit double digits! 🔥"
- 25 orders: "25 down, keep going!"  
- 50 orders: "Halfway to hero status!"
- 100 orders: "TRIPLE DIGITS! You're crushing it!"

**Email Content Pattern:**
- Celebrate the achievement
- Show current fundraising total
- Encourage sharing for more momentum
- "What got you here won't get you there" motivation

---

## 7. Campaign End Reminder Sequence
**Trigger:** Custom Date Reminder = `campaign_end_date` minus 7 days

**Actions:**
1. **Send Email** - "7 Days Left"
   - Subject: `⏰ 7 Days Left - Final Push!`
   - Body:
     - Urgency without panic
     - Current stats
     - Last chance sharing push
     - Template messages to send

2. **Wait** - 4 days

3. **Send Email** - "3 Days Left"
   - Subject: `Final 72 Hours! 🏃`
   - Body: Urgency + stats + action items

4. **Wait** - 2 days

5. **Send Email** - "Last Day!"
   - Subject: `FINAL DAY: Campaign Ends Tonight!`
   - Body: Maximum urgency, share now messaging

---

## 8. Post-Campaign Thank You
**Trigger:** Tag Added = `campaign-ended`

**Actions:**
1. **Send Email** - "Campaign Complete!"
   - Subject: `You Did It! 🎉 Final Results Inside`
   - Body:
     - Final stats
     - Total raised
     - Number of supporters
     - What happens next (production timeline)
     - Thank you message

2. **Wait** - 3 days

3. **Send Email** - "What's Next"
   - Subject: `Your Blankets Are Being Made! Here's What to Expect`
   - Body:
     - Production timeline
     - Distribution planning
     - How to track order

---

## 9. Shipping Notification
**Trigger:** Pipeline Stage = "Shipped" (or tag `shipped`)

**Actions:**
1. **Send Email** - "Your Order Shipped!"
   - Subject: `📦 Your Blankets Are On The Way!`
   - Body:
     - Tracking number ({{contact.tracking_number}})
     - Estimated delivery
     - What to do when they arrive

---

## 10. Re-engagement (Cold Lead)
**Trigger:** Tag Added = `cold-30-days`

**Actions:**
1. **Send Email** - "We Miss You"
   - Subject: `Still thinking about that fundraiser?`
   - Body:
     - Soft check-in
     - Success stories
     - Easy restart CTA

2. **Wait** - 14 days

3. **If/Else** - Check engagement
   - Engaged → Remove cold tag, add `re-engaged`
   - Not engaged → Continue

4. **Send Email** - "Final Reach Out"
   - Subject: `One last thing...`
   - Body:
     - Value prop reminder
     - No pressure
     - Unsubscribe option prominent

---

## Quick Reference: Tags Used

| Tag | Purpose | Trigger |
|-----|---------|---------|
| supporter | Anyone who buys | Order placed |
| coordinator | Fundraiser organizer | Signs up |
| design-complete | Finished design | Design submitted |
| admin-approved | Design approved | Admin action |
| campaign-active | Live campaign | Launch |
| campaign-ended | Finished campaign | End date |
| first-time-buyer | New customer | First order |
| shipped | Order shipped | Shipping update |
| cold-30-days | Inactive | Automation |

---

## Build Priority

1. ✅ New Supporter Welcome (partial)
2. 🔲 Coordinator Welcome
3. 🔲 Campaign Launch
4. 🔲 Order Confirmation
5. 🔲 Campaign End Reminders
6. 🔲 Post-Campaign Thank You
7. 🔲 Shipping Notification
8. 🔲 Design Reminder
9. 🔲 Re-engagement
10. 🔲 Milestone Alerts (complex)

---

*Last updated: Feb 3, 2026*
