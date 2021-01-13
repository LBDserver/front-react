import React, {useContext} from 'react'
import {Route, Redirect} from 'react-router-dom'
import AppContext from '@context'
import {checkAuthentication} from '@util/functions'

const NonAuthRoute = ({component: Component, ...rest}) => {
    const {context}= useContext(AppContext)
    return (
        <Route {...rest}
        render={(props) => checkAuthentication(context) ? <Redirect to='/'/> : <Component {...props}/>}
        />
    )
}

export default NonAuthRoute;