if (undefined ===  ChatWorkClient) {
  var global = (function(){return this})();
  var ChatWorkClient = global;
}

var TEST_POST_ROOM_ID = 127836835;
var API_KEY = PropertiesService.getScriptProperties().getProperty('CW_API_KEY');

function testRoomCRUDScenario() {
  var client = ChatWorkClient.factory({token: API_KEY});
  
  // ルーム情報参照
  var response = client.getRoom({
    room_id: TEST_POST_ROOM_ID
  });
  
  Logger.log(response);
  
}

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