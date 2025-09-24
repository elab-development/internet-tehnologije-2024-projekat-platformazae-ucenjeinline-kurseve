/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import {
  Download,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';

const VideoPlayer = ({
  width = '100%',
  height = '100%',
  url,
  onProgressUpdate,
  progressData,
}) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [playedPercent, setPlayedPercent] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef?.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleProgress = (state) => {
    if (!seeking) {
      setPlayedPercent(state.played);
    }
  };

  const handleSeekChange = (newValue) => {
    setPlayedPercent(newValue[0]);
    setSeeking(true);
  };

  const handleSeekMouseUp = () => {
    setSeeking(false);
    playerRef.current?.seekTo(playedPercent);
  };

  const handleVolumeChange = (newValue) => {
    setVolume(newValue[0]);
  };

  const pad = (string) => {
    return ('0' + string).slice(-2);
  };

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds();
    if (hh) {
      return `${hh}:${pad(mm)}:${pad(ss)}`;
    }
    return `${pad(mm)}:${pad(ss)}`;
  };

  const handleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      if (playerContainerRef?.current?.requestFullscreen) {
        playerContainerRef?.current?.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullScreen]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    if (progressData && playedPercent === 1) {
      onProgressUpdate({
        ...progressData,
        progressValue: playedPercent,
      });
    }
  }, [playedPercent]);

  return (
    <div
      ref={playerContainerRef}
      className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out ${
        isFullScreen ? 'w-screen h-screen' : ''
      }`}
      style={{
        width,
        height,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        className='absolute top-0 left-0'
        width={'100%'}
        height={'100%'}
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
      />
      {showControls && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 p-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Slider
            value={[playedPercent * 100]}
            max={100}
            step={0.1}
            onValueChange={(value) => handleSeekChange([value[0] / 100])}
            onValueCommit={handleSeekMouseUp}
            className='w-full mb-4'
          />
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setPlaying(!playing)}
                className='text-white bg-transparent hover:text-white hover:bg-gray-700'
              >
                {playing ? (
                  <Pause className='h-6 w-6' />
                ) : (
                  <Play className='h-6 w-6' />
                )}
              </Button>
              <Button
                variant='ghost'
                size='icon'
                onClick={() =>
                  playerRef?.current?.seekTo(
                    playerRef?.current?.getCurrentTime() - 5
                  )
                }
                className='text-white bg-transparent hover:text-white hover:bg-gray-700'
              >
                <RotateCcw className='h-6 w-6' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                onClick={() =>
                  playerRef?.current?.seekTo(
                    playerRef?.current?.getCurrentTime() + 5
                  )
                }
                className='text-white bg-transparent hover:text-white hover:bg-gray-700'
              >
                <RotateCw className='h-6 w-6' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setMuted(!muted)}
                className='text-white bg-transparent hover:text-white hover:bg-gray-700'
              >
                {muted ? (
                  <VolumeX className='h-6 w-6' />
                ) : (
                  <Volume2 className='h-6 w-6' />
                )}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={(value) => handleVolumeChange([value[0] / 100])}
                className='w-24'
              />
            </div>
            <div className='flex items-center space-x-2'>
              <div className='text-white text-sm'>
                {formatTime(
                  playedPercent * playerRef?.current?.getDuration() || 0
                )}{' '}
                / {formatTime(playerRef?.current?.getDuration() || 0)}
              </div>
              <a target='_blank' href={url}>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-white bg-transparent hover:text-white hover:bg-gray-700'
                >
                  <Download />
                </Button>
              </a>
              <Button
                variant='ghost'
                size='icon'
                onClick={handleFullScreen}
                className='text-white bg-transparent hover:text-white hover:bg-gray-700'
              >
                {isFullScreen ? (
                  <Minimize className='h-6 w-6' />
                ) : (
                  <Maximize className='h-6 w-6' />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
