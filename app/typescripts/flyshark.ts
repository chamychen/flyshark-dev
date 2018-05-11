///<reference path="dts/jquery.d.ts" />
///<reference path="dts/jqgrid.d.ts" />
///<reference path="dts/common.d.ts" />
///<reference path="utils/Common.ts" />
///<reference path="service/system/SystemService.ts" />
///<reference path="service/system/SystemServiceImpl.ts" />
///<reference path="utils/grid/handler/BaseHandler.ts" />
///<reference path="utils/grid/handler/TreeHandler.ts" />
///<reference path="utils/grid/handler/ActionHandler.ts" />



namespace flyshark {
    import Common = flyshark.utils.Common;
    import SystemService = flyshark.service.system.SystemService;
    import SystemServiceImpl = flyshark.service.system.SystemServiceImpl;
    import BaseHandler = flyshark.utils.grid.handler.BaseHandler;
    import TreeHandler = flyshark.utils.grid.handler.TreeHandler;
    import ActionHandler = flyshark.utils.grid.handler.ActionHandler;

    export class Flyshark {
        /**
         * 获取系统全局变量
         * 
         * @returns 
         * @memberof Flyshark
         */
        static get(): App {
            let w: any = window;
            let flyshark = w["Flyshark"];
            if (!flyshark) {
                flyshark = new App();
                w["Flyshark"] = flyshark;
            }
            return flyshark;
        }
    }

    class App {

        systemService: SystemService = new SystemServiceImpl();

        constructor() {
            Common.setScreenClass();
            this.initAlertify();
            this.initJQGrid();
            this.initWindowOnResize();
        }

        /**
         * 初始化alertifyjs
         */
        private initAlertify() {
            alertify.defaults.transition = "slide";
            alertify.defaults.theme.ok = "btn btn-primary";
            alertify.defaults.theme.cancel = "btn btn-danger";
            alertify.defaults.theme.input = "form-control";
            alertify.defaults.glossary.title = "";
            alertify.defaults.glossary.ok = "确定";
            alertify.defaults.glossary.cancel = "取消";
            // alertify.defaults.frameless = true;
        }

        /**
         * 扩展JQGRID
         */
        private initJQGrid() {
            let j: any = $.jgrid;
            j.extend(new BaseHandler());
            j.extend(new TreeHandler());
            j.extend(new ActionHandler());
        }

        /**
         * 初始化Window.onResize
         * 
         * @memberof Flyshark
         */
        private initWindowOnResize() {
            window.onresize = function () {
                $(".ui-jqgrid-btable").each(function () {
                    $(this).autoSize();
                });
            }
        }
    }
}

