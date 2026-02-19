# PRD: Fundraising Wizard Portal Template Setup

## Overview

This document provides complete specifications for setting up the **Fundraising Wizard AI** GHL sub-account as the master template. Once complete, this account will be snapshotted and used to create new fundraiser portal sub-accounts automatically.

**Template Location:** Fundraising Wizard AI
**Location ID:** `w1xxDqpnMdTnJkLuuWVy`
**Purpose:** Master template for all fundraiser customer portals

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FUNDRAISING WIZARD ECOSYSTEM                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  DESIGN APPLICATION (BDP - Blanket Designer Pro)                            │
│  Location: design.fundraisingwizard.com                                     │
│  Tech: React/Vite on Vercel                                                 │
│  GHL Account: Fundraising Wizard HQ (HBeyqt9NPABBF99E39nt)                 │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   Design    │  │   Customer  │  │   Admin     │  │  Contract   │       │
│  │  Generator  │─▶│   Review    │─▶│   Review    │─▶│  & Payment  │       │
│  │   (AI)      │  │   Page      │  │   Page      │  │   Page      │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └──────┬──────┘       │
│                                                              │              │
│  Webhooks: DESIGN_GENERATED, CUSTOMER_APPROVED,             │              │
│            CUSTOMER_REVISION, REVISION_COMPLETE              │              │
└──────────────────────────────────────────────────────────────┼──────────────┘
                                                               │
                                              Contract Signed + Payment Complete
                                                               │
                                                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  LAUNCH SERVICE ✅ BUILT                                                    │
│  Location: api/ghl/launch.ts (Vercel Serverless Function)                  │
│  Client: services/launchService.ts                                         │
│                                                                             │
│  Triggered by: CONTRACT_SIGNED webhook OR direct API call                   │
│                                                                             │
│  Actions (all implemented):                                                 │
│  ✅ 1. Create new GHL sub-account via API (locations.write)                │
│  ✅ 2. Apply snapshot template (via snapshotId parameter)                  │
│  ✅ 3. Update Location custom fields with org/campaign data               │
│  ✅ 4. Create coordinator as Contact (for CRM/communications)              │
│  ✅ 5. Create coordinator as User (for dashboard login)                    │
│  ⏳ 6. Send coordinator invite email (GHL handles automatically)           │
│  ⏳ 7. Configure subdomain (manual - domain API TBD)                       │
│  ✅ 8. Set campaign_status = 'active'                                      │
│  ✅ 9. Return portal URLs to design app                                    │
│  ✅ 10. FUNDRAISER_LAUNCHED webhook ready in webhookService.ts             │
└─────────────────────────────────────────────────────────────────────────────┘
                                                               │
                                                               │ API: Create Location
                                                               │ API: Update Custom Fields
                                                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  GHL AGENCY ACCOUNT                                                         │
│  Company ID: tLXs0rIlNfbmoVfOJSU3                                          │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  TEMPLATE: Fundraising Wizard AI (w1xxDqpnMdTnJkLuuWVy)            │   │
│  │  • 72 Custom Fields                                                 │   │
│  │  • 2 Pipelines (Fundraiser Campaign, Coordinator Journey)          │   │
│  │  • 10 Workflows                                                     │   │
│  │  • 10 Email Templates                                               │   │
│  │  • 5 Funnel Pages                                                   │   │
│  │  ──────────────────────────────────────────────────────────────    │   │
│  │  ▼ SNAPSHOT ▼                                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                          │                                                  │
│                          │ Cloned for each new fundraiser                  │
│                          ▼                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│  │ Lincoln Band    │  │ St Mary's Soccer│  │ Camp Sunshine   │  ...       │
│  │ Fundraiser      │  │ Fundraiser      │  │ Fundraiser      │            │
│  │ (sub-account)   │  │ (sub-account)   │  │ (sub-account)   │            │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Each sub-account provides:
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  FUNDRAISER COORDINATOR PORTAL (per org)                                    │
│  Access: app.gohighlevel.com or white-labeled admin.fundraisingwizard.com  │
│                                                                             │
│  Features for Coordinator:                                                  │
│  • Sales Dashboard & Analytics                                             │
│  • Order Management & Fulfillment Tracking                                 │
│  • CRM - Supporter Contacts                                                │
│  • Email/SMS Campaign Tools                                                │
│  • Mobile App (POS capability)                                             │
│  • Reporting & Goal Tracking                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Serves
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PUBLIC FUNDRAISER PAGES (SEO Optimized)                                    │
│                                                                             │
│  OPTION A: Path-Based on Main Domain (RECOMMENDED FOR SEO)                 │
│  ─────────────────────────────────────────────────────────                 │
│  URL: fundraisingwizard.com/fundraisers/lincoln-band                       │
│  Tech: Next.js app on Vercel, fetches data from GHL via API                │
│  Benefit: All pages build main domain authority (programmatic SEO)         │
│                                                                             │
│  OPTION B: GHL Funnel Pages (Simpler, Less SEO Benefit)                    │
│  ─────────────────────────────────────────────────────────                 │
│  URL: lincoln-band.fundraisingwizard.com (subdomain)                       │
│  Tech: GHL's built-in funnel/website builder                               │
│  Benefit: Faster to implement, all within GHL                              │
│                                                                             │
│  Pages:                                                                     │
│  • Fundraiser Landing Page (org info, designs, progress)                   │
│  • Product Selection / Shop                                                │
│  • Cart                                                                     │
│  • Checkout (Stripe integration)                                           │
│  • Order Confirmation / Thank You                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Supporters purchase
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PAYMENT & ORDER PROCESSING                                                 │
│                                                                             │
│  • Stripe handles payment processing                                        │
│  • Order data flows back to GHL sub-account                                │
│  • Triggers workflows: Order Confirmation, Update Totals                   │
│  • Coordinator sees real-time dashboard updates                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Summary

```
DESIGN APP                    LAUNCH SERVICE               GHL PORTAL
──────────────────────────────────────────────────────────────────────────────

1. Customer submits
   design request
        │
        ▼
2. AI generates designs
        │
        ▼
3. Customer reviews,
   requests revisions
        │
        ▼
4. Admin handles revisions
        │
        ▼
5. Customer approves
   final design
        │
        ▼
6. Contract + Payment ────────▶ 7. Webhook triggers
   completed                       Launch Service
                                        │
                                        ▼
                               8. Create GHL sub-account
                                  from snapshot
                                        │
                                        ▼
                               9. Map & transfer ─────────▶ 10. Sub-account
                                  72 custom fields             created with
                                        │                      all org data
                                        ▼                           │
                               11. Return portal URLs               ▼
                                        │                   12. Coordinator
                                        ▼                       receives login
                               12. Store URLs in                    │
                                   design app GHL                   ▼
                                        │                   13. Campaign goes
                                        ▼                       LIVE
                               13. Notify customer
                                   "Your portal is ready!"
```

### GHL Accounts Overview

| Account | Location ID | Purpose | API Access |
|---------|-------------|---------|------------|
| **Fundraising Wizard HQ** | `HBeyqt9NPABBF99E39nt` | Design app operations, customer journey | Webhooks |
| **Fundraising Wizard AI** | `w1xxDqpnMdTnJkLuuWVy` | **TEMPLATE** - snapshot this for new portals | Template source |
| **000 - FW School Template** | `zcN06R1IQP4T4uiCjTM8` | Legacy/backup template | - |
| **[New Fundraiser]** | (created via API) | Individual fundraiser portal | Full CRUD |

### API Credentials & Environment Variables

**Required Environment Variables for Launch Service (set in Vercel):**

| Variable | Value | Purpose |
|----------|-------|---------|
| `GHL_API_KEY` | `pit-9302bc57-****-****-****-************` | Agency API token with locations.write, contacts.write, users.write |
| `GHL_COMPANY_ID` | `tLXs0rIlNfbmoVfOJSU3` | Agency/Company ID |
| `GHL_SNAPSHOT_ID` | `⚠️ TBD - create after template complete` | Snapshot ID of Fundraising Wizard AI template |

**eSignatures.io Integration (for contracts):**

| Variable | Value | Purpose |
|----------|-------|---------|
| `ESIGNATURES_API_TOKEN` | `⚠️ TBD - get from esignatures.io dashboard` | API token for contract creation |

**Status:**
- ✅ `GHL_COMPANY_ID` - Known: `tLXs0rIlNfbmoVfOJSU3`
- ⚠️ `GHL_API_KEY` - Need to set in Vercel (get from GHL Agency Settings → API Keys)
- ⚠️ `GHL_SNAPSHOT_ID` - **Blocked: Waiting for Hal to complete template setup**
- ⚠️ `ESIGNATURES_API_TOKEN` - Need to set after signing up at esignatures.io

### Key Integration Points

1. **Design App → Launch Service**
   - Webhook: `CONTRACT_SIGNED`
   - Payload: All mapped fields (see Section 2)

2. **Launch Service → GHL API**
   - `POST /locations` - Create sub-account from snapshot
   - `PUT /locations/:id/customFields` - Set location-level fields (org data)
   - `POST /locations/:id/contacts` - Create coordinator contact
   - `POST /users` - Create user account for coordinator login
   - `POST /users/:id/invite` - Send login invite email

3. **GHL Portal → Public Pages**
   - API or direct GHL pages
   - Real-time data for progress bars, inventory

4. **Public Pages → GHL Portal**
   - Order submissions
   - Contact creation for supporters
   - Payment confirmations

