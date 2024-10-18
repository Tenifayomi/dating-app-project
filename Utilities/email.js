const nodemailer = require('nodemailer')
const dotenv = require('dotenv').config()



const sendMail = async(to, subject, html)=>{
  const transporter= nodemailer.createTransport({
    service:'gmail',
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
    user:process.env.THE_EMAIL, //Sender gmail address
    pass:process.env.EMAIL_PASSWORD // App pwd from gmail
    } 
}) 

const mailOptions= {
    from:{
        name: "Sex and the City",
        address: process.env.THE_EMAIL
    }, // sender's address
    to,//'ladybeerah00@gmail.com',
    subject,//'Hey Mama',
    html //'<h1>Hello from the other side</h1>'
}

//  const sendMail = async(transporter, mailOptions)=>{
try {
   await transporter.sendMail(mailOptions);
    return res.status(200).json({message:"Email sent successfully"})
   // console.log('Email Sent Successfully');
} catch (error) {
    console.error(error);
    //return res.status(500).json(error.message)
}

//}
}
  //  sendMail(transporter, mailOptions)
  
   module.exports = sendMail
   
// module.exports = {
//     transporter, mailOptions
// }