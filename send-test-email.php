<?php

use Illuminate\Support\Facades\Mail;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

Mail::raw('This is a test email from a standalone PHP script.', function ($message) {
    $message->to('your-email@example.com')->subject('Test Email from Script');
});

echo "Test email sent.\n";