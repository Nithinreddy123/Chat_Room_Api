const PGDB = require("./PGDB");

class Room {
  constructor(room_name) {
    this.room_name = room_name;
    this.conn_pool = [];

    this.pgdb = new PGDB(room_name);
    this.pgdb.createRoomTable();
  }

 async addUser(ws)  {
    //ws.send(JSON.stringify({ type: "history", msgs: this.history })); //send history to joined user
    await this.sendNotification(ws, "joined"); //notify all current users os user joining
    this.pgdb.getChatHistory(this.room_name, function (res) {
      let history = [];
      res.map((item) => history.push(item.history));
      ws.send(JSON.stringify({ type: "history", msgs: history })); //send history to joined user
    });

    this.conn_pool.push(ws); //add user to array of connections
    console.log(this.conn_pool.length);
    console.log("added user");
  };

  async removeUser  (ws) {
    this.conn_pool = this.conn_pool.filter((item) => item.id != ws.id);

    await this.sendNotification(ws, "left");
    console.log("user removed");
  };

  async broadCastMessage (msg, id) {
    // this.history.push(JSON.parse(msg));//
    this.pgdb.addChatHistory(msg);
    // console.log(this.history);
    const removed_curr_client = this.conn_pool.filter((item) => item.id != id); //filter the user who has sent the message
    removed_curr_client.map((item) => item.send(msg));
  };

  async sendNotification  (ws, context)  {
    const payload = { type: "notice", user: ws.name, context: context };
    //this.history.push(payload);
    this.pgdb.addChatHistory(JSON.stringify(payload));
    this.conn_pool.map((item) => item.send(JSON.stringify(payload)));
  };
}

module.exports = Room;
