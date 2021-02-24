import React, {useContext, useEffect} from 'react'
import useStyles from "@styles";
import {
    Typography
} from '@material-ui/core'
import {ProjectSelection} from '@components'
import AppContext from '@context'
import {getSolidDatasetWithAcl} from '@inrupt/solid-client'

function Home() {
    const classes = useStyles()
    const {context, setContext} = useContext(AppContext)

    // useEffect(() => {
    //   async function main() {
    //     if (context.user.info.webId) {
    //       console.log(context.user.info.webId)
    //       try {
    //         const response = await getSolidDatasetWithAcl('http://localhost:3000/lbd/myFile.ttl', {fetch: context.user.fetch})
    //         console.log('response', response)


    //         const response2 = await context.user.fetch('http://localhost:3000/lbd/myFile.ttl')
    //         console.log('response', response2)
    //       } catch (error) {
    //         console.log('error', error)
    //       }
    //     }
    //   }
    //   main()
    // }, [context.user])

    return (
        <div className={classes.form}>
          <Typography variant="h3" className={classes.pageTitle}>
            Welcome
          </Typography>
          <Typography style={{marginTop: -20,fontWeight: "bold"}}>
          ... to the LBDserver demo!
          </Typography>
          <Typography style={{margin: "50px auto 120px auto", maxWidth: 750}}>
          This is a demo page where you can try out the (work in progress) functionality of the <a href="https://github.com/lbdserver">LBDserver</a> project. You can find some publicly accessible projects below. Simply activate one of the projects and start visualising your LBD queries. Come back to this page using the navigation bar "LBDserver" link.
          </Typography>
          {(context.user.info.webId) ? (
          <Typography style={{marginTop: -100,fontWeight: "bold"}}>
          You are currently logged in as {context.user.info.webId}
          </Typography>
          ) : (
            <></>
          )}

          <ProjectSelection/>
        </div>
    )
}

export default Home
