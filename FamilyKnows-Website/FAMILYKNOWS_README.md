# FamilyKnows Landing Page

A high-conversion landing page for FamilyKnows - The Family Office App for Everyone.

## 🎨 **Multi-Theme System**

The website supports 3 beautiful themes that can be switched via configuration:

### **1. Modern Family (Default)**
- **Colors**: Teal (#65ccb8), Forest Green (#28945e), Charcoal (#182628)
- **Vibe**: Modern, trustworthy, growth-oriented
- **Best for**: Default experience - balance of trust and modernity

### **2. Blue Foundation**
- **Colors**: Deep Blue (#3d52a0), Sky Blue (#7091e6), Lavender (#ede8f5)
- **Vibe**: Professional, traditional, authoritative
- **Best for**: Corporate/traditional family office feel

### **3. Clean & Energetic**
- **Colors**: Vibrant Blue (#5680e9), Purple (#8860d0), Light Blue-Gray (#f8f9fc)
- **Vibe**: Modern, innovative, youthful
- **Best for**: Tech-savvy, younger families

### **How to Switch Themes**

Edit `src/App_FamilyKnows.tsx`:

```typescript
import { getTheme } from './config/theme/themeConfig';

// Change DEFAULT_THEME to one of: 'modernFamily', 'blueFoundation', 'cleanEnergetic'
const defaultTheme = getTheme('modernFamily'); // Change this
```

Or programmatically:
```typescript
import { getTheme, saveThemePreference } from './config/theme/themeConfig';

// Switch theme
const newTheme = getTheme('blueFoundation');
saveThemePreference('blueFoundation');
```

---

## 🚀 **Features**

### **✅ Completed Components**

1. **Hero Section** (`FamilyKnowsHero.tsx`)
   - CSS 3D vault animation
   - Scarcity messaging (150 families, 100 spots left)
   - Dual CTA (Early Bird + Waitlist)
   - Real-time spot counter
   - Trust badges
   - Responsive design

2. **Trust Signals** (`TrustSignals.tsx`)
   - Security certifications (with DPDPA placeholder)
   - Stats showcase (150+ families, 100% data ownership)
   - Security features grid
   - "Built in India" statement
   - 3D card effects

3. **Storytelling Section** (`StorytellingSection.tsx`)
   - 3 interactive stories with before/after comparisons
   - Story 1: "One App to Bring Family Together"
   - Story 2: "From Chaos to Clarity" (In Case of Death folder)
   - Story 3: "Breaking the Language Barrier"
   - CSS 3D animations
   - Story navigation tabs

4. **Early Adopter Section** (`EarlyAdopterSection.tsx`)
   - Pricing cards (Early Bird vs Waitlist)
   - ₹900/year vs ₹1,800/year comparison
   - Features grid (4 categories, 16 features)
   - Final conversion CTA
   - 3D card interactions

---

## 📦 **Project Structure**

```
FamilyKnows-Website/
├── src/
│   ├── App_FamilyKnows.tsx          # Main landing page
│   ├── components/
│   │   └── familyknows/
│   │       ├── FamilyKnowsHero.tsx
│   │       ├── FamilyKnowsHero.css
│   │       ├── TrustSignals.tsx
│   │       ├── TrustSignals.css
│   │       ├── StorytellingSection.tsx
│   │       ├── StorytellingSection.css
│   │       ├── EarlyAdopterSection.tsx
│   │       └── EarlyAdopterSection.css
│   ├── config/
│   │   └── theme/
│   │       ├── themeConfig.ts       # Theme configuration
│   │       └── themes/
│   │           ├── ModernFamilyTheme.ts
│   │           ├── BlueFoundationTheme.ts
│   │           └── CleanEnergeticTheme.ts
│   └── context/
│       └── ThemeContext.tsx
```

---

## 🎯 **CRO (Conversion Rate Optimization) Features**

1. **Scarcity**: "100 spots left" creates urgency
2. **Social Proof**: "150+ families trust us"
3. **Value Anchor**: ₹1,800 → ₹900 (50% off)
4. **Risk Reversal**: "No credit card required • Cancel anytime"
5. **Dual CTA**: Early Bird (aggressive) + Waitlist (cautious)
6. **Trust Signals**: DPDPA, Encryption, Made in India
7. **Storytelling**: Emotional connection through 3 real-world scenarios
8. **Visual Hierarchy**: CSS 3D effects guide attention

---

## 🌐 **CSS 3D Effects**

All 3D effects are pure CSS - no heavy libraries:

- **Glassmorphism**: Frosted glass effect on cards
- **Floating animations**: Vault, documents, shapes
- **Transform 3D**: Perspective, rotations, translations
- **Box shadows**: Multi-layer depth
- **Hover effects**: translateZ, scale, rotate
- **Gradient animations**: Shimmer, pulse, glow

---

## 🔧 **Development**

### **Run Development Server**
```bash
cd FamilyKnows-Website
npm install
npm run dev
```

### **Build for Production**
```bash
npm run build
```

### **Preview Production Build**
```bash
npm run preview
```

---

## 🎨 **Using Spline 3D (Optional Upgrade)**

Current version uses CSS 3D. To upgrade to Spline:

### **Steps:**

1. Go to [spline.design](https://spline.design)
2. Create account / sign in
3. Use template or create:
   - **Vault/Safe 3D model**
   - Colors: Match your theme (teal/green for Modern Family)
   - Add subtle animation (float, rotate)
4. Export as React component
5. Replace CSS vault in `FamilyKnowsHero.tsx`:

```typescript
// Before (CSS)
<div className="vault-3d-container">
  {/* CSS 3D vault */}
</div>

// After (Spline)
import Spline from '@splinetool/react-spline';

<Spline scene="https://prod.spline.design/YOUR-SCENE-ID/scene.splinecode" />
```

### **Spline Scene Specs:**
- **Size**: 300x300px
- **Colors**: `#65ccb8` (primary), `#28945e` (secondary)
- **Animation**: Slow float (6s loop)
- **Elements**: Vault + 4 floating document icons
- **Export**: React component + public URL

---

## 📊 **Supabase Integration (Forms)**

### **Setup Supabase for Waitlist/Early Bird Forms**

#### **1. Create Supabase Project**
```bash
# Go to https://supabase.com
# Create new project
# Note: Project URL & Anon Key
```

#### **2. Create Table**
```sql
-- In Supabase SQL Editor
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  phone TEXT,
  plan_type TEXT CHECK (plan_type IN ('earlybird', 'waitlist')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Add indexes
CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_created ON waitlist(created_at DESC);
```

#### **3. Install Supabase Client**
```bash
npm install @supabase/supabase-js
```

#### **4. Create Supabase Config**
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### **5. Add Environment Variables**
```bash
# .env
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### **6. Create Form Hook**
```typescript
// src/hooks/useWaitlist.ts
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const useWaitlist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinWaitlist = async (data: {
    email: string;
    name?: string;
    phone?: string;
    plan_type: 'earlybird' | 'waitlist';
  }) => {
    setLoading(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('waitlist')
        .insert([data]);

      if (supabaseError) throw supabaseError;

      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { joinWaitlist, loading, error };
};
```

#### **7. Use in Components**
```typescript
// In FamilyKnowsHero.tsx or EarlyAdopterSection.tsx
import { useWaitlist } from '../../hooks/useWaitlist';

const { joinWaitlist, loading, error } = useWaitlist();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const result = await joinWaitlist({
    email: formData.email,
    name: formData.name,
    plan_type: 'earlybird', // or 'waitlist'
  });

  if (result.success) {
    // Show success message
    // Redirect to thank you page
  }
};
```

---

## 🚀 **Deployment to Vercel**

### **Method 1: Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd FamilyKnows-Website
vercel
```

### **Method 2: GitHub Integration**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import GitHub repository
4. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Add Environment Variables (Supabase keys)
6. Deploy

### **vercel.json Configuration**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 📝 **Content Strategy**

### **Scarcity Messaging**
- **Current**: 150 families using, 100 spots left
- **Update**: Decrease spots as signups increase
- **Location**: Hero section, Early Adopter section

### **Trust Signals**
- **DPDPA Badge**: Currently placeholder - add certification when obtained
- **Testimonials**: Add when beta users provide feedback
- **Press**: Add Eenadu reference (create custom graphic)

### **Languages**
- **Current**: Telugu, Hindi mentioned
- **Add**: Language selector in navbar (future)
- **Copy**: Update as more languages added

---

## 🎨 **Customization Guide**

### **Change Colors**
Edit theme files in `src/config/theme/themes/`

### **Change Pricing**
Edit `EarlyAdopterSection.tsx`:
- Line ~80: `₹1,800/year` (regular price)
- Line ~82: `₹900` (early bird price)

### **Change Spot Count**
Edit `FamilyKnowsHero.tsx`:
- Line ~8: `useState(100)` - starting spots

### **Update Stories**
Edit `StorytellingSection.tsx`:
- Line ~10-104: `stories` array

---

## 📱 **Responsive Design**

All components are mobile-first and responsive:
- **Desktop**: Full 3D effects, side-by-side layouts
- **Tablet**: Adapted grid, maintained 3D
- **Mobile**: Stacked layout, simplified animations

Breakpoints:
- **Desktop**: >1024px
- **Tablet**: 768-1024px
- **Mobile**: <768px

---

## ✅ **Launch Checklist**

- [ ] Choose default theme
- [ ] Set up Supabase
- [ ] Add real testimonials (when available)
- [ ] Update DPDPA badge (when certified)
- [ ] Connect form submissions to Supabase
- [ ] Add analytics (Google Analytics / Plausible)
- [ ] Test all CTAs
- [ ] Mobile testing
- [ ] SEO meta tags
- [ ] Deploy to Vercel
- [ ] Custom domain
- [ ] SSL certificate (auto via Vercel)

---

## 🤝 **Support**

For questions or issues:
1. Check this README
2. Review component files
3. Test in development mode
4. Check browser console for errors

---

**Built with ❤️ for Indian Families**
