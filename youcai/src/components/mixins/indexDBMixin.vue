<script>
export default {
    data () {
        return {
            myDB: {
                name:'indexWaterfall',
                version: 6,
                db:null
            },
            storeAddItems: []
        }
    },
    created () {
        this.initIndexDB(this.myDB.name, this.myDB.version)
    },
    watch: {
        addItems (newV) {
            if (newV.length) {
                this.initIndexDB(this.myDB.name, this.myDB.version)
                .then(()=> {
                    this.clearObjectStore(this.myDB.db, 'indexWaterfall')
                    this.addData(this.myDB.db, 'indexWaterfall')
                })
                
            } else {
                this.initIndexDB(this.myDB.name, this.myDB.version)
            }
        }
    },
    methods: {
        initIndexDB (name, version) { // 初始化indexDB
            let _this = this
            this.storeAddItems = []
            return new Promise((resolve, reject) => {
                let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
                if(!indexedDB){
                    console.log('你的浏览器不支持IndexedDB')
                    return
                }
                var request = window.indexedDB.open(name, version)
                request.onerror = function(e){
                    reject()
                    console.log(e.currentTarget.error.message)
                }
                request.onsuccess=function(e){
                    resolve()
                    _this.myDB.db = e.target.result
                    if (_this.myDB.db.objectStoreNames.contains('indexWaterfall')) {
                        var transaction = _this.myDB.db.transaction(['indexWaterfall'], 'readonly')
                        var itemStore = transaction.objectStore('indexWaterfall')
                        var request = itemStore.openCursor()
                        request.onsuccess=function(e){
                            var cursor = e.target.result
                            if(cursor){
                                var currentItem=cursor.value
                                _this.storeAddItems.push(currentItem)
                                cursor.continue()
                            } else {
                                if (!_this.addItems.length && _this.storeAddItems.length) {
                                    _this.addItems = _this.addItems.concat( _this.storeAddItems)
                                }
                            }
                        }
                    }
                }
                request.onupgradeneeded=function(e){
                    _this.myDB.db = e.target.result
                    if(!_this.myDB.db.objectStoreNames.contains('indexWaterfall')){
                        _this.myDB.db.createObjectStore('indexWaterfall',{'autoIncrement': true})
                    }
                }
            })
        },
        addData(db, storeName){
            var transaction = db.transaction(storeName, 'readwrite')
            var store = transaction.objectStore(storeName)
            for(var i=0; i < this.addItems.length;i++){
                store.add(this.addItems[i])
            }
        },
        deleteDataByKey(db, storeName, value){
            var transaction=db.transaction(storeName,'readwrite')
            var store=transaction.objectStore(storeName)
            store.delete(value)
        },
        clearObjectStore(db, storeName){
            var transaction = db.transaction(storeName, 'readwrite')
            var store = transaction.objectStore(storeName)
            var clearReq =  store.clear()
            clearReq.onsuccess = function () {
            }
            clearReq.onerror = function () {
            }
        }
    }
}
</script>