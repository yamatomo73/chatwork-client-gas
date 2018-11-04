// ------------------------------
// 実行用コンフィグレーション
// ------------------------------

var API_KEY = PropertiesService.getScriptProperties().getProperty('CW_API_KEY');

var TEST_ACCOUNT_ID = PropertiesService.getScriptProperties().getProperty('TEST_ACCOUNT_ID');;
// TEST_ACCOUNT_ID とコンタクトが繋がっているアカウント２つ
var TEST_CONTACT_ACCOUNT_ID_1 = PropertiesService.getScriptProperties().getProperty('TEST_CONTACT_ACCOUNT_ID_1');;
var TEST_CONTACT_ACCOUNT_ID_2 = PropertiesService.getScriptProperties().getProperty('TEST_CONTACT_ACCOUNT_ID_2');;

// TEST_ACCOUNT_ID が管理者のルーム
var TEST_POST_ROOM_ID =  PropertiesService.getScriptProperties().getProperty('TEST_POST_ROOM_ID');;

function _getChatWorkClient() {
  return factory({token: API_KEY});
}

/*
* 招待リンク削除
*/
function testDeleteRoomLink() {
  var client = _getChatWorkClient();
  
  var response = client.deleteRoomLink({
    room_id: TEST_POST_ROOM_ID,
  });
  Logger.log(response);

  return response;
}

/*
* 招待リンク更新
*/
function testUpdateRoomLink() {
  var client = _getChatWorkClient();
  
  var response = client.updateRoomLink({
    room_id: TEST_POST_ROOM_ID,
    code: 'yasuo-kaigi-update',
    description: 'ほげほげUPDATE',
    need_acceptance: true,
  });
  Logger.log(response);

  return response;
}

/*
* 招待リンク作成
*/
function testCreateRoomLink() {
  var client = _getChatWorkClient();
  
  var response = client.createRoomLink({
    room_id: TEST_POST_ROOM_ID,
    code: 'yasuo-kaigi-kazoku',
    description: 'ほげほげ',
    need_acceptance: false,
  });
  Logger.log(response);

  return response;
}

/*
* ファイル取得
*/
function testRoomFile() {
  var client = _getChatWorkClient();
  
  var room_files = testRoomFiles();
  
  var response = client.getRoomFile({
    room_id: TEST_POST_ROOM_ID,
    file_id: room_files[0].file_id,
    create_download_url: true,
  });
  Logger.log(response);

  return response;
}

/*
* ファイル一覧取得
*/
function testRoomFiles() {
  var client = _getChatWorkClient();
  
  var response = client.getRoomFiles({
    room_id: TEST_POST_ROOM_ID,
    account_id: TEST_ACCOUNT_ID,
  });
  Logger.log(response);
  
  var response = client.getRoomFiles({
    room_id: TEST_POST_ROOM_ID,
  });
  Logger.log(response);

  return response;
}

/*
* ルーム削除
*/
function testDeleteRoom() {
  var client = _getChatWorkClient();

  var response = testCreateRoom();
  
  // ルーム作成
  var response = client.deleteRoom({
    room_id: response.room_id,
  });
  Logger.log(response);
}

/*
* ルーム作成
*/
function testCreateRoom() {
  var client = _getChatWorkClient();

  /*
  // ルーム作成
  var response = client.createRoom({
    name: '✟康夫のホームページへようこそ✟',
    members_admin_ids: [TEST_ACCOUNT_ID],
  });
  Logger.log(response);
  */
  
  // ルーム作成
  var response = client.createRoom({
    name: '✟康夫のおすすめパーツリスト✟',
    members_admin_ids: [TEST_ACCOUNT_ID],
    members_member_ids: [TEST_CONTACT_ACCOUNT_ID_1],
    members_readonly_ids: [TEST_CONTACT_ACCOUNT_ID_2],
    description: 'ケヒャ、ケヒヒヒヒヒッ！',
    icon_preset: 'heart',
    link: 1,
    link_code: 'yasuo-parts',
    link_need_acceptance: true,
  });
  Logger.log(response);
  
  return response;
}

/*
* ルームから退出
*/
function testLeaveRoom() {
  var client = _getChatWorkClient();

  // ルームから退出
  var response = client.leaveRoom({
    room_id: TEST_POST_ROOM_ID,
  });
  Logger.log(response);
  
  return response;
}

