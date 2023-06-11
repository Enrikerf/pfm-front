import * as React from "react";
import {useEffect, useState} from "react";
import { useNavigate, useParams} from "react-router-dom";
import GenericTable from "../Components/MyTable/GenericTable";
import {TableRowData} from "../Components/MyTable/TableRowData";
import {TableData} from "../Components/MyTable/TableData";
import {ResultService} from "../Services/ResultService";

export default function ResultsTab() {
    let navigate = useNavigate();
    let {uuid} = useParams()
    const [rows, setRows] = useState([] as TableRowData[])
    const fetchData = async (uuid :string) => {
        const resultService = new ResultService()
        if (uuid) {
            const protoResults = await resultService.getResults(uuid)
            console.log(protoResults)
            let newRows: TableRowData[] = []
            for (let i = 0; i < protoResults.length; i++) {
                newRows.push({
                    id: i + 1,
                    key: protoResults[i].getUuid(),
                    values: [
                        {key: 1, name: "created_at", value: protoResults[i].getCreatedAt()},
                        {key: 2, name: "content",  value: protoResults[i].getContent()},
                        {key: 3, name: "", value: ""},
                    ]
                })
            }
            setRows(newRows)
        }
    }
    useEffect(() => {
        if(uuid){
            fetchData(uuid).catch(console.error)
        }
    }, [uuid])

    async function handleGoTo(event: React.MouseEvent<unknown>, id: number, toGo: TableData) {
    }

    return (
        <div style={{flex: " 1 1 auto", display: "flex", flexDirection: "column"}}>
            <h1>Results</h1>
            <GenericTable rows={rows} handleGoTo={handleGoTo}/>
        </div>
    );

}
