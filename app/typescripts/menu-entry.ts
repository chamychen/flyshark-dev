///<reference path="dts/jquery.d.ts" />
///<reference path="dts/jqgrid.d.ts" />
///<reference path="utils/StringUtils.ts" />
///<reference path="FlyShark.ts" />
///<reference path="utils/btn/BtnFactory.ts" />
///<reference path="utils/grid/ColModelFactory.ts" />
///<reference path="utils/grid/GridOptionFactory.ts" />
///<reference path="utils/grid/GridHandler.ts" />
///<reference path="utils/rest/JqueryRestImpl.ts" />
///<reference path="utils/Common.ts" />
///<reference path="utils/CommonEntry.ts" />
///<reference path="dto/LinkModel.ts" />
///<reference path="dto/RequestModel.ts" />

let flysharkApp = flyshark.Flyshark.get();
$(function () {
    let menuEntry: flyshark.MenuEntry = new flyshark.MenuEntry("menuContext");
    menuEntry.init();
    menuEntry.linkModel.load();
})

namespace flyshark {
    import StringUtils = flyshark.utils.StringUtils;
    import EventModel = flyshark.utils.btn.EventModel;
    import EditMode = flyshark.utils.grid.enums.EditMode;
    import TreeColType = flyshark.utils.grid.enums.TreeColType;
    import BtnFactory = flyshark.utils.btn.BtnFactory;
    import ColModel = flyshark.utils.grid.model.ColModel;
    import ColModelFactory = flyshark.utils.grid.ColModelFactory;
    import GridOption = flyshark.utils.grid.model.GridOption;
    import GridOptionFactory = flyshark.utils.grid.GridOptionFactory;
    import Rest = flyshark.utils.rest.Rest;
    import JqueryRestImpl = flyshark.utils.rest.JqueryRestImpl;
    import RestMethod = flyshark.utils.rest.RestMethod;
    import ResponseModel = flyshark.dto.ResponseModel;
    import LinkModel = flyshark.dto.LinkModel;
    import LinkPropertyContextType = flyshark.dto.LinkPropertyContextType;
    import Common = flyshark.utils.Common;
    import CommonEntry = flyshark.utils.CommonEntry;
    import RequestModel = flyshark.dto.RequestModel;

    export class MenuEntry extends CommonEntry {

        lmUrl: string = flysharkApp.systemService.getServerUrl("/lm");

        constructor(contextId: string) {
            super(contextId, "MenuModel");
        }

        /**
         * 初始化
         * 
         * @memberof MenuEntry
         */
        init() {
            this.defineMenuGrid();
        }

        save() {
            this.linkModel.save(response => {
                if (response.success) {
                    Common.alertOk("保存成功");
                }
            });
        }

        /**
         * 定义目录表格
         * 
         * @private
         * @memberof MenuEntry
         */
        private defineMenuGrid() {
            let linkModelClassesData: string = "请选择:请选择;";
            let linkModelClassesDataUrl = flysharkApp.systemService.getServerUrl("/linkmodelclasses");
            flysharkApp.rest.query<Array<string>>(RestMethod.GET, linkModelClassesDataUrl, null, true,
                (result: ResponseModel<Array<string>>, status: any, xhr: any) => {
                    if (result.success) {
                        if (result.data) {
                            result.data.for2(name => {
                                let tName = name.substr(name.lastIndexOf(".") + 1);
                                linkModelClassesData += StringUtils.format("{0}:{1};", name, tName);
                            })
                        }
                    }
                }, null);
            if (!StringUtils.isEmpty(linkModelClassesData)) {
                linkModelClassesData = linkModelClassesData.substr(0, linkModelClassesData.lastIndexOf(";"));
            }

            //列自定义
            let menuId = ColModelFactory.createHiddenColModel("menuId", true);
            let parentMenuId = ColModelFactory.createTreeColModel("parentMenuId", TreeColType.ParentField);
            let longCode = ColModelFactory.createTreeColModel("longCode", TreeColType.LongCodeField);
            let iconClass = ColModelFactory.createEditColModel("iconClass", "IconClass", 100);
            let menuTitle = ColModelFactory.createEditColModel("menuTitle", "菜单标题", 250, false);
            let linkModelClasses = ColModelFactory.createEditColModel("linkModelClasses", "LinkModel", 150);
            linkModelClasses.setSelectEdit(true, false, linkModelClassesData, 0);
            let url = ColModelFactory.createEditColModel("url", "URL链接地址", 300, false);
            let linkName = ColModelFactory.createTreeColModel("linkName", TreeColType.LinkNameField);
            let status = ColModelFactory.createDefaultColModel("status", "状态");
            let isLeaf = ColModelFactory.createTreeColModel("isLeaf", TreeColType.LeafField);
            let sortNo = ColModelFactory.createTreeColModel("sortNo", TreeColType.SortField);
            //初始化行内按钮
            let addBtn_R = BtnFactory.createAddBtn("addMenu", [new EventModel("flyshark.utils.grid.GridHandler.onAddRow(this)")], true);
            let delBtn_R = BtnFactory.createDelBtn("delMenu", [new EventModel("flyshark.utils.grid.GridHandler.onDelRow(this)")], true);
            let operationCol = ColModelFactory.createBtnColModel([addBtn_R, delBtn_R]);
            //colModel定议
            let colModel: ColModel[] = [menuId, isLeaf, parentMenuId, operationCol, longCode, menuTitle, linkModelClasses, url, iconClass, linkName, status, sortNo];

            //初始化表格按钮
            let addBtn = BtnFactory.createAddBtn("addMenu", [new EventModel("flyshark.utils.grid.GridHandler.onAddRow(this)")]);
            let saveBtn = BtnFactory.createSaveBtn("saveMenu", [new EventModel("flysharkApp.callEvent(this,'save')")]);
            let gridBtns = [addBtn, saveBtn];


            //初始化grid
            let rowTitleTemplate = "{linkName}-{url}";
            let gridId = this.linkModel.getId("menuGrid");
            let menuGrid = GridOptionFactory.createTreeGridOption(gridId, colModel, EditMode.SingleRowEdit, rowTitleTemplate);
            menuGrid.setGridButton($("#" + this.linkModel.getId("menuGridActionArea")), gridBtns);
            menuGrid.setMultiSelect(true);
            menuGrid.isSingleTable = true;
            menuGrid.render();
            this.linkModel.linkPropertys.push({ elementId: gridId, propertyId: "menuList", linkPropertyContextType: LinkPropertyContextType.Grid });
        }
    }
}