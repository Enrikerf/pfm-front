import {TaskServiceClient} from "../protobuf/gen/task_grpc_web_pb";

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
        let request = new taskMessages.ListTasksRequest()
        return new Promise((resolve, reject) => {
            this.client.listTasks(request, {}, function (err, response) {
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

    update(taskId: string): Promise<any> {
        let request = new taskMessages.UpdateTaskRequest()
        let editableTaskParams = new taskMessages.EditableTaskParams()
        editableTaskParams.setStatus(1)
        request.setTaskUuid(taskId)
        request.setParams(editableTaskParams)
        console.log(request)
        return new Promise((resolve, reject) => {
            this.client.updateTask(request, {}, function (err, response) {
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    console.log("ok")
                    console.log(response)
                    resolve(response)
                }
            })
        })
    }


    stop(uuid: string): Promise<any> {
        console.log("valid uuid to stop> " + uuid)
        let updateTaskRequest = new taskMessages.UpdateTaskRequest()
        let updateTaskParams = new taskMessages.EditableTaskParams()
        updateTaskRequest.setTaskUuid(uuid)
        updateTaskParams.setStatus(3)
        updateTaskRequest.setParams(updateTaskParams)
        return new Promise((resolve, reject) => {
            this.client.updateTask(updateTaskRequest, {}, function (err, response) {
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    console.log("stopped: " + uuid)
                    resolve(response)
                }
            })
        })
    }

}
