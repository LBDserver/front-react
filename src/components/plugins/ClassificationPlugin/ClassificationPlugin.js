import React, { useState, useContext, useEffect } from 'react'
import AppContext from '@context'
import { setConfig } from '@util/functions'
import axios from 'axios'
import url from 'url'
import { v4 } from "uuid"

function ClassificationPlugin() {
    const { context, setContext } = useContext(AppContext)
    const [classifications, setClassifications] = useState([])
    const [parentElement, setParentElement] = useState()
    const [selectedClassification, setSelectedClassification] = useState('Window')
    const [currentId, setCurrentID] = useState(context.selection)

    useEffect(async () => {
        await findParent()
    }, [context])

    useEffect(async () => {
        console.log('parent ', parentElement)
        await findExistingClassifications()
    }, [parentElement])


    async function findParent() {
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
        const results = await executeQuery(query, context)
        if (results.length > 0) {

            if (parentElement !== results[0].parent.value) {
                console.log('results[0].parent.value', results[0].parent.value)
                setParentElement(results[0].parent.value)
            }
        }
    }

    async function addClassification(e) {
        e.preventDefault()
        const updateQuery = `
        PREFIX beo: <https://pi.pauwel.be/voc/buildingelement#>

        INSERT DATA { GRAPH <${context.activeGraphs[0]}> {
            <${parentElement}> a beo:${selectedClassification} .
        } }        
        `
        await executeUpdate(updateQuery, context, context.activeGraphs[0])
    }

    async function findExistingClassifications() {
        const query = `
        SELECT ?class
        WHERE {
            <${parentElement}> a ?class .
        }`
        const results = await executeQuery(query, context)
        const resultingClasses = []
        results.forEach(result => {
            resultingClasses.push(result.class.value)
        })


        setClassifications(resultingClasses)
        // if (results.length > 0) {
        //     setParentElement(results[0].parent.value)
        // } else {
        //     setParentElement(null)
        // }
    }

    // async function establishAllParents(e) {
    //     e.preventDefault()
    //     for (const id in context.scene.allIds) {
    //         console.log('id', id)
    //     }
    // }

    async function establishParent(e) {
        e.preventDefault()

        const parentUri = `${context.activeGraphs[0]}#${v4()}`
        const geometryUri = `${context.activeGraphs[0]}#${v4()}`

        const updateQuery = `
        PREFIX bot: <https://w3id.org/bot#>
        PREFIX beo: <https://pi.pauwel.be/voc/buildingelement#>
        PREFIX schema: <http://schema.org/>
        PREFIX omg: <https://w3id.org/omg#>
        PREFIX fog: <https://w3id.org/fog#>

        INSERT DATA { GRAPH <${context.activeGraphs[0]}> {
            <${parentUri}> omg:hasGeometry <${geometryUri}> .
            <${geometryUri}> fog:hasGltfId "${context.selection}" .
        } }        
        `
        await executeUpdate(updateQuery, context, context.activeGraphs[0])
    }
    // display the option for new classifications

    return (
        <div>
            {context.selection}
            {(context.selection.length > 0) ? (
                <div>
                    {(parentElement) ? (
                        <div></div>
                    ) : (
                            <div>
                                <p>No parent element found</p>
                                <button
                                    onClick={establishParent}
                                >Make one?
                </button>
                            </div>
                        )}
                    {/* <button
                onClick={establishAllParents}
                >Set parents for each element
                </button>         */}
                    {(classifications.length > 0) ? (
                        <div>
                            {classifications.map((item) => <p>{item}</p>)}
                        </div>
                    ) : (
                            <div>
                                <p>No classifications yet for this element (in the selected graphs)</p>

                            </div>

                        )}
                    <button
                        onClick={addClassification}
                    >
                        Set New Classification
                        </button>
                </div>
            ) : (
                    <div>Please select an element in the viewer</div>
                )}
        </div>

    )
}

async function executeUpdate(query, context, graph) {
    try {

        const fullUrl = url.parse(graph)
        const realGraphUrl = graph.replace(`${fullUrl.protocol}//${fullUrl.host}`, process.env.REACT_APP_BACKEND) + `?update=${encodeURIComponent(query)}`

        const config = {
            method: 'post',
            url: realGraphUrl
        };

        if (context.token && context.user) {
            config.headers = {
                'Authorization': `Bearer ${context.token}`
            }
        }

        const results = await axios(config)

        console.log(results)
        return results
    } catch (error) {
        console.log('error', error)
    }
}

async function executeQuery(query, context) {
    try {
        const newQuery = await adaptQuery(query, context.activeGraphs)
        const url = `${process.env.REACT_APP_BACKEND}/lbd/${context.currentProject.projectId}?query=${newQuery}`
        const results = await axios(setConfig(context, url))
        const selection = []
        results.data.results.results.bindings.forEach((binding) => {
            selection.push(binding)
        })
        return selection

    } catch (error) {
        console.log('error', error)
    }
}

function adaptQuery(query, graphs) {
    return new Promise((resolve, reject) => {
        try {
            let splitQuery = query.split('where')
            if (splitQuery.length <= 1) {
                splitQuery = query.split('WHERE')
            }

            graphs.forEach(graph => {
                splitQuery[0] = splitQuery[0] + `FROM <${graph}> `
            })

            let newQuery = splitQuery[0] + "WHERE" + splitQuery[1]
            resolve(encodeURIComponent(newQuery))
        } catch (error) {
            reject(error)
        }
    })
}

export default ClassificationPlugin
