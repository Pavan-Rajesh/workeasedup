
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
    diffworkers:=0;
    head_id := null;

    select id into head_id from head where required_workers <= head.noofworkers and ST_DWithin(
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
	                  300000) and workers.worktype=ownerworkType order by dateofregister limit diffworkers ) into individual_workers_array;

              update owners_duplicate set workers = ARRAY_APPEND(workers,(select unnest(individual_workers_array)));

              -- here we will be selecting some of the members from the heads and some of the members from the individual groups
            end if;
    else

            select ARRAY(select userid from workers  where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType order by dateofregister limit diffworkers ) into individual_workers_array;

              update owners_duplicate set workers = ARRAY_APPEND(workers,(select unnest(individual_workers_array))) set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array) where userid=id_owner;

              if noworkersreq =ARRAY_LENGTH(individual_workers_array,1) then
                                update owners_duplicate set filled='TRUE'

              end if;


            -- here we should write logic that we will be selecting the workers individually

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



/**

------------------ultimate version


CREATE OR REPLACE FUNCTION your_function_name_ver2(required_workers int,latitude float,longitude float,id_owner uuid,ownerworkType text)
-- here we will be taking the required number of workers and the id of the owner respectively
--   required_workers id_owner
RETURNS text AS $$

DECLARE
     head_workers int;
    --  required_workers int;
     head_id uuid;
     workers_from_head text[];
     individual_workers_array text[];
     workers_count int;
     available_workers int;
     diffworkers int;
      output  VARCHAR(20);
    remaining_workers int;
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

    diffworkers:=0;
    head_id := null;

    select id into head_id from head where required_workers <= head.noofworkers and ST_DWithin(
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
	                  300000) and workers.worktype=ownerworkType order by dateofregister limit diffworkers ) into individual_workers_array;

              update owners_duplicate set workers = ARRAY_APPEND(workers,(select unnest(individual_workers_array)));
              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
          
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
              if remaining_workers = 0 then
                                update owners_duplicate set filled='TRUE' where userid=id_owner;
             
 
 


              end if;



              -- here we will be selecting some of the members from the heads and some of the members from the individual groups
            end if;
    else

            select ARRAY(select userid from workers  where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType order by dateofregister limit diffworkers ) into individual_workers_array;

              update owners_duplicate set workers = ARRAY_APPEND(workers,(select unnest(individual_workers_array)));
              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
             SELECT 'Hello World!' INTO output;
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
              if remaining_workers = 0 then
                                update owners_duplicate set filled='TRUE' where userid=id_owner;
             
 
  /* Return the output text variable. */


              end if;


            -- here we should write logic that we will be selecting the workers individually

    end if;

    -- Your logic using the variable goes here
    -- For example, you can use it in a SELECT statement
    -- SELECT * FROM your_table WHERE some_column = your_variable_name;

    -- Or perform other operations using the variable
  RETURN output;
END;
$$ LANGUAGE plpgsql;
select your_function_name_ver2(1,17.6868159,83.2184815,'4adf414f-94a4-4c44-99c7-8347842ef966','carpenter')

-- update owners_duplicate set noworkersreq=1;
*/






_________________________________________________________________________;
version - 4;  - stable

// -- CREATE OR REPLACE FUNCTION your_function_name_ver2(required_workers int,latitude float,longitude float,id_owner uuid,ownerworkType text)
// -- -- here we will be taking the required number of workers and the id of the owner respectively
// -- --   required_workers id_owner
// -- RETURNS text AS $$

// -- DECLARE
// --      head_workers int;
// --     --  required_workers int;
// --      head_id uuid;
// --      workers_from_head text[];
// --      individual_workers_array text[];
// --      workers_count int;
// --      available_workers int;
// --      diffworkers int;
// --       output  VARCHAR(20);
// --     remaining_workers int;
// --     --  latitude float;
// --     --  longitude float;
// --     --  id_owner uuid;

// -- BEGIN
// --     -- consider scenario owner requires 50 workers while head is only having 45 workers and 5 workers should be selected separately
// --     -- here we have owner id
// --     -- Assign a value to the variable
// --     -- required_workers:=3;
// --     -- latitude:=17.6868159;
// --     -- longitude:= 83.2184815;
// --     -- id_owner:='adea4c83-80c2-40dd-9045-d086a9621ca7';

// --     diffworkers:=0;
// --     head_id := null;

// --     select id into head_id from head where required_workers <= head.noofworkers and ST_DWithin(
// --             	head.scplace,
// -- 		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
// -- 	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype order by dateofregister limit 1 ;

// --     select noofworkers into available_workers from head where id = head_id;
// --     diffworkers := required_workers - available_workers;

// --     if head_id is not null then
// --             if diffworkers=0 then
// --               -- here we will be selecting all the workers from the heads

// --               SELECT 'Hello World!' INTO output;

// --               select workers into workers_from_head from head where id=head_id;

// --               update owners_duplicate set workers=workers_from_head,filled=TRUE where userid = id_owner;

// --               update head set isworking=TRUE,owner=id_owner where id=head_id;

// --             else
// --               select workers into workers_from_head from head where id=head_id;
// --               update owners_duplicate set workers=workers_from_head where userid = id_owner;

// --               select ARRAY(select userid from workers  where ST_DWithin(
// --             	workers.scplace,
// -- 		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
// -- 	                  300000) and workers.worktype=ownerworkType order by dateofregister limit diffworkers ) into individual_workers_array;

// --               update owners_duplicate set workers = ARRAY_APPEND(workers,(select unnest(individual_workers_array)));
// --               update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;

// --              select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
// --               if remaining_workers = 0 then
// --                                 update owners_duplicate set filled='TRUE' where userid=id_owner;

// --               end if;

// --               -- here we will be selecting some of the members from the heads and some of the members from the individual groups
// --             end if;
// --     else

// --             select ARRAY(select userid from workers  where ST_DWithin(
// --             	workers.scplace,
// -- 		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
// -- 	                  300000) and workers.worktype=ownerworkType order by dateofregister limit diffworkers ) into individual_workers_array;

// --               update owners_duplicate set workers = ARRAY_APPEND(workers,(select unnest(individual_workers_array)));
// --               update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;

// --              select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
// --               if remaining_workers = 0 then
// --                                 update owners_duplicate set filled='TRUE' where userid=id_owner;

// --   /* Return the output text variable. */

// --               end if;

// --             -- here we should write logic that we will be selecting the workers individually

// --     end if;

// --     -- Your logic using the variable goes here
// --     -- For example, you can use it in a SELECT statement
// --     -- SELECT * FROM your_table WHERE some_column = your_variable_name;

// --     -- Or perform other operations using the variable
// --   RETURN output;
// -- END;
// -- $$ LANGUAGE plpgsql;

// -- select your_function_name_ver2(3,17.6868159,83.2184815,'62f3bfa3-0bc0-4864-9430-30275107252d','carpenter')

// -- -- update owners_duplicate set noworkersreq=1;





_________________________________________________________________________
version -5 ---- experimental


// CREATE OR REPLACE FUNCTION your_function_name_ver2(required_workers int,latitude float,longitude float,id_owner uuid,ownerworkType text)
// -- here we will be taking the required number of workers and the id of the owner respectively
// --   required_workers id_owner
// RETURNS text AS $$

// DECLARE
//      head_workers int;
//     --  required_workers int;
//      head_id uuid;
//      workers_from_head text[];
//      individual_workers_array text[];
//      workers_count int;
//      available_workers int;
//      diffworkers int;
//       output  VARCHAR(20);
//     remaining_workers int;
//     --  latitude float;
//     --  longitude float;
//     --  id_owner uuid;

// BEGIN
//     -- consider scenario owner requires 50 workers while head is only having 45 workers and 5 workers should be selected separately
//     -- here we have owner id
//     -- Assign a value to the variable
//     -- required_workers:=3;
//     -- latitude:=17.6868159;
//     -- longitude:= 83.2184815;
//     -- id_owner:='adea4c83-80c2-40dd-9045-d086a9621ca7';

//     diffworkers:=0;
//     head_id := null;

//     select id into head_id from head where required_workers <= head.noofworkers and ST_DWithin(
//             	head.scplace,
// 		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
// 	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype order by dateofregister limit 1 ;

//     select noofworkers into available_workers from head where id = head_id;
//     diffworkers := required_workers - available_workers;

//     if head_id is not null then
//             if diffworkers=0 then
//               -- here we will be selecting all the workers from the heads

             

//               select workers into workers_from_head from head where id=head_id;
  
//               update owners_duplicate set workers=workers_from_head,filled=TRUE where userid = id_owner;

//               update head set isworking=TRUE,owner=id_owner where id=head_id;

//             else
//               select workers into workers_from_head from head where id=head_id;
//               update owners_duplicate set workers=workers_from_head where userid = id_owner;

//               select ARRAY(select userid from workers  where ST_DWithin(
//             	workers.scplace,
// 		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
// 	                  300000) and workers.worktype=ownerworkType and workers.head=null and workers.owner=null order by dateofregister limit diffworkers ) into individual_workers_array;

//               update owners_duplicate set workers = ARRAY_APPEND(workers,(select unnest(individual_workers_array)));
//               update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
          
//              select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
//               if remaining_workers = 0 then
//                                 update owners_duplicate set filled='TRUE' where userid=id_owner;
             
 
//               SELECT 'Hello World!' INTO output;


//               end if;



//               -- here we will be selecting some of the members from the heads and some of the members from the individual groups
//             end if;
//     else

//             select ARRAY(select userid from workers  where ST_DWithin(
//             	workers.scplace,
// 		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
// 	                  300000) and workers.worktype=ownerworkType order by dateofregister limit diffworkers ) into individual_workers_array;

//               update owners_duplicate set workers = ARRAY_APPEND(workers,(select unnest(individual_workers_array)));
//               update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
      
//              select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
//               if remaining_workers = 0 then
//                                 update owners_duplicate set filled='TRUE' where userid=id_owner;
             
 
//   /* Return the output text variable. */


//               end if;


//             -- here we should write logic that we will be selecting the workers individually

//     end if;

//     -- Your logic using the variable goes here
//     -- For example, you can use it in a SELECT statement
//     -- SELECT * FROM your_table WHERE some_column = your_variable_name;

//     -- Or perform other operations using the variable
//   RETURN output;
// END;
// $$ LANGUAGE plpgsql;



// -- select your_function_name_ver2(3,17.6868159,83.2184815,'62f3bfa3-0bc0-4864-9430-30275107252d','carpenter')





____________________________________________________________________________________

// nextversion

// CREATE OR REPLACE FUNCTION your_function_name_ver3(required_workers int,latitude float,longitude float,id_owner uuid,ownerworkType text)
// -- here we will be taking the required number of workers and the id of the owner respectively
// --   required_workers id_owner
// RETURNS int AS $$

// DECLARE
//      head_workers int;
//     --  required_workers int;
//      head_id uuid;
//      workers_from_head text[];
//      individual_workers_array text[];
//      workers_count int;
//      available_workers int;
//      diffworkers int;
//       output  int;
//     remaining_workers int;
//     headworkerscount int;
//     --  latitude float;
//     --  longitude float;
//     --  id_owner uuid;

// BEGIN
//     -- consider scenario owner requires 50 workers while head is only having 45 workers and 5 workers should be selected separately
//     -- here we have owner id
//     -- Assign a value to the variable
//     -- required_workers:=3;
//     -- latitude:=17.6868159;
//     -- longitude:= 83.2184815;
//     -- id_owner:='adea4c83-80c2-40dd-9045-d086a9621ca7';

