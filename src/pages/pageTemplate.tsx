import React from 'react'
import useStyles from '@styles'

const Page: React.FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.page}>
            The Page component
        </div>
    )
}

export default Page