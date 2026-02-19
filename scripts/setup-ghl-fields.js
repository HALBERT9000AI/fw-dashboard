/**
 * GHL Custom Fields Setup Script
 * Creates all 85 custom fields for the Fundraising Wizard Portal Template
 * 
 * Run: node setup-ghl-fields.js
 */

const LOCATION_ID = 'w1xxDqpnMdTnJkLuuWVy';
const API_KEY = 'pit-bd421424-1c51-477f-8126-a2feca33cae2';
const BASE_URL = 'https://services.leadconnectorhq.com';

// Helper to make API requests
async function ghlRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28'
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await response.json();
  
  if (!response.ok) {
    console.error(`Error: ${response.status}`, data);
    return null;
  }
  
  return data;
}

// Create a custom field
async function createCustomField(field) {
  console.log(`Creating field: ${field.name}...`);
  
  const result = await ghlRequest(`/locations/${LOCATION_ID}/customFields`, 'POST', field);
  
  if (result) {
    console.log(`  ✓ Created: ${field.name}`);
    return result;
  } else {
    console.log(`  ✗ Failed: ${field.name}`);
    return null;
  }
}

// Create a folder for organizing fields
async function createFolder(name) {
  console.log(`Creating folder: ${name}...`);
  
  const result = await ghlRequest(`/locations/${LOCATION_ID}/customFields/folder`, 'POST', { name });
  
  if (result) {
    console.log(`  ✓ Created folder: ${name}`);
    return result;
  }
  return null;
}