---

## Architecture Decisions & Clarifications

### Decision 1: Location vs Contact Custom Fields

**Issue:** The original PRD had all custom fields as Contact fields, which would duplicate org data on every supporter contact.

**Resolution:** Split fields into two categories:

| Field Type | Stored On | Examples | Why |
|------------|-----------|----------|-----|
| **Location Custom Fields** | Sub-account level | Org name, logo, colors, campaign settings, design URLs, pricing | Shared across all contacts, no duplication |
| **Contact Custom Fields** | Individual contacts | Order details, supporter-specific data | Unique per supporter |

**Location Custom Fields (Campaign-Wide):**
- Organization & Branding (10 fields)
- Approved Design URLs (13 fields)
- Product & Pricing (10 fields)
- Campaign Settings (6 fields)
- Sales Tracking/Totals (5 fields)
- Fulfillment Status (5 fields)
- Portal URLs (4 fields)

**Contact Custom Fields (Per-Supporter):**
- Order line items
- Payment status
- Shipping address
- Delivery tracking

**Note:** GHL Location Custom Fields are set via: `PUT /locations/:locationId/customFields`

---

### Decision 2: Coordinator Portal Access

**Issue:** GHL requires creating a User (not just a Contact) for dashboard login.

**Resolution:** Launch Service must include these steps:

```
Launch Service Steps (Updated):
───────────────────────────────
1. Create GHL sub-account via API
2. Apply snapshot template
3. Update Location custom fields with org data
4. Create coordinator as Contact (for CRM/communications)
5. ★ NEW: Create coordinator as User (for dashboard login)
   - POST /users with coordinator email
   - Assign role: "Admin" or custom role
   - locationIds: [new location ID]
6. ★ NEW: Send password reset / invite email
   - POST /users/:userId/send-invite (or similar)
7. Return portal URLs + login instructions
```

**API Calls Required:**
- `POST /locations` - Create sub-account
- `PUT /locations/:id/customFields` - Set location fields
- `POST /locations/:id/contacts` - Create coordinator contact
- `POST /users` - Create user account for login
- User invite email (may be automatic or via API)

---

### Decision 3: Order/Payment Storage

**Issue:** Where do orders live? GHL native store vs external?

**Resolution:** Use **GHL's Native Payments/Store** for MVP (Option B approach)

| Approach | Pros | Cons |
|----------|------|------|
| **GHL Native Store** ✓ | Built-in, no custom code, works with funnels | Less flexibility |
| External Stripe + Webhooks | Full control, custom checkout | More development |

**For MVP:**
- Use GHL's built-in Payments integration (connects to Stripe)
- Orders appear in GHL's Payments dashboard
- Contacts auto-tagged and pipelined on purchase
- Supporter contact fields track their order status

**Contact Fields for Order Tracking:**
| Field | Type | Description |
|-------|------|-------------|
| `order_total` | NUMERICAL | Total amount paid |
| `order_quantity` | NUMERICAL | Items purchased |
| `order_products` | TEXT | Product list (blanket, towel, etc.) |
| `order_date` | DATE | Purchase date |
| `order_status` | DROPDOWN | pending, paid, shipped, delivered |
| `shipping_address` | LARGE_TEXT | Delivery address |

---

### Decision 4: Public Pages Approach

**Issue:** PRD listed two options but didn't choose.

**Resolution:** **Start with Option B (GHL Funnels), migrate to Option A later**

```
PHASE 1 (MVP): GHL Funnels
──────────────────────────
URL: lincoln-band.fundraisingwizard.com (subdomain)
- Faster to implement
- All within GHL ecosystem
- Native checkout/payments
- Less custom development

PHASE 2 (Future): Next.js on Main Domain
────────────────────────────────────────
URL: fundraisingwizard.com/fundraisers/lincoln-band
- Full SEO benefit (programmatic SEO)
- Custom design freedom
- Build after validating MVP works
- Requires: API to fetch data from GHL, custom checkout
```

**Why this order:**
1. Validate the business model with GHL funnels first
2. Build SEO version when you have paying customers
3. Competitor has 14k pages - you'll catch up once you have customers generating content

---

### Decision 5: DNS/Domain Setup

**Issue:** How do subdomains get configured?

**Resolution:** **Wildcard DNS + Manual GHL Domain Assignment (for now)**

**DNS Setup (one-time):**
```
*.fundraisingwizard.com  →  CNAME  →  [GHL's domain target]
```

This routes ALL subdomains to GHL. Then in each sub-account:
- Settings → Domains → Add Custom Domain
- Enter: `{org-slug}.fundraisingwizard.com`
- GHL handles SSL automatically

**Automation Options:**
1. **Manual (MVP):** Admin adds domain in GHL UI after launch
2. **Semi-Auto:** Launch Service returns instructions, coordinator clicks link
3. **Full Auto:** GHL API for domain management (if available - needs research)

**GHL Domain API (to investigate):**
```
POST /locations/:locationId/customDomains  (hypothetical)
{
  "domain": "lincoln-band.fundraisingwizard.com",
  "type": "funnel"
}
```

---

### Decision 6: Implementation Priority

**Recommended Build Order:**

```
PRIORITY 1 (Foundation)
───────────────────────
□ Location custom fields (campaign-wide data)
□ Contact custom fields (order tracking)
□ 2 Pipelines
□ Basic tags

PRIORITY 2 (Test Snapshot)
──────────────────────────
□ Create snapshot of template
□ Test: Create sub-account from snapshot via API
□ Test: Update location custom fields via API
□ Verify all fields transfer correctly

PRIORITY 3 (Core Workflows)
───────────────────────────
□ New Supporter Welcome
□ Order Confirmation
□ Order Shipped

PRIORITY 4 (Funnel Pages)
─────────────────────────
□ Landing page with dynamic fields
□ Product page
□ Checkout (GHL payments)
□ Thank you page

PRIORITY 5 (Remaining Workflows)
────────────────────────────────
□ Campaign reminders (7 day, 3 day, last day)
□ Cart abandonment
□ Coordinator daily summary
□ Milestones
```

---

## IMPLEMENTATION STATUS (Updated 2026-02-06)

### What's BUILT in Code (BDP V2.4)

| Component | File | Status | Notes |
|-----------|------|--------|-------|
| **Launch Service API** | `api/ghl/launch.ts` | ✅ Complete | Creates sub-account, sets custom fields, creates user |
| **Launch Service Client** | `services/launchService.ts` | ✅ Complete | Frontend wrapper to call API |
| **eSignatures Contract API** | `api/contracts/create.ts` | ✅ Complete | Creates HTML contracts with embedded designs |
| **Contract Webhook Handler** | `api/contracts/webhook.ts` | ✅ Complete | Handles signature events, triggers launch |
| **Contract Status API** | `api/contracts/status.ts` | ✅ Complete | Checks contract signing status |
| **Webhook Service** | `services/webhookService.ts` | ✅ Complete | All 14 webhook types defined |
| **GHL Field Mapping** | `services/ghlFieldMapping.ts` | ✅ Complete | Maps app state to GHL fields |
| **Success Pages** | `pages/LaunchSuccess.tsx` | ✅ Complete | Pre-sale launch celebration |
| **Payment/Contract Page** | `pages/PaymentContract.tsx` | ✅ Complete | Contract signing + payment flow |

### What's BLOCKED (Waiting for Dependencies)

| Blocker | What's Waiting | Action Required |
|---------|---------------|-----------------|
| **GHL_SNAPSHOT_ID** | Launch Service can't apply template | Hal must complete GHL template, create snapshot, provide ID |
| **ESIGNATURES_API_TOKEN** | Contract creation disabled | Sign up at esignatures.io, get API token |
| **GHL_API_KEY** | All GHL API calls | Configure in Vercel env vars |
| **Stripe Integration** | Credit card payments | Stripe checkout integration (placeholder in code) |

### What HAL Must Build in GHL Template (Fundraising Wizard AI)

This is the critical path. The Launch Service code is ready, but it needs a properly configured GHL template to clone.

---

## GHL TEMPLATE SETUP REQUIREMENTS

**Template Location:** Fundraising Wizard AI
**Location ID:** `w1xxDqpnMdTnJkLuuWVy`
**Purpose:** Master template - will be snapshotted for new fundraisers

### Step 1: Create Location Custom Fields (72 Fields)

These MUST be created as **Location Custom Fields** (not Contact fields) in:
**Settings → Custom Fields → Location**

The Launch Service at `api/ghl/launch.ts` expects these exact field keys:

