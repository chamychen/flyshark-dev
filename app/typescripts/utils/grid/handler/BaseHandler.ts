///<reference path="../../../dts/jquery.d.ts" />
///<reference path="../../../dts/jqgrid.d.ts" />
///<reference path="../../Common.ts" />
///<reference path="../../StringUtils.ts" />
///<reference path="../enums/Direction.ts" />
///<reference path="../enums/TreeColType.ts" />
///<reference path="../model/DataDiff.ts" />
///<reference path="../model/ColModel.ts" />


namespace flyshark.utils.grid.handler {
    import Common = flyshark.utils.Common;
    import StringUtils = flyshark.utils.StringUtils;
    import TreeColType = flyshark.utils.grid.enums.TreeColType;
    import Direction = flyshark.utils.grid.enums.Direction;
    import DataDiff = flyshark.utils.grid.model.DataDiff;
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
         * 获取可编缉单元格的值
         * 
         * @param {*} td 
         * @param {ColModel} cm 
         * @returns {{ el: any, val: any, text: string }} 
         * @memberof BaseHandler
         */
        getEditCellValue(td: any, cm: ColModel): { el: any, val: any, text: string } {
            let val = null;
            let valText: string = null;
            let el = null;
            switch (cm.edittype) {
                case "checkbox":
                    let cbv = ["1", "0"];
                    if (cm.editoptions && cm.editoptions.value) {
                        cbv = cm.editoptions.value.split(":");
                    }
                    el = $("input", td);
                    val = $(el).is(":checked") ? cbv[0] : cbv[1];
                    break;
                case 'text':
                case 'password':
                case 'textarea':
                case "button":
                    el = $("input, textarea", td);
                    val = $(el).val();
                    break;
                case 'select':
                    el = $("select", td);
                    if (!cm.editoptions.multiple) {
                        let selVal = $("select option:selected", td).val();
                        if (selVal != "请选择") {
                            val = selVal;
                            valText = $("select option:selected", td).text();
                        }
                    }
                    else {
                        let selectedVal: string[] = [];
                        let selectedText: string[] = [];
                        $("select option:selected", td).each(function (i, selected) {
                            let selVal: string = $(selected).val().toString();
                            if ($.trim(selVal) != "请选择") {
                                let selText: string = $(selected).text();
                                selectedText[i] = selText;
                                selectedVal[i] = selVal;
                            }
                        });
                        val = selectedVal.join(",");
                        valText = selectedText.join(",");
                    }
                    break;
                case 'custom':
                    try {
                        if (cm.editoptions && $.isFunction(cm.editoptions.custom_value)) {
                            el = $(".customelement", td);
                            val = cm.editoptions.custom_value.call($(grid), el, 'get');
                        }
                    }
                    catch (e) {
                    }
                    break;
            }
            val = $.jgrid.htmlDecode(val);
            if (valText) {
                valText = $.jgrid.htmlDecode(valText);
            }
            else {
                valText = "";
            }
            if (!val) {
                val = "";
            }
            return { el: el, val: val, text: valText };
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
                        let isTreeGrid = $(grid).getN("treeGrid")
                        let treeReader = $(grid).getTreeReader();
                        for (let i = 0; i < tdList.length; i++) {
                            let td = tdList[i];
                            let cm: ColModel = colModel[i];
                            let cmName = cm.name;

                            if (cm.canGetValue) {
                                if (cm.treeColType == TreeColType.SortField) {
                                    let ids = $(this).getDataIDs();
                                    let sortNo = ids.indexOf(rowId) + 1;
                                    data[cmName] = sortNo;
                                }
                                else {
                                    let isEditCell = false;//单元格是否为编缉状态
                                    if (isEditRow) {
                                        if (cm.editable && !$(td).hasClass('not-editable-cell')) {
                                            isEditCell = true;
                                        }
                                    }
                                    if (isEditCell) {
                                        let editVal = $(grid).getEditCellValue(td, cm);
                                        let val = editVal.val;
                                        let valText: string = editVal.text;
                                        let el = editVal.el;
                                        data[cmName] = val;
                                        data[cmName + '_' + 'text'] = valText;
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
                disableData.for2(r => {
                    if (!StringUtils.isEmpty(r.rowId) && r.cellNames != null && r.cellNames.length > 0) {
                        r.cellNames.for2(cellName => {
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
                ids.for2(id => {
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
                ids.for2(id => {
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
                ids.for2(id => {
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
            let parentWidth = $(this).closest(".ui-jqgrid").parent().width();
            let difWidth = parentWidth - $(this).width();
            let newWidth = $(this).closest(".ui-jqgrid").parent().width();
            $(this).setGridWidth(newWidth, null);
            let isSingleTable = $(this).hasClass("single-table");
            if (isSingleTable) {
                let height = Common.getWorkSpaceHeight();
                $(this).setGridHeight(height);
            }
            $(this).resetScrollX();
        }


        /**
         * 获取需要提交到服务器的数据
         * 
         * @memberof BaseHandler
         */
        getDataToSave(): DataDiff {
            let dataDiff: DataDiff = $(this).getN("dataDiff");
            if (dataDiff.addIds) {
                dataDiff.addData = [];
                dataDiff.addIds.for2(id => {
                    let rowData = $(this).getRealRowData(id);
                    dataDiff.addData.push(rowData);
                })
            }
            if (dataDiff.delIds) {
                dataDiff.delData = [];
                dataDiff.delIds.for2(id => {
                    let rowData = $(this).getRealRowData(id);
                    dataDiff.delData.push(rowData);
                })
            }
            if (dataDiff.updateIds) {
                let colModel: ColModel[] = $(this).getN("colModel");
                let oldData: any[] = $(this).getN("oldData");
                let confirmUpdateIds: any[] = [];
                if (!colModel) {
                    throw new Error("Grid列配置不能为空！");
                }
                dataDiff.updateData = [];
                dataDiff.updateIds.for2(id => {
                    let oldRowData: any = null;
                    oldData.for2(d => {
                        if ($(this).getId(d) == id) {
                            oldRowData = d;
                            return false;
                        }
                    })
                    if (!oldData) {
                        throw new Error("未知异常！");
                    }
                    else {
                        let rowData = $(this).getRealRowData(id);
                        //对比新旧数据
                        colModel.for2(element => {
                            if (element.canGetValue && (typeof (element.ignoreUpdate) != undefined && element.ignoreUpdate != null && element.ignoreUpdate == false)) {
                                let cmName = element.name;
                                if (oldRowData[cmName] == undefined || oldRowData[cmName] == "") {
                                    oldRowData[cmName] = null;
                                }
                                if (rowData[cmName] == undefined || rowData[cmName] == "") {
                                    rowData[cmName] = null;
                                }
                                if (oldRowData[cmName] != rowData[cmName]) {
                                    confirmUpdateIds.push(id);
                                    dataDiff.updateData.push(rowData);
                                    return false;
                                }
                            }
                        });
                    }
                })
                dataDiff.updateIds = confirmUpdateIds;

            }

            let checkDatMethod: (gid: string, rowData: any) => string = $(this).getN("checkDataMethod");
            if (checkDatMethod) {
                //数据验证
                let checkDataList: any[] = [];
                if (dataDiff.addData) {
                    checkDataList.concat(dataDiff.addData);
                }
                if (dataDiff.updateData) {
                    checkDataList.concat(dataDiff.updateData);
                }
                if (checkDataList) {
                    let msgList: string[] = [];
                    let onlyCheckSingleRow: boolean = $(this).getN("onlyCheckSingleRow");
                    checkDataList.some(d => {
                        let msg: string = checkDatMethod($(this).attr("id"), d);
                        if (!StringUtils.isEmpty(msg)) {
                            msgList.push(msg);
                            if (onlyCheckSingleRow) {
                                return false;
                            }
                        }
                    })
                    dataDiff.errorMsgs = msgList;
                }
            }
            return dataDiff;
        }

        /**
         * 初始化编缉行中的控件及提示
         * 
         * @param {string} rowId 
         * @memberof BaseHandler
         */
        initEditRowElement(rowId: string): void {
            let controls = $("#" + rowId).find(".form-control");
            if (controls && controls.length > 0) {
                let grid = this;
                //将select换成select2插件
                $("#" + rowId).find("select:visible").select2({ language: "zh-CN" });
                //值改变后更新数据缓存
                controls.on("change", function () {
                    $(grid).updatePossible(rowId);
                })
                controls.each(function () {
                    Common.setControlToolTip(this);
                })
                controls.on("input", function () {
                    Common.setControlToolTip(this);
                })
                //值改变后更新数据缓存
                controls.on("propertyChange", function () {
                    Common.setControlToolTip(this);
                })

                // controls.off("change");
                // let settings = Common.getToolTipSettings();
                // //toolTip提示
                // controls.each(function () {
                //     settings.width = $(this).outerWidth();
                //     $(this).webuiPopover(settings);
                // })
                // //值改变后更新数据缓存
                // controls.on("input", function () {
                //     let val = StringUtils.trim($(this).val().toString());
                //     WebuiPopovers.updateContent(this, val);
                //     WebuiPopovers.show(this);
                // })
                // //值改变后更新数据缓存
                // controls.on("propertyChange", function () {
                //     let val = StringUtils.trim($(this).val().toString());
                //     WebuiPopovers.updateContent(this, val);
                //     WebuiPopovers.show(this);
                // })
            }
        }
    }
}