// All custom fields from PRD
const LOCATION_FIELDS = [
  // 1.1 Organization & Branding (10 fields)
  { name: 'Organization Name', key: 'organization_name', dataType: 'TEXT', folder: 'Organization & Branding' },
  { name: 'Organization Type', key: 'organization_type', dataType: 'SINGLE_OPTIONS', folder: 'Organization & Branding',
    options: ['school', 'sports_team', 'church', 'camp', 'club', 'other'] },
  { name: 'Organization Slug', key: 'organization_slug', dataType: 'TEXT', folder: 'Organization & Branding' },
  { name: 'Logo URL', key: 'logo_url', dataType: 'TEXT', folder: 'Organization & Branding' },
  { name: 'Mascot Name', key: 'mascot_name', dataType: 'TEXT', folder: 'Organization & Branding' },
  { name: 'Brand Color Primary', key: 'brand_color_primary', dataType: 'TEXT', folder: 'Organization & Branding' },
  { name: 'Brand Color Secondary', key: 'brand_color_secondary', dataType: 'TEXT', folder: 'Organization & Branding' },
  { name: 'Brand Color Accent', key: 'brand_color_accent', dataType: 'TEXT', folder: 'Organization & Branding' },
  { name: 'Primary Color Pantone', key: 'primary_color_pantone', dataType: 'TEXT', folder: 'Organization & Branding' },
  { name: 'Secondary Color Pantone', key: 'secondary_color_pantone', dataType: 'TEXT', folder: 'Organization & Branding' },
  
  // 1.2 Coordinator Info (5 fields)
  { name: 'Coordinator Name', key: 'coordinator_name', dataType: 'TEXT', folder: 'Coordinator Info' },
  { name: 'Coordinator Email', key: 'coordinator_email', dataType: 'TEXT', folder: 'Coordinator Info' },
  { name: 'Coordinator Phone', key: 'coordinator_phone', dataType: 'TEXT', folder: 'Coordinator Info' },
  { name: 'Coordinator Role', key: 'coordinator_role', dataType: 'TEXT', folder: 'Coordinator Info' },
  { name: 'Fundraising Purpose', key: 'fundraising_purpose', dataType: 'TEXT', folder: 'Coordinator Info' },
  
  // 1.3 Blanket Designs - Front (5 fields)
  { name: 'Design Option 1', key: 'design_option_1', dataType: 'TEXT', folder: 'Blanket Designs' },
  { name: 'Design Option 2', key: 'design_option_2', dataType: 'TEXT', folder: 'Blanket Designs' },
  { name: 'Design Option 3', key: 'design_option_3', dataType: 'TEXT', folder: 'Blanket Designs' },
  { name: 'Design Option 4', key: 'design_option_4', dataType: 'TEXT', folder: 'Blanket Designs' },
  { name: 'Selected Design', key: 'selected_design', dataType: 'TEXT', folder: 'Blanket Designs' },
  
  // 1.4 Blanket Designs - Back (5 fields)
  { name: 'Back Design URL', key: 'back_design_url', dataType: 'TEXT', folder: 'Blanket Designs' },
  { name: 'Lux Back Design URL', key: 'lux_back_design_url', dataType: 'TEXT', folder: 'Blanket Designs' },
  { name: 'Lux Back Design Type', key: 'lux_back_design_type', dataType: 'TEXT', folder: 'Blanket Designs' },
  { name: 'Lux Back Upload URL', key: 'lux_back_upload_url', dataType: 'TEXT', folder: 'Blanket Designs' },
  { name: 'Needs Back Design', key: 'needs_back_design', dataType: 'CHECKBOX', folder: 'Blanket Designs' },
  
  // 1.5 Beach Towel Designs (4 fields)
  { name: 'Beach Towel Design 1', key: 'beach_towel_design_url_1', dataType: 'TEXT', folder: 'Towel Designs' },
  { name: 'Beach Towel Design 2', key: 'beach_towel_design_url_2', dataType: 'TEXT', folder: 'Towel Designs' },
  { name: 'Beach Towel Design 3', key: 'beach_towel_design_url_3', dataType: 'TEXT', folder: 'Towel Designs' },
  { name: 'Beach Towel Design 4', key: 'beach_towel_design_url_4', dataType: 'TEXT', folder: 'Towel Designs' },
  
  // 1.6 Rally Towel (4 fields)
  { name: 'Rally Towel Design URL', key: 'rally_towel_design_url', dataType: 'TEXT', folder: 'Towel Designs' },
  { name: 'Rally Towel Quantity', key: 'rally_towel_quantity', dataType: 'NUMERICAL', folder: 'Towel Designs' },
  { name: 'Rally Towel Unit Cost', key: 'rally_towel_cost', dataType: 'NUMERICAL', folder: 'Towel Designs' },
  { name: 'Rally Towel Total Cost', key: 'rally_towel_total_cost', dataType: 'NUMERICAL', folder: 'Towel Designs' },
  
  // 1.7 Product & Pricing (10 fields)
  { name: 'Product Type', key: 'product_type', dataType: 'SINGLE_OPTIONS', folder: 'Product & Pricing',
    options: ['premium_fleece', 'lux_sherpa', 'woven', 'micro_plush', 'stadium'] },
  { name: 'Product Category', key: 'product_category', dataType: 'SINGLE_OPTIONS', folder: 'Product & Pricing',
    options: ['blanket', 'beach_towel', 'rally_towel'] },
  { name: 'Order Type', key: 'order_type', dataType: 'SINGLE_OPTIONS', folder: 'Product & Pricing',
    options: ['bulk_order', 'fundraiser'] },
  { name: 'Quantity', key: 'quantity', dataType: 'NUMERICAL', folder: 'Product & Pricing' },
  { name: 'Pricing Tier', key: 'pricing_tier', dataType: 'TEXT', folder: 'Product & Pricing' },
  { name: 'Wholesale Price', key: 'wholesale_price', dataType: 'NUMERICAL', folder: 'Product & Pricing' },
  { name: 'Retail Price', key: 'retail_price', dataType: 'NUMERICAL', folder: 'Product & Pricing' },
  { name: 'Total Cost', key: 'total_cost', dataType: 'NUMERICAL', folder: 'Product & Pricing' },
  { name: 'Projected Profit', key: 'projected_profit', dataType: 'NUMERICAL', folder: 'Product & Pricing' },
  { name: 'Projected Revenue', key: 'projected_revenue', dataType: 'NUMERICAL', folder: 'Product & Pricing' },
  
  // 1.8 Campaign Settings (6 fields)
  { name: 'Campaign Start Date', key: 'campaign_start_date', dataType: 'DATE', folder: 'Campaign Settings' },
  { name: 'Campaign End Date', key: 'campaign_end_date', dataType: 'DATE', folder: 'Campaign Settings' },
  { name: 'Campaign Duration Days', key: 'campaign_duration_days', dataType: 'NUMERICAL', folder: 'Campaign Settings' },
  { name: 'Fundraising Goal', key: 'fundraising_goal', dataType: 'NUMERICAL', folder: 'Campaign Settings' },
  { name: 'Minimum Sales to Activate', key: 'minimum_sales_to_activate', dataType: 'NUMERICAL', folder: 'Campaign Settings' },
  { name: 'Campaign Status', key: 'campaign_status', dataType: 'SINGLE_OPTIONS', folder: 'Campaign Settings',
    options: ['draft', 'active', 'paused', 'completed', 'cancelled'] },
  
  // 1.9 Sales Tracking (5 fields)
  { name: 'Total Raised', key: 'total_raised', dataType: 'NUMERICAL', folder: 'Sales Tracking' },
  { name: 'Blankets Sold', key: 'blankets_sold', dataType: 'NUMERICAL', folder: 'Sales Tracking' },
  { name: 'Beach Towels Sold', key: 'beach_towels_sold', dataType: 'NUMERICAL', folder: 'Sales Tracking' },
  { name: 'Rally Towels Sold', key: 'rally_towels_sold', dataType: 'NUMERICAL', folder: 'Sales Tracking' },
  { name: 'Total Orders', key: 'total_orders', dataType: 'NUMERICAL', folder: 'Sales Tracking' },
  
  // 1.10 Payment & Contract (6 fields)
  { name: 'Contract Signed', key: 'contract_signed', dataType: 'CHECKBOX', folder: 'Payment & Contract' },
  { name: 'Contract Signed Date', key: 'contract_signed_date', dataType: 'DATE', folder: 'Payment & Contract' },
  { name: 'Payment Method', key: 'payment_method', dataType: 'SINGLE_OPTIONS', folder: 'Payment & Contract',
    options: ['stripe', 'check', 'invoice', 'po'] },
  { name: 'Tax Exempt', key: 'tax_exempt', dataType: 'CHECKBOX', folder: 'Payment & Contract' },
  { name: 'Tax Exempt ID', key: 'tax_exempt_id', dataType: 'TEXT', folder: 'Payment & Contract' },
  { name: 'Stripe Connected', key: 'stripe_connected', dataType: 'CHECKBOX', folder: 'Payment & Contract' },
  
  // 1.11 Portal URLs (4 fields)
  { name: 'Fundraiser URL', key: 'fundraiser_url', dataType: 'TEXT', folder: 'Portal URLs' },
  { name: 'Admin Dashboard URL', key: 'admin_dashboard_url', dataType: 'TEXT', folder: 'Portal URLs' },
  { name: 'Design App URL', key: 'design_app_url', dataType: 'TEXT', folder: 'Portal URLs' },
  { name: 'Order Form URL', key: 'order_form_url', dataType: 'TEXT', folder: 'Portal URLs' },
  
  // 1.12 Fulfillment (5 fields)
  { name: 'Production Status', key: 'production_status', dataType: 'SINGLE_OPTIONS', folder: 'Fulfillment',
    options: ['pending', 'in_production', 'quality_check', 'completed', 'shipped', 'delivered'] },
  { name: 'Estimated Ship Date', key: 'estimated_ship_date', dataType: 'DATE', folder: 'Fulfillment' },
  { name: 'Actual Ship Date', key: 'actual_ship_date', dataType: 'DATE', folder: 'Fulfillment' },
  { name: 'Tracking Number', key: 'tracking_number', dataType: 'TEXT', folder: 'Fulfillment' },
  { name: 'Delivery Date', key: 'delivery_date', dataType: 'DATE', folder: 'Fulfillment' },
  
  // 1.13 Timestamps (3 fields)
  { name: 'Launch Date', key: 'launch_date', dataType: 'DATE', folder: 'Timestamps' },
  { name: 'Created From Design App', key: 'created_from_design_app', dataType: 'DATE', folder: 'Timestamps' },
  { name: 'Last Sync Date', key: 'last_sync_date', dataType: 'DATE', folder: 'Timestamps' },
];

