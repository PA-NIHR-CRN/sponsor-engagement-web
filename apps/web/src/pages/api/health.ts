import type { NextApiResponse } from 'next'

export default function handler(req, res: NextApiResponse) {
  // eslint-disable-next-line no-console -- expected
  console.info('App healthy')
  res.status(200).send('OK')
}
