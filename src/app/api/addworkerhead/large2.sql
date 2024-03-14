
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
    captured_heads text[];
    --  latitude float;
    --  longitude float;
    --  id_owner uuid;
    updation_array text[];  --for updating the workers whether they have been assigned for the owner or the head or they are having no work
    updation_var text;--for updating the workers whether they have been assigned for the owner or the head or they are having no work
    while_loop_head text;
    required_workers_dup int;
    head_id_dup uuid;


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
    required_workers_dup :=0;
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
  
              update owners_duplicate set head=ARRAY_APPEND(head,head_id) where userid = id_owner;
              -- update owners_duplicate set headworkers=workers_from_head,filled=TRUE,head=head_id,noworkersreq=0 where userid = id_owner; 6-2024


              -- update head set isworking=TRUE,owner=id_owner,avalforwork=FALSE where id=head_id; 6-2024
              update head set owner=id_owner,status='pending' where id=head_id;


               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
                end loop;

            else
                     --here we got one head and we have to find remaining headers

            ---------------------------
            
            

              
               update owners_duplicate set head = ARRAY_APPEND(head,head_id) where userid=id_owner;

               required_workers_dup := required_workers - available_workers;
               update head set owner=id_owner,status='pending' where id=head_id;


              --  select id into head_id_dup from head where head.noofworkers<=requried_workers_dup and ST_DWithin(
            	-- head.scplace,
		          --     ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	            --       300000) and head.isworking=FALSE and ownerworktype=head.worktype and head.avalforwork=true and head.status='notassigned' order by dateofregister limit 1 ;

              --  available_workers;
              --  requried_workers_dup;
              --  diff_workers;
              
          

              while required_workers_dup > 0 loop

           
                  
                          select id,noofworkers into head_id_dup,available_workers from head where head.noofworkers<=required_workers_dup and ST_DWithin(
                    head.scplace,
                        ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
                          300000) and head.isworking=FALSE and ownerworktype=head.worktype and head.avalforwork=true and head.status='notassigned'  order by dateofregister limit 1 ;


                        update owners_duplicate set head = ARRAY_APPEND(head,head_id_dup) where userid=id_owner;
                        update head set owner=id_owner,status='pending' where id=head_id_dup;
                        -- update head set owner=id_owner,status='pending' where id=head_id_dup;
                        required_workers_dup := required_workers_dup - available_workers;

                  end loop;


       
------------------------------------------------------|


        --       select workers into workers_from_head from head where id=head_id;
        --       update owners_duplicate set headworkers=workers_from_head,head=head_id,pending=pending+ARRAY_LENGTH(workers_from_head,1),noworkersreq=noworkersreq-ARRAY_LENGTH(workers_from_head,1) where userid = id_owner;
        --        foreach updation_var in array workers_from_head loop
        --             update workers set head=head_id,status='pending' where userid=updation_var;
        --       end loop;


             
        --       --- error is here
        --       select ARRAY(select userid from workers  where ST_DWithin( 
        --     	workers.scplace,
		    --           ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	      --             300000) and workers.worktype=ownerworkType and workers.owner is null and workers.head is null order by dateofregister limit diffworkers ) into individual_workers_array;
        --       select count(*) into headworkerscount from head where id=head_id;


        --       update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array)),pending=pending+ARRAY_LENGTH(individual_workers_array,1),noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
        --       -- update owners_duplicate set workers = individual_workers_array;

        --       -- update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(workers,1)-ARRAY_LENGTH(headworkers,1);
          
        --      select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
        -- --       if remaining_workers = 0 then
        -- --                         update owners_duplicate set filled='TRUE' where userid=id_owner;
        -- --       end if;
        --          foreach updation_var in array individual_workers_array loop
        --             update workers set owner=id_owner,status='pending' where userid=updation_var;
        --       end loop;

                
        --      update head set owner=id_owner,status='pending' where id=head_id;



              -- here we will be selecting some of the members from the heads and some of the members from the individual groups
            end if;
    else
    
            -- here we are having no heads so we will be selecting from the workers


            select ARRAY(select userid from workers  where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType and workers.status is null and workers.head is null and workers.owner is null  order by dateofregister limit required_workers) into individual_workers_array;



              -- update owners_duplicate set workers = ARRAY_APPEND(workers,ARRAY(select unnest(individual_workers_array)));
              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array)) where userid=id_owner;

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









insert into owners_duplicate (userid,ownername,phonenumber,scplace,workers,startdate,enddate,noworkersreq,worktype,dupreq) values ('0996cde2-5eca-447c-858b-8192927f7266'::uuid,'twowner@gmail'::character varying(26),'234234'::character varying(10),ST_SetSRID(        
                ST_MakePoint(
                    17.6868159,83.2184815
                ),
                4326)::geometry,null,'2024-02-07','2024-02-20',3,'carpenter',3);


