"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, CalendarIcon, Clock, Download, FileText, Play } from "lucide-react";

export default function CourseDetails() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  // Find the course by ID
  const course = courses.find((c) => c.id === courseId);

  const [activeTab, setActiveTab] = useState(course ? "overview" : null);

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold">Course not found</h1>
        <p className="text-muted-foreground mt-2">The course you&apos;re looking for doesn&apos;t exist.</p>
        <Button className="mt-4" onClick={() => router.push("/")}>
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={activeTab || undefined} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image src={course.image || "https://placehold.co/600x400"} alt={course.title} fill className="object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button size="icon" className="h-16 w-16 rounded-full">
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">About this course</h2>
                  <p className="text-muted-foreground">{course.fullDescription}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Course Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{course.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Videos:</span>
                        <span className="font-medium">{course.videoCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Assignments:</span>
                        <span className="font-medium">{course.assignmentCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Level:</span>
                        <span className="font-medium">{course.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Students:</span>
                        <span className="font-medium">{course.studentCount}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Instructor</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder.svg" alt={course.instructor} />
                          <AvatarFallback>
                            {course.instructor
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{course.instructor}</p>
                          <p className="text-sm text-muted-foreground">{course.instructorTitle}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{course.instructorBio}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">What you&apos;ll learn</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {course.learningOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs mt-0.5">
                          ✓
                        </div>
                        <span className="text-muted-foreground">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="videos" className="mt-6 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Course Videos</h2>
                  <p className="text-muted-foreground">Watch all lectures and tutorials for this course</p>
                </div>

                <div className="space-y-4">
                  {course.modules.map((module, moduleIndex) => (
                    <div key={moduleIndex} className="space-y-2">
                      <h3 className="text-lg font-medium">
                        Module {moduleIndex + 1}: {module.title}
                      </h3>
                      <Card>
                        <CardContent className="p-0">
                          <div className="divide-y">
                            {module.videos.map((video, videoIndex) => (
                              <div key={videoIndex} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                    <Play className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{video.title}</p>
                                    <p className="text-xs text-muted-foreground">{video.duration}</p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                  {video.watched ? "Rewatch" : "Watch"}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="assignments" className="mt-6 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Course Assignments</h2>
                  <p className="text-muted-foreground">Complete and submit assignments to track your progress</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                  {course.assignments.map((assignment) => (
                    <Card key={assignment.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle>{assignment.title}</CardTitle>
                          <Badge variant={getStatusVariant(assignment.status)}>{assignment.status}</Badge>
                        </div>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span>Due {assignment.dueDate}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground">{assignment.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {assignment.timeEstimate}
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/assignments/${assignment.id}`}>
                            <FileText className="mr-2 h-3 w-3" />
                            View Details
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>Track your course completion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall completion</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Course stats</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Videos watched</p>
                      <p className="text-sm font-medium">
                        {course.videosWatched} / {course.videoCount}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Assignments completed</p>
                      <p className="text-sm font-medium">
                        {course.assignmentsCompleted} / {course.assignmentCount}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Next up</p>
                  <div className="bg-muted rounded-md p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center">
                        <Play className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{course.nextVideo.title}</p>
                        <p className="text-xs text-muted-foreground">{course.nextVideo.duration}</p>
                      </div>
                    </div>
                    <Button className="w-full mt-3" size="sm">
                      Continue Learning
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
                <CardDescription>Download course materials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {course.resources.map((resource, index) => (
                  <Button key={index} variant="outline" className="w-full justify-start" asChild>
                    <Link href="#">
                      <Download className="mr-2 h-4 w-4" />
                      {resource}
                    </Link>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusVariant(status: string) {
  switch (status) {
    case "Pending":
      return "secondary";
    case "Submitted":
      return "default";
    case "Late":
      return "destructive";
    case "Graded":
      return "outline";
    default:
      return "secondary";
  }
}

const courses = [
  {
    id: "cs101",
    title: "CS101: Introduction to Computer Science",
    description: "Learn the fundamentals of computer science, including algorithms, data structures, and programming basics.",
    fullDescription:
      "This introductory course covers the fundamental concepts of computer science. You'll learn about algorithms, data structures, and basic programming principles. The course is designed to build a solid foundation for further study in computer science and software development. Through hands-on projects and exercises, you'll develop problem-solving skills and gain experience with programming languages.",
    instructor: "Dr. Alan Turing",
    instructorTitle: "Professor of Computer Science",
    instructorBio:
      "Dr. Turing has over 15 years of experience in computer science research and education. His specialties include artificial intelligence and computational theory.",
    status: "Active",
    videoCount: 24,
    videosWatched: 10,
    assignmentCount: 8,
    assignmentsCompleted: 3,
    studentCount: 156,
    duration: "12 weeks",
    level: "Beginner",
    progress: 42,
    image: "https://placehold.co/600x400",
    learningOutcomes: [
      "Understand fundamental programming concepts",
      "Analyze and solve problems using algorithms",
      "Implement basic data structures",
      "Write and debug simple programs",
      "Understand computational complexity",
      "Apply object-oriented programming principles",
      "Develop logical thinking skills",
      "Understand the software development lifecycle",
    ],
    modules: [
      {
        title: "Introduction to Programming",
        videos: [
          { title: "What is Computer Science?", duration: "10:25", watched: true },
          { title: "History of Computing", duration: "15:30", watched: true },
          { title: "Introduction to Algorithms", duration: "12:45", watched: true },
          { title: "Problem Solving Strategies", duration: "14:20", watched: false },
        ],
      },
      {
        title: "Basic Programming Concepts",
        videos: [
          { title: "Variables and Data Types", duration: "11:15", watched: true },
          { title: "Control Structures", duration: "13:40", watched: true },
          { title: "Functions and Methods", duration: "16:55", watched: true },
          { title: "Debugging Techniques", duration: "09:30", watched: false },
        ],
      },
      {
        title: "Data Structures",
        videos: [
          { title: "Arrays and Lists", duration: "14:10", watched: true },
          { title: "Stacks and Queues", duration: "12:35", watched: true },
          { title: "Trees and Graphs", duration: "18:20", watched: false },
          { title: "Hash Tables", duration: "15:45", watched: false },
        ],
      },
    ],
    assignments: [
      {
        id: "cs101-a1",
        title: "Algorithm Analysis",
        description: "Analyze the time and space complexity of given algorithms and implement improvements.",
        dueDate: "March 15, 2025",
        timeEstimate: "4-6 hours",
        status: "Graded",
      },
      {
        id: "cs101-a2",
        title: "Data Structure Implementation",
        description: "Implement a linked list and demonstrate its operations with a practical application.",
        dueDate: "March 28, 2025",
        timeEstimate: "5-7 hours",
        status: "Submitted",
      },
      {
        id: "cs101-a3",
        title: "Sorting Algorithms",
        description: "Implement and compare the performance of different sorting algorithms on various datasets.",
        dueDate: "April 10, 2025",
        timeEstimate: "6-8 hours",
        status: "Pending",
      },
      {
        id: "cs101-a4",
        title: "Recursive Problem Solving",
        description: "Solve a set of problems using recursive algorithms and analyze their efficiency.",
        dueDate: "April 25, 2025",
        timeEstimate: "4-5 hours",
        status: "Pending",
      },
    ],
    nextVideo: {
      title: "Problem Solving Strategies",
      duration: "14:20",
    },
    resources: ["Course Syllabus.pdf", "Programming Cheatsheet.pdf", "Algorithm Complexity Guide.pdf", "Data Structures Reference.pdf"],
  },
  {
    id: "math202",
    title: "MATH202: Linear Algebra",
    description: "Study vector spaces, linear transformations, matrices, and their applications in solving systems of linear equations.",
    fullDescription:
      "This course provides a comprehensive introduction to linear algebra, covering vector spaces, linear transformations, matrices, and their applications. You'll learn how to solve systems of linear equations, compute eigenvalues and eigenvectors, and understand the geometric interpretation of linear transformations. The course emphasizes both theoretical understanding and practical applications in fields such as computer graphics, data analysis, and machine learning.",
    instructor: "Dr. Katherine Johnson",
    instructorTitle: "Professor of Mathematics",
    instructorBio:
      "Dr. Johnson is a renowned mathematician with expertise in linear algebra and its applications. She has published numerous papers on computational mathematics and has received several teaching awards.",
    status: "Active",
    videoCount: 18,
    videosWatched: 12,
    assignmentCount: 6,
    assignmentsCompleted: 4,
    studentCount: 124,
    duration: "10 weeks",
    level: "Intermediate",
    progress: 67,
    image: "https://placehold.co/600x400",
    learningOutcomes: [
      "Understand vector spaces and subspaces",
      "Perform operations with matrices and vectors",
      "Solve systems of linear equations",
      "Compute eigenvalues and eigenvectors",
      "Understand linear transformations",
      "Apply linear algebra to real-world problems",
      "Understand the geometric interpretation of linear operations",
      "Use computational tools for linear algebra",
    ],
    modules: [
      {
        title: "Vectors and Vector Spaces",
        videos: [
          { title: "Introduction to Vectors", duration: "12:15", watched: true },
          { title: "Vector Operations", duration: "14:30", watched: true },
          { title: "Vector Spaces and Subspaces", duration: "16:45", watched: true },
          { title: "Basis and Dimension", duration: "13:20", watched: true },
        ],
      },
      {
        title: "Matrices and Linear Transformations",
        videos: [
          { title: "Matrix Operations", duration: "15:10", watched: true },
          { title: "Matrix Inverses", duration: "12:40", watched: true },
          { title: "Linear Transformations", duration: "17:55", watched: true },
          { title: "Change of Basis", duration: "14:30", watched: false },
        ],
      },
      {
        title: "Eigenvalues and Applications",
        videos: [
          { title: "Determinants", duration: "11:25", watched: true },
          { title: "Eigenvalues and Eigenvectors", duration: "18:35", watched: true },
          { title: "Diagonalization", duration: "15:20", watched: false },
          { title: "Applications in Data Science", duration: "19:45", watched: false },
        ],
      },
    ],
    assignments: [
      {
        id: "math202-a1",
        title: "Vector Space Problems",
        description: "Solve problems related to vector spaces, subspaces, and linear independence.",
        dueDate: "March 12, 2025",
        timeEstimate: "3-5 hours",
        status: "Graded",
      },
      {
        id: "math202-a2",
        title: "Matrix Operations",
        description: "Perform various matrix operations and solve systems of linear equations.",
        dueDate: "March 26, 2025",
        timeEstimate: "4-6 hours",
        status: "Graded",
      },
      {
        id: "math202-a3",
        title: "Eigenvalue Problems",
        description: "Find eigenvalues and eigenvectors of matrices and apply them to practical problems.",
        dueDate: "April 9, 2025",
        timeEstimate: "5-7 hours",
        status: "Submitted",
      },
      {
        id: "math202-a4",
        title: "Linear Transformations",
        description: "Analyze and visualize linear transformations in two and three dimensions.",
        dueDate: "April 23, 2025",
        timeEstimate: "4-5 hours",
        status: "Pending",
      },
    ],
    nextVideo: {
      title: "Change of Basis",
      duration: "14:30",
    },
    resources: [
      "Linear Algebra Textbook.pdf",
      "Matrix Operations Guide.pdf",
      "Eigenvalue Computation Methods.pdf",
      "Linear Algebra in Applications.pdf",
    ],
  },
  {
    id: "eng305",
    title: "ENG305: Technical Writing",
    description: "Develop skills in writing clear, concise, and effective technical documents for various professional contexts.",
    fullDescription:
      "This course focuses on developing skills in technical writing for professional contexts. You'll learn how to create clear, concise, and effective technical documents such as reports, proposals, instructions, and documentation. The course emphasizes audience analysis, document design, clarity, and precision in writing. Through practical assignments and peer review, you'll refine your writing skills and learn to communicate complex information effectively.",
    instructor: "Prof. Jane Smith",
    instructorTitle: "Associate Professor of English",
    instructorBio:
      "Professor Smith specializes in technical and professional communication. She has worked as a technical writer in the software industry and brings practical experience to her teaching.",
    status: "Active",
    videoCount: 12,
    videosWatched: 5,
    assignmentCount: 10,
    assignmentsCompleted: 4,
    studentCount: 89,
    duration: "8 weeks",
    level: "Intermediate",
    progress: 38,
    image: "https://placehold.co/600x400",
    learningOutcomes: [
      "Write clear and concise technical documents",
      "Analyze audience needs and expectations",
      "Design effective document layouts",
      "Create comprehensive technical instructions",
      "Develop persuasive proposals",
      "Edit and revise technical content",
      "Use appropriate style and tone for technical writing",
      "Incorporate visual elements effectively",
    ],
    modules: [
      {
        title: "Principles of Technical Writing",
        videos: [
          { title: "Introduction to Technical Writing", duration: "11:20", watched: true },
          { title: "Audience Analysis", duration: "13:45", watched: true },
          { title: "Clarity and Conciseness", duration: "10:30", watched: true },
          { title: "Document Organization", duration: "12:15", watched: false },
        ],
      },
      {
        title: "Technical Document Types",
        videos: [
          { title: "Technical Reports", duration: "14:25", watched: true },
          { title: "Instruction Manuals", duration: "12:30", watched: true },
          { title: "Proposals and White Papers", duration: "15:40", watched: false },
          { title: "Documentation and User Guides", duration: "13:55", watched: false },
        ],
      },
      {
        title: "Visual Elements and Editing",
        videos: [
          { title: "Incorporating Graphics and Tables", duration: "11:15", watched: true },
          { title: "Document Design Principles", duration: "13:20", watched: false },
          { title: "Editing and Proofreading", duration: "10:45", watched: false },
          { title: "Digital Technical Communication", duration: "14:10", watched: false },
        ],
      },
    ],
    assignments: [
      {
        id: "eng305-a1",
        title: "Audience Analysis Report",
        description: "Analyze the audience for a technical document and create a detailed audience profile.",
        dueDate: "March 10, 2025",
        timeEstimate: "2-3 hours",
        status: "Graded",
      },
      {
        id: "eng305-a2",
        title: "Technical Instructions",
        description: "Create a set of clear, step-by-step instructions for a technical process.",
        dueDate: "March 20, 2025",
        timeEstimate: "3-4 hours",
        status: "Graded",
      },
      {
        id: "eng305-a3",
        title: "Technical Report",
        description: "Write a comprehensive technical report on a topic related to your field of study.",
        dueDate: "April 5, 2025",
        timeEstimate: "5-7 hours",
        status: "Submitted",
      },
      {
        id: "eng305-a4",
        title: "Proposal Writing",
        description: "Develop a persuasive proposal for a project or solution to a problem.",
        dueDate: "April 15, 2025",
        timeEstimate: "4-5 hours",
        status: "Pending",
      },
    ],
    nextVideo: {
      title: "Document Organization",
      duration: "12:15",
    },
    resources: [
      "Technical Writing Style Guide.pdf",
      "Document Design Templates.zip",
      "Visual Elements in Technical Documents.pdf",
      "Editing Checklist.pdf",
    ],
  },
  {
    id: "bio220",
    title: "BIO220: Molecular Biology",
    description: "Explore the molecular basis of biological activity, including DNA structure, replication, and protein synthesis.",
    fullDescription:
      "This course explores the molecular basis of biological activity, focusing on DNA structure, replication, transcription, and protein synthesis. You'll learn about the central dogma of molecular biology and how genetic information flows from DNA to RNA to proteins. The course covers modern techniques in molecular biology, including PCR, cloning, and gene editing. Through virtual lab simulations and case studies, you'll gain a deeper understanding of molecular processes and their applications in biotechnology and medicine.",
    instructor: "Dr. Rosalind Franklin",
    instructorTitle: "Professor of Molecular Biology",
    instructorBio:
      "Dr. Franklin is a leading researcher in molecular biology with expertise in DNA structure and function. Her research has been published in top scientific journals, and she has received grants for her work on gene regulation.",
    status: "Active",
    videoCount: 22,
    videosWatched: 14,
    assignmentCount: 7,
    assignmentsCompleted: 5,
    studentCount: 112,
    duration: "14 weeks",
    level: "Advanced",
    progress: 64,
    image: "https://placehold.co/600x400",
    learningOutcomes: [
      "Understand DNA structure and replication",
      "Explain transcription and translation processes",
      "Analyze gene expression regulation",
      "Describe modern molecular biology techniques",
      "Understand protein structure and function",
      "Apply molecular biology concepts to real-world problems",
      "Interpret experimental data in molecular biology",
      "Understand applications in biotechnology and medicine",
    ],
    modules: [
      {
        title: "DNA Structure and Replication",
        videos: [
          { title: "Introduction to Molecular Biology", duration: "15:20", watched: true },
          { title: "DNA Structure", duration: "17:45", watched: true },
          { title: "DNA Replication", duration: "19:30", watched: true },
          { title: "DNA Damage and Repair", duration: "16:15", watched: true },
        ],
      },
      {
        title: "Gene Expression",
        videos: [
          { title: "Transcription", duration: "18:25", watched: true },
          { title: "RNA Processing", duration: "14:40", watched: true },
          { title: "Translation", duration: "20:55", watched: true },
          { title: "Protein Folding and Modification", duration: "17:30", watched: false },
        ],
      },
      {
        title: "Molecular Techniques",
        videos: [
          { title: "PCR and Cloning", duration: "16:15", watched: true },
          { title: "Gel Electrophoresis", duration: "13:35", watched: true },
          { title: "DNA Sequencing", duration: "19:20", watched: false },
          { title: "CRISPR and Gene Editing", duration: "21:45", watched: false },
        ],
      },
    ],
    assignments: [
      {
        id: "bio220-a1",
        title: "DNA Replication Analysis",
        description: "Analyze the process of DNA replication and identify key enzymes and their functions.",
        dueDate: "March 8, 2025",
        timeEstimate: "4-5 hours",
        status: "Graded",
      },
      {
        id: "bio220-a2",
        title: "Transcription and Translation",
        description: "Trace the flow of genetic information from DNA to protein in a given gene sequence.",
        dueDate: "March 22, 2025",
        timeEstimate: "5-6 hours",
        status: "Graded",
      },
      {
        id: "bio220-a3",
        title: "PCR Experiment Design",
        description: "Design a PCR experiment to amplify a specific gene and analyze the results.",
        dueDate: "April 5, 2025",
        timeEstimate: "6-8 hours",
        status: "Submitted",
      },
      {
        id: "bio220-a4",
        title: "Gene Expression Analysis",
        description: "Analyze gene expression data and interpret the biological significance of the results.",
        dueDate: "April 19, 2025",
        timeEstimate: "5-7 hours",
        status: "Pending",
      },
    ],
    nextVideo: {
      title: "Protein Folding and Modification",
      duration: "17:30",
    },
    resources: [
      "Molecular Biology Textbook.pdf",
      "Laboratory Techniques Manual.pdf",
      "Gene Expression Data Analysis Guide.pdf",
      "Molecular Biology Visualization Tools.zip",
    ],
  },
];
