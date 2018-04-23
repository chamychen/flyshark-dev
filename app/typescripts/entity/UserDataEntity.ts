///<reference path="MenuEntity.ts" />
///<reference path="UserBaseInfoEntity.ts" />
///<reference path="UserInfoEntity.ts" />
///<reference path="SystemBaseInfoEntity.ts" />

namespace flyshark.entity {
    /**
     * 当前用户操作信息
     * 
     * @export
     * @class UserData
     */
    export class UserDataEntity {
        systemBaseInfo: SystemBaseInfoEntity;

        userInfo: UserInfoEntity;

        menuList: Array<MenuEntity>;

        currentMenu: MenuEntity;

    }
}