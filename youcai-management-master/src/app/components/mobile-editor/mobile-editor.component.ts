/*
 * @Author: your name
 * @Date: 2020-02-11 22:12:27
 * @LastEditTime : 2020-02-12 03:17:37
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \youcai-management-master\src\app\components\mobile-editor\mobile-editor.component.ts
 */
import { Component, OnInit } from '@angular/core';
import { FileService } from '../file.service'

@Component({
  selector: 'app-mobile-editor',
  templateUrl: './mobile-editor.component.html',
  styleUrls: ['./mobile-editor.component.less']
})
export class MobileEditorComponent implements OnInit {
  rightFulImg: Array<string> = ['http://192.168.1', 'szwanwan']; // 合法的图片网址
  editorContent: any = '';
  imporperImg: Array<String> = [];
  constructor(
    private fileS: FileService
  ) { }

  ngOnInit() {
  }

  convert () {
    const html = document.getElementById('mobileEditor').innerHTML;
    // console.log(html, 'html')
    // this.editorContent = html;
    let hasImporperImg = this.getImporperImg(html);
    hasImporperImg && this.filterImage()
  }

  getImporperImg (html: String) {
    // 匹配所有的图片
    let allImage = html.match(/(http(s?):\/\/.*?(png|jpg|jpeg|gif))/g);
    // 过滤出不在我们服务器的图片 -> 进行压缩替换
    if (allImage && allImage.length) { // 有图片 过滤
      this.imporperImg = [];
      allImage.map((item, index) => {
        // 过滤掉 网址 + 图片 eg: http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 http://img.xiumi.us/xmi/ua/24yQx/i/a9ae0468c43da2234ad6b5ba394a8391-sz_1727.png
        if (item.lastIndexOf('http') > 0) {
          item = item.slice(item.lastIndexOf('http'), item.length);
        }
        if (this.rightFulImg.findIndex((itm) => item.indexOf(itm) !== -1) === -1) {
          this.imporperImg.push(item);
        }
      })
    } else { // 无图片就不走替换程序
      this.imporperImg = allImage;
    }
    // 下面是合格的网址 正式 | 测试
    // http://file.szwanwan.com:8888/group1/M00/01/22/rBpkyF0_qraAa74lAAeLSlApX7k011.jpg?x-oss-process=style/xmorient
    // http://192.168.1.102:8888/group1/M00/00/12/wKgBZl0_pTGAQFRJACdma90JPzw963.jpg?x-oss-process=style/xmorient
    return this.imporperImg && this.imporperImg.length;
  }
  // 将非本站网址进行替换
  filterImage() {
    for (let i = 0; i < this.imporperImg.length; i++) {  
      // url -> base64 -> file -> post/res -> url
      this.replaceImage(this.imporperImg[i])
    }
  }

  // 替换单张图片
  async replaceImage (url: String) {
    let filename = url.slice(url.lastIndexOf('.') + 1, url.length);
    // url -> base64
    let base64 = await this.download(url);
    // base64 -> file
    let file = await this.base64ToFile(base64, filename);
    // file 请求压缩图片 替换网址
    let newUrl = await this.fileS.thumbImg(file);
    newUrl && (this.editorContent = this.editorContent.replace(url, newUrl))
    console.log(newUrl, url)
  }

  // 下面是图片转换函数
  // url -> base64
  download (src) {
    let me = this
    return new Promise ((resolve) => {
      let type = src.slice(src.lastIndexOf('.') + 1, src.length)
      var img = document.createElement('img')
      img.setAttribute('crossOrigin', 'anonymous')
      img.onload = function(e) {
          let canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          var context = canvas.getContext('2d')
          context.drawImage(img, 0, 0, img.width, img.height)
          document.body.append(canvas)
          let base64 = canvas.toDataURL('image/' + type)
          resolve(base64)
      }
      img.src = src
    })
  }
  // base64 => file
  base64ToFile (dataurl, filename) {
    return new Promise ((resolve) => {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
      while(n--){
          u8arr[n] = bstr.charCodeAt(n)
      }
      let file = new File([u8arr], filename, {type:mime})
      resolve(file)
    })
  }
}
