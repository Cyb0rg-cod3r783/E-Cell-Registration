const express = require("express");
const path = require("path");
const ExcelJS = require("exceljs");
const fs = require("fs");

const app = express();
const PORT = 3000;
const excelFile = "registrations.xlsx";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Function to initialize Excel file if not exists
async function initExcel() {
    if (!fs.existsSync(excelFile)) {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Participants");

        sheet.columns = [
            { header: "Name", key: "name", width: 25 },
            { header: "Email", key: "email", width: 30 },
            { header: "Phone", key: "phone", width: 20 },
            { header: "College", key: "college", width: 30 },
            { header: "Registered At", key: "registeredAt", width: 25 }
        ];

        await workbook.xlsx.writeFile(excelFile);
        console.log("✅ Excel file created");
    }
}

// Route to handle registration
app.post("/register", async (req, res) => {
    try {
        const { name, email, phone, college } = req.body;

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(excelFile);
        const sheet = workbook.getWorksheet("Participants");

        sheet.addRow({
            name,
            email,
            phone,
            college,
            registeredAt: new Date().toLocaleString()
        });

        await workbook.xlsx.writeFile(excelFile);

        res.json({ success: true, message: "🎉 Registration successful!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "⚠️ Error saving registration" });
    }
});

// Start server
app.listen(PORT, async () => {
    await initExcel();
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
