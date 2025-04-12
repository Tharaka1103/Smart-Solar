'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  FileDown, 
  Loader2, 
  FileText, 
  CheckCircle2,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Gauge,
  Tag,
  AlertCircle,
  Building2,
  Sun,
  Shield,
  Award,
  Zap,
  BarChart4,
  Clipboard,
  FileSignature
} from 'lucide-react'
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ]
});

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Roboto',
  },
  header: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 5,
    borderBottom: '2px solid #0ea5e9',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 15,
  },
  companyDetails: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 10,
  },
  projectId: {
    fontSize: 12,
    color: '#0ea5e9',
    fontWeight: 500,
    padding: '5 10',
    backgroundColor: '#f0f9ff',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  section: {
    margin: 10,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 5,
    marginBottom: 15,
    borderLeft: '3px solid #0ea5e9',
  },
  companySection: {
    margin: 10,
    padding: 15,
    backgroundColor: '#f0f9ff',
    borderRadius: 5,
    marginBottom: 15,
    borderLeft: '3px solid #0ea5e9',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 10,
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#64748b',
    width: '40%',
  },
  value: {
    fontSize: 12,
    color: '#0f172a',
    width: '60%',
    fontWeight: 500,
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: 500,
    padding: '3 8',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  pendingBadge: {
    backgroundColor: '#fef9c3',
    color: '#854d0e',
  },
  approvedBadge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
  },
  completedBadge: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  progressSection: {
    margin: 10,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 5,
    borderLeft: '3px solid #0ea5e9',
  },
  progressItem: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: '1px solid #e2e8f0',
  },
  progressDate: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 3,
  },
  progressStatus: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 500,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#64748b',
    borderTop: '1px solid #e2e8f0',
    paddingTop: 10,
  },
  documentSection: {
    margin: 10,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 5,
    marginBottom: 15,
    borderLeft: '3px solid #0ea5e9',
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 5,
    borderBottom: '1px solid #e2e8f0',
  },
  documentName: {
    fontSize: 12,
    color: '#0f172a',
  },
  documentStatus: {
    fontSize: 10,
    color: '#64748b',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    fontSize: 10,
    color: '#64748b',
  },
  signature: {
    position: 'absolute',
    bottom: 100,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
    borderTop: '1px solid #94a3b8',
    paddingTop: 5,
  },
  signatureTitle: {
    fontSize: 10,
    color: '#64748b',
  },
  signatureName: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 500,
  },
  certificateImage: {
    position: 'absolute',
    bottom: 90,
    right: 60,
    width: 80,
    height: 80,
    opacity: 0.8,
  },
  iconText: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  icon: {
    width: 12,
    height: 12,
    marginRight: 5,
  },
});

interface ProjectDocuments {
  nic: { fileId: string; webViewLink: string } | null;
  proposal: { fileId: string; webViewLink: string } | null;
  lightBill: { fileId: string; webViewLink: string } | null;
  clearanceLetter: { fileId: string; webViewLink: string } | null;
  cebAgreement: { fileId: string; webViewLink: string } | null;
  cebApplication: { fileId: string; webViewLink: string } | null;
  maintenanceAgreement: { fileId: string; webViewLink: string } | null;
}

interface ProjectProgress {
  date: string | number | Date;
  status: string;
}

interface ProjectData {
  _id: string;
  projectId: string;
  title: string;
  status: 'pending' | 'approved' | 'completed';
  systemSize: string | number;
  date: string | Date;
  installationDate?: string;
  completionDate?: string;
  userName: string;
  email: string;
  contact: string;
  location: string;
  documents: ProjectDocuments;
  progress?: ProjectProgress[];
}

