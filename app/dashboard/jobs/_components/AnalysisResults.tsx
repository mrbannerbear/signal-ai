"use client";

import { JobAnalysisOutput } from "@/schemas/job-analysis.schema";

interface AnalysisResultsProps {
  analysis: JobAnalysisOutput;
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  if (!analysis) return null;

  return (
    <div className="space-y-6">
      {/* Overall Fit Score */}
      {analysis.overallFitScore && (
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Overall Fit</h2>
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-lg font-bold ${
                analysis.overallFitScore.score >= 70
                  ? "bg-green-100 text-green-700"
                  : analysis.overallFitScore.score >= 40
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {analysis.overallFitScore.score}%
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {analysis.overallFitScore.explanation}
          </p>
        </section>
      )}

      {/* Summary */}
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Summary</h2>
        <p className="text-muted-foreground">{analysis.summary?.overview}</p>
        {analysis.summary?.keyPoints && (
          <ul className="mt-4 space-y-2">
            {analysis.summary.keyPoints.map((point: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {point}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Skills Analysis */}
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Skills Analysis</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              Required
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.skills?.required?.map((skill: string, i: number) => (
                <span
                  key={i}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              Preferred
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.skills?.preferred?.map((skill: string, i: number) => (
                <span
                  key={i}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          {analysis.skills?.matchingSkills?.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                Your Matches ✓
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.skills.matchingSkills.map(
                  (skill: string, i: number) => (
                    <span
                      key={i}
                      className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Skill Gaps */}
      {analysis.gaps?.missingSkills?.length > 0 && (
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Skill Gaps</h2>
            {analysis.gaps.riskLevel && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  analysis.gaps.riskLevel === "high"
                    ? "bg-red-100 text-red-700"
                    : analysis.gaps.riskLevel === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                }`}
              >
                {analysis.gaps.riskLevel} risk
              </span>
            )}
          </div>
          <div className="space-y-3">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {analysis.gaps.recommendations?.map((rec: any, i: number) => (
              <div key={i} className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {rec.skill || analysis.gaps.missingSkills[i]}
                  </span>
                  {rec.timeEstimate && (
                    <span className="text-xs text-muted-foreground">
                      {rec.timeEstimate}
                    </span>
                  )}
                </div>
                {rec.action && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {rec.action}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Seniority & Location */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Seniority</h2>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium capitalize text-purple-700">
              {analysis.seniority?.level}
            </span>
            <span className="text-sm text-muted-foreground">
              {analysis.seniority?.yearsExpected} years
            </span>
          </div>
          {analysis.seniority?.candidateFit && (
            <p className="mt-3 text-sm text-muted-foreground">
              {analysis.seniority.candidateFit}
            </p>
          )}
        </section>

        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Location</h2>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium capitalize">
              {analysis.location?.type}
            </span>
            <span className="text-sm">{analysis.location?.location}</span>
          </div>
          {analysis.location?.candidateMatch && (
            <p className="mt-3 text-sm text-muted-foreground">
              {analysis.location.candidateMatch}
            </p>
          )}
        </section>
      </div>

      {/* Resume Edits */}
      {analysis.suggestions?.resumeEdits?.length > 0 && (
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Resume Suggestions</h2>
          <div className="space-y-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {analysis.suggestions.resumeEdits.map((edit: any, i: number) => (
              <div
                key={i}
                className="rounded-lg border-l-4 border-primary bg-muted/30 p-4"
              >
                <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {edit.targetSection}
                </div>
                <p className="mb-2 text-sm">{edit.why}</p>
                {edit.exampleRewrite && (
                  <div className="rounded bg-background p-3 text-sm italic">
                    &quot;{edit.exampleRewrite}&quot;
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interview Prep */}
      {analysis.suggestions?.interviewAngles?.length > 0 && (
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Interview Prep</h2>
          <div className="space-y-4">
            {analysis.suggestions.interviewAngles.map(
                
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (angle: any, i: number) => (
                <div key={i} className="rounded-lg bg-muted/50 p-4">
                  <h3 className="font-medium">{angle.topic}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <span className="font-medium">Why they care:</span>{" "}
                    {angle.whyTheyCare}
                  </p>
                  {angle.howToAnswer && (
                    <p className="mt-2 text-sm">
                      <span className="font-medium">Your angle:</span>{" "}
                      {angle.howToAnswer}
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* Red Flags */}
      {analysis.suggestions?.redFlags?.length > 0 && (
        <section className="rounded-xl border border-red-200 bg-red-50/50 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-red-700">
            Potential Red Flags
          </h2>
          <div className="space-y-3">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {analysis.suggestions.redFlags.map((flag: any, i: number) => (
              <div key={i} className="rounded-lg bg-white p-4">
                <p className="font-medium text-red-700">{flag.risk}</p>
                {flag.mitigation && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    <span className="font-medium">Mitigation:</span>{" "}
                    {flag.mitigation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
