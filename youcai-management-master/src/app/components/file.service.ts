/*
 * @Author: your name
 * @Date: 2020-02-12 02:06:09
 * @LastEditTime : 2020-02-12 03:36:17
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \youcai-management-master\src\app\components\file.service.ts
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private fileUrl = 'http://file.szwanwan.com:7021/api/'; // URL to file api
//   httpOptions = {
//     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
//   };

  constructor(private http: HttpClient) {}

  /** GET heroes from the server */
  upImg (file: any) {
    const fd = new FormData();
    fd.append('1', file);
    return this.http.post(this.fileUrl + 'file', fd)
            .toPromise()
            .then((res) => {
                return res
            })
            .catch((err) => {
                console.log(err, 'upImgErr')
            })
  }

  /** GET heroes from the server */
  thumbImg(file: any) {
    const fd = new FormData();
    fd.append('1', file);
    return  this.http.post(this.fileUrl + 'FileThumbnailOnly', fd)
                .toPromise()
                .then((res) => {
                    return res
                })
  }
}
