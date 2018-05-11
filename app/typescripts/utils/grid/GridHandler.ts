///<reference path="../Common.ts" />
///<reference path="enums/Direction.ts" />
///<reference path="model/GridOption.ts" />
///<reference path="handler/BaseHandler.ts" />
///<reference path="handler/TreeHandler.ts" />
///<reference path="handler/ActionHandler.ts" />

namespace flyshark.utils.grid {

    import Direction = flyshark.utils.grid.enums.Direction;
    import GridOption = flyshark.utils.grid.model.GridOption;
    import BaseHandler = flyshark.utils.grid.handler.BaseHandler;
    import TreeHandler = flyshark.utils.grid.handler.TreeHandler;
    import ActionHandler = flyshark.utils.grid.handler.ActionHandler;

    /**
     * Grid公共操作
     * 
     * @export
     * @class GridHandler
     */
    export class GridHandler {
        /**
         * 扩展JQGRID
         */
        public static extendJQGrid() {
            let j: any = $.jgrid;
            j.extend(new BaseHandler());
            j.extend(new TreeHandler());
            j.extend(new ActionHandler());
        }

        /**
         * 点击搜索展开/收缩按钮事件
         */
        public static onSearchExtendBtnClick(e: HTMLElement): void {
            let searchArea = $(e).closest(".grid-header").prev(".page-seach-area");
            let isExtend = $(e).hasClass("btn-extend");
            if (isExtend) {
                $(searchArea).hide();
                $(e).attr("title", "展开搜索条件区域");
            }
            else {
                $(searchArea).show();
                $(e).attr("title", "隐藏搜索条件区域");
            }
            $(e).find("i").toggleClass("search-control-icon");
            $(e).toggleClass("btn-extend").toggleClass("btn-default").toggleClass("btn-success");
            let gridId = $(e).attr("dependon");
            $("#" + gridId).autoSize();//自动调整表格宽高  
        }

        /**
         * 新增行
         * 
         * @static
         * @memberof GridHandler
         */
        public static onAddRow(e: HTMLElement) {
            Common.stopBubble(e);
            let gridId = $(e).attr("dependon");
            let dependrowid = $(e).attr("dependrowid");
            if (gridId) {
                let grid = $("#" + gridId);
                $(grid).addRealRow(dependrowid);
            }
        }

        /**
         * 删除行
         * 
         * @static
         * @memberof GridHandler
         */
        public static onDelRow(e: HTMLElement) {
            Common.stopBubble(e);
            let gridId = $(e).attr("dependon");
            let dependrowid = $(e).attr("dependrowid");
            if (gridId && dependrowid) {
                let grid = $("#" + gridId);
                $(grid).delRealRow(dependrowid);
            }
        }


        /**
         * 
         * @param btn 移动位置
         * @param type 
         */
        public static onMoveNodePosition(e: HTMLElement, type: number) {
            Common.stopBubble(e);
            let gridId = $(e).attr("dependon");
            let dependrowid = $(e).attr("dependrowid");
            if (gridId && dependrowid) {
                let grid = $("#" + gridId);
                grid.movePosition(dependrowid, type);
            }
        }

        /**
         * 移动位置
         * @param type 
         */
        public static onMoveNode(e: HTMLElement) {
            Common.stopBubble(e);
            let gridId = $(e).attr("dependon");
            let dependrowid = $(e).attr("dependrowid");
            if (gridId && dependrowid) {
                let grid = $("#" + gridId);
                let longCodeColumn = $(grid).getN("LongCodeColumn");
                let rowData = $(grid).getRealRowData(dependrowid);
                Common.alertInput("移动节点", "请输入长代码", rowData[longCodeColumn], (evt: any, value: any) => {
                    grid.move(dependrowid, value);
                });
            }
        }
    }
}