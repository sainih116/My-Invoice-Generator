
export function numberToWords(num: number): string {
    if (num === 0) return 'Zero';

    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const inWords = (n: number): string => {
        let str = '';
        if (n > 99) {
            str += a[Math.floor(n / 100)] + ' Hundred ';
            n %= 100;
        }
        if (n > 19) {
            str += b[Math.floor(n / 10)] + ' ' + a[n % 10];
        } else {
            str += a[n];
        }
        return str.trim();
    };

    let result = '';
    const crore = Math.floor(num / 10000000);
    num %= 10000000;
    if (crore > 0) {
        result += inWords(crore) + ' Crore ';
    }

    const lakh = Math.floor(num / 100000);
    num %= 100000;
    if (lakh > 0) {
        result += inWords(lakh) + ' Lakh ';
    }

    const thousand = Math.floor(num / 1000);
    num %= 1000;
    if (thousand > 0) {
        result += inWords(thousand) + ' Thousand ';
    }
    
    if (num > 0) {
        result += inWords(num);
    }

    return result.trim().replace(/\s+/g, ' ') + ' Only';
}
