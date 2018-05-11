///<reference path="utils/StringUtils.ts" />
///<reference path="FlyShark.ts" />
///<reference path="entity/MenuEntity.ts" />
///<reference path="service/menu/Menu.ts" />
///<reference path="service/menu/MMenuImpl.ts" />

let flysharkApp = flyshark.Flyshark.get();
$(function () {
    flyshark.IndexEntry.init();
})

namespace flyshark {
    import StringUtils = flyshark.utils.StringUtils;
    import Menu = flyshark.entity.MenuEntity;
    import MenuService = flyshark.service.menu.Menu;
    import MMenutImpl = flyshark.service.menu.MMenutImpl;
    export class IndexEntry {

        static init() {
            let systemBaseInfo = flysharkApp.systemService.getSystemBaseInfo();
            if (systemBaseInfo) {
                $("title").text(systemBaseInfo.name);
                $("#appleTouchIcon").attr("href", systemBaseInfo.appleTouchIconUrl);
                $("#faviconIcon").attr("href", systemBaseInfo.faviconUrl);
                $("#logo").attr("src", systemBaseInfo.logoUrl).attr("title", systemBaseInfo.name);
                $("#systemName").text(" " + systemBaseInfo.name);
            }
            let userInfo = flysharkApp.systemService.getUserInfo();
            if (userInfo && userInfo.userBaseInfo) {
                $("#portraits").attr("src", userInfo.userBaseInfo.portraitsUrl).attr("title", userInfo.userBaseInfo.name);
            }

            let menuList = flysharkApp.systemService.getMyMenu();
            let menuService: MenuService = new MMenutImpl();
            menuService.createMenu(menuList, document.getElementById("flysharkMenu"));
            $(".menu-a-click").on("click", function () {
                IndexEntry.toMenu(this.id);
            })
        }

        /**
         * 跳转到目录
         * 
         * @param {string} menuId 
         * @param {UserData} userData 
         * @returns 
         * @memberof MMenutImpl
         */
        static toMenu(menuId: string): void {
            let menuList = flysharkApp.systemService.getMyMenu();
            let currentMenu = flysharkApp.systemService.currentMenu;
            if (StringUtils.isEmpty(menuId) || !menuList || (currentMenu && menuId == currentMenu.menuId)) {
                return;
            }

            menuList.forEach((menu: Menu) => {
                if (menu.menuId == menuId) {
                    currentMenu = menu;
                    return false;
                }
            })

            if (currentMenu && currentMenu.url) {
                $(".page").hide();
                flysharkApp.systemService.currentMenu = currentMenu;
                var html = IndexEntry.setMenuActive(null, menuList, currentMenu);
                html = "<ol class='breadcrumb'>" + html + "</ol>";
                $(".page-header .breadcrumb").remove("");
                $(".page-header").prepend(html);
                $(".page .page-content-body").html("");
                $(".page .page-content-body").load(currentMenu.url);
                $(".page").fadeIn(1000);
            }
        }

        /**
         * 设置菜单被选中，返回路径的html
         * @param iterationMenu
         * @returns {string}
         */
        private static setMenuActive(iterationMenu: Menu, menuList: Menu[], actionMenu: Menu, ) {
            var html = "";
            //清除active目录
            if (iterationMenu == null) {
                $(".site-menu-item").each(function () {
                    if ($(this).hasClass("active")) {
                        $(this).removeClass("active");
                    }
                });
                iterationMenu = actionMenu;

                html = StringUtils.format("<li class='breadcrumb-item active'>{0}{1}</li>",
                    !StringUtils.isEmpty(iterationMenu.iconClass) ?
                        StringUtils.format("<i class='site-menu-icon fa {0}' aria-hidden=\"true\"></i> ", iterationMenu.iconClass) : "", iterationMenu.menuTitle);
            }
            else {
                html = StringUtils.format("<li class='breadcrumb-item'>{0}{1}</li>", !StringUtils.isEmpty(iterationMenu.iconClass) ? StringUtils.format("<i class='{0}' aria-hidden=\"true\"></i> ", iterationMenu.iconClass) : "", iterationMenu.menuTitle);
            }
            if (iterationMenu != null) {
                $("#" + iterationMenu.menuId).closest("li").addClass("active");
                if (iterationMenu.parentMenuId) {
                    menuList.forEach((menu: Menu) => {
                        if (menu.menuId == iterationMenu.parentMenuId) {
                            html = this.setMenuActive(menu, menuList, actionMenu) + html;
                            return false;
                        }
                    })
                }
            }
            return html;
        }
    }
}