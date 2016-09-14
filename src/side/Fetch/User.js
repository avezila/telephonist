import Cookies from 'js-cookie'


export default async function FetchUser () {
  console.log(Cookies)
  window.C = Cookies
}
