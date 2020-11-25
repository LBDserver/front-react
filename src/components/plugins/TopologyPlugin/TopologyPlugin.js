import React, {useState, useContext} from 'react'

function TopologyPlugin() {


    const [site, setSite] = useState('')
    const [buildings, setBuildings] = useState([])
    const [storeys, setStoreys] = useState([])
    const [spaces, setSpaces] = useState([])


    const [activeBuilding, setActiveBuilding] = useState(0)
    const [activeStorey, setActiveStore] = useState(0)
    const [activeSpace, setActiveSpace] = useState(0)
    
    return (
        <div>
            The topology plugin component
        </div>
    )
}

export default TopologyPlugin
