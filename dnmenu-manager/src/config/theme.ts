// Configuração centralizada de cores e temas
export const THEME_CONFIG = {
    // Cor principal do efeito electric border (preços caros)
    electricBorderColor: '#9900ff', // Roxo vibrante - fácil de mudar aqui

    // Cor do background pixel blast
    pixelBlastColor: '#9900ff',

    // Variações de cores para diferentes contextos
    colors: {
        primary: '#9900ff',
        secondary: '#6600cc',
        accent: '#ff00ff',
    },
} as const;

// Para mudar a cor global, edite apenas o valor de electricBorderColor acima