//     diffworkers:=0;
//     head_id := null;

//     select id into head_id from head where head.noofworkers<=required_workers and ST_DWithin(
//             	head.scplace,
// 		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
// 	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype order by dateofregister limit 1 ;

//     select noofworkers into available_workers from head where id = head_id;
//     diffworkers := required_workers - available_workers;

//     if head_id is not null then
//             if diffworkers=0 then
//               -- here we will be selecting all the workers from the heads

               

//               select workers into workers_from_head from head where id=head_id;
  
//               update owners_duplicate set workers=workers_from_head,filled=TRUE where userid = id_owner;

//               update head set isworking=TRUE,owner=id_owner where id=head_id;

//             else
                     

//               select workers into workers_from_head from head where id=head_id;
//               update owners_duplicate set workers=workers_from_head where userid = id_owner;
             
//               --- error is here
//               select ARRAY(select userid from workers  where ST_DWithin( 
//             	workers.scplace,
// 		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
// 	                  300000) and workers.worktype=ownerworkType and workers.owner is null and workers.head is null order by dateofregister limit diffworkers ) into individual_workers_array;
//               select count(*) into headworkerscount from head where id=head_id;
//  select headworkerscount into output;
//               update owners_duplicate set workers = ARRAY_APPEND(workers,(select unnest(individual_workers_array)));
//               update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1)-headworkerscount where userid=id_owner;
          
//              select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
//               if remaining_workers = 0 then
//                                 update owners_duplicate set filled='TRUE' where userid=id_owner;
             
 
          


//               end if;



//               -- here we will be selecting some of the members from the heads and some of the members from the individual groups
//             end if;
//     else

//             select ARRAY(select userid from workers  where ST_DWithin(
//             	workers.scplace,
// 		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
// 	                  300000) and workers.worktype=ownerworkType order by dateofregister limit diffworkers ) into individual_workers_array;

//               update owners_duplicate set workers = ARRAY_APPEND(workers,(select unnest(individual_workers_array)));
//               update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
      
//              select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
//               if remaining_workers = 0 then
//                                 update owners_duplicate set filled='TRUE' where userid=id_owner;
             
 
//   /* Return the output text variable. */


//               end if;


//             -- here we should write logic that we will be selecting the workers individually

//     end if;

//     -- Your logic using the variable goes here
//     -- For example, you can use it in a SELECT statement
//     -- SELECT * FROM your_table WHERE some_column = your_variable_name;

//     -- Or perform other operations using the variable
//   RETURN output;
// END;
// $$ LANGUAGE plpgsql;



// select your_function_name_ver3(3,17.6868159,83.2184815,'62f3bfa3-0bc0-4864-9430-30275107252d','carpenter')




-- for iterating over a array of values and updating them

-- do $body$
-- declare
--   arr1 text[];
--   var text;
  
-- begin
  
--   select workers into arr1 from head  where id='6739063e-0782-4b86-b77f-f7241ea56054';
--   foreach var in array arr1 loop
--     update workers set owner='rajesh' where userid=var;
--   end loop;
-- end;
-- $body$;




--- anotjer version




-- CREATE OR REPLACE FUNCTION your_function_name_ver3(required_workers int,latitude float,longitude float,id_owner uuid,ownerworkType text)
-- -- here we will be taking the required number of workers and the id of the owner respectively
-- --   required_workers id_owner
-- RETURNS int AS $$

-- DECLARE
--      head_workers int;
--     --  required_workers int;
--      head_id uuid;
--      workers_from_head text[];
--      individual_workers_array text[];
--      workers_count int;
--      available_workers int;
--      diffworkers int;
--       output  int;
--     remaining_workers int;
--     headworkerscount int;
--     --  latitude float;
--     --  longitude float;
--     --  id_owner uuid;
--     updation_array text[]  --for updating the workers whether they have been assigned for the owner or the head or they are having no work
--     updation_var --for updating the workers whether they have been assigned for the owner or the head or they are having no work


-- BEGIN
--     -- consider scenario owner requires 50 workers while head is only having 45 workers and 5 workers should be selected separately
--     -- here we have owner id
--     -- Assign a value to the variable
--     -- required_workers:=3;
--     -- latitude:=17.6868159;
--     -- longitude:= 83.2184815;
--     -- id_owner:='adea4c83-80c2-40dd-9045-d086a9621ca7';

--     diffworkers:=0;
--     head_id := null;

--     select id into head_id from head where head.noofworkers<=required_workers and ST_DWithin(
--             	head.scplace,
-- 		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
-- 	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype order by dateofregister limit 1 ;

--     select noofworkers into available_workers from head where id = head_id;
--     diffworkers := required_workers - available_workers;

--     if head_id is not null then
--             if diffworkers=0 then
--               -- here we will be selecting all the workers from the heads

               

--               select workers into workers_from_head from head where id=head_id;
  
--               update owners_duplicate set workers=workers_from_head,filled=TRUE where userid = id_owner;

--               update head set isworking=TRUE,owner=id_owner where id=head_id;

--             else
                     

--               select workers into workers_from_head from head where id=head_id;
--               update owners_duplicate set workers=workers_from_head where userid = id_owner;
             
--               --- error is here
--               select ARRAY(select userid from workers  where ST_DWithin( 
--             	workers.scplace,
-- 		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
-- 	                  300000) and workers.worktype=ownerworkType and workers.owner is null and workers.head is null order by dateofregister limit diffworkers ) into individual_workers_array;
--               select count(*) into headworkerscount from head where id=head_id;
--  select headworkerscount into output;
--               update owners_duplicate set workers = ARRAY_APPEND(workers,(select unnest(individual_workers_array)));
--               update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1)-headworkerscount where userid=id_owner;
          
--              select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
--               if remaining_workers = 0 then
--                                 update owners_duplicate set filled='TRUE' where userid=id_owner;
             
 
          


--               end if;



--               -- here we will be selecting some of the members from the heads and some of the members from the individual groups
--             end if;
--     else

--             select ARRAY(select userid from workers  where ST_DWithin(
--             	workers.scplace,
-- 		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
-- 	                  300000) and workers.worktype=ownerworkType order by dateofregister limit diffworkers ) into individual_workers_array;

--               update owners_duplicate set workers = ARRAY_APPEND(workers,(select unnest(individual_workers_array)));
--               update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
      
--              select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
--               if remaining_workers = 0 then
--                                 update owners_duplicate set filled='TRUE' where userid=id_owner;
             
 
--   /* Return the output text variable. */


--               end if;


--             -- here we should write logic that we will be selecting the workers individually

--     end if;

--     -- Your logic using the variable goes here
--     -- For example, you can use it in a SELECT statement
--     -- SELECT * FROM your_table WHERE some_column = your_variable_name;

--     -- Or perform other operations using the variable
--   RETURN output;
-- END;
-- $$ LANGUAGE plpgsql;



-- select your_function_name_ver3(3,17.6868159,83.2184815,'62f3bfa3-0bc0-4864-9430-30275107252d','carpenter')




-- do $body$
-- declare
--   arr1 text[];
--   var text;
  
-- begin
  
--   select workers into arr1 from head  where id='6739063e-0782-4b86-b77f-f7241ea56054';
--   foreach var in array arr1 loop
--     update workers set owner='rajesh' where userid=var;
--   end loop;
-- end;
-- $body$;


_________________________________________________________________________
next version




CREATE OR REPLACE FUNCTION your_function_name_ver3(required_workers int,latitude float,longitude float,id_owner uuid,ownerworkType text)
-- here we will be taking the required number of workers and the id of the owner respectively
--   required_workers id_owner
RETURNS int AS $$

DECLARE
     head_workers int;
    --  required_workers int;
     head_id uuid;
     workers_from_head text[];
     individual_workers_array text[];
     workers_count int;
     available_workers int;
     diffworkers int;
      output  int;
    remaining_workers int;
    headworkerscount int;
    --  latitude float;
    --  longitude float;
    --  id_owner uuid;
    updation_array text[];  --for updating the workers whether they have been assigned for the owner or the head or they are having no work
    updation_var text;--for updating the workers whether they have been assigned for the owner or the head or they are having no work


