namespace flyshark.utils.grid.model {
    /**
    * 编缉控件选项
    */
    export class EditOptions {
        /**
         * 默认值
         * 
         * @type {*}
         * @memberof EditOptions
         */
        defaultValue: any;

        /**
         * 可输入最大长度
         * 
         * @type {number}
         * @memberof EditOptions
         */
        maxlength: number;

        /**
         * 是否可多选(用于select)
         * 
         * @type {boolean}
         * @memberof EditOptions
         */
        multiple: boolean;

        /**
         * 用于select,checkbox的可选项,如{value:'0:待定;1:男;2:女'}
         * 
         * @type {string}
         * @memberof EditOptions
         */
        value: string;

        /**
         * 获取远程数据的url
         * 
         * @type {string}
         * @memberof EditOptions
         */
        dataUrl: string;

        /**
         * 自定义编缉设值、取值方法
         * 
         * @memberof EditOptions processType可为"get\set"(set时返回值为空)
         */
        custom_value: (td: JQuery<HTMLElement>, processType: string) => string;

        // NullIfEmpty: boolean;

        // separator: string;

        // delimiter: string;
    }
}