/*
* 自分自身の情報
*/
function testGetMe() {
 // var client = _getChatWorkClient();
  var client = factory({token:API_KEY});

  // 取得
  var response = client.getMe();
  Logger.log(response);
  
  return response;
}

/*
* コンタクト承認を拒否
*/
function testCancelIncomingRequest() {
  var client = _getChatWorkClient();

  // 自分へのコンタクト承認依頼一覧取得
  var response = testGetIncomingRequests();
  
  // 承認
  var response = client.cancelIncomingRequest({
    request_id: response[0].request_id,
  });
  Logger.log(response);
  
  return response;
}

/*
* コンタクト承認
*/
function testAcceptIncomingRequest() {
  var client = _getChatWorkClient();

  // 自分へのコンタクト承認依頼一覧取得
  var response = testGetIncomingRequests();
  
  // 承認
  var response = client.acceptIncomingRequest({
    request_id: response[0].request_id,
  });
  Logger.log(response);
  
  return response;
}

/*
* 自分へのコンタクト承認依頼一覧取得
*/
function testGetIncomingRequests() {
  var client = _getChatWorkClient();

  // 自分へのコンタクト承認依頼一覧取得
  var response = client.getIncomingRequests();
  Logger.log(response);
  
  return response;
}

/**
* コンタクト一覧を取得する
*/
function testGetContacts() {
  var client = _getChatWorkClient();

  // 自分のコンタクト一覧取得
  var response = client.getContacts();
  Logger.log(response);
  
  return response;
}

/**
* 自分のタスク一覧を取得する
*/
function testGetMyTasks() {
  var client = _getChatWorkClient();

  //testSendTask();
  
  // 完了していない自分のタスク取得
  var response = client.getMyTasks({
  });
  Logger.log(response);
  
  // 完了している自分のタスク取得
  var response = client.getMyTasks({
    status: 'done',
  });
  Logger.log(response);
  
  return response;
}

/**
* タスク一覧を取得する
*/
function testGetRoomTasks() {
  var client = _getChatWorkClient();

  //testSendTask();
  
  // 完了していないタスク取得
  var response = client.getRoomTasks(TEST_POST_ROOM_ID, {
  });
  Logger.log(response);
  
  // 完了しているタスク取得
  var response = client.getRoomTasks(TEST_POST_ROOM_ID, {
    status: 'done',
  });
  Logger.log(response);
  
  return response;
}

/**
* タスクを追加する
*/
function testSendTask() {
  var client = _getChatWorkClient();

  // 期限なしタスク追加
  var response = client.sendTask({
    room_id: TEST_POST_ROOM_ID,
    body: "ケヒャ、ケヒヒヒヒヒッ！",
    to_ids: [TEST_ACCOUNT_ID],
  });
  Logger.log(response);

  // 期限ありタスク追加
  var response = client.sendTask({
    room_id: TEST_POST_ROOM_ID,
    body: "ケヒャ、ケヒヒヒヒヒッ！",
    to_ids: [TEST_ACCOUNT_ID, TEST_CONTACT_ACCOUNT_ID_1],
    limit: new Date('1998/07/07 01:15:00'),
  });
  Logger.log(response);
  
  return response;
}

/**
* メッセージを削除する
*/
function testDeleteMessages() {
  var client = _getChatWorkClient();

  var send_message = testRoomSendMessage();
  
  // メッセージ更新
  var response = client.updateMessage({
    room_id: TEST_POST_ROOM_ID,
    message_id: send_message.message_id,
    body: "ケヒャ、ケヒヒヒヒヒッ！ 犯人はヤス！！",
  });
  Logger.log(response);

  // メッセージ削除
  var response = client.deleteMessage({
    room_id: TEST_POST_ROOM_ID,
    message_id: send_message.message_id,
  });
  Logger.log(response);
}

/**
* メッセージを更新する
*/
function testUpdateMessages() {
  var client = _getChatWorkClient();

  var send_message = testRoomSendMessage();
  
  // メッセージ更新
  var response = client.updateMessage({
    room_id: TEST_POST_ROOM_ID,
    message_id: send_message.message_id,
    body: "ケヒャ、ケヒヒヒヒヒッ♡　美味しい🍣と🍺",
  });
  Logger.log(response);
}