BEGIN
    -- consider scenario owner requires 50 workers while head is only having 45 workers and 5 workers should be selected separately
    -- here we have owner id
    -- Assign a value to the variable
    -- required_workers:=3;
    -- latitude:=17.6868159;
    -- longitude:= 83.2184815;
    -- id_owner:='adea4c83-80c2-40dd-9045-d086a9621ca7';

    diffworkers:=0;
    head_id := null;

    select id into head_id from head where head.noofworkers<=required_workers and ST_DWithin(
            	head.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype order by dateofregister limit 1 ;

    select noofworkers into available_workers from head where id = head_id;
    diffworkers := required_workers - available_workers;

    if head_id is not null then
            if diffworkers=0 then
              -- here we will be selecting all the workers from the heads

               

              select workers into workers_from_head from head where id=head_id;
  
              update owners_duplicate set workers=workers_from_head,filled=TRUE where userid = id_owner;

              update head set isworking=TRUE,owner=id_owner where id=head_id;

               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
                end loop;


            else
                     

              select workers into workers_from_head from head where id=head_id;
              update owners_duplicate set workers=workers_from_head where userid = id_owner;
               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
              end loop;


             
              --- error is here
              select ARRAY(select userid from workers  where ST_DWithin( 
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType and workers.owner is null and workers.head is null order by dateofregister limit diffworkers ) into individual_workers_array;
              select count(*) into headworkerscount from head where id=head_id;
 select headworkerscount into output;
              update owners_duplicate set workers = ARRAY_APPEND(workers,(select unnest(individual_workers_array)));
              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(workers,1);
          
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
              if remaining_workers = 0 then
                                update owners_duplicate set filled='TRUE' where userid=id_owner;
             
  
            foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner where userid=updation_var;
              end loop;


              end if;



              -- here we will be selecting some of the members from the heads and some of the members from the individual groups
            end if;
    else

            select ARRAY(select userid from workers  where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType order by dateofregister limit diffworkers ) into individual_workers_array;

              update owners_duplicate set workers = ARRAY_APPEND(workers,(select unnest(individual_workers_array)));
              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
      
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
              if remaining_workers = 0 then
                                update owners_duplicate set filled='TRUE' where userid=id_owner;
             
             foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner where userid=updation_var;
              end loop;
 
  /* Return the output text variable. */


              end if;


            -- here we should write logic that we will be selecting the workers individually

    end if;

    -- Your logic using the variable goes here
    -- For example, you can use it in a SELECT statement
    -- SELECT * FROM your_table WHERE some_column = your_variable_name;

    -- Or perform other operations using the variable
  RETURN output;
END;
$$ LANGUAGE plpgsql;



select your_function_name_ver3(3,17.6868159,83.2184815,'62f3bfa3-0bc0-4864-9430-30275107252d','carpenter')




-- do $body$
-- declare
--   arr1 text[];
--   var text;
  
-- begin
  
--   select workers into arr1 from head  where id='6739063e-0782-4b86-b77f-f7241ea56054';
--   foreach var in array arr1 loop
--     update workers set owner='rajesh' where userid=var;
--   end loop;
-- end;
-- $body$;


-- select * from workers where owner is null;



_________________________________________________________________________
another version





CREATE OR REPLACE FUNCTION your_function_name_ver3(required_workers int,latitude float,longitude float,id_owner uuid,ownerworkType text)
-- here we will be taking the required number of workers and the id of the owner respectively
--   required_workers id_owner
RETURNS int AS $$

DECLARE
     head_workers int;
    --  required_workers int;
     head_id uuid;
     workers_from_head text[];
     individual_workers_array text[];
     workers_count int;
     available_workers int;
     diffworkers int;
      output  int;
    remaining_workers int;
    headworkerscount int;
    --  latitude float;
    --  longitude float;
    --  id_owner uuid;
    updation_array text[];  --for updating the workers whether they have been assigned for the owner or the head or they are having no work
    updation_var text;--for updating the workers whether they have been assigned for the owner or the head or they are having no work


BEGIN
    -- consider scenario owner requires 50 workers while head is only having 45 workers and 5 workers should be selected separately
    -- here we have owner id
    -- Assign a value to the variable
    -- required_workers:=3;
    -- latitude:=17.6868159;
    -- longitude:= 83.2184815;
    -- id_owner:='adea4c83-80c2-40dd-9045-d086a9621ca7';

    diffworkers:=0;
    head_id := null;

    select id into head_id from head where head.noofworkers<=required_workers and ST_DWithin(
            	head.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype order by dateofregister limit 1 ;

    select noofworkers into available_workers from head where id = head_id;
    diffworkers := required_workers - available_workers;

    if head_id is not null then
            if diffworkers=0 then
              -- here we will be selecting all the workers from the heads

               

              select workers into workers_from_head from head where id=head_id;
  
              update owners_duplicate set headworkers=workers_from_head,filled=TRUE,head=head_id where userid = id_owner;

              update head set isworking=TRUE,owner=id_owner,isworking=TRUE,avalforwork=FALSE where id=head_id;

               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
                end loop;


            else
                     

              select workers into workers_from_head from head where id=head_id;
              update owners_duplicate set headworkers=workers_from_head,head=head_id where userid = id_owner;
               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
              end loop;


             
              --- error is here
              select ARRAY(select userid from workers  where ST_DWithin( 
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType and workers.owner is null and workers.head is null order by dateofregister limit diffworkers ) into individual_workers_array;
              select count(*) into headworkerscount from head where id=head_id;
 select headworkerscount into output;

              update owners_duplicate set workers = ARRAY_APPEND(workers,(select unnest(individual_workers_array)));
              -- update owners_duplicate set workers = individual_workers_array;

              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(workers,1)-ARRAY_LENGTH(headworkers,1);
          
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
              if remaining_workers = 0 then
                                update owners_duplicate set filled='TRUE' where userid=id_owner;
             
  
         
              end if;
                 foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner where userid=updation_var;
              end loop;

update head set isworking=TRUE,owner=id_owner,avalforwork=FALSE where id=head_id;



              -- here we will be selecting some of the members from the heads and some of the members from the individual groups
            end if;
    else

            select ARRAY(select userid from workers  where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType order by dateofregister limit diffworkers ) into individual_workers_array;

              update owners_duplicate set workers = ARRAY_APPEND(workers,(select unnest(individual_workers_array)));
              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
      
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
              if remaining_workers = 0 then
                                update owners_duplicate set filled='TRUE' where userid=id_owner;
             
             foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner where userid=updation_var;
              end loop;
 
  /* Return the output text variable. */


              end if;


            -- here we should write logic that we will be selecting the workers individually

    end if;

    -- Your logic using the variable goes here
    -- For example, you can use it in a SELECT statement
    -- SELECT * FROM your_table WHERE some_column = your_variable_name;

    -- Or perform other operations using the variable
  RETURN output;
END;
$$ LANGUAGE plpgsql;



select your_function_name_ver3(3,17.6868159,83.2184815,'62f3bfa3-0bc0-4864-9430-30275107252d','carpenter')




-- do $body$
-- declare
--   arr1 text[];
--   var text;
  
-- begin
  
--   select workers into arr1 from head  where id='6739063e-0782-4b86-b77f-f7241ea56054';
--   foreach var in array arr1 loop
--     update workers set owner='rajesh' where userid=var;
--   end loop;
-- end;
-- $body$;


-- select * from workers where owner is null;




CREATE OR REPLACE FUNCTION your_function_name_ver3(required_workers int,latitude float,longitude float,id_owner uuid,ownerworkType text)
-- here we will be taking the required number of workers and the id of the owner respectively
--   required_workers id_owner
RETURNS int AS $$

DECLARE
     head_workers int;
    --  required_workers int;
     head_id uuid;
     workers_from_head text[];
     individual_workers_array text[];
     workers_count int;
     available_workers int;
     diffworkers int;
      output  int;
    remaining_workers int;
    headworkerscount int;
    --  latitude float;
    --  longitude float;
    --  id_owner uuid;
    updation_array text[];  --for updating the workers whether they have been assigned for the owner or the head or they are having no work
    updation_var text;--for updating the workers whether they have been assigned for the owner or the head or they are having no work


BEGIN
    -- consider scenario owner requires 50 workers while head is only having 45 workers and 5 workers should be selected separately
    -- here we have owner id
    -- Assign a value to the variable
    -- required_workers:=3;
    -- latitude:=17.6868159;
    -- longitude:= 83.2184815;
    -- id_owner:='adea4c83-80c2-40dd-9045-d086a9621ca7';

    diffworkers:=0;
    head_id := null;

    select id into head_id from head where head.noofworkers<=required_workers and ST_DWithin(
            	head.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype order by dateofregister limit 1 ;

    select noofworkers into available_workers from head where id = head_id;
    diffworkers := required_workers - available_workers;

    if head_id is not null then
            if diffworkers=0 then
              -- here we will be selecting all the workers from the heads

               

              select workers into workers_from_head from head where id=head_id;
  
              update owners_duplicate set headworkers=workers_from_head,filled=TRUE,head=head_id where userid = id_owner;

              update head set isworking=TRUE,owner=id_owner,isworking=TRUE,avalforwork=FALSE where id=head_id;

               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
                end loop;


            else
                     

              select workers into workers_from_head from head where id=head_id;
              update owners_duplicate set headworkers=workers_from_head,head=head_id where userid = id_owner;
               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
              end loop;


             
              --- error is here
              select ARRAY(select userid from workers  where ST_DWithin( 
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType and workers.owner is null and workers.head is null order by dateofregister limit diffworkers ) into individual_workers_array;
              select count(*) into headworkerscount from head where id=head_id;
 select headworkerscount into output;

              update owners_duplicate set workers = ARRAY_APPEND(workers,(select unnest(individual_workers_array)));
              -- update owners_duplicate set workers = individual_workers_array;

              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(workers,1)-ARRAY_LENGTH(headworkers,1);
          
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
              if remaining_workers = 0 then
                                update owners_duplicate set filled='TRUE' where userid=id_owner;
              end if;
                 foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner where userid=updation_var;
              end loop;

update head set isworking=TRUE,owner=id_owner,avalforwork=FALSE where id=head_id;



              -- here we will be selecting some of the members from the heads and some of the members from the individual groups
            end if;
    else

            select ARRAY(select userid from workers  where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType order by dateofregister limit diffworkers ) into individual_workers_array;

              -- update owners_duplicate set workers = ARRAY_APPEND(workers,ARRAY(select unnest(individual_workers_array)));
              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array));

              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
      
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
              if remaining_workers = 0 then
                                update owners_duplicate set filled='TRUE' where userid=id_owner;
             
             foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner where userid=updation_var;
              end loop;
 
  /* Return the output text variable. */


              end if;


            -- here we should write logic that we will be selecting the workers individually

    end if;

    -- Your logic using the variable goes here
    -- For example, you can use it in a SELECT statement
    -- SELECT * FROM your_table WHERE some_column = your_variable_name;

    -- Or perform other operations using the variable
  RETURN output;
END;
$$ LANGUAGE plpgsql;


select your_function_name_ver3(3,17.6581156,83.1970511 ,'62f3bfa3-0bc0-4864-9430-30275107252d','carpenter')




CREATE OR REPLACE FUNCTION your_function_name_ver3(required_workers int,latitude float,longitude float,id_owner uuid,ownerworkType text)
-- here we will be taking the required number of workers and the id of the owner respectively
--   required_workers id_owner
RETURNS int AS $$

DECLARE
     head_workers int;
    --  required_workers int;
     head_id uuid;
     workers_from_head text[];
     individual_workers_array text[];
     workers_count int;
     available_workers int;
     diffworkers int;
      output  int;
    remaining_workers int;
    headworkerscount int;
    --  latitude float;
    --  longitude float;
    --  id_owner uuid;
    updation_array text[];  --for updating the workers whether they have been assigned for the owner or the head or they are having no work
    updation_var text;--for updating the workers whether they have been assigned for the owner or the head or they are having no work


BEGIN
    -- consider scenario owner requires 50 workers while head is only having 45 workers and 5 workers should be selected separately
    -- here we have owner id
    -- Assign a value to the variable
    -- required_workers:=3;
    -- latitude:=17.6868159;
    -- longitude:= 83.2184815;
    -- id_owner:='adea4c83-80c2-40dd-9045-d086a9621ca7';

    diffworkers:=0;
    head_id := null;

    select id into head_id from head where head.noofworkers<=required_workers and ST_DWithin(
            	head.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype order by dateofregister limit 1 ;

    select noofworkers into available_workers from head where id = head_id;
    diffworkers := required_workers - available_workers;

    if head_id is not null then
            if diffworkers=0 then
              -- here we will be selecting all the workers from the heads

               

              select workers into workers_from_head from head where id=head_id;
  
              update owners_duplicate set headworkers=workers_from_head,filled=TRUE,head=head_id,noworkersreq=0 where userid = id_owner;

              update head set isworking=TRUE,owner=id_owner,avalforwork=FALSE where id=head_id;

               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
                end loop;


            else
                     

              select workers into workers_from_head from head where id=head_id;
              update owners_duplicate set headworkers=workers_from_head,head=head_id where userid = id_owner;
               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
              end loop;


             
              --- error is here
              select ARRAY(select userid from workers  where ST_DWithin( 
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType and workers.owner is null and workers.head is null order by dateofregister limit diffworkers ) into individual_workers_array;
              select count(*) into headworkerscount from head where id=head_id;
 select headworkerscount into output;

              update owners_duplicate set workers = ARRAY_APPEND(workers,(select unnest(individual_workers_array)));
              -- update owners_duplicate set workers = individual_workers_array;

              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(workers,1)-ARRAY_LENGTH(headworkers,1);
          
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
              if remaining_workers = 0 then
                                update owners_duplicate set filled='TRUE' where userid=id_owner;
              end if;
                 foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner where userid=updation_var;
              end loop;

update head set isworking=TRUE,owner=id_owner,avalforwork=FALSE where id=head_id;



              -- here we will be selecting some of the members from the heads and some of the members from the individual groups
            end if;
    else

            select ARRAY(select userid from workers  where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType order by dateofregister limit diffworkers ) into individual_workers_array;

              -- update owners_duplicate set workers = ARRAY_APPEND(workers,ARRAY(select unnest(individual_workers_array)));
              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array));

              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
      
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
              if remaining_workers = 0 then
                                update owners_duplicate set filled='TRUE' where userid=id_owner;
             
             foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner where userid=updation_var;
              end loop;
 
  /* Return the output text variable. */


              end if;


            -- here we should write logic that we will be selecting the workers individually

    end if;

    -- Your logic using the variable goes here
    -- For example, you can use it in a SELECT statement
    -- SELECT * FROM your_table WHERE some_column = your_variable_name;

    -- Or perform other operations using the variable
  RETURN output;
END;
$$ LANGUAGE plpgsql;


select your_function_name_ver3(3,17.6581156,83.1970511 ,'62f3bfa3-0bc0-4864-9430-30275107252d','carpenter')






CREATE OR REPLACE FUNCTION your_function_name_ver3(required_workers int,latitude float,longitude float,id_owner uuid,ownerworkType text)
-- here we will be taking the required number of workers and the id of the owner respectively
--   required_workers id_owner
RETURNS int AS $$

DECLARE
     head_workers int;
    --  required_workers int;
     head_id uuid;
     workers_from_head text[];
     individual_workers_array text[];
     workers_count int;
     available_workers int;
     diffworkers int;
      output  int;
    remaining_workers int;
    headworkerscount int;
    --  latitude float;
    --  longitude float;
    --  id_owner uuid;
    updation_array text[];  --for updating the workers whether they have been assigned for the owner or the head or they are having no work
    updation_var text;--for updating the workers whether they have been assigned for the owner or the head or they are having no work


BEGIN
    -- consider scenario owner requires 50 workers while head is only having 45 workers and 5 workers should be selected separately
    -- here we have owner id
    -- Assign a value to the variable
    -- required_workers:=3;
    -- latitude:=17.6868159;
    -- longitude:= 83.2184815;
    -- id_owner:='adea4c83-80c2-40dd-9045-d086a9621ca7';

    diffworkers:=0;
    head_id := null;

    select id into head_id from head where head.noofworkers<=required_workers and ST_DWithin(
            	head.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype order by dateofregister limit 1 ;

    select noofworkers into available_workers from head where id = head_id;
    diffworkers := required_workers - available_workers;

    if head_id is not null then
            if diffworkers=0 then
              -- here we will be selecting all the workers from the heads

               

              select workers into workers_from_head from head where id=head_id;
  
              update owners_duplicate set headworkers=workers_from_head,filled=TRUE,head=head_id,noworkersreq=0 where userid = id_owner;

              update head set isworking=TRUE,owner=id_owner,avalforwork=FALSE where id=head_id;

               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
                end loop;

 select diffworkers into output;
            else
                     

              select workers into workers_from_head from head where id=head_id;
              update owners_duplicate set headworkers=workers_from_head,head=head_id where userid = id_owner;
               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
              end loop;


             
              --- error is here
              select ARRAY(select userid from workers  where ST_DWithin( 
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType and workers.owner is null and workers.head is null order by dateofregister limit diffworkers ) into individual_workers_array;
              select count(*) into headworkerscount from head where id=head_id;


              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array));
              -- update owners_duplicate set workers = individual_workers_array;

              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(workers,1)-ARRAY_LENGTH(headworkers,1);
          
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
              if remaining_workers = 0 then
                                update owners_duplicate set filled='TRUE' where userid=id_owner;
              end if;
                 foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner where userid=updation_var;
              end loop;

update head set isworking=TRUE,owner=id_owner,avalforwork=FALSE where id=head_id;



              -- here we will be selecting some of the members from the heads and some of the members from the individual groups
            end if;
    else

            select ARRAY(select userid from workers  where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType order by dateofregister limit diffworkers ) into individual_workers_array;

              -- update owners_duplicate set workers = ARRAY_APPEND(workers,ARRAY(select unnest(individual_workers_array)));
              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array));

              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
      
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
              if remaining_workers = 0 then
                                update owners_duplicate set filled='TRUE' where userid=id_owner;
             
             foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner where userid=updation_var;
              end loop;
 
  /* Return the output text variable. */


              end if;


            -- here we should write logic that we will be selecting the workers individually

    end if;

    -- Your logic using the variable goes here
    -- For example, you can use it in a SELECT statement
    -- SELECT * FROM your_table WHERE some_column = your_variable_name;

    -- Or perform other operations using the variable
  RETURN output;
END;
$$ LANGUAGE plpgsql;


-- select your_function_name_ver3(3,17.6581156,83.1970511 ,'62f3bfa3-0bc0-4864-9430-30275107252d','carpenter')










CREATE OR REPLACE FUNCTION your_function_name_ver3(required_workers int,latitude float,longitude float,id_owner uuid,ownerworkType text)
-- here we will be taking the required number of workers and the id of the owner respectively
--   required_workers id_owner
RETURNS int AS $$

DECLARE
     head_workers int;
    --  required_workers int;
     head_id uuid;
     workers_from_head text[];
     individual_workers_array text[];
     workers_count int;
     available_workers int;
     diffworkers int;
      output  int;
    remaining_workers int;
    headworkerscount int;
    --  latitude float;
    --  longitude float;
    --  id_owner uuid;
    updation_array text[];  --for updating the workers whether they have been assigned for the owner or the head or they are having no work
    updation_var text;--for updating the workers whether they have been assigned for the owner or the head or they are having no work


BEGIN
    -- consider scenario owner requires 50 workers while head is only having 45 workers and 5 workers should be selected separately
    -- here we have owner id
    -- Assign a value to the variable
    -- required_workers:=3;
    -- latitude:=17.6868159;
    -- longitude:= 83.2184815;
    -- id_owner:='adea4c83-80c2-40dd-9045-d086a9621ca7';

    diffworkers:=0;
    head_id := null;

    select id into head_id from head where head.noofworkers<=required_workers and ST_DWithin(
            	head.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype order by dateofregister limit 1 ;

    select noofworkers into available_workers from head where id = head_id;
    diffworkers := required_workers - available_workers;

    if head_id is not null then
            if diffworkers=0 then
              -- here we will be selecting all the workers from the heads

               

              select workers into workers_from_head from head where id=head_id;
  
              update owners_duplicate set headworkers=workers_from_head,head=head_id,noworkersreq=0,pending=available_workers where userid = id_owner;
              -- update owners_duplicate set headworkers=workers_from_head,filled=TRUE,head=head_id,noworkersreq=0 where userid = id_owner; 6-2024


              -- update head set isworking=TRUE,owner=id_owner,avalforwork=FALSE where id=head_id; 6-2024
              update head set owner=id_owner,status='pending' where id=head_id;


               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
                end loop;

 select diffworkers into output;
            else
                     

              select workers into workers_from_head from head where id=head_id;
              update owners_duplicate set headworkers=workers_from_head,head=head_id where userid = id_owner;
               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
              end loop;


             
              --- error is here
              select ARRAY(select userid from workers  where ST_DWithin( 
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType and workers.owner is null and workers.head is null order by dateofregister limit diffworkers ) into individual_workers_array;
              select count(*) into headworkerscount from head where id=head_id;


              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array));
              -- update owners_duplicate set workers = individual_workers_array;

              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(workers,1)-ARRAY_LENGTH(headworkers,1);
          
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
              if remaining_workers = 0 then
                                update owners_duplicate set filled='TRUE' where userid=id_owner;
              end if;
                 foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner where userid=updation_var;
              end loop;

update head set isworking=TRUE,owner=id_owner,avalforwork=FALSE where id=head_id;



              -- here we will be selecting some of the members from the heads and some of the members from the individual groups
            end if;
    else

            select ARRAY(select userid from workers  where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType order by dateofregister limit diffworkers ) into individual_workers_array;

              -- update owners_duplicate set workers = ARRAY_APPEND(workers,ARRAY(select unnest(individual_workers_array)));
              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array));

              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
      
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
              if remaining_workers = 0 then
                                update owners_duplicate set filled='TRUE' where userid=id_owner;
             
             foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner where userid=updation_var;
              end loop;
 
  /* Return the output text variable. */


              end if;


            -- here we should write logic that we will be selecting the workers individually

    end if;

    -- Your logic using the variable goes here
    -- For example, you can use it in a SELECT statement
    -- SELECT * FROM your_table WHERE some_column = your_variable_name;

    -- Or perform other operations using the variable
  RETURN output;
