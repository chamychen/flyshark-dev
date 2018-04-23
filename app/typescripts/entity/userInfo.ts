///<reference path="menu.ts" />
///<reference path="userBaseInfo.ts" />

namespace flyshark.entity {
    /**
     * 用户基本信息
     */
    export class UserInfo {
        userBaseInfo: UserBaseInfo;
        menuList: Array<Menu>;
    }
}