import React, { useState, useContext, useEffect } from 'react'
import AppContext from '@context'
import { setConfig, queryComunica, executeQuery, executeUpdate, adaptQuery } from '@functions'
import { v4 } from "uuid"
import { Select, MenuItem, FormControl, InputLabel, TextField, Button } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 300,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));


function StgPlugin() {
    const classes = useStyles()

    const { context, setContext } = useContext(AppContext)
    const [remarks, setRemarks] = useState([])
    const [parentElement, setParentElement] = useState()
    const [geoElement, setGeoElement] = useState()
    const [newRemark, setNewRemark] = useState('')
    const [loading, setLoading] = useState(false)
    const [remarkType, setRemarkType] = useState("comment")

    useEffect(async () => {
        await findParentAndGeo()
    }, [context.selection])

    useEffect(async () => {
        await findExistingMetadata()
    }, [geoElement])


    async function findParentAndGeo() {
        try {
            if (context.selection.length > 0) {
                const query = `PREFIX props: <https://w3id.org/props#>
                PREFIX bot: <https://w3id.org/bot#>
                PREFIX beo: <https://pi.pauwel.be/voc/buildingelement#>
                PREFIX schema: <http://schema.org/>
                PREFIX omg: <https://w3id.org/omg#>
                PREFIX fog: <https://w3id.org/fog#>
        
                SELECT ?parent ?geo
                WHERE {
                    ?parent omg:hasGeometry ?geo .
                    ?geo fog:hasGltfId "${context.selection}" .
                }`
                setLoading(true)
                const results = await executeQuery(query, context)
                setLoading(false)
                if (results.length > 0) {
                    if (parentElement !== results[0].parent.value) {
                        setParentElement(results[0].parent.value)
                        console.log(results[0].parent.value)
                    }
                    if (geoElement !== results[0].geo.value) {
                        setGeoElement(results[0].geo.value)
                        console.log(results[0].geo.value)
                    }
                } else {
                    setParentElement(null)
                    setGeoElement(null)
                }
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    async function addNewRemark(e) {
        e.preventDefault()
        try {
            const assumptionUri = `${context.currentProject.activeGraphs[0]}#${v4()}`
            const metadataUri = `${context.currentProject.activeGraphs[0]}#${v4()}`
            let updateQuery
            console.log('remarkType', remarkType)
            switch (remarkType) {
                case "comment":
                    updateQuery = `
                    PREFIX stg: <https://raw.githubusercontent.com/JWerbrouck/Thesis/master/stg.ttl#>
                    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

                    INSERT DATA { GRAPH <${context.currentProject.activeGraphs[0]}> {
                        <${geoElement}> stg:hasMetadata <${metadataUri}> .
                        <${metadataUri}> stg:hasAssumption <${assumptionUri}> .
                        <${assumptionUri}> rdfs:comment "${newRemark}" .
                    } }        
                    `
                    break;
                case "loa":
                    updateQuery = `
                    PREFIX stg: <https://raw.githubusercontent.com/JWerbrouck/Thesis/master/stg.ttl#>
            
                    INSERT DATA { GRAPH <${context.currentProject.activeGraphs[0]}> {
                        <${geoElement}> stg:hasMetadata <${metadataUri}> .
                        <${metadataUri}> stg:hasLOA "${newRemark}" .
                    } }        
                    `
                    break;
                case "source":
                    updateQuery = `
                    PREFIX stg: <https://raw.githubusercontent.com/JWerbrouck/Thesis/master/stg.ttl#>
            
                    INSERT DATA { GRAPH <${context.currentProject.activeGraphs[0]}> {
                        <${geoElement}> stg:hasMetadata <${metadataUri}> .
                        <${metadataUri}> stg:basedOn <${newRemark}> .
                    } }        
                    `
                    break;
                default:
                    return;
            }


            await executeUpdate(updateQuery, context, context.currentProject.activeGraphs[0])
            const newRemarks = [...remarks, {value: newRemark, type: remarkType}]
            setRemarks(newRemarks)
            setNewRemark("")
        } catch (error) {
            console.log(error)
            setNewRemark("")
        }
    }

    async function findExistingMetadata() {
        try {
            console.log("finding existing metadata")
            if (parentElement) {
                const commentQuery = `
                PREFIX stg: <https://raw.githubusercontent.com/JWerbrouck/Thesis/master/stg.ttl#>
                PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

                SELECT ?metadata ?comment
                WHERE {
                    <${geoElement}> stg:hasMetadata ?metadata .
                    ?metadata stg:hasAssumption ?assumption .
                    ?assumption rdfs:comment ?comment .
                }`

                const loaQuery = `
                PREFIX stg: <https://raw.githubusercontent.com/JWerbrouck/Thesis/master/stg.ttl#>
                PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

                SELECT ?metadata ?loa
                WHERE {
                    <${geoElement}> stg:hasMetadata ?metadata .
                    ?metadata stg:hasLOA ?loa .
                }`

                const sourceQuery = `
                PREFIX stg: <https://raw.githubusercontent.com/JWerbrouck/Thesis/master/stg.ttl#>
                PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

                SELECT ?metadata ?source
                WHERE {
                    <${geoElement}> stg:hasMetadata ?metadata .
                    ?metadata stg:basedOn ?source .
                }`

                setLoading(true)
                const resultingMetadata = []

                const commentResults = await executeQuery(commentQuery, context)
                const loaResults = await executeQuery(loaQuery, context)
                const sourceResults = await executeQuery(sourceQuery, context)

                if (commentResults) {
                    commentResults.forEach(result => {
                        resultingMetadata.push({ value: result.comment.value, type: "comment" })
                    })
                }

                if (loaResults) {
                    loaResults.forEach(result => {
                        resultingMetadata.push({ value: result.loa.value, type: "loa" })
                    })
                }

                if (sourceResults) {
                    sourceResults.forEach(result => {
                        resultingMetadata.push({ value: result.source.value, type: "source" })
                    })
                }

                setLoading(false)

                setRemarks(resultingMetadata)

            } else {
                setRemarks([])
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const handleChange = (e) => {
        e.preventDefault()
        // if (e.target.value.length > 0) {
        //     setSelectedClassification(e.target.value)
        // }
    }

    async function establishParentAndGeo(e) {
        e.preventDefault()
        try {
            const parentUri = `${context.currentProject.activeGraphs[0]}#${v4()}`
            const geometryUri = `${context.currentProject.activeGraphs[0]}#${v4()}`

            const updateQuery = `
            PREFIX bot: <https://w3id.org/bot#>
            PREFIX beo: <https://pi.pauwel.be/voc/buildingelement#>
            PREFIX schema: <http://schema.org/>
            PREFIX omg: <https://w3id.org/omg#>
            PREFIX fog: <https://w3id.org/fog#>
    
            INSERT DATA { GRAPH <${context.currentProject.activeGraphs[0]}> {
                <${parentUri}> omg:hasGeometry <${geometryUri}> .
                <${geometryUri}> fog:hasGltfId "${context.selection}" .
            } }        
            `
            await executeUpdate(updateQuery, context, context.currentProject.activeGraphs[0])
            setParentElement(parentUri)
            setGeoElement(geometryUri)
        } catch (error) {
            console.log('error', error)
        }
    }
    // display the option for new classifications

    const commentUI = () => {
        return (
            <div>
                <TextField
                    id="standard-multiline-flexible"
                    label="New Remark"
                    multiline
                    fullWidth
                    rowsMax={10}
                    value={newRemark}
                    onChange={(e) => setNewRemark(e.target.value)}
                />
            </div>

        )
    }

    const setCurrentSource = (value, options) => {
        let linkToMake = value

        try {
            for (const item of options) {
                if (item["rdfs:comment"] === value) {
                    linkToMake = item["@id"]
                }
            }

            new URL(linkToMake)
            console.log('value is a valid URI')
            setNewRemark(linkToMake)
            console.log('set new remark', linkToMake)
        } catch (error) {
            console.log('error', error)
        }
        // console.log('value', value)
        // try {
        //     new URL(value)
        //     console.log('value is a valid URI')
        //     setNewRemark(value)
        // } catch (error) {
        //     try {
        //         for (const item of options) {
        //             if (item["rdfs:comment"] === value) {
        //                 const documentURI = item["@id"]
        //                 setNewRemark(documentURI)
        //                 console.log('set new remark', newRemark)
        //             }
        //         }
        //     } catch (err) {
        //         console.log('not a URL and label not found in project documents')
        //     }
        // }
    }

    const sourceUI = () => {
        const options = []
        for (const [key, value] of Object.entries(context.currentProject.documents)) {
            options.push(value)
        }

        return (
            <div>
                <Autocomplete
                    id="combo-box-demo"
                    options={options}
                    getOptionLabel={(option) => option["rdfs:comment"]}
                    style={{ width: 300, marginTop: "20px" }}
                    onInputChange={(e, value) => setCurrentSource(value, options)}
                    renderInput={(params) => <TextField {...params} label="Connect source ..." variant="outlined" />}
                />
            </div>
        )
    }

    const LoaUI = () => {
        return (
            <div>
                <p>
                    Links a <a href="https://usibd.org/product/level-of-accuracy-loa-specification-version-3-0/">Level of Accuracy</a> indication to a certain reconstructed element and its original source.
                </p>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={newRemark}
                    onChange={e => { setNewRemark(e.target.value); console.log('e.target.value', e.target.value) }}
                >
                    <MenuItem value="LOA 100">LOA 100</MenuItem>
                    <MenuItem value="LOA 200">LOA 200</MenuItem>
                    <MenuItem value="LOA 300">LOA 300</MenuItem>
                    <MenuItem value="LOA 400">LOA 400</MenuItem>
                    <MenuItem value="LOA 500">LOA 500</MenuItem>
                </Select>
            </div>
        )
    }

    const remarkDropdown = () => {
        const remarkUI = () => {
            switch (remarkType) {
                case "comment":
                    return commentUI()
                case "loa":
                    return LoaUI();
                case "source":
                    return sourceUI();
                default:
                    return
            }
        }
        return (

            <div>
                <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">Remark type:</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={remarkType}
                        onChange={e => { setNewRemark(""); setRemarkType(e.target.value) }}
                        style={{ width: "100px" }}

                    >
                        <MenuItem value="comment">Comment</MenuItem>
                        <MenuItem value="source">Source</MenuItem>
                        <MenuItem value="loa">LOA</MenuItem>
                    </Select>
                </FormControl>
                {remarkUI()}
            </div>
        )
    }

    return (
        <div>
            <div>
                {(context.selection.length > 0) ? (
                    <div>
                        {(parentElement) ? (
                            <div>
                                {/* {parentElement} */}
                                {remarkDropdown()}
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<AddCircleIcon fontSize="large" />}
                                    style={{
                                        bottom: 0,
                                        left: "83%",
                                        marginTop: "10px",
                                        width: '80px'
                                    }}
                                    onClick={addNewRemark}
                                    disabled={!newRemark.length}
                                >
                                    Bind
                                </Button>
                            </div>

                        ) : (
                                <div>
                                    <p>No root element found for the selected object</p>
                                    <button
                                        onClick={establishParentAndGeo}
                                    >Make one?
                </button>
                                </div>
                            )}
                        <hr></hr>
                        {(remarks.length > 0) ? (
                            <div>
                                {remarks.map((item) => <p key={item.value}>{item.value}</p>)}
                            </div>
                        ) : (
                                <div>
                                    {(loading) ? (
                                        <p></p>
                                    ) : (
                                            <p>No remarks yet for this element (in the selected graphs)</p>
                                        )}
                                </div>

                            )}
                    </div>
                ) : (
                        <div>Please select an element in the viewer</div>
                    )}
            </div>
        </div>

    )
}

export default StgPlugin

