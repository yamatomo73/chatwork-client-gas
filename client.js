(function(global){
  var ChatWork = (function() {
    
    function ChatWork(config)
    {
      this.base_url = 'https://api.chatwork.com/v2';
      this.headers  = {'X-ChatWorkToken': config.token};  
    };
    
    /**
    * 自分自身の情報を取得
    * @see http://developer.chatwork.com/ja/endpoint_me.html#GET-me
    */
    ChatWork.prototype.getMe = function() {
      return this.httpGet('/me');
    };

    /**
    * 自分のステータスを取得
    * @see http://developer.chatwork.com/ja/endpoint_my.html#GET-my-status
    */
    ChatWork.prototype.getMyStatus = function() {
      return this.httpGet('/my/status');
    };

    /**
    * 自分のコンタクトになっているユーザーの一覧
    * @returns {object} APIのレスポンス
    * @see http://developer.chatwork.com/ja/endpoint_contacts.html#GET-contacts
    */
    ChatWork.prototype.getContacts = function() {
      return this.httpGet('/contacts');
    };
    
    /**
    * 自分のルーム一覧を取得
    * @returns {object} APIのレスポンス
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#GET-rooms
    */
    ChatWork.prototype.getRooms = function() {
      return this.httpGet('/rooms');
    };

    /**
    * ルーム情報を取得
    * @returns {object} APIのレスポンス
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#GET-rooms-room_id
    */
    ChatWork.prototype.getRoom = function(params) {
      return this.httpGet('/rooms/' + params.room_id);
    };
    
    /**
    * ルーム新規作成
    * @returns {object} APIのレスポンス
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#POST-rooms
    */
    ChatWork.prototype.createRoom = function(params) {
      var post_data_base = {
        'name': params.name,
        'members_admin_ids': params.members_admin_ids.join(','),
      };
      var optional_keys = ['description', 'icon_preset', 'link', 'link_code', 'link_need_acceptance', 'members_member_ids', 'members_readonly_ids'];
      var optional_post_data = this._objectFilter(params, optional_keys);
      if ('members_member_ids' in optional_post_data) {
        optional_post_data['members_member_ids'] = optional_post_data['members_member_ids'].join(',');
      }
      if ('members_readonly_ids' in optional_post_data) {
        optional_post_data['members_readonly_ids'] = optional_post_data['members_readonly_ids'].join(',');
      }
      if ('link' in optional_post_data) {
        optional_post_data['link'] = this._toApiBoolean(optional_post_data['link']);
      }
      if ('link_need_acceptance' in optional_post_data) {
        optional_post_data['link_need_acceptance'] = this._toApiBoolean(optional_post_data['link_need_acceptance']);
      }
      
      var post_data = this._objectMerge(post_data_base, optional_post_data);
      return this.httpPost('/rooms', post_data);
    };
    
    /**
    * ルーム情報の更新
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#PUT-rooms-room_id
    */
    ChatWork.prototype.updateRoom = function(params) {
      var optional_keys = ['description', 'icon_preset', 'name'];
      var put_data = this._objectFilter(params, optional_keys);
      
      return this.httpPut('/rooms/' + params.room_id, put_data);
    };
    
    /**
    * ルーム退出
    * @returns {boolean} 成功した場合true
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#DELETE-rooms-room_id
    */
    ChatWork.prototype.leaveRoom = function(params) {
      this.httpDelete('/rooms/' + params.room_id, {'action_type': 'leave'});
      return true;
    };
    
    /**
    * ルーム削除
    * @returns {boolean} 成功した場合true
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#DELETE-rooms-room_id
    */
    ChatWork.prototype.deleteRoom = function(params) {
      this.httpDelete('/rooms/' + params.room_id, {'action_type': 'delete'});
      return true;
    };
    
    /**
    * ルームのメンバー一覧取得
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#GET-rooms-room_id-members
    */
    ChatWork.prototype.getRoomMembers = function(params) {
      return this.httpGet('/rooms/' + params.room_id　+ '/members');
    };
    
    /**
    * ルームのメンバー一括更新
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#PUT-rooms-room_id-members
    */
    ChatWork.prototype.updateRoomMembers = function(params) {
      var param_keys = ['members_admin_ids', 'members_member_ids', 'members_readonly_ids'];
      var put_data = this._objectFilter(params, param_keys, function(value) {return value.join(',');} );
      return this.httpPut('/rooms/' + params.room_id　+ '/members', put_data);
    };

    /**
    * 未取得ルームメッセージ取得
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#POST-rooms-room_id-messages
    */
    ChatWork.prototype.getRoomMessages = function(params) { 
      var param_keys = ['force'];
      var get_data = this._objectFilter(params, param_keys);
      return this.httpGet('/rooms/'+ params.room_id +'/messages', get_data);
    };

    /**
    * メッセージ送信
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#POST-rooms-room_id-messages
    */
    ChatWork.prototype.sendMessage = function(params) { 
      var post_data = {
        'body': params.body,
        'self_unread': this._toApiBoolean(this._getValue(params, 'self_unread', 0)),
      }
      
      return this.httpPost('/rooms/'+ params.room_id +'/messages', post_data);
    };
    
    /**
    * メッセージ更新
    * @returns {object} APIのレスポンス
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#PUT-rooms-room_id-messages-message_id
    */
    ChatWork.prototype.updateMessage = function(params) { 
      var put_data = {
        'body': params.body
      }
      
      return this.httpPut('/rooms/'+ params.room_id +'/messages/' + params.message_id, put_data);
    };

    /**
    * メッセージ削除
    * @returns {object} APIのレスポンス
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#DELETE-rooms-room_id-messages-message_id
    */
    ChatWork.prototype.deleteMessage = function(params) { 
      return this.httpDelete('/rooms/'+ params.room_id +'/messages/' + params.message_id);
    };

    /**
    * メッセージを既読にする
    * @returns {(object|boolean)} APIのレスポンス。APIに失敗した場合は false
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#PUT-rooms-room_id-messages-read
    */
    ChatWork.prototype.readRoomMessages = function(params) { 
      var optional_keys = ['message_id'];
      var put_data = this._objectFilter(params, optional_keys);
      try {
        return this.httpPut('/rooms/'+ params.room_id +'/messages/read', put_data);
      } catch(e) {
        // すでに既読とか400エラーはfalse
        Logger.log(e);
        return false;
      }
    };
    
    /**
    * メッセージを未読にする
    * @returns {(object|boolean)} APIのレスポンス。APIに失敗した場合は false
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#PUT-rooms-room_id-messages-unread
    */
    ChatWork.prototype.unreadRoomMessages = function(params) { 
      var param_keys = ['message_id'];
      var put_data = this._objectFilter(params, param_keys);
      try {
        return this.httpPut('/rooms/'+ params.room_id +'/messages/unread', put_data);
      } catch(e) {
        // すでに未読とか400エラーはfalse
        Logger.log(e);
        return false;
      }
    };
    
    /**
    * マイチャットへのメッセージを送信
    */
    ChatWork.prototype.sendMessageToMyChat = function(message) {
      var mydata = this.httpGet('/me');
      
      return this.sendMessage({
        'body': message,
        'room_id': mydata.room_id
      });
    };
    
    /**
    * タスク追加
    * @returns {object} APIのレスポンス
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#POST-rooms-room_id-tasks
    */
    ChatWork.prototype.sendTask = function(params) {
      // 互換性のため
      if ('to_id_list' in params) {
        params['to_ids'] = params.to_id_list;
      }
      var post_data_base = {
        'body': params.body,
        'to_ids': params['to_ids'].join(','),
      };
      var optional_keys = ['limit'];
      var optional_post_data = this._objectFilter(params, optional_keys);
      if ('limit' in optional_post_data) {
        // limit があれば unix time に変換を試みる
        optional_post_data['limit'] = this._toUnixTime(optional_post_data['limit']);
      }
      
      var post_data = this._objectMerge(post_data_base, optional_post_data);
      return this.httpPost('/rooms/'+ params.room_id +'/tasks', post_data);
    };
    
    /**
    * タスク情報取得
    * @returns {object} APIのレスポンス
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#POST-rooms-room_id-tasks
    */
    ChatWork.prototype.sendTask = function(params) {
      // 互換性のため
      if ('to_id_list' in params) {
        params['to_ids'] = params.to_id_list;
      }
      var post_data_base = {
        'body': params.body,
        'to_ids': params['to_ids'].join(','),
      };
      var optional_keys = ['limit'];
      var optional_post_data = this._objectFilter(params, optional_keys);
      if ('limit' in optional_post_data) {
        // limit があれば unix time に変換を試みる
        optional_post_data['limit'] = this._toUnixTime(optional_post_data['limit']);
      }
      
      var post_data = this._objectMerge(post_data_base, optional_post_data);
      return this.httpPost('/rooms/'+ params.room_id +'/tasks', post_data);
    };
    
    /**
    * 指定したチャットのタスク一覧を取得
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#GET-rooms-room_id-tasks
    */
    ChatWork.prototype.getRoomTasks = function(room_id, params) {
      return this.httpGet('/rooms/' + room_id + '/tasks', params);
    };
    
    /**
    * チャットのファイル一覧を取得
    * @returns {object} APIのレスポンス
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#GET-rooms-room_id-files
    */
    ChatWork.prototype.getRoomFiles = function(params) {
      var param_keys = ['account_id'];
      var get_data = this._objectFilter(params, param_keys);
      return this.httpGet('/rooms/' + params.room_id + '/files', get_data);
    };
    
    /**
    * 新しいファイルをアップロード
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#POST-rooms-room_id-files
    */
    ChatWork.prototype.uploadRoomFile = function(params) {
      throw new Error('NotImplementedError');
    };
    
    /**
    * ファイル情報を取得
    * @returns {object} APIのレスポンス
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#GET-rooms-room_id-files-file_id
    */
    ChatWork.prototype.getRoomFile = function(params) {
      var get_data = {
        'create_download_url': this._toApiBoolean(this._getValue(params, 'create_download_url', false)),
      };
      return this.httpGet('/rooms/' + params.room_id + '/files/' + params.file_id, get_data);
    };
    
    /**
    * 招待リンクを取得する
    * @returns {object} APIのレスポンス
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#GET-rooms-room_id-link
    */
    ChatWork.prototype.getRoomLink = function(params) {
      return this.httpGet('/rooms/' + params.room_id + '/link');
    };

    /**
    * 招待リンクを作成する
    * @returns {object} APIのレスポンス
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#PUT-rooms-room_id-link
    */
    ChatWork.prototype.createRoomLink = function(params) {
      var param_keys = ['code', 'description'];
      var post_data = this._objectFilter(params, param_keys);
      post_data['need_acceptance'] = this._toApiBoolean(this._getValue(params, 'need_acceptance', true));
      return this.httpPost('/rooms/' + params.room_id + '/link', post_data);
    };

    /**
    * 招待リンクを変更する
    * @returns {object} APIのレスポンス
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#PUT-rooms-room_id-link
    */
    ChatWork.prototype.updateRoomLink = function(params) {
      var param_keys = ['code', 'description'];
      var put_data = this._objectFilter(params, param_keys);
      put_data['need_acceptance'] = this._toApiBoolean(this._getValue(params, 'need_acceptance', true));
      return this.httpPut('/rooms/' + params.room_id + '/link', put_data);
    };

    /**
    * 招待リンクを削除する
    * @returns {object} APIのレスポンス
    * @see http://developer.chatwork.com/ja/endpoint_rooms.html#DELETE-rooms-room_id-link
    */
    ChatWork.prototype.deleteRoomLink = function(params) {
      return this.httpDelete('/rooms/' + params.room_id + '/link');
    };

    /**
    * 自分のタスク一覧を取得
    * @see http://developer.chatwork.com/ja/endpoint_my.html#GET-my-tasks
    */
    ChatWork.prototype.getMyTasks = function(params) {
      return this.httpGet('/my/tasks', params);
    };
    
    /**
    * 自分に対するコンタクト承認依頼一覧を取得する
    * @see http://developer.chatwork.com/ja/endpoint_incoming_requests.html#GET-incoming_requests
    */
    ChatWork.prototype.getIncomingRequests = function() {
      return this.httpGet('/incoming_requests');
    };
    
    /**
    * 自分に対するコンタクト承認依頼を承認する
    * @see http://developer.chatwork.com/ja/endpoint_incoming_requests.html#PUT-incoming_requests-request_id
    */
    ChatWork.prototype.acceptIncomingRequest = function(params) {
      return this.httpPut('/incoming_requests/' + params.request_id);
    };
    
    /**
    * 自分に対するコンタクト承認依頼をキャンセルする
    * @see http://developer.chatwork.com/ja/endpoint_incoming_requests.html#DELETE-incoming_requests-request_id
    */
    ChatWork.prototype.cancelIncomingRequest = function(params) {
      return this.httpDelete('/incoming_requests/' + params.request_id);
    };
    
    
    /*
    * boolean に変換する
    * @returns {boolean}
    */
    ChatWork.prototype._toBoolean = function(value) {
      return ('1' === value || 1 === value || true === value);
    }
    
    /*
    * API パラメータで指定する boolean 値に変換する
    * @returns {string}
    */
    ChatWork.prototype._toApiBoolean = function(value) {
      return (this._toBoolean(value)) ? '1' : '0';
    }

    /*
    * オブジェクトから指定したキーだけを抽出する
    * オブジェクトにキーがない場合は、無視される
    */
    ChatWork.prototype._objectFilter = function(obj, keys, converter_func) {
      var filter_obj = {};
      for(var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key in obj) {
          filter_obj[key] = this._getValue(obj, key);
          if (typeof converter_func === 'function') {
            filter_obj[key] = converter_func(filter_obj[key]);
          }
        }
      }
      return filter_obj;
    };
    
    /*
    * unix timeに変換する
    * @returns {(number|null)} unix time。無効な値は null
    */
    ChatWork.prototype._toUnixTime = function(value) {
      switch (typeof value) {
        case 'string':
        case 'number':
          return (new Number(optional_post_data['value'])).toFixed();
      }
      if (value instanceof Date) {
        return (new Number(Math.floor(value.getTime() / 1000))).toFixed();
      }
      
      // 未対応
      return null;
    };

    /*
    * unix timeに変換する
    * @returns {(number|null)} unix time。無効な値は null
    */
    ChatWork.prototype._objectMerge = function(value) {
      var result = {};
      for(var i = 0; i < arguments.length; ++i) {
        for(var key in arguments[i]) {
          result[key] = arguments[i][key];
        }
      }
      return result;
    };

    /*
    * オブジェクトから値を取り出す
    * キーが存在しない場合は default_value を返却する
    */
    ChatWork.prototype._getValue = function(params, key, default_value) {
      params = params || {};
      default_value = default_value === undefined ? null : default_value;
      return key in params ? params[key] : default_value;
    };
    
    /*
    * オブジェクトから値を文字列として取り出す
    * キーが存在しない場合は default_value を返却する
    */
    ChatWork.prototype._getStringValue = function(params, key, default_value) {
      var value = this._getValue(params, key, default_value);
      return String(value);
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
    
    ChatWork.prototype.httpPost = function(endpoint, post_data) {
      return this._sendRequest({
        'method': 'post',
        'path': endpoint,
        'payload': post_data
      });
    };
    
    ChatWork.prototype.httpPut = function(endpoint, put_data) {
      return this._sendRequest({
        'method': 'put',
        'path': endpoint,
        'payload': put_data
      });
    };
    
    ChatWork.prototype.httpDelete = function(endpoint, put_data) {
      return this._sendRequest({
        'method': 'delete',
        'path': endpoint,
        'payload': put_data
      });
    };
    
    ChatWork.prototype.httpGet = function(endpoint, get_data) { 
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
