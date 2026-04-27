export function useTranslate() {
function applyLang(lang: string) {
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null

    if (lang === 'pt') {
        const alreadyReset = sessionStorage.getItem('translate-reset')

        if (alreadyReset) {
            console.log('✅ Reset já aplicado, evitando loop')
            sessionStorage.removeItem('translate-reset')
            return
        }

        console.log('🔄 Resetando tradução para PT (original)')

        sessionStorage.setItem('translate-reset', 'true')

        document.cookie = 'googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT'
        document.cookie = `googtrans=;path=/;domain=${window.location.hostname};expires=Thu, 01 Jan 1970 00:00:00 GMT`

        window.location.reload()
        return
    }

    console.log('🌍 Aplicando idioma:', lang)

    document.cookie = `googtrans=/pt/${lang};path=/`
    document.cookie = `googtrans=/pt/${lang};path=/;domain=${window.location.hostname}`

    if (!select) {
        console.warn('Select não encontrado, usando só cookie')
        return
    }

    setTimeout(() => {
        select.value = lang
        select.dispatchEvent(new Event('change', { bubbles: true }))
    }, 500)
}

    function initGoogleTranslate() {
        console.group('🚀 [Translate] initGoogleTranslate')

        const existing = document.getElementById('google-translate-script')
        console.log('🔁 Script já existe?', !!existing)

        if (existing) {
            console.groupEnd()
            return
        }

        const script = document.createElement('script')
        script.id = 'google-translate-script'
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
        script.async = true

        script.onload = () => {
            console.log('📦 Script carregado com sucesso')
        }

        script.onerror = () => {
            console.error('❌ Erro ao carregar script do Google Translate')
        }

        document.body.appendChild(script)

        console.log('📥 Script inserido no DOM')

        // @ts-ignore
        window.googleTranslateElementInit = () => {
            console.group('⚙️ [Translate] googleTranslateElementInit')

            console.log('🧠 Inicializando Google Translate...')

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

                console.log('✅ Google Translate inicializado')

                let attempts = 0
                const interval = setInterval(() => {
                    const select = document.querySelector('.goog-te-combo')

                    console.log(`⏳ Tentativa ${attempts}: select existe?`, !!select)

                    if (select) {
                        console.log('🎉 Select finalmente apareceu!')
                        clearInterval(interval)
                    }

                    attempts++
                    if (attempts > 20) {
                        console.warn('⚠️ Select NÃO apareceu após várias tentativas')
                        clearInterval(interval)
                    }
                }, 300)

            } catch (err) {
                console.error('💥 Erro ao inicializar Google Translate:', err)
            }

            console.groupEnd()
        }

        console.groupEnd()
    }

    return {
        applyLang,
        initGoogleTranslate
    }
}