namespace flyshark.utils.grid.enums {

    /**
     * 树形列类型
     * 
     * @export
     * @enum {number}
     */
    export enum TreeColType {
        /**
         * 长代码列
         */
        LongCodeField = "长代码",

        /**
         * 链名列
         */
        LinkNameField = "链名",

        /**
         * 父子级关系列
         */
        ParentField = "父级ID",


        /**
         *排序列 
         */
        SortField = "排序号"
    }
}