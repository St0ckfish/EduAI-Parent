import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ParentStudentsResponse, StudentsResponse, StudentsWithGradesResponse } from "~/types";
import { getStudents, getStudentsSimpleData, getStudentsWithGrades } from "../features/student";

export const useGetStudents = (
  options?: UseQueryOptions<StudentsResponse, Error>
) => {
  return useQuery<StudentsResponse, Error>({
    queryKey: ["students"], 
    queryFn: getStudents,
    ...options,
  });
};

// Hook to fetch students with grades by exam ID
export const useGetStudentsWithGrades = (
  examId: string,
  options?: UseQueryOptions<StudentsWithGradesResponse, Error>
) => {
  return useQuery<StudentsWithGradesResponse, Error>({
    queryKey: ["students-with-grades", examId],
    queryFn: () => getStudentsWithGrades(examId),
    enabled: !!examId, // Prevent query from running if examId is not provided
    ...options,
  });
};


export const useGetStudentsSimpleData = (
  options?: UseQueryOptions<ParentStudentsResponse, Error>
) => {
  return useQuery<ParentStudentsResponse, Error>({
    queryKey: ["parent-students"], // Unique key for this query
    queryFn: getStudentsSimpleData, // Function to fetch the data
    ...options,
  });
};