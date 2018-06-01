///<reference path="../../StringUtils.ts" />
///<reference path="../model/TreeReader.ts" />
///<reference path="../enums/Direction.ts" />

namespace flyshark.utils.grid.handler {

    import StringUtils = flyshark.utils.StringUtils;
    import Direction = flyshark.utils.grid.enums.Direction;
    import TreeReader = flyshark.utils.grid.model.TreeReader;

    export class TreeHandler {
        /**
         * 获取长代码前缀
         * 
         * @private
         * @param {string} longCode 
         * @returns 返回长代码前缀（顶级没有前缀）
         * @memberof TreeHandler
         */
        getLongCodePrev(longCode: string): string {
            if (!StringUtils.isEmpty(longCode) && longCode.indexOf(".") > -1) {
                return longCode.substr(0, longCode.lastIndexOf("."));
            }
            else {
                return null;
            }
        }

        /**
         * 获取长代码后缀
         * @param longCode
         * @returns {*}
         */
        getLongCodeSuffix(longCode: string): number {
            if (!StringUtils.isEmpty(longCode)) {
                return parseInt(longCode.substr(longCode.lastIndexOf(".") + 1));
            }
            else {
                return null;
            }
        }

        /**
         * 转换为长代码
         * 
         * @private
         * @param {any} args 
         * @returns {string} 
         * @memberof TreeHandler
         */
        toLongCode(...args: any[]): string {
            let longCode: string;
            if (args) {
                for (let i = 0; i < args.length; i++) {
                    if (args[i]) {
                        if (!longCode) {
                            longCode = "";
                        }
                        longCode += "." + args[i];
                    }
                }
                if (longCode) {
                    longCode = longCode.substr(1);
                }
            }
            return longCode;
        }


        /**
         * 获取TreeReader
         * 
         * @returns {TreeReader} 
         * @memberof TreeHandler
         */
        getTreeReader(): TreeReader {
            return $(this).getN("treeReader");
        }

        /**
         * 获取父级
         * 
         * @param {*} rowData 
         * @returns {*} 
         * @memberof TreeHandler
         */
        getParentRowData(rowData: any): any {
            if (rowData) {
                let parentColoumnName = $(this).getTreeReader().parent_id_field;
                let parentId = rowData[parentColoumnName];
                if (!StringUtils.isEmpty(parentId)) {
                    return $(this).getRealRowData(parentId)
                }
            }
            return null;
        }

        /**
         * 将treeGrid转换为普通表格
         * 
         * @memberof TreeHandler
         */
        castToDefaultGrid() {
            $(this).find(".cell-wrapper,.cell-wrapperleaf").each(function () {
                $(this).closest("td").attr("title", $(this).text());
                this.outerHTML = $(this).text();
            });
            $(this).find(".tree-wrap").remove();
        }

        /**
         * 重置treeGrid
         * 
         * @memberof TreeHandler
         */
        resetTreeGrid() {
            $(this).castToDefaultGrid();
            var ids = $(this).getDataIDs();
            if (ids && ids.length > 0) {
                $(this).setTreeNode(1, ids.length + 1);
            }
        }

        /**
         * 根据长代码获取节点
         * 
         * @param {string} longCode 
         * @returns {*} 
         * @memberof TreeHandler
         */
        getNodeByLongCode(longCode: string): any {
            let longCodeColumnName = $(this).getTreeReader().long_code_field;
            let data = $(this).searchData(r => {
                if (r[longCodeColumnName] == longCode) {
                    return true;
                }
                else {
                    return false;
                }
            }, true, false);
            if (data && data.length > 0) {
                return data[0];
            }
            else {
                return null;
            }
        }

        /**
         * 获取子节点
         * @param rowData 
         * @param allLevel 是否包含所有后代节点（默认只包含子级）
         */
        getNodeChild(rowData: any, allLevel: boolean = false): any[] {
            let data: any[];
            let parentColoumnName = $(this).getTreeReader().parent_id_field;

            if (rowData) {
                let id = $(this).getId(rowData);
                let longCodeColumnName = $(this).getTreeReader().long_code_field;
                let longCode = rowData[longCodeColumnName];
                let reg = new RegExp("(^" + longCode.replace(/\./g, '\\.') + "\\.)(.*?$)");
                if (allLevel) {
                    data = $(this).searchData(r => {
                        if (r[longCodeColumnName].match(reg)) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }, false, true);
                }
                else {
                    //查询出所有后代节点
                    let searchData = $(this).searchData(r => {
                        if (r[longCodeColumnName].match(reg)) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }, false, true);
                    if (searchData && searchData.length > 0) {
                        data = [];
                        //在后代节点中过滤可加速性能
                        searchData.for2(r => {
                            if (r[parentColoumnName] == id) {
                                data.push(r);
                            }
                        })
                    }
                }
            }
            else {
                if (allLevel) {
                    data = $(this).searchData(null, false, false);
                }
                else {
                    data = $(this).searchData(r => {
                        if (!r[parentColoumnName]) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }, false, false);
                }
            }
            return data;
        }

