# Do not change the order or names of states 
#(the code is assuming specific IDs and names)
# You can add more in the end
insert into game_state (gst_state) values ('Waiting');
insert into game_state (gst_state) values ('Started');
insert into game_state (gst_state) values ('Finished');
insert into game_state (gst_state) values ('Canceled');

# Do not change the order, but you can add more in the end
insert into user_game_state (ugst_state) values ('Waiting');
insert into user_game_state (ugst_state) values ('Playing');
insert into user_game_state (ugst_state) values ('End');

# Possible end game states
insert into scoreboard_state (sbs_state) values ('Lost');
insert into scoreboard_state (sbs_state) values ('Won');

insert into card_position (pos_name) values ('Deck'),('Hand'),('Slot 1'),('Slot 2'),('Slot 3'),('Cemitery');

insert into card (crd_name, crd_atk, crd_def,  crd_abl, crd_desc) values 
   ("Bob",500,500,"Switches the players hp with the opponents hp.","Just a regular stickman with an average life."),
   ("Ninja",600,400,"Attacks twice.","A lonely warrior that walks on the shadows looking to avenge his village."),
   ("Angel",300,300,"Cures 20% of the players missing health.","Comes from the sky and uses his divine power to protect the weaker."),
   ("Warrior",600,600,"Double of the shield.","With his full armor, shield and sword he can battle a full squad of warriors by himself to protect his kingdom."),
   ("Dr. Familiar",500,500,"Removes the ability from the card in front.","He used to be a doctor, now he is the great wizard and belongs to a group of super individuals."),
   ("Sus Bob",300,300,"The opponent can't take a card in the next turn.","He looks like one of us but he acts kinda sus. Likes to sabotage others."),
   ("Soldier",500,500,"Throws a grenade and takes 200 health directly from the player.","He is looking for peace but first he has to fight a war."),
   ("Cyborg",600,300,"All stats increase 50%.","He lost his body but now he is a machine."),
   ("Samurai",600,600,"Protects the enemy attack with his sword and gives the damage back.","He can defend himself with only a sword. His discipline and honor can lead him to great things."),
   ("Joker",100,100,"Switch this card with the card in front of it.","He is a psychopathic clown that likes to prank, but be careful when around him."),
   ("Chef",400,300,"Cooks a food and depending on the food, it gives you a percentage of health missing, between 30% and 70%.","He is one of the best cooks in the universe but don't mess with him he might cut you in half."),
   ("Game Dev",500,500,"Uses a cheat code giving double attack to all allied cards on the field.","In the real world he is known as a geek but online he is a superhero."),
   ("Bob Rocky",600,500,"With his punches breaks the enemy shield giving all the damage to the player.","One of the best boxers in the universe, he is not afraid of anyone. His record is 175-0-0, 110 by KO."),
   ("The Reaper",600,200,"Take a card of your choice from the graveyard.","He is also known as the death, but he is a nice guy."),
   ("Bobnaldinho",400,200,"The enemy card fouls the football player and can't play for a turn.","He is also known as the magician, because when he has a football on his foot he can do whatever he wants."),
   ("Super Strong Blonde Bob",600,500,"With his teleportation ability he changes his spot with another ally card.","He belongs to a race of conquerors from planet Vegeta, but he has a good heart. He has a monkey tail and sometimes his hair turns blonde and gets super strong but we don't know why."),
   ("The Straw Hat Pirate",600,500,"It steals a card of your choice from the enemy's deck by stretching his arm.","A young and optimistic pirate that ate one of the devil fruits and now his body is like rubber."),
   ("Bomberman",0,0,"He creates a massive explosion and both cards are destroyed .","He has always been seen as a danger but is willing to put down his life to help others. He is the real hero."),
   ("The Real Stickman",200,600,"He throws a lot of sticks at the opponent and gives him a concussion taking 150 shield from the card and 150 HP from the player.","He is literally a stickman made from wooden sticks."),
   ("The Hitman",600,300,"He insta kills the opponent card in front.","He is a stickman that is a hitman. When he gets a specific target he always gets the job done.");

INSERT INTO user VALUES (1,'me','$2b$10$Wemfac2wY/7RSCdKxuYUL.GV2clfhXC66OL76uCpDFUmpYZ/bGZtW','48MnTVJ6sKIvanVHbP5Vx5rysbYrVN4EbYmk4D8xESdfm1hx8jDfNFZGNw9OZs'),(2,'me2','$2b$10$6j2xIDnnxv.TLfBSstbbO.qE7wFTf5envx/uijiFjCP3slsy7EE4K','dQ7NrsbPsuF81xFGNioR1K0tiYkjtxOhemcgMhuFIS68VrFUC9gggm3JCgzkqe');
INSERT INTO game VALUES (1,1,2);
INSERT INTO user_game VALUES (1,1,1,1,2),(2,2,2,1,1);

INSERT INTO user_game_card VALUES 
# ------------ player 1 deck
   (1,1,1,3,1,1),
   (2,1,2,2,1,1),
   (3,1,3,4,1,1),
   (4,1,4,1,1,1),
   (5,1,5,2,1,1),
   (6,1,6,1,1,1),
   (7,1,7,2,1,1),
   (8,1,8,1,1,1),
   (9,1,9,1,1,1),
   (10,1,10,1,1,1),
   (11,1,11,1,1,1),
   (12,1,12,1,1,1),
   (13,1,13,1,1,1),
   (14,1,14,1,1,1),
   (15,1,15,1,1,1),
   (16,1,16,1,1,1),
   (17,1,17,1,1,1),
   (18,1,18,1,1,1),
   (19,1,19,1,1,1),
   (20,1,20,1,1,1),
# ------------ player 2 deck
   (21,2,1,1,1,1),
   (22,2,2,1,1,1),
   (23,2,3,1,1,1),
   (24,2,4,1,1,1),
   (25,2,5,1,1,1),
   (26,2,6,2,1,1),
   (27,2,7,2,1,1),
   (28,2,8,2,1,1),
   (29,2,9,4,1,1),
   (30,2,10,3,1,1),
   (31,2,11,1,1,1),
   (32,2,12,1,1,1),
   (33,2,13,1,1,1),
   (34,2,14,1,1,1),
   (35,2,15,1,1,1),
   (36,2,16,1,1,1),
   (37,2,17,1,1,1),
   (38,2,18,1,1,1),
   (39,2,19,1,1,1),
   (40,2,20,1,1,1);