// PDF Document Component
const ProjectPDF: React.FC<{ project: ProjectData }> = ({ project }) => {
  // Convert documents object to a format that can be rendered in PDF
  const documentsList: Record<string, boolean> = {};
  
  if (project.documents) {
    Object.entries(project.documents).forEach(([key, value]) => {
      documentsList[key] = value !== null;
    });
  }
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>Solar Project Report</Text>
              <Text style={styles.subtitle}>Luminex Engineering (Pvt) Ltd</Text>
              <Text style={styles.projectId}>{project.projectId}</Text>
            </View>
            {/* We could include a company logo here */}
            <Text style={{ fontSize: 12, color: '#64748b' }}>
              {format(new Date(), 'MMMM dd, yyyy')}
            </Text>
          </View>
        </View>

        <View style={styles.companySection}>
          <Text style={styles.sectionTitle}>Company Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Company Name:</Text>
            <Text style={styles.value}>Luminex Engineering (Pvt) Ltd</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Business Registration:</Text>
            <Text style={styles.value}>REG12345678</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>123 Solar Avenue, Colombo 00700, Sri Lanka</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Contact:</Text>
            <Text style={styles.value}>+94 11 234 5678</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>info@luminexengineering.com</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Website:</Text>
            <Text style={styles.value}>www.luminexengineering.com</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Overview</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Project Title:</Text>
            <Text style={styles.value}>{project.title}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={{
              ...styles.statusBadge,
              ...(project.status === 'pending' ? styles.pendingBadge : 
                project.status === 'approved' ? styles.approvedBadge : styles.completedBadge)
            }}>
              {project.status.toUpperCase()}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>System Size:</Text>
            <Text style={styles.value}>{project.systemSize} kW</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Created Date:</Text>
            <Text style={styles.value}>{format(new Date(project.date), 'MMMM dd, yyyy')}</Text>
          </View>
          {project.installationDate && (
            <View style={styles.row}>
              <Text style={styles.label}>Installation Date:</Text>
              <Text style={styles.value}>{project.installationDate}</Text>
            </View>
          )}
          {project.completionDate && (
            <View style={styles.row}>
              <Text style={styles.label}>Completion Date:</Text>
              <Text style={styles.value}>{project.completionDate}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Customer Name:</Text>
            <Text style={styles.value}>{project.userName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{project.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Contact:</Text>
            <Text style={styles.value}>{project.contact}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>{project.location}</Text>
          </View>
        </View>

        <View style={styles.documentSection}>
          <Text style={styles.sectionTitle}>Project Documents</Text>
          {Object.entries(documentsList).map(([key, value]) => (
            <View key={key} style={styles.documentItem}>
              <Text style={styles.documentName}>
                {key.replace(/([A-Z])/g, ' $1').trim().charAt(0).toUpperCase() + key.replace(/([A-Z])/g, ' $1').trim().slice(1)}
              </Text>
              <Text style={styles.documentStatus}>
                {value ? 'Uploaded' : 'Not Uploaded'}
              </Text>
            </View>
          ))}
        </View>

        {project.progress && project.progress.length > 0 && (
          <View style={styles.progressSection} break>
            <Text style={styles.sectionTitle}>Project Progress</Text>
            {project.progress.map((item, index) => (
              <View key={index} style={styles.progressItem}>
                <Text style={styles.progressDate}>
                  {format(new Date(item.date), 'MMMM dd, yyyy')}
                </Text>
                <Text style={styles.progressStatus}>{item.status}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.signature}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureTitle}>Approved By</Text>
            <Text style={styles.signatureName}>Luminex Engineering</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureTitle}>Customer Signature</Text>
            <Text style={styles.signatureName}>{project.userName}</Text>
          </View>
        </View>

        {/* Digital Certificate Stamp */}
        <Image 
          src="https://cdn-icons-png.flaticon.com/512/1671/1671062.png" 
          style={styles.certificateImage} 
        />
        
        <Text style={styles.footer}>
          This document is digitally signed and certified by Luminex Engineering (Pvt) Ltd • Generated on {format(new Date(), 'MMMM dd, yyyy')}
        </Text>
        
        <Text 
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed 
        />
      </Page>
    </Document>
  );
};

interface ProjectPdfGeneratorProps {
  project: ProjectData;
}

const ProjectPdfGenerator: React.FC<ProjectPdfGeneratorProps> = ({ project }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { successt } = useToast();

  const handleGeneratePdf = () => {
    setIsGenerating(true);
    // Simulate loading for better UX
    setTimeout(() => {
      setIsGenerating(false);
      successt({
        title: "PDF Generated",
        description: "Your PDF report is ready to download",
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col">
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Project Report</h3>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {}}
                className="bg-primary hover:bg-primary/90 transition-colors"
              >
                <FileDown className="mr-2 h-4 w-4" />
                Generate PDF Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] bg-card overflow-y-auto">
                <DialogTitle>Generate PDF Report</DialogTitle>
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Sun className="h-6 w-6 text-yellow-500" />
                    <div>
                      <h2 className="text-xl font-bold">Solar Project Report</h2>
                      <p className="text-sm ">Luminex Engineering (Pvt) Ltd</p>
                    </div>
                  </div>
                  <PDFDownloadLink 
                    document={<ProjectPDF project={project} />} 
                    fileName={`${project.projectId}-report.pdf`}
                    className="inline-flex"
                  >
                    {({ loading, error }) => {
                      return (
                        <Button 
                          onClick={handleGeneratePdf}
                          disabled={loading || isGenerating}
                          className="bg-primary hover:bg-primary/90 transition-colors"
                        >
                          {loading || isGenerating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating PDF...
                            </>
                          ) : (
                            <>
                              <FileDown className="mr-2 h-4 w-4" />
                              Download PDF Report
                            </>
                          )}
                        </Button>
                      );
                    }}
                  </PDFDownloadLink>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Information Card */}
                  <div className="bg-background p-5 rounded-lg border-l-4 border-blue-500 shadow-sm">
                    <div className="flex items-center mb-4">
                      <Building2 className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="font-medium text-blue-900">Company Information</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span className="">Company Name:</span>
                        <span className="font-medium">Luminex Engineering (Pvt) Ltd</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="">Business Registration:</span>
                        <span className="font-medium">REG12345678</span>
                      </li>
                      <li className="flex items-center">
                        <MapPin className="h-4 w-4  mr-2" />
                        <span className="">123 Solar Avenue, Colombo 00700</span>
                      </li>
                      <li className="flex items-center">
                        <Phone className="h-4 w-4  mr-2" />
                        <span className="">+94 11 234 5678</span>
                      </li>
                      <li className="flex items-center">
                        <Mail className="h-4 w-4  mr-2" />
                        <span className="">info@luminexengineering.com</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Project Overview Card */}
                  <div className="bg-background p-5 rounded-lg border-l-4 border-gray-500 shadow-sm">
                    <div className="flex items-center mb-4">
                      <Clipboard className="h-5 w-5  mr-2" />
                      <h3 className="font-medium ">Project Overview</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span className="">Project ID:</span>
                        <span className="font-medium bg-primary px-2 py-1 rounded text-sm">{project.projectId}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="">Title:</span>
                        <span className="font-medium">{project.title}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="">Status:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          project.status === 'approved' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {project.status.toUpperCase()}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="">System Size:</span>
                        <span className="font-medium flex items-center">
                          <Zap className="h-4 w-4 text-yellow-500 mr-1" />
                          {project.systemSize} kW
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="">Created Date:</span>
                        <span className="font-medium">{format(new Date(project.date), 'MMM dd, yyyy')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Customer Information Card */}
                <div className="mt-6 bg-background p-5 rounded-lg border-l-4 border-green-500 shadow-sm">
                  <div className="flex items-center mb-4">
                    <User className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-medium text-green-900">Customer Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <User className="h-4 w-4  mr-2" />
                        <span className="">Name:</span>
                        <span className="font-medium ml-2">{project.userName}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4  mr-2" />
                        <span className="">Email:</span>
                        <span className="font-medium ml-2">{project.email}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4  mr-2" />
                        <span className="">Contact:</span>
                        <span className="font-medium ml-2">{project.contact}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4  mr-2" />
                        <span className="">Location:</span>
                        <span className="font-medium ml-2">{project.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Document Status */}
                <div className="mt-6 bg-background p-5 rounded-lg border-l-4 border-purple-500 shadow-sm">
                  <div className="flex items-center mb-4">
                    <FileText className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="font-medium text-purple-900">Document Status</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(project.documents || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center border-b border-gray-200 py-2">
                        <span className="">{key.replace(/([A-Z])/g, ' $1').trim().charAt(0).toUpperCase() + key.replace(/([A-Z])/g, ' $1').trim().slice(1)}</span>
                        <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {value ? 'Uploaded' : 'Not Uploaded'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Timeline */}
                {project.progress && project.progress.length > 0 && (
                  <div className="mt-6 bg-background p-5 rounded-lg border-l-4 border-orange-500 shadow-sm">
                    <div className="flex items-center mb-4">
                      <BarChart4 className="h-5 w-5 text-orange-600 mr-2" />
                      <h3 className="font-medium text-orange-900">Progress Timeline</h3>
                    </div>
                    <div className="space-y-3">
                      {project.progress.map((item, index) => (
                        <div key={index} className="flex items-start">
                          <div className="bg-orange-100 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">
                            {index + 1}
                          </div>
                          <div className="flex-1 border-l-2 border-orange-200 pl-3 pb-4">
                            <div className="text-sm ">{format(new Date(item.date), 'MMM dd, yyyy')}</div>
                            <div className="font-medium">{item.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Digital Signature Information */}
                <div className="mt-6 bg-background p-5 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <FileSignature className="h-5 w-5  mr-2" />
                    <h3 className="font-medium ">Digital Signature</h3>
                  </div>
                  <div className="mt-4 flex items-center justify-center">
                    <div className="flex space-x-4 items-center">
                      <Shield className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-sm ">This PDF document will include a digital signature certifying its authenticity. The signature represents a secure validation of this document by Luminex Engineering (Pvt) Ltd.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Download Button - Footer */}
                <div className="mt-8 flex justify-center">
                <PDFDownloadLink 
                    document={<ProjectPDF project={project} />} 
                    fileName={`${project.projectId}-report.pdf`}
                    className="inline-flex"
                  >
                    {({ loading, error }) => {
                      return (
                        <Button 
                          onClick={handleGeneratePdf}
                          disabled={loading || isGenerating}
                          size="lg"
                          className="bg-primary hover:bg-primary/90 transition-colors"
                        >
                          {loading || isGenerating ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Preparing Document...
                            </>
                          ) : (
                            <>
                              <FileDown className="mr-2 h-5 w-5" />
                              Download PDF Report
                            </>
                          )}
                        </Button>
                      );
                    }}
                  </PDFDownloadLink>
                </div>
                
                <div className="mt-4 text-xs  flex items-center justify-center">
                  <AlertCircle className="h-3 w-3 mr-1 text-blue-500" />
                  <span>The PDF will be generated client-side and won't be stored on our servers.</span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="bg-background p-4 rounded-md">
          <div className="flex items-start space-x-3 mb-3">
            <Award className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium  mb-1">Professional Project Report</h4>
              <p className="text-sm ">
                Generate a comprehensive PDF report including all the essential details of your solar project with Luminex Engineering (Pvt) Ltd.
              </p>
            </div>
          </div>
          
          <ul className="text-sm  space-y-2 ml-8 mt-4 list-none">
            <li className="flex items-center">
              <Building2 className="h-4 w-4 text-blue-500 mr-2" />
              Company profile and contact information
            </li>
            <li className="flex items-center">
              <Clipboard className="h-4 w-4 text-blue-500 mr-2" />
              Complete project details and specifications
            </li>
            <li className="flex items-center">
              <User className="h-4 w-4 text-blue-500 mr-2" />
              Customer information for reference
            </li>
            <li className="flex items-center">
              <FileText className="h-4 w-4 text-blue-500 mr-2" />
              Document tracking and status
            </li>
            <li className="flex items-center">
              <BarChart4 className="h-4 w-4 text-blue-500 mr-2" />
              Progress timeline and milestones
            </li>
            <li className="flex items-center">
              <FileSignature className="h-4 w-4 text-blue-500 mr-2" />
              Digitally signed for authenticity
            </li>
          </ul>
        </div>
        
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-sm  border-b pb-2">
            <div className="flex items-center">
              <Tag className="h-4 w-4  mr-2" />
              <span>Project ID:</span>
            </div>
            <span className="font-medium  bg-primary px-2 py-1 rounded text-sm">{project.projectId}</span>
          </div>
          <div className="flex items-center justify-between text-sm  border-b pb-2">
            <div className="flex items-center">
              <User className="h-4 w-4  mr-2" />
              <span>Customer:</span>
            </div>
            <span className="font-medium ">{project.userName}</span>
          </div>
          <div className="flex items-center justify-between text-sm  border-b pb-2">
            <div className="flex items-center">
              <Gauge className="h-4 w-4  mr-2" />
              <span>Status:</span>
            </div>
            <span className={`font-medium px-2 py-1 rounded-full text-xs ${
              project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
              project.status === 'approved' ? 'bg-blue-100 text-blue-800' : 
              'bg-green-100 text-green-800'
            }`}>
              {project.status.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm  border-b pb-2">
            <div className="flex items-center">
              <Zap className="h-4 w-4  mr-2" />
              <span>System Size:</span>
            </div>
            <span className="font-medium ">{project.systemSize} kW</span>
          </div>
        </div>
        
        <div className="mt-5 pt-4 border-t flex justify-between items-center">
          <div className="text-xs  flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            Generated on {format(new Date(), 'MMMM dd, yyyy')}
          </div>
          <div className="flex items-center">
            <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-xs text-green-600">PDF includes digital signature</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm  flex items-center">
        <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
        <span>The PDF will be generated client-side and won't be stored on our servers.</span>
      </div>
    </div>
  );
};

export default ProjectPdfGenerator;