        /**
         * 获取子节点个数
         * @param rowData 
         * @param allLevel 是否包含所有后代节点（默认只包含子级）
         */
        getNodeChildCount(rowData: any, allLevel: boolean = false): number {
            let childCount = 0;
            let parentColoumnName = $(this).getTreeReader().parent_id_field;

            if (rowData) {
                let id = $(this).getId(rowData);
                let longCodeColumnName = $(this).getTreeReader().long_code_field;
                let longCode = rowData[longCodeColumnName];
                let reg = new RegExp("(^" + longCode.replace(/\./g, '\\.') + "\\.)(.*?$)");
                if (allLevel) {
                    childCount = $(this).getCount(r => {
                        if (r[longCodeColumnName].match(reg)) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }, true);
                }
                else {
                    //查询出所有后代节点
                    let searchData = $(this).searchData(r => {
                        if (r[longCodeColumnName].match(reg)) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }, false, true);
                    if (searchData && searchData.length > 0) {
                        //在后代节点中过滤可加速性能
                        searchData.for2(r => {
                            if (r[parentColoumnName] == id) {
                                childCount += 1;
                            }
                        })
                    }
                }
            }
            else {
                if (allLevel) {
                    childCount = $(this).getCount(null, false);
                }
                else {
                    childCount = $(this).getCount(r => {
                        if (!r[parentColoumnName]) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }, false);
                }
            }
            return childCount;
        }

        /**
         * 偏移节点(longCode为空或null时将偏移所有节点)
         * 
         * @private
         * @param {string} longCode 可以为空或null
         * @param {number} offsetValue 
         * @memberof TreeHandler
         */
        offsetNode(longCode: string, offsetValue: number) {
            if (StringUtils.isEmpty(longCode)) {
                throw new Error("longCode不可为空！");
            }
            else {
                if (offsetValue != 0) {
                    let longCodeColumnName = $(this).getTreeReader().long_code_field;
                    let longCodePrev = $(this).getLongCodePrev(longCode);
                    let longCodeSuffix = $(this).getLongCodeSuffix(longCode);
                    let reg = new RegExp("^(\\d+)(.*?$)");
                    if (!StringUtils.isEmpty(longCodePrev)) {
                        reg = new RegExp("(^" + longCodePrev.replace(/\./g, '\\.') + "\\.)(\\d+)(.*?$)");
                    }

                    let ids = $(this).getDataIDs();
                    if (ids) {
                        ids.for2(id => {
                            let thisRowData = $(this).getRealRowData(id);
                            let thisLongCode = thisRowData[longCodeColumnName];
                            let match = thisLongCode.match(reg);
                            if (match) {
                                let match1 = StringUtils.isEmpty(longCodePrev) ? "" : match[1];
                                let match2 = StringUtils.isEmpty(longCodePrev) ? parseInt(match[1]) : parseInt(match[2]);
                                let match3 = StringUtils.isEmpty(longCodePrev) ? match[2] : match[3];

                                if (match2 >= longCodeSuffix) {
                                    match2 = match2 + offsetValue;
                                    let newLongCode = match1 + match2.toString() + match3;
                                    thisRowData[longCodeColumnName] = newLongCode;
                                    $(this).setRowData(id, thisRowData);
                                    $(this).updatePossible(id);
                                }
                            }
                        })
                    }
                }
            }
        }

