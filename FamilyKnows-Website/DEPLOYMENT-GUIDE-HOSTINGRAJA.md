# FamilyKnows Website Deployment Guide - HostingRaja cPanel

## 🎉 Build Complete!

Your FamilyKnows website has been built and is ready for deployment to HostingRaja cPanel.

**Build Location:** `/FamilyKnows-Website/dist/`
**Build Size:** ~239 KB (optimized)
**Files Ready:** ✅ All cleaned and vikuna-free

---

## 📦 What's in the Build Package

```
dist/
├── index.html              # Main HTML file
├── .htaccess              # Apache config for React Router
├── assets/
│   ├── index-*.css        # Optimized CSS (38KB)
│   └── index-*.js         # Optimized JavaScript (200KB)
├── vite.svg               # Vite logo
└── *.svg files            # Other images
```

---

## 🚀 DEPLOYMENT STEPS - HostingRaja cPanel

### Step 1: Login to HostingRaja cPanel

1. Go to your HostingRaja account
2. Access cPanel dashboard
3. Look for **File Manager** in the Files section

---

### Step 2: Navigate to public_html

1. Click **File Manager**
2. Navigate to `public_html` folder
3. **IMPORTANT:** This is where your website files will go

---

### Step 3: Backup Existing Files (if any)

1. Select all files in `public_html`
2. Click **Compress** → Create archive (backup.zip)
3. Download the backup to your computer
4. Now you can safely delete old files

---

### Step 4: Upload FamilyKnows Website Files

**Option A: Using File Manager (Recommended)**

1. In cPanel File Manager, go to `public_html`
2. Click **Upload** button
3. Upload ALL files from `/FamilyKnows-Website/dist/` folder:
   - `index.html`
   - `.htaccess` ⚠️ **IMPORTANT - Don't skip this!**
   - `assets` folder (entire folder)
   - All `.svg` files
   - `generate-seo-files.js`

**Option B: Using FTP**

1. Download FileZilla or any FTP client
2. Connect using HostingRaja FTP credentials:
   - Host: `ftp.familyknows.in` or IP provided by HostingRaja
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21
3. Navigate to `public_html` folder
4. Upload all files from `dist/` folder

---

### Step 5: Set Correct File Permissions

In cPanel File Manager:

1. Select `.htaccess` → Right-click → **Permissions**
   - Set to: **644** (rw-r--r--)
2. Select `index.html` → Right-click → **Permissions**
   - Set to: **644** (rw-r--r--)
3. Select `assets` folder → Right-click → **Permissions**
   - Set to: **755** (rwxr-xr-x)
4. All `.js` and `.css` files in assets:
   - Set to: **644** (rw-r--r--)

---

### Step 6: Verify .htaccess is Working

1. In cPanel, go to **File Manager**
2. Click **Settings** (top right)
3. ✅ Check "Show Hidden Files (dotfiles)"
4. Click **Save**
5. Verify you can now see `.htaccess` file in `public_html`

---

### Step 7: Test Your Website

1. Open browser
2. Visit: **http://familyknows.in**
3. Check:
   - ✅ Website loads correctly
   - ✅ All images and styles load
   - ✅ No 404 errors
   - ✅ Navigation works (if you have multiple pages)

---

## 🔧 TROUBLESHOOTING

### Issue: Website shows "403 Forbidden"

**Solution:**
- Check `index.html` permissions are **644**
- Check folder permissions are **755**

### Issue: Website shows blank page or "Cannot GET /"

**Solution:**
- Verify `index.html` is in the root of `public_html`
- Clear browser cache (Ctrl+F5)
- Check browser console for errors (F12)

### Issue: Styles not loading (website looks broken)

**Solution:**
- Check that `assets/` folder is uploaded completely
- Verify `assets/` folder permissions are **755**
- Clear browser cache (Ctrl+F5)

### Issue: 404 errors on navigation

**Solution:**
- Verify `.htaccess` file is uploaded
- Check `.htaccess` permissions are **644**
- Ensure "Show Hidden Files" is enabled in cPanel File Manager

### Issue: "Internal Server Error" or "500 Error"

**Solution:**
- Check `.htaccess` syntax
- Verify mod_rewrite is enabled (contact HostingRaja if not)
- Check error logs in cPanel → **Error Logs**

---

## 🌐 SSL Certificate Setup (HTTPS)

### Enable Free SSL via cPanel

1. In cPanel, search for **SSL/TLS Status**
2. Click **Run AutoSSL**
3. Wait 5-10 minutes for certificate installation
4. Your site will now be accessible via **https://familyknows.in**

**OR**

1. In cPanel, go to **SSL/TLS**
2. Select **Let's Encrypt SSL**
3. Install free certificate for `familyknows.in`

---

## ⚡ PERFORMANCE OPTIMIZATION (Optional)

### Enable Caching in cPanel

1. Go to **Optimize Website** in cPanel
2. Select **Compress All Content**
3. Click **Update Settings**

### Enable Cloudflare (Free CDN)

1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Add your domain: `familyknows.in`
3. Update nameservers in HostingRaja domain settings
4. Benefits: Faster loading, DDoS protection, free SSL

---

## 📊 POST-DEPLOYMENT CHECKLIST

- [ ] Website loads at http://familyknows.in
- [ ] All images load correctly
- [ ] No console errors (F12 → Console)
- [ ] Styles are applied correctly
- [ ] Navigation works (if applicable)
- [ ] .htaccess is present and working
- [ ] SSL certificate installed (https works)
- [ ] Mobile responsive (test on phone)
- [ ] Contact forms work (if any)
- [ ] SEO meta tags are correct (check page source)

---

## 🔄 FUTURE UPDATES

When you need to update the website:

1. Pull latest code from git
2. Make your changes
3. Rebuild: `cd FamilyKnows-Website && npm run build`
4. Upload new files from `dist/` to cPanel
5. **Keep `.htaccess`** - don't overwrite unless needed

---

## 📞 SUPPORT CONTACTS

**HostingRaja Support:**
- Phone: Check your HostingRaja account
- Email: support@hostingraja.in
- Live Chat: Available on HostingRaja dashboard

**Common Support Requests:**
- "Please enable mod_rewrite for my domain"
- "Please check why .htaccess is not working"
- "Please help install SSL certificate"

---

## 📝 DEPLOYMENT SUMMARY

✅ **Cleaned up:** All Vikuna references removed
✅ **Built:** Production-ready optimized files
✅ **Size:** 239 KB total (very fast!)
✅ **Ready:** All files in `dist/` folder
✅ **.htaccess:** Created for React Router support
✅ **SEO:** FamilyKnows branding updated

**Next Step:** Upload `dist/` folder contents to cPanel public_html

---

## 🎯 QUICK START (TL;DR)

1. Login to HostingRaja cPanel
2. Go to File Manager → public_html
3. Delete old files (backup first!)
4. Upload ALL files from `FamilyKnows-Website/dist/`
5. Don't forget `.htaccess` file!
6. Visit http://familyknows.in
7. Done! 🎉

---

**Built with ❤️ for Indian Families**
