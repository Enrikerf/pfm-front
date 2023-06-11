import {ResultServiceClient} from "../protobuf/gen/result_grpc_web_pb";
const resultMessages = require('../protobuf/gen/result_pb')

export class ResultService {
    client: ResultServiceClient
    messages
    newUuid: string

    constructor() {
        this.client = new ResultServiceClient(process.env.BACKEND_URL ?? "http://localhost:8080", null, null)
        this.messages = resultMessages
        this.newUuid = ""
    }

    communicateTaskManually(batchId: string): Promise<string> {
        let request = new resultMessages.CommunicateTaskManuallyRequest()
        request.setTaskUuid(batchId)
        return new Promise((resolve, reject) => {
            this.client.communicateTaskManually(request, {}, function (err, response) {
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    let batchUuid = response.getBatchUuid()
                    resolve(batchUuid)
                }
            })
        })
    }

    getTaskBatches(taskId: string): Promise<proto.result.Batch[]> {
        let request = new resultMessages.GetTaskBatchesRequest()
        request.setTaskUuid(taskId)
        return new Promise((resolve, reject) => {
            this.client.getTaskBatches(request, {}, function (err, response) {
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    let proto = response.getBatchesList()
                    resolve(proto)
                }
            })
        })
    }

    getResults(batchId: string): Promise<proto.result.Result[]> {
        let request = new resultMessages.GetBatchResultsRequest()
        request.setBatchUuid(batchId)
        return new Promise((resolve, reject) => {
            this.client.getBatchResults(request, {}, function (err, response) {
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    let proto = response.getResultsList()
                    resolve(proto)
                }
            })
        })
    }

    getStream(batchUuid: string) {
        let streamResultsRequest = new resultMessages.StreamResultsRequest()
        streamResultsRequest.setBatchUuid(batchUuid)
        return this.client.streamResults(streamResultsRequest, {})
    }
}
