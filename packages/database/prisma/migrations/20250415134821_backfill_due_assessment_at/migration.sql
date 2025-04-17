UPDATE Study dest, (
	SELECT s.id, GREATEST(                                      -- Study is due assessment on the later of:
		COALESCE(DATE_ADD(a.createdAt, INTERVAL 3 MONTH), 0),   -- 3 months after the last assessment
        COALESCE(MIN(c.createdAt), 0)                           -- or when the first active evaluation category was calculated
	) AS dueAssessmentAt
	FROM Study s 
	LEFT JOIN Assessment a
	ON a.id = s.lastAssessmentId
	LEFT JOIN StudyEvaluationCategory c ON c.studyId = s.id 
	WHERE s.isDueAssessment = 1 
	AND s.isDeleted = 0
	AND (c.isDeleted IS NULL OR c.isDeleted = 0)
	GROUP BY s.id
) AS src
SET dest.dueAssessmentAt = src.dueAssessmentAt
WHERE dest.id = src.id AND dest.dueAssessmentAt IS NULL;