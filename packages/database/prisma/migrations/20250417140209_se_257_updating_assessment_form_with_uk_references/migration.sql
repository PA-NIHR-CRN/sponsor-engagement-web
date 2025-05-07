-- Updating assessment status descriptions.

UPDATE sponsorengagement.SysRefAssessmentStatus
SET description = CASE 
					WHEN name = 'On track' THEN 'The sponsor or delegate is satisfied the study is progressing in the UK as planned.'
                    WHEN name = 'Off track' THEN 'The sponsor or delegate has some concerns about the study in the UK and is taking action where appropriate.'
				  END
WHERE id in (1, 2);