import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "@/translations/en";
import es from "@/translations/es";
import fr from "@/translations/fr";
import zh from "@/translations/zh";
import ar from "@/translations/ar";
import hi from "@/translations/hi";
import pt from "@/translations/pt";
import ru from "@/translations/ru";
import de from "@/translations/de";
import ja from "@/translations/ja";
import ko from "@/translations/ko";

export const i18n = new I18n({
  en,
  es,
  fr,
  zh,
  ar,
  hi,
  pt,
  ru,
  de,
  ja,
  ko,
});

i18n.defaultLocale = "en";
i18n.enableFallback = true;

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
];

const LANGUAGE_STORAGE_KEY = "@truckspulse_language";

export async function getStoredLanguage(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    return null;
  }
}

export async function storeLanguage(languageCode: string): Promise<void> {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
  } catch {
    console.error("Failed to store language preference");
  }
}

export function getDeviceLanguage(): string {
  const deviceLocales = Localization.getLocales();
  if (deviceLocales && deviceLocales.length > 0) {
    const languageCode = deviceLocales[0].languageCode;
    if (languageCode && SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode)) {
      return languageCode;
    }
  }
  return "en";
}

export async function initializeLanguage(): Promise<string> {
  const storedLanguage = await getStoredLanguage();
  if (storedLanguage && SUPPORTED_LANGUAGES.some(lang => lang.code === storedLanguage)) {
    i18n.locale = storedLanguage;
    return storedLanguage;
  }
  
  const deviceLanguage = getDeviceLanguage();
  i18n.locale = deviceLanguage;
  return deviceLanguage;
}

export function setLanguage(languageCode: string): void {
  if (SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode)) {
    i18n.locale = languageCode;
    storeLanguage(languageCode);
  }
}

export function t(key: string, options?: Record<string, any>): string {
  return i18n.t(key, options);
}

export function isRTL(languageCode?: string): boolean {
  const code = languageCode || i18n.locale;
  return code === "ar";
}
