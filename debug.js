if (undefined ===  ChatWorkClient) {
  var global = (function(){return this})();
  var ChatWorkClient = global;
}

var TEST_POST_ROOM_ID = 127836835;
var API_KEY = PropertiesService.getScriptProperties().getProperty('CW_API_KEY');

/**
* ルーム情報更新
*/
function testUpdateRoom() {
  var client = ChatWorkClient.factory({token: API_KEY});
  
  // ルーム情報参照
  var response = client.updateRoom({
    room_id: TEST_POST_ROOM_ID,
    description: Math.random(),
    icon_preset: 'security',
    name: '康夫の家族会議室' + Utilities.formatDate( new Date(), 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss'),
  });
  
  Logger.log(response);
  
  return response;
}

/*
* ルーム更新系のシナリオテスト
*/
function testRoomCRUDScenario() {
  var client = ChatWorkClient.factory({token: API_KEY});
  
  // ルーム情報参照
  var response = client.getRoom({
    room_id: TEST_POST_ROOM_ID
  });
  
  Logger.log(response);
 
}

/*
*  メッセージ系のシナリオテスト
*/
function testRoomMessageScenario() {
  var client = ChatWorkClient.factory({token: API_KEY});
  
  // メッセージ送信
  var response = client.sendMessage({
    room_id: TEST_POST_ROOM_ID,
    body: "ケヒャ、ケヒヒヒヒヒッ！",
    self_unread: 1
  });
  
  Logger.log(response);
  
  // 既読にする
  
}