# Website videos

Add public website videos in this folder and manage every video from:

```txt
data/videos.ts
```

The Highlights page supports local MP4 videos, YouTube links, TikTok links, Instagram embeds, and external video links.

## Recommended video guidance

- Format for local files: MP4
- Recommended resolution: 1080p
- Keep videos compressed for web performance
- Use short highlight clips where possible so mobile visitors do not download heavy files
- Add matching thumbnails in `public/videos/thumbnails/`
- Videos do not autoplay. Users click a card before the player loads.

## Recommended thumbnail guidance

- Size: 1280 x 720 px
- Aspect ratio: 16:9 for normal videos
- Use 9:16 thumbnail crops for vertical Shorts/TikTok-style videos if possible
- Format: WebP preferred, JPG acceptable
- Keep thumbnails sharp and lightweight

## How to add a local MP4 video

1. Place the MP4 file in `public/videos/`.
2. Place the thumbnail in `public/videos/thumbnails/`.
3. Add a new item to the `videos` array in `data/videos.ts`.
4. Set `type: "local"` and use paths such as:

```txt
/videos/padel-highlight.mp4
/videos/thumbnails/padel-highlight.webp
```

## How to add a YouTube or TikTok video

1. Copy the public video URL.
2. Open `data/videos.ts`.
3. Add a new object and set `type` to `"youtube"` or `"tiktok"`.
4. Add a title, description, category, alt text, and display order.

TikTok embeds can be inconsistent across browsers because TikTok controls its own embed behavior. The site uses a stable fallback: the embed loads only after click, and each card also includes an "Open original" link.
