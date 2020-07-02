const express = require ('express');
const cors = require ('cors');
const bodyParser = require ('body-parser');

const app = express ();

app.use (bodyParser.json ());
app.use (express.urlencoded ({extended: false}));
app.use (cors ());

let messages = [
  {
    id: 0,
    from: 'Bart',
    text: 'Welcome to CYF chat system!',
  },
  {
    id: 1,
    from: 'Bani',
    text: 'Gd Afternoon',
  },
  {
    id: 2,
    from: 'Nader',
    text: 'I am having an exercise',
  },
  {
    id: 3,
    from: 'Neil',
    text: 'Hello CYF!',
  },
];

app.get ('/', function (request, response) {
  response.sendFile (__dirname + '/index.html');
});
//  Create a new message
app.post ('/messages/create', (req, res) => {
  const newId = messages.length + 1;
  const newIdExist = messages.find (msg => msg.id === newId);
  if (newIdExist) {
    newId++;
  } else {
    if (req.body.text === '' || req.body.from === '') {
      res.status (400).json ('Please Fill all the form fields, thanks!');
    } else {
      req.body.id = newId;
      messages.push (req.body);
      res
        .status (201)
        .json (` Successfully A new chat with Id number ${newId}  is created.`);
    }
  }
});

//  Read All messages
app.get ('/messages', (req, res) => {
  res.json (messages);
});

//  Read one message specified by an ID
app.get ('/messages/:id', (req, res) => {
  const {id} = req.params;
  const message = messages.find (msg => msg.id === Number (id));
  message ? res.json (message) : res.sendStatus (404);
});

//  Delete a message by ID
app.delete ('/messages/delete/:id', (req, res) => {
  const {id} = req.params;
  const indexToDelete = messages.findIndex (msg => msg.id === Number (id));
  if (indexToDelete) {
    messages.splice (indexToDelete, 1);
    res.sendStatus (204);
  } else {
    res.sendStatus (404);
  }
});

//  update a message by ID
app.put ('/messages/update/:id', (req, res) => {
  const {id} = req.params;

  const updatedMessage = req.body;

  const existingMessage = messages.find (msg => msg.id === Number (id));
  if (existingMessage) {
    const filteredMsg = messages.filter (msg => msg.id !== Number (id));
    messages = filteredMsg;
    messages.push (updatedMessage);
    res.json (`Successfully, A  chat with id number ${id} is updated.`);
  } else {
    res.sendStatus (404);
  }
});

const port = process.env.PORT || 5000;
app.listen (port);
