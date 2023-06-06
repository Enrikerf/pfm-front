import {TaskServiceClient} from "../protobuf/gen/task_grpc_web_pb";
import {TableRowData} from "../Components/MyTable/TableRowData";

const taskMessages = require('../protobuf/gen/task_pb')
const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

export class TaskService {
    client: TaskServiceClient
    messages


    constructor() {
        this.client = new TaskServiceClient(process.env.BACKEND_URL ?? "http://localhost:8080", null, null)
        this.messages = taskMessages
    }

    list(): Promise<proto.task.Task[]> {
        let ListRequest = new taskMessages.ListTasksRequest()
        return new Promise((resolve, reject) => {
            this.client.listTasks(ListRequest, {}, function (err, response) {
                console.log(ListRequest)
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    let protoTasks = response.getTasksList()
                    resolve(protoTasks)
                }
            })
        })
    }


    stop(uuid: string) {
        if (regexExp.test(uuid)) {
            let updateTaskRequest = new taskMessages.UpdateTaskRequest()
            let updateTaskParams = new taskMessages.EditableTaskParams()
            updateTaskRequest.setTaskUuid(uuid)
            updateTaskParams.setStatus(3)
            updateTaskRequest.setParams(updateTaskParams)
            this.client.updateTask(updateTaskRequest, {}, function (err, response) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("stopped: " + uuid)
                }
            })
        } else {
            console.log("invalid uuid to stop")
        }

    }

}
