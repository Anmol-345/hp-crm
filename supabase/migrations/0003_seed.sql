-- 0003_seed.sql
-- Seed physical registers data: 19th All India Annual Sports Meet 2024-25

-- 1. Prize Scale
insert into prize_scale (position, amount_inr) values
  ('winner', 5000),
  ('runner_up', 4000),
  ('first_runner_up', 3000)
on conflict (position) do update set amount_inr = excluded.amount_inr;

-- 2. Units (Refineries, Zones, Offices)
insert into units (name, kind) values
  ('Mumbai Refinery', 'refinery'),
  ('Visakh Refinery', 'refinery'),
  ('South Central Zone', 'zone'),
  ('North West Zone', 'zone'),
  ('East Zone', 'zone'),
  ('Petroleum House', 'office'),
  ('Hindustan Bhawan', 'office')
on conflict (name) do nothing;

-- 3. Events (16 Official Events)
insert into events (event_no, name, category, gender, age_min, age_max, metric, event_date, scheduled_time, participants_count, is_spouse, meet_record) values
  (1, '100m Run', 'Men (Below 45 Yrs)', 'male', null, 44, 'time_sec', '2025-02-28', '09:15', 15, false, '12.48s (Abhinav Singh)'),
  (2, '200m Run', 'Men (Below 45 Yrs)', 'male', null, 44, 'time_sec', '2025-03-01', '11:00', 12, false, '26.25s (M. Sivanageswara)'),
  (3, '400m Run', 'Men (Below 45 Yrs)', 'male', null, 44, 'time_sec', '2025-02-28', null, 5, false, null),
  (4, '800m Run', 'Men (Below 45 Yrs)', 'male', null, 44, 'time_sec', '2025-02-28', null, 8, false, null),
  (5, '1500m Run', 'Men (Below 45 Yrs)', 'male', null, 44, 'time_sec', '2025-03-01', null, 7, false, null),
  (6, '100m Run', 'Men (45 to Below 55 Yrs)', 'male', 45, 54, 'time_sec', '2025-02-28', null, 9, false, null),
  (7, '200m Run', 'Men (45 to Below 55 Yrs)', 'male', 45, 54, 'time_sec', '2025-03-01', null, 8, false, null),
  (8, '400m Run', 'Men (45 to 55 Yrs)', 'male', 45, 55, 'time_sec', '2025-02-28', null, 4, false, '60.8s (Narayana Moolya)'),
  (9, '800m Run', 'Men (45 to Below 55 Yrs)', 'male', 45, 54, 'time_sec', '2025-02-28', null, 6, false, null),
  (10, '1500m Run', 'Men (45 to Below 55 Yrs)', 'male', 45, 54, 'time_sec', '2025-03-01', null, 4, false, null),
  (11, '100m Run', 'Men (55 Yrs and Above)', 'male', 55, null, 'time_sec', '2025-02-28', null, 6, false, null),
  (12, '200m Run', 'Men (55 Yrs and Above)', 'male', 55, null, 'time_sec', '2025-03-01', null, 6, false, null),
  (18, 'Javelin Throw', 'Men (Below 45 Yrs)', 'male', null, 44, 'distance_m', '2025-02-28', null, 6, false, '39.47m (Khuntia P.A.)'),
  (48, 'Javelin Throw', 'Women (Below 40 Yrs)', 'female', null, 39, 'distance_m', '2025-02-28', null, 5, false, '17.45m (J Jnapika)'),
  (75, '100m Run', 'Girls (9 Below 12 Yrs)', 'girl', 9, 11, 'time_sec', '2025-03-01', '10:30', 21, false, null),
  (87, '100m Run', 'Women (Below 45 Yrs) Spouse', 'female', null, 44, 'time_sec', '2025-03-01', null, 9, true, '16.29s (Amita Bhivgade)')
on conflict (event_no) do update set
  name = excluded.name,
  category = excluded.category,
  event_date = excluded.event_date,
  scheduled_time = excluded.scheduled_time,
  participants_count = excluded.participants_count,
  is_spouse = excluded.is_spouse,
  meet_record = excluded.meet_record;

