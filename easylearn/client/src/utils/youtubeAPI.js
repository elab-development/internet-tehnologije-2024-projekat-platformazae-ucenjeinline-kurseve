import axios from 'axios';

export const fetchYoutubeVideos = async (query) => {
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  const res = await axios.get(
    `https://youtube.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&q=${query}`
  );

  return res.data.items;
};