select your_function_name_ver3(3,   17.6868159,83.2184815,'0996cde2-5eca-447c-858b-8192927f7266','carpenter')



--------------------
-- 11-19  11-02-2024

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
    captured_heads text[];
    --  latitude float;
    --  longitude float;
    --  id_owner uuid;
    updation_array text[];  --for updating the workers whether they have been assigned for the owner or the head or they are having no work
    updation_var text;--for updating the workers whether they have been assigned for the owner or the head or they are having no work
    while_loop_head text;
    required_workers_dup int;
    head_id_dup uuid;
    owner_work_req_check int;


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
    required_workers_dup :=0;
    available_workers:=0;
    select id into head_id from head where head.noofworkers<=required_workers and ST_DWithin(
            	head.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype and head.avalforwork=true and head.status='notassigned' order by dateofregister limit 1 ;

    select noofworkers into available_workers from head where id = head_id;
    diffworkers := required_workers - available_workers;

    
    if head_id is not null then

             select id into head_id from head where head.noofworkers=required_workers and ST_DWithin(
            	head.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype and head.avalforwork=true and head.status='notassigned' order by dateofregister limit 1 ;

    select noofworkers into available_workers from head where id = head_id;
    diffworkers := required_workers - available_workers; 



            if head_id is not null then
              -- here we will be selecting all the workers from the heads

               

              select workers into workers_from_head from head where id=head_id;
  
              update owners_duplicate set head=ARRAY_APPEND(head,head_id),pending=pending+available_workers,noworkersreq=noworkersreq-available_workers  where userid = id_owner;
              -- update owners_duplicate set headworkers=workers_from_head,filled=TRUE,head=head_id,noworkersreq=0 where userid = id_owner; 6-2024


              -- update head set isworking=TRUE,owner=id_owner,avalforwork=FALSE where id=head_id; 6-2024
              update head set owner=id_owner,status='pending' where id=head_id;


               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
                end loop;

            else
                     --here we got one head and we have to find remaining headers
          

            ---------------------------
              select id into head_id from head where head.noofworkers<=required_workers and ST_DWithin(
            	head.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype and head.avalforwork=true and head.status='notassigned' order by dateofregister limit 1 ;

                select noofworkers into available_workers from head where id = head_id;
            
              
               update owners_duplicate set head = ARRAY_APPEND(head,head_id),pending=pending+available_workers,noworkersreq=noworkersreq-available_workers where userid=id_owner;

               required_workers_dup := required_workers - available_workers;
               update head set owner=id_owner,status='pending' where id=head_id; 


              --  select id into head_id_dup from head where head.noofworkers<=requried_workers_dup and ST_DWithin(
            	-- head.scplace,
		          --     ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	            --       300000) and head.isworking=FALSE and ownerworktype=head.worktype and head.avalforwork=true and head.status='notassigned' order by dateofregister limit 1 ;

              --  available_workers;
              --  requried_workers_dup;
              --  diff_workers;
              
            
            head_id_dup:=null;

-- --loop start
               

--loop end


              



-- -- caution
              while required_workers_dup > 0 loop
                       select id,noofworkers into head_id_dup,available_workers from head where head.noofworkers<=required_workers_dup and ST_DWithin(
                    head.scplace,
                        ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
                          300000) and head.isworking=FALSE and ownerworktype=head.worktype and head.avalforwork=true and head.status='notassigned'  order by dateofregister limit 1 ;
                


                if head_id_dup is not null then
                        update owners_duplicate set head = ARRAY_APPEND(head,head_id_dup),pending=pending+available_workers,noworkersreq=noworkersreq-available_workers where userid=id_owner;
                        update head set owner=id_owner,status='pending' where id=head_id_dup; 
                        -- update head set owner=id_owner,status='pending' where id=head_id_dup;
                        
          
                        end if;
                        required_workers_dup := required_workers_dup - available_workers;

                  end loop;
                  -- for selecting the workers
                  -- to be uncommented next
                
                select noworkersreq into diffworkers from owners_duplicate where userid=id_owner;        

                          select ARRAY(select userid from workers  where ST_DWithin( 
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType and workers.owner is null and workers.head is null order by dateofregister limit diffworkers ) into individual_workers_array;

                         update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array)),pending=pending+ARRAY_LENGTH(individual_workers_array,1),noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;

           

       
------------------------------------------------------|


        --       select workers into workers_from_head from head where id=head_id;
        --       update owners_duplicate set headworkers=workers_from_head,head=head_id,pending=pending+ARRAY_LENGTH(workers_from_head,1),noworkersreq=noworkersreq-ARRAY_LENGTH(workers_from_head,1) where userid = id_owner;
        --        foreach updation_var in array workers_from_head loop
        --             update workers set head=head_id,status='pending' where userid=updation_var;
        --       end loop;


             
        --       --- error is here
        --       select ARRAY(select userid from workers  where ST_DWithin( 
        --     	workers.scplace,
		    --           ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	      --             300000) and workers.worktype=ownerworkType and workers.owner is null and workers.head is null order by dateofregister limit diffworkers ) into individual_workers_array;
        --       select count(*) into headworkerscount from head where id=head_id;


        --       update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array)),pending=pending+ARRAY_LENGTH(individual_workers_array,1),noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
        --       -- update owners_duplicate set workers = individual_workers_array;

        --       -- update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(workers,1)-ARRAY_LENGTH(headworkers,1);
          
        --      select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
        -- --       if remaining_workers = 0 then
        -- --                         update owners_duplicate set filled='TRUE' where userid=id_owner;
        -- --       end if;
        --          foreach updation_var in array individual_workers_array loop
        --             update workers set owner=id_owner,status='pending' where userid=updation_var;
        --       end loop;

                
        --      update head set owner=id_owner,status='pending' where id=head_id;



              -- here we will be selecting some of the members from the heads and some of the members from the individual groups
            end if;
    else
    
            -- here we are having no heads so we will be selecting from the workers


            select ARRAY(select userid from workers  where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType and workers.status is null and workers.head is null and workers.owner is null  order by dateofregister limit required_workers) into individual_workers_array;



              -- update owners_duplicate set workers = ARRAY_APPEND(workers,ARRAY(select unnest(individual_workers_array)));
              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array)) where userid=id_owner;

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






      
      

