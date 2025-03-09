"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CalendarIcon, Clock, Download, FileText, Upload } from "lucide-react";

export default function AssignmentDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Find the assignment by ID (in a real app, this would be a data fetch)
  const assignment = assignments.find((a) => a.id === id) || assignments[0];

  const [activeTab, setActiveTab] = useState("details");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{assignment.title}</h1>
          <Badge variant={getStatusVariant(assignment.status)} className="ml-2">
            {assignment.status}
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="submission">Submission</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Details</CardTitle>
                <CardDescription>Complete information about this assignment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Due Date</p>
                    <p className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="mr-1 h-4 w-4" />
                      {assignment.dueDate}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Estimated Time</p>
                    <p className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {assignment.timeEstimate}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Description</h3>
                  <p className="text-sm text-muted-foreground">{assignment.description}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Instructions</h3>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Read all assignment requirements carefully</li>
                    <li>Complete all sections of the assignment</li>
                    <li>Submit your work before the deadline</li>
                    <li>Files should be in PDF, DOCX, or ZIP format</li>
                    <li>Maximum file size: 20MB</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Resources</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="#">
                        <Download className="mr-2 h-4 w-4" />
                        Assignment_Template.docx
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="#">
                        <Download className="mr-2 h-4 w-4" />
                        Dataset.csv
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="#">
                        <Download className="mr-2 h-4 w-4" />
                        Rubric.pdf
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submission" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Submit Your Assignment</CardTitle>
                <CardDescription>Upload your completed work here</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-10 text-center">
                  {isUploading ? (
                    <div className="space-y-4">
                      <p className="text-sm font-medium">Uploading file...</p>
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-sm font-medium">Drag and drop your file here, or click to browse</p>
                      <p className="mt-1 text-xs text-muted-foreground">Supports PDF, DOCX, ZIP (max 20MB)</p>
                    </>
                  )}
                </div>

                {assignment.status === "Submitted" && (
                  <div className="space-y-2 bg-muted p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        <span className="text-sm font-medium">Assignment_Submission.pdf</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Submitted on March 18, 2025 at 2:45 PM</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between gap-3">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleFileUpload} disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload Submission"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Instructor Feedback</CardTitle>
                <CardDescription>Review comments and grades for your submission</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignment.status === "Graded" ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Grade</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">92</span>
                        <span className="text-sm text-muted-foreground">/ 100</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Comments</h3>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Content (35/40)</p>
                          <p className="text-sm text-muted-foreground">
                            Good analysis of the topic. Your arguments are well-structured, but could use more supporting evidence in
                            section 3.
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Organization (25/25)</p>
                          <p className="text-sm text-muted-foreground">
                            Excellent organization. Your paper flows logically from introduction to conclusion.
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Citations (20/20)</p>
                          <p className="text-sm text-muted-foreground">All sources properly cited according to the required format.</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Grammar & Style (12/15)</p>
                          <p className="text-sm text-muted-foreground">
                            Generally well-written, but there are a few grammatical errors that should be addressed in future assignments.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm font-medium">Overall Feedback</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        This is a strong submission that demonstrates your understanding of the course material. Your analysis is thoughtful
                        and your conclusions are well-reasoned. For future assignments, focus on providing more supporting evidence for your
                        claims and proofread carefully for grammatical errors.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-10">
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium">No feedback available yet</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {assignment.status === "Submitted"
                        ? "Your submission is currently being reviewed"
                        : "Submit your assignment to receive feedback"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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

const assignments = [
  {
    id: "1",
    title: "Research Paper",
    description: "Submit a 5-page research paper on a topic of your choice related to the course material.",
    dueDate: "March 15, 2025",
    timeEstimate: "4-6 hours",
    status: "Pending",
  },
  {
    id: "2",
    title: "Data Analysis Project",
    description: "Analyze the provided dataset and submit your findings with visualizations.",
    dueDate: "March 20, 2025",
    timeEstimate: "3-5 hours",
    status: "Submitted",
  },
  {
    id: "3",
    title: "Group Presentation",
    description: "Prepare a 10-minute presentation with your assigned group on the given topic.",
    dueDate: "March 10, 2025",
    timeEstimate: "5-7 hours",
    status: "Late",
  },
  {
    id: "4",
    title: "Weekly Quiz",
    description: "Complete the online quiz covering material from weeks 5-6.",
    dueDate: "March 5, 2025",
    timeEstimate: "30-45 minutes",
    status: "Graded",
  },
];
