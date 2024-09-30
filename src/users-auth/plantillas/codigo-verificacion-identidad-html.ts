export function codigoVerificacionIdentidadHTML(
    appName: string,
    verificationCode: string,
    userName: string,
    supportEmail: string
): string {

    // HTML del correo
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificación de Identidad</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .header img {
                max-width: 100px;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                color: #333;
            }
            .content {
                text-align: left;
                font-size: 16px;
                line-height: 1.6;
            }
            .code {
                background-color: #f8f8f8;
                border: 1px solid #ddd;
                padding: 10px;
                font-size: 24px;
                text-align: center;
                letter-spacing: 2px;
                margin: 20px 0;
                border-radius: 4px;
                color: #333;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 14px;
                color: #777;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                color: #fff;
                background-color: #007bff;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
            }
            .button:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://via.placeholder.com/100" alt="Logo de ${appName}">
                <h1>Verificación de Identidad</h1>
            </div>
            <div class="content">
                <p>Hola ${userName},</p>
                <p>Has solicitado cambiar la contraseña de tu cuenta en <strong>${appName}</strong>. Para confirmar tu identidad y continuar con el proceso, utiliza el siguiente código de verificación:</p>
                <div class="code">${verificationCode}</div>
                <p>Este código es válido por 10 minutos. Si no has solicitado cambiar tu contraseña, por favor ignora este correo.</p>
                <p>¿Cómo utilizar el código de verificación?</p>
                <ol>
                    <li>Copia el código de verificación proporcionado arriba.</li>
                    <li>Pega el código en el formulario de verificación donde se te solicite.</li>
                </ol>
                <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos en <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
                <p>Gracias por utilizar <strong>${appName}</strong>.</p>
            </div>
            <div class="footer">
                <p>Saludos cordiales,<br>El equipo de ${appName}</p>
            </div>
        </div>
    </body>
    </html>
    `

    return htmlContent
}