insert into owners_duplicate (userid,ownername,phonenumber,scplace,workers,startdate,enddate,noworkersreq,worktype,dupreq) values ('0996cde2-5eca-447c-858b-8192927f7266'::uuid,'twowner@gmail'::character varying(26),'234234'::character varying(10),ST_SetSRID(        
                ST_MakePoint(
                    17.6868159,83.2184815
                ),
                4326)::geometry,null,'2024-02-07','2024-02-20',3,'carpenter',3);



select your_function_name_ver3(3,   17.6868159,83.2184815,'0996cde2-5eca-447c-858b-8192927f7266','carpenter');




-- create
-- or replace function acceptHead (headid text, ownerid text) returns void as $$
-- DECLARE
--     head_workers_array text[];
--     head_workers_count int;
--     no_workersreq_updated int;
-- BEGIN

--         update head set status='accepted',isworking=TRUE,avalforwork=FALSE where id=headid;
--         select noofworkers into head_workers_count from head where id=headid::uuid;
--         update owners_duplicate set pending=pending-head_workers_count,accepted=accepted+head_workers_count where userid=ownerid::uuid;
--         select noworkersreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
--         if(no_workersreq_updated=0) then
--               update owners_duplicate set filled=TRUE where userid=ownerid::uuid;
--         end if;


-- END;
-- $$ language plpgsql;


-- create
-- or replace function rejectHead(headid text, ownerid text) returns void as $$
-- DECLARE
--     head_workers_array text[];
--     head_workers_count int;
--     no_workersreq_updated int;
-- BEGIN
--         select noofworkers into head_workers_count from head where id=headid::uuid;
--         -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
--         update head set status='notassigned',owner=null where id=headid::uuid;
--         update owners_duplicate set pending=pending-head_workers_count,head=ARRAY_REMOVE(head,headid),noworkersreq=noworkersreq+head_workers_count  where userid=ownerid::uuid;
-- END;
-- $$ language plpgsql;




-- create
-- or replace function workerAccept(workerid text, ownerid text) returns void as $$
-- DECLARE

-- BEGIN
--         -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
--         update workers set status='accepted' where userid=workerid;
--         update owners_duplicate set pending=pending-1,accepted=accepted+1  where userid=ownerid::uuid;
--         select UpdateOwnerDetails(ownerid);

-- END;
-- $$ language plpgsql;



-- create
-- or replace function workerReject(workerid text, ownerid text) returns void as $$
-- DECLARE

-- BEGIN
--         -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
--         update workers set status=null,owner=null,block_list=ARRAY_APPEND(block_list,ownerid) where userid=workerid;
--         update owners_duplicate set pending=pending-1,noworkersreq=noworkersreq+1,workers=ARRAY_REMOVE(workers,workerid) where userid=ownerid::uuid;
-- END;
-- $$ language plpgsql;



