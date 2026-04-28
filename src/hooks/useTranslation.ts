import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/lib/translations";

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (path: string): string => {
    return getTranslation(path, language);
  };

  return { t, language };
};
