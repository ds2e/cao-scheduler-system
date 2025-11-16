<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <style>
        a{
            text-decoration: none;
        }
        p {
            margin: 1rem 0 !important;
        }

        .wrapper{
            color: white;
            padding: 1rem;
            background-color: rgb(37,49,100);
            width: 100%;
        }

        .logo{
            max-height: 75px;
        }

        .button{
            width: fit-content;
            border-radius: 0.125rem;
            background-color: rgb(233,78,81);
            padding: 0.375rem 0.75rem;
            margin: 1rem 0;
                
            font-weight: 600;
            font-size: 0.9rem;
            color: white;
            box-shadow: 0 0 0.25rem black;

            transition: all 0.3ms ease-in-out;
        }

        .button:hover, .button:focus-within{
            background-color: rgb(203,48,51);
        }

        .highlight{
            color: rgb(233,78,81)
        }
    </style>
</head>
<body>
    <div class="wrapper">
        {{-- <img src="{{ asset('assets/images/Cao_Laura_ohneText.png') }}" class="logo" alt="Cao Logo"> --}}
        <img src="{{ config('app.url') . '/assets/images/Cao_Laura_ohneText.png' }}" class="logo" alt="Cao Logo">
        <p>Hallo Super Admin,</p>

        <p>Der gesamte Datenbankspeicherplatz hat den Schwellenwert überschritten.</p>

        <p><strong>Aktuelle Kapazität:</strong> {{ number_format($sizeGb, 2) }} GB</p>
        <p><strong>Limit:</strong> 2 GB</p>

        <p>Bitte kümmern Sie sich darum.</p>
    </div>
</body>
</html>