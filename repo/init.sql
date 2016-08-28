create table article(
      `id` INTEGER PRIMARY KEY AUTOINCREMENT,
      `title` TEXT,
      `abstract` TEXT,
      `markedContent` TEXT,
      `parsedContent` TEXT,
      `isPublish` BOOLEAN ,
      `tags` TEXT,
      `createTime` datetime
  );
