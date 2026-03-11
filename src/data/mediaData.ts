import { memeTitles, videoTitles } from './media-titles';

export interface MediaItem {
  id: string;
  url: string;
  caption: string;
}

// Image and video data generation
export const imagesData: MediaItem[] = Array.from({ length: 17 }, (_, index) => ({
  id: `meme_${index + 1}`,
  url: `/images/img${index + 1}.jpg`,
  caption: memeTitles[index] || ""
}));

export const videosData: MediaItem[] = Array.from({ length: 12 }).map((_, index) => {
  // Use sequential mapping, fallback to default title if index > titles.length
  const fallbackCaption = "তেলের লাইনের ";
  const caption = index < videoTitles.length ? videoTitles[index] : fallbackCaption;

  return {
    id: `viral_vid_${index + 1}`,
    url: `/videos/teler${index + 1}.mp4`,
    caption: caption
  };
});