END;
$$ LANGUAGE plpgsql;


-- select your_function_name_ver3(2,17.6581156,83.1970511 ,'62f3bfa3-0bc0-4864-9430-30275107252d','carpenter')

--aceept head if the head gets accepted


-- create
-- or replace function acceptHead (headid text, ownerid text) returns void as $$
-- DECLARE
--     head_workers_array text[];
--     head_workers_count int;
--     no_workersreq_updated int;
-- BEGIN

--         update head set status='accepted',isworking=TRUE,avalforwork=FALSE;
--         select noofworkers into head_workers_count from head where id=headid;
--         update owners_duplicate set noworkersreq=noworkersreq-head_workers_count,pending=pending-head_workers_count,accepted=accepted+head_workers_count;
--         select noworkersreq into no_workersreq_updated from owners_duplicate where userid=ownerid;
--         if(no_workersreq_updated=0) then

--               update owners_duplicate set filled=TRUE where userid=ownerid;

--         end if;


-- END;
-- $$ language plpgsql;






------------------------




CREATE OR REPLACE FUNCTION your_function_name_ver3(required_workers int,latitude float,longitude float,id_owner uuid,ownerworkType text)
-- here we will be taking the required number of workers and the id of the owner respectively
--   required_workers id_owner
RETURNS int AS $$

DECLARE
     head_workers int;
    --  required_workers int;
     head_id uuid;
     workers_from_head text[];
     individual_workers_array text[];
     workers_count int;
     available_workers int;
     diffworkers int;
      output  int;
    remaining_workers int;
    headworkerscount int;
    --  latitude float;
    --  longitude float;
    --  id_owner uuid;
    updation_array text[];  --for updating the workers whether they have been assigned for the owner or the head or they are having no work
    updation_var text;--for updating the workers whether they have been assigned for the owner or the head or they are having no work


BEGIN
    -- consider scenario owner requires 50 workers while head is only having 45 workers and 5 workers should be selected separately
    -- here we have owner id
    -- Assign a value to the variable
    -- required_workers:=3;
    -- latitude:=17.6868159;
    -- longitude:= 83.2184815;
    -- id_owner:='adea4c83-80c2-40dd-9045-d086a9621ca7';

    diffworkers:=0;
    head_id := null;

    select id into head_id from head where head.noofworkers<=required_workers and ST_DWithin(
            	head.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype order by dateofregister limit 1 ;

    select noofworkers into available_workers from head where id = head_id;
    diffworkers := required_workers - available_workers;

    if head_id is not null then
            if diffworkers=0 then
              -- here we will be selecting all the workers from the heads

               

              select workers into workers_from_head from head where id=head_id;
  
              update owners_duplicate set headworkers=workers_from_head,head=head_id,noworkersreq=0,pending=available_workers where userid = id_owner;
              -- update owners_duplicate set headworkers=workers_from_head,filled=TRUE,head=head_id,noworkersreq=0 where userid = id_owner; 6-2024


              -- update head set isworking=TRUE,owner=id_owner,avalforwork=FALSE where id=head_id; 6-2024
              update head set owner=id_owner,status='pending' where id=head_id;


               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
                end loop;

 select diffworkers into output;
            else
                     

              select workers into workers_from_head from head where id=head_id;
              update owners_duplicate set headworkers=workers_from_head,head=head_id where userid = id_owner;
               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
              end loop;


             
              --- error is here
              select ARRAY(select userid from workers  where ST_DWithin( 
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType and workers.owner is null and workers.head is null order by dateofregister limit diffworkers ) into individual_workers_array;
              select count(*) into headworkerscount from head where id=head_id;


              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array));
              -- update owners_duplicate set workers = individual_workers_array;

              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(workers,1)-ARRAY_LENGTH(headworkers,1);
          
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
              if remaining_workers = 0 then
                                update owners_duplicate set filled='TRUE' where userid=id_owner;
              end if;
                 foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner where userid=updation_var;
              end loop;

