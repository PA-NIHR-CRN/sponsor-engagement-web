import axios from 'axios'

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
