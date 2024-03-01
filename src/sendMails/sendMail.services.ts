import nodemailer from 'nodemailer'

export async function sendEmail(email: string, verify_token: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  await transporter.sendMail(
    {
      from: `${process.env.EMAIL_USER}`,
      to: `${email}`,
      subject: '[FU-Furniture] Please Verify Your Email',
      html: `<h3>Click <a href="${process.env.DB_HOST}/users/verify-email?token=${verify_token}">here</a> to verify your email</h3>`
    },
    (error) => {
      if (error) {
        console.log(error)
        throw new Error('Error sending email')
      }
    }
  )
}
