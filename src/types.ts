// src/types/advice.ts

export type Advice = {
  id: number;
  title: string;
  content: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

export type PaginatedAdvices = {
  advices: Advice[];
  total: number;
  page: number;
  limit: number;
}

export type SignUpFormData = {
  request: {
    username: string;
    email: string;
    schoolId: string;
    regionId: string;
    name_en: string;
    name_fr: string;
    name_ar: string;
    occupation_en: string;
    occupation_fr: string;
    occupation_ar: string;
    subjects: string[];
    qualification: string;
    password: string;
    about?: string;
    nationality: string;
    gender: string;
    nid: string;
    birthDate: string;
    countryCode: string;
    number: string;
    student: {
      username: string;
      email: string;
      name_en: string;
      name_fr: string;
      name_ar: string;
      password: string;
      about?: string;
      gender: string;
      nid: string;
      birthDate: string;
      relationshipToStudent: string;
      studyLevel: string;
      eduSystemId: number;
      hasScholarship: boolean;
      language: string;
      department: string;
      subDepartment: string;
    }
  }
  parentIdPhoto: File | null;
  studentIdPhoto: File | null;
  studentProfilePhoto: File | null;
  studentCertificatesOfAchievement: File | null;
}