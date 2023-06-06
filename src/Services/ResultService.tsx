import {ResultServiceClient} from "../protobuf/gen/result_grpc_web_pb";
const resultMessages = require('../protobuf/gen/result_pb')
const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

export class ResultService {
    client: ResultServiceClient
    messages
    newUuid: string

    constructor() {
        this.client = new ResultServiceClient("http://2ab0-77-225-241-204.ngrok.io", null, null)
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

    getStream(batchUuid: string) {
        let streamResultsRequest = new resultMessages.StreamResultsRequest()
        streamResultsRequest.setBatchUuid(batchUuid)
        return this.client.streamResults(streamResultsRequest, {})
    }
}