```javascript
// From api/ghl/launch.ts lines 223-306
const locationCustomFields = {
  // Organization & Branding (10 fields)
  organization_name: string,          // "Lincoln High School"
  organization_type: string,          // "school" | "sports_team" | "church" | "camp" | "club" | "other"
  organization_slug: string,          // "lincoln-high-school" (URL-safe, auto-generated)
  logo_url: string,                   // Cloudinary URL to org logo
  mascot_name: string,                // "Eagles"
  brand_color_primary: string,        // "#003366" (hex)
  brand_color_secondary: string,      // "#FFD700" (hex)
  brand_color_accent: string,         // "#FFFFFF" (hex)
  primary_color_pantone: string,      // "PMS 289 C"
  secondary_color_pantone: string,    // "PMS 116 C"

  // Coordinator Info (5 fields)
  coordinator_name: string,           // "John Smith"
  coordinator_email: string,          // "john@school.edu"
  coordinator_phone: string,          // "(480) 555-1234"
  coordinator_role: string,           // "Band Director"
  fundraising_purpose: string,        // "New band uniforms"

  // Blanket Designs - Front (5 fields)
  design_option_1: string,            // Cloudinary URL
  design_option_2: string,
  design_option_3: string,
  design_option_4: string,
  selected_design: string,            // URL of customer's chosen design

  // Blanket Designs - Back (5 fields)
  back_design_url: string,            // Standard back design URL
  lux_back_design_url: string,        // Luxury sherpa back design URL
  lux_back_design_type: string,       // "photo" | "pattern" | "solid"
  lux_back_upload_url: string,        // Custom uploaded back image
  needs_back_design: boolean,         // true if Lux product

  // Beach Towel Designs (4 fields)
  beach_towel_design_url_1: string,
  beach_towel_design_url_2: string,
  beach_towel_design_url_3: string,
  beach_towel_design_url_4: string,

  // Rally Towel (4 fields)
  rally_towel_design_url: string,
  rally_towel_quantity: number,       // 100
  rally_towel_cost: number,           // 3.50
  rally_towel_total_cost: number,     // 350.00

  // Product & Pricing (10 fields)
  product_type: string,               // "premium_fleece" | "lux_sherpa" | "woven" | "micro_plush" | "stadium"
  product_category: string,           // "blanket" | "beach_towel" | "rally_towel"
  order_type: string,                 // "bulk_order" | "fundraiser"
  quantity: number,                   // 75
  pricing_tier: string,               // "tier_1" | "tier_2" | "tier_3"
  wholesale_price: number,            // 15.00
  retail_price: number,               // 35.00
  total_cost: number,                 // 1125.00
  projected_profit: number,           // 1500.00
  projected_revenue: number,          // 2625.00

  // Campaign Settings (6 fields)
  campaign_duration_days: number,     // 30
  campaign_start_date: string,        // "2026-02-15" (YYYY-MM-DD)
  campaign_end_date: string,          // "2026-03-17"
  fundraising_goal: number,           // 2500.00
  minimum_sales_to_activate: number,  // 25
  campaign_status: string,            // "draft" | "active" | "paused" | "completed" | "cancelled"

  // Sales Tracking (5 fields) - Initialize to 0
  total_raised: number,               // 0
  blankets_sold: number,              // 0
  beach_towels_sold: number,          // 0
  rally_towels_sold: number,          // 0
  total_orders: number,               // 0

  // Payment & Contract (6 fields)
  contract_signed: boolean,           // true
  contract_signed_date: string,       // "2026-02-06"
  payment_method: string,             // "stripe" | "check" | "invoice" | "po"
  tax_exempt: boolean,                // false
  tax_exempt_id: string,              // ""
  stripe_connected: boolean,          // false

  // Portal URLs (4 fields) - Generated by Launch Service
  fundraiser_url: string,             // "https://lincoln-band.fundraisingwizard.com"
  admin_dashboard_url: string,        // "https://app.gohighlevel.com/v2/location/xxx"
  design_app_url: string,             // "https://design.fundraisingwizard.com/?contact_id=xxx"
  order_form_url: string,             // Direct link to order form

  // Fulfillment (5 fields)
  production_status: string,          // "pending" | "in_production" | "quality_check" | "completed" | "shipped" | "delivered"
  estimated_ship_date: string,        // "2026-03-25"
  actual_ship_date: string,           // ""
  tracking_number: string,            // ""
  delivery_date: string,              // ""

  // Timestamps (3 fields) - Set by Launch Service
  launch_date: string,                // "2026-02-06"
  created_from_design_app: string,    // "2026-02-06T14:30:00Z"
  last_sync_date: string,             // ""
};
```

### Step 2: Create Contact Custom Fields (13 Fields)

These are for individual supporter/order tracking. Create in:
**Settings → Custom Fields → Contact**

| Field Name | Key | Type | Options |
|------------|-----|------|---------|
| Order Total | `order_total` | NUMERICAL | - |
| Order Quantity | `order_quantity` | NUMERICAL | - |
| Order Products | `order_products` | TEXT | - |
| Order Date | `order_date` | DATE | - |
| Order Status | `order_status` | DROPDOWN | pending, paid, processing, shipped, delivered, refunded |
| Order ID | `order_id` | TEXT | - |
| Shipping Address | `shipping_address` | LARGE_TEXT | - |
| Shipping Tracking | `shipping_tracking` | TEXT | - |
| Shipping Carrier | `shipping_carrier` | TEXT | - |
| Estimated Delivery | `estimated_delivery` | DATE | - |
| Supporter Type | `supporter_type` | DROPDOWN | parent, family, staff, alumni, community, other |
| Referred By | `referred_by` | TEXT | - |
| Student Name | `student_name` | TEXT | - |

### Step 3: Create Pipelines

#### Pipeline 1: Fundraiser Campaign (8 stages)
```
fundraiser_campaign:
  1. new_signup        → Supporter just signed up
  2. browsing          → Viewing products
  3. cart_started      → Added items to cart
  4. order_placed      → Completed purchase
  5. payment_confirmed → Payment processed
  6. in_production     → Order in manufacturing
  7. shipped           → Order shipped
  8. delivered         → Order delivered
```

#### Pipeline 2: Coordinator Journey (7 stages)
```
coordinator_journey:
  1. portal_created     → Sub-account just created
  2. setup_in_progress  → Coordinator configuring
  3. campaign_draft     → Campaign being prepared
  4. campaign_active    → Fundraiser is live
  5. campaign_ended     → Fundraiser period complete
  6. fulfillment        → Processing orders
  7. complete           → All delivered, closed
```

### Step 4: Create Tags

| Category | Tags to Create |
|----------|----------------|
| **Contact Type** | `coordinator`, `supporter`, `parent`, `staff`, `family` |
| **Order Status** | `order-pending`, `order-paid`, `order-processing`, `order-shipped`, `order-delivered`, `order-issue` |
| **Product** | `product-blanket`, `product-beach-towel`, `product-rally-towel` |
| **Campaign** | `high-performer`, `referrer`, `early-bird`, `repeat-buyer` |

### Step 5: Create Workflows with Webhook Triggers

**CRITICAL:** Each workflow needs a webhook trigger that BDP can call. Here are the webhook URLs to create:

---

## WEBHOOK TRIGGERS FOR GHL WORKFLOWS

BDP sends webhooks to GHL to trigger automations. Each workflow needs an **Inbound Webhook** trigger.

### Design App Webhooks (BDP → GHL HQ Account)

These webhooks are sent FROM BDP TO the main GHL HQ account (not the portal template):

| Webhook | Env Variable | GHL Workflow | Purpose |
|---------|--------------|--------------|---------|
| `DESIGN_SUBMISSION` | `VITE_GHL_WEBHOOK_DESIGN_SUBMISSION` | New Design Submission | Creates/updates contact, notifies admin |
| `ADMIN_APPROVAL` | `VITE_GHL_WEBHOOK_ADMIN_APPROVAL` | Admin Approves Designs | Sends customer review link email |
| `ADMIN_REVISION` | `VITE_GHL_WEBHOOK_ADMIN_REVISION` | Admin Requests Revision | Internal tracking |
| `CUSTOMER_APPROVAL` | `VITE_GHL_WEBHOOK_CUSTOMER_APPROVAL` | Customer Approves | Moves to product selection |
| `CUSTOMER_RESTART` | `VITE_GHL_WEBHOOK_CUSTOMER_RESTART` | Customer Wants Fresh | Notifies admin, sends confirmation |
| `CUSTOMER_REVISION` | `VITE_GHL_WEBHOOK_CUSTOMER_REVISION` | Customer Requests Changes | Notifies admin with revision details |
| `PRODUCT_SELECTION` | `VITE_GHL_WEBHOOK_PRODUCT_SELECTION` | Product Selected | Updates contact with product info |
| `BACK_DESIGN` | `VITE_GHL_WEBHOOK_BACK_DESIGN` | Back Design Selected | Updates Lux back design |
| `ORDER_TYPE` | `VITE_GHL_WEBHOOK_ORDER_TYPE` | Order Type Selected | bulk vs pre-sale |
| `CONTRACT_PAYMENT` | `VITE_GHL_WEBHOOK_CONTRACT_PAYMENT` | Contract + Payment | Final step before launch |
| `REVISION_COMPLETE` | `VITE_GHL_WEBHOOK_REVISION_COMPLETE` | Admin Completes Revision | Sends updated designs to customer |
| `CONTRACT_SIGNED` | `VITE_GHL_WEBHOOK_CONTRACT_SIGNED` | Contract Signed | Triggers Launch Service |
| `FUNDRAISER_LAUNCHED` | `VITE_GHL_WEBHOOK_FUNDRAISER_LAUNCHED` | Portal Created | Stores portal URLs, notifies coordinator |
| `PAYMENT_PENDING` | `VITE_GHL_WEBHOOK_PAYMENT_PENDING` | Payment Reminder | Triggers reminder email sequence |

### Portal Workflows (In Template - Cloned to Each Sub-Account)

These workflows run INSIDE each fundraiser portal sub-account:

