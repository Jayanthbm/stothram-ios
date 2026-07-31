import React, { memo, useEffect, useState } from "react";
import { MdPlayCircle, MdPauseCircle, MdStopCircle } from "react-icons/md";
import {
  playAudioTrack,
  seekAudioTrack,
  stopAudioTrack,
  subscribeAudioState,
} from "../services/audioService";
import "./ReaderAudioButton.css";

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const ReaderAudioButton = memo(
  ({
    audioUrl,
    start = 0,
    end = 0,
    isTopPlayer = false,
    title = "",
    displayTitle = "",
    onPress,
  }) => {
    const [isConnected, setIsConnected] = useState(navigator.onLine);
    const [audioState, setAudioState] = useState({
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      currentUrl: null,
      activeStartTimestamp: 0,
      activeEndTimestamp: 0,
    });

    useEffect(() => {
      const handleOnline = () => setIsConnected(true);
      const handleOffline = () => setIsConnected(false);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      const unsubscribeAudio = subscribeAudioState((state) => {
        setAudioState(state);
      });

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        unsubscribeAudio();
      };
    }, []);

    if (!isConnected) {
      return null;
    }

    const hasUrl = typeof audioUrl === "string" && audioUrl.trim().length > 0;
    const hasTimestamps = start !== 0 || end !== 0;

    if (isTopPlayer) {
      if (!hasUrl) return null;
    } else {
      if (!hasUrl || !hasTimestamps) return null;
    }

    const isThisTrackLoaded =
      audioState.currentUrl === audioUrl &&
      (isTopPlayer
        ? true
        : audioState.activeStartTimestamp === start &&
          audioState.activeEndTimestamp === end);

    const isThisPlaying = isThisTrackLoaded && audioState.isPlaying;

    const handlePlayPause = () => {
      if (onPress) {
        onPress();
      } else {
        playAudioTrack({
          url: audioUrl,
          title: displayTitle || title || "Stothram Audio",
          start,
          end,
        });
      }
    };

    const handleStop = () => {
      stopAudioTrack();
    };

    const handleSliderChange = (e) => {
      const value = parseFloat(e.target.value);
      if (!isThisTrackLoaded) {
        playAudioTrack({
          url: audioUrl,
          title: displayTitle || title || "Stothram Audio",
          start: value,
          end,
        });
      } else {
        seekAudioTrack(value);
      }
    };

    const sliderMin = end > start ? start : 0;
    const sliderMax =
      end > start ? end : audioState.duration > 0 ? audioState.duration : 100;
    const sliderValue = isThisTrackLoaded
      ? Math.min(sliderMax, Math.max(sliderMin, audioState.currentTime))
      : sliderMin;

    if (!isTopPlayer) {
      return (
        <div className="audio-segment-container">
          <button
            className="audio-icon-btn"
            onClick={handlePlayPause}
            title={isThisPlaying ? "Pause" : "Play"}
          >
            {isThisPlaying ? (
              <MdPauseCircle size={26} color="var(--primary)" />
            ) : (
              <MdPlayCircle size={26} color="var(--primary)" />
            )}
          </button>
          {isThisTrackLoaded && (
            <>
              <input
                type="range"
                className="audio-slider"
                min={sliderMin}
                max={sliderMax}
                step={0.1}
                value={sliderValue}
                onChange={handleSliderChange}
              />
              <button
                className="audio-icon-btn"
                onClick={handleStop}
                title="Stop"
              >
                <MdStopCircle size={24} color="var(--error, #b00020)" />
              </button>
            </>
          )}
        </div>
      );
    }

    if (!isThisTrackLoaded) {
      return (
        <div className="audio-top-idle-container">
          <button
            className="audio-icon-btn"
            onClick={handlePlayPause}
            title="Play Audio"
          >
            <MdPlayCircle size={30} color="var(--primary)" />
          </button>
        </div>
      );
    }

    return (
      <div className="audio-top-container">
        <div className="audio-player-card">
          <div className="audio-controls-row">
            <button
              className="audio-icon-btn"
              onClick={handlePlayPause}
              title={isThisPlaying ? "Pause" : "Play"}
            >
              {isThisPlaying ? (
                <MdPauseCircle size={32} color="var(--on-primary-container, #ffffff)" />
              ) : (
                <MdPlayCircle size={32} color="var(--on-primary-container, #ffffff)" />
              )}
            </button>

            <input
              type="range"
              className="audio-top-slider"
              min={0}
              max={audioState.duration || 100}
              step={0.1}
              value={audioState.currentTime}
              onChange={handleSliderChange}
            />

            <button
              className="audio-icon-btn"
              onClick={handleStop}
              title="Stop"
            >
              <MdStopCircle size={30} color="var(--on-primary-container, #ffffff)" />
            </button>
          </div>

          <div className="audio-timer-row">
            <span className="audio-time-text">
              {formatTime(audioState.currentTime)}
            </span>
            <span className="audio-time-text">
              {formatTime(audioState.duration)}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

export default ReaderAudioButton;
