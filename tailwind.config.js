const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
         fontFamily: {
           Termina_Semibold: ["Termina_Semibold", "sans-serif"],
           Termina_Medium: ["Termina_Medium", "sans-serif"],
           Termina_Regular: ["Termina_Regular", "sans-serif"],  
           Termina_Bold: ["Termina_Bold", "sans-serif"],
           Termina_Regular: ["Termina_Regular", "sans-serif"],
           Termina_Light: ["Termina_Light", "sans-serif"],
           Termina_Thin: ["Termina_Thin", "sans-serif"],
            Termina_ExtraBold: ["Termina_ExtraBold", "sans-serif"],
            Termina_ExtraLight: ["Termina_ExtraLight", "sans-serif"],
            Termina_Black: ["Termina_Black", "sans-serif"],
           Inter_Regular: ["Inter_100Thin", "sans-serif"],
           Inter_Thin: ["Inter_200ExtraLight", "sans-serif"],
            Inter_ExtraLight: ["Inter_300Light", "sans-serif"],
            Inter_Light: ["Inter_400Regular", "sans-serif"],
            Inter_Regular: ["Inter_500Medium", "sans-serif"],
            Inter_Medium: ["Inter_600SemiBold", "sans-serif"],
            Inter_SemiBold: ["Inter_700Bold", "sans-serif"],
            Inter_Bold: ["Inter_800ExtraBold", "sans-serif"],
           Inter_ExtraBold: ["Inter_900Black", "sans-serif"],
                 'sans': ['Inter_400Regular'],
           'sans-light': ['Inter_400Regular'],
            'sans-medium': ['Inter_600SemiBold'],
            'sans-semibold': ['Inter_700Bold'],
            'sans-bold': ['Inter_800ExtraBold'],
       
      },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('tailwindcss-animate')],
};
