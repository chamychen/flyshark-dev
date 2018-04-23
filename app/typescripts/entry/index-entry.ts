///<reference path="../utils/StringUtils.ts" />
///<reference path="../service/SystemServiceImpl.ts" />
///<reference path="../utils/menu/menu.ts" />
///<reference path="../utils/menu/MMenuImpl.ts" />


$(function () {
    flyshark.entry.IndexEntry.initSystemBaseInfo();
})

namespace flyshark.entry {
    import StringUtils = flyshark.utils.StringUtils;
    import SystemBaseInfo = flyshark.entity.SystemBaseInfoEntity;

    import SystemServiceImpl = flyshark.service.SystemServiceImpl;
    import UserData = flyshark.entity.UserDataEntity;
    import MenuEntity = flyshark.entity.MenuEntity;
    import UserInfo = flyshark.entity.UserInfoEntity;
    import Menu = flyshark.utils.menu.Menu;

    import MMenu = flyshark.utils.menu.MMenutImpl;


    export class IndexEntry {

        public static userData = new UserData();

        public static initSystemBaseInfo = () => {
            let systemService = new SystemServiceImpl();
            IndexEntry.userData.systemBaseInfo = systemService.getSystemBaseInfo();
            if (IndexEntry.userData.systemBaseInfo) {
                $("title").text(IndexEntry.userData.systemBaseInfo.name);
                $("#appleTouchIcon").attr("href", IndexEntry.userData.systemBaseInfo.appleTouchIconUrl);
                $("#faviconIcon").attr("href", IndexEntry.userData.systemBaseInfo.faviconUrl);
                $("#logo").attr("src", IndexEntry.userData.systemBaseInfo.logoUrl).attr("title", IndexEntry.userData.systemBaseInfo.name);
                $("#systemName").text(" " + IndexEntry.userData.systemBaseInfo.name);
            }
            IndexEntry.userData.userInfo = systemService.getUserInfo();
            if (IndexEntry.userData.userInfo && IndexEntry.userData.userInfo.userBaseInfo) {
                $("#portraits").attr("src", IndexEntry.userData.userInfo.userBaseInfo.portraitsUrl).attr("title", IndexEntry.userData.userInfo.userBaseInfo.name);
            }

            IndexEntry.userData.menuList = systemService.getMyMenu();
            let menu: Menu = new MMenu();
            menu.createMenu(IndexEntry.userData.menuList, document.getElementById("flysharkMenu"));
            $(".menu-a-click").on("click", function () {
                menu.toMenu(this.id, IndexEntry.userData);
            })

        }
    }
}