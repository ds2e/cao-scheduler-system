<?php

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    Mail::raw('This is a test email from a standalone PHP script.', function ($message) {
        $message->to('1996tungnt@gmail.com')->subject('Test Email from Script');
    });

    echo "✅ Test email sent successfully.\n";
    Log::info('✅ Test email sent successfully via script.');
} catch (\Exception $e) {
    echo "❌ Failed to send email: " . $e->getMessage() . "\n";
    Log::error('❌ Mail send failed: ' . $e->getMessage());
}