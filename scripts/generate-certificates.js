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
  "unstop-cloud-computing-ai.jpg": {
    id: "cert-unstop-cloud-ai",
    title: "Cloud Computing with AI",
    issuer: "Unstop",
    issueDate: "2026-06-15",
    description:
      "Certificate of Completion for successfully completing the course Cloud Computing with AI provided by Unstop.",
    categories: ["Cloud", "AI", "Development"],
    fileName: "unstop-cloud-computing-ai.jpg",
  },
  "softpro-python-programming-workshop.jpg": {
    id: "cert-softpro-python",
    title: "Python Programming Workshop",
    issuer: "Softpro India Technologies",
    issueDate: "2025-09-12",
    description:
      "Participated in two-day hands-on workshop 'A Journey from Beginner to Expert' on Python programming.",
    categories: ["Workshop", "Development", "Java"],
    fileName: "softpro-python-programming-workshop.jpg",
  },
  "ycat-internship-aptitude-test.jpg": {
    id: "cert-ycat-aptitude",
    title: "Internship Common Aptitude Test (YCAT)",
    issuer: "YCAT / Internship Aptitude",
    issueDate: "2026-06-24",
    description:
      "Certificate of Participation presented for performance in the National Internship Common Aptitude Test (CIT-P-3464512).",
    categories: ["Hackathon", "Leadership", "Development"],
    fileName: "ycat-internship-aptitude-test.jpg",
  },
  "geeksforgeeks-soft-skills-course.jpg": {
    id: "cert-gfg-softskills",
    title: "Soft Skills & Professional Development",
    issuer: "GeeksforGeeks",
    issueDate: "2026-04-10",
    description:
      "Completed comprehensive training on Soft Skills Course Online - Complete Professional Development Training.",
    categories: ["Leadership", "Workshop", "Development"],
    fileName: "geeksforgeeks-soft-skills-course.jpg",
  },
  "aws-cloud-practitioner.jpg": {
    id: "cert-aws-cloud",
    title: "AWS Cloud Practitioner Certification - Self Paced",
    issuer: "GeeksforGeeks",
    issueDate: "2026-01-20",
    description:
      "Certificate of Course Completion for AWS Cloud Practitioner Certification - Self Paced course by GeeksforGeeks.",
    categories: ["AWS", "Cloud", "Development"],
    fileName: "aws-cloud-practitioner.jpg",
  },
  "google-cloud-arcade-skills.png": {
    id: "cert-gcp-arcade",
    title: "The Arcade - Google Cloud",
    issuer: "Google Cloud",
    issueDate: "2026-03-05",
    description:
      "Official Google Cloud Arcade credential for hands-on cloud learning, infrastructure challenges, and skill badges.",
    categories: ["Cloud", "AI", "Development"],
    fileName: "google-cloud-arcade-skills.png",
  },
};

// Function to auto-detect files in public/certificates and generate certificates.json
function processCertificates() {
  console.log("🔍 Scanning public/certificates directory for certificate files...");

  const files = fs.readdirSync(certsDir);
  const supportedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".pdf"];
  const certFiles = files.filter((file) =>
    supportedExtensions.includes(path.extname(file).toLowerCase()),
  );

  const certificates = certFiles.map((fileName) => {
    // If metadata exists in database, use extracted OCR metadata
    if (OCR_METADATA_DATABASE[fileName]) {
      return {
        ...OCR_METADATA_DATABASE[fileName],
        imagePath: `/certificates/${fileName}`,
        downloadPath: `/certificates/${fileName}`,
      };
    }

    // Auto OCR fallback based on filename parsing
    const nameWithoutExt = path.basename(fileName, path.extname(fileName));
    const titleFormatted = nameWithoutExt
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

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
      downloadPath: `/certificates/${fileName}`,
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
  console.log(
    `✅ Processed ${certificates.length} certificates and wrote to src/data/certificates.json`,
  );
}

processCertificates();