-- 4. Athletes
-- Registered athletes with BIB & unit
insert into athletes (bib_no, full_name, gender, unit_id) values
  (424, 'Mannem Sivanageswara', 'male', (select id from units where name = 'Mumbai Refinery')),
  (330, 'Abhinav Singh', 'male', (select id from units where name = 'Mumbai Refinery')),
  (800, 'Pushparaj', 'male', (select id from units where name = 'South Central Zone')),
  (798, 'Narayana Moolya', 'male', (select id from units where name = 'South Central Zone')),
  (791, 'Rajesh K Shetty', 'male', (select id from units where name = 'South Central Zone')),
  (20,  'Das Biswanath', 'male', (select id from units where name = 'East Zone')),
  (642, 'Khuntia P.A. Asitkanta', 'male', (select id from units where name = 'Petroleum House')),
  (836, 'Potluri Durga Prasad', 'male', (select id from units where name = 'Visakh Refinery')),
  (579, 'Ramath Mallikarjuna Naik', 'male', (select id from units where name = 'North West Zone')),
  (966, 'J Jnapika', 'female', (select id from units where name = 'Visakh Refinery')),
  (78,  'Mane Mrunali Vijay', 'female', (select id from units where name = 'Hindustan Bhawan')),
  (779, 'Kuruba Bharathi', 'female', (select id from units where name = 'South Central Zone')),
  (359, 'Amita Bhivgade', 'female', (select id from units where name = 'Mumbai Refinery')),
  (340, 'Rashmi Singh', 'female', (select id from units where name = 'Mumbai Refinery')),
  (288, 'Manisha', 'female', (select id from units where name = 'Mumbai Refinery')),
  -- Heat athletes
  (837, 'K. Venkatesh', 'male', (select id from units where name = 'Visakh Refinery')),
  (365, 'Sunil Sharma', 'male', (select id from units where name = 'Mumbai Refinery')),
  (783, 'P. R. Mohan', 'male', (select id from units where name = 'South Central Zone')),
  (405, 'Nitin Patil', 'male', (select id from units where name = 'Mumbai Refinery')),
  (851, 'G. Appa Rao', 'male', (select id from units where name = 'Visakh Refinery')),
  (845, 'T. Satyanarayana', 'male', (select id from units where name = 'Visakh Refinery')),
  (776, 'Suresh Babu', 'male', (select id from units where name = 'South Central Zone')),
  (398, 'Vijay Kadam', 'male', (select id from units where name = 'Mumbai Refinery')),
  (853, 'M. Rambabu', 'male', (select id from units where name = 'Visakh Refinery')),
  (852, 'V. Govind', 'male', (select id from units where name = 'Visakh Refinery')),
  (784, 'K. Ravi', 'male', (select id from units where name = 'South Central Zone')),
  -- Event 75 Girls (sample bibs)
  (341, 'Ananya Deshmukh', 'girl', (select id from units where name = 'Mumbai Refinery')),
  (65,  'Tanvi Sawant', 'girl', (select id from units where name = 'Hindustan Bhawan')),
  (255, 'Riya Verma', 'girl', (select id from units where name = 'North West Zone')),
  (212, 'Prisha Nair', 'girl', (select id from units where name = 'South Central Zone')),
  (298, 'Sneha Ghosh', 'girl', (select id from units where name = 'East Zone')),
  (265, 'Aditi Rao', 'girl', (select id from units where name = 'Visakh Refinery')),
  (271, 'Diya Sharma', 'girl', (select id from units where name = 'Mumbai Refinery')),
  (674, 'Kavya Patel', 'girl', (select id from units where name = 'Petroleum House')),
  (490, 'Ishita Roy', 'girl', (select id from units where name = 'East Zone')),
  (651, 'Ananya Mishra', 'girl', (select id from units where name = 'Petroleum House')),
  (732, 'Meera Reddy', 'girl', (select id from units where name = 'South Central Zone')),
  (189, 'Pooja Hegde', 'girl', (select id from units where name = 'South Central Zone')),
  (307, 'Aaradhya Patil', 'girl', (select id from units where name = 'Mumbai Refinery')),
  (472, 'Nikita Seth', 'girl', (select id from units where name = 'North West Zone')),
  (342, 'Vidhi Kulkarni', 'girl', (select id from units where name = 'Mumbai Refinery')),
  (49,  'Harshini K', 'girl', (select id from units where name = 'Visakh Refinery')),
  (647, 'Shruti Sen', 'girl', (select id from units where name = 'Petroleum House')),
  (635, 'Avantika Das', 'girl', (select id from units where name = 'East Zone')),
  (217, 'Ira Naidu', 'girl', (select id from units where name = 'South Central Zone')),
  (274, 'Bhavana Rao', 'girl', (select id from units where name = 'Visakh Refinery'))
