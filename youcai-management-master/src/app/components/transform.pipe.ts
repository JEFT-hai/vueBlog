/*
 * @Author: your name
 * @Date: 2020-02-12 00:56:57
 * @LastEditTime: 2020-02-12 00:57:42
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \youcai-management-master\src\app\components\transform.pipe.ts
 */
import {Pipe, PipeTransform} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
@Pipe({
    name: "html"
})
export class HtmlPipe implements PipeTransform{
    constructor (private sanitizer: DomSanitizer) {
    }
    transform(style) {
        return this.sanitizer.bypassSecurityTrustHtml(style);
    }
}