-- create
-- or replace function UpdateOwnerDetails(ownerid text) returns void as $$
-- DECLARE
-- acceptedcount int;
-- requiredcount int;


-- BEGIN
--         -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
--         select accepted,dupreq into acceptedcount,requiredcount from owners_duplicate where userid=ownerid;
--         if(requiredcount==acceptedcount) then
--             update owners_duplicate set filled=true where userid=ownerid;
--         end if;
        
-- END;
-- $$ language plpgsql;



-----------------------------------------------------------------------------------------------------------------




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
    captured_heads text[];
    --  latitude float;
    --  longitude float;
    --  id_owner uuid;
    updation_array text[];  --for updating the workers whether they have been assigned for the owner or the head or they are having no work
    updation_var text;--for updating the workers whether they have been assigned for the owner or the head or they are having no work
    while_loop_head text;
    required_workers_dup int;
    head_id_dup uuid;
    owner_work_req_check int;


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
    required_workers_dup :=0;
    available_workers:=0;
    select id into head_id from head where head.noofworkers<=required_workers and ST_DWithin(
            	head.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype and head.avalforwork=true and head.status='notassigned' order by dateofregister limit 1 ;

    select noofworkers into available_workers from head where id = head_id;
    diffworkers := required_workers - available_workers;

    
    if head_id is not null then

             select id into head_id from head where head.noofworkers=required_workers and ST_DWithin(
            	head.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype and head.avalforwork=true and head.status='notassigned' order by dateofregister limit 1 ;

    select noofworkers into available_workers from head where id = head_id;
    diffworkers := required_workers - available_workers; 



            if head_id is not null then
              -- here we will be selecting all the workers from the heads

               

              select workers into workers_from_head from head where id=head_id;
  
              update owners_duplicate set head=ARRAY_APPEND(head,head_id),pending=pending+available_workers,noworkersreq=noworkersreq-available_workers  where userid = id_owner;
              -- update owners_duplicate set headworkers=workers_from_head,filled=TRUE,head=head_id,noworkersreq=0 where userid = id_owner; 6-2024


              -- update head set isworking=TRUE,owner=id_owner,avalforwork=FALSE where id=head_id; 6-2024
              update head set owner=id_owner,status='pending' where id=head_id;


               foreach updation_var in array workers_from_head loop
                    update workers set head=head_id where userid=updation_var;
                end loop;

            else
                     --here we got one head and we have to find remaining headers
          

            ---------------------------
              select id into head_id from head where head.noofworkers<=required_workers and ST_DWithin(
            	head.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and head.isworking=FALSE and ownerworktype=head.worktype and head.avalforwork=true and head.status='notassigned' order by dateofregister limit 1 ;

                select noofworkers into available_workers from head where id = head_id;
            
              
               update owners_duplicate set head = ARRAY_APPEND(head,head_id),pending=pending+available_workers,noworkersreq=noworkersreq-available_workers where userid=id_owner;

               required_workers_dup := required_workers - available_workers;
               update head set owner=id_owner,status='pending' where id=head_id; 

                 


              --  select id into head_id_dup from head where head.noofworkers<=requried_workers_dup and ST_DWithin(
            	-- head.scplace,
		          --     ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	            --       300000) and head.isworking=FALSE and ownerworktype=head.worktype and head.avalforwork=true and head.status='notassigned' order by dateofregister limit 1 ;

              --  available_workers;
              --  requried_workers_dup;
              --  diff_workers;
              
            
            head_id_dup:=null;

-- --loop start
               

--loop end


              



-- -- caution
              while required_workers_dup > 0 loop
                       select id,noofworkers into head_id_dup,available_workers from head where head.noofworkers<=required_workers_dup and ST_DWithin(
                    head.scplace,
                        ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
                          300000) and head.isworking=FALSE and ownerworktype=head.worktype and head.avalforwork=true and head.status='notassigned'  order by dateofregister limit 1 ;
                


                if head_id_dup is not null then
                        update owners_duplicate set head = ARRAY_APPEND(head,head_id_dup),pending=pending+available_workers,noworkersreq=noworkersreq-available_workers where userid=id_owner;
                        update head set owner=id_owner,status='pending' where id=head_id_dup; 
                        -- update head set owner=id_owner,status='pending' where id=head_id_dup;
                        
          
                        end if;
                        required_workers_dup := required_workers_dup - available_workers;

                  end loop;
                  -- for selecting the workers
                  -- to be uncommented next
                
                select noworkersreq into diffworkers from owners_duplicate where userid=id_owner;        

                          select ARRAY(select userid from workers  where ST_DWithin( 
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType and workers.owner is null and workers.head is null order by dateofregister limit diffworkers ) into individual_workers_array;

                         update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array)),pending=pending+ARRAY_LENGTH(individual_workers_array,1),noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
                foreach updation_var in array individual_workers_array loop
                     update workers set owner=id_owner,status='pending' where userid=updation_var;
                end loop;
           

       
------------------------------------------------------|


        --       select workers into workers_from_head from head where id=head_id;
        --       update owners_duplicate set headworkers=workers_from_head,head=head_id,pending=pending+ARRAY_LENGTH(workers_from_head,1),noworkersreq=noworkersreq-ARRAY_LENGTH(workers_from_head,1) where userid = id_owner;
        --        foreach updation_var in array workers_from_head loop
        --             update workers set head=head_id,status='pending' where userid=updation_var;
        --       end loop;


             
        --       --- error is here
        --       select ARRAY(select userid from workers  where ST_DWithin( 
        --     	workers.scplace,
		    --           ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	      --             300000) and workers.worktype=ownerworkType and workers.owner is null and workers.head is null order by dateofregister limit diffworkers ) into individual_workers_array;
        --       select count(*) into headworkerscount from head where id=head_id;


        --       update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array)),pending=pending+ARRAY_LENGTH(individual_workers_array,1),noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
        --       -- update owners_duplicate set workers = individual_workers_array;

        --       -- update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(workers,1)-ARRAY_LENGTH(headworkers,1);
          
        --      select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
        -- --       if remaining_workers = 0 then
        -- --                         update owners_duplicate set filled='TRUE' where userid=id_owner;
        -- --       end if;
        --          foreach updation_var in array individual_workers_array loop
        --             update workers set owner=id_owner,status='pending' where userid=updation_var;
        --       end loop;

                
        --      update head set owner=id_owner,status='pending' where id=head_id;



              -- here we will be selecting some of the members from the heads and some of the members from the individual groups
            end if;
    else
    
            -- here we are having no heads so we will be selecting from the workers


            select ARRAY(select userid from workers  where ST_DWithin(
            	workers.scplace,
		              ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
	                  300000) and workers.worktype=ownerworkType and workers.status is null and workers.head is null and workers.owner is null  order by dateofregister limit required_workers) into individual_workers_array;



              -- update owners_duplicate set workers = ARRAY_APPEND(workers,ARRAY(select unnest(individual_workers_array)));
              update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array)) where userid=id_owner;

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






      
      