on conflict (bib_no) do update set
  full_name = excluded.full_name,
  gender = excluded.gender,
  unit_id = excluded.unit_id;

-- Cash card athletes without bib/unit yet (seed with null bib_no)
insert into athletes (full_name, notes) values
  ('Santosh Kumar S', 'From Cash Card sheet Event 03'),
  ('Senthi Naresh Babu', 'From Cash Card sheet Event 03'),
  ('Chaudhary Aditya Prakash', 'From Cash Card sheet Event 03'),
  ('Paul Kuriakose', 'From Cash Card sheet Event 04 & 05'),
  ('Manmohan Tiwari', 'From Cash Card sheet Event 04'),
  ('Bandaru Chandra Sekhar', 'From Cash Card sheet Event 04 & 05'),
  ('Dharmendra Singh Yadav', 'From Cash Card sheet Event 05'),
  ('B Rajasekhar', 'From Cash Card sheet Event 06 & 07'),
  ('Pawar Prakash Narayan', 'From Cash Card sheet Event 06 & 07 (Split name with Durgadas)'),
  ('Durgadas', 'From Cash Card sheet Event 06 & 07 (Split name from Pawar Prakash Narayan Durgadas)'),
  ('Turkar Ghanshyam Shob', 'From Cash Card sheet Event 09 & 10 (deduped with Turkar Ghanshyam)'),
  ('Singh Mahendra', 'From Cash Card sheet Event 09 & 10'),
  ('Singh Manoj Kumar', 'From Cash Card sheet Event 10'),
  ('Gupta Harish', 'From Cash Card sheet Event 11 & 12'),
  ('Bipul Dinha Choudhury', 'From Cash Card sheet Event 11'),
  ('Jagadeesan NK', 'From Cash Card sheet Event 11'),
  ('Mondal Tapas Kumar', 'From Cash Card sheet Event 12'),
  ('A. Shanmugam', 'From Cash Card sheet Event 12')
on conflict do nothing;

-- 5. Results
-- Event 2 · 200m Men (<45)
insert into results (event_no, position, athlete_id, performance, result_date) values
  (2, 1, (select id from athletes where bib_no = 424), 26.25, '2025-03-01'),
  (2, 2, (select id from athletes where bib_no = 330), 26.64, '2025-03-01'),
  (2, 3, (select id from athletes where bib_no = 800), 27.03, '2025-03-01')
on conflict (event_no, position) do update set
  athlete_id = excluded.athlete_id,
  performance = excluded.performance;

-- Event 8 · 400m Men (45–55)
insert into results (event_no, position, athlete_id, performance, result_date) values
  (8, 1, (select id from athletes where bib_no = 798), 60.80, '2025-02-28'),
  (8, 2, (select id from athletes where bib_no = 791), 75.90, '2025-02-28'),
  (8, 3, (select id from athletes where bib_no = 20),  83.20, '2025-02-28')
on conflict (event_no, position) do update set
  athlete_id = excluded.athlete_id,
  performance = excluded.performance;

-- Event 18 · Javelin Throw Men (<45)
insert into results (event_no, position, athlete_id, performance, result_date) values
  (18, 1, (select id from athletes where bib_no = 642), 39.47, '2025-02-28'),
  (18, 2, (select id from athletes where bib_no = 836), 38.54, '2025-02-28'),
  (18, 3, (select id from athletes where bib_no = 579), 35.68, '2025-02-28')
on conflict (event_no, position) do update set
  athlete_id = excluded.athlete_id,
  performance = excluded.performance;

-- Event 48 · Javelin Throw Women (<40)
insert into results (event_no, position, athlete_id, performance, result_date) values
  (48, 1, (select id from athletes where bib_no = 966), 17.45, '2025-02-28'),
  (48, 2, (select id from athletes where bib_no = 78),  13.53, '2025-02-28'),
  (48, 3, (select id from athletes where bib_no = 779), 11.33, '2025-02-28')
