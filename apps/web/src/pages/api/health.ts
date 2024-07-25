import type { NextApiResponse } from 'next'

export default function handler(req, res: NextApiResponse) {
  res.status(200).send('OK')
}
