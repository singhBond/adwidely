export function isValidVideoUrl(url: string) {
  const yt =
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

  const drive =
    /^https:\/\/drive\.google\.com\/file\/d\/.+$/;

  const mp4 =
    /^https?:\/\/.+\.mp4$/;

  return yt.test(url) || drive.test(url) || mp4.test(url);
}
