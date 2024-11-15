import axios from 'axios'
import { Page } from '@playwright/test'

const baseUrl = process.env.SE_TEST_API_URL
const username = process.env.SE_TEST_API_USERNAME
const password = process.env.SE_TEST_API_PASSWORD

export async function getStudyEngagementInfo(studyId: string) {
  const apiUrl = `${baseUrl}api/v1/studies/${studyId}/engagement-info`

  // check if the environment variables are set
  if (!username || !password || !baseUrl) {
    throw new Error('SE API username, password or url is not set in environment variables.')
  }

  try {
    // make the GET request
    const response = await axios.get(apiUrl, {
      headers: {
        username: username,
        password: password,
      },
    })

    // return the response data as a JSON object
    return response.data.Result
  } catch (error) {
    // handle any errors
    console.error('Error fetching SE engagement info:', error)
    throw error
  }
}

export async function listenAndDestroyRequest(page: Page, urlPart: string): Promise<void> {
  // intercept the given request and aborts it for system errors
  await page.route(`**/${urlPart}`, (route) => {
    console.log(`Aborting request: ${route.request().url()}`)
    route.abort()
  })
}

export async function listenAndUpdateRequest(page: Page, urlPart: string, value: string): Promise<void> {
  // intercept the given request and update if for testing expected responses
  await page.route(`**/${urlPart}`, async (route, request) => {
    const postData = request.postData()

    if (postData) {
      const parsedData = JSON.parse(postData)

      parsedData.studyId = value
      parsedData.cpmsId = value

      await route.continue({
        postData: JSON.stringify(parsedData),
      })
    } else {
      await route.continue()
    }
  })
}

export async function listenAndWaitForRequest(page: Page, urlPart: string): Promise<void> {}
