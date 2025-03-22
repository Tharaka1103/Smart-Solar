import mongoose, { Schema, Document } from 'mongoose';

// Document interface
export interface ProjectDocument extends Document {
  title: string;
  userName: string;
  email: string;
  contact: string;
  location: string;
  date: Date;
  systemSize: string;
  installationDate: string;
  completionDate: string;
  documents: {
    nic: {
      fileId: string;
      webViewLink: string;
    };
    proposal: {
      fileId: string;
      webViewLink: string;
    };
    lightBill: {
      fileId: string;
      webViewLink: string;
    };
    clearanceLetter: {
      fileId: string;
      webViewLink: string;
    };
    cebAgreement: {
      fileId: string;
      webViewLink: string;
    };
    cebApplication: {
      fileId: string;
      webViewLink: string;
    };
    maintenanceAgreement: {
      fileId: string;
      webViewLink: string;
    };
  };
  progress: {
    date: Date;
    status: string;
  }[];
}

// Schema
const ProjectSchema = new Schema<ProjectDocument>({
  title: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now },
  systemSize: { type: String, required: true },
  installationDate: { type: String },
  completionDate: { type: String },
  documents: {
    nic: {
      fileId: { type: String },
      webViewLink: { type: String }
    },
    proposal: {
      fileId: { type: String },
      webViewLink: { type: String }
    },
    lightBill: {
      fileId: { type: String },
      webViewLink: { type: String }
    },
    clearanceLetter: {
      fileId: { type: String },
      webViewLink: { type: String }
    },
    cebAgreement: {
      fileId: { type: String },
      webViewLink: { type: String }
    },
    cebApplication: {
      fileId: { type: String },
      webViewLink: { type: String }
    },
    maintenanceAgreement: {
      fileId: { type: String },
      webViewLink: { type: String }
    }
  },
  progress: [{
    date: { type: Date, default: Date.now },
    status: { type: String,}
  }]
});

// Create or get the model
let Project: mongoose.Model<ProjectDocument>;

try {
  // Check if the model already exists
  Project = mongoose.model<ProjectDocument>('Project');
} catch {
  // Define the model if it doesn't exist
  Project = mongoose.model<ProjectDocument>('Project', ProjectSchema);
}

export default Project;
