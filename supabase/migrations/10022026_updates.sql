-- change graduation_date to end_date in education records
ALTER TABLE education 
RENAME COLUMN graduation_date TO end_date;