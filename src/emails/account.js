const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'k3vin.baxt3r@gmail.com',
        subject: 'Thanks for joining in',
        text: `Welcome to the app,${name} Let me know how you get along with the app.`
    })
}

const sendGoodbyeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'k3vin.baxt3r@gmail.com',
        subject: 'Hate to see you Go',
        text: `Thank you for using the app ${name} `
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}
