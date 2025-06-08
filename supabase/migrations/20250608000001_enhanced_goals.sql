/*
  # Update goals table to support enhanced goal structure

  This migration adds comments to document the enhanced goal structure
  that will be stored in the jsonb goal_data column.
  
  The enhanced structure includes:
  - checkpoints
  - AI analysis
  - subtasks
  - timelines
  
  Since we're using JSONB for storage, no schema changes are needed,
  but we're adding comments to document the structure.
*/

-- Add comments to document the enhanced goal structure
COMMENT ON COLUMN goals.goal_data IS 
'JSONB object containing the complete goal data with the following structure:
{
  "id": "string",
  "title": "string",
  "description": "string",
  "timeframe": "string",
  "category": "string",
  "progress": number,
  "milestones": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "month": number,
      "completed": boolean,
      "tasks": [
        {
          "id": "string",
          "title": "string",
          "description": "string",
          "completed": boolean,
          "priority": "low|medium|high",
          "estimatedHours": number,
          "resources": ["string"]
        }
      ],
      "subtasks": [
        {
          "id": "string",
          "title": "string",
          "description": "string",
          "completed": boolean,
          "parentTaskId": "string"
        }
      ],
      "timeline": {
        "startDate": "YYYY-MM-DD",
        "endDate": "YYYY-MM-DD",
        "keyDates": [
          {
            "date": "YYYY-MM-DD",
            "description": "string"
          }
        ]
      }
    }
  ],
  "checkpoints": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "targetDate": "YYYY-MM-DD",
      "achieved": boolean,
      "milestoneId": "string"
    }
  ],
  "aiAnalysis": {
    "strengths": ["string"],
    "challenges": ["string"],
    "recommendations": ["string"]
  }
}'; 