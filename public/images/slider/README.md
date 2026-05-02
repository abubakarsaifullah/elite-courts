# Homepage slider images

Add homepage slider images in this folder and manage them from:

```txt
data/sliderImages.ts
```

The slider uses the optimized image files in this folder. Large original `.JPG` and `.PNG` source files can be kept outside `public/`, for example in `media-source/slider-originals/`, so they are not shipped as live website assets.

## Recommended image quality

- Best size: 1920 x 1080 px
- Better for very large screens: 2560 x 1440 px
- Minimum size: 1600 x 900 px
- Aspect ratio: 16:9
- Format: WebP preferred, high-quality JPG acceptable
- Use landscape photos for best results
- Use original camera-quality photos where possible
- Avoid screenshots, WhatsApp-compressed images, or small low-resolution images
- Optimize for web, but do not reduce visible quality. A clean slider image is more important than making the file extremely tiny.

## How the slider crops images

The website uses `object-fit: cover`, which means each image fills the full slider area without stretching or squeezing. On some screens, the browser may crop a little from the edges so there are no empty spaces.

You can control the crop focus from `data/sliderImages.ts` using `objectPosition`:

```ts
{
  id: "padel-night-session",
  src: "/images/slider/padel-night-session.webp",
  alt: "Padel session at Elite Courts Lahore",
  label: "Padel",
  caption: "A quick look at the action on court.",
  objectPosition: "center",
  quality: 95,
}
```

Useful `objectPosition` values:

```txt
center
 top
 bottom
 left center
 right center
 center top
 center bottom
```

If a face, player, court line, or important detail is being cut off, adjust `objectPosition` first before replacing the image.

## How to add a slide

1. Export the image as WebP or high-quality JPG.
2. Place it in `public/images/slider/`.
3. Use a simple lowercase filename, for example `padel-night-session.webp`.
4. Open `data/sliderImages.ts`.
5. Add a new object with `id`, `src`, `alt`, `label`, `caption`, `objectPosition`, and optional `quality`.
6. Keep the caption short so it remains readable on mobile.

Example path:

```txt
/images/slider/padel-night-session.webp
```

## How to replace an image without losing quality

1. Start from the original camera-quality file, not a social media download.
2. Crop/export to 16:9 if possible.
3. Keep the exported width at 1920 px or larger.
4. Use a high-quality WebP export, usually around quality 85-95.
5. Replace the file in this folder or add a new filename and update `data/sliderImages.ts`.
6. Check the homepage on mobile and desktop after replacing the image.

## How to remove a slide

1. Remove its object from `data/sliderImages.ts`.
2. Delete the unused image from this folder if it is no longer needed.

## What to avoid

- Do not use portrait photos unless there is no better option; they crop heavily in a landscape slider.
- Do not upload tiny photos and stretch them to fit the hero.
- Do not use text-heavy images because the hero already contains text and buttons.
- Do not over-compress the image until it looks blurry or patchy.
