import { memeTitles, videoTitles } from './media-titles';

export interface MediaItem {
  id: string;
  url: string;
  caption: string;
}

// Dynamically import all images
const imageModules = import.meta.glob('../assets/images/*.{jpg,png,jpeg,gif}', { eager: true });
const videoModules = import.meta.glob('../assets/videos/*.{mp4,webm}', { eager: true });

export const imagesData: MediaItem[] = Object.entries(imageModules).map(([path, module]: [string, any], index) => {
  // Use sequential mapping, fallback to default title if index > titles.length
  const fallbackCaption = "তেল দিমুনা।";
  const caption = index < videoTitles.length ? videoTitles[index] : fallbackCaption;
  return {
    id: `viral_vid_${index + 1}`,
    url: module.default,
    caption: caption
  };
});

export const videosData: MediaItem[] = Object.entries(videoModules).map(([path, module]: [string, any], index) => {
  // Use sequential mapping, fallback to default title if index > titles.length
  const fallbackCaption = "তেলের লাইনের ";
  const caption = index < videoTitles.length ? videoTitles[index] : fallbackCaption;

  return {
    id: `viral_vid_${index + 1}`,
    url: module.default,
    caption: caption
  };
});
