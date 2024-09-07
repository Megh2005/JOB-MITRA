import React, { useEffect, useRef } from "react";

const TranslateComponent = () => {
  const googleTranslateRef = useRef(null);
  useEffect(() => {
    let intervalid;

    const checkGoogleTranslate = () => {
      if (window.google && window.google.translate) {
        clearInterval(intervalid);
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          googleTranslateRef.current
        );
      }
    };
    intervalid = setInterval(checkGoogleTranslate, 100);
  }, []);
  return (
    <div className="w-screen">
      <div className="w-screen overflow-scroll" ref={googleTranslateRef}></div>
    </div>
  );
};

export default TranslateComponent;
