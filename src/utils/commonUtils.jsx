export  const containsNonEnglish = (text) => {
  if (!text) return false;
  return /[^A-Za-z0-9 .,!?'"@#$%^&*()_+\-=;:/\\|<>[\]{}~`]/.test(text);
};

export const getFontFamily = (text, fontFamily, fonts) => {
  if (fontFamily) {
    return fontFamily;
  } else if (fonts?.paragraph !== undefined) {
    return fonts?.paragraph;
  } else {
    return containsNonEnglish(text) ? "NudiParijathaBold" : "NotoSans";
  }
};