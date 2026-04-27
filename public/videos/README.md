# Website videos

Add public website videos in this folder and manage them from `data/videos.ts`.

Recommended video guidance:

- Format: MP4
- Recommended resolution: 1080p
- Keep videos compressed for web performance
- Use short highlight clips where possible so mobile visitors do not download heavy files
- Add matching thumbnails in `public/videos/thumbnails/`

How to add a video:

1. Place the MP4 file in `public/videos/`.
2. Place the thumbnail in `public/videos/thumbnails/`.
3. Add an item to the `videos` array in `data/videos.ts`.
4. Use paths such as `/videos/padel-highlight.mp4` and `/videos/thumbnails/padel-highlight.webp`.

Recommended thumbnail guidance:

- Size: 1280 x 720 px
- Aspect ratio: 16:9
- Format: WebP preferred, JPG acceptable
- Keep thumbnails sharp and lightweight
