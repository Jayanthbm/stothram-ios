let currentAudio = null;
let currentUrl = null;
let isPlaying = false;
let duration = 0;
let currentTime = 0;
let playbackRate = 1;
let progressInterval = null;

const listeners = new Set();

let activeStartTimestamp = 0;
let activeEndTimestamp = 0;

const notifyListeners = () => {
  const state = {
    isPlaying,
    currentTime,
    duration,
    currentUrl,
    activeStartTimestamp,
    activeEndTimestamp,
    playbackRate,
  };
  listeners.forEach((cb) => cb(state));
};

export const subscribeAudioState = (callback) => {
  listeners.add(callback);
  callback({
    isPlaying,
    currentTime,
    duration,
    currentUrl,
    activeStartTimestamp,
    activeEndTimestamp,
    playbackRate,
  });
  return () => {
    listeners.delete(callback);
  };
};

export const setPlaybackRate = (rate) => {
  playbackRate = rate;
  if (currentAudio) {
    currentAudio.playbackRate = rate;
  }
  notifyListeners();
};

export const getPlaybackRate = () => playbackRate;

const startProgressTimer = () => {
  stopProgressTimer();
  progressInterval = setInterval(() => {
    if (currentAudio && isPlaying) {
      currentTime = currentAudio.currentTime;
      duration = currentAudio.duration || 0;
      notifyListeners();

      if (activeEndTimestamp > 0 && currentTime >= activeEndTimestamp) {
        stopAudioTrack();
      }
    }
  }, 200);
};

const stopProgressTimer = () => {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
};

export const playAudioTrack = ({
  url,
  title = "Stothram",
  start = 0,
  end = 0,
}) => {
  if (!url) return;

  const targetStart = start || 0;
  const targetEnd = end > 0 ? end : 0;

  if (currentAudio && currentUrl === url) {
    const isSameSegment =
      targetStart === 0 && targetEnd === 0
        ? activeStartTimestamp === 0 && activeEndTimestamp === 0
        : activeStartTimestamp === targetStart && activeEndTimestamp === targetEnd;

    if (isSameSegment) {
      if (isPlaying) {
        pauseAudioTrack();
      } else {
        if (activeEndTimestamp > 0 && currentTime >= activeEndTimestamp - 0.5) {
          currentAudio.currentTime = activeStartTimestamp;
          currentTime = activeStartTimestamp;
        }
        currentAudio.playbackRate = playbackRate;
        currentAudio.play().catch((err) => console.error("Audio play error:", err));
        isPlaying = true;
        startProgressTimer();
        notifyListeners();
      }
    } else {
      activeStartTimestamp = targetStart;
      activeEndTimestamp = targetEnd;
      currentTime = targetStart;
      currentAudio.currentTime = targetStart;
      currentAudio.playbackRate = playbackRate;
      currentAudio.play().catch((err) => console.error("Audio play error:", err));
      isPlaying = true;
      startProgressTimer();
      notifyListeners();
    }
    return;
  }

  stopAudioTrack();

  currentUrl = url;
  activeStartTimestamp = targetStart;
  activeEndTimestamp = targetEnd;
  currentTime = targetStart;

  const audio = new Audio(url);
  audio.playbackRate = playbackRate;

  audio.onloadedmetadata = () => {
    duration = audio.duration || 0;
    if (targetStart > 0) {
      audio.currentTime = targetStart;
    }
    notifyListeners();
  };

  audio.onended = () => {
    isPlaying = false;
    stopProgressTimer();
    notifyListeners();
  };

  audio.onerror = (err) => {
    console.error("Audio failed to load:", err);
    stopAudioTrack();
  };

  currentAudio = audio;
  audio.play().catch((err) => console.error("Audio play error:", err));
  isPlaying = true;
  startProgressTimer();
  notifyListeners();
};

export const pauseAudioTrack = () => {
  if (currentAudio && isPlaying) {
    currentAudio.pause();
    isPlaying = false;
    stopProgressTimer();
    notifyListeners();
  }
};

export const seekAudioTrack = (seconds) => {
  if (currentAudio) {
    currentAudio.currentTime = seconds;
    currentTime = seconds;
    notifyListeners();
  }
};

export const stopAudioTrack = () => {
  stopProgressTimer();
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (err) {
      console.error("Error stopping audio:", err);
    }
    currentAudio = null;
    currentUrl = null;
    isPlaying = false;
    duration = 0;
    currentTime = 0;
    activeStartTimestamp = 0;
    activeEndTimestamp = 0;
    notifyListeners();
  }
};