-- insert into owners_duplicate (userid,ownername,phonenumber,scplace,workers,startdate,enddate,noworkersreq,worktype,dupreq) values ('0996cde2-5eca-447c-858b-8192927f7266'::uuid,'twowner@gmail'::character varying(26),'234234'::character varying(10),ST_SetSRID(        
--                 ST_MakePoint(
--                     17.6868159,83.2184815
--                 ),
--                 4326)::geometry,null,'2024-02-07','2024-02-20',3,'carpenter',3);



-- select your_function_name_ver3(3,   17.6868159,83.2184815,'0996cde2-5eca-447c-858b-8192927f7266','carpenter');




-- create
-- or replace function acceptHead (headid text, ownerid text) returns void as $$
-- DECLARE
--     head_workers_array text[];
--     head_workers_count int;
--     no_workersreq_updated int;
-- BEGIN

--         update head set status='accepted',isworking=TRUE,avalforwork=FALSE where id=headid;
--         select noofworkers into head_workers_count from head where id=headid::uuid;
--         update owners_duplicate set pending=pending-head_workers_count,accepted=accepted+head_workers_count where userid=ownerid::uuid;
--         select noworkersreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
--         if(no_workersreq_updated=0) then
--               update owners_duplicate set filled=TRUE where userid=ownerid::uuid;
--         end if;


-- END;
-- $$ language plpgsql;


-- create
-- or replace function rejectHead(headid text, ownerid text) returns void as $$
-- DECLARE
--     head_workers_array text[];
--     head_workers_count int;
--     no_workersreq_updated int;
-- BEGIN
--         select noofworkers into head_workers_count from head where id=headid::uuid;
--         -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
--         update head set status='notassigned',owner=null where id=headid::uuid;
--         update owners_duplicate set pending=pending-head_workers_count,head=ARRAY_REMOVE(head,headid),noworkersreq=noworkersreq+head_workers_count  where userid=ownerid::uuid;
-- END;
-- $$ language plpgsql;




-- create
-- or replace function workerAccept(workerid text, ownerid text) returns void as $$
-- DECLARE

