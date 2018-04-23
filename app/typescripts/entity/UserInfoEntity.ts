///<reference path="MenuEntity.ts" />
///<reference path="UserBaseInfoEntity.ts" />

namespace flyshark.entity {
    /**
     * 用户基本信息
     */
    export class UserInfoEntity {
        userBaseInfo: UserBaseInfoEntity;
        menuList: Array<MenuEntity>;
    }
}