on conflict (event_no, position) do update set
  athlete_id = excluded.athlete_id,
  performance = excluded.performance;

-- Event 87 · 100m Women (<45) Spouse
insert into results (event_no, position, athlete_id, performance, result_date) values
  (87, 1, (select id from athletes where bib_no = 359), 16.29, '2025-03-01'),
  (87, 2, (select id from athletes where bib_no = 340), 17.95, '2025-03-01'),
  (87, 3, (select id from athletes where bib_no = 288), 18.16, '2025-03-01')
on conflict (event_no, position) do update set
  athlete_id = excluded.athlete_id,
  performance = excluded.performance;

-- 6. Heats & Heat Entries
-- Event 1 Heats
insert into heats (event_no, heat_no, time_recorded) values
  (1, 1, '09:15 AM'),
  (1, 2, '09:25 AM'),
  (1, 3, '09:35 AM')
on conflict (event_no, heat_no) do nothing;

-- Event 1 Entries (all needs_verification = true)
insert into heat_entries (heat_id, bib_no, athlete_id, performance, rank_remark, needs_verification)
values
  -- Heat 1
  ((select id from heats where event_no = 1 and heat_no = 1), 579, (select id from athletes where bib_no = 579), 12.69, 'IV', true),
  ((select id from heats where event_no = 1 and heat_no = 1), 837, (select id from athletes where bib_no = 837), 12.94, 'VI', true),
  ((select id from heats where event_no = 1 and heat_no = 1), 365, (select id from athletes where bib_no = 365), 13.16, 'VIII', true),
  ((select id from heats where event_no = 1 and heat_no = 1), 783, (select id from athletes where bib_no = 783), 13.45, null, true),
  ((select id from heats where event_no = 1 and heat_no = 1), 405, (select id from athletes where bib_no = 405), 13.47, null, true),
  -- Heat 2
  ((select id from heats where event_no = 1 and heat_no = 2), 424, (select id from athletes where bib_no = 424), 12.52, 'II', true),
  ((select id from heats where event_no = 1 and heat_no = 2), 800, (select id from athletes where bib_no = 800), 12.88, 'V', true),
  ((select id from heats where event_no = 1 and heat_no = 2), 851, (select id from athletes where bib_no = 851), 13.22, null, true),
  ((select id from heats where event_no = 1 and heat_no = 2), 845, (select id from athletes where bib_no = 845), 13.49, null, true),
  ((select id from heats where event_no = 1 and heat_no = 2), 776, (select id from athletes where bib_no = 776), 14.48, null, true),
  -- Heat 3
  ((select id from heats where event_no = 1 and heat_no = 3), 398, (select id from athletes where bib_no = 398), null, 'No Time', true),
  ((select id from heats where event_no = 1 and heat_no = 3), 330, (select id from athletes where bib_no = 330), 12.48, 'I', true),
  ((select id from heats where event_no = 1 and heat_no = 3), 853, (select id from athletes where bib_no = 853), 12.67, 'III', true),
  ((select id from heats where event_no = 1 and heat_no = 3), 852, (select id from athletes where bib_no = 852), 13.02, 'VII', true),
  ((select id from heats where event_no = 1 and heat_no = 3), 784, (select id from athletes where bib_no = 784), 13.56, 'Re-timed 13.76', true);

-- Event 75 Heats (Girls 9 Below 12 Yrs)
insert into heats (event_no, heat_no, time_recorded) values
  (75, 1, '10:30 AM'),
  (75, 2, '10:45 AM'),
  (75, 3, '11:00 AM')
on conflict (event_no, heat_no) do nothing;

