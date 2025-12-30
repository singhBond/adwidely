export function getEmbedUrl(url: string) {
  // YouTube
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const id =
      url.split("v=")[1]?.split("&")[0] ||
      url.split("/").pop();
    return `https://www.youtube.com/embed/${id}`;
  }

  // Google Drive
  if (url.includes("drive.google.com")) {
    const id = url.split("/d/")[1]?.split("/")[0];
    return `https://drive.google.com/file/d/${id}/preview`;
  }

  // Direct MP4
  return url;
}
