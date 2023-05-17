-- Step 5.1 - insert Tony Stark into account table
INSERT INTO public.account(
    account_firstname,
    account_lastname,
    account_email,
    account_password
) VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
);

-- Step 5.2 - update account_type for Tony Stark
UPDATE public.account 
SET account_type = 'Admin'
WHERE account_id = 1;

--Step 5.3 - delete Tony Stark from the db
DELETE FROM public.account
WHERE account_id = 1;

--Step 5.4 - update GM Hummer entry
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10 

--Step 5.5 - inner join inventory and classification tables
SELECT inv_make
     , inv_model
     , classification_name
FROM public.inventory i
INNER JOIN public.classification c
ON i.classification_id = c.classification_id
WHERE classification_name = 'Sport';

-- Step 5.6 - replace the img filepaths
UPDATE public.inventory
SET inv_image = REPLACE (
    inv_image,
    '/images',
    '/images/vehicles'),
    inv_thumbnail = REPLACE (
    inv_thumbnail,
    '/images',
    '/images/vehicles');