-- BEGIN
--         -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
--         update workers set status='accepted' where userid=workerid;
--         update owners_duplicate set pending=pending-1,accepted=accepted+1  where userid=ownerid::uuid;
--         select UpdateOwnerDetails(ownerid);

-- END;
-- $$ language plpgsql;



-- create
-- or replace function workerReject(workerid text, ownerid text) returns void as $$
-- DECLARE

-- BEGIN
--         -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
--         update workers set status=null,owner=null,block_list=ARRAY_APPEND(block_list,ownerid) where userid=workerid;
--         update owners_duplicate set pending=pending-1,noworkersreq=noworkersreq+1,workers=ARRAY_REMOVE(workers,workerid) where userid=ownerid::uuid;
-- END;
-- $$ language plpgsql;



-- create
-- or replace function UpdateOwnerDetails(ownerid text) returns void as $$
-- DECLARE
-- acceptedcount int;
-- requiredcount int;


-- BEGIN
--         -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
--         select accepted,dupreq into acceptedcount,requiredcount from owners_duplicate where userid=ownerid;
--         if(requiredcount==acceptedcount) then
--             update owners_duplicate set filled=true where userid=ownerid;
--         end if;
        
-- END;
-- $$ language plpgsql;




----------- accept or reject workers



      
      



create
or replace function acceptHead (headid text, ownerid text) returns void as $$
DECLARE
    head_workers_array text[];
    head_workers_count int;
    no_workersreq_updated int;
BEGIN

        update head set status='accepted',isworking=TRUE,avalforwork=FALSE where id=headid::uuid;
        select noofworkers into head_workers_count from head where id=headid::uuid;
        update owners_duplicate set pending=pending-head_workers_count,accepted=accepted+head_workers_count where userid=ownerid::uuid;
        select noworkersreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        if(no_workersreq_updated=0) then
              update owners_duplicate set filled=TRUE where userid=ownerid::uuid;
        end if;


END;
$$ language plpgsql;

-- select acceptHead('9b5f6061-c812-4b92-9a2e-8730c82a41cb','0996cde2-5eca-447c-858b-8192927f7266');

create
or replace function rejectHead(headid text, ownerid text) returns void as $$
DECLARE
    head_workers_array text[];
    head_workers_count int;
    no_workersreq_updated int;
BEGIN
        select noofworkers into head_workers_count from head where id=headid::uuid;
        -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        update head set status='notassigned',owner=null where id=headid::uuid;
                UPDATE owners_duplicate
                SET
                pending = pending - head_workers_count,
                head = (
                        SELECT array_agg(head_id)
                        FROM unnest(head) AS head_id
                        WHERE head_id <> headid::uuid
                ),
                noworkersreq = noworkersreq + head_workers_count
                WHERE userid = ownerid::uuid;
        select UpdateOwnerDetails(ownerid);
END;
$$ language plpgsql;






-- create
-- or replace function workerAccept(workerid text, ownerid text) returns void as $$
-- DECLARE

-- BEGIN
--         -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
--         update workers set status='accepted' where userid=workerid;
--         update owners_duplicate set pending=pending-1,accepted=accepted+1  where userid=ownerid::uuid;
--         select UpdateOwnerDetails(ownerid);

-- END;
-- $$ language plpgsql;



-- create
-- or replace function workerReject(workerid text, ownerid text) returns void as $$
-- DECLARE

-- BEGIN
--         -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
--         update workers set status=null,owner=null,block_list=ARRAY_APPEND(block_list,ownerid) where userid=workerid;
--         update owners_duplicate set pending=pending-1,noworkersreq=noworkersreq+1,workers=ARRAY_REMOVE(workers,workerid) where userid=ownerid::uuid;
-- END;
-- $$ language plpgsql;




create
or replace function UpdateOwnerDetails(ownerid text) returns void as $$
DECLARE
acceptedcount int;
requiredcount int;


BEGIN
        -- select dupreq into no_workersreq_updated from owners_duplicate where userid=ownerid::uuid;
        select accepted,dupreq into acceptedcount,requiredcount from owners_duplicate where userid=ownerid::uuid;
        if(requiredcount=acceptedcount) then
            update owners_duplicate set filled=true where userid=ownerid::uuid;
        end if;
        
END;
$$ language plpgsql;






CREATE
OR REPLACE FUNCTION your_function_name_ver3 (
  required_workers int,
  latitude float,
  longitude float,
  id_owner uuid,
  ownerworkType text
) RETURNS int AS $$
DECLARE
  head_workers int;

--  required_workers int;
head_id uuid;

workers_from_head text[];

individual_workers_array text[];

workers_count int;

available_workers int;

diffworkers int;

output int;

remaining_workers int;

headworkerscount int;