// Contact-level fields for order tracking (13 fields)
const CONTACT_FIELDS = [
  // Order Information (6 fields)
  { name: 'Order Total', key: 'order_total', dataType: 'NUMERICAL', folder: 'Order Info' },
  { name: 'Order Quantity', key: 'order_quantity', dataType: 'NUMERICAL', folder: 'Order Info' },
  { name: 'Order Products', key: 'order_products', dataType: 'TEXT', folder: 'Order Info' },
  { name: 'Order Date', key: 'order_date', dataType: 'DATE', folder: 'Order Info' },
  { name: 'Order Status', key: 'order_status', dataType: 'SINGLE_OPTIONS', folder: 'Order Info',
    options: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'refunded'] },
  { name: 'Order ID', key: 'order_id', dataType: 'TEXT', folder: 'Order Info' },
  
  // Shipping Information (4 fields)
  { name: 'Shipping Address', key: 'shipping_address', dataType: 'LARGE_TEXT', folder: 'Shipping Info' },
  { name: 'Shipping Tracking', key: 'shipping_tracking', dataType: 'TEXT', folder: 'Shipping Info' },
  { name: 'Shipping Carrier', key: 'shipping_carrier', dataType: 'TEXT', folder: 'Shipping Info' },
  { name: 'Estimated Delivery', key: 'estimated_delivery', dataType: 'DATE', folder: 'Shipping Info' },
  
  // Supporter Metadata (3 fields)
  { name: 'Supporter Type', key: 'supporter_type', dataType: 'SINGLE_OPTIONS', folder: 'Supporter Info',
    options: ['parent', 'family', 'staff', 'alumni', 'community', 'other'] },
  { name: 'Referred By', key: 'referred_by', dataType: 'TEXT', folder: 'Supporter Info' },
  { name: 'Student Name', key: 'student_name_order', dataType: 'TEXT', folder: 'Supporter Info' },
];

