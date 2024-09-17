import axios from 'axios'

export async function getStudyEngagementInfo(studyId: string) {
  const url = `https://test.cpmsapi.crncc.nihr.ac.uk/api/v1/studies/${studyId}/engagement-info`
  const username = process.env.SE_TEST_API_USERNAME
  const password = process.env.SE_TEST_API_PASSWORD

  // check if the environment variables are set
  if (!username || !password) {
    throw new Error('SE API username or password is not set in environment variables.')
  }

  try {
    // make the GET request
    const response = await axios.get(url, {
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