update head set isworking=TRUE,owner=id_owner,avalforwork=FALSE where id=head_id;



              -- here we will be selecting some of the members from the heads and some of the members from the individual groups
            end if;
    else

            select ARRAY(select userid from workers  where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType order by dateofregister limit diffworkers ) into individual_workers_array;

              -- update owners_duplicate set workers = ARRAY_APPEND(workers,ARRAY(select unnest(individual_workers_array)));
              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array));

              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
      
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
              if remaining_workers = 0 then
                                update owners_duplicate set filled='TRUE' where userid=id_owner;
             
             foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner where userid=updation_var;
              end loop;
 
  /* Return the output text variable. */


              end if;


            -- here we should write logic that we will be selecting the workers individually

    end if;

    -- Your logic using the variable goes here
    -- For example, you can use it in a SELECT statement
    -- SELECT * FROM your_table WHERE some_column = your_variable_name;

    -- Or perform other operations using the variable
  RETURN output;
END;
$$ LANGUAGE plpgsql;


-- select your_function_name_ver3(2,17.6581156,83.1970511 ,'62f3bfa3-0bc0-4864-9430-30275107252d','carpenter')



create
or replace function acceptHead (headid text, ownerid text) returns void as $$
DECLARE
    head_workers_array text[];
    head_workers_count int;
    no_workersreq_updated int;
BEGIN

        update head set status='accepted',isworking=TRUE,avalforwork=FALSE;
        select noofworkers into head_workers_count from head where id=headid::uuid;
        update owners_duplicate set pending=pending-head_workers_count,accepted=accepted+head_workers_count where userid=ownerid::uuid;
        select noworkersreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        if(no_workersreq_updated=0) then

              update owners_duplicate set filled=TRUE where userid=ownerid::uuid;

        end if;


END;
$$ language plpgsql;


create
or replace function rejectHead(headid text, ownerid text) returns void as $$
DECLARE
    head_workers_array text[];
    head_workers_count int;
    no_workersreq_updated int;
BEGIN
        select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        update head set status='pending',owner=null where id=headid::uuid;
        update owners_duplicate set pending=0,accepted=0,head=null,headworkers=null,noworkersreq=no_workersreq_updated  where userid=ownerid::uuid;
END;
$$ language plpgsql;





CREATE OR REPLACE FUNCTION your_function_name_ver3(required_workers int,latitude float,longitude float,id_owner uuid,ownerworkType text)
-- here we will be taking the required number of workers and the id of the owner respectively
--   required_workers id_owner
RETURNS int AS $$

DECLARE
     head_workers int;
    --  required_workers int;
     head_id uuid;
     workers_from_head text[];
     individual_workers_array text[];
     workers_count int;
     available_workers int;
     diffworkers int;
      output  int;
    remaining_workers int;
    headworkerscount int;
    --  latitude float;
    --  longitude float;
    --  id_owner uuid;
    updation_array text[];  --for updating the workers whether they have been assigned for the owner or the head or they are having no work
    updation_var text;--for updating the workers whether they have been assigned for the owner or the head or they are having no work


BEGIN
    -- consider scenario owner requires 50 workers while head is only having 45 workers and 5 workers should be selected separately
    -- here we have owner id
    -- Assign a value to the variable
    -- required_workers:=3;
    -- latitude:=17.6868159;
    -- longitude:= 83.2184815;
    -- id_owner:='adea4c83-80c2-40dd-9045-d086a9621ca7';

    diffworkers:=0;
    head_id := null;

    select id into head_id from head where head.noofworkers<=required_workers and ST_DWithin(
            	head.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype order by dateofregister limit 1 ;

    select noofworkers into available_workers from head where id = head_id;
    diffworkers := required_workers - available_workers;

    if head_id is not null then
            if diffworkers=0 then
              -- here we will be selecting all the workers from the heads

               

              select workers into workers_from_head from head where id=head_id;
  
              update owners_duplicate set headworkers=workers_from_head,head=head_id,noworkersreq=0,pending=available_workers where userid = id_owner;
              -- update owners_duplicate set headworkers=workers_from_head,filled=TRUE,head=head_id,noworkersreq=0 where userid = id_owner; 6-2024


              -- update head set isworking=TRUE,owner=id_owner,avalforwork=FALSE where id=head_id; 6-2024
              update head set owner=id_owner,status='pending' where id=head_id;


               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
                end loop;

 select diffworkers into output;
            else
                     

              select workers into workers_from_head from head where id=head_id;
              update owners_duplicate set headworkers=workers_from_head,head=head_id,pending=pending+ARRAY_LENGTH(workers_from_head,1) where userid = id_owner;
               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id,status='pending' where userid=updation_var;
              end loop;


             
              --- error is here
              select ARRAY(select userid from workers  where ST_DWithin( 
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType and workers.owner is null and workers.head is null order by dateofregister limit diffworkers ) into individual_workers_array;
              select count(*) into headworkerscount from head where id=head_id;


              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array)),pending=pending+ARRAY_LENGTH(individual_workers_array);
              -- update owners_duplicate set workers = individual_workers_array;

              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(workers,1)-ARRAY_LENGTH(headworkers,1);
          
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
        --       if remaining_workers = 0 then
        --                         update owners_duplicate set filled='TRUE' where userid=id_owner;
        --       end if;
                 foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner,status='pending' where userid=updation_var;
              end loop;

                
             update head set owner=id_owner where id=head_id;



              -- here we will be selecting some of the members from the heads and some of the members from the individual groups
            end if;
    else

            select ARRAY(select userid from workers  where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType order by dateofregister limit diffworkers ) into individual_workers_array;

              -- update owners_duplicate set workers = ARRAY_APPEND(workers,ARRAY(select unnest(individual_workers_array)));
              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array));

              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
      
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
              if remaining_workers = 0 then
                                update owners_duplicate set filled='TRUE' where userid=id_owner;
             
             foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner where userid=updation_var;
              end loop;
 
  /* Return the output text variable. */


              end if;


            -- here we should write logic that we will be selecting the workers individually

    end if;

    -- Your logic using the variable goes here
    -- For example, you can use it in a SELECT statement
    -- SELECT * FROM your_table WHERE some_column = your_variable_name;

    -- Or perform other operations using the variable
  RETURN output;
END;
$$ LANGUAGE plpgsql;


-- select your_function_name_ver3(2,17.6581156,83.1970511 ,'62f3bfa3-0bc0-4864-9430-30275107252d','carpenter')



create
or replace function acceptHead (headid text, ownerid text) returns void as $$
DECLARE
    head_workers_array text[];
    head_workers_count int;
    no_workersreq_updated int;
BEGIN

        update head set status='accepted',isworking=TRUE,avalforwork=FALSE;
        select noofworkers into head_workers_count from head where id=headid::uuid;
        update owners_duplicate set pending=pending-head_workers_count,accepted=accepted+head_workers_count where userid=ownerid::uuid;
        select noworkersreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        if(no_workersreq_updated=0) then

              update owners_duplicate set filled=TRUE where userid=ownerid::uuid;

        end if;


END;
$$ language plpgsql;


create
or replace function rejectHead(headid text, ownerid text) returns void as $$
DECLARE
    head_workers_array text[];
    head_workers_count int;
    no_workersreq_updated int;
BEGIN
        select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        update head set status='pending',owner=null where id=headid::uuid;
        update owners_duplicate set pending=0,accepted=0,head=null,headworkers=null,noworkersreq=no_workersreq_updated  where userid=ownerid::uuid;
END;
$$ language plpgsql;




create
or replace function workerAccept(headid text, ownerid text) returns void as $$
DECLARE
    head_workers_array text[];
    head_workers_count int;
    no_workersreq_updated int;
BEGIN
        select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        update head set status='pending',owner=null where id=headid::uuid;
        update owners_duplicate set pending=0,accepted=0,head=null,headworkers=null,noworkersreq=no_workersreq_updated  where userid=ownerid::uuid;
END;
$$ language plpgsql;




create
or replace function workerReject(headid text, ownerid text) returns void as $$
DECLARE
    head_workers_array text[];
    head_workers_count int;
    no_workersreq_updated int;
BEGIN
        select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        update head set status='pending',owner=null where id=headid::uuid;
        update owners_duplicate set pending=0,accepted=0,head=null,headworkers=null,noworkersreq=no_workersreq_updated  where userid=ownerid::uuid;
END;
$$ language plpgsql;







CREATE OR REPLACE FUNCTION your_function_name_ver3(required_workers int,latitude float,longitude float,id_owner uuid,ownerworkType text)
-- here we will be taking the required number of workers and the id of the owner respectively
--   required_workers id_owner
RETURNS int AS $$

DECLARE
     head_workers int;
    --  required_workers int;
     head_id uuid;
     workers_from_head text[];
     individual_workers_array text[];
     workers_count int;
     available_workers int;
     diffworkers int;
      output  int;
    remaining_workers int;
    headworkerscount int;
    --  latitude float;
    --  longitude float;
    --  id_owner uuid;
    updation_array text[];  --for updating the workers whether they have been assigned for the owner or the head or they are having no work
    updation_var text;--for updating the workers whether they have been assigned for the owner or the head or they are having no work


BEGIN
    -- consider scenario owner requires 50 workers while head is only having 45 workers and 5 workers should be selected separately
    -- here we have owner id
    -- Assign a value to the variable
    -- required_workers:=3;
    -- latitude:=17.6868159;
    -- longitude:= 83.2184815;
    -- id_owner:='adea4c83-80c2-40dd-9045-d086a9621ca7';

    diffworkers:=0;
    head_id := null;

    select id into head_id from head where head.noofworkers<=required_workers and ST_DWithin(
            	head.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype and head.avalforwork=true and head.status='notassigned' order by dateofregister limit 1 ;

    select noofworkers into available_workers from head where id = head_id;
    diffworkers := required_workers - available_workers;

    if head_id is not null then
            if diffworkers=0 then
              -- here we will be selecting all the workers from the heads

               

              select workers into workers_from_head from head where id=head_id;
  
              update owners_duplicate set headworkers=workers_from_head,head=head_id,noworkersreq=0,pending=available_workers where userid = id_owner;
              -- update owners_duplicate set headworkers=workers_from_head,filled=TRUE,head=head_id,noworkersreq=0 where userid = id_owner; 6-2024


              -- update head set isworking=TRUE,owner=id_owner,avalforwork=FALSE where id=head_id; 6-2024
              update head set owner=id_owner,status='pending' where id=head_id;


               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
                end loop;

            else
                     
 select diffworkers into output;

              select workers into workers_from_head from head where id=head_id;
              update owners_duplicate set headworkers=workers_from_head,head=head_id,pending=pending+ARRAY_LENGTH(workers_from_head,1),noworkersreq=noworkersreq-ARRAY_LENGTH(workers_from_head,1) where userid = id_owner;
               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id,status='pending' where userid=updation_var;
              end loop;


             
              --- error is here
              select ARRAY(select userid from workers  where ST_DWithin( 
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType and workers.owner is null and workers.head is null order by dateofregister limit diffworkers ) into individual_workers_array;
              select count(*) into headworkerscount from head where id=head_id;


              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array)),pending=pending+ARRAY_LENGTH(individual_workers_array,1),noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1);
              -- update owners_duplicate set workers = individual_workers_array;

              -- update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(workers,1)-ARRAY_LENGTH(headworkers,1);
          
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
        --       if remaining_workers = 0 then
        --                         update owners_duplicate set filled='TRUE' where userid=id_owner;
        --       end if;
                 foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner,status='pending' where userid=updation_var;
              end loop;

                
             update head set owner=id_owner,status='pending' where id=head_id;



              -- here we will be selecting some of the members from the heads and some of the members from the individual groups
            end if;
    else

            select ARRAY(select userid from workers  where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType order by dateofregister limit diffworkers ) into individual_workers_array;

              -- update owners_duplicate set workers = ARRAY_APPEND(workers,ARRAY(select unnest(individual_workers_array)));
              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array));

              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1),pending=pending+ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
      


      -- the below | condition should be checked whenever there is an acceptance by the head or the individual worker
            --  select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
              -- if remaining_workers = 0 then
              --                   update owners_duplicate set filled='TRUE' where userid=id_owner;
             
             foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner,status='pending' where userid=updation_var;
              end loop;
 
  /* Return the output text variable. */


              -- end if;


            -- here we should write logic that we will be selecting the workers individually

    end if;

    -- Your logic using the variable goes here
    -- For example, you can use it in a SELECT statement
    -- SELECT * FROM your_table WHERE some_column = your_variable_name;

    -- Or perform other operations using the variable
  RETURN output;
