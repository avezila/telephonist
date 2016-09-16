// import cookies from 'js-cookie'

// const api = '//127.0.0.1:8080/'

export default async function FetchUser () {
  await Promise.delay(1000)
  return {
    // error     : 'omg',
    access    : ['TELEPHONIST_BASIC_ACCESS', 'TELEPHONIST_FULL_ACCESS'],
    firstname : 'Rob',
    lastname  : 'Pike',
  }
}
