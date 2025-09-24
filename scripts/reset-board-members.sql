-- Reset board members table
-- This script will delete all existing board members and reset the table

DELETE FROM board_members;

-- Reset any sequences if needed (PostgreSQL auto-generates UUIDs, so no sequence reset needed)

-- Verify the table is empty
SELECT COUNT(*) as remaining_records FROM board_members;
