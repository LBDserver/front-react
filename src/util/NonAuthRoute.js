import React, {useContext} from 'react'
import {Route, Redirect} from 'react-router-dom'
import AppContext from '../context/appContext'
import {checkAuthentication} from '../util/functions'

const NonAuthRoute = ({component: Component, ...rest}) => {
    const {context}= useContext(AppContext)
    console.log('context', context)
    return (
        <Route {...rest}
        render={(props) => checkAuthentication(context) ? <Redirect to='/'/> : <Component {...props}/>}
        />
    )
}

export default NonAuthRoute;