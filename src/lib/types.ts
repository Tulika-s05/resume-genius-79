export interface ProjectFeedback {
  title: string;
  feedback: string;
}

export interface AnalysisResult {
  overall_score: number;
  ats_score: number;
  keyword_score: number;
  skills_score: number;
  formatting_score: number;
  summary: string;
  matched_skills: string[];
  missing_skills: string[];
  strengths: string[];
  improvements: string[];
  project_feedback: ProjectFeedback[];
}

export interface AnalysisResponse {
  id: number;
  filename: string;
  target_role: string | null;
  resume_text: string;
  created_at: string;
  analysis: AnalysisResult;
}

export interface HistoryItem {
  id: number;
  filename: string;
  target_role: string | null;
  overall_score: number;
  created_at: string;
}

export interface JobMatchResult {
  match_score: number;
  matching_skills: string[];
  missing_keywords: string[];
  recommended_changes: string[];
}
