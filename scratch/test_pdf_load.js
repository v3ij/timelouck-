const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const run = async () => {
    try {
        const pdfPath = path.resolve(__dirname, '../Biometric_Smart_Lock,_Time_Wallet_&_Accounting_System_Cortex_pdf.pdf');
        const dataBuffer = fs.readFileSync(pdfPath);
        const parser = new pdf.PDFParse();
        await parser.load(dataBuffer);
        const text = await parser.getText();
        console.log('✅ Success! Text length:', text.length);
        console.log('Preview:', text.substring(0, 500));
    } catch (e) {
        console.error('Failed:', e);
    }
};

run();
