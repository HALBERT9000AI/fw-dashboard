# PRD: Fundraising Wizard - GHL Admin Integration

## Overview

Build the admin integration layer between the Fundraising Wizard design app and GoHighLevel (GHL) sub-accounts. This system handles organization onboarding, data routing, and template token management.

---

## Problem Statement

Fundraising Wizard serves multiple organization types (schools, sports teams, camps, churches, clubs). Each organization gets their own GHL sub-account for CRM, communications, and order management. We need:

1. A way to onboard new organizations and create their GHL sub-account
2. A routing layer that sends design app data to the correct sub-account
3. A token system that populates templates with organization-specific content

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   Design App    │────▶│  FW Backend API  │────▶│  GHL Sub-Account    │
│  (blanket order)│     │  (routing layer) │     │  (org-specific)     │
└─────────────────┘     └──────────────────┘     └─────────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │  Organization    │
                        │  Registry (DB)   │
                        └──────────────────┘
```

---

## User Flows

### Flow 1: Organization Onboarding (Admin)

**Actor:** FW Admin (Matt or team)

**Steps:**
1. Admin accesses FW Admin Dashboard
2. Clicks "Add New Organization"
3. Fills intake form:
   - Organization name
   - Organization type (school/sports team/camp/church/club/other)
   - Coordinator name
   - Coordinator email
   - Coordinator phone
   - Fundraising purpose/goal
   - Logo upload (optional)
4. System creates GHL sub-account from snapshot
5. System stores org → sub-account mapping
6. System generates unique org_id for design app integration
7. Admin receives confirmation with:
   - Sub-account login credentials
   - Unique fundraiser page URL
   - Org ID for design app

### Flow 2: Order Submission (End User via Design App)

**Actor:** Parent/Supporter using design app

**Steps:**
1. User accesses org-specific design app URL (contains org_id)
2. User designs blanket, selects options
3. User submits order with:
   - Blanket design data
   - Quantity
   - Price
   - Customer info (name, email, phone)
4. Design app POSTs to FW Backend API
5. Backend looks up org_id → ghl_location_id
6. Backend creates/updates contact in correct GHL sub-account
7. Backend triggers appropriate GHL automation (order confirmation, etc.)

### Flow 3: Template Rendering (Automated)

**Actor:** System

**Trigger:** Fundraiser page load or email send

**Steps:**
1. System receives request with org_id
2. System fetches org data from registry
3. System replaces tokens in template:
   - `{{organization_name}}` → "Lincoln High School"
   - `{{fundraising_purpose}}` → "new band uniforms"
   - `{{coordinator_name}}` → "Sarah Johnson"
4. System returns/sends rendered content

---

## Data Models

### Organization Registry

```json
{
  "org_id": "fw_org_abc123",
  "ghl_location_id": "w1xxDqpnMdTnJkLuuWVy",
  "organization_name": "Lincoln High School",
  "organization_type": "school",
  "coordinator_name": "Sarah Johnson",
  "coordinator_email": "sjohnson@lincolnhs.edu",
  "coordinator_phone": "+14805551234",
  "fundraising_purpose": "new band uniforms",
  "fundraising_goal": 5000,
  "logo_url": "https://storage.fw.com/logos/abc123.png",
  "created_at": "2026-02-02T19:00:00Z",
  "status": "active",
  "fundraiser_url": "https://fundraisingwizard.com/lincoln-band",
  "design_app_url": "https://design.fundraisingwizard.com/?org=fw_org_abc123"
}
```

### GHL Custom Fields (per sub-account)

These 85 fields exist in each sub-account (copied via snapshot):

#### Design Approval & Review
| Field Name | Key | Type | Description |
|------------|-----|------|-------------|
| Designs To Approve | `designs_to_approve` | CHECKBOX | Flag indicating designs need review |
| Revision Notes | `revision_notes` | LARGE_TEXT | General revision feedback |
| Design 1 Decision | `design_1_decision` | RADIO | Approve/reject/revise for design 1 |
| Design 2 Decision | `design_2_decision` | RADIO | Approve/reject/revise for design 2 |
| Design 3 Decision | `design_3_decision` | RADIO | Approve/reject/revise for design 3 |
| Design 4 Decision | `design_4_decision` | RADIO | Approve/reject/revise for design 4 |
| Admin Review Status | `admin_review_status` | RADIO | Overall admin review state |
| Admin Approved Design 1 | `admin_approved_design_1` | CHECKBOX | Design 1 approved by admin |
| Admin Approved Design 2 | `admin_approved_design_2` | CHECKBOX | Design 2 approved by admin |
| Admin Approved Design 3 | `admin_approved_design_3` | CHECKBOX | Design 3 approved by admin |
| Admin Approved Design 4 | `admin_approved_design_4` | CHECKBOX | Design 4 approved by admin |
| Admin Review Notes | `admin_review_notes` | LARGE_TEXT | Admin feedback notes |
| Design_1_revision_notes | `design_1_revision_notes` | LARGE_TEXT | Specific revision notes for design 1 |
| Design_2_revision_notes | `design_2_revision_notes` | LARGE_TEXT | Specific revision notes for design 2 |
| Design_3_revision_notes | `design_3_revision_notes` | LARGE_TEXT | Specific revision notes for design 3 |
| Design_4_revision_notes | `design_4_revision_notes` | LARGE_TEXT | Specific revision notes for design 4 |
| Designs_needing_revision | `designs_needing_revision` | TEXT | List of designs requiring changes |
| Design_1_revised | `design_1_revised` | TEXT | Revised design 1 status/URL |
| Design_2_revised | `design_2_revised` | TEXT | Revised design 2 status/URL |
| Design_3_revised | `design_3_revised` | TEXT | Revised design 3 status/URL |
| Design_4_revised | `design_4_revised` | TEXT | Revised design 4 status/URL |
| Revision_status | `revision_status` | MULTIPLE_OPTIONS | Overall revision workflow state |

#### Organization & Branding
| Field Name | Key | Type | Description |
|------------|-----|------|-------------|
| Organization_team_identifier | `organization_team_identifier` | TEXT | Unique org/team ID |
| Logo_url | `logo_url` | TEXT | Organization logo image URL |
| Mascot_name | `mascot_name` | TEXT | Team mascot name |
| Brand_color_primary | `brand_color_primary` | TEXT | Primary brand color (hex) |
| Brand_color_secondary | `brand_color_secondary` | TEXT | Secondary brand color (hex) |
| Brand_color_accent | `brand_color_accent` | TEXT | Accent color (hex) |
| Brand_color_bright_accent | `brand_color_bright_accent` | TEXT | Bright accent color (hex) |
| Use_accent_color | `use_accent_color` | TEXT | Whether to use accent color |
| Use_bright_accent_color | `use_bright_accent_color` | TEXT | Whether to use bright accent |
| Primary_color_pantone | `primary_color_pantone` | TEXT | Primary Pantone code |
| Secondary_color_pantone | `secondary_color_pantone` | TEXT | Secondary Pantone code |
| Accent_color_pantone | `accent_color_pantone` | TEXT | Accent Pantone code |
| Bright_accent_color_pantone | `bright_accent_color_pantone` | TEXT | Bright accent Pantone code |

#### Design Options & Selection
| Field Name | Key | Type | Description |
|------------|-----|------|-------------|
| Design Option 1 | `design_option_1` | TEXT | Design option 1 URL/reference |
| Design Option 2 | `design_option_2` | TEXT | Design option 2 URL/reference |
| Design Option 3 | `design_option_3` | TEXT | Design option 3 URL/reference |
| Design Option 4 | `design_option_4` | TEXT | Design option 4 URL/reference |
| Selected_vibe | `selected_vibe` | TEXT | Chosen design vibe/style |
| Selected Design | `selected_design` | TEXT | Final selected design |
| Design Decision Action | `design_decision_action` | TEXT | Action taken on design |
| Needs_back_design | `needs_back_design` | TEXT | Whether back design needed |

#### Product & Order
| Field Name | Key | Type | Description |
|------------|-----|------|-------------|
| Order_type | `order_type` | TEXT | Type of order |
| Product_category | `product_category` | TEXT | Product category (blanket/towel) |
| Product_type | `product_type` | TEXT | Specific product type |
| Quantity | `quantity` | NUMERICAL | Order quantity |
| Pricing_tier | `pricing_tier` | TEXT | Price tier level |
| Wholesale_price | `wholesale_price` | NUMERICAL | Wholesale cost |
| Retail_price | `retail_price` | NUMERICAL | Retail selling price |
| Custom_instructions | `custom_instructions` | LARGE_TEXT | Special order instructions |
| Additional_text | `additional_text` | TEXT | Extra text for personalization |
| Po_number | `po_number` | TEXT | Purchase order number |

#### Beach Towel Designs
| Field Name | Key | Type | Description |
|------------|-----|------|-------------|
| Beach_towel_design_url_1 | `beach_towel_design_url_1` | TEXT | Beach towel design 1 URL |
| Beach_towel_design_url_2 | `beach_towel_design_url_2` | TEXT | Beach towel design 2 URL |
| Beach_towel_design_url_3 | `beach_towel_design_url_3` | TEXT | Beach towel design 3 URL |
| Beach_towel_design_url_4 | `beach_towel_design_url_4` | TEXT | Beach towel design 4 URL |

#### Rally Towel
| Field Name | Key | Type | Description |
|------------|-----|------|-------------|
| Rally_towel_design_url | `rally_towel_design_url` | TEXT | Rally towel design URL |
| Rally_towel_total_cost | `rally_towel_total_cost` | NUMERICAL | Rally towel total cost |
| Rally_towel_cost | `rally_towel_cost` | TEXT | Rally towel unit cost |
| Rally_towel_quantity | `rally_towel_quantity` | TEXT | Rally towel quantity |

#### Lux Back Design
| Field Name | Key | Type | Description |
|------------|-----|------|-------------|
| Lux_back_design_type | `lux_back_design_type` | TEXT | Luxury back design type |
| Lux_back_design_url | `lux_back_design_url` | TEXT | Lux back design URL |
| Lux_back_upload_url | `lux_back_upload_url` | TEXT | Lux back custom upload URL |

#### Back Design
| Field Name | Key | Type | Description |
|------------|-----|------|-------------|
| Back_design_url | `back_design_url` | TEXT | Back design image URL |
| Back_vibe_id | `back_vibe_id` | TEXT | Back design vibe identifier |
| Back_option_id | `back_option_id` | TEXT | Back design option ID |
| Back_animal_print_type | `back_animal_print_type` | TEXT | Animal print style for back |
| Back_custom_text | `back_custom_text` | TEXT | Custom text for back |

#### Campaign Settings
| Field Name | Key | Type | Description |
|------------|-----|------|-------------|
| Campaign_duration_days | `campaign_duration_days` | NUMERICAL | Length of fundraiser in days |
| Minimum_sales_to_activate | `minimum_sales_to_activate` | NUMERICAL | Min orders to activate campaign |
| Campaign_start_date | `campaign_start_date` | DATE | Campaign start date |
| Campaign_end_date | `campaign_end_date` | DATE | Campaign end date |

#### Financial & Metrics
| Field Name | Key | Type | Description |
|------------|-----|------|-------------|
| Projected_profit | `projected_profit` | NUMERICAL | Estimated profit |
| Projected_revenue | `projected_revenue` | TEXT | Estimated revenue |
| Total_cost | `total_cost` | TEXT | Total order cost |
| Total_raised | `total_raised` | NUMERICAL | Amount raised so far |
| Blankets_sold | `blankets_sold` | NUMERICAL | Number of blankets sold |

#### Payment & Contract
| Field Name | Key | Type | Description |
|------------|-----|------|-------------|
| Tax_exempt | `tax_exempt` | CHECKBOX | Tax exempt status |
| Payment_method | `payment_method` | TEXT | Payment method used |
| Stripe_connected | `stripe_connected` | CHECKBOX | Stripe account connected |
| Contract_signed | `contract_signed` | TEXT | Contract signature status |
| Use_sales_tools | `use_sales_tools` | TEXT | Using sales tools flag |

#### Timestamps
| Field Name | Key | Type | Description |
|------------|-----|------|-------------|
| Submission_timestamp | `submission_timestamp` | TEXT | Form submission time |
| Request_timestamp | `request_timestamp` | TEXT | Request creation time |

### Template Tokens

Universal tokens available for all templates:

| Token | Source | Example Value |
|-------|--------|---------------|
| `{{organization_name}}` | org registry | "Lincoln High School" |
| `{{organization_type}}` | org registry | "school" |
| `{{coordinator_name}}` | org registry | "Sarah Johnson" |
| `{{coordinator_email}}` | org registry | "sjohnson@lincolnhs.edu" |
| `{{fundraising_purpose}}` | org registry | "new band uniforms" |
| `{{fundraising_goal}}` | org registry | "$5,000" |
| `{{fundraiser_url}}` | org registry | "https://fundraisingwizard.com/lincoln-band" |
| `{{logo_url}}` | org registry | URL or empty |

---

## API Endpoints

### POST /api/organizations

Create new organization and GHL sub-account.

**Request:**
```json
{
  "organization_name": "Lincoln High School",
  "organization_type": "school",
  "coordinator_name": "Sarah Johnson",
  "coordinator_email": "sjohnson@lincolnhs.edu",
  "coordinator_phone": "+14805551234",
  "fundraising_purpose": "new band uniforms",
  "fundraising_goal": 5000
}
```

**Response:**
```json
{
  "success": true,
  "org_id": "fw_org_abc123",
  "ghl_location_id": "xyz789",
  "fundraiser_url": "https://fundraisingwizard.com/lincoln-band",
  "design_app_url": "https://design.fundraisingwizard.com/?org=fw_org_abc123",
  "ghl_credentials": {
    "email": "<org-email>@fw-ghl.com",
    "temp_password": "<system-generated>"
  }
}
```

### POST /api/orders

Receive order from design app, route to correct GHL sub-account.

**Request:**
```json
{
  "org_id": "fw_org_abc123",
  "customer": {
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+14805559999"
  },
  "order": {
    "blanket_type": "premium_fleece",
    "blanket_design_id": "design_456",
    "design_preview_url": "https://storage.fw.com/previews/456.png",
    "quantity": 2,
    "unit_price": 45.00,
    "total": 90.00
  }
}
```

**Response:**
```json
{
  "success": true,
  "ghl_contact_id": "contact_xyz",
  "order_id": "order_789"
}
```

### GET /api/organizations/:org_id/tokens

Fetch token values for template rendering.

**Response:**
```json
{
  "organization_name": "Lincoln High School",
  "organization_type": "school",
  "coordinator_name": "Sarah Johnson",
  "fundraising_purpose": "new band uniforms",
  "fundraising_goal": "$5,000",
  "fundraiser_url": "https://fundraisingwizard.com/lincoln-band",
  "logo_url": "https://storage.fw.com/logos/abc123.png"
}
```

---

## GHL Integration Details

### Authentication

- **Agency API Key:** Use agency-level API for creating sub-accounts
- **Location API Keys:** Each sub-account has its own API key for contact/order operations
- Store location API keys in organization registry

### Sub-Account Creation Flow

1. Call GHL API to create location from snapshot
2. Snapshot ID: `[TO BE CONFIGURED - use FW template snapshot]`
3. Store returned location_id in org registry
4. Generate location-specific API key
5. Configure location settings (name, timezone, etc.)

### GHL API Endpoints Used

- `POST /locations` - Create sub-account
- `POST /contacts` - Create/update contact with order
- `PUT /contacts/:id/custom-fields` - Update custom field values
- `POST /conversations/messages` - Trigger automations

---

## Default Template Copy

### Fundraiser Landing Page - Hero Section

**Sub-Headline:**
```
Custom blankets that support your community
```

**Story Paragraph:**
```
This year, {{organization_name}} is raising funds for {{fundraising_purpose}}. 
These aren't just blankets—they're spirit, warmth, and memories your family 
will keep for years. Every purchase makes a direct and significant impact 
for {{organization_name}}.

