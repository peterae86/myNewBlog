create table article(
      `id` INTEGER PRIMARY KEY AUTOINCREMENT,
      `title` TEXT,
      `abstract` TEXT,
      `markedContent` TEXT,
      `parsedContent` TEXT,
      `createTime` datetime
  );

select * from article;

insert into article(`title`,`abstract`,`markedContent`,`parsedContent`,`createTime`) values ('dsdad','dasda','ssss','xxxxx',DATE('now'));