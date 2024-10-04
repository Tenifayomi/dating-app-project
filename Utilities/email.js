const nodemailer = require('nodemailer')

const sendMail = async(to, subject, html)=>{
   const transporter= nodemailer.createTransport({
        host:smtp.gmail.com,
        port:587,
        secure:false,
        auth:{
        user:process.env.THE_EMAIL,
        pass:process.env.EMAIL_PASSWORD
        } 
    }) 

    const options= {
        from:'"Tenifayo" <tenifayo307@gmail.com>',
        to:'ladybeerah00@gmail.com',
        subject:'Hey Mama',
        html: '<h1>Hello from the other side</h1>'
    }
    
   const info = await transporter.sendMail(options, function(err,info){
        if(err){
            console.log('Error occured:', err);
            
        }else{
            console.log('Email sent successfully:', info.response);
        }
    
    })
}

module.exports = {
    sendMail
}