/**
* メッセージを既読にする
*/
function testUnreadRoomMessages() {
  var client = _getChatWorkClient();

  var room_messages = testGetRoomMessages();
  Logger.log(room_messages[0]);

  // 全件既読
  client.readRoomMessages({
    room_id: TEST_POST_ROOM_ID,
  });
  
  // 直近の１個目を未読にする
  var response = client.unreadRoomMessages({
    room_id: TEST_POST_ROOM_ID,
    'message_id': room_messages[room_messages.length - 1].message_id,
  });
  Logger.log(response);

  // すでに未読になっている場合はエラー 
  var response = client.unreadRoomMessages({
    room_id: TEST_POST_ROOM_ID,
    'message_id': room_messages[room_messages.length - 1].message_id,
  });
  Logger.log(response); // false
}

/**
* メッセージを既読にする
*/
function testReadRoomMessages() {
  var client = _getChatWorkClient();

  // テスト発言１回目
  var response1 = testRoomSendMessage();
  // テスト発言２回目
  testRoomSendMessage();
  // テスト発言３回目
  testRoomSendMessage();
  
  // １個目を既読にする
  var response = client.readRoomMessages({
    room_id: TEST_POST_ROOM_ID,
    'message_id': response1.message_id,
  });
  Logger.log(response);
  
  // 全件既読
  var response = client.readRoomMessages({
    room_id: TEST_POST_ROOM_ID,
  });
  Logger.log(response);

  // すでに既読になっている場合はエラー
  var response = client.readRoomMessages({
    room_id: TEST_POST_ROOM_ID,
    'message_id': response1.message_id,
  });
  Logger.log(response); // false
}

/**
* ルームの未取得メッセージ情報取得
*/
function testGetRoomMessages() {
  var client = _getChatWorkClient();

  // テスト発言
  testRoomSendMessage();
  
  // 情報取得
  var response = client.getRoomMessages({
    room_id: TEST_POST_ROOM_ID,
  });
  //Logger.log(response);
  
  // 情報取得
  var response = client.getRoomMessages({
    room_id: TEST_POST_ROOM_ID,
  });
  //Logger.log(response);  // false
  
  // 強制情報取得
  var response = client.getRoomMessages({
    room_id: TEST_POST_ROOM_ID,
    'force': 1,
  });
  //Logger.log(response);

  return response;
}

/**
* ルーム情報更新
*/
function testUpdateRoom() {
  var client = _getChatWorkClient();
  
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

/**
* ルームメンバー更新
*/
function testUpdateRoomMembers() {
  var client = _getChatWorkClient();
  
  // 管理者だけにする
  var response = client.updateRoomMembers({
    room_id: TEST_POST_ROOM_ID,
    members_admin_ids: [TEST_ACCOUNT_ID],
  });
  
  // メンバー追加する
  var response = client.updateRoomMembers({
    room_id: TEST_POST_ROOM_ID,
    members_admin_ids: [TEST_ACCOUNT_ID, TEST_CONTACT_ACCOUNT_ID_2, TEST_CONTACT_ACCOUNT_ID_1],
  });
  
  // 権限変更
  var response = client.updateRoomMembers({
    room_id: TEST_POST_ROOM_ID,
    members_admin_ids: [TEST_ACCOUNT_ID],
    members_member_ids: [TEST_CONTACT_ACCOUNT_ID_2],
    members_readonly_ids: [TEST_CONTACT_ACCOUNT_ID_1],
  });  
  Logger.log(response);
  
  return response;
}

/*
* ルーム更新系のシナリオテスト
*/
function testRoomCRUDScenario() {
  var client = _getChatWorkClient();
  
  // ルーム情報参照
  var response = client.getRoom({
    room_id: TEST_POST_ROOM_ID
  });
  
  Logger.log(response);
 
}

/*
*  メッセージ系のシナリオテスト
*/
function testRoomSendMessage() {
  var client = _getChatWorkClient();
  
  // メッセージ送信
  var response = client.sendMessage({
    room_id: TEST_POST_ROOM_ID,
    body: "ケヒャ、ケヒヒヒヒヒッ！",
    self_unread: 1
  });
  
  Logger.log(response);
  return response;
}