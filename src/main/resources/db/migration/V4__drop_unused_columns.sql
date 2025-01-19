ALTER TABLE revisions 
DROP COLUMN IF EXISTS finished,
DROP COLUMN IF EXISTS last_index,
DROP COLUMN IF EXISTS revision_time,
DROP COLUMN IF EXISTS type,
DROP COLUMN IF EXISTS updated_at,
DROP COLUMN IF EXISTS average_time_percard_seconds,
DROP COLUMN IF EXISTS end_time,
DROP COLUMN IF EXISTS start_time,
DROP COLUMN IF EXISTS total_time_seconds; 