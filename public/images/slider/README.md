# Homepage slider images

Add homepage slider images in this folder and update `data/siteContent.ts` under `siteContent.hero.slides`.

Recommended image guidance:

- Best size: 1920 x 1080 px
- Minimum size: 1600 x 900 px
- Aspect ratio: 16:9
- Format: WebP preferred, JPG acceptable
- Keep each image optimized, ideally under 500 KB where possible
- Use clear, high-quality Elite Courts sports or facility photos

How to add a slide:

1. Place the optimized image in `public/images/slider/`.
2. Add a new object to `siteContent.hero.slides` in `data/siteContent.ts`.
3. Use a path such as `/images/slider/my-new-slide.webp`.
4. Add a useful `alt`, `label`, and `caption`.

How to remove a slide:

1. Remove its object from `siteContent.hero.slides`.
2. Delete the unused image from this folder if it is no longer needed.
