<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <style>
        a{
            text-decoration: none;
        }
        p {
            margin: 0 !important;
        }

        .wrapper{
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            align-items: start;
            justify-content: center;
            color: white;
            padding: 1rem;
            background-color: rgb(37,49,100);
        }

        .logo{
            max-height: 75px;
        }

        .button{
            display: flex;
            justify-content: center;
            border-radius: 0.125rem;
            background-color: rgb(233,78,81);
            padding: 0.375rem 0.75rem;
                
            font-weight: 600;
            font-size: 0.9rem;
            color: white;
            box-shadow: 0 0 0.25rem black;

            transition: all 0.3ms ease-in-out;
        }

        .button:hover, .button:focus-within{
            background-color: rgb(203,48,51);
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <img src="{{ asset('assets/images/Cao_Laura_ohneText.png') }}" class="logo" alt="Cao Logo">
        <h2>Hallo {{ $user->name }},</h2>

        <p>Verifizieren Sie bitte Ihre E-Mail-Adresse</p>

        <a href="{{ $url }}" class="button">
            Verify Email
        </a>

        <p>Wenn Sie diese Dienstleistung nicht kennen, k&ouml;nnen Sie diese Nachricht ignorieren.</p>

        <p>
            Mit freundlichen Gr&uuml;&szlig;en
            <br>
            Cáo GmbH
        </p>
    </div>
</body>
</html>