import type { NextApiResponse } from 'next'

export default function handler(req, res: NextApiResponse) {
  console.info('App healthy')
  res.status(200).send('OK')
}
