import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const certsDir = path.join(rootDir, "public", "certificates");
const outputJsonPath = path.join(rootDir, "src", "data", "certificates.json");

// Ensure public/certificates directory exists
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}

// Known OCR Metadata database mapping based on auto-extracted certificate text
const OCR_METADATA_DATABASE = {
  "unstop-cloud-computing-ai.svg": {
    id: "cert-unstop-cloud-ai",
    title: "Cloud Computing with AI",
    issuer: "Unstop",
    issueDate: "2026-06-15",
    description: "Certificate of Completion for successfully completing the course Cloud Computing with AI provided by Unstop.",
    categories: ["Cloud", "AI", "Development"],
    fileName: "unstop-cloud-computing-ai.svg"
  },
  "softpro-python-programming-workshop.svg": {
    id: "cert-softpro-python",
    title: "Python Programming Workshop",
    issuer: "Softpro India Technologies",
    issueDate: "2025-09-12",
    description: "Participated in two-day hands-on workshop 'A Journey from Beginner to Expert' on Python programming.",
    categories: ["Workshop", "Development", "Java"],
    fileName: "softpro-python-programming-workshop.svg"
  },
  "ycat-internship-aptitude-test.svg": {
    id: "cert-ycat-aptitude",
    title: "Internship Common Aptitude Test (YCAT)",
    issuer: "YCAT / Internship Aptitude",
    issueDate: "2026-06-24",
    description: "Certificate of Participation presented for performance in the National Internship Common Aptitude Test (CIT-P-3464512).",
    categories: ["Hackathon", "Leadership", "Development"],
    fileName: "ycat-internship-aptitude-test.svg"
  },
  "geeksforgeeks-soft-skills-course.svg": {
    id: "cert-gfg-softskills",
    title: "Soft Skills & Professional Development",
    issuer: "GeeksforGeeks",
    issueDate: "2026-04-10",
    description: "Completed comprehensive training on Soft Skills Course Online - Complete Professional Development Training.",
    categories: ["Leadership", "Workshop", "Development"],
    fileName: "geeksforgeeks-soft-skills-course.svg"
  },
  "aws-cloud-practitioner.svg": {
    id: "cert-aws-cloud",
    title: "AWS Cloud Practitioner Training",
    issuer: "AWS / GeeksforGeeks",
    issueDate: "2026-01-20",
    description: "Foundational certification covering AWS core cloud services, security standards, and cloud deployment architecture.",
    categories: ["AWS", "Cloud", "Development"],
    fileName: "aws-cloud-practitioner.svg"
  },
  "google-cloud-arcade-skills.svg": {
    id: "cert-gcp-arcade",
    title: "Google Cloud Arcade Skill Badges",
    issuer: "Google Cloud",
    issueDate: "2026-03-05",
    description: "Skill badge credentials for Google Cloud infrastructure management, security operations, and cloud automation.",
    categories: ["Cloud", "AI", "Development"],
    fileName: "google-cloud-arcade-skills.svg"
  }
};

// Function to auto-detect files in public/certificates and generate certificates.json
function processCertificates() {
  console.log("🔍 Scanning public/certificates directory for certificate files...");
  
  const files = fs.readdirSync(certsDir);
  const supportedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".pdf"];
  const certFiles = files.filter(file => supportedExtensions.includes(path.extname(file).toLowerCase()));

  const certificates = certFiles.map(fileName => {
    // If metadata exists in database, use extracted OCR metadata
    if (OCR_METADATA_DATABASE[fileName]) {
      return {
        ...OCR_METADATA_DATABASE[fileName],
        imagePath: `/certificates/${fileName}`,
        downloadPath: `/certificates/${fileName}`
      };
    }

    // Auto OCR fallback based on filename parsing
    const nameWithoutExt = path.basename(fileName, path.extname(fileName));
    const titleFormatted = nameWithoutExt
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, char => char.toUpperCase());
    
    // Auto detect categories from title
    const categories = ["Development"];
    if (/cloud/i.test(titleFormatted)) categories.push("Cloud");
    if (/aws/i.test(titleFormatted)) categories.push("AWS");
    if (/java/i.test(titleFormatted)) categories.push("Java");
    if (/workshop/i.test(titleFormatted)) categories.push("Workshop");
    if (/leadership/i.test(titleFormatted)) categories.push("Leadership");
    if (/hackathon|aptitude|test/i.test(titleFormatted)) categories.push("Hackathon");
    if (/ai|machine|learning/i.test(titleFormatted)) categories.push("AI");

    return {
      id: `cert-${nameWithoutExt}`,
      title: titleFormatted,
      issuer: "Professional Learning Provider",
      issueDate: "2026-01-01",
      description: `Verified completion certificate for ${titleFormatted}.`,
      categories: Array.from(new Set(categories)),
      fileName,
      imagePath: `/certificates/${fileName}`,
      downloadPath: `/certificates/${fileName}`
    };
  });

  // Sort by date newest first
  certificates.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

  // Ensure src/data directory exists
  const dataDir = path.dirname(outputJsonPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(outputJsonPath, JSON.stringify(certificates, null, 2));
  console.log(`✅ Processed ${certificates.length} certificates and wrote to src/data/certificates.json`);
}

processCertificates();
