const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const extractPdf = async (pdfPath, txtPath) => {
    try {
        console.log(`Extracting: ${pdfPath}...`);
        const dataBuffer = fs.readFileSync(pdfPath);
        const parser = new PDFParse({ data: dataBuffer });
        const result = await parser.getText();
        fs.writeFileSync(txtPath, result.text, 'utf8');
        console.log(`✅ Extracted to: ${txtPath}`);
        await parser.destroy();
    } catch (error) {
        console.error(`❌ Extraction failed for ${pdfPath}:`, error);
    }
};

const run = async () => {
    const pdf1 = path.resolve(__dirname, '../Biometric_Smart_Lock,_Time_Wallet_&_Accounting_System_Cortex_pdf.pdf');
    const txt1 = path.resolve(__dirname, '../Biometric_Smart_Lock.txt');
    await extractPdf(pdf1, txt1);

    const pdf2 = path.resolve(__dirname, '../CARIBOU System requirements Specification (2) rr[Replica].pdf');
    const txt2 = path.resolve(__dirname, '../CARIBOU_System.txt');
    await extractPdf(pdf2, txt2);
};

run();
