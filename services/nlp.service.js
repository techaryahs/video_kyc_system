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
        /my address is (.*)/i,
        /i live in (.*)/i,
        /address is (.*)/i
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