insert into heat_entries (heat_id, bib_no, athlete_id, performance, rank_remark, needs_verification)
values
  -- Heat 1
  ((select id from heats where event_no = 75 and heat_no = 1), 341, (select id from athletes where bib_no = 341), 16.26, '1', true),
  ((select id from heats where event_no = 75 and heat_no = 1), 65,  (select id from athletes where bib_no = 65),  17.16, 'corrected from 665', true),
  ((select id from heats where event_no = 75 and heat_no = 1), 255, (select id from athletes where bib_no = 255), 17.43, '3', true),
  ((select id from heats where event_no = 75 and heat_no = 1), 212, (select id from athletes where bib_no = 212), 18.50, '4', true),
  ((select id from heats where event_no = 75 and heat_no = 1), 298, (select id from athletes where bib_no = 298), 19.80, '5', true),
  ((select id from heats where event_no = 75 and heat_no = 1), 265, (select id from athletes where bib_no = 265), 20.06, '6', true),
  ((select id from heats where event_no = 75 and heat_no = 1), 271, (select id from athletes where bib_no = 271), null,  '7', true),
  -- Heat 2
  ((select id from heats where event_no = 75 and heat_no = 2), 674, (select id from athletes where bib_no = 674), 16.22, '1', true),
  ((select id from heats where event_no = 75 and heat_no = 2), 490, (select id from athletes where bib_no = 490), 16.40, '2', true),
  ((select id from heats where event_no = 75 and heat_no = 2), 651, (select id from athletes where bib_no = 651), 16.90, '3', true),
  ((select id from heats where event_no = 75 and heat_no = 2), 732, (select id from athletes where bib_no = 732), 20.08, '4', true),
  ((select id from heats where event_no = 75 and heat_no = 2), 189, (select id from athletes where bib_no = 189), 20.87, '5', true),
  ((select id from heats where event_no = 75 and heat_no = 2), 307, (select id from athletes where bib_no = 307), 21.04, '6', true),
  ((select id from heats where event_no = 75 and heat_no = 2), 472, (select id from athletes where bib_no = 472), null,  '7', true),
  -- Heat 3
  ((select id from heats where event_no = 75 and heat_no = 3), 342, (select id from athletes where bib_no = 342), 17.25, '1', true),
  ((select id from heats where event_no = 75 and heat_no = 3), 49,  (select id from athletes where bib_no = 49),  18.66, '2', true),
  ((select id from heats where event_no = 75 and heat_no = 3), 647, (select id from athletes where bib_no = 647), 19.31, '3', true),
  ((select id from heats where event_no = 75 and heat_no = 3), 635, (select id from athletes where bib_no = 635), 19.96, '4', true),
  ((select id from heats where event_no = 75 and heat_no = 3), 217, (select id from athletes where bib_no = 217), 20.40, '5', true),
  ((select id from heats where event_no = 75 and heat_no = 3), 274, (select id from athletes where bib_no = 274), 20.65, '6', true);

