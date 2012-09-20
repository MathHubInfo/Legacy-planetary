-- 2001 (and earlier)
select COUNT(*) from comment where created < 1009864800 ;
select COUNT(*) from node where type = 'forum' and created < 1009864800 ;
select COUNT(*) from node where type = 'article' and created < 1009864800 ;
select COUNT(*) from users where created < 1009864800 ;
select COUNT(*) from node where type = 'correction' and created < 1009864800 ;

-- 2002
select COUNT(*) from comment where created > 1009864800 and created < 1041400800;
select COUNT(*) from node where type = 'forum' and created > 1009864800 and created < 1041400800;
select COUNT(*) from node where type = 'article' and created > 1009864800 and created < 1041400800;
select COUNT(*) from users where created > 1009864800 and created < 1041400800;
select COUNT(*) from node where type = 'correction' and created > 1009864800 and created < 1041400800;

-- 2003
select COUNT(*) from comment where created > 1041400800 and created < 1072936800;
select COUNT(*) from node where type = 'forum' and created > 1041400800 and created < 1072936800;
select COUNT(*) from node where type = 'article' and created > 1041400800 and created < 1072936800;
select COUNT(*) from users where created > 1041400800 and created < 1072936800;
select COUNT(*) from node where type = 'correction' and created >1041400800 and created < 1072936800;

-- 2004
select COUNT(*) from comment where created > 1072936800 and created < 1104559200;
select COUNT(*) from node where type = 'forum' and created > 1072936800 and created < 1104559200;
select COUNT(*) from node where type = 'article' and created > 1072936800 and created < 1104559200;
select COUNT(*) from users where created >  1072936800 and created < 1104559200;
select COUNT(*) from node where type = 'correction' and created > 1072936800 and created < 1104559200;

-- 2005
select COUNT(*) from comment where created > 1104559200 and created < 1136095200 ;
select COUNT(*) from node where type = 'forum' and created > 1104559200 and created < 1136095200 ;
select COUNT(*) from node where type = 'article' and created > 1104559200 and created < 1136095200 ;
select COUNT(*) from users where created >  1072936800 and created < 1104559200 and created < 1136095200 ;
select COUNT(*) from node where type = 'correction' and created > 1104559200 and created < 1136095200;

-- 2006
select COUNT(*) from comment where created > 1136095200 and created < 1167631200;
select COUNT(*) from node where type = 'forum' and created > 1136095200 and created < 1167631200 ;
select COUNT(*) from node where type = 'article' and created > 1136095200 and created < 1167631200;
select COUNT(*) from users where created > 1136095200 and created < 1167631200 ;
select COUNT(*) from node where type = 'correction' and created > 1136095200 and created < 1167631200;

-- 2007
select COUNT(*) from comment where created > 1167631200  and created < 1199167200;
select COUNT(*) from node where type = 'forum' and created > 1167631200  and created < 1199167200;
select COUNT(*) from node where type = 'article' and created > 1167631200  and created < 1199167200;
select COUNT(*) from users where created > 1167631200  and created < 1199167200;
select COUNT(*) from node where type = 'correction' and created > 1167631200 and created < 1199167200;

-- 2008
select COUNT(*) from comment where created > 1199167200 and created < 1230789600 ;
select COUNT(*) from node where type = 'forum' and created > 1199167200 and created < 1230789600 ;
select COUNT(*) from node where type = 'article' and created > 1199167200 and created < 1230789600 ;
select COUNT(*) from users where created > 1199167200 and created < 1230789600 ;
select COUNT(*) from node where type = 'correction' and created > 1199167200 and created < 1230789600 ;

-- 2009
select COUNT(*) from comment where created > 1230789600 and created < 1262325600 ;
select COUNT(*) from node where type = 'forum' and created > 1230789600 and created < 1262325600 ;
select COUNT(*) from node where type = 'article' and created > 1230789600 and created < 1262325600 ;
select COUNT(*) from users where created > 1230789600 and created < 1262325600 ;
select COUNT(*) from node where type = 'correction' and created > 1230789600 and created < 1262325600 ;

-- 2010
select COUNT(*) from comment where created > 1262325600 and created < 1293861600;
select COUNT(*) from node where type = 'forum' and created > 1262325600 and created < 1293861600;
select COUNT(*) from node where type = 'article' and created > 1262325600 and created < 1293861600;
select COUNT(*) from users where created > 1262325600 and created < 1293861600;
select COUNT(*) from node where type = 'correction' and created > 1262325600 and created < 1293861600;

-- 2011
select COUNT(*) from comment where created > 1293861600 and created < 1325397600;
select COUNT(*) from node where type = 'forum' and created > 1293861600 and created < 1325397600;
select COUNT(*) from node where type = 'article' and created > 1293861600 and created < 1325397600;
select COUNT(*) from users where created > 1293861600 and created < 1325397600;
select COUNT(*) from node where type = 'correction' and created > 1293861600 and created < 1325397600;



-- 2012 (year to date)
select COUNT(*) from comment where created > 1325397600;
select COUNT(*) from node where type = 'forum' and created > 1325397600;
select COUNT(*) from node where type = 'article' and created > 1325397600;
select COUNT(*) from users where created > 1325397600;
select COUNT(*) from node where type = 'correction' and created > 1325397600;



-- totals
select COUNT(*) from comment;
select COUNT(*) from node where type = 'forum';
select COUNT(*) from node where type = 'article';
select COUNT(*) from users;
select COUNT(*) from node where type = 'correction';
