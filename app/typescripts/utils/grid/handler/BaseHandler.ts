///<reference path="../../StringUtils.ts" />
///<reference path="../enums/Direction.ts" />
///<reference path="../model/ColModel.ts" />

namespace flyshark.utils.grid.handler {

    import StringUtils = flyshark.utils.StringUtils;
    import Direction = flyshark.utils.grid.enums.Direction;
    import ColModel = flyshark.utils.grid.model.ColModel;

    export class BaseHandler {
        /**
         * 获取属性
         * 
         * @param propertyName 
         * @memberof base
         */
        getN(propertyName: string) {
            if (!StringUtils.isEmpty(propertyName)) {
                return $(this).getGridParam(propertyName);
            }
            else {
                return null;
            }
        }

        /**
         * 设置属性
         * 
         * @param object 要更新的属性，以对象的形式
         * @param overwrite 是否重写所有的属性
         * @memberof base
         */
        setN(object: any, overwrite: boolean) {
            if (overwrite == null) {
                overwrite = false;
            }
            $(this).setGridParam(object, overwrite);
        }


        /**
         * 获取行数据id
         * @param rowData
         * @memberof base 
         */
        getId(rowData: any): string {
            if (!rowData) {
                return null;
            }
            let keyName = this.getN("keyName");
            return rowData[keyName];
        }

