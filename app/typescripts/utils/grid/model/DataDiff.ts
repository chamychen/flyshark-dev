namespace flyshark.utils.grid.model {
    /**
     * 表格数据增、删、改记录
     * 
     * @export
     * @class DataDiff
     */
    export class DataDiff {

        /**
         * 新增记录的ID
         * 
         * @type {string[]}
         * @memberof DataDiff
         */
        addIds: string[];


        /**
         * 修改记录的ID
         * 
         * @type {string[]}
         * @memberof DataDiff
         */
        updateIds: string[];


        /**
         * 删除记录的ID
         * 
         * @type {string[]}
         * @memberof DataDiff
         */
        delIds: string[];

        /**
         * 新增的具体数据
         * 
         * @type {any[]}
         * @memberof DataDiff
         */
        addData: any[];

        /**
         * 修改的具体数据
         * 
         * @type {any[]}
         * @memberof DataDiff
         */
        updateData: any[];

        /**
         * 删除的具体数据
         * 
         * @type {any[]}
         * @memberof DataDiff
         */
        delData: any[];

        /**
         * 错误信息
         * 
         * @type {any[]}
         * @memberof DataDiff
         */
        errorMsgs: any[];

        constructor() {
            this.addIds = [];
            this.updateIds = [];
            this.delIds = [];
            this.addData = [];
            this.updateData = [];
        }
    }
}