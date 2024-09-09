import assert from 'node:assert'

import axios from 'axios'

import { Roles } from '@/constants'
import { withApiHandler } from '@/utils/withApiHandler'

export default withApiHandler(Roles.SponsorContact, async (req, res) => {
  console.log('hitting endpoint', { body: req.body })
  const { CPMS_API_URL, CPMS_API_USERNAME, CPMS_API_PASSWORD } = process.env

  try {
    assert(CPMS_API_URL)
    assert(CPMS_API_USERNAME)
    assert(CPMS_API_PASSWORD)

    const plannedOpeningDate = new Date('14/09/1998')

    const requestUrl = `${CPMS_API_URL}/studies/622/engagement-info`

    console.log({ requestUrl })
    const res = await axios.put(requestUrl, {
      headers: { username: CPMS_API_USERNAME, password: CPMS_API_PASSWORD },
      body: {
        PlannedOpeningDate: '2024-10-16',
      },
    })

    console.log({ res })
    // if (data.StatusCode !== 200) {
    //   throw new Error('An error occured fetching study from CPMS')
    // }

    return res.redirect(302, `/studies/622?success=2`)
  } catch (e) {
    console.log({ e })
    const searchParams = new URLSearchParams({ fatal: '1' })

    return res.redirect(302, `/studies/622/?${searchParams.toString()}`)
  }
})