captured_heads text[];

--  latitude float;
--  longitude float;
--  id_owner uuid;
updation_array text[];

--for updating the workers whether they have been assigned for the owner or the head or they are having no work
updation_var text;

--for updating the workers whether they have been assigned for the owner or the head or they are having no work
while_loop_head text;

required_workers_dup int;

head_id_dup uuid;

owner_work_req_check int;

BEGIN
  -- consider scenario owner requires 50 workers while head is only having 45 workers and 5 workers should be selected separately
  -- here we have owner id
  -- Assign a value to the variable
  -- required_workers:=3;
  -- latitude:=17.6868159;
  -- longitude:= 83.2184815;
  -- id_owner:='adea4c83-80c2-40dd-9045-d086a9621ca7';
  diffworkers := 0;

head_id := null;

required_workers_dup := 0;

available_workers := 0;

select
  id into head_id
from
  head
where
  head.noofworkers <= required_workers
  and ST_DWithin (
    head.scplace,
    ST_SetSRID (ST_MakePoint (latitude, longitude), 4326),
    300000
  )
  and head.isworking = FALSE
  and ownerworktype = head.worktype
  and head.avalforwork = true
  and head.status = 'notassigned'
order by
  dateofregister
limit
  1;

select
  noofworkers into available_workers
from
  head
where
  id = head_id;

diffworkers := required_workers - available_workers;

if head_id is not null then
select
  id into head_id
from
  head
where
  head.noofworkers = required_workers
  and ST_DWithin (
    head.scplace,
    ST_SetSRID (ST_MakePoint (latitude, longitude), 4326),
    300000
  )
  and head.isworking = FALSE
  and ownerworktype = head.worktype
  and head.avalforwork = true
  and head.status = 'notassigned'
order by
  dateofregister
limit
  1;

select
  noofworkers into available_workers
from
  head
where
  id = head_id;

diffworkers := required_workers - available_workers;

if head_id is not null then
-- here we will be selecting all the workers from the heads
select
  workers into workers_from_head
from
  head
where
  id = head_id;

update
  owners_duplicate
set
  head = ARRAY_APPEND(head, head_id),
  pending = pending + available_workers,
  noworkersreq = noworkersreq - available_workers
where
  userid = id_owner;

-- update owners_duplicate set headworkers=workers_from_head,filled=TRUE,head=head_id,noworkersreq=0 where userid = id_owner; 6-2024
-- update head set isworking=TRUE,owner=id_owner,avalforwork=FALSE where id=head_id; 6-2024
update
  head
set
  owner = id_owner,
  status = 'pending'
where
  id = head_id;

foreach updation_var in array workers_from_head loop
update
  workers
set
  head = head_id
where
  userid = updation_var;

end loop;

else
--here we got one head and we have to find remaining headers
---------------------------
select
  id into head_id
from
  head
where
  head.noofworkers <= required_workers
  and ST_DWithin (
    head.scplace,
    ST_SetSRID (ST_MakePoint (latitude, longitude), 4326),
    300000
  )
  and head.isworking = FALSE
  and ownerworktype = head.worktype
  and head.avalforwork = true
  and head.status = 'notassigned'
order by
  dateofregister
limit
  1;

select
  noofworkers into available_workers
from
  head
where
  id = head_id;

update
  owners_duplicate
set
  head = ARRAY_APPEND(head, head_id),
  pending = pending + available_workers,
  noworkersreq = noworkersreq - available_workers
where
  userid = id_owner;

required_workers_dup := required_workers - available_workers;

update
  head
set
  owner = id_owner,
  status = 'pending'
where
  id = head_id;

--  select id into head_id_dup from head where head.noofworkers<=requried_workers_dup and ST_DWithin(
-- head.scplace,
--     ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
--       300000) and head.isworking=FALSE and ownerworktype=head.worktype and head.avalforwork=true and head.status='notassigned' order by dateofregister limit 1 ;
--  available_workers;
--  requried_workers_dup;
--  diff_workers;
head_id_dup := null;

-- --loop start
--loop end
-- -- caution
while required_workers_dup > 0 loop
select
  id,
  noofworkers into head_id_dup,
  available_workers
from
  head
where
  head.noofworkers <= required_workers_dup
  and ST_DWithin (
    head.scplace,
    ST_SetSRID (ST_MakePoint (latitude, longitude), 4326),
    300000
  )
  and head.isworking = FALSE
  and ownerworktype = head.worktype
  and head.avalforwork = true
  and head.status = 'notassigned'
order by
  dateofregister
limit
  1;

if head_id_dup is not null then
update
  owners_duplicate
