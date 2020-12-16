import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'

import { Navbar } from '@components'
import { Project, Home } from '@pages'

const Routes: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/project" component={Project} />
            </Switch>
        </Router>
    )
}

export default Routes