        /**
         * 新增树节点
         * 
         * @param {*} rowData 
         * @memberof TreeHandler
         */
        addTreeNode(rowData: any) {
            if (rowData) {
                let rowId = $(this).getId(rowData);
                if (!rowId) {
                    throw new Error("新增节点ID不能为空！");
                }
                let leafFieldName = $(this).getTreeReader().leaf_field;
                rowData[leafFieldName] = true;
                rowData.treeLoaded = true;
                rowData.treeExpanded = true;
                let longCodeColumn = $(this).getTreeReader().long_code_field;
                let longCode = rowData[longCodeColumn];
                let parent = $(this).getParentRowData(rowData);
                let parentChildCount = $(this).getNodeChildCount(parent, false);
                let parentLongCode = "";
                let parentId = "";
                //处理父级
                if (parent) {
                    parentId = $(this).getId(parent);
                    parentLongCode = parent[longCodeColumn];
                    parent[leafFieldName] = false;
                    $(this).setRowData(parentId, parent, null);
                }

                let oldNode = null;
                //新节点已有长代码的处理              
                if (!StringUtils.isEmpty(longCode)) {
                    let longCodePrev = $(this).getLongCodePrev(longCode);
                    let longCodeSuffix = $(this).getLongCodeSuffix(longCode);
                    //根据实际数据来修正长代码
                    if (longCodeSuffix > parentChildCount + 1 || longCodeSuffix <= 0) {
                        longCode = $(this).toLongCode(longCodePrev, (parentChildCount + 1));
                        rowData[longCodeColumn] = longCode;
                    }
                    //如果该长代码已存在，则向下偏移原长代码对应的节点
                    if (longCodeSuffix <= parentChildCount) {
                        oldNode = $(this).getNodeByLongCode(longCode);
                        if (oldNode) {
                            this.offsetNode(longCode, 1);
                        }
                    }
                }
                //新节点无长码则生成长代码
                else {
                    if (!parentLongCode) {
                        longCode = $(this).toLongCode(null, (parentChildCount + 1));
                    }
                    else {
                        longCode = $(this).toLongCode(parentLongCode, (parentChildCount + 1));
                    }
                    rowData[longCodeColumn] = longCode;
                }
                //生成节点层级
                rowData.treeLevel = longCode.split('.').length - 1;
                //有旧节点，则插入到旧节点之前
                if (oldNode) {
                    $(this).addRowData(rowId, rowData, Direction.Before, $(this).getId(oldNode));
                }
                else {
                    if (!parent) {
                        $(this).addRowData(rowId, rowData, null, null);
                    }
                    else {
                        //父级下无子节点
                        if (parentChildCount == 0) {
                            $(this).addRowData(rowId, rowData, Direction.After, parentId);
                        }
                        //父级下有子节点
                        else {
                            let prevBrotherLongCode = $(this).toLongCode(parentLongCode, parentChildCount);
                            let preBrother = $(this).getNodeByLongCode(prevBrotherLongCode);//上一兄弟节点
                            if (!preBrother) {
                                throw new Error("长代码异常！");
                            }
                            else {
                                let reg = new RegExp("(^" + prevBrotherLongCode.replace(/\./g, '\\.') + "\\.)(.*?$)");
                                if (preBrother[this.getTreeReader().leaf_field] == "true") {
                                    $(this).addRowData(rowId, rowData, Direction.After, $(this).getId(preBrother));
                                }
                                else {
                                    //上一兄弟节点的最后一个后代节点
                                    let prevBrotherChild = $(this).searchData(r => {
                                        if (r[longCodeColumn].match(reg)) {
                                            return true;
                                        }
                                        else {
                                            return false;
                                        }
                                    }, false, true);
                                    $(this).addRowData(rowId, rowData, Direction.After, $(this).getId(prevBrotherChild[prevBrotherChild.length - 1]));
                                }
                            }
                        }
                    }
                }
            }
        }

