@echo off
echo Setting up email notifications for MathCenter...
echo.
echo This will configure email notifications to: Jeremiahtetteh2008@gmail.com
echo.
echo Steps to complete setup:
echo 1. Go to your Gmail account settings
echo 2. Enable 2-Step Verification
echo 3. Generate an App Password for "Mail"
echo 4. Edit server.js and replace email credentials
echo.
echo Example configuration in server.js:
echo const transporter = nodemailer.createTransporter({
echo   service: 'gmail',
echo   auth: {
echo     user: 'your-email@gmail.com',
echo     pass: 'your-16-char-app-password'
echo   }
echo });
echo.
echo After setup, every website visitor will trigger an email to Jeremiahtetteh2008@gmail.com
echo.
pause