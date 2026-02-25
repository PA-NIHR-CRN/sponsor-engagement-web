-- remove the sponsor contact role for users not a sponsor contact for any org

UPDATE `sponsorengagement`.`UserRole` ur 
SET 
    ur.isDeleted = 1
WHERE
    ur.roleId = 1 and ur.userId NOT IN ( SELECT 
            uo.userId
        FROM
            UserOrganisation uo 
        WHERE
			uo.isDeleted = 0
        GROUP BY uo.userId
        )