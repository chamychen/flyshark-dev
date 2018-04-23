namespace flyshark.entity {
    export enum Sex {
        Male = 1,//男
        Female,//女
    }

    /**
     * 用户基本信息
     */
    export class UserBaseInfo {
        name: string;
        tokenId: string;
        portraitsUrl: string;
        sex: Sex;
        lastMenuId: string;
        lastEpsId: string;
    }
}