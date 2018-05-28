namespace flyshark.dto {

    /**
     * 服务器输出模型
     * 
     * @export
     * @class ResponseModel
     */
    export class ResponseModel<T> {
        success: boolean;

        message: String;

        data: T;
    }
}