
export const LANG_REG = /^[a-z]{2}$/;
export const COUNTRY_REG = /^[a-z]{2}$/;
export const WIKI_DATA_ID_REG = /^Q\d+$/;

export function formatLocaleString(lang: string, country: string) {
    return `${lang.trim().toLowerCase()}_${country.trim().toLowerCase()}`;
}
