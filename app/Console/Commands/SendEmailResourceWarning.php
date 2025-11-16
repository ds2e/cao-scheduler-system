<?php

namespace App\Console\Commands;

use App\Enums\UserRoles;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class SendEmailResourceWarning extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send:resource-warning';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // 1. Get all tables status
        $tables = DB::select("SHOW TABLE STATUS");

        // 2. Calculate total size in bytes
        $totalBytes = collect($tables)->sum(function ($table) {
            return $table->Data_length + $table->Index_length;
        });

        // Convert to gigabytes
        $totalGb = $totalBytes / 1024 / 1024 / 1024;

        // Threshold (2GB)
        $thresholdGb = 2;

        if ($totalGb < $thresholdGb) {

            // 3. Get all super admin users
            $superAdmins = User::whereHas('role', function ($query) {
                $query->where('name', UserRoles::SuperAdmin->value);
            })->get();

            // 4. Send emails to each super admin
            foreach ($superAdmins as $admin) {
                Mail::to($admin->email)->send(new \App\Mail\ResourceWarningEmail($totalGb));
            }

            $this->info("Warning emails sent to super admins.");
        } else {
            $this->info("Database size check passed: {$totalGb} GB");
        }
    }
}
