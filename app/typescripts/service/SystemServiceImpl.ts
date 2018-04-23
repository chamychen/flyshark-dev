///<reference path="systemService.ts" />

namespace flyshark.service {
    import SystemBaseInfo = flyshark.entity.SystemBaseInfo;
    import UserInfo = flyshark.entity.UserInfo;
    import UserBaseInfo = flyshark.entity.UserBaseInfo;
    import Menu = flyshark.entity.Menu;

    export class SystemServiceImpl implements SystemService {
        public getSystemBaseInfo(): SystemBaseInfo {
            let systemBaseInfo = new SystemBaseInfo();
            systemBaseInfo.name = "飞鲨 | 开发者平台";
            systemBaseInfo.simpleName = "飞鲨";
            systemBaseInfo.faviconUrl = "favicon.ico";
            systemBaseInfo.appleTouchIconUrl = "apple-touch-icon.png";
            systemBaseInfo.logoUrl = "/images/logo.png";
            return systemBaseInfo;
        }

        /**
         * 获取用户信息
         */
        public getUserInfo(): UserInfo {
            let userBaseInfo = new UserBaseInfo();
            userBaseInfo.name = "chamy";
            userBaseInfo.sex = 1;
            userBaseInfo.portraitsUrl = "/images/portraits/2.jpg"
            let userInfo = new UserInfo();
            userInfo.userBaseInfo = userBaseInfo;
            return userInfo;
        }

        /**
         * 获取我有权限的目录
         * 
         * @returns {Array<Menu>} 
         * @memberof SystemServiceImpl
         */
        public getMyMenu(): Array<Menu> {
            let menuList: Array<Menu> = [];
            let menu1 = new Menu();
            menu1.menuId = "1";
            menu1.menuTitle = "平台初始化";
            menu1.iconClass = "md-view-dashboard";
            menu1.url = null;
            menu1.parentMenuId = null;
            menu1.sortNo = 1;
            menu1.linkName = "平台初始化";
            menu1.longCode = null;

            let menu2 = new Menu();
            menu2.menuId = "2";
            menu2.menuTitle = "菜单划分";
            menu2.url = "/page/design/menu.html";
            menu2.parentMenuId = "1";
            menu2.sortNo = 2;
            menu2.linkName = "平台初始化/菜单划分";
            menu2.longCode = null;

            let menu3 = new Menu();
            menu3.menuId = "3";
            menu3.menuTitle = "设计平台";
            menu3.iconClass = "md-palette";
            menu3.sortNo = 2;
            menu3.linkName = "设计平台";
            menu3.longCode = null;

            let menu4 = new Menu();
            menu4.menuId = "4";
            menu4.menuTitle = "模块设计";
            menu4.url = "/page/design/layout.html";
            menu4.parentMenuId = "3";
            menu4.sortNo = 1;
            menu4.linkName = "设计平台/模块设计";
            menu4.longCode = null;

            let menu5 = new Menu();
            menu5.menuId = "5";
            menu5.menuTitle = "组件设计";
            menu5.url = "/page/design/component.html";
            menu5.parentMenuId = "3";
            menu5.sortNo = 2;
            menu5.linkName = "设计平台/组件设计";
            menu5.linkName = "设计平台/组件设计";
            menu5.longCode = null;

            menuList.push(menu1);
            menuList.push(menu2);
            menuList.push(menu3);
            menuList.push(menu4);
            menuList.push(menu5);
            return menuList;
        }
    }
}