import * as React from "react";
import {useState} from "react";
import {useParams} from "react-router-dom";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import "./GraphTab.scss"
import Button from "@mui/material/Button";
import {TaskService} from "../../Services/TaskService";
import {ResultService} from "../../Services/ResultService";

interface GraphPoint {
    name: string,
    point: number
}

export default function GraphTab() {

    let {uuid} = useParams()
    const [rows, setRows] = useState([] as GraphPoint[])
    const [errors, setErrors] = useState([] as string[])
    const [yMax, setYMax] = useState(12)
    const [yMin, setYMin] = useState(0)
    const resultService = new ResultService()

    async function newRun() {
        if (uuid !== undefined) {
            console.log("starting stream: " + uuid)
            let stream = resultService.getStream(uuid)
            let newYmax: number = 0
            let newYmin: number = 10
            let newRows: GraphPoint[] = []
            let newErrors: string[] = []
            let slice: GraphPoint[]
            let protoResults: any
            stream.on('data', function (response: { getResultsList: () => any; }) {
                protoResults = response.getResultsList()
                for (let i = 0; i < protoResults.length; i++) {
                    if (~~(protoResults[i].getContent()) > yMax) {
                        newYmax = ~~(protoResults[i].getContent())
                    }
                    if (protoResults[i].getContent() < yMin) {
                        newYmin = protoResults[i].getContent()
                    }
                    let date = new Date(protoResults[i].getCreatedAt())
                    if (protoResults[i].getContent().length > 10) {
                        newErrors.push( protoResults[i].getContent())
                    } else {
                        newRows.push({
                            name: date?.getHours() + ":" + date?.getMinutes() + ":" + date?.getSeconds(),
                            point: protoResults[i].getContent()
                        })
                    }

                }
                if (newYmax > yMax) {
                    // setYMax(newYmax)
                }
                if (newYmin > yMin) {
                    setYMin(newYmin)
                }
                console.log("----")
                console.log(newRows.length)
                console.log(newErrors)
                let maxRows = 200
                if (newRows.length > maxRows) {
                    console.log("slicing")
                    slice = newRows.slice(newRows.length - 200)
                    console.log(slice.length)
                    setRows(slice)
                } else {
                    slice = newRows.slice()
                    setRows(slice)
                }
                setErrors(newErrors)
            });

            stream.on('end', function () {
                console.log("end");
                stream.cancel()
            });
        }
    }

    function clear() {
        setRows([])
        setYMax(0)
        setYMin(0)
    }


    return (
        <div className="runner-container">
            <div className="runner-button-container">
                <Button
                    color={"success"}
                    size={"large"}
                    variant={"contained"}
                    className="runner-button-container-button"
                    onClick={newRun}
                >Run</Button>
                <Button
                    color={"warning"}
                    size={"large"}
                    variant={"contained"}
                    className="runner-button-container-button"
                    onClick={clear}
                >Clear</Button>
            </div>
            <h3>batch: {uuid}</h3>
            <div className={"runner-dashboard"}>
                <div className={"runner-dashboard-graph-container"}>
                    <ResponsiveContainer width='60%' minWidth={"60rem"} aspect={3.0}>
                        <LineChart
                            data={rows}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name"/>
                            <YAxis domain={[yMin, yMax]} scale={"linear"}/>
                            <Tooltip/>
                            <Legend/>
                            <Line type="monotone" dataKey="point" stroke="#8884d8" dot={false}/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
