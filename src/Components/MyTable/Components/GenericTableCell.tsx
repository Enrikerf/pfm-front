import IconButton from "@mui/material/IconButton";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import TableCell from "@mui/material/TableCell";
import * as React from "react";
import {TableData} from "../TableData";
import GenericTableCellIcon from "./GenericTableCellIcon";
import {Text} from "recharts";


export default function GenericTableCell(
    props: {
        id: number,
        tableData: TableData,
        align: any,
        handleGoTo: (event: React.MouseEvent<unknown>, id: number, toGo: TableData) => void
    }
) {
    let list;
    if(props.tableData.value instanceof Array){
        list = props.tableData.value.map(command =>
            <li key={(Math.random() + 1).toString(36).substring(7)}>
                {command}
            </li>
        )
    }else{
        list = props.tableData.value
    }
    return (
        <TableCell
            key={props.id}
            component="th"
            scope="row"
            padding="none"
            align={props.align}
            onClick={
                (event) =>
                    props.handleGoTo(event, props.id, props.tableData.value)
            }
        >
            <ul>{list}</ul>
        </TableCell>
    )
}