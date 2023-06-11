import * as React from "react";
import {useEffect, useState} from "react";
import GenericTable from "../../Components/MyTable/GenericTable";
import {TableRowData} from "../../Components/MyTable/TableRowData";
import {TableData} from "../../Components/MyTable/TableData";
import {useNavigate, useParams} from "react-router-dom";
import {ResultService} from "../../Services/ResultService";

export default function BatchesList() {

    let navigate = useNavigate();
    let {uuid} = useParams()
    const [rows, setRows] = useState([] as TableRowData[])
    const fetchData = async (uuid :string) => {
        const resultService = new ResultService()
        if (uuid) {
            const protoBatches = await resultService.getTaskBatches(uuid)
            console.log(protoBatches)
            let newRows: TableRowData[] = []
            for (let i = 0; i < protoBatches.length; i++) {
                newRows.push({
                    id: i + 1,
                    key: protoBatches[i].getUuid(),
                    values: [
                        {key: 1, name: "created_at", value: protoBatches[i].getCreatedAt()},
                        {key: 2, name: "results", value: "icon"},
                        {key: 2, name: "graphs", value: "icon"},
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
        if (toGo.value === "icon") {
            let newUuid = rows.find(row => row.id === id)?.key
            if (newUuid) {
                if (uuid) {
                    navigate(newUuid + "/" + toGo.name, {});
                } else {
                    navigate(newUuid + "/" + toGo.name, {});
                }
            }
        } else {
            navigate("/", {replace: true});
        }
    }

    return (
        <div style={{flex: " 1 1 auto", display: "flex", flexDirection: "column"}}>
            <h1>Batches</h1>
            <GenericTable rows={rows} handleGoTo={handleGoTo}/>
        </div>
    );

}
