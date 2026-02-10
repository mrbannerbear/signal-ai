// "[{"name":"Next.js","level":"Intermediate"},{"name":"TypeScript","level":"Intermediate"},{"name":"User Experience (UX)","level":"Intermediate"},{"name":"JavaScript","level":"Intermediate"},{"name":"React.js","level":"Intermediate"},{"name":"Express.js","level":"Intermediate"}]"
// output: [{name: "Next.js", level: "Intermediate"}, {name: "TypeScript", level: "Intermediate"}, ...]

export function parseProfileSkills(skillsJson: string) {
  try {
    const skills = JSON.parse(skillsJson);
    if (Array.isArray(skills)) {
      return skills.map((skill) => ({
        name: skill.name || "Unnamed Skill",
        level: skill.level || "Intermediate",
      }));
    } else {
      return [];
    }
  } catch {
    return [];
  }
}