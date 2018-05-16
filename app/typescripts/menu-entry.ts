///<reference path="dts/jquery.d.ts" />
///<reference path="dts/jqgrid.d.ts" />
///<reference path="utils/StringUtils.ts" />
///<reference path="FlyShark.ts" />
///<reference path="utils/btn/BtnFactory.ts" />
///<reference path="utils/grid/ColModelFactory.ts" />
///<reference path="utils/grid/GridOptionFactory.ts" />
///<reference path="utils/grid/GridHandler.ts" />



let flysharkApp = flyshark.Flyshark.get();
$(function () {
    flyshark.MenuEntry.createMenuGrid();
})

namespace flyshark {
    import EventModel = flyshark.utils.btn.EventModel;
    import EditMode = flyshark.utils.grid.enums.EditMode;
    import TreeColType = flyshark.utils.grid.enums.TreeColType;
    import BtnFactory = flyshark.utils.btn.BtnFactory;
    import ColModel = flyshark.utils.grid.model.ColModel;
    import ColModelFactory = flyshark.utils.grid.ColModelFactory;
    import GridOption = flyshark.utils.grid.model.GridOption;
    import GridOptionFactory = flyshark.utils.grid.GridOptionFactory;

    export class MenuEntry {
        public static createMenuGrid() {
            let rowTitleTemplate = "{linkName}-{url}";
            let menuId = ColModelFactory.createHiddenColModel("menuId", true);
            let parentMenuId = ColModelFactory.createTreeColModel("parentMenuId", TreeColType.ParentField);
            let longCode = ColModelFactory.createTreeColModel("longCode", TreeColType.LongCodeField);
            let menuTitle = ColModelFactory.createEditColModel("menuTitle", "菜单标题", 250, false);
            let url = ColModelFactory.createEditColModel("url", "URL链接地址", 300, false);
            let iconClass = ColModelFactory.createEditColModel("iconClass", "IconClass", 100);
            iconClass.setSelectEdit(true, false, "0:A;1:B");
            let linkName = ColModelFactory.createTreeColModel("linkName", TreeColType.LinkNameField);
            let status = ColModelFactory.createDefaultColModel("status", "状态");
            let sortNo = ColModelFactory.createTreeColModel("sortNo", TreeColType.SortField);
            let addBtn_R = BtnFactory.createAddBtn("addMenu", [new EventModel("flyshark.utils.grid.GridHandler.onAddRow(this)")], true);
            let delBtn_R = BtnFactory.createDelBtn("delMenu", [new EventModel("flyshark.utils.grid.GridHandler.onDelRow(this)")], true);
            let operationCol = ColModelFactory.createBtnColModel([addBtn_R, delBtn_R]);
            let colModel: ColModel[] = [menuId, parentMenuId, operationCol, longCode, menuTitle, url, iconClass, linkName, status, sortNo];

            let addBtn = BtnFactory.createAddBtn("addMenu", [new EventModel("flyshark.utils.grid.GridHandler.onAddRow(this)")]);
            let saveBtn = BtnFactory.createSaveBtn("saveMenu", [new EventModel("flysharkGrid.fsSaveRow(this)")]);
            let gridBtns = [addBtn, saveBtn];

            let menuGrid = GridOptionFactory.createTreeGridOption("menuGrid", colModel, EditMode.SingleRowEdit, rowTitleTemplate);
            menuGrid.setGridButton($("#menuGridActionArea"), gridBtns);
            menuGrid.setMultiSelect(true);
            menuGrid.isSingleTable = true;
            menuGrid.render();
        }
    }
}