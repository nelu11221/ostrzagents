// Цветовые акценты продуктов. Классы записаны целиком, чтобы Tailwind их нашёл при сборке.
// Лидоген — фирменный синий, AI-сейлз — iris, связка — градиент из обоих.

export type ProductTone = 'leadgen' | 'sales' | 'duo'

export const TONE = {
  leadgen: {
    text: 'text-signal',
    hot: 'text-signal-hot',
    deep: 'text-signal-deep',
    dot: 'bg-signal',
    solid: 'bg-signal-btn',
    soft: 'bg-signal/10',
    ring: 'ring-signal/40',
    glow: 'bg-signal/25',
    button: 'signal',
  },
  sales: {
    text: 'text-iris',
    hot: 'text-iris-hot',
    deep: 'text-iris-deep',
    dot: 'bg-iris',
    solid: 'bg-iris-btn',
    soft: 'bg-iris/10',
    ring: 'ring-iris/40',
    glow: 'bg-iris/25',
    button: 'iris',
  },
  duo: {
    text: 'text-iris-hot',
    hot: 'text-iris-hot',
    deep: 'text-iris-deep',
    dot: 'bg-linear-to-br from-signal to-iris',
    solid: 'bg-linear-to-r from-signal-btn to-iris-btn',
    soft: 'bg-linear-to-r from-signal/10 to-iris/10',
    ring: 'ring-iris/40',
    glow: 'bg-linear-to-r from-signal/25 to-iris/25',
    button: 'duo',
  },
} as const
