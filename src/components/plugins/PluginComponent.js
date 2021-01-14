import React, { useState } from 'react'
// import TopologyPlugin from './TopologyPlugin'
// import ClassificationPlugin from './ClassificationPlugin'
// import StgPlugin from './StgPlugin'
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 300,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));


function PluginComponent() {
    const classes = useStyles()
    const [activePlugin, setActivePlugin] = useState('classification')


    const pluginDictionary = {
        topology: TopologyPlugin,
        classification: ClassificationPlugin,
        stg: StgPlugin
    }

    function returnPlugin () {
        const Plugin = pluginDictionary[activePlugin]
        return <Plugin/>
    }

    function handleChange(e) {
        e.preventDefault()
        setActivePlugin(e.target.value)
    }

    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Active Plugin</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={activePlugin}
                    onChange={handleChange}
                >
                    <MenuItem value={"topology"}>Topology</MenuItem>
                    <MenuItem value={"classification"}>Classification</MenuItem>
                    <MenuItem value={"stg"}>STG</MenuItem>
                </Select>
            </FormControl>
            <div style={{marginTop: "20px"}}>
            {returnPlugin()}

            </div>

        </div>
    )
}

export default PluginComponent
