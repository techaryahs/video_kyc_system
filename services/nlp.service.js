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
    // Capture everything until a clear new field or end of text
    let address = null;
    const addrMatch = text.match(/(?:live in|address is|from|staying at|location is)\s+([a-z0-9\s,.-]+?)(?=\s*(?:and my|my phone|phone number|for verification|\.)|$)/i);
    if (addrMatch) {
        address = addrMatch[1].trim();
    }

    return {
        name,
        phone: phoneMatch ? phoneMatch[0] : null,
        address
    };
};
