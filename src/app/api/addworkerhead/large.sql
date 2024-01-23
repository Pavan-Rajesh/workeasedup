
CREATE OR REPLACE FUNCTION your_function_name(required_workers int,latitude float,longitude float,id_owner uuid)
-- here we will be taking the required number of workers and the id of the owner respectively
--   required_workers id_owner
RETURNS void AS $$

DECLARE
     head_workers int;
    --  required_workers int;
     head_id uuid;
     workers_from_head text[];
     individual_workers_array text[];
     workers_count int;
     available_workers int;
     diffworkers int;

    --  latitude float;
    --  longitude float;
    --  id_owner uuid;

BEGIN
    -- consider scenario owner requires 50 workers while head is only having 45 workers and 5 workers should be selected separately
    -- here we have owner id
    -- Assign a value to the variable
    -- required_workers:=3;
    -- latitude:=17.6868159;
    -- longitude:= 83.2184815;
    -- id_owner:='adea4c83-80c2-40dd-9045-d086a9621ca7';

    head_id := null;

    select id into head_id from head where required_workers >= head.noofworkers and ST_DWithin(
            	head.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) order by dateofregister limit 1;

    select noofworkers into available_workers from head where id = head_id;
    diffworkers := required_workers - available_workers;

    if head_id is not null then
            if diffworkers=0 then
              -- here we will be selecting all the workers from the heads
              select workers into workers_from_head from head where id=head_id;
  
              update owners_duplicate set workers=workers_from_head where userid = id_owner;
            else
              select workers into workers_from_head from head where id=head_id;
              update owners_duplicate set workers=workers_from_head where userid = id_owner;

              select ARRAY(select userid from workers  where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) order by dateofregister limit diffworkers ) into individual_workers_array;

              update owners_duplicate set workers = ARRAY_APPEND(workers,(select unnest(individual_workers_array)));

              -- here we will be selecting some of the members from the heads and some of the members from the individual groups
            end if;
    else

            select ARRAY(select userid from workers  where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) order by dateofregister limit diffworkers ) into individual_workers_array;

              update owners_duplicate set workers = ARRAY_APPEND(workers,(select unnest(individual_workers_array)));

            -- here we should write login that we will be selecting the workers individually

    end if;

    -- Your logic using the variable goes here
    -- For example, you can use it in a SELECT statement
    -- SELECT * FROM your_table WHERE some_column = your_variable_name;

    -- Or perform other operations using the variable

END;
$$ LANGUAGE plpgsql;


select your_function_name(2,17.6868159, 83.2184815,'adea4c83-80c2-40dd-9045-d086a9621ca7');



-- DO $$ 
-- DECLARE
--     my_variable text[];
--     workers_from_head text[];
--     head_id int;

-- BEGIN
--             head_id:=null;
--             if head_id is not null then
--             select workers into workers_from_head from head where id='adea4c83-80c2-40dd-9045-d086a9621ca7';
             
--              update owners_duplicate set workers=workers_from_head where userid = 'adea4c83-80c2-40dd-9045-d086a9621ca7';

-- END; 
-- $$ LANGUAGE plpgsql;


-- ALTER TABLE head
-- ADD COLUMN scplace geometry(POINT,4326);


--- next version
--- ???



CREATE OR REPLACE FUNCTION your_function_name(required_workers int,latitude float,longitude float,id_owner uuid,ownerworkType text)
-- here we will be taking the required number of workers and the id of the owner respectively
--   required_workers id_owner
RETURNS void AS $$

DECLARE
     head_workers int;
    --  required_workers int;
     head_id uuid;
     workers_from_head text[];
     individual_workers_array text[];
     workers_count int;
     available_workers int;
     diffworkers int;

    --  latitude float;
    --  longitude float;
    --  id_owner uuid;

BEGIN
    -- consider scenario owner requires 50 workers while head is only having 45 workers and 5 workers should be selected separately
    -- here we have owner id
    -- Assign a value to the variable
    -- required_workers:=3;
    -- latitude:=17.6868159;
    -- longitude:= 83.2184815;
    -- id_owner:='adea4c83-80c2-40dd-9045-d086a9621ca7';

    head_id := null;

    select id into head_id from head where required_workers >= head.noofworkers and ST_DWithin(
            	head.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype order by dateofregister limit 1 ;

    select noofworkers into available_workers from head where id = head_id;
    diffworkers := required_workers - available_workers;

    if head_id is not null then
            if diffworkers=0 then
              -- here we will be selecting all the workers from the heads
              select workers into workers_from_head from head where id=head_id;
  
              update owners_duplicate set workers=workers_from_head where userid = id_owner;
            else
              select workers into workers_from_head from head where id=head_id;
              update owners_duplicate set workers=workers_from_head where userid = id_owner;

              select ARRAY(select userid from workers  where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) order by dateofregister limit diffworkers ) into individual_workers_array;

              update owners_duplicate set workers = ARRAY_APPEND(workers,(select unnest(individual_workers_array)));

              -- here we will be selecting some of the members from the heads and some of the members from the individual groups
            end if;
    else

            select ARRAY(select userid from workers  where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType order by dateofregister limit diffworkers ) into individual_workers_array;

              update owners_duplicate set workers = ARRAY_APPEND(workers,(select unnest(individual_workers_array)));

            -- here we should write login that we will be selecting the workers individually

    end if;

    -- Your logic using the variable goes here
    -- For example, you can use it in a SELECT statement
    -- SELECT * FROM your_table WHERE some_column = your_variable_name;

    -- Or perform other operations using the variable

END;
$$ LANGUAGE plpgsql;


select your_function_name(2,17.6868159, 83.2184815,'adea4c83-80c2-40dd-9045-d086a9621ca7','carpenter');



-- DO $$ 
-- DECLARE
--     my_variable text[];
--     workers_from_head text[];
--     head_id int;

-- BEGIN
--             head_id:=null;
--             if head_id is not null then
--             select workers into workers_from_head from head where id='adea4c83-80c2-40dd-9045-d086a9621ca7';
             
--              update owners_duplicate set workers=workers_from_head where userid = 'adea4c83-80c2-40dd-9045-d086a9621ca7';

-- END; 
-- $$ LANGUAGE plpgsql;


-- ALTER TABLE head
-- ADD COLUMN scplace geometry(POINT,4326);
