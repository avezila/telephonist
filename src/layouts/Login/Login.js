import React, {Component} from 'react'

import LoginContainer from 'containers/Login'
import BaseLayout from 'layouts/Base'


export default
class LoginLayout extends Component {
  render () {
    return (
      <BaseLayout>
        <LoginContainer />
      </BaseLayout>
    )
  }
}