// Tags to create
const TAGS = [
  // Contact Type
  { name: 'coordinator', color: '#3B82F6' },
  { name: 'supporter', color: '#10B981' },
  { name: 'parent', color: '#8B5CF6' },
  { name: 'staff', color: '#F97316' },
  { name: 'family', color: '#14B8A6' },
  
  // Order Status
  { name: 'order-pending', color: '#EAB308' },
  { name: 'order-paid', color: '#22C55E' },
  { name: 'order-processing', color: '#3B82F6' },
  { name: 'order-shipped', color: '#A855F7' },
  { name: 'order-delivered', color: '#6B7280' },
  { name: 'order-issue', color: '#EF4444' },
  
  // Product Tags
  { name: 'product-blanket', color: '#3B82F6' },
  { name: 'product-beach-towel', color: '#14B8A6' },
  { name: 'product-rally-towel', color: '#F97316' },
  
  // Campaign Tags
  { name: 'high-performer', color: '#F59E0B' },
  { name: 'early-bird', color: '#22C55E' },
];

// Create a tag
async function createTag(tag) {
  console.log(`Creating tag: ${tag.name}...`);
  
  const result = await ghlRequest(`/locations/${LOCATION_ID}/tags`, 'POST', {
    name: tag.name
  });
  
  if (result) {
    console.log(`  ✓ Created tag: ${tag.name}`);
    return result;
  }
  return null;
}

// Main setup function
async function setup() {
  console.log('='.repeat(60));
  console.log('Fundraising Wizard - GHL Setup Script');
  console.log('='.repeat(60));
  console.log(`Location ID: ${LOCATION_ID}`);
  console.log('');
  
  // Get existing fields first
  console.log('Fetching existing fields...');
  const existingFields = await ghlRequest(`/locations/${LOCATION_ID}/customFields`);
  const existingKeys = new Set(
    existingFields?.customFields?.map(f => f.fieldKey) || []
  );
  console.log(`Found ${existingKeys.size} existing fields`);
  console.log('');
  
  // Track created folders
  const folderMap = new Map();
  
  // Create Location fields (on Contact object since GHL doesn't have true location-level fields)
  console.log('--- Creating Location Custom Fields (72) ---');
  let created = 0;
  let skipped = 0;
  
  for (const field of LOCATION_FIELDS) {
    // Check if field already exists
    if (existingKeys.has(field.key)) {
      console.log(`  ⊘ Skipping (exists): ${field.name}`);
      skipped++;
      continue;
    }
    
    // Build field payload
    const payload = {
      name: field.name,
      dataType: field.dataType,
      model: 'contact', // GHL custom fields are on contacts
    };
    
    // Add options for dropdown fields
    if (field.options) {
      payload.options = field.options.map(opt => ({ label: opt, value: opt }));
    }
    
    const result = await createCustomField(payload);
    if (result) created++;
    
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log(`\nLocation fields: ${created} created, ${skipped} skipped`);
  
  // Create Contact fields
  console.log('\n--- Creating Contact Custom Fields (13) ---');
  created = 0;
  skipped = 0;
  
  for (const field of CONTACT_FIELDS) {
    if (existingKeys.has(field.key)) {
      console.log(`  ⊘ Skipping (exists): ${field.name}`);
      skipped++;
      continue;
    }
    
    const payload = {
      name: field.name,
      dataType: field.dataType,
      model: 'contact',
    };
    
    if (field.options) {
      payload.options = field.options.map(opt => ({ label: opt, value: opt }));
    }
    
    const result = await createCustomField(payload);
    if (result) created++;
    
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log(`\nContact fields: ${created} created, ${skipped} skipped`);
  
  // Create Tags
  console.log('\n--- Creating Tags (16) ---');
  const existingTags = await ghlRequest(`/locations/${LOCATION_ID}/tags`);
  const existingTagNames = new Set(existingTags?.tags?.map(t => t.name) || []);
  
  created = 0;
  skipped = 0;
  
  for (const tag of TAGS) {
    if (existingTagNames.has(tag.name)) {
      console.log(`  ⊘ Skipping (exists): ${tag.name}`);
      skipped++;
      continue;
    }
    
    const result = await createTag(tag);
    if (result) created++;
    
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log(`\nTags: ${created} created, ${skipped} skipped`);
  
  console.log('\n' + '='.repeat(60));
  console.log('Setup complete!');
  console.log('='.repeat(60));
}

// Run the setup
setup().catch(console.error);
