module.exports.getHtml = (otp) =>{
 return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #333;
        }
        p {
            margin-bottom: 20px;
            line-height: 1.6;
            color: #666;
        }
        .otp {
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #f0f0f0;
            border-radius: 5px;
        }
        .footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ccc;
            text-align: center;
        }
        .footer p {
            margin: 0;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Email Verification:</h2>
        <p>Please use the following OTP to verify your email address at <strong>MailMetrics</strong></p>
        <div class="otp">
            <h3>Your OTP:</h3>
            <p><strong>${otp}</strong></p>
        </div>
        <div class="footer">
            <p>If you didn't request this verification, you can safely ignore this email.</p>
        </div>
    </div>
</body>
</html>`;

    };
