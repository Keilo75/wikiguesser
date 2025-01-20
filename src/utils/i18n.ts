import i18next from "i18next";

import en from "../assets/en.json";

i18next.init({
  lng: "en",
  resources: {
    en: {
      translation: en,
    },
  },
  interpolation: { escapeValue: false },
});
