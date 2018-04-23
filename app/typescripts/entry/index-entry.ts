///<reference path="../utils/StringUtils.ts" />
///<reference path="../service/SystemServiceImpl.ts" />
///<reference path="../utils/menu/menu.ts" />
///<reference path="../utils/menu/MMenuImpl.ts" />


$(function () {
    flyshark.entry.IndexEntry.initSystemBaseInfo();
})

namespace flyshark.entry {
    import StringUtils = flyshark.utils.StringUtils;
    import SystemBaseInfo = flyshark.entity.SystemBaseInfo;

    import SystemServiceImpl = flyshark.service.SystemServiceImpl;
    import MenuEntity = flyshark.entity.Menu;
    import Menu = flyshark.utils.menu.Menu;
    import MMenu = flyshark.utils.menu.MMenutImpl;


    export class IndexEntry {
        public static initSystemBaseInfo = () => {
            let systemService = new SystemServiceImpl();
            let systemBaseInfo = systemService.getSystemBaseInfo();
            if (systemBaseInfo) {
                $("title").text(systemBaseInfo.name);
                $("#appleTouchIcon").attr("href", systemBaseInfo.appleTouchIconUrl);
                $("#faviconIcon").attr("href", systemBaseInfo.faviconUrl);
                $("#logo").attr("src", systemBaseInfo.logoUrl).attr("title", systemBaseInfo.name);
                $("#systemName").text(" " + systemBaseInfo.name);
            }
            let userInfo = systemService.getUserInfo();
            if (userInfo && userInfo.userBaseInfo) {
                $("#portraits").attr("src", userInfo.userBaseInfo.portraitsUrl).attr("title", userInfo.userBaseInfo.name);
            }

            let menuList = systemService.getMyMenu();
            let menu: Menu = new MMenu();
            menu.createMenu(menuList, document.getElementById("flysharkMenu"));

        }
    }
}