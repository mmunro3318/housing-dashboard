-- Add GRE rate and duration settings to system_settings table
-- This extends the existing system_settings with additional voucher configuration

-- Add GRE rate (separate from ERD)
INSERT INTO system_settings (setting_key, setting_value, setting_type, description)
VALUES ('gre_rate', '700.00', 'number', 'GRE (Graduate Re-Entry) monthly voucher rate')
ON CONFLICT (setting_key) DO NOTHING;

-- Add ERD duration (default 6 months)
INSERT INTO system_settings (setting_key, setting_value, setting_type, description)
VALUES ('erd_duration_months', '6', 'number', 'ERD voucher duration in months')
ON CONFLICT (setting_key) DO NOTHING;

-- Add GRE duration (default 6 months)
INSERT INTO system_settings (setting_key, setting_value, setting_type, description)
VALUES ('gre_duration_months', '6', 'number', 'GRE voucher duration in months')
ON CONFLICT (setting_key) DO NOTHING;

-- Rename voucher_rate to erd_rate for clarity
UPDATE system_settings
SET setting_key = 'erd_rate',
    description = 'ERD (Estimated Release Date) monthly voucher rate'
WHERE setting_key = 'voucher_rate';

-- Show all voucher-related settings
SELECT setting_key, setting_value, setting_type, description
FROM system_settings
WHERE setting_key LIKE '%rate%' OR setting_key LIKE '%duration%'
ORDER BY setting_key;
