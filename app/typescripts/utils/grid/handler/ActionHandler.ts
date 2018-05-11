///<reference path="../../../dts/jquery.d.ts" />
///<reference path="../../../dts/jqgrid.d.ts" />
///<reference path="../../StringUtils.ts" />
///<reference path="../enums/Direction.ts" />
///<reference path="../enums/EditMode.ts" />
///<reference path="../model/DataDiff.ts" />

namespace flyshark.utils.grid.handler {

    import StringUtils = flyshark.utils.StringUtils;
    import Direction = flyshark.utils.grid.enums.Direction;
    import EditMode = flyshark.utils.grid.enums.EditMode;
    import DataDiff = flyshark.utils.grid.model.DataDiff;

    export class ActionHandler {

        /**
         * 新增行
         * 
         * @param {string} [prevRowId=null] 要插入位置的上一行id,可为空
         * @memberof ActionHandler
         */
        addRealRow(prevRowId: string = null) {
            let rowid = StringUtils.newId();
            let keyName = $(this).getN("keyName");
            let data: any = {};
            data[keyName] = rowid;
            let position = StringUtils.isEmpty(prevRowId) ? null : Direction.After;//插入位置

            let editMode = $(this).getN("editMode");
            let isMultiSelect = $(this).getN("multiselect");
            let multiboxonly = $(this).getN("multiboxonly");
            let dataDiff = $(this).getN("dataDiff");
            let isTreeGrid = $(this).getN("treeGrid");
            if (isTreeGrid) {
                if (!StringUtils.isEmpty(prevRowId)) {
                    let parentColumnName = $(this).getTreeReader().parent_id_field;
                    data[parentColumnName] = prevRowId;
                }
                $(this).addTreeNode(data);
                $(this).resetTreeGrid();
            }
            else {
                $(this).addRowData(rowid, data, position, prevRowId);
            }
            //操作记录
            dataDiff.addIds.push(rowid);
            //选中行
            if ((!multiboxonly && isMultiSelect) || !isMultiSelect) {
                $(this).setSelection(rowid);
            }
            //打开编缉模式
            if (editMode == EditMode.SingleRowEdit) {
                $(this).batchEditExit();
            }
            $(this).editRow(rowid, false);
        }

        /**
         * 删除行
         * 
         * @param {string} rowid 
         * @param {boolean} [isLog=true] 
         * @memberof ActionHandler
         */
        delRealRow(rowid: string) {
            let isTreeGrid = $(this).getN("treeGrid");
            let dataDiff: DataDiff = $(this).getN("dataDiff");
            if (isTreeGrid) {
                let delData = $(this).delTreeNode(rowid);
                delData.forEach(d => {
                    let ind = dataDiff.addIds.indexOf(d.id);
                    if (ind > -1) {
                        dataDiff.addIds.splice(ind, 1);
                    }
                    else {
                        dataDiff.delIds.push(d.id);
                    }
                })
                $(this).resetTreeGrid();
            }
            else {
                $(this).jqGrid("delRowData", rowid);
                dataDiff.delIds.push(rowid);
            }
        }
    }
}