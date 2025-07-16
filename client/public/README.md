# Public Directory Structure

This directory contains all static assets that will be served directly by Next.js.

## Directory Structure

```
public/
├── assets/         # General static assets
├── audio/          # Audio files (mp3, wav, etc.)
├── documents/      # PDF, DOC, and other document files
├── favicon/        # Favicon files in different sizes
├── fonts/          # Custom font files
├── icons/          # App icons and UI icons
├── images/         # Image files (jpg, png, webp, etc.)
├── manifest/       # PWA manifest files
├── robots/         # SEO-related files
├── sitemap/        # Sitemap files
└── video/          # Video files (mp4, webm, etc.)
```

## Usage

- All files in this directory are served at the root path
- For example, `public/images/logo.png` is available at `/images/logo.png`
- Use these paths in your React components without the `/public` prefix

## Best Practices

1. **Optimize Images**: Use WebP format when possible for better performance
2. **Organize by Type**: Keep similar assets in their respective directories
3. **SEO Files**: Keep robots.txt, sitemap.xml, and manifest.json at the root level
4. **Favicons**: Store different sizes in the `/favicon` directory
5. **Naming**: Use descriptive, kebab-case filenames

## Common Files

- `favicon.ico` - Main favicon
- `robots.txt` - Search engine crawler instructions
- `manifest.json` - PWA manifest file
- `sitemap.xml` - SEO sitemap (when generated) 