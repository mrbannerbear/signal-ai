# Resume Parser Documentation

This document outlines the architecture, logic, and safeguards implementation for the Resume Parser feature in the Career Signal Dashboard.

## 1. Overview
The Resume Parser allows users to upload a PDF resume, extracting structured data (Profile, Experience, Education, Skills) using Google Gemini AI. The system is designed to be efficient, cost-effective, and protected against abuse.

## 2. Architecture & Data Flow

### Step 1: File Selection & Hashing
When a user selects a file, the client immediately generates a unique **File Hash** to identify the document.
-   **Hash Logic**: `${fileName}-${fileSize}-${lastModifiedTimestamp}`
-   **Purpose**: To detect exact duplicates instantly without uploading the file content.

### Step 2: Server-Side Processing (`actions/resume.ts`)
The client sends the extracted text and the metadata (Hash & Name) to the server.

#### A. Cache Check (Optimization)
Before calling the AI, the server queries the `resumes` database table:
-   **Query**: `SELECT content FROM resumes WHERE user_id = current_user AND file_hash = uploaded_hash`
-   **Hit**: If found, returns the stored JSON instantly. **0 Cost, 0 Latency.**
-   **Miss**: Proceeds to Rate Limiting.

#### B. Rate Limiting (Abuse Prevention)
The system checks how many *new* resumes the user has parsed in the last hour.
-   **Limit**: 5 Parses / Hour.
-   **Logic**: Count records in `resumes` table (`created_at > 1_hour_ago`).
-   **Action**: If limit exceeded, throws stricter error: "Rate limit exceeded".

#### C. AI Extraction
If Cache Miss + Within Limit:
1.  Sends sanitized text to Google Gemini Flash 2.5.
2.  Prompt enforces strict JSON schema matching our `ResumeProfile` type.
3.  Returns structured data (First Name, Bio, Bullet Points, etc.).

#### D. Persistence
The successful result is saved to the `resumes` table using an **Upsert** strategy:
-   **Conflict Handling**: `ON CONFLICT (user_id, file_hash) DO NOTHING`
-   **Why**: Prevents race conditions if a user double-clicks or uploads in parallel tabs.

### Step 3: Client Integration
-   **ResumeParser.tsx**: Receives the data and triggers `onApply(data)`.
-   **ProfilePageContent.tsx**: Wraps the data and passes it to the form.
-   **ProfileForm.tsx**: Smartly merges the data:
    -   *Scalar Fields (Bio, Headline)*: Only fills if currently empty.
    -   *Experience/Education*: Populates if lists are empty.
    -   *Skills*: Merges new unique skills into existing list.

## 3. Database Schema

### Table: `resumes`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `user_id` | UUID | Owner (Foreign Key to `auth.users`) |
| `file_hash` | TEXT | Unique identifier for file version |
| `file_name` | TEXT | Original filename for reference |
| `content` | JSONB | The full parsed `ResumeProfile` object |
| `created_at` | TIMESTAMPTZ | Creation time (used for Rate Limiting) |

**Constraints**:
-   `UNIQUE INDEX (user_id, file_hash)`: Guarantees no duplicates per user.
-   `RLS Policy`: Users can strictly only SELECT and INSERT their own records (`auth.uid() = user_id`).

## 4. Key Functions

-   **`generateFileHash(file)`** (`utils/parseResume.ts`): Client-side hash generation.
-   **`formatResumeData(text, meta)`** (`actions/resume.ts`): Server action handling logic flow.
-   **`ProfileForm.useEffect`**: Handles the UI merging logic.
