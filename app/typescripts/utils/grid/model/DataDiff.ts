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
    }
}