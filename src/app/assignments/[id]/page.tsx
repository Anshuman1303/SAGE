"use client";

import type React from "react";

import { useState, useRef, ReactElement } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, CalendarIcon, Clock, Download, FileText, Upload, X } from "lucide-react";
import { submitAssignment } from "@/app/actions/submit-assignment";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AssignmentDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find the assignment by ID (in a real app, this would be a data fetch)
  const assignment = assignments.find((a) => a.id === id) || assignments[0];

  const [activeTab, setActiveTab] = useState("details");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [comments, setComments] = useState("");
  const [submissionFeedback, setSubmissionFeedback] = useState<ReactElement | null>(null);
  const [submissionDate, setSubmissionDate] = useState<string | null>(null);
  const [submittedFileName, setSubmittedFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("No file selected", {
        description: "Please select a file to upload",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("assignmentId", id);
    formData.append("comments", comments);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      // Submit the assignment using the server action
      const result = await submitAssignment(formData);

      if (!result.success) {
        throw new Error(result.error || "Failed to submit assignment");
      }

      // Complete the progress bar
      setUploadProgress(100);

      // Update the UI with the submission details
      setSubmissionFeedback(
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question Number</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(await JSON.parse(result.data.result.response.candidates[0].content.parts[0].text)).map(
                (item: { questionNumber: string; grade: string; feedback: string }, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{item["questionNumber"]}</TableCell>
                    <TableCell>{item["grade"]}</TableCell>
                    <TableCell>{item["feedback"]}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </>
      );
      setSubmissionDate(result.data.submissionDate);
      setSubmittedFileName(result.data.fileName);

      toast("Assignment submitted", {
        description: "Your assignment has been submitted successfully",
      });

      // Reset the form
      setSelectedFile(null);
      setComments("");
    } catch (error) {
      toast.error("Submission failed", { description: error instanceof Error ? error.message : "Failed to submit assignment" });
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
    }
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
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx,.doc,.zip" />

                <div
                  className={`border-2 border-dashed rounded-lg p-10 text-center ${selectedFile ? "border-primary" : ""}`}
                  onDrop={handleFileDrop}
                  onDragOver={handleDragOver}>
                  {isUploading ? (
                    <div className="space-y-4">
                      <p className="text-sm font-medium">Uploading file...</p>
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
                    </div>
                  ) : selectedFile ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="h-8 w-8 text-primary" />
                        <span className="text-sm font-medium">{selectedFile.name}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={clearSelectedFile}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-sm font-medium">Drag and drop your file here, or click to browse</p>
                      <p className="mt-1 text-xs text-muted-foreground">Supports PDF, DOCX, ZIP (max 20MB)</p>
                      <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => fileInputRef.current?.click()}>
                        Select File
                      </Button>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comments">Comments (Optional)</Label>
                  <Textarea
                    id="comments"
                    placeholder="Add any comments or notes for your instructor"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    disabled={isUploading}
                    rows={4}
                  />
                </div>

                {submittedFileName && (
                  <div className="space-y-2 bg-muted p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        <span className="text-sm font-medium">{submittedFileName}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Submitted on {new Date(submissionDate || "").toLocaleString()}</p>
                  </div>
                )}

                {submissionFeedback && (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium">Initial AI Feedback</p>
                    <div className="text-sm text-muted-foreground mt-1">{submissionFeedback}</div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between gap-3">
                <Button variant="outline" onClick={() => setActiveTab("details")}>
                  Back to Details
                </Button>
                <Button onClick={handleFileUpload} disabled={isUploading || !selectedFile}>
                  {isUploading ? "Uploading..." : "Submit Assignment"}
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
                ) : submissionFeedback ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Submitted File</h3>
                      <Badge variant="secondary">Under Review</Badge>
                    </div>

                    <div className="space-y-2 bg-muted p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          <span className="text-sm font-medium">{submittedFileName}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Submitted on {new Date(submissionDate || "").toLocaleString()}</p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Initial AI Feedback</h3>
                      <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">{submissionFeedback}</div>
                      <p className="text-xs text-muted-foreground italic">
                        Note: This is automated feedback. Your instructor will provide detailed feedback soon.
                      </p>
                    </div>
                  </div>
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
