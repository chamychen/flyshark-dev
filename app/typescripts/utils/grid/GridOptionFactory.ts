///<reference path="model/TreeIcons.ts" />
///<reference path="model/TreeReader.ts" />
///<reference path="model/ColModel.ts" />
///<reference path="model/GridOption.ts" />
///<reference path="enums/EditMode.ts" />

namespace flyshark.utils.grid {

    import TreeIcons = flyshark.utils.grid.model.TreeIcons;
    import TreeReader = flyshark.utils.grid.model.TreeReader;
    import ColModel = flyshark.utils.grid.model.ColModel;
    import GridOption = flyshark.utils.grid.model.GridOption;
    import EditMode = flyshark.utils.grid.enums.EditMode;

    export class GridOptionFactory {

        /**
         * 创建普通表格配置
         * 
         * @static
         * @param {string} id 
         * @param {ColModel[]} colModel 
         * @param {EditMode} [editMode=EditMode.OnlyView] 
         * @param {string} rowTitleTemplate
         * @param {string} [url] 
         * @returns {GridOption} 
         * @memberof GridOption
         */
        static createDefaultGridOption(id: string, colModel: ColModel[], editMode: EditMode = EditMode.OnlyView, rowTitleTemplate?: string, url?: string): GridOption {
            if (StringUtils.isEmpty(rowTitleTemplate) && (editMode == EditMode.SingleRowEdit || editMode == EditMode.MultiRowEdit)) {
                throw new Error("编缉模式下rowTitleTemplate不能为空！");
            }
            let gridOption = new GridOption(id, colModel, editMode, url);
            gridOption.rowTitleTemplate = rowTitleTemplate;
            return gridOption;
        }

        /**
         * 创建treeGrid配置
         * 
         * @static
         * @param {string} id 
         * @param {ColModel[]} colModel 
         * @param {EditMode} [editMode=EditMode.OnlyView] 
         * @param {string} rowTitleTemplate
         * @param {string} [url] 
         * @returns {GridOption} 
         * @memberof GridOption
         */
        static createTreeGridOption(id: string, colModel: ColModel[], editMode: EditMode = EditMode.OnlyView, rowTitleTemplate?: string, url?: string): GridOption {
            if (StringUtils.isEmpty(rowTitleTemplate) && (editMode == EditMode.SingleRowEdit || editMode == EditMode.MultiRowEdit)) {
                throw new Error("编缉模式下rowTitleTemplate不能为空！");
            }
            let gridOption = new GridOption(id, colModel, editMode, url);
            gridOption.rowTitleTemplate = rowTitleTemplate;
            gridOption.treeGrid = true;
            gridOption.ExpandColClick = true;
            gridOption.treeGridModel = "adjacency";
            gridOption.treedatatype = "json";
            gridOption.treeIcons = new TreeIcons();
            gridOption.treeReader = new TreeReader();
            return gridOption;
        }

    }
}