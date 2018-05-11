namespace flyshark.utils.grid.model {
    /**
     * 输入控件的校验规则
     * 
     * @export
     * @class EditRules
     */
    export class EditRules {
        /**
         * 只在Form Editing模式下有效，设置为true，就可以让隐藏字段也可以修改
         * 
         * @type {boolean}
         * @memberof EditRules
         */
        edithidden: boolean;

        /**
         * 必填校验
         * 
         * @type {boolean}
         * @memberof EditRules
         */
        required: boolean;

        /**
         * 输入值不是数字或者为空，则会报错
         * 
         * @type {boolean}
         * @memberof EditRules
         */
        number: boolean;

        /**
         * 输入值不是整数或者为空，则会报错
         * 
         * @type {boolean}
         * @memberof EditRules
         */
        integer: boolean;

        /**
         * 最小值
         * 
         * @type {number}
         * @memberof EditRules
         */
        minValue: number;

        /**
         * 最大值
         * 
         * @type {number}
         * @memberof EditRules
         */
        maxValue: number;

        /**
         * email格式验证
         * 
         * @type {boolean}
         * @memberof EditRules
         */
        email: boolean;

        /**
         * url格式验证
         * 
         * @type {boolean}
         * @memberof EditRules
         */
        url: boolean;

        /**
         * 日期格式验证
         * 
         * @type {boolean}
         * @memberof EditRules
         */
        date: boolean;

        /**
         * 时间格式验证
         * 
         * @type {boolean}
         * @memberof EditRules
         */
        time: boolean;

        /**
         * 自定义验证规则
         * 
         * @type {boolean}
         * @memberof EditRules
         */
        custom: boolean;

        /**
         * 自定义验证规则对应的验证函数
         * 
         * @memberof EditRules
         */
        custom_func: (value: any, colname: string) => { isCheckOk: boolean, msg: string };
    }
}