export function useTranslate() {
    function applyLang(lang: string) {
        const select = document.querySelector(
            ".goog-te-combo"
        ) as HTMLSelectElement | null;

        if (lang === "pt") {
            const alreadyReset = sessionStorage.getItem("translate-reset");

            if (alreadyReset) {
                sessionStorage.removeItem("translate-reset");
                return;
            }

            sessionStorage.setItem("translate-reset", "true");

            document.cookie =
                "googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";

            document.cookie = `googtrans=;path=/;domain=${window.location.hostname};expires=Thu, 01 Jan 1970 00:00:00 GMT`;

            window.location.reload();
            return;
        }

        document.cookie = `googtrans=/pt/${lang};path=/`;
        document.cookie = `googtrans=/pt/${lang};path=/;domain=${window.location.hostname}`;

        if (!select) {
            return;
        }

        setTimeout(() => {
            select.value = lang;
            select.dispatchEvent(new Event("change", { bubbles: true }));
        }, 500);
    }

    function initGoogleTranslate() {

        const existing = document.getElementById('google-translate-script')

        if (existing) {
            console.groupEnd()
            return
        }

        const script = document.createElement('script')
        script.id = 'google-translate-script'
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
        script.async = true

        script.onerror = () => {
            console.error('❌ Erro ao carregar script do Google Translate')
        }

        document.body.appendChild(script)


        // @ts-ignore
        window.googleTranslateElementInit = () => {


            try {
                // @ts-ignore
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'pt',
                        includedLanguages: 'en,es',
                        autoDisplay: false
                    },
                    'google_translate_element'
                )


                let attempts = 0
                const interval = setInterval(() => {
                    const select = document.querySelector('.goog-te-combo')


                    if (select) {
                        clearInterval(interval)
                    }

                    attempts++
                    if (attempts > 20) {
                        clearInterval(interval)
                    }
                }, 300)

            } catch (err) {
                console.error('💥 Erro ao inicializar Google Translate:', err)
            }

        }

    }

    return {
        applyLang,
        initGoogleTranslate
    }
}