set
  head = ARRAY_APPEND(head, head_id_dup),
  pending = pending + available_workers,
  noworkersreq = noworkersreq - available_workers
where
  userid = id_owner;

update
  head
set
  owner = id_owner,
  status = 'pending'
where
  id = head_id_dup;

-- update head set owner=id_owner,status='pending' where id=head_id_dup;
end if;

required_workers_dup := required_workers_dup - available_workers;

end loop;

-- for selecting the workers
-- to be uncommented next
select
  noworkersreq into diffworkers
from
  owners_duplicate
where
  userid = id_owner;

select
  ARRAY (
    select
      userid
    from
      workers
    where
      ST_DWithin (
        workers.scplace,
        ST_SetSRID (ST_MakePoint (latitude, longitude), 4326),
        300000
      )
      and workers.worktype = ownerworkType
      and workers.owner is null
      and workers.head is null
    order by
      dateofregister
    limit
      diffworkers
  ) into individual_workers_array;

update
  owners_duplicate
set
  workers = workers || ARRAY (
    select
      unnest(individual_workers_array)
  ),
  pending = pending + ARRAY_LENGTH(individual_workers_array, 1),
  noworkersreq = noworkersreq - ARRAY_LENGTH(individual_workers_array, 1)
where
  userid = id_owner;

foreach updation_var in array individual_workers_array loop
update
  workers
set
  owner = id_owner,
  status = 'pending'
where
  userid = updation_var;

end loop;

------------------------------------------------------|
--       select workers into workers_from_head from head where id=head_id;
--       update owners_duplicate set headworkers=workers_from_head,head=head_id,pending=pending+ARRAY_LENGTH(workers_from_head,1),noworkersreq=noworkersreq-ARRAY_LENGTH(workers_from_head,1) where userid = id_owner;
--        foreach updation_var in array workers_from_head loop
--             update workers set head=head_id,status='pending' where userid=updation_var;
--       end loop;
--       --- error is here
--       select ARRAY(select userid from workers  where ST_DWithin( 
--     	workers.scplace,
--           ST_SetSRID(ST_MakePoint(latitude,longitude),4326),
--             300000) and workers.worktype=ownerworkType and workers.owner is null and workers.head is null order by dateofregister limit diffworkers ) into individual_workers_array;
--       select count(*) into headworkerscount from head where id=head_id;
--       update owners_duplicate set workers = workers || ARRAY(select unnest(individual_workers_array)),pending=pending+ARRAY_LENGTH(individual_workers_array,1),noworkersreq=noworkersreq-ARRAY_LENGTH(individual_workers_array,1) where userid=id_owner;
--       -- update owners_duplicate set workers = individual_workers_array;
--       -- update owners_duplicate set noworkersreq=noworkersreq-ARRAY_LENGTH(workers,1)-ARRAY_LENGTH(headworkers,1);
--      select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
-- --       if remaining_workers = 0 then
-- --                         update owners_duplicate set filled='TRUE' where userid=id_owner;
-- --       end if;
--          foreach updation_var in array individual_workers_array loop
--             update workers set owner=id_owner,status='pending' where userid=updation_var;
--       end loop;
--      update head set owner=id_owner,status='pending' where id=head_id;
-- here we will be selecting some of the members from the heads and some of the members from the individual groups
end if;

else
-- here we are having no heads so we will be selecting from the workers
select
  ARRAY (
    select
      userid
    from
      workers
    where
      ST_DWithin (
        workers.scplace,
        ST_SetSRID (ST_MakePoint (latitude, longitude), 4326),
        300000
      )
      and workers.worktype = ownerworkType
      and workers.status is null
      and workers.head is null
      and workers.owner is null
    order by
      dateofregister
    limit
      required_workers
  ) into individual_workers_array;

-- update owners_duplicate set workers = ARRAY_APPEND(workers,ARRAY(select unnest(individual_workers_array)));
update
  owners_duplicate
set
  workers = workers || ARRAY (
    select
      unnest(individual_workers_array)
  )
where
  userid = id_owner;

update
  owners_duplicate
set
  noworkersreq = noworkersreq - ARRAY_LENGTH(individual_workers_array, 1),
  pending = pending + ARRAY_LENGTH(individual_workers_array, 1)
where
  userid = id_owner;

-- the below | condition should be checked whenever there is an acceptance by the head or the individual worker
--  select noworkersreq into remaining_workers from owners_duplicate where userid=id_owner;
-- if remaining_workers = 0 then
--                   update owners_duplicate set filled='TRUE' where userid=id_owner;
foreach updation_var in array individual_workers_array loop
update
  workers
set
  owner = id_owner,
  status = 'pending'
where
  userid = updation_var;

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
