exports.extractUserData = (text) => {
    const lower = text.toLowerCase();

    /* ---------- PHONE ---------- */
    const digitsOnly = text.replace(/[^0-9]/g, " ");
    const phoneMatch = digitsOnly.match(/\b\d{10}\b/);

    /* ---------- NAME ---------- */
    let name = null;
    const namePatterns = [
        /my name is ([a-zA-Z ]+)/i,
        /i am ([a-zA-Z ]+)/i,
        /name is ([a-zA-Z ]+)/i
    ];

    for (const pattern of namePatterns) {
        const match = text.match(pattern);
        if (match) {
            name = match[1].trim();
            break;
        }
    }

    /* ---------- ADDRESS ---------- */
    let address = null;
    const addressPatterns = [
        // Improved: Allow letters, numbers, spaces, commas, periods, hyphens
        // Stop before keywords like "and my", "phone", or end of text
        /my address is ([a-zA-Z0-9\s,.-]+?)(?=\s*(?:and my|and|my phone|phone number|phone|for verification|$))/i,
        /i live in ([a-zA-Z0-9\s,.-]+?)(?=\s*(?:and my|and|my phone|phone number|phone|for verification|$))/i,
        /address is ([a-zA-Z0-9\s,.-]+?)(?=\s*(?:and my|and|my phone|phone number|phone|for verification|$))/i
    ];

    for (const pattern of addressPatterns) {
        const match = text.match(pattern);
        if (match) {
            address = match[1].trim();
            break;
        }
    }

    return {
        name,
        phone: phoneMatch ? phoneMatch[0] : null,
        address
    };
};
