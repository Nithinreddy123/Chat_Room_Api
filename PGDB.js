const { Client } = require("pg");

const connectionString =
  "postgressql://postgres:nithin@143@3.7.22.217:5432/postgres";
const client = new Client({
  connectionString: connectionString,
});
client.connect();

class PGDB {
  constructor(props) {
    this.room_name = props;
  }

  getChatHistory(room_name, next) {
    let query = `SELECT history FROM ${room_name}`;
    client.query(query, function (err, res) {
      if (err) {
        console.log(err);
        return 0;
      }
      next(res.rows);
    });
  }

  createRoomTable() {
    let query = `CREATE TABLE ${this.room_name} (id serial NOT NULL,history json NOT NULL)`;
    client.query(query, function (err, res) {
      if (err) {
        console.log(err);
      }
      console.log("table created");
    });
  }

  addChatHistory(msg) {
    //console.log(msg)
    let query = `INSERT INTO ${this.room_name} (history) VALUES('${msg}')`;
    client.query(query, function (err, result) {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      console.log("messeage inserted succesfully");
    });
  }
}
module.exports = PGDB;
