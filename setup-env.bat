@echo off
REM ===========================================
REM ReelHaus - Environment Setup Script (Windows)
REM ===========================================
REM This script helps generate secure secrets for your .env.local file

echo 🚀 ReelHaus Environment Setup
echo ==============================
echo.

REM Check if .env.local already exists
if exist ".env.local" (
    echo ⚠️  .env.local already exists!
    set /p overwrite="Do you want to overwrite it? (y/N): "
    if /i not "%overwrite%"=="y" (
        echo ❌ Setup cancelled.
        exit /b 1
    )
)

echo 📝 Generating secure secrets...

REM Generate random secrets using PowerShell
for /f %%i in ('powershell -command "Get-Random -Minimum 1000000000000000 -Maximum 9999999999999999"') do set JWT_SECRET=%%i
for /f %%i in ('powershell -command "Get-Random -Minimum 1000000000000000 -Maximum 9999999999999999"') do set QR_HMAC_SECRET=%%i
for /f %%i in ('powershell -command "Get-Random -Minimum 1000000000000000 -Maximum 9999999999999999"') do set ADMIN_PASSWORD=%%i

echo ✅ Secrets generated successfully!
echo.

REM Create .env.local file
(
echo # ===========================================
echo # ReelHaus - Environment Variables
echo # Generated on %date% %time%
echo # ===========================================
echo.
echo # ===========================================
echo # SUPABASE CONFIGURATION
echo # ===========================================
echo SUPABASE_URL=https://your-project-id.supabase.co
echo SUPABASE_ANON_KEY=your_supabase_anon_key_here
echo SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
echo.
echo # ===========================================
echo # ADMIN AUTHENTICATION
echo # ===========================================
echo ADMIN_USERNAME=admin
echo ADMIN_PASSWORD=%ADMIN_PASSWORD%
echo.
echo # ===========================================
echo # RAZORPAY PAYMENT INTEGRATION
echo # ===========================================
echo RAZORPAY_KEY_ID=rzp_test_your_key_id_here
echo RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
echo RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret_here
echo.
echo # ===========================================
echo # QR CODE SECURITY
echo # ===========================================
echo QR_HMAC_SECRET=%QR_HMAC_SECRET%
echo.
echo # ===========================================
echo # EMAIL SERVICE (SENDGRID)
echo # ===========================================
echo SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
echo.
echo # ===========================================
echo # REDIS CONFIGURATION
echo # ===========================================
echo REDIS_URL=redis://localhost:6379
echo REDIS_HOST=localhost
echo REDIS_PORT=6379
echo REDIS_PASSWORD=your_redis_password_here
echo.
echo # ===========================================
echo # JWT SECRET
echo # ===========================================
echo JWT_SECRET=%JWT_SECRET%
echo.
echo # ===========================================
echo # APPLICATION CONFIGURATION
echo # ===========================================
echo NODE_ENV=development
echo NEXT_PUBLIC_APP_URL=http://localhost:3000
echo.
echo # ===========================================
echo # DEVELOPMENT ONLY
echo # ===========================================
echo NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
) > .env.local

echo 📄 .env.local file created successfully!
echo.
echo 🔐 Generated Admin Credentials:
echo    Username: admin
echo    Password: %ADMIN_PASSWORD%
echo.
echo ⚠️  IMPORTANT: Save these credentials securely!
echo.
echo 📋 Next Steps:
echo 1. Fill in your Supabase credentials
echo 2. Add your Razorpay keys
echo 3. Configure SendGrid API key
echo 4. Set up Redis instance
echo 5. Run database migrations
echo 6. Start the development server: pnpm dev
echo.
echo 🎉 Setup complete! Happy coding!
pause
