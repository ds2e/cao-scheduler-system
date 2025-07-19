<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendTestEmail extends Command
{
    protected $signature = 'email:test';

    protected $description = 'Send a test email to confirm SMTP is working';

    public function handle()
    {
        Mail::raw('This is a test email from cron.', function ($message) {
            $message->to('your-email@example.com')->subject('Test Email via Cron');
        });

        $this->info('Test email sent.');
    }
}
