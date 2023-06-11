import * as React from "react";
import {useEffect, useState} from "react";
import GenericTable from "../../Components/MyTable/GenericTable";
import {TableRowData} from "../../Components/MyTable/TableRowData";
import {useNavigate} from "react-router-dom";
import {TableData} from "../../Components/MyTable/TableData";
import "./TasksTab.scss"
import {TaskService} from "../../Services/TaskService";

export default function TasksTab() {

    let navigate = useNavigate();
    const [rows, setRows] = useState([] as TableRowData[])
    const taskService = new TaskService()
    const fetchData = async () => {
        const protoTasks = await taskService.list()
        let newRows: TableRowData[] = []
        for (let i = 0; i < protoTasks.length; i++) {
            newRows.push({
                id: i + 1,
                key: protoTasks[i].getUuid(),
                values: [
                    {key: 1, name: "host:port", value: protoTasks[i].getHost() + ':' + protoTasks[i].getPort()},
                    {key: 2, name: "mode", value: protoTasks[i].getMode()},
                    {key: 3, name: "status", value: protoTasks[i].getStatus()},
                    {key: 4, name: "executionMode", value: protoTasks[i].getExecutionmode()},
                    {key: 5, name: "steps", value: protoTasks[i].getCommandsList()},
                    {key: 6, name: "batches", value: "icon"},
                    {key: 7, name: "runner", value: "icon"},
                    {key: 8, name: "", value: ""},
                ]
            })
        }
        setRows(newRows)
        console.log(rows)
    }
    const updateStatus = async (taskUuid: string) => {
        await taskService.update(taskUuid)
        console.log("updated?")
        fetchData().catch(console.error)
    }
    useEffect(() => {
        fetchData().catch(console.error)
    }, [])


    async function handleGoTo(event: React.MouseEvent<unknown>, id: number, toGo: TableData) {
        let row = rows.find(row => row.id === id)
        if (row) {
            if (toGo.name === "runner") {
                let x = row.values.find(value => value.name === "executionMode")
                if (x?.value === "AUTOMATIC") {
                    await updateStatus(row.key).catch(console.error)
                    console.log("status updated")
                } else {
                    navigate(row.key + "/" + toGo.name, {});
                }
            } else {
                navigate(row.key + "/" + toGo.name, {});
            }
        }
    }

    return (
        <div style={{flex: " 1 1 auto", display: "flex", flexDirection: "column"}}>
            <h1>Tasks</h1>
            <GenericTable rows={rows} handleGoTo={handleGoTo}/>
        </div>

    );

}
