-- @param {String} $1:like
SELECT 
  "User".id,
  "User".username,
  "User".name,
  "UserImage".id AS imageId,
  "UserImage".objectKey AS imageObjectKey
FROM "User"
LEFT JOIN "UserImage" ON "User".id = "UserImage".userId
WHERE "User".username LIKE :like
OR "User".name LIKE :like
ORDER BY (
  SELECT "Note".updatedAt
  FROM "Note"
  WHERE "Note".ownerId = "User".id
  ORDER BY "Note".updatedAt DESC
  LIMIT 1
) DESC
LIMIT 50
