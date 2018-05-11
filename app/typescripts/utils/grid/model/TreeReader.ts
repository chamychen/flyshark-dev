namespace flyshark.utils.grid.model {
    /**
     * 树结构colmodel读取模型
     * 
     * @export
     * @class TreeReader
     */
    export class TreeReader {

        /**
         * 排序操作列
         * 
         * @memberof TreeReader
         */
        readonly sort_Controll_field: string = "treeSortControl";

        /**
         * 区分父子级关系的列
         * 
         * @type {string}
         * @memberof TreeReader
         */
        parent_id_field: string = "treeParentId";

        /**
         * 标识节点级别的列，默认最高级为0
         * 
         * @type {string}
         * @memberof TreeReader
         */
        level_field: string = "treeLevel";

        /**
         * 标识为叶节点
         * 
         * @type {string}
         * @memberof TreeReader
         */
        leaf_field: string = "treeIsLeaf";

        /**
         * 标识为是否展开的列
         * 
         * @type {string}
         * @memberof TreeReader
         */
        expanded_field: string = "treeExpanded";

        /**
         * 标识为是否加载完成的列
         * 
         * @type {string}
         * @memberof TreeReader
         */
        loaded: string = "treeLoaded";

        /**
         * icon列
         * 
         * @type {string}
         * @memberof TreeReader
         */
        icon_field: string = "treeIcon";

        /**
         * 长代码列
         * 
         * @type {string}
         * @memberof TreeReader
         */
        long_code_field: string;


        /**
         * 链名列
         * 
         * @type {string}
         * @memberof TreeReader
         */
        link_name_field: string;
    }
}