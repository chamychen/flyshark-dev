declare let Site: any;

declare let WebuiPopovers: any;

interface JQuery {
    toolbar(options: any): void;

    webuiPopover(...args: any[]): void;

    select2(options?: any): void;
}