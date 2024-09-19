
/* 이메일에 보내질 템플릿 */

function generateEmailTemplate(recipientName) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                  background-color: #007BFF;
                  color: #ffffff;
                  padding: 20px;
                  text-align: center;
                  border-radius: 8px 8px 0 0;
              }
              .header h1 {
                  margin: 0;
                  font-size: 24px;
              }
              .content {
                  padding: 20px;
              }
              .content h2 {
                  color: #333333;
              }
              .content p {
                  color: #666666;
                  line-height: 1.6;
              }
              .button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #007BFF;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 20px;
              }
              .footer {
                  text-align: center;
                  color: #999999;
                  font-size: 12px;
                  margin-top: 20px;
                  padding: 10px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Welcome to Our Service</h1>
              </div>
              <div class="content">
                  <h2>안녕하세요, ${recipientName}님 !</h2>
                  <p>비밀번호 변경요청을 받아 변경링크를 보내드립니다. 본인이 아닐경우 무시하면 됩니다</p>
                  <a href>비밀번호 변경링크</a>
              </div>
              <div class="footer">
                  <p>&copy; 2024 Your Company. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }
  
  module.exports = generateEmailTemplate;
  