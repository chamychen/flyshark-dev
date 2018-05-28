///<reference path="../../dto/ResponseModel.ts" />
///<reference path="RestMethod.ts" />


namespace flyshark.utils.rest {

    import ResponseModel = flyshark.dto.ResponseModel;

    export interface Rest {
        /**
         * 请求
         * 
         * @param {RestMethod} methodType 请求类型
         * @param {string} url 请求地址
         * @param {object} data 请求数据
         * @param {boolean} isSync 是否同步
         * @param {(result, status, xhr) => {}} [successFunc] 成功处理方法
         * @param {(xhr, status, error) => {}} [errorFunc] 异常处理方法
         * @memberof Rest
         */
        query<T>(methodType: RestMethod, url: string, data: object, isSync: boolean, successFunc?: (result: ResponseModel<T>, status: any, xhr: any) => void, errorFunc?: (xhr: any, status: any, error: any) => void): void;
    }
}