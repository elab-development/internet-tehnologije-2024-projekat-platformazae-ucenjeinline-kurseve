/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

import { fetchYoutubeVideos } from '../../utils/youtubeAPI';

const YoutubeVideos = ({ query = 'web development' }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetchYoutubeVideos(query);
        setVideos(res);
      } catch (error) {
        console.log(error);
      }
    };

    fetchVideos();
  }, [query]);

  return (
    <div className='flex gap-2 rounded-lg px-2'>
      {videos &&
        videos?.length > 0 &&
        videos.map((video, index) => (
          <div key={index}>
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${video?.id?.videoId}`}
              width={'100%'}
              height={'100%'}
            />
          </div>
        ))}
    </div>
  );
};

export default YoutubeVideos;