END;
$$ LANGUAGE plpgsql;


-- select your_function_name_ver3(2,17.6581156,83.1970511 ,'62f3bfa3-0bc0-4864-9430-30275107252d','carpenter')



create
or replace function acceptHead (headid text, ownerid text) returns void as $$
DECLARE
    head_workers_array text[];
    head_workers_count int;
    no_workersreq_updated int;
BEGIN

        update head set status='accepted',isworking=TRUE,avalforwork=FALSE;
        select noofworkers into head_workers_count from head where id=headid::uuid;
        update owners_duplicate set pending=pending-head_workers_count,accepted=accepted+head_workers_count where userid=ownerid::uuid;
        select noworkersreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        if(no_workersreq_updated=0) then
              update owners_duplicate set filled=TRUE where userid=ownerid::uuid;
        end if;


END;
$$ language plpgsql;


create
or replace function rejectHead(headid text, ownerid text) returns void as $$
DECLARE
    head_workers_array text[];
    head_workers_count int;
    no_workersreq_updated int;
BEGIN
        select noofworkers into head_workers_count from head where id=headid::uuid;
        -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        update head set status='pending',owner=null where id=headid::uuid;
        update owners_duplicate set pending=pending-head_workers_count,head=null,headworkers=null,noworkersreq=noworkersreq+head_workers_count  where userid=ownerid::uuid;
END;
$$ language plpgsql;




create
or replace function workerAccept(workerid text, ownerid text) returns void as $$
DECLARE

BEGIN
        -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        update workers set status='accepted' where userid=workerid;
        update owners_duplicate set pending=pending-1,accepted=accepted+1  where userid=ownerid::uuid;
        select UpdateOwnerDetails(ownerid);

END;
$$ language plpgsql;



create
or replace function workerReject(workerid text, ownerid text) returns void as $$
DECLARE

BEGIN
        -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        update worker set status='accepted' where userid=workerid;
        update owners_duplicate set pending=pending-1,noworkersreq=noworkersreq+1 where userid=ownerid::uuid;
END;
$$ language plpgsql;



create
or replace function UpdateOwnerDetails(ownerid text) returns void as $$
DECLARE
acceptedcount int;
requiredcount int;


BEGIN
        -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        select accepted,dupreq into acceptedcount,requiredcount from owners_duplicate where userid=ownerid;
        if(requiredcount==acceptedcount) then
            update owners_duplicate set filled=true where userid=ownerid;
        end if;
        
END;
$$ language plpgsql;



----------------



CREATE OR REPLACE FUNCTION your_function_name_ver3(required_workers int,latitude float,longitude float,id_owner uuid,ownerworkType text)
-- here we will be taking the required number of workers and the id of the owner respectively
--   required_workers id_owner
RETURNS int AS $$

DECLARE
     head_workers int;
    --  required_workers int;
     head_id uuid;
     workers_from_head text[];
     individual_workers_array text[];
     workers_count int;
     available_workers int;
     diffworkers int;
      output  int;
    remaining_workers int;
    headworkerscount int;
    --  latitude float;
    --  longitude float;
    --  id_owner uuid;
    updation_array text[];  --for updating the workers whether they have been assigned for the owner or the head or they are having no work
    updation_var text;--for updating the workers whether they have been assigned for the owner or the head or they are having no work


BEGIN
    -- consider scenario owner requires 50 workers while head is only having 45 workers and 5 workers should be selected separately
    -- here we have owner id
    -- Assign a value to the variable
    -- required_workers:=3;
    -- latitude:=17.6868159;
    -- longitude:= 83.2184815;
    -- id_owner:='adea4c83-80c2-40dd-9045-d086a9621ca7';

    diffworkers:=0;
    head_id := null;

    select id into head_id from head where head.noofworkers<=required_workers and ST_DWithin(
            	head.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype and head.avalforwork=true and head.status='notassigned' order by dateofregister limit 1 ;

    select noofworkers into available_workers from head where id = head_id;
    diffworkers := required_workers - available_workers;

    if head_id is not null then
            if diffworkers=0 then
              -- here we will be selecting all the workers from the heads

               

              select workers into workers_from_head from head where id=head_id;
  
              update owners_duplicate set headworkers=workers_from_head,head=head_id,noworkersreq=0,pending=available_workers where userid = id_owner;
              -- update owners_duplicate set headworkers=workers_from_head,filled=TRUE,head=head_id,noworkersreq=0 where userid = id_owner; 6-2024


              -- update head set isworking=TRUE,owner=id_owner,avalforwork=FALSE where id=head_id; 6-2024
              update head set owner=id_owner,status='pending' where id=head_id;


               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
                end loop;

            else
                     


              select workers into workers_from_head from head where id=head_id;
              update owners_duplicate set headworkers=workers_from_head,head=head_id,pending=pending+ARRAY_LENGTH(workers_from_head,1),noworkersreq=noworkersreq-ARRAY_LENGTH(workers_from_head,1) where userid = id_owner;
               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id,status='pending' where userid=updation_var;
              end loop;


             
              --- error is here
              select ARRAY(select userid from workers  where ST_DWithin( 
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType and workers.owner is null and workers.head is null order by dateofregister limit diffworkers ) into individual_workers_array;
              select count(*) into headworkerscount from head where id=head_id;


              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array)),pending=pending+ARRAY_LENGTH(individual_workers_array,1),noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
              -- update owners_duplicate set workers = individual_workers_array;

              -- update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(workers,1)-ARRAY_LENGTH(headworkers,1);
          
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
        --       if remaining_workers = 0 then
        --                         update owners_duplicate set filled='TRUE' where userid=id_owner;
        --       end if;
                 foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner,status='pending' where userid=updation_var;
              end loop;

                
             update head set owner=id_owner,status='pending' where id=head_id;



              -- here we will be selecting some of the members from the heads and some of the members from the individual groups
            end if;
    else

            select ARRAY(select userid from workers  where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType and workers.status is null and workers.head is null and workers.owner is null  order by dateofregister limit required_workers) into individual_workers_array;



              -- update owners_duplicate set workers = ARRAY_APPEND(workers,ARRAY(select unnest(individual_workers_array)));
              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array)) where userid=id_owner;

              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1),pending=pending+ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;

       select ARRAY_LENGTH(individual_workers_array,1) into output;


      -- the below | condition should be checked whenever there is an acceptance by the head or the individual worker
            --  select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
              -- if remaining_workers = 0 then
              --                   update owners_duplicate set filled='TRUE' where userid=id_owner;
             
             foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner,status='pending' where userid=updation_var;
              end loop;
 
  /* Return the output text variable. */


              -- end if;


            -- here we should write logic that we will be selecting the workers individually

    end if;

    -- Your logic using the variable goes here
    -- For example, you can use it in a SELECT statement
    -- SELECT * FROM your_table WHERE some_column = your_variable_name;

    -- Or perform other operations using the variable
  RETURN output;
END;
$$ LANGUAGE plpgsql;


-- select your_function_name_ver3(2,17.6581156,83.1970511 ,'62f3bfa3-0bc0-4864-9430-30275107252d','carpenter')



create
or replace function acceptHead (headid text, ownerid text) returns void as $$
DECLARE
    head_workers_array text[];
    head_workers_count int;
    no_workersreq_updated int;
BEGIN

        update head set status='accepted',isworking=TRUE,avalforwork=FALSE;
        select noofworkers into head_workers_count from head where id=headid::uuid;
        update owners_duplicate set pending=pending-head_workers_count,accepted=accepted+head_workers_count where userid=ownerid::uuid;
        select noworkersreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        if(no_workersreq_updated=0) then
              update owners_duplicate set filled=TRUE where userid=ownerid::uuid;
        end if;


END;
$$ language plpgsql;


create
or replace function rejectHead(headid text, ownerid text) returns void as $$
DECLARE
    head_workers_array text[];
    head_workers_count int;
    no_workersreq_updated int;
BEGIN
        select noofworkers into head_workers_count from head where id=headid::uuid;
        -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        update head set status='pending',owner=null where id=headid::uuid;
        update owners_duplicate set pending=pending-head_workers_count,head=null,headworkers=null,noworkersreq=noworkersreq+head_workers_count  where userid=ownerid::uuid;
END;
$$ language plpgsql;




create
or replace function workerAccept(workerid text, ownerid text) returns void as $$
DECLARE

BEGIN
        -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        update workers set status='accepted' where userid=workerid;
        update owners_duplicate set pending=pending-1,accepted=accepted+1  where userid=ownerid::uuid;
        select UpdateOwnerDetails(ownerid);

END;
$$ language plpgsql;



create
or replace function workerReject(workerid text, ownerid text) returns void as $$
DECLARE

BEGIN
        -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        update workers set status=null,owner=null,block_list=ARRAY_APPEND(block_list,ownerid) where userid=workerid;
        update owners_duplicate set pending=pending-1,noworkersreq=noworkersreq+1,workers=ARRAY_REMOVE(workers,workerid) where userid=ownerid::uuid;
END;
$$ language plpgsql;



create
or replace function UpdateOwnerDetails(ownerid text) returns void as $$
DECLARE
acceptedcount int;
requiredcount int;


BEGIN
        -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        select accepted,dupreq into acceptedcount,requiredcount from owners_duplicate where userid=ownerid;
        if(requiredcount==acceptedcount) then
            update owners_duplicate set filled=true where userid=ownerid;
        end if;
        
END;
$$ language plpgsql;






insert into owners_duplicate (userid,ownername,phonenumber,scplace,workers,startdate,enddate,noworkersreq,worktype,dupreq) values ('0996cde2-5eca-447c-858b-8192927f7266'::uuid,'twowner@gmail'::character varying(26),'234234'::character varying(10),ST_SetSRID(        
                ST_MakePoint(
                    17.6868159,83.2184815
                ),
                4326)::geometry,null,'2024-02-07','2024-02-20',3,'carpenter',3);


