import pino from 'pino'

const devOptions = {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
}

const prodOptions = {
  ...(process.env.NEXT_PUBLIC_APP_ENV === 'dev' && { level: 'trace' }),
}

const options = process.env.NODE_ENV === 'development' ? devOptions : prodOptions

export const logger = pino(options)
