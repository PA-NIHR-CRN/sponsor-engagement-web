async function globalSetup() {
  process.env.BASE_URL = 'https://test.assessmystudy.nihr.ac.uk/'

  console.log(process.env.BASE_URL)
  console.log(process.env.CPMS_TEST_DB_PASSWORD)
  console.log(process.env.CPMS_TEST_DB_SERVER)
  console.log(process.env.SE_TEST_DB_PASSWORD)
  console.log(process.env.SE_TEST_DB_HOST)
  console.log(process.env.SPONSOR_CONTACT_PASS)
  console.log(process.env.SPONSOR_CONTACT_MANAGER_PASS)
  console.log(process.env.CONTACT_MANAGER_PASS)
  console.log(process.env.SE_NO_LOCAL_ACCOUNT_PASS)

}
export default globalSetup
