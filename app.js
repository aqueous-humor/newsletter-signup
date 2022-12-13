//Require modules
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

// Initialize app
const app = express();

// MiddleWare
  //Body Parser
app.use(bodyParser.urlencoded({ extended: true }));

  //Express Static
app.use(express.static("public"));

app.listen(3000, function() {
  console.log("Server is listening on PORT 3000");
})

//Request Handlers
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/signup", function(req, res) {
  // NEW METHOD using client client libraries offered by MailChimp

//   // Import MailChimp library
//     const mailchimp = require("@mailchimp/mailchimp_marketing");
//
//     // Configure mailchimp
//     mailchimp.setConfig({
//       apiKey: "109e4ae8d8df74141f077ebe78e5c6c3-us13",
//       server: "us13"
//     });
//
// // Make the POST request to the API
//
//     const makeRequest = async() => {
//       // const response = await mailchimp.lists.addListMember("f581baca94", {
//       //   email_address: req.body.email,
//       //   status: "subscribed",
//       //   merge_fields: {
//       //     FNAME: req.body.firstName,
//       //     LNAME: req.body.lastName,
//       //   }
//       // });
//       // console.log(JSON.parse(response))
//
//         try {
//           const response = await mailchimp.lists.addListMember("f581baca94", {
//             email_address: req.body.email,
//             status: "subscribed",
//             merge_fields: {
//               FNAME: req.body.firstName,
//               LNAME: req.body.lastName,
//             }
//           });
//           console.log(response);
//         }  catch (e) {
//           console.log(e);
//           // let response =  e.response;
//           // let statusMessage = response.res.statusMessage;
//           // let bodyTitle = response.body.title;
//           // console.log(statusMessage + ": " + bodyTitle);
//       }
//     }
//     makeRequest();


// NOTE: OLD METHOD using traditional method of making HTTP requests

  //Package subscriber data in JSON format to be sent to MailChimp
  const data = {
    members: [
      {
        email_address: req.body.email,
        status: "subscribed",
        merge_fields: {
          FNAME: req.body.firstName,
          LNAME: req.body.lastName,
        }
      }
    ]
  }

  //Flatten JSON object into string
  const dataStr = JSON.stringify(data);

  //Make request to MailChimp API
  const url = "https://us13.api.mailchimp.com/3.0/lists/f581baca94";
  const options = {
    method: "POST",
    auth: "aqueous911:109e4ae8d8df74141f077ebe78e5c6c3-us13"
  }

  const request = https.request(url, options, function(response) {
    // Check that the request was successful, and notify the client
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }


    //Listen on the response event of this request for any 'data'
    // response.on("data", function(data) {
    //   console.log(JSON.parse(data));
    // })
  })

  //Add data received from client to the request
  request.write(dataStr);
  //End request
  request.end();
})

app.post("/failure", function(req, res) {
  res.redirect("/");
})



//API Key
//109e4ae8d8df74141f077ebe78e5c6c3-us13

//List ID
//f581baca94
