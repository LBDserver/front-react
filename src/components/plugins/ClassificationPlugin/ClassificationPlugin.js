import React, { useState, useContext, useEffect } from 'react'
import AppContext from "@context";
import { setConfig, queryComunica, executeUpdate, adaptQuery, executeQuery} from '@functions'
import { v4 } from "uuid"
import { Select, MenuItem, FormControl, InputLabel, Button, TextField } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 300,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));


function ClassificationPlugin() {
    const classes = useStyles()

    const { context, setContext } = useContext(AppContext)
    const [classifications, setClassifications] = useState([])
    const [parentElement, setParentElement] = useState()
    const [selectedClassification, setSelectedClassification] = useState('')
    const [loading, setLoading] = useState(false)
    const [classificationOptions, setClassificationOptions] = useState(["fetching"])

    // only when the component is mounted
    useEffect(async () => {
        await findClassifications()
    }, [])

    useEffect(async () => {
        await findParent()
    }, [context.selection])

    useEffect(async () => {
        await findExistingClassifications()
    }, [parentElement])

    async function findClassifications() {
        try {
            const query = `
            PREFIX beo: <https://pi.pauwel.be/voc/buildingelement#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
            SELECT ?element
            WHERE {
                ?element rdfs:subClassOf beo:BuildingElement.
            }`

            setLoading(true)
            const result = await context.comunica.query(query, {
                sources: ['https://pi.pauwel.be/voc/buildingelement/ontology.ttl'],
            });

            // Consume results as an array (easier)
            const bindings = await result.bindings();
            setLoading(false)
            const classOptions = []
            if (bindings.length > 0) {
                for (const result of bindings) {
                    const value = result._root.entries[0][1].id
                    classOptions.push(value)
                }
                setClassificationOptions(classOptions)
            } else {
                throw new Error('Nothing found')
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    async function findParent() {
        try {
            if (context.selection.length > 0) {
                const query = `PREFIX props: <https://w3id.org/props#>
                PREFIX bot: <https://w3id.org/bot#>
                PREFIX beo: <https://pi.pauwel.be/voc/buildingelement#>
                PREFIX schema: <http://schema.org/>
                PREFIX omg: <https://w3id.org/omg#>
                PREFIX fog: <https://w3id.org/fog#>
        
                SELECT ?parent
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
                    }
                } else {
                    setParentElement(null)
                }
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    async function addClassification(e) {
        e.preventDefault()
        try {
            const updateQuery = `
            PREFIX beo: <https://pi.pauwel.be/voc/buildingelement#>
    
            INSERT DATA { GRAPH <${context.currentProject.activeGraphs[0]}> {
                <${parentElement}> a <${selectedClassification}> .
            } }        
            `
            await executeUpdate(updateQuery, context, context.currentProject.activeGraphs[0])
            const newClassifications = [...classifications, selectedClassification]
            setClassifications(newClassifications)
        } catch (error) {
            console.log(error)
        }
    }

    async function findExistingClassifications() {
        try {
            if (parentElement) {
                const query = `
                SELECT ?class
                WHERE {
                    <${parentElement}> a ?class .
                }`
                setLoading(true)
                const results = await executeQuery(query, context)
                const resultingClasses = []
                if (results) {
                    results.forEach(result => {
                        resultingClasses.push(result.class.value)
                    })
                    setLoading(false)

                    setClassifications(resultingClasses)
                }
            } else {
                setClassifications([])
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const handleChange = (value) => {
        try {
            new URL(value)
            console.log('selection is valid URI')
            setSelectedClassification(value)

        } catch (error) {
            console.log('error', error)
        }
        
    }

    async function establishParent(e) {
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
            setSelectedClassification("")
            setParentElement(parentUri)
        } catch (error) {
            console.log('error', error)
        }
    }

    const classificationDropdown = () => {
        return (
                <FormControl>
                <Autocomplete
                    id="combo-box-demo"
                    options={classificationOptions}
                    getOptionLabel={(option) => option}
                    style={{ width: 300, marginTop: "20px" }}
                    onInputChange={(e, value) => handleChange(value)}
                    renderInput={(params) => <TextField {...params} label="Set classification" variant="outlined" />}
                />
                </FormControl>
        )
    }
    // display the option for new classifications

    return (
        <div>
            {(context.selection.length > 0) ? (
                <div>
                    {(parentElement) ? (
                        <div>
                            {/* {parentElement} */}
                            {/* <FormControl className={classes.formControl}>
                                <InputLabel id="demo-simple-select-label">New classification</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedClassification}
                                    onChange={handleChange}
                                >
                                    {classificationOptions.map((item) => <MenuItem value={item}>{item}</MenuItem>)}

                                </Select>
                            </FormControl> */}
                            {classificationDropdown()}
                            <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<AddCircleIcon fontSize="large" />}
                                    style={{
                                        bottom: 0,
                                        marginTop: "3%",
                                        left: "5%",
                                        width: '80px'
                                    }}
                                    onClick={addClassification}
                                    disabled={!selectedClassification.length}
                                >
                                    Add
                                </Button>
                        </div>

                    ) : (
                            <div>
                                <p>No root element found for the selected object</p>
                                <button
                                    onClick={establishParent}
                                >Make one?
                </button>
                            </div>
                        )}
                    {(classifications.length > 0) ? (
                        <div>
                            {classifications.map((item) => <a target="_blank" href={item} key={item}>{item}</a>)}
                        </div>
                    ) : (
                            <div>
                                {(loading) ? (
                                    <p></p>
                                ) : (
                                        <p>No classifications yet for this element (in the selected graphs)</p>
                                    )}
                            </div>

                        )}
                </div>
            ) : (
                    <div>Please select an element in the viewer</div>
                )}
        </div>
    )
}

export default ClassificationPlugin
