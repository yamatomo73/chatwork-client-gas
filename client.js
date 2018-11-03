(function(global){
  var ChatWork = (function() {
    
    function ChatWork(config)
    {
      this.base_url = 'https://api.chatwork.com/v2';
      this.headers  = {'X-ChatWorkToken': config.token};  
    };
    
    /**
    * 自分のルーム一覧を取得
    */
    ChatWork.prototype.getRooms = function() {
      return this.get('/rooms');
    };
    
    /**
    * ルーム情報を取得
    */
    ChatWork.prototype.getRoom = function(params) {
      return this.get('/rooms/' + params.room_id);
    };
    
    /**
    * ルーム情報の更新
    */
    ChatWork.prototype.updateRoom = function(params) {
      var optional_keys = ['description', 'icon_preset', 'name'];
      var put_data = this._objectFilter(params, optional_keys);
      
      return this.put('/rooms/' + params.room_id, put_data);
    };
    
    /**
    * ルームのメンバー一覧取得
    */
    ChatWork.prototype.getRoomMembers = function(params) {
      return this.get('/rooms/' + params.room_id　+ '/members');
    };
    
    /**
    * メッセージ送信
    */
    ChatWork.prototype.sendMessage = function(params) { 
      var post_data = {
        'body': params.body,
        'self_unread': this._getStringValue(params, 'self_unread', 0)
      }
      
      return this.post('/rooms/'+ params.room_id +'/messages', post_data);
    };
    
    /**
    * マイチャットへのメッセージを送信
    */
    ChatWork.prototype.sendMessageToMyChat = function(message) {
      var mydata = this.get('/me');
      
      return this.sendMessage({
        'body': message,
        'room_id': mydata.room_id
      });
    };
    
    /**
    * タスク追加
    */
    ChatWork.prototype.sendTask = function(params) {
      var to_ids = params.to_id_list.join(',');
      var post_data = {
        'body': params.body,
        'to_ids': to_ids,
        'limit': (new Number(params.limit)).toFixed() // 指数表記で来ることがあるので、intにする
      };
      
      return this.post('/rooms/'+ params.room_id +'/tasks', post_data);
    };
    
    /**
    * 指定したチャットのタスク一覧を取得
    */
    ChatWork.prototype.getRoomTasks = function(room_id, params) {
      return this.get('/rooms/' + room_id + '/tasks', params);
    };
    
    /**
    * 自分のタスク一覧を取得
    */
    ChatWork.prototype.getMyTasks = function(params) {
      return this.get('/my/tasks', params);
    };
    
    
    ChatWork.prototype._sendRequest = function(params)
    {
      var url = this.base_url + params.path;
      var options = {
        'method': params.method,
        'headers': this.headers,
        'payload': this._getValue(params, 'payload', {}),
      };
      result = UrlFetchApp.fetch(url, options);
      
      // リクエストに成功していたら結果を解析して返す
      if (result.getResponseCode() == 200) {
        return JSON.parse(result.getContentText())
      }
      
      return false;
    };
    
    ChatWork.prototype._objectFilter = function(obj, keys) {
      var filter_obj = {};
      var optional_keys = ['description', 'icon_preset', 'name'];
      for(var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key in obj) {
          filter_obj[key] = this._getStringValue(obj, key);
        }
      }
      return filter_obj;
    };
    
    ChatWork.prototype._getValue = function(params, key, default_value) {
      params = params || {};
      default_value = default_value === undefined ? null : default_value;
      return key in params ? params[key] : default_value;
    };
    
    ChatWork.prototype._deleteNullValueProperties = function(obj) {
      for (var key in obj) {
        if (obj[key] === null) {
          // delete obj[key];
          Logger.log('delete: ' + key + ' - ' + obj[key]);
        }
      }
      return obj;
    };
    
    ChatWork.prototype._getStringValue = function(params, key, default_value) {
      var value = this._getValue(params, key, default_value);
      return String(value);
    };
    
    ChatWork.prototype.post = function(endpoint, post_data) {
      return this._sendRequest({
        'method': 'post',
        'path': endpoint,
        'payload': post_data
      });
    };
    
    ChatWork.prototype.put = function(endpoint, put_data) {
      return this._sendRequest({
        'method': 'put',
        'path': endpoint,
        'payload': put_data
      });
    };
    
    ChatWork.prototype.get = function(endpoint, get_data) { 
      get_data = get_data || {};
      
      var path = endpoint
      
      // get_dataがあればクエリーを生成する
      // かなり簡易的なので必要に応じて拡張する
      var query_string_list = [];
      for (var key in get_data) {
        query_string_list.push(encodeURIComponent(key) + '=' + encodeURIComponent(get_data[key]));
      }
      
      if (query_string_list.length > 0) {
        path += '?' + query_string_list.join('&'); 
      }
      
      return this._sendRequest({
        'method': 'get',
        'path': path
      });
    };
    
    return ChatWork;
  })();
  
  global.ChatWork = ChatWork;
  
})(this);


/**
* ChatWorkClientの作成
*
* <h3>利用例</h3>
* <pre>
* var cw = ChatWorkClient.factory({token: xxx});
* cw.sendMessage({room_id: xx, body: xx});
* </pre>
* @param {assoc} config
*/
function factory(config) {
  return new ChatWork(config);
};
