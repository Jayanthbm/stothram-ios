import React, { useEffect, useState } from "react";
import { AD_ID, PUB_ID } from "../constants.jsx";
const AdsenseTop = () => {
  const [adsenseTopContent, setAdsenseTopContent] = useState("");

  const loadAdsense = false;
  useEffect(() => {
    function init() {
      try {
        setAdsenseTopContent(
          `<ins class="adsbygoogle" style="display:block" data-ad-client="${PUB_ID}" data-ad-slot="${AD_ID()}"></ins>`,
        );
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error("Error loading AdsenseTop:", error);
      }
    }
    if (loadAdsense) {
      init();
    }
  }, []);

  return (
    <div
      id="adsense-top"
      dangerouslySetInnerHTML={{ __html: adsenseTopContent }}
    ></div>
  );
};

export default AdsenseTop;