select your_function_name_ver3(3,   17.6868159,83.2184815,'0996cde2-5eca-447c-858b-8192927f7266','carpenter')


      





















CREATE OR REPLACE FUNCTION your_function_name_ver3(required_workers int,latitude float,longitude float,id_owner uuid,ownerworkType text)
-- here we will be taking the required number of workers and the id of the owner respectively
--   required_workers id_owner
RETURNS int AS $$

DECLARE
     head_workers int;
    --  required_workers int;
     head_id uuid;
     workers_from_head text[];
     individual_workers_array text[];
     workers_count int;
     available_workers int;
     diffworkers int;
      output  int;
    remaining_workers int;
    headworkerscount int;
    --  latitude float;
    --  longitude float;
    --  id_owner uuid;
    updation_array text[];  --for updating the workers whether they have been assigned for the owner or the head or they are having no work
    updation_var text;--for updating the workers whether they have been assigned for the owner or the head or they are having no work


BEGIN
    -- consider scenario owner requires 50 workers while head is only having 45 workers and 5 workers should be selected separately
    -- here we have owner id
    -- Assign a value to the variable
    -- required_workers:=3;
    -- latitude:=17.6868159;
    -- longitude:= 83.2184815;
    -- id_owner:='adea4c83-80c2-40dd-9045-d086a9621ca7';

    diffworkers:=0;
    head_id := null;

    select id into head_id from head where head.noofworkers<=required_workers and ST_DWithin(
            	head.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype and head.avalforwork=true and head.status='notassigned' order by dateofregister limit 1 ;

    select noofworkers into available_workers from head where id = head_id;
    diffworkers := required_workers - available_workers;

    if head_id is not null then
            if diffworkers=0 then
              -- here we will be selecting all the workers from the heads

               

              select workers into workers_from_head from head where id=head_id;
  
              update owners_duplicate set headworkers=workers_from_head,head=head_id,noworkersreq=0,pending=available_workers where userid = id_owner;
              -- update owners_duplicate set headworkers=workers_from_head,filled=TRUE,head=head_id,noworkersreq=0 where userid = id_owner; 6-2024


              -- update head set isworking=TRUE,owner=id_owner,avalforwork=FALSE where id=head_id; 6-2024
              update head set owner=id_owner,status='pending' where id=head_id;


               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
                end loop;

            else
                     


              select workers into workers_from_head from head where id=head_id;
              update owners_duplicate set headworkers=workers_from_head,head=head_id,pending=pending+ARRAY_LENGTH(workers_from_head,1),noworkersreq=noworkersreq-ARRAY_LENGTH(workers_from_head,1) where userid = id_owner;
               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id,status='pending' where userid=updation_var;
              end loop;


             
              --- error is here
              select ARRAY(select userid from workers  where ST_DWithin( 
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType and workers.owner is null and workers.head is null order by dateofregister limit diffworkers ) into individual_workers_array;
              select count(*) into headworkerscount from head where id=head_id;


              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array)),pending=pending+ARRAY_LENGTH(individual_workers_array,1),noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
              -- update owners_duplicate set workers = individual_workers_array;

              -- update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(workers,1)-ARRAY_LENGTH(headworkers,1);
          
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
        --       if remaining_workers = 0 then
        --                         update owners_duplicate set filled='TRUE' where userid=id_owner;
        --       end if;
                 foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner,status='pending' where userid=updation_var;
              end loop;

                
             update head set owner=id_owner,status='pending' where id=head_id;



              -- here we will be selecting some of the members from the heads and some of the members from the individual groups
            end if;
    else

            select ARRAY(select userid from workers  where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType and workers.status is null and workers.head is null and workers.owner is null  order by dateofregister limit required_workers) into individual_workers_array;



              -- update owners_duplicate set workers = ARRAY_APPEND(workers,ARRAY(select unnest(individual_workers_array)));
              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array)) where userid=id_owner;

              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1),pending=pending+ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;

       select ARRAY_LENGTH(individual_workers_array,1) into output;


      -- the below | condition should be checked whenever there is an acceptance by the head or the individual worker
            --  select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
              -- if remaining_workers = 0 then
              --                   update owners_duplicate set filled='TRUE' where userid=id_owner;
             
             foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner,status='pending' where userid=updation_var;
              end loop;
 
  /* Return the output text variable. */


              -- end if;


            -- here we should write logic that we will be selecting the workers individually

    end if;

    -- Your logic using the variable goes here
    -- For example, you can use it in a SELECT statement
    -- SELECT * FROM your_table WHERE some_column = your_variable_name;

    -- Or perform other operations using the variable
  RETURN output;
END;
$$ LANGUAGE plpgsql;


-- select your_function_name_ver3(2,17.6581156,83.1970511 ,'62f3bfa3-0bc0-4864-9430-30275107252d','carpenter')



create
or replace function acceptHead (headid text, ownerid text) returns void as $$
DECLARE
    head_workers_array text[];
    head_workers_count int;
    no_workersreq_updated int;
BEGIN

        update head set status='accepted',isworking=TRUE,avalforwork=FALSE;
        select noofworkers into head_workers_count from head where id=headid::uuid;
        update owners_duplicate set pending=pending-head_workers_count,accepted=accepted+head_workers_count where userid=ownerid::uuid;
        select noworkersreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        if(no_workersreq_updated=0) then
              update owners_duplicate set filled=TRUE where userid=ownerid::uuid;
        end if;


END;
$$ language plpgsql;


create
or replace function rejectHead(headid text, ownerid text) returns void as $$
DECLARE
    head_workers_array text[];
    head_workers_count int;
    no_workersreq_updated int;
BEGIN
        select noofworkers into head_workers_count from head where id=headid::uuid;
        -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        update head set status='pending',owner=null where id=headid::uuid;
        update owners_duplicate set pending=pending-head_workers_count,head=null,headworkers=null,noworkersreq=noworkersreq+head_workers_count  where userid=ownerid::uuid;
END;
$$ language plpgsql;




create
or replace function workerAccept(workerid text, ownerid text) returns void as $$
DECLARE

BEGIN
        -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        update workers set status='accepted' where userid=workerid;
        update owners_duplicate set pending=pending-1,accepted=accepted+1  where userid=ownerid::uuid;
        select UpdateOwnerDetails(ownerid);

END;
$$ language plpgsql;



create
or replace function workerReject(workerid text, ownerid text) returns void as $$
DECLARE

BEGIN
        -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        update workers set status=null,owner=null,block_list=ARRAY_APPEND(block_list,ownerid) where userid=workerid;
        update owners_duplicate set pending=pending-1,noworkersreq=noworkersreq+1,workers=ARRAY_REMOVE(workers,workerid) where userid=ownerid::uuid;
END;
$$ language plpgsql;



create
or replace function UpdateOwnerDetails(ownerid text) returns void as $$
DECLARE
acceptedcount int;
requiredcount int;


BEGIN
        -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        select accepted,dupreq into acceptedcount,requiredcount from owners_duplicate where userid=ownerid;
        if(requiredcount==acceptedcount) then
            update owners_duplicate set filled=true where userid=ownerid;
        end if;
        
END;
$$ language plpgsql;






insert into owners_duplicate (userid,ownername,phonenumber,scplace,workers,startdate,enddate,noworkersreq,worktype,dupreq) values ('0996cde2-5eca-447c-858b-8192927f7266'::uuid,'twowner@gmail'::character varying(26),'234234'::character varying(10),ST_SetSRID(        
                ST_MakePoint(
                    17.6868159,83.2184815
                ),
                4326)::geometry,null,'2024-02-07','2024-02-20',3,'carpenter',3);


select your_function_name_ver3(3,   17.6868159,83.2184815,'0996cde2-5eca-447c-858b-8192927f7266','carpenter')


      
CREATE OR REPLACE FUNCTION your_function_name_ver3(required_workers int,latitude float,longitude float,id_owner uuid,ownerworkType text)
-- here we will be taking the required number of workers and the id of the owner respectively
--   required_workers id_owner
RETURNS int AS $$

DECLARE
     head_workers int;
    --  required_workers int;
     head_id uuid;
     workers_from_head text[];
     individual_workers_array text[];
     workers_count int;
     available_workers int;
     diffworkers int;
      output  int;
    remaining_workers int;
    headworkerscount int;
    --  latitude float;
    --  longitude float;
    --  id_owner uuid;
    updation_array text[];  --for updating the workers whether they have been assigned for the owner or the head or they are having no work
    updation_var text;--for updating the workers whether they have been assigned for the owner or the head or they are having no work


BEGIN
    -- consider scenario owner requires 50 workers while head is only having 45 workers and 5 workers should be selected separately
    -- here we have owner id
    -- Assign a value to the variable
    -- required_workers:=3;
    -- latitude:=17.6868159;
    -- longitude:= 83.2184815;
    -- id_owner:='adea4c83-80c2-40dd-9045-d086a9621ca7';

    diffworkers:=0;
    head_id := null;

    select id into head_id from head where head.noofworkers<=required_workers and ST_DWithin(
            	head.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype and head.avalforwork=true and head.status='notassigned' order by dateofregister limit 1 ;

    select noofworkers into available_workers from head where id = head_id;
    diffworkers := required_workers - available_workers;

    if head_id is not null then
            if diffworkers=0 then
              -- here we will be selecting all the workers from the heads

               

              select workers into workers_from_head from head where id=head_id;
  
              update owners_duplicate set headworkers=workers_from_head,head=head_id,noworkersreq=0,pending=available_workers where userid = id_owner;
              -- update owners_duplicate set headworkers=workers_from_head,filled=TRUE,head=head_id,noworkersreq=0 where userid = id_owner; 6-2024


              -- update head set isworking=TRUE,owner=id_owner,avalforwork=FALSE where id=head_id; 6-2024
              update head set owner=id_owner,status='pending' where id=head_id;


               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
                end loop;

            else
                     


              select workers into workers_from_head from head where id=head_id;
              update owners_duplicate set headworkers=workers_from_head,head=head_id,pending=pending+ARRAY_LENGTH(workers_from_head,1),noworkersreq=noworkersreq-ARRAY_LENGTH(workers_from_head,1) where userid = id_owner;
               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id,status='pending' where userid=updation_var;
              end loop;


             
              --- error is here
              select ARRAY(select userid from workers  where ST_DWithin( 
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType and workers.owner is null and workers.head is null order by dateofregister limit diffworkers ) into individual_workers_array;
              select count(*) into headworkerscount from head where id=head_id;


              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array)),pending=pending+ARRAY_LENGTH(individual_workers_array,1),noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
              -- update owners_duplicate set workers = individual_workers_array;

              -- update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(workers,1)-ARRAY_LENGTH(headworkers,1);
          
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
        --       if remaining_workers = 0 then
        --                         update owners_duplicate set filled='TRUE' where userid=id_owner;
        --       end if;
                 foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner,status='pending' where userid=updation_var;
              end loop;

                
             update head set owner=id_owner,status='pending' where id=head_id;



              -- here we will be selecting some of the members from the heads and some of the members from the individual groups
            end if;
    else

            select ARRAY(select userid from workers  where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType and workers.status is null and workers.head is null and workers.owner is null  order by dateofregister limit required_workers) into individual_workers_array;



              -- update owners_duplicate set workers = ARRAY_APPEND(workers,ARRAY(select unnest(individual_workers_array)));
              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array)) where userid=id_owner;

              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1),pending=pending+ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;

       select ARRAY_LENGTH(individual_workers_array,1) into output;


      -- the below | condition should be checked whenever there is an acceptance by the head or the individual worker
            --  select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
              -- if remaining_workers = 0 then
              --                   update owners_duplicate set filled='TRUE' where userid=id_owner;
             
             foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner,status='pending' where userid=updation_var;
              end loop;
 
  /* Return the output text variable. */


              -- end if;


            -- here we should write logic that we will be selecting the workers individually

    end if;

    -- Your logic using the variable goes here
    -- For example, you can use it in a SELECT statement
    -- SELECT * FROM your_table WHERE some_column = your_variable_name;

    -- Or perform other operations using the variable
  RETURN output;