        /**
         * 获取行数据
         * 
         * @param {string} rowId 
         * @returns 
         * @memberof BaseHandler
         */
        getRealRowData(rowId: string): any {
            let grid = $(this);
            let data: any = null;
            if (!StringUtils.isEmpty(rowId)) {
                let row = $(grid).getGridRowById(rowId);
                if (row && $(row).hasClass("jqgrow")) {
                    let colModel = $(grid).getN("colModel");
                    let treeGrid = $(grid).getN("treeGrid");
                    if (colModel && colModel.length > 0) {
                        data = {};
                        let errors = $.jgrid.getRegional(this, 'errors', null);
                        let edit = $.jgrid.getRegional(this, 'edit', null);
                        let isEditRow = $(row).attr("editable") == "1";//行是否为可编缉状态
                        let tdList = $('td[role="gridcell"]', row);
                        for (let i = 0; i < tdList.length; i++) {
                            let td = tdList[i];
                            let cm: ColModel = colModel[i];
                            let cmName = cm.name;
                            //忽略树结构部分属性&完全不需要取值的列（如操作列）
                            // || cmName == "treeLoaded" || cmName == "treeExpanded" || cmName == "treeIcon")
                            if (cm.canGetValue == undefined && (cmName == 'cb' || cmName == 'subgrid' || cm.canGetValue == false)) {
                                continue;
                            }
                            else {
                                let isEditCell = false;//单元格是否为编缉状态
                                if (isEditRow) {
                                    if (cm.editable && !$(td).hasClass('not-editable-cell')) {
                                        isEditCell = true;
                                    }
                                }
                                if (isEditCell) {
                                    let val = null;
                                    let valText: string = null;
                                    switch (cm.edittype) {
                                        case "checkbox":
                                            let cbv = ["1", "0"];
                                            if (cm.editoptions && cm.editoptions.value) {
                                                cbv = cm.editoptions.value.split(":");
                                            }
                                            val = $("input", td).is(":checked") ? cbv[0] : cbv[1];
                                            break;
                                        case 'text':
                                        case 'password':
                                        case 'textarea':
                                        case "button":
                                            val = $("input, textarea", td).val();
                                            break;
                                        case 'select':
                                            if (!cm.editoptions.multiple) {
                                                val = $("select option:selected", td).val();
                                                valText = $("select option:selected", td).text();
                                            }
                                            else {
                                                let sel = $("select", td), selectedVal: any;
                                                selectedVal = $(sel).val();
                                                if (selectedVal) {
                                                    val = selectedVal.join(",");
                                                    let selectedText: string[] = [];
                                                    $("select option:selected", this).each(function (i, selected) {
                                                        selectedText[i] = $(selected).text();
                                                    });
                                                    valText = selectedText.join(",");
                                                }
                                            }
                                            break;
                                        case 'custom':
                                            try {
                                                if (cm.editoptions && $.isFunction(cm.editoptions.custom_value)) {
                                                    val = cm.editoptions.custom_value.call($(grid), $(".customelement", td), 'get');
                                                    if (data[cmName] === undefined) {
                                                        throw "e2";
                                                    }
                                                }
                                                else {
                                                    throw "e1";
                                                }
                                            } catch (e) {
                                                if (e === "e1") {
                                                    $.jgrid.info_dialog(errors.errcap, "function 'custom_value' " + edit.msg.nodefined, edit.bClose, {
                                                        styleUI: $(grid).getN("styleUI")
                                                    });
                                                } else {
                                                    $.jgrid.info_dialog(errors.errcap, e.message, edit.bClose, {
                                                        styleUI: $(grid).getN("styleUI")
                                                    });
                                                }
                                            }
                                            break;
                                    }
                                    data[cmName] = $.jgrid.htmlDecode(val);
                                    if (valText) {
                                        data[cmName + '_' + 'text'] = $.jgrid.htmlDecode(valText);
                                    }
                                }
                                else {
                                    if (treeGrid && cmName == $(grid).getN("ExpandColumn")) {
                                        let val = $.jgrid.htmlDecode($("span:first", td).html());
                                        if (!val) {
                                            data[cmName] = $.jgrid.htmlDecode($(td).html());
                                        }
                                        else {
                                            data[cmName] = val;
                                        }
                                    }
                                    else {
                                        if (cm.formatter) {
                                            try {
                                                data[cmName] = $(grid).unformat(td, { rowId: rowId, colModel: cm }, i, null);

                                            }
                                            catch (e) {
                                                data[cmName] = $.jgrid.htmlDecode($(td).html());
                                            }
                                        }
                                        else {
                                            data[cmName] = $.jgrid.htmlDecode($(td).html());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return data;
        }

        /**
         * 禁用单元格编缉功能
         * 
         * @param {string} rowid 
         * @param {string} cellName 
         * @memberof BaseHandler
         */
        disableEditCell(rowid: string, cellName: string) {
            if (!StringUtils.isEmpty(rowid) && !StringUtils.isEmpty(cellName)) {
                $(this).setCell(rowid, cellName, '', 'not-editable-cell', null);
            }
        }


        /**
         * 批量禁用单元格（在gridComplete事件后调用最佳）
         * 
         * @param {() => { rowId: string, cellNames: string[] }[]} filterMethod 过滤出需要禁用的单元格
         * @memberof BaseHandler
         */
        batchDisableEditCell(disableData: { rowId: string, cellNames: string[] }[]) {
            if (disableData) {
                disableData.forEach(r => {
                    if (!StringUtils.isEmpty(r.rowId) && r.cellNames != null && r.cellNames.length > 0) {
                        r.cellNames.forEach(cellName => {
                            $(this).disableEditCell(r.rowId, cellName);
                        });
                    }
                });
            }
        }

        /**
         * 退出行编缉并保存
         * 
         * @param {string} rowid 
         * @memberof base
         */
        disableEditRow(rowid: string) {
            $(this).saveRow(rowid, null, "clientArray");
        }


        /**
         * 退出编缉模式
         * 
         * @memberof base
         */
        batchEditExit() {
            let grid = this;
            $(this).find(".jqgrow[editable=1]").each(function () {
                $(grid).disableEditRow(this.id);
            });
        }


        /**
         * 重置横向滚动条
         * 
         * @memberof base
         */
        resetScrollX() {
            let rowWidth = $(this).find(".jqgrow").eq(0).width();
            let hasNotFixedCol = $(this).getN("hasNotFixedCol");
            if (!hasNotFixedCol) {
                let arr = this.getN("colModel");
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].index == "emptycol") {
                        let grid = $(this).closest(".ui-jqgrid");
                        let gridWidth = $(grid).width();
                        let emptyColWidth = $(grid).find(".ui-jqgrid-hdiv table th").eq(i).outerWidth();
                        if (rowWidth - emptyColWidth <= gridWidth) {
                            $(grid).find(".ui-jqgrid-bdiv").css("overflow-x", "hidden");
                        }
                        else {
                            $(grid).find(".ui-jqgrid-bdiv").css("overflow-x", "auto");
                        }
                        break;
                    }
                }
            }
        }

        /**
         * 重新设置列宽
         * 
         * @param {string} colName 
         * @param {number} width 
         * @memberof base
         */
        setColWidthN(colName: string, width: number) {
            let tableContainerId = "gbox_" + $(this).attr("id");
            let tableContainer = $(this).closest("#" + tableContainerId);
            let cols = $(this).getN("colModel");
            let idx = -1;
            for (let i = 0; i < cols.length; i++) {
                if (cols[i].name == colName || cols[i].index == colName) {
                    idx = i;
                    break;
                }
            }

            let hdiv = $(tableContainer).find(".ui-jqgrid-hdiv table").eq(0);
            let bdiv = $(tableContainer).find(".ui-jqgrid-bdiv table").eq(0);
            let thead = $(hdiv).find("thead").find("th").eq(idx);
            let oldWidth = $(thead).outerWidth();
            let difWidth = width - oldWidth;
            if (difWidth) {
                cols[idx].width = width;
                $(thead).width(width);
                $(bdiv).find("tr").each(function () {
                    $(this).find("td").eq(idx).width(width);
                });
                $(hdiv).width($(hdiv).width() + difWidth);
                $(bdiv).width($(bdiv).width() + difWidth);
                $(this).setN({ colMode: cols }, true);
                $(this).resetScrollX();
            }
        }

        /**
         * 搜索数据
         * 
         * @param {(rowData: any) => boolean} [matchMetod=null] 匹配数据的方法（不传可返回全部数据）
         * @param {boolean} [isSingleMatch=false] 是否只匹配一次
         * @param {boolean} [isOutStop=false] 已经有查询数据后遇到不匹配就中断查询
         * @returns {Array<any>} 
         * @memberof search
         */
        searchData(matchMetod: (rowData: any) => boolean = null, isSingleMatch: boolean = false, isOutStop: boolean = false): Array<any> {
            let data: Array<any> = null;
            let ids = $(this).getDataIDs();
            if (ids) {
                ids.forEach(id => {
                    let rowData = $(this).getRealRowData(id);
                    if ((matchMetod != null && matchMetod(rowData)) || !matchMetod) {
                        if (data == null) {
                            data = [];
                        }
                        data.push(rowData);
                        if (isSingleMatch) {
                            return false;
                        }
                    }
                    else {
                        //已经有查询数据后遇到不匹配就中断查询
                        if (data && data.length > 0 && isOutStop) {
                            return false;
                        }
                    }
                })
            }
            return data;
        }

        /**
         * 查询符合条件的数据条数
         * 
         * @param {(rowData: any) => boolean} [matchMetod=null] 匹配数据的方法（不传可返回全部条数）
         * @param {boolean} [isOutStop=false] 已经有查询个数后遇到不匹配就中断查询
         * @returns {number} 
         * @memberof search
         */
        getCount(matchMetod: (rowData: any) => boolean = null, isOutStop: boolean = false): number {
            let count = 0;
            let ids = $(this).getDataIDs();
            if (ids) {
                ids.forEach(id => {
                    let rowData = $(this).getRealRowData(id);
                    if ((matchMetod != null && matchMetod(rowData)) || !matchMetod) {
                        count += 1;
                    }
                    else {
                        //已经有查询个数后遇到不匹配就中断查询
                        if (count > 0 && isOutStop) {
                            return false;
                        }
                    }
                })
            }
            return count;
        }

        /**
         * 查询符合条件的数据是否存在
         * 
         * @param {(rowData: any) => boolean} matchMetod 匹配数据的方法（不传返回false）
         * @returns {boolean} 
         * @memberof search
         */
        exists(matchMetod: (rowData: any) => boolean): boolean {
            let isExists = false;
            let ids = $(this).getDataIDs();
            if (ids) {
                ids.forEach(id => {
                    let rowData = $(this).getRealRowData(id);
                    if ((matchMetod != null && matchMetod(rowData))) {
                        isExists = true;
                        return false;
                    }
                })
            }
            return isExists;
        }

        /**
         * 自动化尺寸
         * 
         * @memberof BaseHandler
         */
        autoSize(): void {
            let newWidth = $(this).closest(".ui-jqgrid").parent().width();
            $(this).setGridWidth(newWidth, null);
            let isSingleTable = $(this).hasClass("single-table");
            if (isSingleTable) {
                let height = Common.getWorkSpaceHeight();
                $(this).setGridHeight(height);
            }
            $(this).resetScrollX();
        }
    }
}