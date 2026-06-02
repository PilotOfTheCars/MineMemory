# MineMemory — The Operating System for Minecraft Worlds

MineMemory is an immersive, offline-first dashboard and survival logger designed as an operational companion terminal for Minecraft worlds. Track projects, coordinate vaults, safety logs, expeditions, journals, milestones, and explore embedded seed map components.

---

## 🚀 Live Build Deployment

The active production application has been compiled and deployed directly to Netlify:
* **Production Live Site URL:** [https://minememory.netlify.app/](https://minememory.netlify.app/)
* **Canonical Index Sitemap:** [https://minememory.netlify.app/sitemap.xml](https://minememory.netlify.app/sitemap.xml)

---

## 🔍 SEO & Crawlability Infrastructure

To ensure standard-compliant visibility and discoverability across search engines (Google, Bing, Yahoo!, DuckDuckGo), we have established a complete SEO suite that keeps the codebase lightweight and highly indexable.

### 1. Static Metadata Baseline (`/index.html`)
The root document is enriched with semantic SEO tags that deliver rich-snippet information on initial crawler connection:
- **Primary Keywords:** Optimized for core search terms such as `Minecraft world tracker`, `survival journal`, `coordinate vault`, `Hardcore tracker`, `seed map`, and `world archive`.
- **Open Graph (OG) Support:** Integrated schema tags (`og:title`, `og:description`, `og:image`, `og:url` + standard site identifiers) enabling structured social card generation on platforms like Discord, Facebook, and link-sharing apps.
- **Twitter/X Cards:** Configured streamlined summary layouts for clean social media timelines.
- **Embedded Favicon:** Standard `/minememory_icon.png` references mapped as a high-density icon and `apple-touch-icon`.

### 2. Microdata Schema (JSON-LD)
We have injected a valid schema markup block (`application/ld+json`) representing MineMemory as a high-performance **WebApplication**. This allows search engine search pages to render rich snippet badges (interactive utility features, application category tags, and zero-pricing indices).

### 3. Dynamic Crawler Sync (`src/App.tsx`)
Modern user crawlers (such as Googlebot) execute client-side JavaScript. To maximize indexing depth, a reactive `useEffect` engine modifies the document's header parameters inside the browser viewport:
- **Home Screen:** Focused title and specific terminal summary text are delivered.
- **Selection Screen:** Injects context for world selection, imports, and sync.
- **Creation Space:** Adjusts indices for profile configuration and terminal node initialization.
- **Active Dashboard:** Seamlessly updates the title and descriptions to present the active Minecraft world's name, gameplay mode (Survival/Hardcore), custom logs, and safety trackers.

### 4. Search Control System (`/public/robots.txt` & `/public/sitemap.xml`)
- `/public/robots.txt` explicitly allows complete navigation of our application structures, pointing crawls straight to our dedicated index map file.
- `/public/sitemap.xml` establishes the single canonical entry point for complete root crawlers.

---

## 🛠️ Step-by-Step Search Engine Submission Guides

Follow these steps to index your live site and monitor impressions, click-through rates, and console health metrics completely for free.

### 🌐 Google Search Console (GSC) Setup

1. **Access Google Search Console:**
   Go to [https://search.google.com/search-console/about](https://search.google.com/search-console/about) and sign in using your standard Google credentials.
   
2. **Add Your Web Property:**
   - In the sidebar property dropdown, select **"Add property"**.
   - Input your live Netlify address in the **URL Prefix** input slot:
     ```text
     https://minememory.netlify.app/
     ```
   - Click **Continue**.

3. **Verify Site Ownership (Free Netlify Methods):**
   * *Method A: HTML Meta Tag Verification (Recommended)*
     - GSC will provide an HTML verification tag that looks like:
       ```html
       <meta name="google-site-verification" content="YOUR_UNIQUE_KEY_HERE" />
       ```
     - Open `/index.html` in your codebase, insert this snippet in the `<head>` section, commit, and redeploy to Netlify.
     - Once deployed, click **Verify** in Search Console.
   * *Method B: DNS Verification (Custom Domains)*
     - If you attach a custom domain to your Netlify build, add the TXT record supplied by GSC inside your domain provider records or Netlify's DNS setting dashboard.

4. **Submit Your XML Sitemap:**
   - From GSC's sidebar menu under the *Indexing* section, click **Sitemaps**.
   - Locate the input box next to your site URL: `https://minememory.netlify.app/`
   - Type in: **`sitemap.xml`**
   - Click **Submit**. Google's crawlers will process the sitemap index immediately.

---

### 🔎 Bing Webmaster Tools Setup

1. **Access Bing Webmaster Portal:**
   Go to [https://www.bing.com/webmasters/about](https://www.bing.com/webmasters/about) and sign in using your Microsoft, Google, or Facebook account.

2. **Automated Google Search Console Import (Fastest Method):**
   - Bing Webmaster Tools offers an instant **"Import from Google Search Console"** button.
   - Click **Import**, authorize access to your GSC account, select `https://minememory.netlify.app/`, and all authorization states, ownership proofs, and sitemap registers will sync instantly with Bing.

3. **Manual URL Method (Alternative):**
   - If importing is skipped, hit **Add site** and input `https://minememory.netlify.app/`.
   - Take the meta verification code provided by Bing, insert it into `/index.html`'s `<head>`, redeploy, and click verify.
   - Go to the **Sitemaps** module inside Bing's system panel, hit **Submit sitemap**, and submit the URL:
     ```text
     https://minememory.netlify.app/sitemap.xml
     ```

---

## 📈 Netlify Static Performance Assets

Because Netlify is a global CDN, static delivery is incredibly fast. Having `/public/robots.txt` and `/public/sitemap.xml` stored statically means search engine crawlers fetch and process indexing files at sub-millisecond latencies, giving the domain high crawler-frequency marks!
