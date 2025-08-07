# Create utility files
pdf_utils = """import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PDFGenerator {
  constructor() {
    this.doc = null;
  }

  // Generate PDF itinerary for a trip
  async generateTripPDF(trip, outputPath) {
    try {
      this.doc = new PDFDocument();
      const stream = fs.createWriteStream(outputPath);
      this.doc.pipe(stream);

      // Add title page
      this.addTitlePage(trip);
      
      // Add trip overview
      this.addTripOverview(trip);
      
      // Add daily itinerary
      this.addDailyItinerary(trip);
      
      // Add budget summary
      this.addBudgetSummary(trip);
      
      // Add general tips
      this.addGeneralTips(trip);

      // Finalize the PDF
      this.doc.end();

      return new Promise((resolve, reject) => {
        stream.on('finish', () => resolve(outputPath));
        stream.on('error', reject);
      });

    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }
  }

  addTitlePage(trip) {
    // Title
    this.doc.fontSize(24)
           .font('Helvetica-Bold')
           .text(trip.title, 50, 100, { align: 'center' });

    // Destination
    this.doc.fontSize(18)
           .font('Helvetica')
           .text(`${trip.destination.city}, ${trip.destination.country}`, 50, 150, { align: 'center' });

    // Dates
    const startDate = new Date(trip.startDate).toLocaleDateString();
    const endDate = new Date(trip.endDate).toLocaleDateString();
    this.doc.fontSize(14)
           .text(`${startDate} - ${endDate}`, 50, 180, { align: 'center' });

    // Duration
    this.doc.text(`${trip.duration} days`, 50, 200, { align: 'center' });

    // Travelers
    const travelersText = `${trip.travelers.adults} Adult${trip.travelers.adults > 1 ? 's' : ''}`;
    if (trip.travelers.children > 0) {
      travelersText += `, ${trip.travelers.children} Child${trip.travelers.children > 1 ? 'ren' : ''}`;
    }
    if (trip.travelers.infants > 0) {
      travelersText += `, ${trip.travelers.infants} Infant${trip.travelers.infants > 1 ? 's' : ''}`;
    }
    
    this.doc.text(travelersText, 50, 220, { align: 'center' });

    // Add new page
    this.doc.addPage();
  }

  addTripOverview(trip) {
    this.doc.fontSize(18)
           .font('Helvetica-Bold')
           .text('Trip Overview', 50, 50);

    let yPosition = 80;

    if (trip.description) {
      this.doc.fontSize(12)
             .font('Helvetica')
             .text('Description:', 50, yPosition)
             .text(trip.description, 50, yPosition + 20, { width: 500 });
      yPosition += 60;
    }

    // Preferences
    if (trip.preferences && trip.preferences.themes && trip.preferences.themes.length > 0) {
      this.doc.fontSize(12)
             .font('Helvetica-Bold')
             .text('Travel Themes:', 50, yPosition)
             .font('Helvetica')
             .text(trip.preferences.themes.map(theme => 
               theme.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase())
             ).join(', '), 50, yPosition + 20, { width: 500 });
      yPosition += 60;
    }

    // Budget
    if (trip.budget && trip.budget.total > 0) {
      this.doc.fontSize(12)
             .font('Helvetica-Bold')
             .text('Budget:', 50, yPosition)
             .font('Helvetica')
             .text(`${trip.budget.currency} ${trip.budget.total.toLocaleString()}`, 50, yPosition + 20);
      yPosition += 50;
    }

    this.doc.addPage();
  }

  addDailyItinerary(trip) {
    this.doc.fontSize(18)
           .font('Helvetica-Bold')
           .text('Daily Itinerary', 50, 50);

    let yPosition = 80;

    trip.itinerary.forEach((day, index) => {
      // Check if we need a new page
      if (yPosition > 650) {
        this.doc.addPage();
        yPosition = 50;
      }

      // Day header
      const dayDate = new Date(day.date).toLocaleDateString();
      this.doc.fontSize(16)
             .font('Helvetica-Bold')
             .text(`Day ${day.day} - ${dayDate}`, 50, yPosition);
      
      yPosition += 25;

      if (day.theme) {
        this.doc.fontSize(12)
               .font('Helvetica-Oblique')
               .text(`Theme: ${day.theme}`, 50, yPosition);
        yPosition += 20;
      }

      // Activities
      day.activities.forEach((activity, actIndex) => {
        // Check if we need a new page for activities
        if (yPosition > 600) {
          this.doc.addPage();
          yPosition = 50;
        }

        // Activity time and name
        const timeSlot = activity.timeSlot ? 
          `${activity.timeSlot.startTime} - ${activity.timeSlot.endTime}` : 
          'Time not specified';
          
        this.doc.fontSize(11)
               .font('Helvetica-Bold')
               .text(`${timeSlot}: ${activity.name}`, 60, yPosition);
        
        yPosition += 15;

        // Activity description
        if (activity.description) {
          this.doc.fontSize(10)
                 .font('Helvetica')
                 .text(activity.description, 70, yPosition, { width: 450 });
          yPosition += 15;
        }

        // Location
        if (activity.location && activity.location.name) {
          this.doc.fontSize(10)
                 .font('Helvetica-Oblique')
                 .text(`Location: ${activity.location.name}`, 70, yPosition);
          yPosition += 15;
        }

        // Cost
        if (activity.estimatedCost && activity.estimatedCost.max > 0) {
          const cost = activity.estimatedCost.min === activity.estimatedCost.max ?
            `${activity.estimatedCost.currency} ${activity.estimatedCost.max}` :
            `${activity.estimatedCost.currency} ${activity.estimatedCost.min} - ${activity.estimatedCost.max}`;
          
          this.doc.fontSize(10)
                 .text(`Estimated Cost: ${cost}`, 70, yPosition);
          yPosition += 15;
        }

        // Notes
        if (activity.notes) {
          this.doc.fontSize(10)
                 .font('Helvetica-Oblique')
                 .text(`Notes: ${activity.notes}`, 70, yPosition, { width: 450 });
          yPosition += 15;
        }

        yPosition += 10; // Space between activities
      });

      // Day notes
      if (day.notes) {
        this.doc.fontSize(10)
               .font('Helvetica-Oblique')
               .text(`Day Notes: ${day.notes}`, 50, yPosition, { width: 500 });
        yPosition += 25;
      }

      yPosition += 20; // Space between days
    });

    this.doc.addPage();
  }

  addBudgetSummary(trip) {
    if (!trip.budget || trip.budget.total === 0) {
      return;
    }

    this.doc.fontSize(18)
           .font('Helvetica-Bold')
           .text('Budget Summary', 50, 50);

    let yPosition = 80;

    // Total budget
    this.doc.fontSize(14)
           .font('Helvetica-Bold')
           .text(`Total Budget: ${trip.budget.currency} ${trip.budget.total.toLocaleString()}`, 50, yPosition);
    
    yPosition += 30;

    // Budget breakdown
    if (trip.budget.breakdown) {
      this.doc.fontSize(12)
             .font('Helvetica-Bold')
             .text('Budget Breakdown:', 50, yPosition);
      
      yPosition += 25;

      Object.entries(trip.budget.breakdown).forEach(([category, amount]) => {
        if (amount > 0) {
          const percentage = ((amount / trip.budget.total) * 100).toFixed(1);
          this.doc.fontSize(11)
                 .font('Helvetica')
                 .text(`${category.charAt(0).toUpperCase() + category.slice(1)}: ${trip.budget.currency} ${amount.toLocaleString()} (${percentage}%)`, 60, yPosition);
          yPosition += 20;
        }
      });
    }

    // Actual spent (if available)
    if (trip.budget.actualSpent > 0) {
      yPosition += 20;
      const remaining = trip.budget.total - trip.budget.actualSpent;
      const spentPercentage = ((trip.budget.actualSpent / trip.budget.total) * 100).toFixed(1);
      
      this.doc.fontSize(12)
             .font('Helvetica-Bold')
             .text(`Actual Spent: ${trip.budget.currency} ${trip.budget.actualSpent.toLocaleString()} (${spentPercentage}%)`, 50, yPosition);
      
      yPosition += 20;
      
      this.doc.text(`Remaining: ${trip.budget.currency} ${remaining.toLocaleString()}`, 50, yPosition);
    }
  }

  addGeneralTips(trip) {
    // This would be populated from AI service response
    const generalTips = [
      'Check visa requirements before traveling',
      'Keep copies of important documents',
      'Inform your bank about travel dates',
      'Pack according to weather forecast',
      'Research local customs and etiquette',
      'Keep emergency contacts handy'
    ];

    this.doc.fontSize(18)
           .font('Helvetica-Bold')
           .text('General Tips', 50, 50);

    let yPosition = 80;

    generalTips.forEach((tip, index) => {
      this.doc.fontSize(11)
             .font('Helvetica')
             .text(`${index + 1}. ${tip}`, 50, yPosition, { width: 500 });
      yPosition += 20;
    });
  }
}

// Export function to generate PDF
export const generateTripPDF = async (trip, filename = null) => {
  const generator = new PDFGenerator();
  const outputFileName = filename || `trip-${trip._id}-${Date.now()}.pdf`;
  const outputPath = path.join(__dirname, '..', 'uploads', outputFileName);

  // Ensure uploads directory exists
  const uploadsDir = path.dirname(outputPath);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  await generator.generateTripPDF(trip, outputPath);
  
  return {
    filePath: outputPath,
    fileName: outputFileName,
    downloadUrl: `/uploads/${outputFileName}`
  };
};

export default PDFGenerator;
"""

with open("travel-backend/utils/pdfGenerator.js", "w") as f:
    f.write(pdf_utils)

print("PDF Generator utility created successfully!")