| Workflow | Trigger | Actions |
|----------|---------|---------|
| **New Supporter Welcome** | Contact Created + Tag `supporter` | Email + SMS welcome, add to pipeline |
| **Order Confirmation** | Tag Added `order-paid` | Email confirmation, update totals |
| **Order Shipped** | Tag Added `order-shipped` | Email with tracking, update pipeline |
| **Campaign Reminder 7 Days** | Date: 7 days before `campaign_end_date` | Email non-buyers |
| **Campaign Reminder 3 Days** | Date: 3 days before `campaign_end_date` | Email non-buyers |
| **Campaign Reminder Last Day** | Date: on `campaign_end_date` | Urgent email non-buyers |
| **Cart Abandonment** | Pipeline stage `cart_started` > 2 hours | Recovery email sequence |
| **Coordinator Daily Summary** | Daily at 8:00 AM | Stats email to coordinator |
| **Campaign Launch** | Field `campaign_status` = `active` | Welcome email to coordinator |
| **Milestone Reached** | Field `total_raised` reaches 25/50/75/100% | Celebration emails |

### Setting Up Webhook Triggers in GHL

For each workflow that BDP calls, create an **Inbound Webhook** trigger:

1. Go to **Automation → Workflows**
2. Create new workflow (or edit existing)
3. Add trigger: **Inbound Webhook**
4. Copy the generated webhook URL
5. Paste into Vercel environment variable (e.g., `VITE_GHL_WEBHOOK_ADMIN_APPROVAL`)

**Example workflow setup for ADMIN_APPROVAL:**
```
Trigger: Inbound Webhook
  ↓
Action: Update Contact
  - Set admin_approved_design_1 = {{admin_approved_design_1}}
  - Set admin_approved_design_2 = {{admin_approved_design_2}}
  - Set admin_review_status = "Approved for Customer"
  ↓
Action: Add Tag
  - Tag: "admin-approved"
  ↓
Action: Remove Tag
  - Tag: "awaiting-admin-review"
  ↓
Action: Send Email
  - Template: "Your Designs Are Ready for Review"
  - Include: Customer Review URL with contact_id
```

---

## Step 6: Create Snapshot

Once ALL of the above is complete:

1. Go to **Settings → Snapshots** (in the Fundraising Wizard AI account)
2. Click **Create Snapshot**
3. Name: `Fundraiser Portal Template v1`
4. Include: Custom Fields, Pipelines, Tags, Workflows, Email Templates, Funnel Pages
5. **Copy the Snapshot ID**
6. Add to Vercel: `GHL_SNAPSHOT_ID=<snapshot-id>`

---

## Table of Contents

