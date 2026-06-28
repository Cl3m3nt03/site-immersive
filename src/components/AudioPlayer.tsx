import { Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect } from 'react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export default function AudioPlayer() {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(40);
  const [player, setPlayer] = useState<any>(null);

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player('youtube-audio', {
        height: '0',
        width: '0',
        videoId: 'hRJMrM8P99c',
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: 'hRJMrM8P99c'
        },
        events: {
          onReady: (event: any) => {
            setPlayer(event.target);
            event.target.setVolume(volume);
          }
        }
      });
    };
  }, []);

  useEffect(() => {
    if (player) {
      if (playing) player.playVideo();
      else player.pauseVideo();
    }
  }, [playing, player]);

  useEffect(() => {
    if (player) {
      if (muted) player.mute();
      else player.unMute();
    }
  }, [muted, player]);

  useEffect(() => {
    if (player) {
      player.setVolume(volume);
    }
  }, [volume, player]);

  return (
    <div className="fixed bottom-8 left-8 z-[100] flex items-center gap-6 bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/5 shadow-2xl">
      <div id="youtube-audio" className="hidden"></div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => setPlaying(!playing)}
          className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-neon-blue/20 border border-white/10 transition-all duration-300"
        >
          {playing ? (
            <div className="flex gap-1 items-end h-3">
              <div className="w-1 bg-neon-blue animate-[bounce_1s_infinite_0.1s]" />
              <div className="w-1 bg-neon-blue animate-[bounce_1s_infinite_0.3s]" />
              <div className="w-1 bg-neon-blue animate-[bounce_1s_infinite_0.5s]" />
            </div>
          ) : (
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
          )}
        </button>

        <div className="flex flex-col min-w-[100px]">
          <span className="text-[8px] uppercase tracking-[0.3em] text-white/30 font-mono">Atmosphere</span>
          <span className="text-[10px] text-white/60 font-medium truncate">Silent Rise OST</span>
        </div>
      </div>

      <div className="flex items-center gap-3 border-l border-white/10 pl-6">
        <button
          onClick={() => setMuted(!muted)}
          className="text-white/40 hover:text-white transition-colors"
        >
          {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
          className="w-20 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-blue hover:accent-neon-blue/80 transition-all"
        />
        <span className="text-[9px] font-mono text-white/20 w-5">{volume}%</span>
      </div>
    </div>
  );
}
