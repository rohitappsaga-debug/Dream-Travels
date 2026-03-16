-- Migration: add extra package details fields to packages_data
ALTER TABLE packages_data
  ADD COLUMN duration_days TINYINT UNSIGNED NOT NULL DEFAULT 1 AFTER price,
  ADD COLUMN nights TINYINT UNSIGNED NOT NULL DEFAULT 0 AFTER duration_days,
  ADD COLUMN start_location VARCHAR(255) DEFAULT NULL AFTER nights,
  ADD COLUMN end_location VARCHAR(255) DEFAULT NULL AFTER start_location,
  ADD COLUMN main_transport ENUM('bus','flight','train','cab','cruise','mixed') NOT NULL DEFAULT 'mixed' AFTER end_location,
  ADD COLUMN highlights TEXT DEFAULT NULL AFTER main_transport,
  ADD COLUMN inclusions TEXT DEFAULT NULL AFTER highlights,
  ADD COLUMN exclusions TEXT DEFAULT NULL AFTER inclusions;

