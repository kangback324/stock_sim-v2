/* 이메일 발신자 정보 */
/* 비밀번호 재설정 기능이 미완이라 현재는 사용되지 않음 */
/* 이 파일도 미완임 */

const nodemailer = require('nodemailer');
const logWithTime = require('../lib/logger');
const generateEmailTemplate = require('./emailTemplate'); // 템플릿 모듈 가져오기

async function sendEmail(recipientEmail, recipientName) {
    try{
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          service: 'gmail', // 이메일 서비스 제공자
          auth: {
            user: 'moijeunggwon@gmail.com',
            pass: 'pass',
          },
        });
        let emailHtml = generateEmailTemplate(recipientName);
        let info = await transporter.sendMail({
          from: 'moijeunggwon@gmail.com',
          to: recipientEmail,  // 수신자 이메일
          subject: '모이증권 계좌 비밀번호 재설정',  // 이메일 제목
          html: emailHtml,  // 동적으로 생성된 HTML 이메일
        });

        logWithTime('Server: EmailSent(messageId): ' + info.messageId);
    } catch(err) {
        logWithTime(err);
    }
}

module.exports = sendEmail;