END;
$$ LANGUAGE plpgsql;


-- select your_function_name_ver3(2,17.6581156,83.1970511 ,'62f3bfa3-0bc0-4864-9430-30275107252d','carpenter')



create
or replace function acceptHead (headid text, ownerid text) returns void as $$
DECLARE
    head_workers_array text[];
    head_workers_count int;
    no_workersreq_updated int;
BEGIN

        update head set status='accepted',isworking=TRUE,avalforwork=FALSE;
        select noofworkers into head_workers_count from head where id=headid::uuid;
        update owners_duplicate set pending=pending-head_workers_count,accepted=accepted+head_workers_count where userid=ownerid::uuid;
        select noworkersreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        if(no_workersreq_updated=0) then
              update owners_duplicate set filled=TRUE where userid=ownerid::uuid;
        end if;


END;
$$ language plpgsql;


create
or replace function rejectHead(headid text, ownerid text) returns void as $$
DECLARE
    head_workers_array text[];
    head_workers_count int;
    no_workersreq_updated int;
BEGIN
        select noofworkers into head_workers_count from head where id=headid::uuid;
        -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        update head set status='pending',owner=null where id=headid::uuid;
        update owners_duplicate set pending=pending-head_workers_count,head=null,headworkers=null,noworkersreq=noworkersreq+head_workers_count  where userid=ownerid::uuid;
END;
$$ language plpgsql;




create
or replace function workerAccept(workerid text, ownerid text) returns void as $$
DECLARE

BEGIN
        -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        update workers set status='accepted' where userid=workerid;
        update owners_duplicate set pending=pending-1,accepted=accepted+1  where userid=ownerid::uuid;
        select UpdateOwnerDetails(ownerid);

END;
$$ language plpgsql;



create
or replace function workerReject(workerid text, ownerid text) returns void as $$
DECLARE

BEGIN
        -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        update workers set status=null,owner=null,block_list=ARRAY_APPEND(block_list,ownerid) where userid=workerid;
        update owners_duplicate set pending=pending-1,noworkersreq=noworkersreq+1,workers=ARRAY_REMOVE(workers,workerid) where userid=ownerid::uuid;
END;
$$ language plpgsql;



create
or replace function UpdateOwnerDetails(ownerid text) returns void as $$
DECLARE
acceptedcount int;
requiredcount int;


BEGIN
        -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        select accepted,dupreq into acceptedcount,requiredcount from owners_duplicate where userid=ownerid;
        if(requiredcount==acceptedcount) then
            update owners_duplicate set filled=true where userid=ownerid;
        end if;
        
END;
$$ language plpgsql;






insert into owners_duplicate (userid,ownername,phonenumber,scplace,workers,startdate,enddate,noworkersreq,worktype,dupreq) values ('0996cde2-5eca-447c-858b-8192927f7266'::uuid,'twowner@gmail'::character varying(26),'234234'::character varying(10),ST_SetSRID(        
                ST_MakePoint(
                    17.6868159,83.2184815
                ),
                4326)::geometry,null,'2024-02-07','2024-02-20',3,'carpenter',3);


select your_function_name_ver3(3,   17.6868159,83.2184815,'0996cde2-5eca-447c-858b-8192927f7266','carpenter')



CREATE OR REPLACE FUNCTION your_function_name_ver3(required_workers int,latitude float,longitude float,id_owner uuid,ownerworkType text)
-- here we will be taking the required number of workers and the id of the owner respectively
--   required_workers id_owner
RETURNS int AS $$

DECLARE
     head_workers int;
    --  required_workers int;
     head_id uuid;
     workers_from_head text[];
     individual_workers_array text[];
     workers_count int;
     available_workers int;
     diffworkers int;
      output  int;
    remaining_workers int;
    headworkerscount int;
    --  latitude float;
    --  longitude float;
    --  id_owner uuid;
    updation_array text[];  --for updating the workers whether they have been assigned for the owner or the head or they are having no work
    updation_var text;--for updating the workers whether they have been assigned for the owner or the head or they are having no work


BEGIN
    -- consider scenario owner requires 50 workers while head is only having 45 workers and 5 workers should be selected separately
    -- here we have owner id
    -- Assign a value to the variable
    -- required_workers:=3;
    -- latitude:=17.6868159;
    -- longitude:= 83.2184815;
    -- id_owner:='adea4c83-80c2-40dd-9045-d086a9621ca7';

    diffworkers:=0;
    head_id := null;

    select id into head_id from head where head.noofworkers<=required_workers and ST_DWithin(
            	head.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype and head.avalforwork=true and head.status='notassigned' order by dateofregister limit 1 ;

    select noofworkers into available_workers from head where id = head_id;
    diffworkers := required_workers - available_workers;

    if head_id is not null then
            if diffworkers=0 then
              -- here we will be selecting all the workers from the heads

               

              select workers into workers_from_head from head where id=head_id;
  
              update owners_duplicate set headworkers=workers_from_head,head=head_id,noworkersreq=0,pending=available_workers where userid = id_owner;
              -- update owners_duplicate set headworkers=workers_from_head,filled=TRUE,head=head_id,noworkersreq=0 where userid = id_owner; 6-2024


              -- update head set isworking=TRUE,owner=id_owner,avalforwork=FALSE where id=head_id; 6-2024
              update head set owner=id_owner,status='pending' where id=head_id;


               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
                end loop;

            else
                     


              select workers into workers_from_head from head where id=head_id;
              update owners_duplicate set headworkers=workers_from_head,head=head_id,pending=pending+ARRAY_LENGTH(workers_from_head,1),noworkersreq=noworkersreq-ARRAY_LENGTH(workers_from_head,1) where userid = id_owner;
               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id,status='pending' where userid=updation_var;
              end loop;


             
              --- error is here
              select ARRAY(select userid from workers  where ST_DWithin( 
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType and workers.owner is null and workers.head is null order by dateofregister limit diffworkers ) into individual_workers_array;
              select count(*) into headworkerscount from head where id=head_id;


              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array)),pending=pending+ARRAY_LENGTH(individual_workers_array,1),noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
              -- update owners_duplicate set workers = individual_workers_array;

              -- update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(workers,1)-ARRAY_LENGTH(headworkers,1);
          
             select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
        --       if remaining_workers = 0 then
        --                         update owners_duplicate set filled='TRUE' where userid=id_owner;
        --       end if;
                 foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner,status='pending' where userid=updation_var;
              end loop;

                
             update head set owner=id_owner,status='pending' where id=head_id;



              -- here we will be selecting some of the members from the heads and some of the members from the individual groups
            end if;
    else

            select ARRAY(select userid from workers  where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType and workers.status is null and workers.head is null and workers.owner is null  order by dateofregister limit required_workers) into individual_workers_array;



              -- update owners_duplicate set workers = ARRAY_APPEND(workers,ARRAY(select unnest(individual_workers_array)));
              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array)) where userid=id_owner;

              update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1),pending=pending+ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;

       select ARRAY_LENGTH(individual_workers_array,1) into output;


      -- the below | condition should be checked whenever there is an acceptance by the head or the individual worker
            --  select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
              -- if remaining_workers = 0 then
              --                   update owners_duplicate set filled='TRUE' where userid=id_owner;
             
             foreach updation_var in array individual_workers_array loop
                    update workers set owner=id_owner,status='pending' where userid=updation_var;
              end loop;
 
  /* Return the output text variable. */


              -- end if;


            -- here we should write logic that we will be selecting the workers individually

    end if;

    -- Your logic using the variable goes here
    -- For example, you can use it in a SELECT statement
    -- SELECT * FROM your_table WHERE some_column = your_variable_name;

    -- Or perform other operations using the variable
  RETURN output;
END;
$$ LANGUAGE plpgsql;


-- select your_function_name_ver3(2,17.6581156,83.1970511 ,'62f3bfa3-0bc0-4864-9430-30275107252d','carpenter')



create
or replace function acceptHead (headid text, ownerid text) returns void as $$
DECLARE
    head_workers_array text[];
    head_workers_count int;
    no_workersreq_updated int;
BEGIN

        update head set status='accepted',isworking=TRUE,avalforwork=FALSE;
        select noofworkers into head_workers_count from head where id=headid::uuid;
        update owners_duplicate set pending=pending-head_workers_count,accepted=accepted+head_workers_count where userid=ownerid::uuid;
        select noworkersreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        if(no_workersreq_updated=0) then
              update owners_duplicate set filled=TRUE where userid=ownerid::uuid;
        end if;


END;
$$ language plpgsql;


create
or replace function rejectHead(headid text, ownerid text) returns void as $$
DECLARE
    head_workers_array text[];
    head_workers_count int;
    no_workersreq_updated int;
BEGIN
        select noofworkers into head_workers_count from head where id=headid::uuid;
        -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        update head set status='pending',owner=null where id=headid::uuid;
        update owners_duplicate set pending=pending-head_workers_count,head=null,headworkers=null,noworkersreq=noworkersreq+head_workers_count  where userid=ownerid::uuid;
END;
$$ language plpgsql;




create
or replace function workerAccept(workerid text, ownerid text) returns void as $$
DECLARE

BEGIN
        -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        update workers set status='accepted' where userid=workerid;
        update owners_duplicate set pending=pending-1,accepted=accepted+1  where userid=ownerid::uuid;
        select UpdateOwnerDetails(ownerid);

END;
$$ language plpgsql;



create
or replace function workerReject(workerid text, ownerid text) returns void as $$
DECLARE

BEGIN
        -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        update workers set status=null,owner=null,block_list=ARRAY_APPEND(block_list,ownerid) where userid=workerid;
        update owners_duplicate set pending=pending-1,noworkersreq=noworkersreq+1,workers=ARRAY_REMOVE(workers,workerid) where userid=ownerid::uuid;
END;
$$ language plpgsql;



create
or replace function UpdateOwnerDetails(ownerid text) returns void as $$
DECLARE
acceptedcount int;
requiredcount int;


BEGIN
        -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        select accepted,dupreq into acceptedcount,requiredcount from owners_duplicate where userid=ownerid;
        if(requiredcount==acceptedcount) then
            update owners_duplicate set filled=true where userid=ownerid;
        end if;
        
END;
$$ language plpgsql;






insert into owners_duplicate (userid,ownername,phonenumber,scplace,workers,startdate,enddate,noworkersreq,worktype,dupreq) values ('0996cde2-5eca-447c-858b-8192927f7266'::uuid,'twowner@gmail'::character varying(26),'234234'::character varying(10),ST_SetSRID(        
                ST_MakePoint(
                    17.6868159,83.2184815
                ),
                4326)::geometry,null,'2024-02-07','2024-02-20',3,'carpenter',3);


select your_function_name_ver3(3,   17.6868159,83.2184815,'0996cde2-5eca-447c-858b-8192927f7266','carpenter')


      
      