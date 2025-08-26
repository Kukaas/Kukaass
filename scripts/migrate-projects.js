import mongoose from 'mongoose';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env' });

// Use the same environment variable as the main app
const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ NEXT_PUBLIC_MONGODB_URI environment variable is not defined');
  console.error('Please make sure you have a .env.local file with NEXT_PUBLIC_MONGODB_URI=your_connection_string');
  process.exit(1);
}

// Project Schema (copy from your model)
const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this project.'],
    maxlength: [60, 'Title cannot be more than 60 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for this project.'],
    maxlength: [2000, 'Description cannot be more than 2000 characters'],
  },
  link: {
    type: String,
    required: [true, 'Please provide a link for this project.'],
  },
  githubLink: {
    type: String,
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  images: {
    type: [String],
    default: [],
  },
  techStack: {
    type: [String],
    default: [],
  },
  features: {
    type: [String],
    default: [],
  },
  challenges: {
    type: [String],
    default: [],
  },
  solutions: {
    type: [String],
    default: [],
  },
  purpose: {
    type: [String],
    default: [],
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  isOngoing: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: String,
  },
  role: {
    type: String,
  },
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'planned'],
    default: 'completed',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model('Project', ProjectSchema);

async function migrateProjects() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('Using connection string:', MONGODB_URI.substring(0, 20) + '...');

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Find all projects that don't have startDate field
    const projectsToUpdate = await Project.find({
      $or: [
        { startDate: { $exists: false } },
        { startDate: null },
        { endDate: { $exists: false } },
        { isOngoing: { $exists: false } }
      ]
    });

    console.log(`Found ${projectsToUpdate.length} projects to migrate...`);

    if (projectsToUpdate.length === 0) {
      console.log('✅ No projects need migration. All projects already have the required fields.');
      return;
    }

    let updatedCount = 0;
    let skippedCount = 0;

    for (const project of projectsToUpdate) {
      try {
        const updateData = {};

        // Set default startDate if missing
        if (!project.startDate) {
          // Use createdAt as startDate, or current date if createdAt is missing
          updateData.startDate = project.createdAt || new Date();
          console.log(`Setting startDate for project "${project.title}" to: ${updateData.startDate}`);
        }

        // Set default endDate if missing
        if (!project.endDate) {
          updateData.endDate = null;
        }

        // Set default isOngoing if missing
        if (project.isOngoing === undefined) {
          updateData.isOngoing = false;
        }

        // Update the project
        await Project.findByIdAndUpdate(project._id, updateData, { new: true });
        updatedCount++;
        console.log(`✅ Updated project: ${project.title}`);

      } catch (error) {
        console.error(`❌ Error updating project "${project.title}":`, error.message);
        skippedCount++;
      }
    }

    console.log('\n=== Migration Summary ===');
    console.log(`Total projects found: ${projectsToUpdate.length}`);
    console.log(`Successfully updated: ${updatedCount}`);
    console.log(`Skipped due to errors: ${skippedCount}`);
    console.log('✅ Migration completed!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
migrateProjects();
