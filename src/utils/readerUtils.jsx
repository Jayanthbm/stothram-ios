/**
 * Safely extracts audio URL string from audio object or string.
 */
export const extractAudioUrl = (audioObj) => {
  if (!audioObj) return null;
  if (typeof audioObj === 'string' && audioObj.trim().length > 0) {
    return audioObj.trim();
  }
  if (typeof audioObj === 'object') {
    if (typeof audioObj.url === 'string' && audioObj.url.trim().length > 0) {
      return audioObj.url.trim();
    }
    if (typeof audioObj.audioUrl === 'string' && audioObj.audioUrl.trim().length > 0) {
      return audioObj.audioUrl.trim();
    }
    if (typeof audioObj.audio === 'string' && audioObj.audio.trim().length > 0) {
      return audioObj.audio.trim();
    }
  }
  return null;
};

/**
 * Resolves the font family for a given content type and display language.
 */
export const getFontForLanguage = (fonts, language, type = 'paragraph') => {
  if (!fonts) return undefined;
  if (language && fonts[language] && fonts[language][type]) {
    return fonts[language][type];
  }
  if (fonts.default && fonts.default[type]) {
    return fonts.default[type];
  }
  return undefined;
};

/**
 * Resolves effective audio URL and timestamps for a paragraph.
 */
export const resolveAudioData = (globalAudio, paragraphAudio) => {
  const paragraphUrl = extractAudioUrl(paragraphAudio);
  const globalUrl = extractAudioUrl(globalAudio);

  const url = paragraphUrl || globalUrl || null;
  const start = paragraphAudio?.start || 0;
  const end = paragraphAudio?.end || 0;

  return { url, start, end };
};

/**
 * Resolves available language codes from supportedLanguages.
 */
export const getAvailableLanguages = (supportedLanguages) => {
  if (!supportedLanguages) return ['kn'];
  const textLangs = supportedLanguages.text || [];
  const transliterationLangs = supportedLanguages.transliterations || [];
  const allLangs = Array.from(new Set([...textLangs, ...transliterationLangs]));
  return allLangs.length > 0 ? allLangs : ['kn'];
};

/**
 * Scans readerData and returns array of language codes where meanings exist.
 */
export const getAvailableMeaningLanguages = (readerData) => {
  if (!readerData?.content || !Array.isArray(readerData.content)) return [];
  const langSet = new Set();
  readerData.content.forEach((item) => {
    if (item?.meanings) {
      Object.keys(item.meanings).forEach((langKey) => {
        const langObj = item.meanings[langKey];
        if (Array.isArray(langObj?.text) && langObj.text.length > 0) {
          langSet.add(langKey);
        }
      });
    }
  });
  return Array.from(langSet);
};

/**
 * Checks if reader data content contains any populated meanings.
 */
export const hasMeaningsInContent = (readerData) => {
  return getAvailableMeaningLanguages(readerData).length > 0;
};

/**
 * Resolves meaning text lines for a paragraph given selectedLanguage and available Meaning languages.
 */
export const resolveMeaningLines = (
  meaningsDict,
  selectedLanguage,
  defaultLanguage = 'kn',
) => {
  if (!meaningsDict || typeof meaningsDict !== 'object') return [];

  // 1. Try selectedLanguage
  if (
    Array.isArray(meaningsDict[selectedLanguage]?.text) &&
    meaningsDict[selectedLanguage].text.length > 0
  ) {
    return meaningsDict[selectedLanguage].text;
  }

  // 2. Try defaultLanguage
  if (
    Array.isArray(meaningsDict[defaultLanguage]?.text) &&
    meaningsDict[defaultLanguage].text.length > 0
  ) {
    return meaningsDict[defaultLanguage].text;
  }

  // 3. Fallback to any first language in meanings object that has text
  for (const langKey of Object.keys(meaningsDict)) {
    const textArr = meaningsDict[langKey]?.text;
    if (Array.isArray(textArr) && textArr.length > 0) {
      return textArr;
    }
  }

  return [];
};