        /**
         * 删除树形节点
         * 
         * @param {string} rowId 
         * @returns 
         * @memberof TreeHandler
         */
        delTreeNode(rowId: string): { id: string, longCode: string, rowD: any, isSel: boolean, isEdit: boolean }[] {
            let result: Array<any>;
            let data;
            let longCodeColumnName = this.getTreeReader().long_code_field;
            let rowData;
            //没有id则删除所有行
            if (StringUtils.isEmpty(rowId)) {
                data = $(this).searchData(null, false, false);
            }
            else {
                rowData = $(this).getRealRowData(rowId);
                data = $(this).getNodeChild(rowData, true);
                if (!data) {
                    data = [];
                }
                data.unshift(rowData);
            }

            if (data && data.length > 0) {
                data.for2(d => {
                    let thisId = $(this).getId(d);
                    let thisLongCode = d[longCodeColumnName];
                    let thisIsSelect = $("#" + thisId).attr("aria-selected") == "true";
                    let thisIsEdit = $("#" + thisId).attr("editable") == "1";
                    if (!result) {
                        result = [];
                    }
                    result.push({ id: thisId, longCode: thisLongCode, rowD: d, isSel: thisIsSelect, isEdit: thisIsEdit });
                    $(this).delRowData(thisId);
                })
            }

            if (rowData) {
                let parent = $(this).getParentRowData(rowData);
                if (parent) {
                    let childCount = $(this).getNodeChildCount(parent, true);
                    if (childCount == 0) {
                        let leafFieldName = $(this).getTreeReader().leaf_field;
                        parent[leafFieldName] = true;
                        let parentId = $(this).getId(parent);
                        $(this).setRowData(parentId, parent, null);
                        $(this).updatePossible(parentId);
                    }
                }
                //偏移后续节点
                $(this).offsetNode(rowData[longCodeColumnName], -1);
            }
            return result;
        }

        /**
         * 检查是否可移动 
         * 
         * @param {string} rowId 
         * @param {number} type 1上移2下移3左移4右移
         * @returns {string} 返回移动后的长代码
         * @memberof TreeHandler
         */
        getMovedLongCode(rowId: string, type: number): string {
            let result: string;
            if (!StringUtils.isEmpty(rowId)) {
                let rowData = $(this).getRealRowData(rowId);
                if (rowData) {
                    let longCodeColumnName = $(this).getTreeReader().long_code_field;
                    let longCode = rowData[longCodeColumnName];
                    let longCodePrev = $(this).getLongCodePrev(longCode);
                    let longCodeSuffix = $(this).getLongCodeSuffix(longCode);
                    let parent = $(this).getParentRowData(rowData);

                    switch (type) {
                        case 1:
                            if (longCodeSuffix == 1) {
                                Common.alertWarn("该节点已经在最前了,无法上移。");
                                result = null;
                            }
                            else {
                                result = $(this).toLongCode(longCodePrev, longCodeSuffix - 1);
                            }
                            break;
                        case 2:
                            let parentChildCount = this.getNodeChildCount(parent);
                            if (longCodeSuffix == parentChildCount) {
                                Common.alertWarn("该节点已经在最末了,无法下移。");
                                result = null;
                            }
                            else {
                                result = $(this).toLongCode(longCodePrev, longCodeSuffix + 1);
                            }
                            break;
                        case 3:
                            if (!parent) {
                                Common.alertWarn("该节点已经是最高层级了,无法左移。");
                                result = null;
                            }
                            else {
                                //该注释为移到父级的最后
                                // let grandpa = !parent ? null : $(this).getParentRowData(parent);
                                // let grandpaChildCount = !parent ? 0 : this.getNodeChildCount(grandpa);
                                // let longCodeColumn = $(this).getN("LongCodeColumn");
                                // let grandpaLongCode = !grandpa ? "" : grandpa[longCodeColumn];
                                // result = $(this).toLongCode(grandpaLongCode, grandpaChildCount + 1);
                                //左移为移到父级的下一个兄弟节点
                                let parentLongCode = parent[longCodeColumnName];
                                let parentLongCodePrev = $(this).getLongCodePrev(parentLongCode);
                                let parentLongCodeSuffix = $(this).getLongCodeSuffix(parentLongCode);
                                result = $(this).toLongCode(parentLongCodePrev, parentLongCodeSuffix + 1);
                            }
                            break;
                        case 4:
                            if (longCodeSuffix == 1) {
                                Common.alertWarn("该节点之前没有其他节点，无法右移。");
                                result = null;
                            }
                            else {
                                let prevBortherLongCode = $(this).toLongCode(longCodePrev, longCodeSuffix - 1);
                                let prevBrother = $(this).getNodeByLongCode(prevBortherLongCode);
                                let prevBrotherChildCount = this.getNodeChildCount(prevBrother);
                                result = $(this).toLongCode(prevBortherLongCode, prevBrotherChildCount + 1);
                            }
                            break;
                    }
                }
            }
            return result;
        }

