export const translations = {
    es: {
        title: "EZ Calculadora",
        clearHistory: "Borrar Historial",
        clearHistoryConfirmation: "¿Confirmar borrado?",
        darkTheme: "Modo Oscuro",
        lightTheme: "Modo Claro",
        history: "Historial",
        changeLanguage: "English"
    },
    en: {
        title: "EZ Calculator",
        clearHistory: "Clear History",
        clearHistoryConfirmation: "Are you sure?",
        darkTheme: "Dark theme",
        lightTheme: "Light theme",
        history: "History",
        changeLanguage: "Español"
    }
};

export const languageManager = {
    current: "en",

    init() {
        const savedLanguageKey = localStorage.getItem(LANG_STORAGE_KEY);
        this.current = translations[savedLanguageKey] ? savedLanguageKey : DEFAULT_LANG;
        this.applyAll();      
    },

    set(newLanguage) {
        if (!translations[newLanguage]) return;
        this.current = newLanguage;
        localStorage.setItem(LANG_STORAGE_KEY, newLanguage);
        this.applyAll();
    },

    getTexts() {
        return translations[this.current];
    },

    setNextLanguage() {
        const keys = Object.keys(translations);
        const currentIndex = keys.indexOf(this.current);

        if (currentIndex === -1) {
            return keys[0]
        }

        const nextIndex = (currentIndex + 1) % keys.length;
        this.current = keys[nextIndex];
        this.applyAll();
    },

    applyAll() {
        document.documentElement.lang = this.current;
    }
}

export const DEFAULT_LANG = "en";
export const LANG_STORAGE_KEY = "calc-lang";