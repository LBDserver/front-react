import React, {useContext} from 'react'
import {Route, Redirect} from 'react-router-dom'
import {checkAuthentication} from '@util/functions'
import AppContext from '@context'

const AuthRoute = ({component: Component, authenticated, ...rest}) => {
    const {context}= useContext(AppContext)

    return (
        <Route {...rest}
               render={(props) => checkAuthentication(context) ? <Component {...props}/> : <Redirect to='/login'/>}
        />
    )
}

export default AuthRoute;