— {{coordinator_name}}, Fundraiser Coordinator
```

**Button Text:**
```
ORDER NOW
```

### Progress Bar Section

**Label:**
```
{{organization_name}} has raised {{amount_raised}} of {{fundraising_goal}}
```

---

## Technical Requirements

### Backend Stack (Suggested)
- Node.js/Express or Python/FastAPI
- PostgreSQL for organization registry
- Redis for caching token lookups

### Security
- API key authentication for design app → backend
- Validate org_id on every request
- Rate limiting on order submission
- HTTPS only

### Error Handling
- If org_id not found: Return 404 with clear message
- If GHL API fails: Queue for retry, return 202 Accepted
- Log all GHL API interactions for debugging

---

## Success Metrics

1. Organization onboarding time < 5 minutes
2. Order routing success rate > 99.9%
3. Template token replacement accuracy: 100%
4. GHL sub-account creation success rate > 99%

---

## Open Questions

1. Where will the backend be hosted? (Vercel, AWS, etc.)
2. Database choice for org registry? (Supabase, PlanetScale, etc.)
3. Do we need a separate admin UI or use GHL's agency dashboard?
4. How do we handle org logo uploads? (Direct to S3/Cloudflare?)

---

## Implementation Phases

### Phase 1: Core Routing
- [ ] Set up backend API
- [ ] Organization registry database
- [ ] POST /api/orders endpoint
- [ ] GHL contact creation

### Phase 2: Organization Onboarding
- [ ] POST /api/organizations endpoint
- [ ] GHL sub-account creation from snapshot
- [ ] Credential generation

### Phase 3: Template System
- [ ] Token lookup endpoint
- [ ] Template rendering integration
- [ ] Landing page dynamic content

### Phase 4: Admin Dashboard
- [ ] Organization list view
- [ ] Organization detail/edit
- [ ] Order overview across orgs