-- 7. Cash Cards (All 36 rows, signed = true)
insert into cash_cards (serial_no, event_no, position, athlete_id, amount_inr, signed, signed_at) values
  -- Event 1
  (1, 1, 'winner', (select id from athletes where full_name = 'Mannem Sivanageswara' limit 1), 5000, true, '2025-02-28'),
  (2, 1, 'runner_up', (select id from athletes where full_name = 'Abhinav Singh' limit 1), 4000, true, '2025-02-28'),
  (3, 1, 'first_runner_up', (select id from athletes where full_name = 'Pushparaj' limit 1), 3000, true, '2025-02-28'),
  -- Event 2
  (4, 2, 'winner', (select id from athletes where full_name = 'Mannem Sivanageswara' limit 1), 5000, true, '2025-03-01'),
  (5, 2, 'runner_up', (select id from athletes where full_name = 'Abhinav Singh' limit 1), 4000, true, '2025-03-01'),
  (6, 2, 'first_runner_up', (select id from athletes where full_name = 'Pushparaj' limit 1), 3000, true, '2025-03-01'),
  -- Event 3
  (7, 3, 'winner', (select id from athletes where full_name = 'Santosh Kumar S' limit 1), 5000, true, '2025-02-28'),
  (8, 3, 'runner_up', (select id from athletes where full_name = 'Senthi Naresh Babu' limit 1), 4000, true, '2025-02-28'),
  (9, 3, 'first_runner_up', (select id from athletes where full_name = 'Chaudhary Aditya Prakash' limit 1), 3000, true, '2025-02-28'),
  -- Event 4
  (10, 4, 'winner', (select id from athletes where full_name = 'Paul Kuriakose' limit 1), 5000, true, '2025-02-28'),
  (11, 4, 'runner_up', (select id from athletes where full_name = 'Manmohan Tiwari' limit 1), 4000, true, '2025-02-28'),
  (12, 4, 'first_runner_up', (select id from athletes where full_name = 'Bandaru Chandra Sekhar' limit 1), 3000, true, '2025-02-28'),
  -- Event 5
  (13, 5, 'winner', (select id from athletes where full_name = 'Paul Kuriakose' limit 1), 5000, true, '2025-03-01'),
  (14, 5, 'runner_up', (select id from athletes where full_name = 'Bandaru Chandra Sekhar' limit 1), 4000, true, '2025-03-01'),
  (15, 5, 'first_runner_up', (select id from athletes where full_name = 'Dharmendra Singh Yadav' limit 1), 3000, true, '2025-03-01'),
  -- Event 6
  (16, 6, 'winner', (select id from athletes where full_name = 'B Rajasekhar' limit 1), 5000, true, '2025-02-28'),
  (17, 6, 'runner_up', (select id from athletes where full_name = 'Pawar Prakash Narayan' limit 1), 4000, true, '2025-02-28'),
  (18, 6, 'first_runner_up', (select id from athletes where full_name = 'Durgadas' limit 1), 3000, true, '2025-02-28'),
  -- Event 7
  (19, 7, 'winner', (select id from athletes where full_name = 'B Rajasekhar' limit 1), 5000, true, '2025-03-01'),
  (20, 7, 'runner_up', (select id from athletes where full_name = 'Pawar Prakash Narayan' limit 1), 4000, true, '2025-03-01'),
  (21, 7, 'first_runner_up', (select id from athletes where full_name = 'Durgadas' limit 1), 3000, true, '2025-03-01'),
  -- Event 8
  (22, 8, 'winner', (select id from athletes where full_name = 'Narayana Moolya' limit 1), 5000, true, '2025-02-28'),
  (23, 8, 'runner_up', (select id from athletes where full_name = 'Rajesh K Shetty' limit 1), 4000, true, '2025-02-28'),
  (24, 8, 'first_runner_up', (select id from athletes where full_name = 'Das Biswanath' limit 1), 3000, true, '2025-02-28'),
  -- Event 9
  (25, 9, 'winner', (select id from athletes where full_name = 'Narayana Moolya' limit 1), 5000, true, '2025-02-28'),
  (26, 9, 'runner_up', (select id from athletes where full_name = 'Turkar Ghanshyam Shob' limit 1), 4000, true, '2025-02-28'),
  (27, 9, 'first_runner_up', (select id from athletes where full_name = 'Singh Mahendra' limit 1), 3000, true, '2025-02-28'),
  -- Event 10
  (28, 10, 'winner', (select id from athletes where full_name = 'Turkar Ghanshyam Shob' limit 1), 5000, true, '2025-03-01'),
  (29, 10, 'runner_up', (select id from athletes where full_name = 'Singh Mahendra' limit 1), 4000, true, '2025-03-01'),
  (30, 10, 'first_runner_up', (select id from athletes where full_name = 'Singh Manoj Kumar' limit 1), 3000, true, '2025-03-01'),
  -- Event 11
  (31, 11, 'winner', (select id from athletes where full_name = 'Gupta Harish' limit 1), 5000, true, '2025-02-28'),
  (32, 11, 'runner_up', (select id from athletes where full_name = 'Bipul Dinha Choudhury' limit 1), 4000, true, '2025-02-28'),
  (33, 11, 'first_runner_up', (select id from athletes where full_name = 'Jagadeesan NK' limit 1), 3000, true, '2025-02-28'),
  -- Event 12
  (34, 12, 'winner', (select id from athletes where full_name = 'Mondal Tapas Kumar' limit 1), 5000, true, '2025-03-01'),
  (35, 12, 'runner_up', (select id from athletes where full_name = 'Gupta Harish' limit 1), 4000, true, '2025-03-01'),
  (36, 12, 'first_runner_up', (select id from athletes where full_name = 'A. Shanmugam' limit 1), 3000, true, '2025-03-01')
on conflict (serial_no) do update set
  event_no = excluded.event_no,
  position = excluded.position,
  athlete_id = excluded.athlete_id,
  amount_inr = excluded.amount_inr,
  signed = excluded.signed,
  signed_at = excluded.signed_at;

