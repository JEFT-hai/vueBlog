<template>
  <transition name='transLeft'>
    <div v-show='show'
         class='pickerCityPage'
         ref="bigWrap">
      <div class='tabNav'>
        <i class='iconWanwan iconWleftBack'
           @click='hidePickerCity'></i>
        <p>城市选择</p>
      </div>
      <div class='curCity pickerBlock'>
        <div class='tabHeader borderB'>
          当前定位城市
        </div>
        <div class='pickerBlock_content'>
          <div class='cityItem'
               v-if='posCity'
               @click='pickerCity(posCity)'>{{posCity}}</div>
          <div class='cityItem textLoading'
               v-else>
            <span class='dotting'></span>
          </div>
          <div class='posBtn'
               @click='resetPos'>
            <i class='iconWanwan iconWdingwei'></i>
            <span>{{setPosText}}</span>
          </div>
        </div>
      </div>
      <div class='hotCity pickerBlock'>
        <div class='tabHeader borderB'>
          热门城市
        </div>
        <div class='pickerBlock_content'>
          <ul>
            <li class='cityItem'
                v-for='(item, index) in citys'
                :key='index'
                @click='pickerCity(item)'>{{item}}</li>
          </ul>
        </div>

      </div>
      <div class="pickerCityList">
        <ul class="cityList"
            ref="cityLi">
          <li class="cityLiList"
              v-for="(oneLi, index) in moreCitys"
              :key="index">
            <p class="liP">{{oneLi.code}}</p>
            <span class="oneCity borderB"
                  v-for="(oneCity, index) in oneLi.cityList"
                  :key="index"
                  @click='pickerCity(oneCity)'>{{oneCity}}</span>
          </li>
        </ul>
      </div>
      <div class="fixedLetter">
        <span @click="bakTop">热门城市</span>
        <span v-for="(letter, index) in moreCitys"
              :key="index"
              @click="handleCity(letter, index)">{{letter.code}}</span>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState } from 'vuex'
