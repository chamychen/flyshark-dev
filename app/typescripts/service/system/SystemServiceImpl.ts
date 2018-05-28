///<reference path="SystemService.ts" />
///<reference path="../../entity/SystemBaseInfoEntity.ts" />
///<reference path="../../entity/UserInfoEntity.ts" />
///<reference path="../../entity/UserBaseInfoEntity.ts" />
///<reference path="../../entity/MenuEntity.ts" />

namespace flyshark.service.system {
    import SystemBaseInfoEntity = flyshark.entity.SystemBaseInfoEntity;
    import UserInfoEntity = flyshark.entity.UserInfoEntity;
    import UserBaseInfoEntity = flyshark.entity.UserBaseInfoEntity;
    import MenuEntity = flyshark.entity.MenuEntity;

    export class SystemServiceImpl implements SystemService {
        /**
         * 当前目录
         * 
         * @type {MenuEntity}
         * @memberof SystemServiceImpl
         */
        currentMenu: MenuEntity;

        public getSystemBaseInfo(): SystemBaseInfoEntity {
            let systemBaseInfo = new SystemBaseInfoEntity();
            systemBaseInfo.name = "飞鲨 | 开发者平台";
            systemBaseInfo.simpleName = "飞鲨";
            systemBaseInfo.faviconUrl = "favicon.ico";
            systemBaseInfo.appleTouchIconUrl = "apple-touch-icon.png";
            systemBaseInfo.logoUrl = "/images/logo.png";
            systemBaseInfo.serverUrl = "http://192.168.1.134:9090/flyshark-action";
            return systemBaseInfo;
        }

        /**
         * 获取用户信息
         */
        public getUserInfo(): UserInfoEntity {
            let userBaseInfo = new UserBaseInfoEntity();
            userBaseInfo.name = "chamy";
            userBaseInfo.sex = 1;
            userBaseInfo.portraitsUrl = "/images/portraits/2.jpg"
            let userInfo = new UserInfoEntity();
            userInfo.userBaseInfo = userBaseInfo;
            return userInfo;
        }

        /**
         * 获取我有权限的目录
         * 
         * @returns {Array<Menu>} 
         * @memberof SystemServiceImpl
         */
        public getMyMenu(): Array<MenuEntity> {
            let menuList: Array<MenuEntity> = [];
            let menu1 = new MenuEntity();
            menu1.menuId = "1";
            menu1.menuTitle = "平台初始化";
            menu1.iconClass = "md-view-dashboard";
            menu1.url = null;
            menu1.parentMenuId = null;
            menu1.sortNo = 1;
            menu1.linkName = "平台初始化";
            menu1.longCode = '';

            let menu2 = new MenuEntity();
            menu2.menuId = "2";
            menu2.menuTitle = "菜单划分";
            menu2.url = "/page/menu/index.html";
            menu2.parentMenuId = "1";
            menu2.sortNo = 2;
            menu2.linkName = "平台初始化>菜单划分";
            menu2.longCode = null;

            let menu3 = new MenuEntity();
            menu3.menuId = "3";
            menu3.menuTitle = "设计平台";
            menu3.iconClass = "md-palette";
            menu3.sortNo = 2;
            menu3.linkName = "设计平台";
            menu3.longCode = null;

            let menu4 = new MenuEntity();
            menu4.menuId = "4";
            menu4.menuTitle = "模块设计";
            menu4.url = "/page/design/layout.html";
            menu4.parentMenuId = "3";
            menu4.sortNo = 1;
            menu4.linkName = "设计平台>模块设计";
            menu4.longCode = null;

            let menu5 = new MenuEntity();
            menu5.menuId = "5";
            menu5.menuTitle = "组件设计";
            menu5.url = "/page/design/component.html";
            menu5.parentMenuId = "3";
            menu5.sortNo = 2;
            menu5.linkName = "设计平台>组件设计";
            menu5.longCode = null;

            menuList.push(menu1);
            menuList.push(menu2);
            menuList.push(menu3);
            menuList.push(menu4);
            menuList.push(menu5);
            return menuList;
        }

        /**
         * 获取服务器路径
         * 
         * @param {string} absoluteUrl 
         * @returns {string} 
         * @memberof SystemServiceImpl
         */
        getServerUrl(absoluteUrl: string): string {
            return this.getSystemBaseInfo().serverUrl + absoluteUrl;
        }
    }
}