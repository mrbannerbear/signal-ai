/* eslint-disable @typescript-eslint/no-explicit-any */
export const mapProfileToDb = (data: any, profileId?: string) => ({
  profile: {
    first_name: data.firstName,
    last_name: data.lastName,
    headline: data.headline,
    bio: data.bio,
    skills: JSON.stringify(data.skills),
    location: data.location,
    portfolio_url: data.portfolioUrl,
    linkedin_url: data.linkedinUrl,
  },
  experience: data.experience?.map((exp: any) => ({
    profile_id: profileId,
    company_name: exp.companyName,
    role: exp.role,
    location: exp.location,
    start_date: exp.startDate,
    // LOGIC: If isCurrent is true, end_date must be null
    end_date: exp.isCurrent ? null : exp.endDate,
    is_current: exp.isCurrent,
    description: exp.description,
    position: exp.position,
  })),
  education: data.education?.map((edu: any) => ({
    profile_id: profileId,
    institution: edu.institution,
    degree: edu.degree,
    start_date: edu.startDate,
    graduation_date: edu.graduationDate,
    position: edu.position,
  })),
});

export const mapDbToProfile = (data: any) => ({
  id: data.id,
  firstName: data.first_name,
  lastName: data.last_name,
  headline: data.headline,
  bio: data.bio,
  skills: data.skills ? JSON.parse(data.skills) : [],
  location: data.location,
  portfolioUrl: data.portfolio_url,
  linkedinUrl: data.linkedin_url,
  experience: data.experience?.map((exp: any) => ({
    id: exp.id,
    companyName: exp.company_name,
    role: exp.role,
    location: exp.location,
    startDate: exp.start_date ? new Date(exp.start_date) : null,
    endDate: exp.end_date ? new Date(exp.end_date) : null,
    isCurrent: exp.is_current,
    description: exp.description,
    position: exp.position,
  })),
  education: data.education?.map((edu: any) => ({
    id: edu.id,
    institution: edu.institution,
    degree: edu.degree,
    startDate: edu.start_date ? new Date(edu.start_date) : null,
    graduationDate: edu.graduation_date ? new Date(edu.graduation_date) : null,
    position: edu.position,
  })),
});