import { all } from 'q'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      citys: ['全部城市', '北京', '上海', '广州', '深圳', '成都', '沈阳', '大连', '吉林', '长春', '南京', '宁波', '青岛', '厦门', '苏州', '天津', '无锡', '武汉', '西安', '重庆'],
      setPosText: '重新定位',
      moreCitys: [
        {
          'code': 'A',
          'cityList': ['阿城市', '阿尔山市', '阿克苏市', '阿勒泰市', '阿图什市', '安达市', '安国市', '安康市', '安陆市', '安宁市', '安庆市', '安丘市', '安顺市', '安阳市', '鞍山市', '澳门']
        },
        {
        'code': 'B',
        'cityList': ['巴中市', '霸州市', '白城市', '白山市', '白银市', '百色市', '蚌埠市', '包头市', '宝鸡市', '保定市', '保山市', '北安市', '北海市', '北京市', '北流市', '北宁市', '北票市', '本溪市', '毕节市', '滨州市', '泊头市', '亳州市', '博乐市']
        },
        {
        'code': 'C',
        'cityList': ['沧州市', '岑溪市', '昌吉市', '昌邑市', '长春市', '长葛市', '长乐市', '长沙市', '长治市', '常德市', '常宁市', '常熟市',
        '常州市', '巢湖市', '朝阳市', '潮州市', '郴州市', '成都市', '承德市', '赤壁市', '赤峰市', '赤水市', '崇州市', '滁州市', '楚雄市', '慈溪市', '从化市']
        },
        {
        'code': 'D',
        'cityList': ['达川市', '大安市', '大丰市', '大理市', '大连市', '大庆市', '大石桥市', '大同市', '大冶市', '丹东市', '丹江口市', '丹阳市', '儋州市', '当阳市', '德惠市', '德令哈市', '德兴市', '德阳市', '德州市', '灯塔市', '登封市', '邓州市', '定州市', '东方市', '东港市', '东胜市', '东台市', '东莞市', '东兴市', '东阳市', '东营市', '都江堰市', '都匀市', '敦化市', '敦煌市']
        }, 
        {
        'code': 'E',
        'cityList': ['峨眉山市', '额尔古纳市', '鄂州市', '恩平市', '恩施市', '二连浩特市', '鄂尔多斯市']
        },
        {
        'code': 'F',
        'cityList': ['防城港市', '肥城市', '汾阳市', '丰城市', '丰南市', '丰镇市', '凤城市', '奉化市', '佛山市', '福安市', '福鼎市', '福清市', '福泉市', '福州市', '抚顺市', '阜康市', '阜新市', '阜阳市', '富锦市', '富阳市']
        },
        {
        'code': 'G',
        'cityList': ['盖州市', '赣州市', '高安市', '高啤店市', '高密市', '高平市', '高要市', '高邮市', '高州市', '藁城市', '格尔木市', '个旧市', '根河市', '公主岭市', '巩义市', '古交市', '广安市', '广汉市', '广水市', '广元市', '广州市', '贵池市', '贵港市', '贵溪市', '贵阳市', '桂林市', '桂平市']
        },
        {
        'code': 'H',
        'cityList': ['哈尔滨市', '哈密市', '海城市', '海口市', '海拉尔市', '海林市', '海伦市', '海门市', '海宁市', '海阳市', '邯郸市', '韩城市', '汉川市', '汉中市', '杭州市', '合川市', '合肥市', '合山市', '合作市', '和龙市', '和田市', '河池市', '河间市', '河津市', '河源市', '菏泽市', '贺州市', '鹤壁市', '鹤岗市', '鹤山市', '黑河市', '衡水市', '衡阳市', '洪湖市', '洪江市', '侯马市', '呼和浩特市', '湖州市', '葫芦岛市', '虎林市', '华阴市', '化州市', '怀化市', '淮安市', '淮北市', '淮南市', '淮阴市', '黄冈市', '黄骅市', '黄山市', '黄石市', '珲春市', '辉县市', '惠州市', '霍林格勒市', '霍州市']
        },
        {
        'code': 'J',
        'cityList': ['鸡西市', '吉安市', '吉林市', '吉首市', '即墨市', '集安市', '集宁市', '济南市', '济宁市', '济源市', '冀州市', '佳木斯市', '嘉兴市', '嘉峪关市', '简阳市', '建德市', '建瓯市', '建阳市', '江都市', '江津市', '江门市', '江山市', '江阴市', '江油市', '姜堰市', '胶南市', '胶州市', '焦作市', '蛟河市', '揭阳市', '介休市', '界首市', '金昌市', '金华市', '金坛市', '津市市', '锦州市', '晋城市', '晋江市', '晋州市', '荆门市', '荆州市', '井冈山市', '景德镇市', '景洪市', '靖江市', '九江市', '九台市', '酒泉市', '句容市']
        },
        {
        'code': 'K',
        'cityList': ['喀什市', '开封市', '开平市', '开原市', '开远市', '凯里市', '克拉玛依市', '库尔勒市', '奎屯市', '昆明市', '昆山市']
        },
        {
        'code': 'L',
        'cityList': ['拉萨市', '莱芜市', '莱西市', '莱阳市', '莱州市', '兰溪市', '兰州市', '廊坊市', '阆中市', '老河口市', '乐昌市', '乐陵市', '乐平市', '乐清市', '乐山市', '雷州市', '耒阳市', '冷水江市', '离石市', '醴陵市', '丽水市', '利川市', '溧阳市', '连云港市', '连州市', '涟源市', '廉江市', '辽阳市', '辽源市', '聊城市', '林州市', '临安市', '临川市', '临汾市', '临海市', '临河市', '临江市', '临清市', '临夏市', '临湘市', '临沂市', '灵宝市', '灵武市', '凌海市', '凌源市', '浏阳市', '柳州市', '六安市', '六盘水市', '龙海市', '龙井市', '龙口市', '龙泉市', '龙岩市', '娄底市', '泸州市', '陆丰市', '鹿泉市', '潞城市', '潞西市', '罗定市', '洛阳市', '漯河市']
        },
        {
        'code': 'M',
        'cityList': ['麻城市', '马鞍山市', '满洲里市', '茂名市', '梅河口市', '梅州市', '孟州市', '米泉市', '汨罗市', '密山市', '绵阳市', '绵竹市', '明光市', '牡丹江市', '穆棱市']
        },
        {
        'code': 'N',
        'cityList': ['内江市', '南安市', '南昌市', '南充市', '南川市', '南宫市', '南京市', '南康市', '南宁市', '南平市', '南通市', '南雄市', '南阳市', '讷河市', '宁安市', '宁波市', '宁德市', '宁国市']
        },
        {
        'code': 'P',
        'cityList': ['攀枝花市', '盘锦市', '磐石市', '彭州市', '蓬莱市', '邳州市', '平顶山市', '平度市', '平凉市', '凭祥市', '萍乡市', '莆田市', '濮阳市', '普兰店市', '普宁市']
        },
        {
        'code': 'Q',
        'cityList': ['七台河市', '栖霞市', '齐齐哈尔市', '启东市', '迁安市', '潜江市', '钦州市', '秦皇岛市', '沁阳市', '青岛市', '青铜峡市', '青州市', '清远市', '清镇市', '庆阳市', '邛崃市', '琼海市', '琼山市', '曲阜市', '曲靖市', '衢州市', '泉州市']
        },
        {
        'code': 'R',
        'cityList': ['仁怀市', '任丘市', '日喀则市', '日照市', '荣成市', '如皋市', '汝州市', '乳山市', '瑞安市', '瑞昌市', '瑞金市', '瑞丽市']
        },
        {
        'code': 'S',
        'cityList': ['三河市', '三门峡市', '三明市', '三亚市', '沙河市', '汕头市', '汕尾市', '商丘市', '商州市', '上海市', '上饶市', '上虞市', '尚志市', '韶关市', '韶山市', '邵武市', '邵阳市', '绍兴市', '深圳市', '深州市', '沈阳市', '嵊州市', '十堰市', '什邡市', '石河子市', '石家庄市', '石狮市', '石首市', '石嘴山市', '寿光市', '舒兰市', '双城市', '双辽市', '双鸭山市', '朔州市', '思茅市', '四会市', '四平市', '松原市', '松滋市', '苏州市', '宿迁市', '宿州市', '绥芬河市', '绥化市', '随州市', '遂宁市']
        },
        {
        'code': 'T',
        'cityList': ['塔城市', '台山市', '台州市', '太仓市', '太原市', '泰安市', '泰兴市', '泰州市', '唐山市', '洮南市', '滕州市', '天长市', '天津市', '天门市', '天水市', '铁法市', '铁力市', '铁岭市', '通化市', '通辽市', '通什市', '通州市', '同江市', '桐城市', '桐乡市', '铜川市', '铜陵市', '铜仁市', '图们市', '吐鲁番市']
        },
        {
        'code': 'W',
        'cityList': ['瓦房店市', '畹町市', '万宁市', '万源市', '威海市', '潍坊市', '卫辉市', '渭南市', '温岭市', '温州市', '文昌市', '文登市', '文水市', '乌海市', '乌兰浩特市', '乌鲁木齐市', '乌苏市', '无锡市', '吴川市', '吴江市', '吴县市', '吴忠市', '芜湖市', '梧州市', '五常市', '五大连池市', '武安市', '武冈市', '武汉市', '武进市', '武威市', '武穴市', '武夷山市', '舞钢市']
        },
        {
        'code': 'X',
        'cityList': ['西安市', '西昌市', '西峰市', '西宁市', '锡林浩特市', '锡山市', '厦门市', '仙桃市', '咸宁市', '咸阳市', '湘潭市', '湘乡市', '襄樊市', '项城市', '萧山市', '孝感市', '孝义市', '忻州市', '辛集市', '新乐市', '新密市', '新民市', '新泰市', '新乡市', '新沂市', '新余市', '新郑市', '信阳市', '信宜市', '兴城市', '兴化市', '兴宁市', '兴平市', '兴义市', '邢台市', '徐州市', '许昌市', '宣威市', '宣州市','香港']
        },
        {
        'code': 'Y',
        'cityList': ['牙克石市', '雅安市', '烟台市', '延安市', '延吉市', '盐城市', '兖州市', '偃师市', '扬中市', '扬州市', '阳春市', '阳江市', '阳泉市', '伊春市', '伊宁市', '仪征市', '宜宾市', '宜昌市', '宜城市', '宜春市', '宜都市', '宜兴市', '宜州市', '义马市', '义乌市', '益阳市', '银川市', '应城市', '英德市', '鹰潭市', '荥阳市', '营口市', '永安市', '永城市', '永川市', '永济市', '永康市', '永州市', '余杭市', '余姚市', '榆次市', '榆林市', '榆树市', '禹城市', '禹州市', '玉林市', '玉门市', '玉溪市', '沅江市', '原平市', '岳阳市', '云浮市', '运城市']
        },
        {
        'code': 'Z',
        'cityList': ['枣阳市', '枣庄市', '增城市', '扎兰屯市', '湛江市', '张家港市', '张家界市', '张家口市', '张掖市', '章丘市', '漳平市', '漳州市', '樟树市', '招远市', '昭通市', '肇东市', '肇庆市', '镇江市', '郑州市', '枝江市', '中山市', '重庆市', '舟山市', '周口市', '株洲市', '珠海市', '诸城市', '诸暨市', '驻马店市', '庄河市', '涿州市', '资兴市', '资阳市', '淄博市', '自贡市', '邹城市', '遵化市', '遵义市']
        }
      ],
      currentLetter: '', // 表示当前的字母
      currentCode: ''
    }
  },
  mounted () {
    if (this.pos.loctype === 62) {
      this.setPosText = '定位未开启, 请手动选择定位城市'
    }
  },
  computed: {
    ...mapState(['pos']),
    posCity () {
      return this.pos.city.split('市')[0]
    }
  },
  methods: {
    hidePickerCity () {
      this.$emit('hidePickerCity')
    },
    pickerCity (item) {
      let letter = item.charAt(item.length - 1)
      if (letter == '市') {
        let str = (item.substr(0, item.length - 1))
        this.$emit('pickerCity', str)
      } else {
        this.$emit('pickerCity', item)
      }
    },
    resetPos () {
      if (this.pos.loctype === 62) {
        this.$toast('未开启定位')
      } else {
        window.isInAndroid && window.WanAndroid.getLocation()
      }
    },
    /**
     * handleCity 回到对应的城市
     */
    handleCity (letter, index) {
      let cityUl = this.$refs.cityLi
      let allLi =cityUl.childNodes
      let offHeight = allLi[index].offsetTop
      let liP = document.getElementsByClassName('liP')
      let pHeight = liP[index].offsetHeight
      let bigWrap = this.$refs.bigWrap
      let height = offHeight - pHeight - 15
      bigWrap.scrollTo(0, height)
    },
    /**
     * bakTop 回到热门城市
     */
    bakTop () {
      let bigWrap = this.$refs.bigWrap
      bigWrap.scrollTo(0, 0)
    },
  }
}
</script>
<style lang='less'>
.pickerCityPage{
    &.transLeft-enter-active,&.transLeft-leave-active{
      transition: all .25s ease;
    }
    &.transLeft-enter,&.transLeft-leave-to{
      left: 100vw;
    }
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 600;
    background: var(--mBg);
    padding-top: 12vw;
    overflow-y: scroll;
    .pickerBlock_content{
        ul{
            font-size: 0;
            text-align: center;
        }
        .cityItem{
            display: inline-block;
            margin: 1.94vw 1.4vw;
            height: 8.33vw;
            line-height: 8.33vw;
            width: 19.44vw;
            font-size: var(--nText);
            text-align: center;
            box-sizing: border-box;
            border: 1px solid #e4e4e4;
            border-radius: 0.7vw;
        }
        .posBtn{
            float: right;
            height: 12.21vw;
            line-height: 12.21vw;
            color: var(--mblue);
            font-size: 0;
            i{
                font-size:var(--BTitle);
                font-weight: bold;
                color: var(--mblue);
                display: inline-block;
                margin-right: 1.7vw;
                vertical-align: top;
            }
            span{
                display: inline-block;
                font-size:var(--mText);
                vertical-align: top;
            }
        }
    }
    .pickerCityList{
      background:white;
      margin-top:2.68vw;
      width:100%;
      .cityList{
        width:100%;
        .cityLiList{
          width:90%;
          margin:auto;
          p{
            color:#888;
            font-size:3vw;
            height:7.78vw;
            line-height:7.78vw;
          }
          .oneCity{
            display:inline-block;
            width:100%;
            height:11.48vw;
            line-height:11.48vw;
            font-size:3.8vw;
          }
        }
      }
    }
    .fixedLetter{
      width:7vw;
      position:fixed;
      top:50.37vw;
      right:0;
      z-index: 610;
      font-size:0;
      span{
        display:inline-block;
        width:100%;
        text-align: center;
        color:#677a8b;
        font-size:3vw;
        height:4vw;
        line-height:4vw;
      }
    }
}
</style>
