///<reference path="Menu.ts" />

namespace flyshark.entity {
    export class Config {
        static Name = "飞鲨|开发者平台";
        static SimpleName = "飞鲨";
        static LogoUrl = "/script/plugins/remark/material/mmenu/assets/images/logo.png";
        static MenuList: Array<flyshark.entity.Menu> = null;
        static CurrentMenu: flyshark.entity.Menu = null;
        constructor() { }
    }
}