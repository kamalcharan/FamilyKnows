# QR CODES NEEDED FOR PAMPHLET

## Total QR Codes: 4

---

## QR Code 1: VIKUNA CONSULTING
**URL:** `https://vikuna.com/event-consultation`
**Size:** 50mm × 50mm
**Label:** "Free AI Strategy Session (Worth ₹15,000)"
**Action:** Redirects to Calendly booking page

### Landing Page Requirements:
- Calendly embed for consultation booking
- Pre-filled form field: `source=event_pamphlet`
- Confirmation message mentions all 3 event benefits
- UTM parameters: `?utm_source=event&utm_medium=pamphlet&utm_campaign=entrepreneur_event_nov2024`

---

## QR Code 2: CONTRACTNEST WAITLIST
**URL:** `https://contractnest.com/waitlist-event`
**Size:** 50mm × 50mm
**Label:** "Join Waitlist - 30% Lifetime Discount"
**Action:** Waitlist signup form → Supabase

### Form Fields:
- Name (required)
- Email (required)
- Company Name (required)
- Industry (dropdown)
- Number of contracts managed (optional)
- Phone (optional)

### Auto-actions:
- Add to Supabase `contractnest_waitlist` table
- Auto-apply coupon code: `EVENT30`
- Send confirmation email with:
  - Thank you message
  - Launch timeline
  - 30% discount confirmed
  - Other two Vikuna offers

---

## QR Code 3: FAMILYKNOWS BETA
**URL:** `https://familyknows.app/beta-event`
**Size:** 50mm × 50mm
**Label:** "Priority Beta - 1 Year Premium FREE"
**Action:** Beta signup form → Supabase

### Form Fields:
- Name (required)
- Email (required)
- Family Size (dropdown: 2-3, 4-5, 6+)
- Phone (optional)
- Primary use case (dropdown: Emergency prep, Document storage, Contact management, All)

### Auto-actions:
- Add to Supabase `familyknows_beta` table
- Set priority flag (first 100 users)
- Send confirmation email with:
  - Beta timeline
  - Premium offer (1 year free)
  - What to expect
  - Other two Vikuna offers

---

## QR Code 4: EVENT HUB (Master Link)
**URL:** `https://vikuna.com/event-hub`
**Size:** 40mm × 40mm
**Label:** "All Links & Info"
**Action:** Landing page with all options

### Landing Page Content:
```
╔════════════════════════════════════════╗
║     WELCOME TO VIKUNA                  ║
║     Event Exclusive Offers             ║
╚════════════════════════════════════════╝

Choose Your Interest:

[Button 1] 🎯 Book Free AI Consultation
→ vikuna.com/event-consultation

[Button 2] 📋 Join ContractNest Waitlist (30% Off)
→ contractnest.com/waitlist-event

[Button 3] 👨‍👩‍👧‍👦 Get FamilyKnows Beta Access (Free Year)
→ familyknows.app/beta-event

───────────────────────────────────

🎁 EXCLUSIVE OFFER
Scan any option above → Get ALL 3 benefits!
Limited to first 50 entrepreneurs

───────────────────────────────────

Contact Us:
📧 connect@vikuna.com
📱 +91 [YOUR NUMBER]
💼 LinkedIn: /company/vikuna
```

### Tracking:
- Log which button clicked
- Store in Supabase: timestamp, clicked_option, source
- Google Analytics event tracking

---

## HOW TO GENERATE QR CODES

### Option 1: QR Code Generator (Free)
1. Visit: https://www.qr-code-generator.com/
2. Select "URL" type
3. Paste your URL
4. Set error correction to "High (30%)"
5. Download as SVG (vector - scales perfectly)
6. Give to designer

### Option 2: Using Code (Node.js)
```bash
npm install qrcode
```

```javascript
const QRCode = require('qrcode');

const codes = {
  consultation: 'https://vikuna.com/event-consultation?utm_source=event&utm_medium=pamphlet',
  contractnest: 'https://contractnest.com/waitlist-event?utm_source=event&utm_medium=pamphlet',
  familyknows: 'https://familyknows.app/beta-event?utm_source=event&utm_medium=pamphlet',
  hub: 'https://vikuna.com/event-hub?utm_source=event&utm_medium=pamphlet'
};

Object.keys(codes).forEach(name => {
  QRCode.toFile(`${name}-qr.png`, codes[name], {
    errorCorrectionLevel: 'H',
    type: 'png',
    width: 500,
    margin: 2
  });
});
```

### Option 3: Online Batch Generator
- https://www.qrstuff.com/
- https://www.the-qrcode-generator.com/

---

## TESTING CHECKLIST

Before printing 2000 copies, test with 10 sample prints:

- [ ] All QR codes scan successfully
- [ ] QR codes work from 30cm distance
- [ ] Links redirect to correct pages
- [ ] UTM parameters are captured correctly
- [ ] Forms submit to Supabase
- [ ] Confirmation emails send
- [ ] QR codes still work after folding pamphlet
- [ ] QR codes readable in different lighting
- [ ] Test on both iPhone and Android

---

## URL SHORTENING (Optional)

If you want cleaner/shorter URLs:

### Option 1: Bitly
- `bit.ly/vikuna-consult`
- `bit.ly/contractnest-event`
- `bit.ly/familyknows-beta`

### Option 2: Your Own Domain
- `v.kn/consult` (short domain)
- `v.kn/contract`
- `v.kn/family`

**Benefit:** Easier to type if someone can't scan
**Downside:** Less brand visibility in URL

---

## TRACKING SETUP

### Supabase Tables Needed:

**Table: `event_pamphlet_scans`**
```sql
CREATE TABLE event_pamphlet_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  qr_code_type TEXT, -- consultation, contractnest, familyknows, hub
  scanned_at TIMESTAMP DEFAULT NOW(),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  user_agent TEXT,
  referrer TEXT
);
```

**Table: `contractnest_waitlist`**
```sql
CREATE TABLE contractnest_waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  company_name TEXT,
  industry TEXT,
  contract_count INTEGER,
  phone TEXT,
  source TEXT DEFAULT 'event_pamphlet',
  coupon_code TEXT DEFAULT 'EVENT30',
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Table: `familyknows_beta`**
```sql
CREATE TABLE familyknows_beta (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  family_size TEXT,
  primary_use_case TEXT,
  phone TEXT,
  source TEXT DEFAULT 'event_pamphlet',
  is_priority BOOLEAN DEFAULT true,
  signup_number INTEGER, -- Track if they're in first 100
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## ANALYTICS DASHBOARD

Track these metrics in real-time:

1. **Total Scans per QR Code**
2. **Conversion Rate** (scan → signup)
3. **Most Popular Solution** (which QR scanned most)
4. **Time Distribution** (when scans happen - day 1, day 2, etc.)
5. **First 50 Tracker** (countdown to offer limit)

Create simple dashboard:
- Supabase + React admin panel
- Or Google Sheets integration
- Or Metabase/Retool

---

## BACKUP PLAN

If QR codes don't work for some reason:

1. **Short URLs on pamphlet** (type manually)
   - vikuna.com/event

2. **SMS Keyword**
   - "Text EVENT to [number] for links"

3. **Event Booth QR**
   - Large QR code poster at your booth
   - People can scan there

4. **Business Cards**
   - Hand out cards with QR codes
   - To high-value prospects

---

**NEXT STEP:** Create these 4 landing pages before generating QR codes!
