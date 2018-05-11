///<reference path="../../btn/BtnModel.ts" />
///<reference path="../enums/EditType.ts" />
///<reference path="EditRules.ts" />
///<reference path="EditOptions.ts" />
///<reference path="../enums/TreeColType.ts" />

namespace flyshark.utils.grid.model {

    import BtnModel = flyshark.utils.btn.BtnModel;
    import EditType = flyshark.utils.grid.enums.EditType;
    import EditRules = flyshark.utils.grid.model.EditRules;
    import EditOptions = flyshark.utils.grid.model.EditOptions;
    import TreeColType = flyshark.utils.grid.enums.TreeColType;

    export class ColModel {
        /**
         * 是否需要取值，默认为取
         * 
         * @type {boolean}
         * @memberof ColModel
         */
        canGetValue: boolean = true;

        /**
         * 表格列的名称，所有关键字，保留字都不能作为名称使用包括subgrid, cb and rn
         * 
         * @type {string}
         * @memberof ColModel
         */
        name: string;

        /**
         * 如果colNames为空则用此值作为列的显示名称，如果都没有设置则使用name值
         * 
         * @type {string}
         * @memberof ColModel
         */
        label: string;

        /**
         * 和数据库列同名
         * 
         * @type {string}
         * @memberof ColModel
         */
        index: string;

        /**
         * 日期格式,默认为yyyy-MM-dd
         * 
         * @type {string}
         * @memberof ColModel
         */
        datefmt: string = 'yyyy-MM-dd';


        /**
         * 默认列的宽度，只能是象素值，不能是百分比
         * 
         * @type {number}
         * @memberof ColModel
         */
        width: number;

        /**
         * 列宽度是否固定不可变
         * 
         * @type {boolean}
         * @memberof ColModel
         */
        fixed: boolean;

        /**
         * 是否可排序
         * 
         * @type {boolean}
         * @memberof ColModel
         */
        sortable: boolean = false;

        /**
         * 当datatype为local时，定义搜索列的类型
         * 可选值：int/integer/float/number/currency/date/text
         * 
         * @type {string}
         * @memberof ColModel
         */
        sorttype: string = 'text';


        /**
         * 是否隐藏
         * 
         * @type {boolean}
         * @memberof ColModel
         */
        hidden: boolean = false;

        /**
         * 是否主键列
         * 
         * @type {boolean}
         * @memberof ColModel
         */
        key: boolean = false;

        /**
         * 设置列的css。多个class之间用空格分隔
         * 
         * @type {string}
         * @memberof ColModel
         */
        classes: string;


        /**
         * 对齐方式
         * 
         * @type {string}
         * @memberof ColModel
         */
        align: string = "left";


        /**
         * 格式化方法
         * 
         * @memberof ColModel
         */
        formatter: (cellvalue: any, options: any, rowObject: any) => string = null;


        /**
          * 按钮列的按钮定义
          */
        btnModels: BtnModel[];

        /**
         * 树结构类型
         * 
         * @type {TreeColType}
         * @memberof TreeColModel
         */
        treeColType: TreeColType;


        /**
        * 是否可编缉
        */
        editable: boolean = false;

        /**
         * 编缉类型
         */
        edittype: EditType = EditType.text;

        /**
         * 编辑的一系列选项
         * editoptions: {dataUrl:”/jqGrid/admin/deplistforstu.action”}},这个是演示动态从服务器端获取数据
         */
        editoptions: EditOptions = new EditOptions();

        /**
        * 编缉规则
        * editrules: {edithidden:true,required:true,number:true,minValue:10,maxValue:100}}
        * 设定 年龄的最大值为100，最小值为10，而且为数字类型，并且为必输字段。
        */
        editrules: EditRules = new EditRules();

        /**
         * Creates an instance of ColModel.
         * @param {string} name 数据库列名
         * @param {string} title 标题
         * @param {number} [width=80] 宽度
         * @param {boolean} [fixed=true] 是否固定宽度
         * @param {(cellvalue: any, options: any, rowObject: any) => string} [formatter] 格式化方法
         * @memberof ColModel
         */
        constructor(name: string, title: string, width: number = 80, fixed: boolean = true, formatter?: (cellvalue: any, options: any, rowObject: any) => string) {
            this.name = name;
            this.index = name;
            this.label = title;
            this.width = width;
            this.fixed = fixed;
            this.formatter = formatter;
        }

        setTextEdit(required: boolean, maxLength: number) {
            this.edittype = EditType.text;
            this.editoptions.maxlength = maxLength;
            this.editrules.required = required;
        }

        setTextAreaEdit(required: boolean, maxLength: number) {
            this.edittype = EditType.textarea;
            this.editoptions.maxlength = maxLength;
            this.editrules.required = required;
        }

        setUrlEdit(required: boolean) {
            this.edittype = EditType.text;
            // this.edittype = EditType.url;
            this.editoptions.maxlength = 200;
            this.editrules.url = true;
            this.editrules.required = required;
        }

        setEmailEdit(required: boolean) {
            this.edittype = EditType.text;
            // this.edittype = EditType.email;
            this.editoptions.maxlength = 200;
            this.editrules.email = true;
            this.editrules.required = required;
        }

        setIntEdit(required: boolean, minValue: number = -10000000000000, maxValue: number = 10000000000000) {
            // this.edittype = EditType.number;
            this.edittype = EditType.text;
            this.editrules.minValue = minValue;
            this.editrules.maxValue = maxValue;
            this.editrules.required = required;
            this.editrules.integer = true;
        }

        setNumberEdit(required: boolean, minValue: number = -10000000000000, maxValue: number = 10000000000000) {
            // this.edittype = EditType.number;
            this.edittype = EditType.text;
            this.editrules.minValue = minValue;
            this.editrules.maxValue = maxValue;
            this.editrules.required = required;
            this.editrules.number = true;
        }

        setDateEdit(required: boolean) {
            // this.edittype = EditType.date;
            this.edittype = EditType.text;
            this.editrules.date = true;
            this.editrules.required = required;
        }

        setTimeEdit(required: boolean) {
            this.edittype = EditType.text;
            // this.edittype = EditType.time;
            this.editrules.required = required;
        }

        setDateTimeLocalEdit(required: boolean) {
            this.edittype = EditType.text;
            // this.edittype = EditType.datetimelocal;
            this.editrules.required = required;
        }

        setMonthEdit(required: boolean) {
            this.edittype = EditType.text;
            // this.edittype = EditType.month;
            this.editrules.required = required;
        }

        setWeekEdit(required: boolean) {
            this.edittype = EditType.text;
            // this.edittype = EditType.week;
            this.editrules.required = required;
        }

        setYearEdit(required: boolean) {
            this.edittype = EditType.text;
            // this.edittype = EditType.year;
            this.editrules.required = required;
        }

        /**
         * 自定义编缉
         * @param editType 编缉类型
         * @param custom_func 自定义验证规则方法
         */
        setCustomEdit(editType: EditType, custom_func: (value: any, columnName: string) => { isCheckOk: boolean, msg: string }) {
            this.edittype = this.edittype;
            this.editrules.custom = true;
            this.editrules.custom_func = custom_func;
        }
    }
}