///<reference path="../dts/jquery.d.ts" />
///<reference path="../dts/alertify.d.ts" />

namespace flyshark.utils {
    export class Common {
        /**
         * 获取当前工作区高度
         * @returns {number}
         */
         static getWorkSpaceHeight(): number {
            Common.setScreenClass();
            let totalHeight = document.documentElement.clientHeight;
            let headerHeight1 = $(".site-navbar .navbar-container:visible").outerHeight() | $(".site-navbar").outerHeight();//页面顶部总高度
            let headerHeight2 = $(".page-header:visible").outerHeight();//导航条高度
            let headerHeight3 = $(".site-navbar-collapse-show .navbar-collapse-toolbar:visible").outerHeight();//小屏下人像展开栏高度
            let searchAreaHeight = $(".page-seach-area:visible").outerHeight();//搜索栏高度
            let gridActionAreaHeight = $(".grid-header:visible").outerHeight();//表格按钮区高度
            if (!headerHeight3) {
                headerHeight3 = 0;
            }
            if (!searchAreaHeight) {
                searchAreaHeight = 0;
            }
            if (!gridActionAreaHeight) {
                gridActionAreaHeight = 0;
            }
            let footerHeight = 0;// $(".site-footer").outerHeight();//页脚高度
            var tabelTheadHeight = 42;//表头高度
            let pageContentPadding = 12;//工作区padding高度
            let workplacePadding = 35;//工作区padding高度
            let height = totalHeight - headerHeight1 - headerHeight2 - headerHeight2 - searchAreaHeight - gridActionAreaHeight - footerHeight - pageContentPadding - workplacePadding;
            return height;
        }

        /**
         * 识别屏幕大小
         */
         static setScreenClass() {
            let width = document.documentElement.clientWidth;
            if (width <= 767) {
                if (!$("body").hasClass("mini-screent")) {
                    $("body").addClass("mini-screen");
                }
            }
            else {
                $("body").removeClass("mini-screen");
            }
        }

        /**
         *弹出错误消息
        * @param message
        */
         static alertError(message: string) {
            alertify.error("<i class='icon fa-window-close' style='margin-right:5px;'></i>" + message);
        }

        /**
         *弹出警告消息
         * @param message
         */
         static alertWarn(message: string) {
            alertify.error("<i class='icon fa-warning' style='color:#F4FF81;margin-right:5px;'></i>" + message);
        }

        /**
         *弹出成功消息
         * @param message
         */
         static alertOk(message: string) {
            alertify.success("<i class='icon fa-check-circle' style='margin-right:5px;'></i>" + message);
        }
        /**
         * 弹窗输入确认
         * 
         * @param {any} title 
         * @param {any} msg 
         * @param {any} defaultValue 
         * @param {any} success 
         */
         static alertInput(title: string, msg: string, defaultValue: string, success: (evt: any, value: string) => void): any {
            return alertify.prompt(title, msg, defaultValue, function (evt, value) {
                success(evt, value);
            }, null);
        }


         static alertConfirm(msg: string, success: () => void = null, cssClass: string = null) {
            alertify.confirm(msg, success, cssClass);
        }


        /**
         * 
         * @param e 组织冒泡
         */
         static stopBubble(e: any) {
            //如果提供了事件对象，则这是一个非IE浏览器 
            if (e && e.stopPropagation)
                //因此它支持W3C的stopPropagation()方法 
                e.stopPropagation();
            else
                //否则，我们需要使用IE的方式来取消事件冒泡 
                window.event.cancelBubble = true;
        }
    }

}