        /**
         * 移动节点
         * 
         * @param {string} rowId 
         * @param {string} newLongCode 要移动到的长代码
         * @returns 
         * @memberof TreeHandler
         */
        move(rowId: string, newLongCode: string) {
            newLongCode = StringUtils.trim(newLongCode);
            let longCodeCheckReg = /^(\d+\.)*(\d+)$/;
            if (StringUtils.isEmpty(rowId)) {
                Common.alertError("RowId不能为空！");
            }
            else if (!newLongCode) {
                Common.alertError("长代码不能为空！");
            }
            else if (!newLongCode.match(longCodeCheckReg)) {
                Common.alertError("长代码【" + newLongCode + "】不合规则！");
            }
            else {
                let rowData = $(this).getRealRowData(rowId);
                if (rowData) {
                    let longCodeColumnName = $(this).getTreeReader().long_code_field;
                    let oldLongCode = rowData[longCodeColumnName];
                    if (oldLongCode == newLongCode) {
                        return;
                    }
                    let reg = new RegExp("(^" + oldLongCode.replace(/\./g, '\\.') + "\\.)(.*?$)");
                    if (newLongCode.match(reg)) {
                        Common.alertError("无法移动，因为【" + newLongCode + "】节点在当前节点内部！");
                        return;
                    }
                    let newLongCodePrev = $(this).getLongCodePrev(newLongCode);
                    let newParent = StringUtils.isEmpty(newLongCodePrev) ? null : $(this).getNodeByLongCode(newLongCodePrev);
                    if (newLongCodePrev && !newParent) {
                        Common.alertError("无法移动，因为所依赖的【" + newLongCodePrev + "】节点不存在！");
                        return;
                    }
                    var delData = $(this).delTreeNode(rowId);
                    if (delData) {
                        let prevDataId = "";
                        let leafFieldName = $(this).getTreeReader().leaf_field;
                        let parentColoumnName = $(this).getTreeReader().parent_id_field;
                        let diffLevel = newLongCode.split('.').length - oldLongCode.split(".").length;
                        for (let i = 0; i < delData.length; i++) {
                            let d = delData[i];
                            let isSelect = d.isSel;
                            let isEdit = d.isEdit;
                            if (i == 0) {
                                d.rowD[longCodeColumnName] = newLongCode;
                                let newLongCodePrev = $(this).getLongCodePrev(newLongCode);
                                if (!newLongCodePrev || StringUtils.isEmpty(newLongCodePrev)) {
                                    d.rowD[parentColoumnName] = "";
                                }
                                else {
                                    let newParent = $(this).getNodeByLongCode(newLongCodePrev);
                                    let newParentId = $(this).getId(newParent);
                                    d.rowD[parentColoumnName] = newParentId;
                                }
                                $(this).addTreeNode(d.rowD);
                                $(this).updatePossible(d.id);
                                if (delData.length > 1) {
                                    d.rowD[leafFieldName] = false;
                                    $(this).setRowData(d.id, d.rowD, null);
                                    newLongCode = d.rowD[longCodeColumnName];
                                }
                            }
                            else {
                                let reg = new RegExp("(^" + oldLongCode.replace(/\./g, '\\.') + "\\.)(.*?$)");
                                let thisNewLongCode = d.rowD[longCodeColumnName].replace(reg, newLongCode + ".$2");
                                d.rowD[longCodeColumnName] = thisNewLongCode;
                                d.rowD.treeLevel = parseInt(d.rowD.treeLevel) + diffLevel;
                                d.longCode = thisNewLongCode;
                                $(this).addRowData(d.id, d.rowD, Direction.After, prevDataId);
                                $(this).updatePossible(d.id);
                            }
                            if (isSelect) {
                                $(this).setSelection(d.id);
                            }
                            if (isEdit) {
                                $(this).editRow(d.id, false);
                            }
                            prevDataId = d.id;
                        }
                    }
                    $(this).resetTreeGrid();//重置treeGrid
                    $(this).find("#" + rowId).addClass("active");//显示背景高亮
                }
                else {
                    Common.alertError("行数据不能为空！");
                }
            }
        }

        /**
         * 按方向移动节点
         * 
         * @param {string} rowId 
         * @param {number} type 1上移2下移3左移4右移
         * @memberof TreeHandler
         */
        movePosition(rowId: string, type: number) {
            var newLongCode = $(this).getMovedLongCode(rowId, type);
            if (newLongCode) {
                $(this).move(rowId, newLongCode);
            }
        }
    }
}