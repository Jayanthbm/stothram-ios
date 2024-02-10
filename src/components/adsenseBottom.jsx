import React, { useEffect, useState } from "react";
import { AD_ID, PUB_ID } from "../constants.jsx";
const AdsenseBottom = () => {
 const [adsenseBottomContent, setAdsenseBottomContent] = useState("");

  useEffect(() => {
    try {
      setAdsenseBottomContent(
        `<ins class="adsbygoogle" style="display:block" data-ad-client="${PUB_ID}" data-ad-slot="${AD_ID()}"></ins>`
      );
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("Error loading AdsenseTop:", error);
    }
  }, []);

  return (
    <div
      id="adsense-bottom"
      dangerouslySetInnerHTML={{ __html: adsenseBottomContent }}
    ></div>
  );
};

export default AdsenseBottom;