1. [Custom Fields](#1-custom-fields)
2. [Field Mapping (Design App → Portal)](#2-field-mapping)
3. [Pipelines & Stages](#3-pipelines--stages)
4. [Tags](#4-tags)
5. [Custom Values](#5-custom-values)
6. [Workflows & Automations](#6-workflows--automations)
7. [Email Templates](#7-email-templates)
8. [Funnel Pages](#8-funnel-pages)

---

## 1. Custom Fields

### IMPORTANT: Location vs Contact Fields

GHL has two types of custom fields:
- **Location Custom Fields:** Apply to the entire sub-account (Settings → Custom Fields → Location)
- **Contact Custom Fields:** Apply to individual contacts (Settings → Custom Fields → Contact)

**Create Location Custom Fields for:** Org data, designs, pricing, campaign settings
**Create Contact Custom Fields for:** Order details, supporter-specific data

---

### 1.A LOCATION Custom Fields (Campaign-Wide Data)

These fields are set ONCE per fundraiser and shared across all contacts. Create in **Settings → Custom Fields → Location** (or via API on location object).

### 1.1 Organization & Branding (10 fields)

| # | Field Name | Key | Type | Description |
|---|------------|-----|------|-------------|
| 1 | Organization Name | `organization_name` | TEXT | Name of the school/team/org |
| 2 | Organization Type | `organization_type` | DROPDOWN | school, sports_team, church, camp, club, other |
| 3 | Organization Slug | `organization_slug` | TEXT | URL-safe identifier (e.g., "lincoln-band") |
| 4 | Logo URL | `logo_url` | TEXT | Organization logo image URL |
| 5 | Mascot Name | `mascot_name` | TEXT | Team mascot name |
| 6 | Brand Color Primary | `brand_color_primary` | TEXT | Primary brand color (hex, e.g., #1E3A8A) |
| 7 | Brand Color Secondary | `brand_color_secondary` | TEXT | Secondary brand color (hex) |
| 8 | Brand Color Accent | `brand_color_accent` | TEXT | Accent color (hex) |
| 9 | Primary Color Pantone | `primary_color_pantone` | TEXT | Primary Pantone code for printing |
| 10 | Secondary Color Pantone | `secondary_color_pantone` | TEXT | Secondary Pantone code |

**Dropdown Options for Organization Type:**
- school
- sports_team
- church
- camp
- club
- other

---

### 1.2 Coordinator Info (5 fields)

| # | Field Name | Key | Type | Description |
|---|------------|-----|------|-------------|
| 11 | Coordinator Name | `coordinator_name` | TEXT | Fundraiser coordinator full name |
| 12 | Coordinator Email | `coordinator_email` | TEXT | Coordinator email address |
| 13 | Coordinator Phone | `coordinator_phone` | TEXT | Coordinator phone number |
| 14 | Coordinator Role | `coordinator_role` | TEXT | Role/title (e.g., "Band Director") |
| 15 | Fundraising Purpose | `fundraising_purpose` | TEXT | What funds are for (e.g., "new band uniforms") |

---

### 1.3 Blanket Designs - Front (5 fields)

| # | Field Name | Key | Type | Description |
|---|------------|-----|------|-------------|
| 16 | Design Option 1 | `design_option_1` | TEXT | Approved front design 1 URL |
| 17 | Design Option 2 | `design_option_2` | TEXT | Approved front design 2 URL |
| 18 | Design Option 3 | `design_option_3` | TEXT | Approved front design 3 URL |
| 19 | Design Option 4 | `design_option_4` | TEXT | Approved front design 4 URL |
| 20 | Selected Design | `selected_design` | TEXT | Final selected design URL (if single choice) |

---

### 1.4 Blanket Designs - Back (5 fields)

| # | Field Name | Key | Type | Description |
|---|------------|-----|------|-------------|
| 21 | Back Design URL | `back_design_url` | TEXT | Standard back design URL |
| 22 | Lux Back Design URL | `lux_back_design_url` | TEXT | Luxury back design URL |
| 23 | Lux Back Design Type | `lux_back_design_type` | TEXT | Type of lux back (photo, pattern, etc.) |
| 24 | Lux Back Upload URL | `lux_back_upload_url` | TEXT | Custom uploaded back image URL |
| 25 | Needs Back Design | `needs_back_design` | CHECKBOX | Whether back design is needed |

---

### 1.5 Beach Towel Designs (4 fields)

| # | Field Name | Key | Type | Description |
|---|------------|-----|------|-------------|
| 26 | Beach Towel Design 1 | `beach_towel_design_url_1` | TEXT | Beach towel design 1 URL |
| 27 | Beach Towel Design 2 | `beach_towel_design_url_2` | TEXT | Beach towel design 2 URL |
| 28 | Beach Towel Design 3 | `beach_towel_design_url_3` | TEXT | Beach towel design 3 URL |
| 29 | Beach Towel Design 4 | `beach_towel_design_url_4` | TEXT | Beach towel design 4 URL |

---

### 1.6 Rally Towel (4 fields)

| # | Field Name | Key | Type | Description |
|---|------------|-----|------|-------------|
| 30 | Rally Towel Design URL | `rally_towel_design_url` | TEXT | Rally towel design URL |
| 31 | Rally Towel Quantity | `rally_towel_quantity` | NUMERICAL | Rally towel order quantity |
| 32 | Rally Towel Unit Cost | `rally_towel_cost` | NUMERICAL | Cost per rally towel |
| 33 | Rally Towel Total Cost | `rally_towel_total_cost` | NUMERICAL | Total rally towel cost |

---

### 1.7 Product & Pricing (10 fields)

| # | Field Name | Key | Type | Description |
|---|------------|-----|------|-------------|
| 34 | Product Type | `product_type` | DROPDOWN | premium_fleece, lux_sherpa, woven, etc. |
| 35 | Product Category | `product_category` | DROPDOWN | blanket, beach_towel, rally_towel |
| 36 | Order Type | `order_type` | DROPDOWN | bulk_order, fundraiser |
| 37 | Quantity | `quantity` | NUMERICAL | Total blanket quantity |
| 38 | Pricing Tier | `pricing_tier` | TEXT | Price tier level |
| 39 | Wholesale Price | `wholesale_price` | NUMERICAL | Cost per unit (wholesale) |
| 40 | Retail Price | `retail_price` | NUMERICAL | Selling price per unit |
| 41 | Total Cost | `total_cost` | NUMERICAL | Total order cost |
| 42 | Projected Profit | `projected_profit` | NUMERICAL | Expected profit |
| 43 | Projected Revenue | `projected_revenue` | NUMERICAL | Expected total revenue |

**Dropdown Options for Product Type:**
- premium_fleece
- lux_sherpa
- woven
- micro_plush
- stadium

**Dropdown Options for Product Category:**
- blanket
- beach_towel
- rally_towel

**Dropdown Options for Order Type:**
- bulk_order
- fundraiser

---

### 1.8 Campaign Settings (6 fields)

| # | Field Name | Key | Type | Description |
|---|------------|-----|------|-------------|
| 44 | Campaign Start Date | `campaign_start_date` | DATE | Fundraiser start date |
| 45 | Campaign End Date | `campaign_end_date` | DATE | Fundraiser end date |
| 46 | Campaign Duration Days | `campaign_duration_days` | NUMERICAL | Length of campaign in days |
| 47 | Fundraising Goal | `fundraising_goal` | NUMERICAL | Target amount to raise ($) |
| 48 | Minimum Sales to Activate | `minimum_sales_to_activate` | NUMERICAL | Min orders before production |
| 49 | Campaign Status | `campaign_status` | DROPDOWN | draft, active, paused, completed, cancelled |

**Dropdown Options for Campaign Status:**
- draft
- active
- paused
- completed
- cancelled

---

### 1.9 Sales Tracking (5 fields)

| # | Field Name | Key | Type | Description |
|---|------------|-----|------|-------------|
| 50 | Total Raised | `total_raised` | NUMERICAL | Amount raised so far ($) |
| 51 | Blankets Sold | `blankets_sold` | NUMERICAL | Number of blankets sold |
| 52 | Beach Towels Sold | `beach_towels_sold` | NUMERICAL | Number of beach towels sold |
| 53 | Rally Towels Sold | `rally_towels_sold` | NUMERICAL | Number of rally towels sold |
| 54 | Total Orders | `total_orders` | NUMERICAL | Total number of orders |

---

### 1.10 Payment & Contract (6 fields)

| # | Field Name | Key | Type | Description |
|---|------------|-----|------|-------------|
| 55 | Contract Signed | `contract_signed` | CHECKBOX | Whether contract is signed |
| 56 | Contract Signed Date | `contract_signed_date` | DATE | Date contract was signed |
| 57 | Payment Method | `payment_method` | DROPDOWN | stripe, check, invoice, po |
| 58 | Tax Exempt | `tax_exempt` | CHECKBOX | Tax exempt status |
| 59 | Tax Exempt ID | `tax_exempt_id` | TEXT | Tax exemption certificate ID |
| 60 | Stripe Connected | `stripe_connected` | CHECKBOX | Stripe account connected |

**Dropdown Options for Payment Method:**
- stripe
- check
- invoice
- po

---

### 1.11 Portal URLs (4 fields)

| # | Field Name | Key | Type | Description |
|---|------------|-----|------|-------------|
| 61 | Fundraiser URL | `fundraiser_url` | TEXT | Public fundraiser page URL |
| 62 | Admin Dashboard URL | `admin_dashboard_url` | TEXT | Coordinator admin portal URL |
| 63 | Design App URL | `design_app_url` | TEXT | Link back to design app |
| 64 | Order Form URL | `order_form_url` | TEXT | Direct link to order form |

---

### 1.12 Fulfillment (5 fields)

| # | Field Name | Key | Type | Description |
|---|------------|-----|------|-------------|
| 65 | Production Status | `production_status` | DROPDOWN | pending, in_production, completed, shipped |
| 66 | Estimated Ship Date | `estimated_ship_date` | DATE | Expected shipping date |
| 67 | Actual Ship Date | `actual_ship_date` | DATE | Actual shipping date |
| 68 | Tracking Number | `tracking_number` | TEXT | Shipment tracking number |
| 69 | Delivery Date | `delivery_date` | DATE | Confirmed delivery date |

**Dropdown Options for Production Status:**
- pending
- in_production
- quality_check
- completed
- shipped
- delivered

---

### 1.13 Timestamps (3 fields)

| # | Field Name | Key | Type | Description |
|---|------------|-----|------|-------------|
| 70 | Launch Date | `launch_date` | DATE | When fundraiser was launched |
| 71 | Created From Design App | `created_from_design_app` | DATE | When transferred from BDP |
| 72 | Last Sync Date | `last_sync_date` | DATE | Last data sync from design app |

---

**TOTAL LOCATION CUSTOM FIELDS: 72**

---

### 1.B CONTACT Custom Fields (Per-Supporter/Order Data)

These fields are on individual Contact records. Create in **Settings → Custom Fields → Contact**.

#### Order Information (6 fields)

| # | Field Name | Key | Type | Description |
|---|------------|-----|------|-------------|
| C1 | Order Total | `order_total` | NUMERICAL | Total amount paid by supporter |
| C2 | Order Quantity | `order_quantity` | NUMERICAL | Number of items purchased |
| C3 | Order Products | `order_products` | TEXT | Products ordered (blanket, beach towel, etc.) |
| C4 | Order Date | `order_date` | DATE | Date of purchase |
| C5 | Order Status | `order_status` | DROPDOWN | pending, paid, processing, shipped, delivered |
| C6 | Order ID | `order_id` | TEXT | GHL payment/order ID for reference |

**Dropdown Options for Order Status:**
- pending
- paid
- processing
- shipped
- delivered
- refunded

#### Shipping Information (4 fields)

| # | Field Name | Key | Type | Description |
|---|------------|-----|------|-------------|
| C7 | Shipping Address | `shipping_address` | LARGE_TEXT | Full delivery address |
| C8 | Shipping Tracking | `shipping_tracking` | TEXT | Tracking number |
| C9 | Shipping Carrier | `shipping_carrier` | TEXT | USPS, UPS, FedEx, etc. |
| C10 | Estimated Delivery | `estimated_delivery` | DATE | Expected delivery date |

#### Supporter Metadata (3 fields)

| # | Field Name | Key | Type | Description |
|---|------------|-----|------|-------------|
| C11 | Supporter Type | `supporter_type` | DROPDOWN | parent, family, staff, community |
| C12 | Referred By | `referred_by` | TEXT | Who referred this supporter |
| C13 | Student Name | `student_name` | TEXT | Associated student (if applicable) |

**Dropdown Options for Supporter Type:**
- parent
- family
- staff
- alumni
- community
- other

---

**TOTAL CONTACT CUSTOM FIELDS: 13**

**GRAND TOTAL: 85 Custom Fields (72 Location + 13 Contact)**

---

## 2. Field Mapping

This section defines how data flows from the **BDP Design App** to the **Portal Sub-Account**.

### 2.1 Mapping Table: Design App → Portal

| Design App Field (BDP/GHL HQ) | Portal Field | Notes |
|-------------------------------|--------------|-------|
| `contact.firstName` + `contact.lastName` | `coordinator_name` | Combined |
| `contact.email` | `coordinator_email` | Direct |
| `contact.phone` | `coordinator_phone` | Direct |
| `organization_team_identifier` | `organization_name` | Direct |
| (derived from org name) | `organization_slug` | URL-safe slug generated |
| `logo_url` | `logo_url` | Direct |
| `mascot_name` | `mascot_name` | Direct |
| `brand_color_primary` | `brand_color_primary` | Direct |
| `brand_color_secondary` | `brand_color_secondary` | Direct |
| `brand_color_accent` | `brand_color_accent` | Direct |
| `primary_color_pantone` | `primary_color_pantone` | Direct |
| `secondary_color_pantone` | `secondary_color_pantone` | Direct |
| `design_option_1` | `design_option_1` | Direct (approved design URL) |
| `design_option_2` | `design_option_2` | Direct |
| `design_option_3` | `design_option_3` | Direct |
| `design_option_4` | `design_option_4` | Direct |
| `selected_design` | `selected_design` | Direct |
| `back_design_url` | `back_design_url` | Direct |
| `lux_back_design_url` | `lux_back_design_url` | Direct |
| `lux_back_design_type` | `lux_back_design_type` | Direct |
| `needs_back_design` | `needs_back_design` | Direct |
| `beach_towel_design_url_1` | `beach_towel_design_url_1` | Direct |
| `beach_towel_design_url_2` | `beach_towel_design_url_2` | Direct |
| `beach_towel_design_url_3` | `beach_towel_design_url_3` | Direct |
| `beach_towel_design_url_4` | `beach_towel_design_url_4` | Direct |
| `rally_towel_design_url` | `rally_towel_design_url` | Direct |
| `rally_towel_quantity` | `rally_towel_quantity` | Direct |
| `rally_towel_cost` | `rally_towel_cost` | Direct |
| `rally_towel_total_cost` | `rally_towel_total_cost` | Direct |
| `product_type` | `product_type` | Direct |
| `product_category` | `product_category` | Direct |
| `order_type` | `order_type` | Direct |
| `quantity` | `quantity` | Direct |
| `pricing_tier` | `pricing_tier` | Direct |
| `wholesale_price` | `wholesale_price` | Direct |
| `retail_price` | `retail_price` | Direct |
| `total_cost` | `total_cost` | Direct |
| `projected_profit` | `projected_profit` | Direct |
| `projected_revenue` | `projected_revenue` | Calculated: quantity × retail_price |
| `campaign_duration_days` | `campaign_duration_days` | Direct |
| `campaign_start_date` | `campaign_start_date` | Direct or calculated |
| `campaign_end_date` | `campaign_end_date` | Calculated: start + duration |
| `minimum_sales_to_activate` | `minimum_sales_to_activate` | Direct |
| `contract_signed` | `contract_signed` | Direct (trigger for launch) |
| `tax_exempt` | `tax_exempt` | Direct |
| `payment_method` | `payment_method` | Direct |

### 2.2 Fields Generated by Launch Service

These fields are NOT mapped from design app but generated during launch:

| Field | Generated Value |
|-------|-----------------|
| `organization_slug` | Slugified from organization_name |
| `fundraiser_url` | `https://fundraisingwizard.com/fundraisers/{slug}` |
| `admin_dashboard_url` | GHL sub-account login URL |
| `design_app_url` | `https://design.fundraisingwizard.com/?org={org_id}` |
| `campaign_status` | Set to `active` on launch |
| `launch_date` | Current timestamp |
| `created_from_design_app` | Current timestamp |
| `total_raised` | Initialize to 0 |
| `blankets_sold` | Initialize to 0 |
| `total_orders` | Initialize to 0 |
| `production_status` | Set to `pending` |

### 2.3 Fields NOT Transferred (Design-Only)

These fields exist in the Design App GHL but are NOT needed in the portal:

- `designs_to_approve`
- `revision_notes`
- `design_1_decision`, `design_2_decision`, etc.
- `admin_review_status`
- `admin_approved_design_1`, etc.
- `admin_review_notes`
- `design_1_revision_notes`, etc.
- `designs_needing_revision`
- `design_1_revised`, etc.
- `revision_status`
- `selected_vibe`
- `design_decision_action`
- `back_vibe_id`
- `back_option_id`
- `back_animal_print_type`
- `back_custom_text`
- `custom_instructions`
- `additional_text`
- `submission_timestamp`
- `request_timestamp`
- `use_sales_tools`

---

## 3. Pipelines & Stages

### 3.1 Pipeline: Fundraiser Campaign

**Pipeline Name:** Fundraiser Campaign
**Pipeline Key:** `fundraiser_campaign`

| Stage # | Stage Name | Key | Description |
|---------|------------|-----|-------------|
| 1 | New Signup | `new_signup` | Supporter just signed up |
| 2 | Browsing | `browsing` | Viewing products, no purchase yet |
| 3 | Cart Started | `cart_started` | Added items to cart |
| 4 | Order Placed | `order_placed` | Completed purchase |
| 5 | Payment Confirmed | `payment_confirmed` | Payment processed |
| 6 | In Production | `in_production` | Order in manufacturing |
| 7 | Shipped | `shipped` | Order shipped |
| 8 | Delivered | `delivered` | Order delivered |

---

### 3.2 Pipeline: Coordinator Journey

**Pipeline Name:** Coordinator Journey
**Pipeline Key:** `coordinator_journey`

| Stage # | Stage Name | Key | Description |
|---------|------------|-----|-------------|
| 1 | Portal Created | `portal_created` | Sub-account just created |
| 2 | Setup In Progress | `setup_in_progress` | Coordinator configuring account |
| 3 | Campaign Draft | `campaign_draft` | Campaign being prepared |
| 4 | Campaign Active | `campaign_active` | Fundraiser is live |
| 5 | Campaign Ended | `campaign_ended` | Fundraiser period complete |
| 6 | Fulfillment | `fulfillment` | Processing orders |
| 7 | Complete | `complete` | All orders delivered, campaign closed |

---

## 4. Tags

Create the following tags in **Settings → Tags**:

### 4.1 Contact Type Tags

| Tag Name | Color | Description |
|----------|-------|-------------|
| `coordinator` | Blue | Fundraiser coordinator/admin |
| `supporter` | Green | Person buying to support fundraiser |
| `parent` | Purple | Parent of student |
| `staff` | Orange | School/org staff member |
| `family` | Teal | Family member of participant |

### 4.2 Order Status Tags

| Tag Name | Color | Description |
|----------|-------|-------------|
| `order-pending` | Yellow | Order placed, awaiting payment |
| `order-paid` | Green | Payment confirmed |
| `order-processing` | Blue | In production |
| `order-shipped` | Purple | Shipped to customer |
| `order-delivered` | Gray | Delivered |
| `order-issue` | Red | Problem with order |

### 4.3 Product Tags

| Tag Name | Color | Description |
|----------|-------|-------------|
| `product-blanket` | Blue | Ordered blanket |
| `product-beach-towel` | Teal | Ordered beach towel |
| `product-rally-towel` | Orange | Ordered rally towel |

### 4.4 Campaign Tags

| Tag Name | Color | Description |
|----------|-------|-------------|
| `high-performer` | Gold | Supporter with 3+ orders |
| `referrer` | Purple | Brought in other supporters |
| `early-bird` | Green | Ordered in first 48 hours |
| `repeat-buyer` | Blue | Ordered more than once |

---

## 5. Custom Values

Create the following custom values in **Settings → Custom Values**:

### 5.1 Company/Location Values

| Value Name | Key | Default Value | Description |
|------------|-----|---------------|-------------|
| Company Name | `company_name` | {{organization_name}} | Dynamic org name |
| Company Logo | `company_logo` | {{logo_url}} | Dynamic logo |
| Support Email | `support_email` | support@fundraisingwizard.com | FW support email |
| Support Phone | `support_phone` | (480) 236-0712 | FW support phone |

### 5.2 Campaign Values

| Value Name | Key | Default Value | Description |
|------------|-----|---------------|-------------|
| Campaign Goal | `campaign_goal` | {{fundraising_goal}} | Target amount |
| Campaign End | `campaign_end` | {{campaign_end_date}} | End date |
| Blanket Price | `blanket_price` | {{retail_price}} | Retail price |

---

## 6. Workflows & Automations

### 6.1 Workflow: New Supporter Welcome

**Workflow Name:** New Supporter Welcome
**Trigger:** Contact Created + Tag Added = `supporter`

**Actions:**
1. Wait 1 minute
2. Send Email: "Welcome to {organization_name}'s Fundraiser!"
3. Send SMS: "Thanks for supporting {organization_name}! Browse designs: {fundraiser_url}"
4. Add to Pipeline: Fundraiser Campaign → New Signup
5. Internal Notification to Coordinator

**Email Template:** `welcome_supporter` (see Section 7)

---

### 6.2 Workflow: Order Confirmation

**Workflow Name:** Order Confirmation
**Trigger:** Tag Added = `order-paid`

**Actions:**
1. Send Email: "Order Confirmed - {organization_name} Fundraiser"
2. Send SMS: "Your order is confirmed! We'll notify you when it ships."
3. Update Pipeline: Fundraiser Campaign → Payment Confirmed
4. Update Custom Field: `total_orders` + 1
5. Update Custom Field: `total_raised` + order amount
6. Update Custom Field: `blankets_sold` + quantity (if blanket)
7. Internal Notification to Coordinator

**Email Template:** `order_confirmation` (see Section 7)

---

### 6.3 Workflow: Order Shipped

**Workflow Name:** Order Shipped
**Trigger:** Tag Added = `order-shipped`

**Actions:**
1. Send Email: "Your Order Has Shipped!"
2. Send SMS: "Your {organization_name} fundraiser order is on its way! Track: {tracking_number}"
3. Update Pipeline: Fundraiser Campaign → Shipped

**Email Template:** `order_shipped` (see Section 7)

---

### 6.4 Workflow: Campaign Reminder - 7 Days Left

**Workflow Name:** Campaign Reminder 7 Days
**Trigger:** Date/Time based - 7 days before `campaign_end_date`

**Filter:** Contact has NOT tag `order-paid`

**Actions:**
1. Send Email: "Only 7 Days Left! - {organization_name} Fundraiser"
2. Send SMS: "Only 7 days left to support {organization_name}! Order now: {fundraiser_url}"

**Email Template:** `campaign_reminder_7days` (see Section 7)

---

### 6.5 Workflow: Campaign Reminder - 3 Days Left

**Workflow Name:** Campaign Reminder 3 Days
**Trigger:** Date/Time based - 3 days before `campaign_end_date`

**Filter:** Contact has NOT tag `order-paid`

**Actions:**
1. Send Email: "Final Days! - {organization_name} Fundraiser"
2. Send SMS: "Just 3 days left! Don't miss out: {fundraiser_url}"

**Email Template:** `campaign_reminder_3days` (see Section 7)

---

### 6.6 Workflow: Campaign Reminder - Last Day

**Workflow Name:** Campaign Reminder Last Day
**Trigger:** Date/Time based - on `campaign_end_date`

**Filter:** Contact has NOT tag `order-paid`

**Actions:**
1. Send Email: "LAST CHANCE - {organization_name} Fundraiser Ends Tonight!"
2. Send SMS: "⏰ Last chance to order! Campaign ends tonight: {fundraiser_url}"

**Email Template:** `campaign_reminder_lastday` (see Section 7)

---

### 6.7 Workflow: Cart Abandonment

**Workflow Name:** Cart Abandonment
**Trigger:** Pipeline Stage = Cart Started for > 2 hours AND NOT tag `order-paid`

**Actions:**
1. Wait 2 hours
2. Send Email: "Did you forget something?"
3. Wait 24 hours
4. If still no `order-paid` tag:
   - Send SMS: "Your cart is waiting! Complete your order: {order_form_url}"

**Email Template:** `cart_abandonment` (see Section 7)

---

### 6.8 Workflow: Coordinator Daily Summary

**Workflow Name:** Coordinator Daily Summary
**Trigger:** Daily at 8:00 AM (coordinator timezone)

**Filter:** Contact has tag `coordinator`

**Actions:**
1. Send Email: Daily summary with stats
   - Orders today
   - Total raised
   - Days remaining
   - Top supporters

**Email Template:** `coordinator_daily_summary` (see Section 7)

---

### 6.9 Workflow: Campaign Launch Notification

**Workflow Name:** Campaign Launch
**Trigger:** Custom Field `campaign_status` changed to `active`

**Actions:**
1. Send Email to Coordinator: "Your Fundraiser is LIVE!"
2. Internal Notification: Campaign launched

**Email Template:** `campaign_launched` (see Section 7)

---

### 6.10 Workflow: Milestone Celebration

**Workflow Name:** Milestone Reached
**Trigger:** Custom Field `total_raised` reaches 25%, 50%, 75%, 100% of `fundraising_goal`

**Actions:**
1. Send Email to Coordinator: "Congratulations! You've reached {milestone}%!"
2. Send Email to All Supporters: "We did it! {organization_name} reached {milestone}% of goal!"

**Email Template:** `milestone_reached` (see Section 7)

---

## 7. Email Templates

### 7.1 Template: Welcome Supporter

**Template Name:** `welcome_supporter`
**Subject:** Welcome to {{organization_name}}'s Fundraiser! 🎉

```html
Hi {{contact.first_name}},

Thank you for joining {{organization_name}}'s fundraiser!

We're raising money for {{fundraising_purpose}}, and every purchase makes a real difference.

**Browse Our Custom Designs:**
{{fundraiser_url}}

**What You Can Order:**
- Premium Custom Blankets - ${{retail_price}}
- Beach Towels
- Rally Towels

Every item features our unique {{organization_name}} designs created just for this fundraiser.

Questions? Reply to this email or contact {{coordinator_name}}.

Let's make this fundraiser a success!

— The {{organization_name}} Fundraiser Team
```

---

### 7.2 Template: Order Confirmation

**Template Name:** `order_confirmation`
**Subject:** Order Confirmed! ✓ {{organization_name}} Fundraiser

```html
Hi {{contact.first_name}},

Great news — your order is confirmed!

**Order Details:**
- Items: {{order_items}}
- Quantity: {{order_quantity}}
- Total: ${{order_total}}

**What's Next:**
1. We'll start production once the campaign ends ({{campaign_end_date}})
2. You'll receive a shipping notification with tracking
3. Estimated delivery: 2-3 weeks after campaign ends

**Fundraiser Progress:**
{{organization_name}} has raised ${{total_raised}} of ${{fundraising_goal}}!

Thank you for your support!

— {{organization_name}} Fundraiser Team
```

---

### 7.3 Template: Order Shipped

**Template Name:** `order_shipped`
**Subject:** Your Order Has Shipped! 📦

```html
Hi {{contact.first_name}},

Your {{organization_name}} fundraiser order is on its way!

**Tracking Number:** {{tracking_number}}
**Track Your Package:** [Click here to track]({{tracking_url}})

**Estimated Delivery:** {{estimated_delivery}}

Thank you again for supporting {{fundraising_purpose}}!

— {{organization_name}} Fundraiser Team
```

---

### 7.4 Template: Campaign Reminder (7 Days)

**Template Name:** `campaign_reminder_7days`
**Subject:** Only 7 Days Left! ⏰ {{organization_name}} Fundraiser

```html
Hi {{contact.first_name}},

Just a friendly reminder — our fundraiser ends in 7 days!

**Don't Miss Out:**
{{fundraiser_url}}

We're raising money for {{fundraising_purpose}}, and we're at ${{total_raised}} of our ${{fundraising_goal}} goal.

Help us reach our goal before {{campaign_end_date}}!

— {{coordinator_name}}
{{organization_name}}
```

---

### 7.5 Template: Campaign Reminder (3 Days)

**Template Name:** `campaign_reminder_3days`
**Subject:** Final Days! 🏃 {{organization_name}} Fundraiser

```html
Hi {{contact.first_name}},

Only 3 days left to order!

We're SO close to our goal — help us get there:
{{fundraiser_url}}

**Current Progress:** ${{total_raised}} / ${{fundraising_goal}}

Order by {{campaign_end_date}} to get your custom {{organization_name}} gear!

— {{coordinator_name}}
```

---

### 7.6 Template: Campaign Reminder (Last Day)

**Template Name:** `campaign_reminder_lastday`
**Subject:** ⚠️ LAST CHANCE - Ends Tonight!

```html
Hi {{contact.first_name}},

**This is it — our fundraiser ends TONIGHT!**

If you've been meaning to order, now's the time:
{{fundraiser_url}}

After midnight, you won't be able to get these exclusive {{organization_name}} designs.

Don't miss out!

— {{coordinator_name}}
{{organization_name}}
```

---

### 7.7 Template: Cart Abandonment

**Template Name:** `cart_abandonment`
**Subject:** Did you forget something? 🛒

```html
Hi {{contact.first_name}},

We noticed you started an order but didn't finish.

Your cart is still waiting:
{{order_form_url}}

Remember, every purchase supports {{fundraising_purpose}} for {{organization_name}}.

Need help? Just reply to this email!

— {{organization_name}} Fundraiser Team
```

---

### 7.8 Template: Coordinator Daily Summary

**Template Name:** `coordinator_daily_summary`
**Subject:** 📊 Daily Fundraiser Update - {{organization_name}}

```html
Hi {{coordinator_name}},

Here's your daily fundraiser summary:

**📈 Campaign Stats:**
- Total Raised: ${{total_raised}} / ${{fundraising_goal}}
- Progress: {{progress_percentage}}%
- Total Orders: {{total_orders}}
- Blankets Sold: {{blankets_sold}}

**📅 Days Remaining:** {{days_remaining}}

**🏆 Top Supporters:**
(List of recent/top supporters)

**💡 Tips:**
- Share on social media to boost sales
- Send personal reminders to friends and family
- Update your supporters on progress

View your full dashboard:
{{admin_dashboard_url}}

— Fundraising Wizard Team
```

---

### 7.9 Template: Campaign Launched

**Template Name:** `campaign_launched`
**Subject:** 🚀 Your Fundraiser is LIVE!

```html
Hi {{coordinator_name}},

Congratulations! Your {{organization_name}} fundraiser is officially live!

**Your Fundraiser URL:**
{{fundraiser_url}}

**Share this link everywhere:**
- Email to parents and supporters
- Post on social media
- Share in group chats

**Campaign Details:**
- Goal: ${{fundraising_goal}}
- End Date: {{campaign_end_date}}
- Duration: {{campaign_duration_days}} days

**Access Your Dashboard:**
{{admin_dashboard_url}}

Let's make this fundraiser a huge success!

— Fundraising Wizard Team
```

---

### 7.10 Template: Milestone Reached

**Template Name:** `milestone_reached`
**Subject:** 🎉 We Hit {{milestone}}% of Our Goal!

```html
Hi {{contact.first_name}},

AMAZING NEWS!

{{organization_name}} just reached {{milestone}}% of our fundraising goal!

**Current Total:** ${{total_raised}}
**Goal:** ${{fundraising_goal}}

Thank you to everyone who has supported us so far!

Haven't ordered yet? There's still time:
{{fundraiser_url}}

Let's keep the momentum going!

— {{organization_name}} Fundraiser Team
```

---

## 8. Funnel Pages

### 8.1 Fundraiser Landing Page

**Page Name:** Fundraiser Home
**URL Path:** `/` (homepage of sub-account domain)

**Sections:**
1. Hero with organization logo and "Support {organization_name}" headline
2. Progress bar showing total raised vs goal
3. Product gallery with design options
4. "Why Support Us" section with fundraising purpose
5. Testimonials/social proof
6. FAQ
7. Footer with contact info

**Dynamic Elements:**
- `{{organization_name}}`
- `{{logo_url}}`
- `{{fundraising_purpose}}`
- `{{fundraising_goal}}`
- `{{total_raised}}`
- `{{coordinator_name}}`
- `{{design_option_1}}` through `{{design_option_4}}`
- `{{retail_price}}`
- `{{campaign_end_date}}`

---

### 8.2 Product Page

**Page Name:** Product Detail
**URL Path:** `/product`

**Sections:**
1. Product image gallery (design options)
2. Product details (size, material, price)
3. Quantity selector
4. Add to cart button
5. Product description
6. Size guide

---

### 8.3 Cart Page

**Page Name:** Shopping Cart
**URL Path:** `/cart`

**Sections:**
1. Cart items list
2. Quantity adjustment
3. Order summary
4. Proceed to checkout button

---

### 8.4 Checkout Page

**Page Name:** Checkout
**URL Path:** `/checkout`

**Sections:**
1. Contact information form
2. Shipping address
3. Payment (Stripe integration)
4. Order review
5. Place order button

---

### 8.5 Thank You Page

**Page Name:** Order Complete
**URL Path:** `/thank-you`

**Sections:**
1. Order confirmation message
2. Order details summary
3. "What's Next" steps
4. Social sharing buttons
5. "Share with friends" referral section

---

## 9. Implementation Checklist

### Phase 1: Custom Fields
- [ ] Create all 72 custom fields as specified
- [ ] Verify field types and dropdown options
- [ ] Test field visibility and access

### Phase 2: Pipelines & Tags
- [ ] Create Fundraiser Campaign pipeline with 8 stages
- [ ] Create Coordinator Journey pipeline with 7 stages
- [ ] Create all contact type tags
- [ ] Create all order status tags
- [ ] Create all product tags
- [ ] Create all campaign tags

### Phase 3: Custom Values
- [ ] Create company/location custom values
- [ ] Create campaign custom values

### Phase 4: Email Templates
- [ ] Create all 10 email templates
- [ ] Test dynamic field replacement
- [ ] Preview and test send

### Phase 5: Workflows
- [ ] Build New Supporter Welcome workflow
- [ ] Build Order Confirmation workflow
- [ ] Build Order Shipped workflow
- [ ] Build Campaign Reminder workflows (7 day, 3 day, last day)
- [ ] Build Cart Abandonment workflow
- [ ] Build Coordinator Daily Summary workflow
- [ ] Build Campaign Launch Notification workflow
- [ ] Build Milestone Celebration workflow
- [ ] Test all workflow triggers

### Phase 6: Funnel Pages
- [ ] Build Fundraiser Landing Page
- [ ] Build Product Page
- [ ] Build Cart Page
- [ ] Build Checkout Page (with Stripe)
- [ ] Build Thank You Page
- [ ] Test full purchase flow

### Phase 7: Testing
- [ ] Create test contact and run through all workflows
- [ ] Test order placement and payment
- [ ] Verify all email templates render correctly
- [ ] Test pipeline stage movements

### Phase 8: Snapshot
- [ ] Review all components are complete
- [ ] Create snapshot named "Fundraiser Portal Template v1"
- [ ] Document snapshot ID for API use

---

## 10. API Integration Notes

### 10.1 Launch Service Endpoint ✅ IMPLEMENTED

**Actual Implementation:** `api/ghl/launch.ts` (Vercel Serverless Function)
**Client Service:** `services/launchService.ts`

The Launch Service is BUILT and ready. Here's what it actually does:

```typescript
// From api/ghl/launch.ts - ACTUAL IMPLEMENTATION
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const payload: LaunchFundraiserPayload = req.body;

  // Step 1: Create sub-account from snapshot
  const locationPayload = {
    name: `${payload.organization_name} Fundraiser`,
    companyId: process.env.GHL_COMPANY_ID,
    snapshotId: process.env.GHL_SNAPSHOT_ID, // ⚠️ NEEDS TO BE SET
    timezone: 'America/Phoenix',
    email: payload.coordinator_email,
  };
  const locationResult = await ghlApiCall('/locations/', 'POST', locationPayload);

  // Step 2: Update 50+ location custom fields
  await ghlApiCall(`/locations/${locationId}/customFields`, 'PUT', {
    customFields: {
      organization_name, organization_type, organization_slug,
      logo_url, mascot_name, brand_color_primary, // ... etc
      design_option_1, design_option_2, design_option_3, design_option_4,
      campaign_status: 'active',
      launch_date: new Date().toISOString().split('T')[0],
      // Full list in api/ghl/launch.ts lines 223-306
    }
  });

  // Step 3: Create coordinator as Contact
  const contactResult = await ghlApiCall('/contacts/', 'POST', {
    firstName, lastName, email, phone, locationId,
    tags: ['coordinator', 'admin'],
    source: 'Blanket Designer Pro',
  });

  // Step 4: Create coordinator as User (for dashboard login)
  const userResult = await ghlApiCall('/users/', 'POST', {
    firstName, lastName, email, phone,
    type: 'account', role: 'admin',
    locationIds: [locationId],
    permissions: { /* full admin permissions */ },
  });

  // Step 5: Return success with URLs
  return res.status(200).json({
    success: true,
    locationId,
    contactId,
    userId,
    fundraiserUrl: `https://${orgSlug}.fundraisingwizard.com`,
    adminDashboardUrl: `https://app.gohighlevel.com/v2/location/${locationId}`,
  });
}
```

**To call from frontend:**
```typescript
import { launchFundraiser, buildLaunchPayload } from '../services/launchService';

const result = await launchFundraiser({
  coordinator_name: 'John Smith',
  coordinator_email: 'john@school.edu',
  organization_name: 'Lincoln High School',
  organization_type: 'school',
  design_option_1: 'https://cloudinary.../design1.png',
  // ... all other fields
});

if (result.success) {
  console.log('Portal URL:', result.fundraiserUrl);
  console.log('Admin URL:', result.adminDashboardUrl);
}
```

### 10.2 Webhook: Order Placed

When a supporter places an order on the fundraiser page, send webhook to update totals:

```json
{
  "event": "order.placed",
  "locationId": "xxx",
  "data": {
    "contactId": "xxx",
    "orderTotal": 89.99,
    "quantity": 2,
    "products": ["blanket"],
    "timestamp": "2026-02-03T12:00:00Z"
  }
}
```

---

## IMPORTANT UPDATE: Portal Creation Logic (v1.1)

### When is a Sales Portal Created?

**NOT every order gets a sales portal sub-account.** The Launch Service is only triggered when the customer needs portal functionality.

| Order Type | Portal Decision | Portal Created? | Contract Type |
|------------|-----------------|-----------------|---------------|
| **Pre-Sale** | N/A (always included) | ✅ YES | `full` |
| **Bulk + Portal** | Customer opts IN | ✅ YES | `full` |
| **Bulk (No Portal)** | Customer opts OUT | ❌ NO | `simple` |

### How It Works

1. **Pre-Sale Orders:**
   - Portal is inherent to the pre-sale model (FW collects payments, needs store)
   - Customer doesn't get asked - it's automatic
   - Contract includes full TOS, Privacy Policy, Stripe terms

2. **Bulk Orders:**
   - Customer sees a **SalesPortalOptin** page after selecting products
   - They choose: "Yes, add Sales Portal" or "No thanks, just the blankets"
   - If YES → `use_sales_portal = true` → Full contract → Launch Service creates portal
   - If NO → `use_sales_portal = false` → Simple contract → NO portal created

### Contract Types

| Type | Content | Used When |
|------|---------|-----------|
| **full** | Artwork approval + TOS + Privacy Policy + Stripe terms | Pre-sale OR Bulk+Portal |
| **simple** | Artwork approval + Refund Policy + Limitation of Liability | Bulk without Portal |

### New Fields in CONTRACT_PAYMENT Webhook

The `CONTRACT_PAYMENT` webhook now includes:
- `order_type`: 'pre-sale' or 'bulk-purchase'
- `use_sales_portal`: boolean (only relevant for bulk orders)
- `contract_type`: 'full' or 'simple'

### Launch Service Trigger Logic

```javascript
// In CONTRACT_PAYMENT webhook handler
const shouldLaunchPortal = (payload) => {
  // Pre-sale always gets portal
  if (payload.order_type === 'pre-sale') return true;

  // Bulk only gets portal if customer opted in
  if (payload.order_type === 'bulk-purchase' && payload.use_sales_portal) return true;

  // Bulk without portal - no launch service
  return false;
};

// Only call Launch Service if customer needs a portal
if (shouldLaunchPortal(webhookPayload)) {
  await launchFundraiser(webhookPayload);
} else {
  // Just process the bulk order without creating portal
  await processBulkOrderWithoutPortal(webhookPayload);
}
```

### Implications for Template

1. **The template is still needed** - it's used for pre-sale and bulk+portal orders
2. **Location custom fields remain the same** - same 72 fields
3. **Workflows remain the same** - they only run in portals that are created
4. **No changes to funnel pages** - same 5 pages

### What Happens for "Bulk Without Portal" Orders?

These customers:
- ✅ Get their blankets (order processed normally)
- ✅ Receive order confirmation emails (from FW HQ, not a portal)
- ✅ Can contact support through main FW channels
- ❌ Don't get a dashboard or sales tools
- ❌ Don't get campaign management features
- ❌ Can reorder but just through normal channels

---

## Document Version

**Version:** 1.2
**Created:** 2026-02-03
**Updated:** 2026-02-06
**Author:** Claude (with Matt Kalatsky)
**Status:** Code Complete - Waiting for GHL Template Setup

**Changelog v1.2 (2026-02-06):**
- ✅ Marked Launch Service as BUILT (api/ghl/launch.ts)
- ✅ Added IMPLEMENTATION STATUS section showing what's done vs blocked
- ✅ Added GHL TEMPLATE SETUP REQUIREMENTS section with exact field specifications
- ✅ Added WEBHOOK TRIGGERS section with all 14 webhook types
- ✅ Updated API credentials section with required env vars
- ✅ Replaced pseudocode with actual implementation reference
- ⚠️ Key blocker: Waiting for Hal to complete GHL template and create snapshot

**Changelog v1.1 (2026-02-03):**
- Added portal creation logic clarification
- Documented two contract types (full vs simple)
- Added `use_sales_portal` field to webhook payload
- Clarified that bulk orders without portal do NOT trigger Launch Service

---

## Appendix: Quick Reference

### Custom Field Count by Category

| Category | Count |
|----------|-------|
| Organization & Branding | 10 |
| Coordinator Info | 5 |
| Blanket Designs - Front | 5 |
| Blanket Designs - Back | 5 |
| Beach Towel Designs | 4 |
| Rally Towel | 4 |
| Product & Pricing | 10 |
| Campaign Settings | 6 |
| Sales Tracking | 5 |
| Payment & Contract | 6 |
| Portal URLs | 4 |
| Fulfillment | 5 |
| Timestamps | 3 |
| **TOTAL** | **72** |

### Pipeline Count

| Pipeline | Stages |
|----------|--------|
| Fundraiser Campaign | 8 |
| Coordinator Journey | 7 |

### Workflow Count

| Type | Count |
|------|-------|
| Welcome/Onboarding | 1 |
| Order Management | 2 |
| Campaign Reminders | 3 |
| Cart Recovery | 1 |
| Coordinator Comms | 2 |
| Milestones | 1 |
| **TOTAL** | **10** |

### Email Template Count: **10**

### Funnel Page Count: **5**
