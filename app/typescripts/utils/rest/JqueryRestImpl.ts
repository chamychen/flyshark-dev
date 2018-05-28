///<reference path="../../dts/jquery.d.ts" />
///<reference path="../../dto/ResponseModel.ts" />
///<reference path="RestMethod.ts" />
///<reference path="Rest.ts" />


namespace flyshark.utils.rest {

    import ResponseModel = flyshark.dto.ResponseModel;

    export class JqueryRestImpl implements Rest {
        /**
         * JQGURY发起Rest请求
         * 
         * @param {RestMethod} methodType 请求类型
         * @param {string} url 请求地址
         * @param {object} data 请求数据
         * @param {boolean} isSync 是否同步
         * @param {(result, status, xhr) => {}} [successFunc] 成功处理方法
         * @param {(xhr, status, error) => {}} [errorFunc] 异常处理方法
         * @memberof Rest
         */
        public query<T>(methodType: RestMethod, url: string, data: object, isSync: boolean, successFunc?: (result: ResponseModel<T>, status: any, xhr: any) => void, errorFunc?: (xhr: any, status: any, error: any) => void): void {
            let isAsync = isSync ? false : true;//是否异步
            $.ajax(url, {
                async: isAsync,
                type: methodType,
                data: data,
                contentType: "application/json;charset=utf-8",
                crossDomain: true,
                success: function (result, status, xhr) {
                    if (successFunc) {
                        if (result) {
                            result = StringUtils.toJsonObject(result);
                        }
                        successFunc(result, status, xhr);
                    }
                },
                error: function (xhr, status, error) {
                    if (errorFunc) {
                        errorFunc(xhr, status, error);
                    }
                }
            });
        }
    }
}