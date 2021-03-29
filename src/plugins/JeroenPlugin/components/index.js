import React, {useContext} from 'react'
import {queryGraphSelect} from 'lbd-server'
import AppContext from "@context";


const index = () => {
    const { context, setContext } = useContext(AppContext);

    const querymultiple = async () => {
        try {
            console.log(`context.`, context.)
        } catch (error) {
            console.log(`error`, error)
        }
    }

    return (
        <div>
            <button>
                Enrich!
            </button>
        </div>
    )
}

export default index
