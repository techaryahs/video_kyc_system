exports.extractUserData = (text) => {
    const lower = text.toLowerCase();

    /* ---------- PHONE ---------- */
    // Convert common speech patterns to digits
    let phoneText = text.toLowerCase()
        .replace(/double zero/g, '00')
        .replace(/triple zero/g, '000')
        .replace(/double (\w+)/g, (match, digit) => {
            const digitMap = {
                'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
                'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'zero': '0'
            };
            return digitMap[digit] ? digitMap[digit] + digitMap[digit] : match;
        })
        .replace(/triple (\w+)/g, (match, digit) => {
            const digitMap = {
                'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
                'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'zero': '0'
            };
            return digitMap[digit] ? digitMap[digit] + digitMap[digit] + digitMap[digit] : match;
        });

    // Clean text: keep only digits to join parts like "961-456-268"
    const digitsOnlyJoined = phoneText.replace(/[^0-9]/g, "");

    // Look for a 8-12 digit block in the joined string
    const phoneMatch = digitsOnlyJoined.match(/\d{8,12}/);

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
        // Replace newlines with spaces for cleaner output
        address = addrMatch[1].trim().replace(/\s+/g, ' ');
    }

    return {
        name,
        phone: phoneMatch ? phoneMatch[0] : null,
        address
    };
};
